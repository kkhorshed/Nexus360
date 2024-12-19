import React from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import PageWrapper from '../../components/common/PageWrapper';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <PeopleIcon />,
      color: theme.palette.primary.main
    },
    {
      title: 'Active Sessions',
      value: '856',
      icon: <AssessmentIcon />,
      color: theme.palette.success.main
    },
    {
      title: 'Security Alerts',
      value: '12',
      icon: <SecurityIcon />,
      color: theme.palette.warning.main
    },
    {
      title: 'System Health',
      value: '98%',
      icon: <SettingsIcon />,
      color: theme.palette.info.main
    }
  ];

  return (
    <PageWrapper
      title="Dashboard"
      description="System overview and key metrics"
    >
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default Dashboard;
