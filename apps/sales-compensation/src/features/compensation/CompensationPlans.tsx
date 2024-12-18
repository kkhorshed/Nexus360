import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

// Mock data - In a real application, this would come from an API
const mockPlans = [
  {
    id: 1,
    name: 'Standard Commission Plan',
    type: 'Commission',
    baseRate: '5%',
    accelerators: 'Yes',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Senior Sales Bonus Plan',
    type: 'Bonus',
    baseRate: '3%',
    accelerators: 'Yes',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Q4 Spiff',
    type: 'SPIFF',
    baseRate: '2%',
    accelerators: 'No',
    status: 'Draft',
  },
];

export default function CompensationPlans() {
  const [plans, setPlans] = useState(mockPlans);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleOpenDialog = (plan?: any) => {
    setEditingPlan(plan || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingPlan(null);
    setOpenDialog(false);
  };

  const handleSavePlan = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, this would make an API call
    handleCloseDialog();
  };

  const handleDeletePlan = (id: number) => {
    // In a real application, this would make an API call
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const actions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => handleOpenDialog()}
    >
      New Plan
    </Button>
  );

  return (
    <PageWrapper 
      title="Compensation Plans"
      description="Manage and configure sales compensation plans"
      actions={actions}
    >
      <PageSection>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Base Rate</TableCell>
                <TableCell>Accelerators</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell>{plan.baseRate}</TableCell>
                  <TableCell>{plan.accelerators}</TableCell>
                  <TableCell>{plan.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(plan)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePlan(plan.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageSection>

      {/* Plan Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlan ? 'Edit Compensation Plan' : 'New Compensation Plan'}
        </DialogTitle>
        <form onSubmit={handleSavePlan}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Plan Name"
                  defaultValue={editingPlan?.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Plan Type"
                  defaultValue={editingPlan?.type || 'Commission'}
                  required
                >
                  <MenuItem value="Commission">Commission</MenuItem>
                  <MenuItem value="Bonus">Bonus</MenuItem>
                  <MenuItem value="SPIFF">SPIFF</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Base Rate"
                  defaultValue={editingPlan?.baseRate}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Accelerators"
                  defaultValue={editingPlan?.accelerators || 'No'}
                  required
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  defaultValue={editingPlan?.status || 'Draft'}
                  required
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageWrapper>
  );
}
