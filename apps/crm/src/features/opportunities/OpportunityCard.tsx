import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import { Opportunity } from './types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: (opportunity: Opportunity) => void;
  index: number;
  columnId: string;
}

export default function OpportunityCard({ opportunity, onEdit, index, columnId }: OpportunityCardProps) {
  const isKanbanView = columnId !== undefined;

  const getStageColor = (stage: Opportunity['stage']): 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' => {
    switch (stage) {
      case 'Qualification':
        return 'info';
      case 'Needs Analysis':
        return 'primary';
      case 'Proposal':
        return 'secondary';
      case 'Negotiation':
        return 'warning';
      case 'Closed Won':
        return 'success';
      case 'Closed Lost':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getPriorityColor = (priority: Opportunity['priority']) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      role="article"
      aria-label={`Opportunity: ${opportunity.name}`}
    >
      <CardContent sx={{ flexGrow: 1, p: isKanbanView ? 1.5 : 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: isKanbanView ? 1 : 2,
          mb: isKanbanView ? 1 : 2 
        }}>
          {!isKanbanView && (
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              <MonetizationOnIcon />
            </Avatar>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
              <Typography 
                variant={isKanbanView ? "subtitle1" : "h6"} 
                component="div" 
                sx={{ 
                  fontWeight: isKanbanView ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  pr: 4
                }}
              >
                {opportunity.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(opportunity);
                }}
                sx={{ 
                  position: 'absolute',
                  top: isKanbanView ? 8 : 12,
                  right: isKanbanView ? 8 : 12,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                aria-label="Edit opportunity"
              >
                <EditIcon fontSize={isKanbanView ? "small" : "medium"} />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              {!isKanbanView && (
                <Chip 
                  size="small" 
                  label={opportunity.stage}
                  color={getStageColor(opportunity.stage)}
                />
              )}
              <Chip 
                size="small" 
                label={opportunity.priority}
                color={getPriorityColor(opportunity.priority)}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        <Stack spacing={isKanbanView ? 1 : 2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon color="action" fontSize="small" />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {opportunity.company}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOnIcon color="action" fontSize="small" />
            <Typography variant="h6" color="primary" sx={{ fontSize: isKanbanView ? '1rem' : '1.25rem' }}>
              {formatAmount(opportunity.amount)}
            </Typography>
          </Box>
          {!isKanbanView && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Close Date: {formatDate(opportunity.closeDate)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FlagIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Priority: {opportunity.priority}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
