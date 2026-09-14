import React, { useMemo } from 'react';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { Language, getSortedLanguages } from '../data/languages';

interface LanguageSelectorBase {
  label: string;
  disabled?: boolean;
  excludeCodes?: string[];
}

interface SingleLanguageSelectorProps extends LanguageSelectorBase {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiLanguageSelectorProps extends LanguageSelectorBase {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

type LanguageSelectorProps = SingleLanguageSelectorProps | MultiLanguageSelectorProps;

const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const { label, disabled = false, excludeCodes = [] } = props;
  const excludeKey = excludeCodes.join(',');
  const sortedLanguages = useMemo(
    () => getSortedLanguages().filter((lang) => !excludeCodes.includes(lang.code)),
    [excludeKey]
  );

  const selectedCodes = props.multiple ? props.value : [props.value];
  const selectedCodeKey = selectedCodes.join(',');
  const selectedLanguages = useMemo(
    () => sortedLanguages.filter((lang) => selectedCodes.includes(lang.code)),
    [sortedLanguages, selectedCodeKey]
  );

  if (props.multiple) {
    const handleChange = (_event: unknown, newValue: Language[]) => {
      props.onChange(newValue.map((lang) => lang.code));
    };

    return (
      <Box>
        <Autocomplete<Language, true, false, false>
          multiple
          options={sortedLanguages}
          getOptionLabel={(lang) => lang.name}
          value={selectedLanguages}
          onChange={handleChange}
          disabled={disabled}
          limitTags={2}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
            />
          )}
          renderOption={(optionProps, option) => (
            <li {...optionProps} key={option.code}>
              {option.name}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.code === value?.code}
          fullWidth
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 0.5 }}>
          <Button
            size="small"
            variant="text"
            onClick={() => props.onChange(sortedLanguages.map((lang) => lang.code))}
            disabled={disabled || selectedLanguages.length === sortedLanguages.length}
            sx={{ textTransform: 'none', minWidth: 0 }}
          >
            Select all
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => props.onChange([])}
            disabled={disabled || selectedLanguages.length === 0}
            sx={{ textTransform: 'none', minWidth: 0 }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    );
  }

  const selectedLanguage = selectedLanguages[0] ?? null;

  const handleChange = (_event: unknown, newValue: Language | null) => {
    if (newValue) {
      props.onChange(newValue.code);
    }
  };

  return (
    <Autocomplete<Language, false, false, false>
      options={sortedLanguages}
      getOptionLabel={(lang) => lang.name}
      value={selectedLanguage}
      onChange={handleChange}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
        />
      )}
      renderOption={(optionProps, option) => (
        <li {...optionProps} key={option.code}>
          {option.name}
        </li>
      )}
      isOptionEqualToValue={(option, value) => option.code === value?.code}
      fullWidth
    />
  );
};

export default LanguageSelector;
