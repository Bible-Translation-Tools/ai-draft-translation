import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export interface TranslationHistoryItem {
	id: string;
	sourceText: string;
	translatedText: string;
	sourceLang: string;
	targetLang: string;
	timestamp: Date;
}

interface TranslationHistoryProps {
	items: TranslationHistoryItem[];
	getLanguageName: (code: string) => string;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({ items, getLanguageName }) => {
	if (!items || items.length === 0) return null;

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h5" gutterBottom>
				Recent Translations
			</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{items.map((item) => (
					<Accordion key={item.id} elevation={1}>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							sx={{
								'& .MuiAccordionSummary-content': {
									alignItems: 'center',
									justifyContent: 'space-between',
								},
							}}
						>
							<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
								<Typography variant="body1" sx={{ fontWeight: 'medium' }}>
									{getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
									{item.sourceText.length > 60 
										? `${item.sourceText.substring(0, 60)}...` 
										: item.sourceText}
								</Typography>
							</Box>
							<Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
								{item.timestamp.toLocaleString()}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
								<Box>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Source Text:
									</Typography>
									<Typography variant="body2" sx={{ 
										backgroundColor: 'rgba(0, 0, 0, 0.02)', 
										p: 1, 
										borderRadius: 1,
										fontFamily: 'monospace',
										textAlign: 'left'
									}}>
										{item.sourceText}
									</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Translation:
									</Typography>
									<Typography variant="body2" sx={{ 
										backgroundColor: 'rgba(0, 0, 0, 0.02)', 
										p: 1, 
										borderRadius: 1,
										fontFamily: 'monospace',
										textAlign: 'left'
									}}>
										{item.translatedText}
									</Typography>
								</Box>
							</Box>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Box>
	);
};

export default TranslationHistory;


