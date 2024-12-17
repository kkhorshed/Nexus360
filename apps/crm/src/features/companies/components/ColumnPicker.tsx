import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Checkbox,
  Typography,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useState } from 'react';
import { ColumnPickerProps, Company } from '../types';

const COLUMN_LABELS: Record<keyof Omit<Company, 'id' | 'address' | 'description'>, string> = {
  name: 'Company Name',
  industry: 'Industry',
  companyType: 'Type',
  email: 'Email',
  phone: 'Phone',
  website: 'Website',
};

export default function ColumnPicker({ visibleColumns, onColumnToggle }: ColumnPickerProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (column: keyof typeof COLUMN_LABELS) => {
    onColumnToggle(column);
  };

  return (
    <Box>
      <Tooltip title="Choose columns">
        <IconButton
          onClick={handleClick}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            minWidth: 200,
          },
        }}
      >
        {Object.entries(COLUMN_LABELS).map(([key, label]) => (
          <MenuItem
            key={key}
            onClick={() => handleToggle(key as keyof typeof COLUMN_LABELS)}
            dense
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
              py: 1,
            }}
          >
            <Typography variant="body2">{label}</Typography>
            <Checkbox
              checked={visibleColumns[key as keyof typeof visibleColumns]}
              size="small"
              color="primary"
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
