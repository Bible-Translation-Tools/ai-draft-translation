import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import JobItem from '../components/JobItem';
import { useJobQueue } from '../hooks/useJobQueue';
import { availableLanguages } from '../data/languages';

const getLanguageName = (code: string) => {
    return availableLanguages.find((lang) => lang.code === code)?.name || code;
};

interface RecentJobsPageProps {
    onBack?: () => void;
}

const RecentJobsPage: React.FC<RecentJobsPageProps> = ({ onBack }) => {
    const { queuedJobs, cancelJob } = useJobQueue();
    const [expandedId, setExpandedId] = useState<string | false>(false);

    const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedId(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="lg" disableGutters>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h4" gutterBottom sx={{ mb: "40px" }}>Recent Jobs</Typography>
                {onBack && (
                    <Button variant="outlined" onClick={onBack}>Back to Batch Translate</Button>
                )}
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
                                    {job.status !== 'completed' && (
                                        <Button variant="outlined" size="small" color="error" onClick={() => cancelJob(job.id)}>
                                            Cancel
                                        </Button>
                                    )}
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <JobItem job={job} onCancel={() => cancelJob(job.id)} />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default RecentJobsPage;
