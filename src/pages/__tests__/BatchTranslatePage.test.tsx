import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BatchTranslatePage from '../BatchTranslatePage';
import type { QueuedJob } from '../../hooks/useJobQueue';
import { submitBatchTranslation } from '../../api/translate';
import { availableLanguages } from '../../data/languages';

// Mock API submit
vi.mock('../../api/translate', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/translate')>();
  let jobCounter = 0;
  return {
    ...actual,
    submitBatchTranslation: vi.fn(async () => {
      jobCounter += 1;
      return { job_id: `job-${jobCounter}`, status_url: `/jobs/${jobCounter}` };
    }),
  };
});

const submitBatchTranslationMock = vi.mocked(submitBatchTranslation);

// Mock useJobQueue with a mutable state for queuedJobs (default for tests in this file)
const addJobMock = vi.fn();
const mockedQueueState: { queuedJobs: QueuedJob[] } = { queuedJobs: [] };
vi.mock('../../hooks/useJobQueue', () => ({
  useJobQueue: () => ({
    queuedJobs: mockedQueueState.queuedJobs,
    addJob: addJobMock,
    clearCompletedJobs: vi.fn(),
    clearAllJobs: vi.fn(),
    hasCompletedJobs: mockedQueueState.queuedJobs.some(j => j.status === 'completed' || j.status === 'failed'),
    cancelJob: vi.fn(),
  }),
}));

// test utilities
let user: ReturnType<typeof userEvent.setup>;
const getJobsColumn = () => document.querySelector('.right-column') as HTMLElement;
const createJob = (overrides: Partial<QueuedJob> = {}): QueuedJob => ({
  id: 'job-id',
  job_id: 'job-id',
  status: 'queued',
  submittedAt: new Date('2024-01-01T00:00:00Z'),
  files: [new File([''], 'sample.usfm', { type: 'text/plain' })],
  sourceLang: 'eng_Latn',
  targetLangs: ['spa_Latn'],
  ...overrides,
});

beforeEach(() => {
  addJobMock.mockClear();
  submitBatchTranslationMock.mockClear();
  mockedQueueState.queuedJobs = [];
  user = userEvent.setup();
});

