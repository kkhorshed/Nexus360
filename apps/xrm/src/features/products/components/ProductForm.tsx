import { useState } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import BaseForm from '../../../components/common/BaseForm';
import { ProductFormProps, ProductFormData } from '../types';
import { PRODUCT_CATEGORIES } from '../constants';

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data: ProductFormData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      sku: formData.get('sku') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      description: formData.get('description') as string,
      specifications: formData.get('specifications') as string || undefined
    };

    await onSubmit(data);
    setIsSubmitting(false);
  };

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
            {PRODUCT_CATEGORIES.map((category) => (
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
