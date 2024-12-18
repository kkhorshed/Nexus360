import { ReactNode } from 'react';
import { Box, Button, Stack } from '@mui/material';

interface BaseFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  children: ReactNode;
  isSubmitting?: boolean;
}

export default function BaseForm({ onSubmit, onCancel, children, isSubmitting = false }: BaseFormProps) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {children}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button onClick={onCancel} variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
