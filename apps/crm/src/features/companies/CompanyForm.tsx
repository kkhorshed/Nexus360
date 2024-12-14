import { useState } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import BaseForm from '../../components/common/BaseForm';

interface CompanyFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CompanyForm({ initialData, onSubmit, onCancel }: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Other'
  ];

  const companyTypes = [
    'Corporation',
    'LLC',
    'Partnership',
    'Sole Proprietorship',
    'Non-Profit',
    'Other'
  ];

  return (
    <BaseForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="name"
            label="Company Name"
            defaultValue={initialData?.name || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="industry"
            label="Industry"
            defaultValue={initialData?.industry || ''}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="companyType"
            label="Company Type"
            defaultValue={initialData?.companyType || ''}
          >
            {companyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="website"
            label="Website"
            defaultValue={initialData?.website || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="email"
            type="email"
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
            name="address"
            label="Address"
            multiline
            rows={2}
            defaultValue={initialData?.address || ''}
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
      </Grid>
    </BaseForm>
  );
}
