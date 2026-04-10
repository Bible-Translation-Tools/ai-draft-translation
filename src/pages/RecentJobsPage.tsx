import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    IconButton,
    Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectedFileCard from '../components/SelectedFileCard';
import { useJobQueue } from '../hooks/useJobQueue';
import { availableLanguages } from '../data/languages';
import { ArrowBack } from '@mui/icons-material';
import JobProgressBar from '../components/JobProgressBar';

const getLanguageName = (code: string) => {
    return availableLanguages.find((lang) => lang.code === code)?.name || code;
};

interface RecentJobsPageProps {
    onBack: () => void;
}

const RecentJobsPage: React.FC<RecentJobsPageProps> = ({ onBack }) => {
    const { queuedJobs, cancelJob } = useJobQueue();
    const [expandedId, setExpandedId] = useState<string | false>(false);

    const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedId(isExpanded ? panel : false);
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
        <Container maxWidth="lg" disableGutters sx={{ paddingTop: '50px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 3 }}>
                <IconButton onClick={onBack} aria-label="Back to Batch Translate">
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" component="h4" sx={{ m: 0, lineHeight: 1 }}>Recent Jobs</Typography>
            </Box>
            {queuedJobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">No recent jobs yet.</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {queuedJobs.map((job) => (
                        <Accordion key={job.id} expanded={expandedId === job.id} onChange={handleChange(job.id)} sx={{ border: '1px solid #e6e6e6', borderRadius: '10px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                                <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <Box flex="1 0 0">
                                        <Typography variant="h6" color="text.priary">
                                            {getLanguageName(job.sourceLang)} → {getLanguageName(job.targetLang)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Submitted: {job.submittedAt.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
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
                                    {job.status !== 'completed' && (
                                        <Button variant="outlined" fullWidth sx={{ p: '8px 16px' }} color="error" onClick={() => cancelJob(job.id)}>
                                            Cancel
                                        </Button>
                                    )}
                                    {job.status === 'failed' && job.error && (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            {job.error}
                                        </Alert>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default RecentJobsPage;
