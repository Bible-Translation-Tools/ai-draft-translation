import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BatchTranslatePage from '../BatchTranslatePage';
import type { QueuedJob } from '../../hooks/useJobQueue';

// Mock API submit
vi.mock('../../api/translate', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/translate')>();
  return {
    ...actual,
    submitBatchTranslation: vi.fn(async () => ({ job_id: 'job-123', status_url: '/jobs/123' })),
  };
});

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

beforeEach(() => {
  addJobMock.mockClear();
  mockedQueueState.queuedJobs = [];
});

describe('BatchTranslatePage', () => {
  it('shows language in alphabetical order by name', async () => {
    render(<BatchTranslatePage />);

    // Open the first language selector (Source Language)
    const sourceLanguageSelector = screen.getByLabelText(/Source Language/i);
    await userEvent.click(sourceLanguageSelector);

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
    await fireEvent.change(fileInput, { target: { files: [file] } });

    // Click Translate
    const translateButton = screen.getByRole('button', { name: /Translate/i });
    await fireEvent.click(translateButton);

    // Assert addJob invoked with the queued job
    expect(addJobMock).toHaveBeenCalledTimes(1);
    const jobArg = addJobMock.mock.calls[0][0] as QueuedJob;
    expect(jobArg.status).toBe('queued');
    expect(jobArg.job_id).toBe('job-123');
    expect(jobArg.id).toBe('job-123');
    expect(jobArg.files[0]?.name).toBe('sample.usfm');
  });

  it('renders a pre-existing queued job in the jobs panel', () => {
    const dummyJob: QueuedJob = {
      id: 'job-x',
      job_id: 'job-x',
      status: 'queued',
      submittedAt: new Date('2024-01-01T00:00:00Z'),
      files: [new File([''], 'doc1.usfm', { type: 'text/plain' })],
      sourceLang: 'eng_Latn',
      targetLang: 'spa_Latn',
    };
    mockedQueueState.queuedJobs = [dummyJob];

    render(<BatchTranslatePage />);

    expect(screen.getByText(/Queued.../i)).toBeInTheDocument();
    expect(screen.getByText(/English → Spanish/i)).toBeInTheDocument();
    expect(screen.getByText('doc1.usfm')).toBeInTheDocument();
  });

  it('transitions job status from queued -> processing -> completed via polling', async () => {
    // Test different job statuses by updating the mock state
    const queuedJob: QueuedJob = {
      id: 'job-abc',
      job_id: 'job-abc',
      status: 'queued',
      submittedAt: new Date('2024-01-01T00:00:00Z'),
      files: [new File([''], 'sample.usfm', { type: 'text/plain' })],
      sourceLang: 'eng_Latn',
      targetLang: 'spa_Latn',
    };

    const processingJob: QueuedJob = {
      ...queuedJob,
      status: 'processing',
    };

    const completedJob: QueuedJob = {
      ...queuedJob,
      status: 'completed',
      filenames: ['sample.usfm'],
      result_url: '/download',
    };

    // Test queued status
    mockedQueueState.queuedJobs = [queuedJob];
    const { rerender } = render(<BatchTranslatePage />);
    const rightColumn = document.querySelector('.right-column') as HTMLElement;
    expect(within(rightColumn!).getByText(/Queued.../i)).toBeInTheDocument();

    // Test processing status
    mockedQueueState.queuedJobs = [processingJob];
    rerender(<BatchTranslatePage />);
    expect(within(rightColumn!).getByText(/Processing.../i)).toBeInTheDocument();

    // Test completed status
    mockedQueueState.queuedJobs = [completedJob];
    rerender(<BatchTranslatePage />);
    // Look for the specific job status text, not the "Clear Completed" button
    const completedStatusText = within(rightColumn!).getByText('Completed', { selector: 'span' });
    expect(completedStatusText).toBeInTheDocument();
    expect(within(rightColumn!).getByRole('button', { name: /Download All/i })).toBeInTheDocument();
  });
});


