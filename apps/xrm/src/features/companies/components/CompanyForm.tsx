import { TextField, Grid, MenuItem } from '@mui/material';
import BaseForm from '../../../components/common/BaseForm';
import { CompanyFormProps } from '../types';
import { INDUSTRIES, COMPANY_TYPES } from '../constants';

export default function CompanyForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: CompanyFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    await onSubmit(data);
  };

  return (
    <BaseForm 
      onSubmit={handleSubmit} 
      onCancel={onCancel}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="name"
            label="Company Name"
            defaultValue={initialData?.name || ''}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            select
            name="industry"
            label="Industry"
            defaultValue={initialData?.industry || ''}
          >
            {INDUSTRIES.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            select
            name="companyType"
            label="Company Type"
            defaultValue={initialData?.companyType || ''}
          >
            {COMPANY_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="website"
            label="Website"
            defaultValue={initialData?.website || ''}
            placeholder="www.example.com"
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="email"
            type="email"
            label="Email"
            defaultValue={initialData?.email || ''}
            placeholder="contact@example.com"
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="phone"
            label="Phone"
            defaultValue={initialData?.phone || ''}
            placeholder="123-456-7890"
            inputProps={{ maxLength: 20 }}
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
            inputProps={{ maxLength: 200 }}
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
            inputProps={{ maxLength: 500 }}
            helperText="Max 500 characters"
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
}
