import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AccountProfile as AccountProfileType } from '../types';
import { DEVOPS_STAGES } from '../constants';

interface AccountProfileProps {
  profile: AccountProfileType;
  onUpdate: (profile: AccountProfileType) => void;
  readonly?: boolean;
}

export const AccountProfile: React.FC<AccountProfileProps> = ({ profile, onUpdate, readonly = false }) => {
  const [editGoalIndex, setEditGoalIndex] = useState<number | null>(null);
  const [newGoal, setNewGoal] = useState({
    goal: '',
    strategicInitiatives: [''],
    valueDrivers: ['']
  });

  const handleAddGoal = () => {
    const updatedProfile = {
      ...profile,
      organizationGoals: [...profile.organizationGoals, newGoal]
    };
    onUpdate(updatedProfile);
    setNewGoal({ goal: '', strategicInitiatives: [''], valueDrivers: [''] });
  };

  const handleDeleteGoal = (index: number) => {
    const updatedGoals = profile.organizationGoals.filter((_, i) => i !== index);
    onUpdate({ ...profile, organizationGoals: updatedGoals });
  };

  const handleUpdateGoal = (index: number, updatedGoal: typeof newGoal) => {
    const updatedGoals = [...profile.organizationGoals];
    updatedGoals[index] = updatedGoal;
    onUpdate({ ...profile, organizationGoals: updatedGoals });
    setEditGoalIndex(null);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Account Profile
        </Typography>

        {/* Organization Goals Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Organization Goals & Strategic Initiatives
          </Typography>
          <List>
            {profile.organizationGoals.map((goal, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={goal.goal}
                  secondary={
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Strategic Initiatives:
                      </Typography>
                      <Stack direction="row" spacing={1} mb={1}>
                        {goal.strategicInitiatives.map((initiative, i) => (
                          <Chip key={i} label={initiative} size="small" />
                        ))}
                      </Stack>
                      <Typography variant="subtitle2" color="textSecondary">
                        Value Drivers:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {goal.valueDrivers.map((driver, i) => (
                          <Chip key={i} label={driver} size="small" color="primary" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  }
                />
                {!readonly && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => setEditGoalIndex(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteGoal(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>

          {!readonly && (
            <Box mt={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddGoal}
                disabled={!newGoal.goal}
              >
                Add Goal
              </Button>
            </Box>
          )}
        </Box>

        {/* Product Usage Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Product Usage
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Status"
                value={profile.productUsage.currentView}
                onChange={(e) =>
                  onUpdate({
                    ...profile,
                    productUsage: {
                      ...profile.productUsage,
                      currentView: e.target.value
                    }
                  })
                }
                multiline
                rows={4}
                disabled={readonly}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Current Development Stages</InputLabel>
                <Select
                  multiple
                  value={profile.productUsage.currentStages}
                  onChange={(e) =>
                    onUpdate({
                      ...profile,
                      productUsage: {
                        ...profile.productUsage,
                        currentStages: e.target.value as string[]
                      }
                    })
                  }
                  disabled={readonly}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {DEVOPS_STAGES.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
