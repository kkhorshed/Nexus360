import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  Group as TeamIcon,
  AttachMoney as DollarIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

export interface AppLauncherProps {
  className?: string;
}

interface App {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

const apps: App[] = [
  { 
    name: 'Admin',
    url: 'http://localhost:3002/',
    icon: <AdminIcon sx={{ fontSize: '24px' }} />,
    description: 'Platform administration and user management'
  },
  { 
    name: 'CRM',
    url: 'http://localhost:3003/',
    icon: <TeamIcon sx={{ fontSize: '24px' }} />,
    description: 'Customer relationship management'
  },
  { 
    name: 'Sales Compensation',
    url: 'http://localhost:3004/',
    icon: <DollarIcon sx={{ fontSize: '24px' }} />,
    description: 'Commission and incentive tracking'
  }
];

const AppLauncher: React.FC<AppLauncherProps> = ({ className }) => {
  const theme = useTheme();

  const handleAppClick = (url: string) => {
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');
    const user = urlParams.get('user');

    // Construct new URL with auth parameters
    const newUrl = new URL(url);
    if (authToken) newUrl.searchParams.append('token', authToken);
    if (user) newUrl.searchParams.append('user', user);

    // Navigate in same tab
    window.location.href = newUrl.toString();
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {apps.map((app) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={app.name}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
              onClick={() => handleAppClick(app.url)}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: '100%',
                p: 3
              }}>
                <Box
                  sx={{
                    mb: 2,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: theme.palette.grey[100],
                    borderRadius: '50%',
                    color: theme.palette.primary.main
                  }}
                >
                  {app.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {app.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {app.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AppLauncher;
