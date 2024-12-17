import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import {
  DataFilterProps,
  FilterCondition,
  FILTER_OPERATORS,
  SavedFilter,
} from './types';
import {
  getUniqueValues,
  loadSavedFilters,
  saveFilters,
  convertConditionsToFilterState,
} from './utils';

const initialCondition: FilterCondition = {
  field: '',
  operator: 'contains',
  value: '',
};

export default function DataFilter({
  currentFilters,
  onFilterLoad,
  columns,
  data,
  storageKey,
}: DataFilterProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => 
    loadSavedFilters(storageKey)
  );
  const [editingConditions, setEditingConditions] = useState<FilterCondition[]>([]);
  const [isCreatingFilter, setIsCreatingFilter] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  const handleAddCondition = () => {
    setEditingConditions([
      ...editingConditions,
      { ...initialCondition, field: columns[0]?.id || '' },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    setEditingConditions(editingConditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index: number, field: keyof FilterCondition, value: string) => {
    const newConditions = [...editingConditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    };
    // Reset value when changing field or operator
    if (field === 'field' || field === 'operator') {
      newConditions[index].value = '';
    }
    setEditingConditions(newConditions);
  };

  const handleSave = () => {
    if (!newFilterName || editingConditions.length === 0) return;

    const filterState = convertConditionsToFilterState(editingConditions);

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      filters: filterState,
      conditions: editingConditions,
      isDefault: savedFilters.length === 0,
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    saveFilters(storageKey, updatedFilters);
    setNewFilterName('');
    setEditingConditions([]);
    setIsCreatingFilter(false);
  };

  const handleDelete = (filterId: string) => {
    const updatedFilters = savedFilters.filter((f) => f.id !== filterId);
    setSavedFilters(updatedFilters);
    saveFilters(storageKey, updatedFilters);
  };

  const handleToggleDefault = (filterId: string) => {
    const updatedFilters = savedFilters.map((filter) => ({
      ...filter,
      isDefault: filter.id === filterId ? !filter.isDefault : false,
    }));
    setSavedFilters(updatedFilters);
    saveFilters(storageKey, updatedFilters);
  };

  const handleLoad = (filter: SavedFilter) => {
    onFilterLoad(filter.filters);
    setEditingConditions(filter.conditions || []);
  };

  const handleStartCreating = () => {
    setIsCreatingFilter(true);
    setEditingConditions([{ ...initialCondition, field: columns[0]?.id || '' }]);
  };

  const handleCancelCreating = () => {
    setIsCreatingFilter(false);
    setNewFilterName('');
    setEditingConditions([]);
  };

  const getFilterSummary = (conditions: FilterCondition[] = []) => {
    return conditions.map((condition) => {
      const column = columns.find((col) => col.id === condition.field);
      const operator = FILTER_OPERATORS.find((op) => op.value === condition.operator);
      return `${column?.label || condition.field} ${operator?.label || condition.operator} "${condition.value}"`;
    });
  };

  const renderValueInput = (condition: FilterCondition, index: number) => {
    if (condition.operator === 'equals') {
      const values = Array.from(getUniqueValues(data, condition.field)).sort();
      return (
        <FormControl size="small" sx={{ flexGrow: 1 }}>
          <InputLabel>Value</InputLabel>
          <Select
            value={condition.value}
            label="Value"
            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
          >
            {values.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        size="small"
        label="Value"
        value={condition.value}
        onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
        sx={{ flexGrow: 1 }}
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {!isCreatingFilter ? (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleStartCreating}
            sx={{ mb: 2 }}
            fullWidth
          >
            Create New Filter
          </Button>

          <Typography variant="subtitle2" gutterBottom>
            Saved Filters
          </Typography>
          <List>
            {savedFilters.map((filter) => (
              <ListItem
                key={filter.id}
                button
                onClick={() => handleLoad(filter)}
                sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}
              >
                <ListItemText
                  primary={filter.name}
                  secondary={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getFilterSummary(filter.conditions).map((summary, index) => (
                        <Chip key={index} label={summary} size="small" />
                      ))}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDefault(filter.id);
                    }}
                    size="small"
                  >
                    {filter.isDefault ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(filter.id);
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Create New Filter
          </Typography>
          <TextField
            label="Filter Name"
            value={newFilterName}
            onChange={(e) => setNewFilterName(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Filter Conditions
          </Typography>
          <Stack spacing={2}>
            {editingConditions.map((condition, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={condition.field}
                    label="Field"
                    onChange={(e) =>
                      handleConditionChange(index, 'field', e.target.value)
                    }
                  >
                    {columns
                      .filter((col) => !col.numeric)
                      .map((column) => (
                        <MenuItem key={column.id} value={column.id}>
                          {column.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={condition.operator}
                    label="Operator"
                    onChange={(e) =>
                      handleConditionChange(
                        index,
                        'operator',
                        e.target.value as FilterCondition['operator']
                      )
                    }
                  >
                    {FILTER_OPERATORS.map((operator) => (
                      <MenuItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {renderValueInput(condition, index)}

                <IconButton
                  size="small"
                  onClick={() => handleRemoveCondition(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddCondition}
            sx={{ mt: 2 }}
          >
            Add Condition
          </Button>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={handleCancelCreating} fullWidth>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!newFilterName || editingConditions.length === 0}
              fullWidth
            >
              Save Filter
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
