import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  Link,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import { CompanyCardProps } from '../types';
import { formatWebsiteUrl } from '../utils/helpers';

export default function CompanyCard({ company, onEdit }: CompanyCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pr: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              mr: 2, 
              bgcolor: 'primary.main',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                wordWrap: 'break-word',
                mr: 2,
                color: 'primary.main',
              }}
            >
              {company.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              <Tooltip title={`View all ${company.industry} companies`}>
                <Chip 
                  size="small" 
                  label={company.industry}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                />
              </Tooltip>
              <Tooltip title={`View all ${company.companyType} companies`}>
                <Chip 
                  size="small" 
                  label={company.companyType}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
          <Tooltip title="Edit company">
            <IconButton
              size="small"
              onClick={() => onEdit(company)}
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'primary.light',
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Stack spacing={1.5}>
          <Tooltip title="Visit website">
            <Link
              href={formatWebsiteUrl(company.website)}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              <LanguageIcon fontSize="small" />
              <Typography 
                variant="body2" 
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {company.website}
              </Typography>
            </Link>
          </Tooltip>

          <Tooltip title="Send email">
            <Link
              href={`mailto:${company.email}`}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              <EmailIcon fontSize="small" />
              <Typography 
                variant="body2" 
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {company.email}
              </Typography>
            </Link>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
