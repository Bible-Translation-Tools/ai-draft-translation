import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

interface PreservedGlossaryDialogProps {
  open: boolean;
  onClose: () => void;
  preservedWords: string[];
  onAdd: (word: string) => void;
  onDelete: (index: number) => void;
  disabled?: boolean;
}

const PreservedGlossaryDialog: React.FC<PreservedGlossaryDialogProps> = ({
  open,
  onClose,
  preservedWords,
  onAdd,
  onDelete,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = useCallback(() => {
    const word = inputValue.trim();
    if (!word) return;
    onAdd(word);
    setInputValue('');
  }, [inputValue, onAdd]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Preserved Glossary</DialogTitle>
      <DialogContent dividers sx={{ minHeight: '15rem' }}>
        <Typography variant="body1" color="text.secondary">
          Add words or terms below to ensure they are not altered by the translation process.
        </Typography>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <TextField
            placeholder="Type a word or terms and press Add or Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            fullWidth
            disabled={disabled}
          />
          <Button
            variant="outlined"
            onClick={handleAdd}
            disabled={disabled || inputValue.trim() === ''}
          >
            Add
          </Button>
        </div>
        {preservedWords.length > 0 && (
          <List dense sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px', mt: 2 }}>
            {preservedWords.map((word, index) => (
              <ListItem
                key={`${word}-${index}`}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(index)} disabled={disabled}>
                    <DeleteOutline />
                  </IconButton>
                }
              >
                <ListItemText primary={word} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreservedGlossaryDialog;


