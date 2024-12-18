import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  CheckCircle as ActiveIcon,
  Business as DepartmentIcon,
  Work as JobTitleIcon,
} from '@mui/icons-material';
import { User } from '../types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, tooltip }) => (
  <Tooltip title={tooltip || ''}>
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: '50%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          sx: { color, fontSize: 32 },
        })}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  </Tooltip>
);

interface DepartmentStats {
  [key: string]: number;
}

interface JobTitleStats {
  [key: string]: number;
}

interface UserStatsProps {
  users: User[];
  isLoading: boolean;
  lastSyncTime?: string;
}

export default function UserStats({ users, isLoading, lastSyncTime }: UserStatsProps) {
  const stats = useMemo(() => {
    const departmentStats: DepartmentStats = {};
    const jobTitleStats: JobTitleStats = {};
    let activeCount = 0;

    users.forEach(user => {
      // Count by department
      if (user.department) {
        departmentStats[user.department] = (departmentStats[user.department] || 0) + 1;
      }

      // Count by job title
      if (user.jobTitle) {
        jobTitleStats[user.jobTitle] = (jobTitleStats[user.jobTitle] || 0) + 1;
      }

      // Count active users
      if (user.status === 'active') {
        activeCount++;
      }
    });

    const uniqueDepartments = Object.keys(departmentStats).length;
    const uniqueJobTitles = Object.keys(jobTitleStats).length;

    return {
      total: users.length,
      active: activeCount,
      inactive: users.length - activeCount,
      departmentCount: uniqueDepartments,
      jobTitleCount: uniqueJobTitles,
      departmentStats,
      jobTitleStats,
    };
  }, [users]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={<PeopleIcon />}
          color="#2196f3"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Users"
          value={`${stats.active} (${Math.round((stats.active / stats.total) * 100)}%)`}
          icon={<ActiveIcon />}
          color="#4caf50"
          tooltip={`${stats.inactive} inactive users`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Departments"
          value={stats.departmentCount}
          icon={<DepartmentIcon />}
          color="#ff9800"
          tooltip={Object.entries(stats.departmentStats)
            .map(([dept, count]) => `${dept}: ${count} users`)
            .join('\n')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Job Titles"
          value={stats.jobTitleCount}
          icon={<JobTitleIcon />}
          color="#e91e63"
          tooltip={Object.entries(stats.jobTitleStats)
            .map(([title, count]) => `${title}: ${count} users`)
            .join('\n')}
        />
      </Grid>
    </Grid>
  );
}
