import React, { useState, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
} from '@mui/material';
import { SwapHoriz, Clear } from '@mui/icons-material';
import LanguageSelector from '../components/LanguageSelector';
import TextInput from '../components/TextInput';
import OutputBox from '../components/OutputBox';
import TranslationHistory from '../components/TranslationHistory';
import { translateText, availableLanguages } from '../api/translate';

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Draft Translation Tool
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Input */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Source Language
            </Typography>
            <LanguageSelector
              label="Source Language"
              value={sourceLang}
              onChange={setSourceLang}
              disabled={loading}
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Input Text
              </Typography>
              <TextInput
                value={sourceText}
                onChange={setSourceText}
                onTranslate={handleTranslate}
                loading={loading}
                disabled={loading}
              />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<SwapHoriz />}
                onClick={handleSwapLanguages}
                disabled={loading}
                fullWidth
              >
                Swap Languages
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
          </Paper>
        </Grid>

        {/* Right Column - Output */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Target Language
            </Typography>
            <LanguageSelector
              label="Target Language"
              value={targetLang}
              onChange={setTargetLang}
              disabled={loading}
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Translation
              </Typography>
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
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Translation History */}
      <TranslationHistory items={translationHistory} getLanguageName={getLanguageName} />
    </Container>
  );
};

export default TranslatePage;