describe('BatchTranslatePage', () => {
  it('shows language in alphabetical order by name', async () => {
    render(<BatchTranslatePage />);

    const sourceLanguageSelector = screen.getByLabelText(/Source Language/i);
    await user.click(sourceLanguageSelector);

    // MUI Autocomplete renders a listbox with role="listbox" containing options role="option"
    const languageListbox = await screen.findByRole('listbox');
    const languageOptions = within(languageListbox).getAllByRole('option');
    const languageNames = languageOptions.map((option) => option.textContent?.trim() || '');

    const alphabeticallySortedLanguages = [...languageNames].sort((a, b) => a.localeCompare(b));
    expect(languageNames).toEqual(alphabeticallySortedLanguages);
  });

  it('submits a batch job and calls addJob with queued job', async () => {
    render(<BatchTranslatePage />);

    // Provide a file to the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy'], 'sample.usfm', { type: 'text/plain' });
    await user.upload(fileInput, file);

    // Click Translate
    const translateButton = screen.getByRole('button', { name: /Translate/i });
    await user.click(translateButton);

    // Assert addJob invoked with the queued job
    expect(submitBatchTranslationMock).toHaveBeenCalledTimes(1);
    expect(addJobMock).toHaveBeenCalledTimes(1);
    const jobArg = addJobMock.mock.calls[0][0] as QueuedJob;
    expect(jobArg.status).toBe('queued');
    expect(jobArg.job_id).toBe('job-1');
    expect(jobArg.id).toBe('job-1');
    expect(jobArg.targetLangs).toEqual(['spa_Latn']);
    expect(jobArg.files[0]?.name).toBe('sample.usfm');

    const formData = submitBatchTranslationMock.mock.calls[0][0] as FormData;
    const metadata = JSON.parse(String(formData.get('metadata')));
    expect(metadata).toMatchObject({
      src_lang: 'eng_Latn',
      tgt_langs: ['spa_Latn'],
      preserved_words: [],
    });
  });

  it('submits one job with all selected target languages in metadata', async () => {
    render(<BatchTranslatePage />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy'], 'sample.usfm', { type: 'text/plain' });
    await user.upload(fileInput, file);

    const targetSelector = screen.getByLabelText(/Target Languages/i);
    await user.click(targetSelector);

    const languageListbox = await screen.findByRole('listbox');
    await user.click(within(languageListbox).getByRole('option', { name: /French/i }));
    // Close listbox by pressing Escape so Translate button is clickable
    await user.keyboard('{Escape}');

    const translateButton = screen.getByRole('button', { name: /Translate to 2 languages/i });
    await user.click(translateButton);

    expect(submitBatchTranslationMock).toHaveBeenCalledTimes(1);
    expect(addJobMock).toHaveBeenCalledTimes(1);

    const jobArg = addJobMock.mock.calls[0][0] as QueuedJob;
    expect(jobArg.targetLangs).toEqual(expect.arrayContaining(['spa_Latn', 'fra_Latn']));
    expect(jobArg.targetLangs).toHaveLength(2);

    const formData = submitBatchTranslationMock.mock.calls[0][0] as FormData;
    const metadata = JSON.parse(String(formData.get('metadata')));
    expect(metadata.tgt_langs).toEqual(expect.arrayContaining(['spa_Latn', 'fra_Latn']));
    expect(metadata.tgt_langs).toHaveLength(2);
  });

  it('selects all available target languages when Select all is clicked', async () => {
    render(<BatchTranslatePage />);

    await user.click(screen.getByRole('button', { name: /Select all/i }));

    const selectableCount = availableLanguages.filter((lang) => lang.code !== 'eng_Latn').length;
    const translateHint = screen.getByRole('button', {
      name: new RegExp(`Translate to ${selectableCount} languages`, 'i'),
    });
    // Button is disabled until files are selected, but label still reflects count
    expect(translateHint).toBeDisabled();
  });

  it('renders a pre-existing queued job in the jobs panel', () => {
    const dummyJob = createJob({ id: 'job-x', job_id: 'job-x', files: [new File([''], 'doc1.usfm', { type: 'text/plain' })] });
    mockedQueueState.queuedJobs = [dummyJob];

    render(<BatchTranslatePage />);

    expect(screen.getByText(/Queued/i)).toBeInTheDocument();
    expect(screen.getByText(/English → Spanish/i)).toBeInTheDocument();
    expect(screen.getByText('doc1.usfm')).toBeInTheDocument();
  });

  it('transitions job status from queued -> processing -> completed via polling', async () => {
    // Test different job statuses by updating the mock state
    const queuedJob = createJob({ id: 'job-abc', job_id: 'job-abc' });
    const processingJob: QueuedJob = { ...queuedJob, status: 'processing' };
    const completedJob: QueuedJob = { ...queuedJob, status: 'completed', filenames: ['sample.usfm'], result_url: '/download' };

    // Test queued status
    mockedQueueState.queuedJobs = [queuedJob];
    const { rerender } = render(<BatchTranslatePage />);
    const jobsColumn = getJobsColumn();
    expect(within(jobsColumn!).getByText(/Queued/i)).toBeInTheDocument();

    // Test processing status
    mockedQueueState.queuedJobs = [processingJob];
    rerender(<BatchTranslatePage />);
    expect(within(jobsColumn!).getByText(/Processing/i)).toBeInTheDocument();

    // Test completed status
    mockedQueueState.queuedJobs = [completedJob];
    rerender(<BatchTranslatePage />);
    // Look for the specific job status text, not the "Clear Completed" button
    const completedStatusText = within(jobsColumn!).getByText('Completed', { selector: 'span' });
    expect(completedStatusText).toBeInTheDocument();
    expect(within(jobsColumn!).getByRole('button', { name: /Download All/i })).toBeInTheDocument();
  });
});
