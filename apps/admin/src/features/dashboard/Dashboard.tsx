import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as UsersIcon,
  Security as RolesIcon,
  Assessment as AuditIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      bgcolor: 'background.paper',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        backgroundColor: color,
      },
    }}
  >
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
      }}
    >
      <Box sx={{ color }}>{icon}</Box>
    </Box>
    <Box>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Paper>
);

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '156',
      icon: <UsersIcon />,
      color: '#2196f3'
    },
    {
      title: 'Active Roles',
      value: '12',
      icon: <RolesIcon />,
      color: '#4caf50'
    },
    {
      title: 'Audit Logs',
      value: '1,234',
      icon: <AuditIcon />,
      color: '#ff9800'
    },
    {
      title: 'System Settings',
      value: '8',
      icon: <SettingsIcon />,
      color: '#9c27b0'
    }
  ];

  return (
    <PageWrapper 
      title="Admin Dashboard" 
      description="Overview of system administration metrics"
    >
      <PageSection>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection title="Recent Activity">
        <Typography variant="body1" color="text.secondary">
          No recent activity to display.
        </Typography>
      </PageSection>

      <PageSection title="System Status">
        <Typography variant="body1" color="text.secondary">
          All systems operational.
        </Typography>
      </PageSection>
    </PageWrapper>
  );
}
