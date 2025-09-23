import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button, Alert, LinearProgress } from '@mui/material';
import { Download, Error as ErrorIcon, CheckCircle, Schedule } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { availableLanguages } from '../data/languages';
import { QueuedJob } from '../hooks/useJobQueue';

interface JobItemProps {
  job: QueuedJob;
}

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

  const getStatusColor = (
    status: string
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
        return 'primary';
      default:
        return 'default';
    }
  };

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

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getStatusIcon(job.status)}
          <Typography variant="subtitle1" sx={{ ml: 1, flexGrow: 1 }}>
            Job #{job.id.slice(0, 8)}
          </Typography>
          <Chip label={job.status} color={getStatusColor(job.status)} size="small" />
        </Box>

        <Typography variant="h6" color="text.priary" sx={{ mb: 1 }}>
          {getLanguageName(job.sourceLang)} → {getLanguageName(job.targetLang)}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Files: {job.files.map((f) => f.name).join(', ')}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Submitted: {job.submittedAt.toLocaleString()}
        </Typography>

        {job.status === 'completed' && job.result_url && job.filenames && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => downloadResult(job.result_url!, job.filenames!)}
              size="small"
            >
              Download
            </Button>
          </Box>
        )}

        {job.status === 'failed' && job.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {job.error}
          </Alert>
        )}

        {job.status === 'processing' && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Processing... This may take several minutes.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JobItem;


