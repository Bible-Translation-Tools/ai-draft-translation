import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Translate } from '@mui/icons-material';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  loading: boolean;
  disabled: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onTranslate,
  loading,
  disabled,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onTranslate();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        multiline
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter text to translate..."
        disabled={disabled}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1rem',
          },
        }}
      />
      <Button
        variant="contained"
        onClick={onTranslate}
        disabled={disabled || !value.trim()}
        startIcon={<Translate />}
        size="large"
        fullWidth
      >
        {loading ? 'Translating...' : 'Translate'}
      </Button>
    </Box>
  );
};

export default TextInput;
