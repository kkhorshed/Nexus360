import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  Add as CreateIcon,
  Edit as UpdateIcon,
  Delete as DeleteIcon,
  Person as UserIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

interface AuditLog {
  entityId: string;
  entityType: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  userId: string;
  userType: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const AuditTrail: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [entityType, setEntityType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAuditLogs();
  }, [entityType]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const url = 'http://localhost:3001/api/audit/logs' + 
        (entityType !== 'all' ? `?entityType=${entityType}` : '');
      const response = await fetch(url);
      const data = await response.json();
      setAuditLogs(data.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <CreateIcon color="success" />;
      case 'UPDATE':
        return <UpdateIcon color="primary" />;
      case 'DELETE':
        return <DeleteIcon color="error" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const filterLogs = (logs: AuditLog[]) => {
    return logs.filter(log => {
      const searchString = searchTerm.toLowerCase();
      return (
        log.entityType.toLowerCase().includes(searchString) ||
        log.action.toLowerCase().includes(searchString) ||
        log.userId.toLowerCase().includes(searchString) ||
        log.changes.some(change => 
          change.field.toLowerCase().includes(searchString) ||
          formatValue(change.oldValue).toLowerCase().includes(searchString) ||
          formatValue(change.newValue).toLowerCase().includes(searchString)
        )
      );
    });
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Audit Trail
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Entity Type</InputLabel>
            <Select
              value={entityType}
              label="Entity Type"
              onChange={(e) => setEntityType(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="lead">Leads</MenuItem>
              <MenuItem value="contact">Contacts</MenuItem>
              <MenuItem value="company">Companies</MenuItem>
              <MenuItem value="opportunity">Opportunities</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
      </Grid>

      <Timeline>
        {filterLogs(auditLogs).map((log, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={
                log.action === 'CREATE' ? 'success' :
                log.action === 'UPDATE' ? 'primary' : 'error'
              }>
                {getActionIcon(log.action)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span">
                    {log.entityType.toUpperCase()} - {log.action}
                  </Typography>
                  <Chip
                    size="small"
                    icon={<TimeIcon />}
                    label={formatTimestamp(log.timestamp)}
                    sx={{ ml: 1 }}
                  />
                  <Chip
                    size="small"
                    icon={<UserIcon />}
                    label={log.userId}
                    sx={{ ml: 1 }}
                  />
                </Box>
                <List dense>
                  {log.changes.map((change, changeIndex) => (
                    <ListItem key={changeIndex}>
                      <ListItemText
                        primary={change.field}
                        secondary={
                          <>
                            {log.action !== 'CREATE' && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                From: {formatValue(change.oldValue)}
                              </Typography>
                            )}
                            <Typography component="span" variant="body2" color="primary">
                              {log.action !== 'DELETE' && (
                                <> To: {formatValue(change.newValue)}</>
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default AuditTrail;
