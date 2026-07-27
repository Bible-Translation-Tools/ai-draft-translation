// Available languages for NLLB model
export interface Language {
  code: string;
  name: string;
}

export const availableLanguages: Language[] = [
  { code: 'ara_Arab', name: 'Arabic' },
  { code: 'ben_Beng', name: 'Bengali' },
  { code: 'bul_Cyrl', name: 'Bulgarian' },
  { code: 'zho_Hans', name: 'Chinese (Simplified)' },
  { code: 'hrv_Latn', name: 'Croatian' },
  { code: 'ces_Latn', name: 'Czech' },
  { code: 'dan_Latn', name: 'Danish' },
  { code: 'nld_Latn', name: 'Dutch' },
  { code: 'eng_Latn', name: 'English' },
  { code: 'fil_Latn', name: 'Filipino' },
  { code: 'fin_Latn', name: 'Finnish' },
  { code: 'fra_Latn', name: 'French' },
  { code: 'deu_Latn', name: 'German' },
  { code: 'ell_Grek', name: 'Greek' },
  { code: 'hin_Deva', name: 'Hindi' },
  { code: 'ind_Latn', name: 'Indonesian' },
  { code: 'ita_Latn', name: 'Italian' },
  { code: 'jpn_Jpan', name: 'Japanese' },
  { code: 'kor_Hang', name: 'Korean' },
  { code: 'mkd_Latn', name: 'Macedonian' },
  { code: 'mal_Latn', name: 'Malay' },
  { code: 'nor_Latn', name: 'Norwegian' },
  { code: 'pes_Arab', name: 'Persian (Farsi)' },
  { code: 'pol_Latn', name: 'Polish' },
  { code: 'por_Latn', name: 'Portuguese' },
  { code: 'rus_Cyrl', name: 'Russian' },
  { code: 'srp_Latn', name: 'Serbian' },
  { code: 'slk_Latn', name: 'Slovak' },
  { code: 'slv_Latn', name: 'Slovenian' },
  { code: 'spa_Latn', name: 'Spanish' },
  { code: 'swe_Latn', name: 'Swedish' },
  { code: 'swh_Latn', name: 'Swahili' },
  { code: 'tha_Thai', name: 'Thai' },
  { code: 'tur_Latn', name: 'Turkish' },
  { code: 'urd_Arab', name: 'Urdu'},
  { code: 'vie_Latn', name: 'Vietnamese' },
];


