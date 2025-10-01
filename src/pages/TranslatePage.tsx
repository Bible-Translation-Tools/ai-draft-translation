import React, { useState, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
  TextField,
  IconButton,
} from '@mui/material';
import { SwapHoriz, Clear } from '@mui/icons-material';
import LanguageSelector from '../components/LanguageSelector';
import OutputBox from '../components/OutputBox';
import TranslationHistory from '../components/TranslationHistory';
import { translateText } from '../api/translate';
import { availableLanguages } from '../data/languages';

interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

const TranslatePage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('eng_Latn');
  const [targetLang, setTargetLang] = useState('spa_Latn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationHistory, setTranslationHistory] = useState<TranslationHistory[]>([]);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    setLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const response = await translateText({
        text: sourceText,
        src_lang: sourceLang,
        tgt_lang: targetLang,
      });

      setTranslatedText(response.translated_text);

      // Add to history
      const newHistoryItem: TranslationHistory = {
        id: Date.now().toString(),
        sourceText,
        translatedText: response.translated_text,
        sourceLang,
        targetLang,
        timestamp: new Date(),
      };

      setTranslationHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]); // Keep last 5 items
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  }, [sourceText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText('');
    setError(null);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  const getLanguageName = (code: string) => {
    return availableLanguages.find(lang => lang.code === code)?.name || code;
  };

  return (
    <Container maxWidth="lg" disableGutters>
      <Typography variant="h4" component="h4" gutterBottom sx={{ mb: "40px" }}>Text Translation Tool</Typography>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: '16px', boxShadow: 'var(--shadow-level-1)', border: '1px solid var(--mui-palette-divider)' }}>
        {/* Language selectors row */}
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <LanguageSelector
              label="Source Language"
              value={sourceLang}
              onChange={setSourceLang}
              disabled={loading}
            />
          </Box>
          <IconButton onClick={handleSwapLanguages} disabled={loading} aria-label="Swap languages">
            <SwapHoriz />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <LanguageSelector
              label="Target Language"
              value={targetLang}
              onChange={setTargetLang}
              disabled={loading}
            />
          </Box>
        </Box>

        {/* Input and Output boxes + actions (grid ensures buttons match left column width) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            columnGap: { xs: 2, md: 7 },
            rowGap: 2,
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <TextField
              multiline
              rows={12}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text"
              disabled={loading}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            {loading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Translation in progress... This may take several minutes.
                </Typography>
              </Box>
            )}
            <OutputBox
              translatedText={translatedText}
              loading={loading}
              error={error}
              rows={12}
            />
          </Box>
          {/* Action buttons: occupy left column width on md+, full width on mobile */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / 2' }, mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              fullWidth
            >
              {loading ? 'Translating...' : 'Translate'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={loading}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Translation History */}
      <TranslationHistory items={translationHistory} getLanguageName={getLanguageName} />
    </Container>
  );
};

export default TranslatePage;
