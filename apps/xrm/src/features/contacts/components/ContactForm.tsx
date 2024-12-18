import { useState } from 'react';
import { TextField, Grid, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BaseForm from '../../../components/common/BaseForm';
import { Contact, ContactFormProps } from '../types';
import { CONTACT_STATUS_OPTIONS } from '../constants';
import { Company } from '../../companies/types';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: number | string; // string for empty initial value
  position: string;
  status: string;
}

// Validation schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .matches(/^[0-9+\-() ]*$/, 'Invalid phone number format'),
  companyId: Yup.number()
    .required('Company is required'),
  position: Yup.string()
    .required('Position is required'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(CONTACT_STATUS_OPTIONS, 'Invalid status'),
});

export default function ContactForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  companies = [] // Add companies prop with default empty array
}: ContactFormProps & { companies: Company[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      companyId: initialData?.companyId || '',
      position: initialData?.position || '',
      status: initialData?.status || CONTACT_STATUS_OPTIONS[0],
    },
    validationSchema,
    onSubmit: async (values: FormValues) => {
      setIsSubmitting(true);
      try {
        await onSubmit({
          ...values,
          companyId: Number(values.companyId), // Convert to number for API
        });
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <BaseForm 
      onSubmit={handleSubmit}
      onCancel={onCancel} 
      isSubmitting={isSubmitting}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            id="companyId"
            name="companyId"
            label="Company"
            value={formik.values.companyId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.companyId && Boolean(formik.errors.companyId)}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </TextField>
          {formik.touched.companyId && formik.errors.companyId && (
            <FormHelperText error>{formik.errors.companyId}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="position"
            name="position"
            label="Position"
            value={formik.values.position}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            id="status"
            name="status"
            label="Status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.status && Boolean(formik.errors.status)}
          >
            {CONTACT_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          {formik.touched.status && formik.errors.status && (
            <FormHelperText error>{formik.errors.status}</FormHelperText>
          )}
        </Grid>
      </Grid>
    </BaseForm>
  );
}
