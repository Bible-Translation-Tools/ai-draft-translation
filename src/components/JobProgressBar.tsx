import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import type { BatchJobStatus } from '../api/translate';

export interface JobProgressBarProps {
  status: BatchJobStatus['status'];
  progress_percent?: number | null;
}

const clampPercent = (n: number) => Math.min(100, Math.max(0, n));

const JobProgressBar: React.FC<JobProgressBarProps> = ({ status, progress_percent }) => {
  const pct =
    progress_percent != null && Number.isFinite(progress_percent)
      ? clampPercent(progress_percent)
      : undefined;
  const hasPct = pct !== undefined;

  if (status === 'failed') return null;

  if (status === 'completed') {
    return (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Completed
        </Typography>
        <LinearProgress variant="determinate" value={100} color="success" />
      </Box>
    );
  }

  if (status === 'queued') {
    const label = hasPct ? `Queued… ${Math.round(pct)}%` : 'Queued…';
    return (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {label}
        </Typography>
        <LinearProgress {...(hasPct ? { variant: 'determinate' as const, value: pct } : {})} />
      </Box>
    );
  }

  if (status === 'processing') {
    const label = hasPct ? `Processing… ${Math.round(pct)}%` : 'Processing…';
    return (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {label}
        </Typography>
        <LinearProgress {...(hasPct ? { variant: 'determinate' as const, value: pct } : {})} />
      </Box>
    );
  }

  return null;
};

export default JobProgressBar;
