import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  useTheme,
  alpha
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
  color?: string;
}

const apps: App[] = [
  { 
    name: 'Admin',
    url: 'http://localhost:3002/',
    icon: <AdminIcon sx={{ fontSize: '32px' }} />,
    description: 'Platform administration and user management',
    color: '#2196f3'
  },
  { 
    name: 'CRM',
    url: 'http://localhost:3003/',
    icon: <TeamIcon sx={{ fontSize: '32px' }} />,
    description: 'Customer relationship management',
    color: '#4caf50'
  },
  { 
    name: 'Sales Compensation',
    url: 'http://localhost:3004/',
    icon: <DollarIcon sx={{ fontSize: '32px' }} />,
    description: 'Commission and incentive tracking',
    color: '#f44336'
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
    <Box 
      className={className} 
      sx={{ 
        p: 4,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.default, 0.9)
          : alpha(theme.palette.background.paper, 0.9)
      }}
    >
      <Grid 
        container 
        spacing={3}
        sx={{
          maxWidth: 1200,
          margin: '0 auto',
          justifyContent: 'center'
        }}
      >
        {apps.map((app) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={app.name}
          >
            <Card
              sx={{
                height: '100%',
                background: alpha(app.color || theme.palette.primary.main, 0.03),
                border: `1px solid ${alpha(app.color || theme.palette.primary.main, 0.1)}`,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 8px 24px ${alpha(app.color || theme.palette.primary.main, 0.15)}`,
                  background: alpha(app.color || theme.palette.primary.main, 0.08),
                  '& .app-icon': {
                    transform: 'scale(1.1)',
                    background: app.color || theme.palette.primary.main,
                    color: '#fff'
                  }
                }
              }}
              onClick={() => handleAppClick(app.url)}
            >
              <CardContent 
                sx={{ 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  height: '100%'
                }}
              >
                <Box
                  className="app-icon"
                  sx={{
                    mb: 3,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    background: alpha(app.color || theme.palette.primary.main, 0.1),
                    color: app.color || theme.palette.primary.main,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {app.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {app.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6
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
