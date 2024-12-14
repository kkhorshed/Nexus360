import { useState } from 'react';
import { TextField, Grid } from '@mui/material';
import BaseForm from '../../components/common/BaseForm';

interface ContactFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ContactForm({ initialData, onSubmit, onCancel }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="notes"
            label="Notes"
            defaultValue={initialData?.notes || ''}
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
}
