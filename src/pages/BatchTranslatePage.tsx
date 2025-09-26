import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import { CloudUpload, SwapHoriz, DeleteOutline } from '@mui/icons-material';
import LanguageSelector from '../components/LanguageSelector';
import { submitBatchTranslation } from '../api/translate';
import { useJobQueue, QueuedJob } from '../hooks/useJobQueue';
import JobItem from '../components/JobItem';
import SelectedFileCard from '../components/SelectedFileCard';

const BatchTranslatePage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sourceLang, setSourceLang] = useState('eng_Latn');
  const [targetLang, setTargetLang] = useState('spa_Latn');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Use the custom hook for job queue management
  const {
    queuedJobs,
    addJob,
    clearCompletedJobs,
    clearAllJobs,
    hasCompletedJobs,
  } = useJobQueue();

  const pendingJobs = queuedJobs.filter(job => job.status !== 'completed');
  const completedJobs = queuedJobs.filter(job => job.status === 'completed');

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
    setIsDragActive(false);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
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
    <Container maxWidth="lg" disableGutters>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {/* Left Column - File Upload and Language Selection */}
        <Box className="left-column" sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              padding: '40px',
              height: 'fit-content',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-level-1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px'
            }}
          >
            {/* Language Selection */}
            <Box display="flex" flexDirection="row" alignItems="center" gap="16px">
              <Box flex="1 0 0">
                <LanguageSelector
                  label="Source Language"
                  value={sourceLang}
                  onChange={setSourceLang}
                  disabled={isSubmitting}
                />
              </Box>

              {/* Swap Languages Button */}
              <IconButton
                size="small"
                aria-label="swap languages"
                onClick={handleSwapLanguages}
                disabled={isSubmitting}
              >
                <SwapHoriz sx={{ width: 24, height: 24 }} />
              </IconButton>

              <Box flex="1 0 0">
                <LanguageSelector
                  label="Target Language"
                  value={targetLang}
                  onChange={setTargetLang}
                  disabled={isSubmitting}
                />
              </Box>
            </Box>

            {/* File Upload Area */}
            <Box
              sx={{
                display: 'flex',
                height: '350px',
                padding: '40px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                alignSelf: 'stretch',
                border: '2px dashed #E6E6E6',
                borderRadius: '16px',
                textAlign: 'center',
                borderColor: isDragActive ? 'primary.main' : undefined,
                backgroundColor: isDragActive ? 'action.hover' : undefined,
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Button
                variant="outlined"
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Choose file(s) or drag & drop it here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Files supported: USFM, DOCX
                </Typography>
              </Box>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Clear All Button */}
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutline />}
                  onClick={clearFiles}
                  size="small"
                  sx={{
                    alignSelf: 'flex-end',
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                    }
                  }}
                >
                  Clear All
                </Button>

                {/* File List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedFiles.map((file, index) => (
                    <SelectedFileCard key={index} file={file} onRemove={() => removeFile(index)} />
                  ))}
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedFiles.length === 0}
              fullWidth
              size="large"
            >
              {isSubmitting ? 'Please wait...' : 'Translate'}
            </Button>

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Right Column - Job Queue */}
        <Box className="right-column" sx={{ flex: 1, minWidth: 0 }}>
          {queuedJobs.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: '40px',
                height: '300px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-level-1)'
              }}
            >
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'center' 
                }}>
                <Typography variant="h5">
                  Translation Jobs
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You don't have any translation jobs yet.
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: '40px',  height: 'fit-content', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-level-1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
              
              <Box sx={{ display: 'flex', flexDirection:'column', gap: '16px' }}>
                {/* Completed Jobs */}
                {completedJobs.length > 0 && (
                    completedJobs.map(job => (
                      <JobItem key={job.id} job={job} />
                    ))
                )}

                {/* Active Jobs */}
                {pendingJobs.map(job => (
                  <JobItem key={job.id} job={job} />
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BatchTranslatePage;
