// Available languages for NLLB model
export interface Language {
  code: string;
  name: string;
}

export const availableLanguages: Language[] = [
  { code: 'eng_Latn', name: 'English' },
  { code: 'spa_Latn', name: 'Spanish' },
  { code: 'fra_Latn', name: 'French' },
  { code: 'deu_Latn', name: 'German' },
  { code: 'ita_Latn', name: 'Italian' },
  { code: 'por_Latn', name: 'Portuguese' },
  { code: 'rus_Cyrl', name: 'Russian' },
  { code: 'jpn_Jpan', name: 'Japanese' },
  { code: 'kor_Hang', name: 'Korean' },
  { code: 'zho_Hans', name: 'Chinese (Simplified)' },
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


