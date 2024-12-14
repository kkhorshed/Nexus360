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
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';

interface CompanyCardProps {
  company: {
    id: number;
    name: string;
    industry: string;
    companyType: string;
    website: string;
    email: string;
    phone: string;
  };
  onEdit: (company: any) => void;
}

export default function CompanyCard({ company, onEdit }: CompanyCardProps) {
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
        onClick={() => onEdit(company)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <EditIcon />
      </IconButton>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {company.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip 
                size="small" 
                label={company.industry}
              />
              <Chip 
                size="small" 
                label={company.companyType}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {company.website}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {company.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {company.phone}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
