import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';

interface AuditLogFiltersProps {
  entityType: string;
  searchTerm: string;
  actionType: string;
  timeRange: string;
  onEntityTypeChange: (entityType: string) => void;
  onSearchTermChange: (searchTerm: string) => void;
  onActionTypeChange: (actionType: string) => void;
  onTimeRangeChange: (timeRange: string) => void;
}

/**
 * Component for filtering audit logs with enhanced filtering capabilities
 */
export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  entityType,
  searchTerm,
  actionType,
  timeRange,
  onEntityTypeChange,
  onSearchTermChange,
  onActionTypeChange,
  onTimeRangeChange,
}) => {
  const actionTypes = [
    'All Actions',
    'Create',
    'Update',
    'Delete',
    'View',
    'Export',
    'Import'
  ];

  const timeRanges = [
    'All Time',
    'Last 24 Hours',
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days',
    'Custom Range'
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6}>
        <FormControl 
          fullWidth 
          size="small"
        >
          <InputLabel>Entity Type</InputLabel>
          <Select
            value={entityType}
            label="Entity Type"
            onChange={(e) => onEntityTypeChange(e.target.value)}
          >
            <MenuItem value="all">All Entities</MenuItem>
            <MenuItem value="lead">Lead Records</MenuItem>
            <MenuItem value="contact">Contact Records</MenuItem>
            <MenuItem value="company">Company Records</MenuItem>
            <MenuItem value="opportunity">Opportunity Records</MenuItem>
            <MenuItem value="product">Product Records</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl 
          fullWidth 
          size="small"
        >
          <InputLabel>Action Type</InputLabel>
          <Select
            value={actionType}
            label="Action Type"
            onChange={(e) => onActionTypeChange(e.target.value)}
          >
            {actionTypes.map((action) => (
              <MenuItem key={action} value={action.toLowerCase()}>
                {action}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl 
          fullWidth 
          size="small"
        >
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <MenuItem key={range} value={range.toLowerCase()}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          label="Search Audit Logs"
          placeholder="Search by any field..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
