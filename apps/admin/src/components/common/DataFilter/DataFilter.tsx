import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  useTheme
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  Delete as ClearIcon
} from '@mui/icons-material';

export interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'date';
  options?: { value: string; label: string }[];
}

interface DataFilterProps {
  options: FilterOption[];
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

const DataFilter: React.FC<DataFilterProps> = ({
  options,
  activeFilters,
  onFilterChange
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFilterChange = (field: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    handleClose();
  };

  const handleClearFilters = () => {
    const emptyFilters = options.reduce((acc, option) => ({
      ...acc,
      [option.field]: ''
    }), {});
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length;

  const renderFilterInput = (option: FilterOption) => {
    const value = localFilters[option.field] || '';

    switch (option.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{option.label}</InputLabel>
            <Select
              value={value}
              label={option.label}
              onChange={(e) => handleFilterChange(option.field, e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {option.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl>
            <RadioGroup
              value={value}
              onChange={(e) => handleFilterChange(option.field, e.target.value)}
            >
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label="All"
              />
              {option.options?.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(option.field, e.target.value)}
            fullWidth
            size="small"
          />
        );

      default:
        return (
          <TextField
            placeholder={option.label}
            value={value}
            onChange={(e) => handleFilterChange(option.field, e.target.value)}
            fullWidth
            size="small"
          />
        );
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleOpen}
          size="small"
        >
          Filters
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Button>

        {activeFilterCount > 0 && (
          <IconButton 
            size="small" 
            onClick={handleClearFilters}
            sx={{ color: theme.palette.error.main }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            p: 0,
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {options.map((option, index) => (
              <Box key={option.field} sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ mb: 1 }}
                >
                  {option.label}
                </Typography>
                {renderFilterInput(option)}
              </Box>
            ))}
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default DataFilter;
