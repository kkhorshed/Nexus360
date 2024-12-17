import { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import BaseForm from '../../../components/common/BaseForm';
import { TaskFormProps } from '../types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants';
import { getInitialDueDate } from '../utils/helpers';

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    const taskData = {
      title: data.title as string,
      description: data.description as string,
      status: data.status as 'todo' | 'in_progress' | 'completed',
      priority: data.priority as 'low' | 'medium' | 'high',
      dueDate: data.dueDate as string,
      assignedTo: data.assignedTo as string,
    };

    if (initialData) {
      await onSubmit({ ...taskData, id: initialData.id });
    } else {
      await onSubmit(taskData);
    }
    setIsSubmitting(false);
  };

  return (
    <BaseForm 
      onSubmit={handleSubmit} 
      onCancel={onCancel} 
      isSubmitting={isSubmitting}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="title"
            label="Title"
            defaultValue={initialData?.title || ''}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            name="description"
            label="Description"
            defaultValue={initialData?.description || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              label="Status"
              defaultValue={initialData?.status || 'todo'}
            >
              {STATUS_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              label="Priority"
              defaultValue={initialData?.priority || 'medium'}
            >
              {PRIORITY_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="dueDate"
            label="Due Date"
            type="date"
            defaultValue={initialData?.dueDate || getInitialDueDate()}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="assignedTo"
            label="Assigned To"
            defaultValue={initialData?.assignedTo || ''}
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
}
