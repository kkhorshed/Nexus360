import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack
} from '@mui/material';
import { Opportunity } from '../types';

interface OpportunityFormProps {
  initialData: Opportunity | null;
  onSubmit: (data: Partial<Opportunity>) => Promise<void>;
  onCancel: () => void;
}

export default function OpportunityForm({ initialData, onSubmit, onCancel }: OpportunityFormProps) {
  const [formData, setFormData] = useState<Partial<Opportunity>>(
    initialData || {
      name: '',
      company: '',
      amount: 0,
      closeDate: '',
      stage: 'Qualification',
      priority: 'Medium'
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Opportunity Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: '$'
          }}
        />

        <TextField
          fullWidth
          label="Close Date"
          name="closeDate"
          type="date"
          value={formData.closeDate}
          onChange={handleChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          fullWidth
          select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          required
        >
          <MenuItem value="Qualification">Qualification</MenuItem>
          <MenuItem value="Needs Analysis">Needs Analysis</MenuItem>
          <MenuItem value="Proposal">Proposal</MenuItem>
          <MenuItem value="Negotiation">Negotiation</MenuItem>
          <MenuItem value="Closed Won">Closed Won</MenuItem>
          <MenuItem value="Closed Lost">Closed Lost</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Create'} Opportunity
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
