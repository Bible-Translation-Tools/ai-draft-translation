import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { DescriptionOutlined, Clear } from '@mui/icons-material';

type SelectedFileCardProps = {
  file: File;
  onRemove?: () => void;
};

const SelectedFileCard: React.FC<SelectedFileCardProps> = ({ file, onRemove }) => {
  return (
    <Box
      sx={{
        ...(onRemove
          ? {
              backgroundColor: '#f2f2f2',
              '&:hover': { backgroundColor: '#e8e8e8' }
            }
          : {}),
        border: '1px solid',
        borderColor: '#e6e6e6',
        borderRadius: '12px',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <DescriptionOutlined sx={{ color: '#516b86', fontSize: 32 }} />
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500, 
                  fontSize: '16px',
                  color: '#0f2f4c',
                  lineHeight: 1.2,
                  textAlign: 'left'
                }}
              >
                {file.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '12px',
                  color: '#516b86',
                  lineHeight: 1.2,
                  textAlign: 'left'
                }}
              >
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
          </Box>
          {onRemove && (
            <IconButton
              onClick={onRemove}
              size="small"
              sx={{ 
                color: '#0f2f4c',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.main',
                }
              }}
            >
              <Clear sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SelectedFileCard;


