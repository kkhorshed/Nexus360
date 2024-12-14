import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';

interface ContactCardProps {
  contact: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
  };
  onEdit: (contact: any) => void;
}

export default function ContactCard({ contact, onEdit }: ContactCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

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
        onClick={() => onEdit(contact)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <EditIcon />
      </IconButton>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {getInitials(`${contact.firstName} ${contact.lastName}`)}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {`${contact.firstName} ${contact.lastName}`}
            </Typography>
            <Chip 
              size="small" 
              label={contact.company}
              icon={<BusinessIcon />}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {contact.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {contact.phone}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
