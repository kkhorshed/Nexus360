import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { useMessage } from '../contexts/MessageContext';

interface DashboardData {
  stats: {
    users: number;
    tasks: number;
    projects: number;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      users: 0,
      tasks: 0,
      projects: 0
    }
  });
  const theme = useTheme();
  const message = useMessage();
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      try {
        // Simulated API call
        const mockData = {
          stats: {
            users: 150,
            tasks: 324,
            projects: 25
          }
        };
        setData(mockData);
      } catch (error) {
        message.error('Failed to load dashboard data');
        console.error('Dashboard initialization error:', error);
      }
    };

    init();
  }, [message]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">
                {data.stats.users}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Tasks
              </Typography>
              <Typography variant="h3">
                {data.stats.tasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h3">
                {data.stats.projects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
