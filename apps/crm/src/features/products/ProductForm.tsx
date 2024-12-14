import { useState } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import BaseForm from '../../components/common/BaseForm';

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  const categories = [
    'Software',
    'Hardware',
    'Services',
    'Consulting',
    'Support',
    'Training',
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
            label="Product Name"
            defaultValue={initialData?.name || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            name="category"
            label="Category"
            defaultValue={initialData?.category || ''}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="sku"
            label="SKU"
            defaultValue={initialData?.sku || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="price"
            label="Price"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            defaultValue={initialData?.price || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="stock"
            label="Stock"
            type="number"
            inputProps={{ min: 0 }}
            defaultValue={initialData?.stock || ''}
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
            name="specifications"
            label="Technical Specifications"
            multiline
            rows={3}
            defaultValue={initialData?.specifications || ''}
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
}
