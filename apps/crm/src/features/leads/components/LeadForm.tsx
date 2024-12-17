import { useState } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import BaseForm from '../../../components/common/BaseForm';
import { Lead, LeadFormData } from '../types';
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants';

interface LeadFormProps {
  initialData: Lead | null;
  onSubmit: (data: LeadFormData) => void | Promise<void>;
  onCancel: () => void;
}

export default function LeadForm({ initialData, onSubmit, onCancel }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData) as unknown as LeadFormData;
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <BaseForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="firstName"
            label="First Name"
            defaultValue={initialData?.firstName || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="lastName"
            label="Last Name"
            defaultValue={initialData?.lastName || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            type="email"
            name="email"
            label="Email"
            defaultValue={initialData?.email || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="phone"
            label="Phone"
            defaultValue={initialData?.phone || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="company"
            label="Company"
            defaultValue={initialData?.company || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            name="source"
            label="Lead Source"
            defaultValue={initialData?.source || LEAD_SOURCES[0]}
          >
            {LEAD_SOURCES.map((source) => (
              <MenuItem key={source} value={source}>
                {source}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            name="status"
            label="Status"
            defaultValue={initialData?.status || LEAD_STATUSES[0]}
          >
            {LEAD_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="requirements"
            label="Requirements"
            multiline
            rows={3}
            defaultValue={initialData?.requirements || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="notes"
            label="Notes"
            multiline
            rows={3}
            defaultValue={initialData?.notes || ''}
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
}
