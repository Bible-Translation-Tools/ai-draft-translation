import React, { useMemo } from 'react';
import { Autocomplete, TextField, Checkbox, Box, Button } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { availableLanguages, Language } from '../data/languages';

type BaseProps = {
  label: string;
  disabled?: boolean;
  /** Language codes to hide from the options list (e.g. the current source language). */
  excludeCodes?: string[];
};

type SingleProps = BaseProps & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultipleProps = BaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type LanguageSelectorProps = SingleProps | MultipleProps;

const checkboxIcon = <CheckBoxOutlineBlank fontSize="small" />;
const checkboxCheckedIcon = <CheckBox fontSize="small" />;

const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const { label, disabled = false, excludeCodes = [], multiple = false } = props;

  const sortedLanguages = useMemo(
    () =>
      [...availableLanguages]
        .filter((lang) => !excludeCodes.includes(lang.code))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [excludeCodes]
  );

  if (multiple) {
    const { value, onChange } = props as MultipleProps;
    const selectedLanguages = sortedLanguages.filter((lang) => value.includes(lang.code));
    const allSelected =
      sortedLanguages.length > 0 && selectedLanguages.length === sortedLanguages.length;

    const handleChange = (_event: React.SyntheticEvent, newValue: Language[]) => {
      onChange(newValue.map((lang) => lang.code));
    };

    const handleSelectAll = () => {
      onChange(sortedLanguages.map((lang) => lang.code));
    };

    const handleClearAll = () => {
      onChange([]);
    };

    const selectionLabel =
      selectedLanguages.length === 0
        ? null
        : selectedLanguages.length === 1
          ? selectedLanguages[0].name
          : `${selectedLanguages.length} selected`;

    return (
      <Box>
        <Autocomplete<Language, true, false, false>
          multiple
          disableCloseOnSelect
          options={sortedLanguages}
          getOptionLabel={(lang) => lang.name}
          value={selectedLanguages}
          onChange={handleChange}
          disabled={disabled}
          // Keep selection state in checkboxes; don't fill the input with chips
          renderTags={() => null}
          renderOption={(optionProps, option, { selected }) => (
            <li {...optionProps} key={option.code}>
              <Checkbox
                icon={checkboxIcon}
                checkedIcon={checkboxCheckedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => {
            const typedValue = String(params.inputProps.value ?? '');
            const showSelectionLabel = Boolean(selectionLabel) && typedValue.length === 0;

            return (
              <TextField
                {...params}
                label={label}
                variant="outlined"
                placeholder={selectionLabel ? undefined : 'Select languages'}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: showSelectionLabel ? (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        mr: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        pointerEvents: 'none',
                      }}
                    >
                      {selectionLabel}
                    </Box>
                  ) : (
                    params.InputProps.startAdornment
                  ),
                }}
              />
            );
          }}
          sx={{
            '& .MuiAutocomplete-input': {
              minWidth: '0 !important',
            },
            '& .MuiAutocomplete-inputRoot': {
              flexWrap: 'nowrap',
            },
          }}
          isOptionEqualToValue={(option, selected) => option.code === selected.code}
          fullWidth
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            onClick={handleSelectAll}
            disabled={disabled || allSelected || sortedLanguages.length === 0}
            sx={{ textTransform: 'none', minWidth: 0 }}
          >
            Select all
          </Button>
          <Button
            size="small"
            onClick={handleClearAll}
            disabled={disabled || selectedLanguages.length === 0}
            sx={{ textTransform: 'none', minWidth: 0 }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    );
  }

  const { value, onChange } = props as SingleProps;
  const selectedLanguage = availableLanguages.find((lang) => lang.code === value);

  const handleChange = (_event: React.SyntheticEvent, newValue: Language | null) => {
    if (newValue) {
      onChange(newValue.code);
    }
  };

  return (
    <Autocomplete<Language, false, false, false>
      options={sortedLanguages}
      getOptionLabel={(lang) => lang.name}
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
      renderOption={(optionProps, option) => (
        <li {...optionProps} key={option.code}>
          {option.name}
        </li>
      )}
      isOptionEqualToValue={(option, selected) => option.code === selected?.code}
      fullWidth
    />
  );
};

export default LanguageSelector;
