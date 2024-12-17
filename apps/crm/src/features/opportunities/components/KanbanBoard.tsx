import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { Opportunity } from '../types';
import OpportunityCard from './OpportunityCard';
import { getStageColor } from '../utils/helpers';

interface KanbanBoardProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
}

const STAGES = [
  'Qualification',
  'Needs Analysis',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
] as const;

export default function KanbanBoard({ opportunities, onEdit }: KanbanBoardProps) {
  const [draggingOpportunity, setDraggingOpportunity] = useState<Opportunity | null>(null);

  const getOpportunitiesByStage = (stage: Opportunity['stage']) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const handleDragStart = (opportunity: Opportunity) => {
    setDraggingOpportunity(opportunity);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: Opportunity['stage']) => {
    if (draggingOpportunity) {
      onEdit({ ...draggingOpportunity, stage });
      setDraggingOpportunity(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 2,
        overflowX: 'auto',
        p: 2
      }}
    >
      {STAGES.map(stage => (
        <Paper
          key={stage}
          sx={{
            p: 2,
            minHeight: '70vh',
            backgroundColor: theme => 
              theme.palette.mode === 'dark' 
                ? theme.palette.grey[900] 
                : theme.palette.grey[100]
          }}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(stage)}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color={getStageColor(stage)}>
                {stage}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({getOpportunitiesByStage(stage).length})
              </Typography>
            </Box>

            <Stack spacing={2}>
              {getOpportunitiesByStage(stage).map((opportunity, index) => (
                <Box
                  key={opportunity.id}
                  draggable
                  onDragStart={() => handleDragStart(opportunity)}
                  sx={{ cursor: 'grab' }}
                >
                  <OpportunityCard
                    opportunity={opportunity}
                    onEdit={onEdit}
                    index={index}
                    columnId={stage}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
