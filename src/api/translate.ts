import axios from 'axios';

export interface TranslationRequest {
  text: string;
  src_lang: string;
  tgt_lang: string;
}

export interface TranslationResponse {
  translated_text: string;
  src_lang: string;
  tgt_lang: string;
}

// Available languages for NLLB model
// moved to src/config/languages.ts

// Create axios instance with extended timeout for long-running requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_ENDPOINT,
  timeout: 300000, // 5 minutes timeout
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    // Convert request to FormData
    const formData = new FormData();
    formData.append('text', request.text);
    formData.append('src_lang', request.src_lang);
    formData.append('tgt_lang', request.tgt_lang);

    const response = await apiClient.post<TranslationResponse>('/translate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response) {
        throw new Error(`Translation failed: ${error.response.data?.message || error.message}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
};

// Batch translation interfaces
export interface BatchJobSubmission {
  job_id: string;
  status_url: string;
}

export interface BatchJobStatus {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  filenames?: string[];
  result_url?: string;
  error?: string;
}

export const submitBatchTranslation = async (formData: FormData): Promise<BatchJobSubmission> => {
  try {
    const response = await apiClient.post<BatchJobSubmission>('/jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Batch submission failed: ${error.response.data?.message || error.message}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getBatchJobStatus = async (statusUrl: string): Promise<BatchJobStatus> => {
  try {
    const response = await apiClient.get<BatchJobStatus>(statusUrl);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Status check failed: ${error.response.data?.message || error.message}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
};