import { Paper, Typography, Box, IconButton, Chip, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Opportunity } from '../types';
import { formatAmount, formatDate, getStageColor } from '../utils/helpers';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: (opportunity: Opportunity) => void;
  index: number;
  columnId: string;
}

export default function OpportunityCard({ opportunity, onEdit }: OpportunityCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonetizationOnIcon color="action" />
          <Typography variant="h6" component="div">
            {opportunity.name}
          </Typography>
        </Box>
        <Tooltip title="Edit opportunity">
          <IconButton size="small" onClick={() => onEdit(opportunity)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography color="text.secondary" variant="body2">
        {opportunity.company}
      </Typography>

      <Typography variant="h6" color="primary">
        {formatAmount(opportunity.amount)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Close Date: {formatDate(opportunity.closeDate)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Chip
          label={opportunity.stage}
          size="small"
          color={getStageColor(opportunity.stage)}
        />
        <Chip
          label={opportunity.priority}
          size="small"
          color={opportunity.priority === 'High' ? 'error' : 
                 opportunity.priority === 'Medium' ? 'warning' : 'info'}
        />
      </Box>
    </Paper>
  );
}
