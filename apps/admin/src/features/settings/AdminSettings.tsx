import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  Security as SecurityIcon,
  People as PeopleIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import PageWrapper from '../../components/common/PageWrapper';

const settingsGroups = [
  {
    title: 'Access Management',
    items: [
      {
        name: 'User Management',
        description: 'Manage users and their permissions',
        icon: <PeopleIcon />,
        path: '/settings/users',
      },
      {
        name: 'Access Control',
        description: 'Configure system access rules',
        icon: <SecurityIcon />,
        path: '/settings/access-control',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        name: 'Activity Log',
        description: 'View system activity and audit logs',
        icon: <HistoryIcon />,
        path: '/settings/activity',
      },
      {
        name: 'System Settings',
        description: 'Configure global system settings',
        icon: <SettingsIcon />,
        path: '/settings/system',
      },
    ],
  },
];

const AdminSettings = () => {
  return (
    <PageWrapper
      title="Settings"
      description="Manage system settings and configurations"
    >
      {settingsGroups.map((group) => (
        <div key={group.title} style={{ marginBottom: '2rem' }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}
          >
            {group.title}
          </Typography>
          <Grid container spacing={2}>
            {group.items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.name}>
                <Card>
                  <CardActionArea component={RouterLink} to={item.path}>
                    <CardContent>
                      <ListItem disablePadding>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={item.description}
                        />
                      </ListItem>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </PageWrapper>
  );
};

export default AdminSettings;
