import { useState, useCallback, useEffect, useRef } from 'react';
import { getBatchJobStatus, BatchJobStatus } from '../api/translate';

export interface QueuedJob extends BatchJobStatus {
  id: string;
  submittedAt: Date;
  files: File[];
  sourceLang: string;
  targetLang: string;
  statusUrl?: string;
}

interface StoredJob {
  id: string;
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  filenames?: string[];
  result_url?: string;
  error?: string;
  submittedAt: string; // ISO string for serialization
  fileNames: string[]; // Store file names instead of File objects
  fileSizes: number[]; // Store file sizes
  sourceLang: string;
  targetLang: string;
  statusUrl?: string; // Store the status URL for polling
}

// localStorage key for persisting jobs
const JOBS_STORAGE_NAME = 'batch-translation-jobs';

// Helper functions for localStorage
const saveJobsToStorage = (jobs: QueuedJob[]) => {
  const storedJobs: StoredJob[] = jobs.map(job => ({
    id: job.id,
    job_id: job.job_id,
    status: job.status,
    filenames: job.filenames,
    result_url: job.result_url,
    error: job.error,
    submittedAt: job.submittedAt.toISOString(),
    fileNames: job.files.map(file => file.name),
    fileSizes: job.files.map(file => file.size),
    sourceLang: job.sourceLang,
    targetLang: job.targetLang,
    statusUrl: job.statusUrl,
  }));
  localStorage.setItem(JOBS_STORAGE_NAME, JSON.stringify(storedJobs));
};

const loadJobsFromStorage = (): QueuedJob[] => {
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_NAME);
    if (!stored) return [];
    
    const storedJobs: StoredJob[] = JSON.parse(stored);
    return storedJobs.map(job => ({
      id: job.id,
      job_id: job.job_id,
      status: job.status,
      filenames: job.filenames,
      result_url: job.result_url,
      error: job.error,
      submittedAt: new Date(job.submittedAt),
      files: job.fileNames.map((name, index) => {
        // Create a mock File object with the stored properties
        const file = new File([''], name, { type: 'application/octet-stream' });
        Object.defineProperty(file, 'size', { value: job.fileSizes[index] });
        return file;
      }),
      sourceLang: job.sourceLang,
      targetLang: job.targetLang,
      statusUrl: job.statusUrl,
    }));
  } catch (error) {
    console.error('Error loading jobs from storage:', error);
    return [];
  }
};

export const useJobQueue = () => {
  const [queuedJobs, setQueuedJobs] = useState<QueuedJob[]>([]);
  const pollingIntervals = useRef<Map<string, number>>(new Map());

  // Load jobs from localStorage on mount
  useEffect(() => {
    const loadedJobs = loadJobsFromStorage();
    setQueuedJobs(loadedJobs);
    
    // Resume polling for active jobs
    loadedJobs.forEach(job => {
      if (job.statusUrl) {
        startPolling(job.id, job.statusUrl);
      }
    });
  }, []);

  // Save jobs to localStorage whenever queuedJobs changes
  useEffect(() => {
    if (queuedJobs.length > 0) {
      saveJobsToStorage(queuedJobs);
    }
  }, [queuedJobs]);

  // Cleanup polling intervals on unmount
  useEffect(() => {
    return () => {
      pollingIntervals.current.forEach(interval => clearInterval(interval));
    };
  }, []);

  const startPolling = useCallback((jobId: string, statusUrl: string) => {
    // Execute immediately, then set up interval
    const pollStatus = async () => {
      try {
        const status = await getBatchJobStatus(statusUrl);
        setQueuedJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, ...status, statusUrl }
            : job
        ));

        // Stop polling if job is completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          pollingIntervals.current.delete(jobId);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        // Stop polling on error
        clearInterval(interval);
        pollingIntervals.current.delete(jobId);
      }
    };

    // Run immediately
    pollStatus();
    
    // Then set up interval for subsequent polls
    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
    pollingIntervals.current.set(jobId, interval);
  }, []);

  const addJob = useCallback((job: QueuedJob) => {
    setQueuedJobs(prev => [job, ...prev]);
    if (job.statusUrl) {
      startPolling(job.id, job.statusUrl);
    }
  }, [startPolling]);

  const updateJob = useCallback((jobId: string, updates: Partial<QueuedJob>) => {
    setQueuedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  }, []);

  const clearCompletedJobs = useCallback(() => {
    setQueuedJobs(prev => {
      const filtered = prev.filter(job => job.status !== 'completed' && job.status !== 'failed');
      // Update localStorage with filtered jobs
      if (filtered.length > 0) {
        saveJobsToStorage(filtered);
      } else {
        localStorage.removeItem(JOBS_STORAGE_NAME);
      }
      return filtered;
    });
  }, []);

  const clearAllJobs = useCallback(() => {
    setQueuedJobs([]);
    localStorage.removeItem(JOBS_STORAGE_NAME);
  }, []);

  const hasCompletedJobs = queuedJobs.some(job => job.status === 'completed' || job.status === 'failed');

  return {
    queuedJobs,
    addJob,
    updateJob,
    clearCompletedJobs,
    clearAllJobs,
    hasCompletedJobs,
  };
};
