import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import { CloudUpload, Clear, SwapHoriz } from '@mui/icons-material';
import LanguageSelector from '../components/LanguageSelector';
import { submitBatchTranslation } from '../api/translate';
import { useJobQueue, QueuedJob } from '../hooks/useJobQueue';
import JobItem from '../components/JobItem';

const BatchTranslatePage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sourceLang, setSourceLang] = useState('eng_Latn');
  const [targetLang, setTargetLang] = useState('spa_Latn');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use the custom hook for job queue management
  const {
    queuedJobs,
    addJob,
    clearCompletedJobs,
    clearAllJobs,
    hasCompletedJobs,
  } = useJobQueue();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setError(null);
  }, []);

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setError(null);
  }, [sourceLang, targetLang]);


  const handleSubmit = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('src_lang', sourceLang);
      formData.append('tgt_lang', targetLang);

      // Include subscription ID for push notifications if available
      const subscriptionId = localStorage.getItem('pushSubscriptionId');
      if (subscriptionId) {
        formData.append('subscription_id', subscriptionId);
      }

      const response = await submitBatchTranslation(formData);
      
      // Add job to queue
      const newJob: QueuedJob = {
        id: response.job_id,
        job_id: response.job_id,
        status: 'queued',
        submittedAt: new Date(),
        files: selectedFiles,
        sourceLang,
        targetLang,
        statusUrl: response.status_url,
      };

      addJob(newJob);
      
      // Clear selected files
      setSelectedFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedFiles, sourceLang, targetLang, addJob]);

  


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Batch Translation Tool
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - File Upload and Language Selection */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Upload Files
            </Typography>
            
            {/* File Upload Area */}
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
                mb: 2,
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag and drop files here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can select multiple files. Supported file types: usfm
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </Box>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files ({selectedFiles.length})
                </Typography>
                <List dense>
                  {selectedFiles.map((file, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => removeFile(index)}
                          size="small"
                        >
                          <Clear />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearFiles}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Clear All
                </Button>
              </Box>
            )}

            {/* Language Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Source Language
              </Typography>
              <LanguageSelector
                label="Source Language"
                value={sourceLang}
                onChange={setSourceLang}
                disabled={isSubmitting}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Target Language
              </Typography>
              <LanguageSelector
                label="Target Language"
                value={targetLang}
                onChange={setTargetLang}
                disabled={isSubmitting}
              />
            </Box>

            {/* Swap Languages Button */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<SwapHoriz />}
                onClick={handleSwapLanguages}
                disabled={isSubmitting}
                sx={{ minWidth: 160 }}
              >
                Swap Languages
              </Button>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedFiles.length === 0}
              fullWidth
              size="large"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Job Queue */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Translation Jobs
              </Typography>
              {queuedJobs.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearCompletedJobs}
                    disabled={!hasCompletedJobs}
                  >
                    Clear Completed
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearAllJobs}
                    color="error"
                  >
                    Clear All
                  </Button>
                </Box>
              )}
            </Box>
            
            {queuedJobs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No translation jobs yet. Upload files and submit to get started.
                </Typography>
              </Box>
            ) : (
              <List>
                {queuedJobs.map((job, index) => (
                  <React.Fragment key={job.id}>
                    <JobItem job={job} />
                    {index < queuedJobs.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BatchTranslatePage;
