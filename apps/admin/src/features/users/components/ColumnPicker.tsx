import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Checkbox,
  ListItemText,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

interface ColumnPickerProps {
  visibleColumns: Record<string, boolean>;
  onColumnToggle: (columnId: string) => void;
}

const COLUMN_LABELS: Record<string, string> = {
  displayName: 'Name',
  userPrincipalName: 'Email',
  department: 'Department',
  jobTitle: 'Job Title',
  officeLocation: 'Office Location',
  roles: 'Roles',
  appPermissions: 'Apps',
  status: 'Status',
  lastSyncAt: 'Last Sync',
};

export default function ColumnPicker({ visibleColumns, onColumnToggle }: ColumnPickerProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (columnId: string) => {
    onColumnToggle(columnId);
  };

  return (
    <>
      <Tooltip title="Show/Hide Columns">
        <IconButton onClick={handleClick}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {Object.entries(COLUMN_LABELS).map(([columnId, label]) => (
          <MenuItem
            key={columnId}
            onClick={() => handleToggle(columnId)}
            dense
          >
            <Checkbox
              checked={visibleColumns[columnId]}
              size="small"
            />
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
