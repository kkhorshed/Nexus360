import { useState } from 'react';
import {
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
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

// Mock data - In a real application, this would come from an API
const mockTeams = [
  {
    id: 1,
    name: 'Enterprise Sales',
    manager: 'Sarah Johnson',
    members: 8,
    region: 'North America',
    quota: '$2,000,000',
  },
  {
    id: 2,
    name: 'SMB Sales',
    manager: 'Michael Brown',
    members: 12,
    region: 'Europe',
    quota: '$1,500,000',
  },
  {
    id: 3,
    name: 'Mid-Market Sales',
    manager: 'Emily Davis',
    members: 6,
    region: 'APAC',
    quota: '$1,000,000',
  },
];

export default function TeamManagementPage() {
  const [teams, setTeams] = useState(mockTeams);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);

  const handleOpenDialog = (team?: any) => {
    setEditingTeam(team || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingTeam(null);
    setOpenDialog(false);
  };

  const handleSaveTeam = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, this would make an API call
    handleCloseDialog();
  };

  const handleDeleteTeam = (id: number) => {
    // In a real application, this would make an API call
    setTeams(teams.filter(team => team.id !== id));
  };

  const actions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => handleOpenDialog()}
    >
      Add Team
    </Button>
  );

  return (
    <PageWrapper 
      title="Team Management"
      description="Manage sales teams and their territories"
      actions={actions}
    >
      <PageSection>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Team Quota</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {team.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{team.manager}</TableCell>
                  <TableCell>{team.members}</TableCell>
                  <TableCell>{team.region}</TableCell>
                  <TableCell>{team.quota}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(team)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTeam(team.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageSection>

      {/* Team Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTeam ? 'Edit Team' : 'Add Team'}
        </DialogTitle>
        <form onSubmit={handleSaveTeam}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Team Name"
                  defaultValue={editingTeam?.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Manager"
                  defaultValue={editingTeam?.manager}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Region"
                  defaultValue={editingTeam?.region || 'North America'}
                  required
                >
                  <MenuItem value="North America">North America</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="APAC">APAC</MenuItem>
                  <MenuItem value="LATAM">LATAM</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Team Quota"
                  defaultValue={editingTeam?.quota}
                  required
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
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
