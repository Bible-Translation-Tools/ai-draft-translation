import React, { useState } from 'react';
import { TextField, Box, IconButton, Tooltip, Alert } from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';

interface OutputBoxProps {
  translatedText: string;
  loading: boolean;
  error: string | null;
}

const OutputBox: React.FC<OutputBoxProps> = ({
  translatedText,
  loading,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ position: 'relative' }}>
        <TextField
          multiline
          rows={8}
          value={translatedText}
          placeholder={loading ? 'Translating...' : 'Translation will appear here'}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              '& .MuiInputBase-input': {
                color: 'text.primary',
                cursor: 'text',
              },
            },
          }}
        />
        {translatedText && (
          <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton
              onClick={handleCopy}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              {copied ? <CheckCircle color="success" /> : <ContentCopy />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default OutputBox;
