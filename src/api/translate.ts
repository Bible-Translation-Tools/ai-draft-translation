import axios from 'axios';

export interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}

export interface TranslationResponse {
  translated_text: string;
  source_lang: string;
  target_lang: string;
}

// Create axios instance with extended timeout for long-running requests
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 300000, // 5 minutes timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Available languages for NLLB model
export const availableLanguages = [
  { code: 'eng_Latn', name: 'English' },
  { code: 'spa_Latn', name: 'Spanish' },
  { code: 'fra_Latn', name: 'French' },
  { code: 'deu_Latn', name: 'German' },
  { code: 'ita_Latn', name: 'Italian' },
  { code: 'por_Latn', name: 'Portuguese' },
  { code: 'rus_Cyrl', name: 'Russian' },
  { code: 'jpn_Jpan', name: 'Japanese' },
  { code: 'kor_Hang', name: 'Korean' },
  { code: 'cmn_Hans', name: 'Chinese (Simplified)' },
  { code: 'ara_Arab', name: 'Arabic' },
  { code: 'hin_Deva', name: 'Hindi' },
  { code: 'ben_Beng', name: 'Bengali' },
  { code: 'nld_Latn', name: 'Dutch' },
  { code: 'swe_Latn', name: 'Swedish' },
  { code: 'nor_Latn', name: 'Norwegian' },
  { code: 'dan_Latn', name: 'Danish' },
  { code: 'fin_Latn', name: 'Finnish' },
  { code: 'pol_Latn', name: 'Polish' },
  { code: 'tur_Latn', name: 'Turkish' },
  { code: 'vie_Latn', name: 'Vietnamese' },
  { code: 'tha_Thai', name: 'Thai' },
  { code: 'mal_Latn', name: 'Malay' },
  { code: 'ind_Latn', name: 'Indonesian' },
  { code: 'fil_Latn', name: 'Filipino' },
  { code: 'ces_Latn', name: 'Czech' },
  { code: 'slk_Latn', name: 'Slovak' },
  { code: 'slv_Latn', name: 'Slovenian' },
  { code: 'hrv_Latn', name: 'Croatian' },
  { code: 'srp_Latn', name: 'Serbian' },
  { code: 'mkd_Latn', name: 'Macedonian' },
  { code: 'bul_Cyrl', name: 'Bulgarian' },
  { code: 'ell_Grek', name: 'Greek' },
];

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    const response = await apiClient.post<TranslationResponse>('/translate', request);
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
