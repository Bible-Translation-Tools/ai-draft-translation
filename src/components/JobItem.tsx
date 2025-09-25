import React from 'react';
import { Box, Typography, Button, Alert, LinearProgress } from '@mui/material';
import { Error as ErrorIcon, CheckCircle, Schedule } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { availableLanguages } from '../data/languages';
import { QueuedJob } from '../hooks/useJobQueue';
import SelectedFileCard from './SelectedFileCard';

interface JobItemProps {
  job: QueuedJob;
}

  const getLanguageName = (code: string) => {
    return availableLanguages.find((lang) => lang.code === code)?.name || code;
  };

  const downloadResult = (resultUrl: string, filenames: string[]) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_SERVER_API_ENDPOINT}${resultUrl}`;
    link.download = `translated_${filenames.join('_')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
const JobItem: React.FC<JobItemProps> = ({ job }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'processing':
        return <CircularProgress size={20} color="primary" />;
      default:
        return <Schedule color="action" />;
    }
  };

  // Progress bar based on status
  const renderProgress = () => {
    let displayText = '';
    let progressProps: any = {};
    let show = true;

    switch (job.status) {
      case 'processing':
        displayText = 'Processing...';
        progressProps = {};
        break;
      case 'queued':
        displayText = 'Queued...';
        progressProps = {};
        break;
      case 'completed':
        displayText = 'Completed';
        progressProps = { variant: 'determinate', value: 100, color: 'success' };
        break;
      default:
        show = false;
    }

    if (!show) return null;

    return (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {displayText}
        </Typography>
        <LinearProgress {...progressProps} />
      </Box>
    );
  };

  return (
    <Box className='job-item' sx={{ p: '40px', border: '1px solid', borderColor: '#e6e6e6', borderRadius: '10px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {getStatusIcon(job.status)}
          <Box flex="1 0 0">
            <Typography variant="h6" color="text.priary">
              {getLanguageName(job.sourceLang)} → {getLanguageName(job.targetLang)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Submitted: {job.submittedAt.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {renderProgress()}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
          {job.files.map((file, index) => (
            <SelectedFileCard key={index} file={file} />
          ))}
        </Box>

        {job.status === 'completed' && job.result_url && job.filenames && (
          <Box>
            <Button
              variant="contained"
              onClick={() => downloadResult(job.result_url!, job.filenames!)}
              size="small"
              fullWidth
              sx={{ p: '8px 16px' }}
            >
              Download All
            </Button>
          </Box>
        )}

        {job.status === 'failed' && job.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {job.error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default JobItem;


