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
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SourceIcon from '@mui/icons-material/Source';
import { Lead } from '../types';
import { getInitials, getStatusColor } from '../utils/helpers';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

export default function LeadCard({ lead, onEdit }: LeadCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <IconButton
        size="small"
        onClick={() => onEdit(lead)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <EditIcon />
      </IconButton>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {getInitials(`${lead.firstName} ${lead.lastName}`)}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {`${lead.firstName} ${lead.lastName}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip 
                size="small" 
                label={lead.status}
                color={getStatusColor(lead.status)}
              />
            </Box>
          </Box>
        </Box>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {lead.company}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {lead.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {lead.phone}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SourceIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Source: {lead.source}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
