import React, { useState, ReactElement } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Apps as AppsIcon
} from '@mui/icons-material';
import { DataTable } from '@nexus360/ui';
import PageWrapper from '../../components/common/PageWrapper';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'user' | 'role' | 'permission' | 'app' | 'setting';
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  details?: Record<string, any>;
}

interface Column {
  key: keyof AuditLog | 'details';
  title: string;
  width: number;
  render?: (value: any) => React.ReactNode;
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action: 'User Created',
    category: 'user',
    description: 'New user account created',
    user: {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    details: {
      newUser: 'john.doe@example.com'
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'Role Modified',
    category: 'role',
    description: 'Role permissions updated',
    user: {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    details: {
      role: 'Manager',
      changes: ['Added: manage_users', 'Removed: delete_users']
    }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: 'App Access Granted',
    category: 'permission',
    description: 'User granted access to application',
    user: {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    details: {
      user: 'jane.smith@example.com',
      app: 'Sales Dashboard'
    }
  }
];

const categories = [
  { value: 'user', label: 'User Management', icon: <PersonIcon /> },
  { value: 'role', label: 'Roles & Permissions', icon: <SecurityIcon /> },
  { value: 'permission', label: 'Access Control', icon: <AppsIcon /> },
  { value: 'setting', label: 'System Settings', icon: <SettingsIcon /> }
];

const AuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryIcon = (category: string): ReactElement => {
    switch (category) {
      case 'user':
        return <PersonIcon fontSize="small" />;
      case 'role':
        return <SecurityIcon fontSize="small" />;
      case 'permission':
        return <AppsIcon fontSize="small" />;
      case 'setting':
        return <SettingsIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const columns: Column[] = [
    {
      key: 'timestamp',
      title: 'Timestamp',
      width: 180,
      render: (value: string) => format(new Date(value), 'MMM d, yyyy HH:mm:ss')
    },
    {
      key: 'category',
      title: 'Category',
      width: 150,
      render: (value: string) => (
        <Chip
          icon={getCategoryIcon(value)}
          label={categories.find(c => c.value === value)?.label || value}
          size="small"
        />
      )
    },
    {
      key: 'action',
      title: 'Action',
      width: 150
    },
    {
      key: 'description',
      title: 'Description',
      width: 250
    },
    {
      key: 'user',
      title: 'User',
      width: 200,
      render: (value: AuditLog['user']) => value.name
    },
    {
      key: 'details',
      title: 'Details',
      width: 100,
      render: (value: Record<string, any>) => (
        value ? (
          <Tooltip title={
            <Box>
              {Object.entries(value).map(([key, val]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {
                    Array.isArray(val) 
                      ? val.join(', ') 
                      : String(val)
                  }
                </Typography>
              ))}
            </Box>
          }>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null
      )
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesCategory = !selectedCategory || log.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper
      title="Audit Logs"
      description="Track and monitor system activities"
    >
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search logs..."
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
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredLogs}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredLogs.length,
          onChange: (page: number, pageSize: number) => {
            // Handle pagination change
            console.log('Page:', page, 'PageSize:', pageSize);
          }
        }}
      />
    </PageWrapper>
  );
};

export default AuditLogs;
