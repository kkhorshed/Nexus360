import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  Person as UserIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Apps as AppsIcon
} from '@mui/icons-material';
import { DataTable } from '@nexus360/ui';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';
import { format } from 'date-fns';

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'user' | 'security' | 'system' | 'app';
  details: string;
}

const mockLogs: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    user: 'Admin User',
    action: 'Settings Updated',
    category: 'system',
    details: 'Updated email notification settings'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'System',
    action: 'Security Alert',
    category: 'security',
    details: 'Failed login attempt detected'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: 'John Doe',
    action: 'User Login',
    category: 'user',
    details: 'Successful login from 192.168.1.1'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    user: 'Jane Smith',
    action: 'App Access',
    category: 'app',
    details: 'Accessed Sales Dashboard'
  }
];

const categories = [
  { value: 'user', label: 'User Activity', icon: <UserIcon /> },
  { value: 'security', label: 'Security', icon: <SecurityIcon /> },
  { value: 'system', label: 'System', icon: <SettingsIcon /> },
  { value: 'app', label: 'Applications', icon: <AppsIcon /> }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'user':
      return 'primary';
    case 'security':
      return 'error';
    case 'system':
      return 'warning';
    case 'app':
      return 'success';
    default:
      return 'default';
  }
};

export default function ActivityLog() {
  const [logs] = React.useState<ActivityLogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');

  const columns = [
    {
      key: 'timestamp',
      title: 'Timestamp',
      width: 180,
      render: (value: string) => format(new Date(value), 'MMM d, yyyy HH:mm:ss')
    },
    {
      key: 'user',
      title: 'User',
      width: 150
    },
    {
      key: 'action',
      title: 'Action',
      width: 150
    },
    {
      key: 'category',
      title: 'Category',
      width: 120,
      render: (value: string) => (
        <Chip
          label={value}
          size="small"
          color={getCategoryColor(value)}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      key: 'details',
      title: 'Details',
      width: 300,
      render: (value: string) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {value}
          </Typography>
          <Tooltip title="View full details">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesCategory = !selectedCategory || log.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper
      title="Activity Log"
      description="View and monitor system activity"
      breadcrumbs={[
        { text: 'Settings', href: '/settings' },
        { text: 'Activity Log' }
      ]}
    >
      <PageSection>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search activity logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {category.icon}
                    <Box sx={{ ml: 1 }}>{category.label}</Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <DataTable
          columns={columns}
          data={filteredLogs}
          pagination={{
            current: 1,
            pageSize: 10,
            total: filteredLogs.length,
            onChange: (page: number, pageSize: number) => {
              console.log('Page:', page, 'PageSize:', pageSize);
            }
          }}
        />
      </PageSection>

      <PageSection title="Activity Summary">
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.value}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {logs.filter(log => log.category === category.value).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.label} Logs
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </PageSection>
    </PageWrapper>
  );
}
