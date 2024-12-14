import { Box } from '@mui/material';
import KanbanColumn from './KanbanColumn';
import { Opportunity } from './types';

interface KanbanBoardProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
}

const columnIdToStage = {
  'qualification': 'Qualification',
  'needs-analysis': 'Needs Analysis',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost'
} as const;

export default function KanbanBoard({ opportunities, onEdit }: KanbanBoardProps) {
  const columns = [
    { id: 'qualification', title: 'Qualification', color: 'info' as const },
    { id: 'needs-analysis', title: 'Needs Analysis', color: 'primary' as const },
    { id: 'proposal', title: 'Proposal', color: 'secondary' as const },
    { id: 'negotiation', title: 'Negotiation', color: 'warning' as const },
    { id: 'closed-won', title: 'Closed Won', color: 'success' as const },
    { id: 'closed-lost', title: 'Closed Lost', color: 'error' as const },
  ];

  const getOpportunitiesByStage = (columnId: string) => {
    const stage = columnIdToStage[columnId as keyof typeof columnIdToStage];
    return opportunities.filter(opp => opp.stage === stage);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
        height: 'calc(100vh - 200px)', // Adjust based on your layout
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'grey.100',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'grey.400',
          borderRadius: 0,
        },
      }}
    >
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          columnId={column.id}
          title={column.title}
          color={column.color}
          opportunities={getOpportunitiesByStage(column.id)}
          onEdit={onEdit}
        />
      ))}
    </Box>
  );
}
