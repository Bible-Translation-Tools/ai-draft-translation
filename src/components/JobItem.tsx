import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon, CheckCircle, Schedule } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { availableLanguages } from '../data/languages';
import { QueuedJob } from '../hooks/useJobQueue';
import SelectedFileCard from './SelectedFileCard';
import JobProgressBar from './JobProgressBar';

interface JobItemProps {
  job: QueuedJob;
  onCancel?: () => void;
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

  
const JobItem: React.FC<JobItemProps> = ({ job, onCancel }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle fontSize='large' color="success" />;
      case 'failed':
        return <ErrorIcon fontSize='large' color="error" />;
      case 'processing':
        return <CircularProgress size={35} color="primary" />;
      default:
        return <Schedule fontSize='large' color="action" />;
    }
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
          {job.status !== 'completed' && (
            <Button variant="outlined" size="small" color="error" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>

        <JobProgressBar status={job.status} progress_percent={job.progress_percent} />

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


