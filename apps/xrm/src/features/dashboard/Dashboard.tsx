import React from 'react';
import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material';
import {
  People as ContactsIcon,
  Business as CompaniesIcon,
  Inventory as ProductsIcon,
  TrendingUp as LeadsIcon,
  BusinessCenter as OpportunitiesIcon,
  AttachMoney as RevenueIcon,
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
    elevation={2}
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
      title: 'Total Companies',
      value: '45',
      icon: <CompaniesIcon />,
      color: '#673ab7',
    },
    {
      title: 'Total Contacts',
      value: '1,234',
      icon: <ContactsIcon />,
      color: '#2196f3',
    },
    {
      title: 'Active Products',
      value: '24',
      icon: <ProductsIcon />,
      color: '#009688',
    },
    {
      title: 'Active Leads',
      value: '456',
      icon: <LeadsIcon />,
      color: '#4caf50',
    },
    {
      title: 'Open Opportunities',
      value: '89',
      icon: <OpportunitiesIcon />,
      color: '#ff9800',
    },
    {
      title: 'Revenue (MTD)',
      value: '$123.4K',
      icon: <RevenueIcon />,
      color: '#f44336',
    },
  ];

  const salesProgress = [
    { stage: 'Prospecting', value: 45, color: '#2196f3' },
    { stage: 'Qualification', value: 65, color: '#4caf50' },
    { stage: 'Proposal', value: 30, color: '#ff9800' },
    { stage: 'Negotiation', value: 20, color: '#f44336' },
  ];

  const recentActivities = [
    { time: '2 hours ago', text: 'New lead assigned to John Doe' },
    { time: '4 hours ago', text: 'Meeting scheduled with Tech Corp' },
    { time: '5 hours ago', text: 'Proposal sent to Digital Solutions' },
    { time: '1 day ago', text: 'Contract signed with Innovate LLC' },
  ];

  return (
    <PageWrapper 
      title="Dashboard" 
      description="Overview of your business metrics and activities"
    >
      <PageSection>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={stat.title === 'Revenue (MTD)' ? 12 : 4} 
              key={stat.title}
            >
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection title="Sales Pipeline">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              {salesProgress.map((stage) => (
                <Box key={stage.stage} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{stage.stage}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stage.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stage.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${stage.color}15`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stage.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection title="Recent Activities">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              {recentActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 2,
                    borderBottom: index < recentActivities.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body1">
                    {activity.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </PageSection>
    </PageWrapper>
  );
}
