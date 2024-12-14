import { Box, Paper, Typography, Stack } from '@mui/material';
import OpportunityCard from './OpportunityCard';
import { Opportunity } from './types';

interface KanbanColumnProps {
  title: string;
  opportunities: Opportunity[];
  columnId: string;
  color: 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary';
  onEdit: (opportunity: Opportunity) => void;
}

export default function KanbanColumn({ 
  title, 
  opportunities, 
  columnId, 
  color, 
  onEdit,
}: KanbanColumnProps): JSX.Element {
  return (
    <Paper 
      sx={{ 
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: `${color}.lighter`,
        minWidth: 300,
        transition: 'background-color 0.2s ease',
      }}
      elevation={2}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color={`${color}.darker`} sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            px: 1.5,
            py: 0.5,
            bgcolor: `${color}.main`,
            color: 'white',
            borderRadius: 1,
            fontWeight: 'medium',
            minWidth: '24px',
            textAlign: 'center',
          }}
        >
          {opportunities.length}
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100px',
          overflowY: 'auto',
          transition: 'all 0.2s ease',
          borderRadius: 1,
          px: 1,
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'grey.100',
            borderRadius: 1,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.400',
            borderRadius: 1,
          },
        }}
        role="region"
        aria-label={`${title} column`}
      >
        <Stack spacing={2} sx={{ py: 1, minHeight: '100%' }}>
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onEdit={onEdit}
              index={index}
              columnId={columnId}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
