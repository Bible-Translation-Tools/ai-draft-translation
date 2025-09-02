import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { availableLanguages } from '../api/translate';

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
  const selectedLanguage = availableLanguages.find(lang => lang.code === value);

  const handleChange = (_event: any, newValue: typeof availableLanguages[0] | null) => {
    if (newValue) {
      onChange(newValue.code);
    }
  };

  return (
    <Autocomplete
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
