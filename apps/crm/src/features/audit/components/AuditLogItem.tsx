import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
} from '@mui/material';
import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Add as CreateIcon,
  Edit as UpdateIcon,
  Delete as DeleteIcon,
  Person as UserIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { AuditLog, AuditAction } from '../types';

interface AuditLogItemProps {
  log: AuditLog;
  formatTimestamp: (timestamp: string) => string;
  formatValue: (value: any) => string;
}

/**
 * Component for displaying a single audit log entry
 */
export const AuditLogItem: React.FC<AuditLogItemProps> = ({
  log,
  formatTimestamp,
  formatValue,
}) => {
  /**
   * Returns the appropriate icon for the audit action
   */
  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'CREATE':
        return <CreateIcon color="success" />;
      case 'UPDATE':
        return <UpdateIcon color="primary" />;
      case 'DELETE':
        return <DeleteIcon color="error" />;
    }
  };

  /**
   * Returns the appropriate color for the timeline dot
   */
  const getTimelineDotColor = (action: AuditAction): 'success' | 'primary' | 'error' => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'primary';
      case 'DELETE':
        return 'error';
    }
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={getTimelineDotColor(log.action)}>
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
  );
};
