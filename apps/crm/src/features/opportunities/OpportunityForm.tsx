import { useState } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import BaseForm from '../../components/common/BaseForm';

interface OpportunityFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function OpportunityForm({ initialData, onSubmit, onCancel }: OpportunityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  const stages = [
    'Qualification',
    'Needs Analysis',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  const priorities = [
    'High',
    'Medium',
    'Low'
  ];

  return (
    <BaseForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="name"
            label="Opportunity Name"
            defaultValue={initialData?.name || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="company"
            label="Company"
            defaultValue={initialData?.company || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="amount"
            label="Amount"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            defaultValue={initialData?.amount || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="closeDate"
            label="Expected Close Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            defaultValue={initialData?.closeDate || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            name="stage"
            label="Stage"
            defaultValue={initialData?.stage || 'Qualification'}
          >
            {stages.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {stage}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            name="priority"
            label="Priority"
            defaultValue={initialData?.priority || 'Medium'}
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="products"
            label="Products Interested In"
            multiline
            rows={2}
            defaultValue={initialData?.products || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="description"
            label="Description"
            multiline
            rows={3}
            defaultValue={initialData?.description || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="nextSteps"
            label="Next Steps"
            multiline
            rows={2}
            defaultValue={initialData?.nextSteps || ''}
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
}
