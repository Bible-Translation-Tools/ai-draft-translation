import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { availableLanguages, Language } from '../data/languages';

interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const selectedLanguage: Language | undefined = availableLanguages.find((lang: Language) => lang.code === value);

  const handleChange = (_event: any, newValue: Language | null) => {
    if (newValue) {
      onChange(newValue.code);
    }
  };

  return (
    <Autocomplete<Language, false, false, false>
      options={availableLanguages}
      getOptionLabel={(option) => option.name}
      value={selectedLanguage || null}
      onChange={handleChange}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.code}>
          {option.name}
        </li>
      )}
      isOptionEqualToValue={(option, value) => option.code === value?.code}
      fullWidth
    />
  );
};

export default LanguageSelector;
