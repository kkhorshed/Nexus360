import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { ActionPlan as ActionPlanType } from '../types';
import { ACTION_STATUS } from '../constants';

interface ActionPlanProps {
  actionPlan: ActionPlanType;
  onUpdate: (actionPlan: ActionPlanType) => void;
  readonly?: boolean;
}

interface ObjectiveDialogState {
  open: boolean;
  editIndex: number | null;
  objective: {
    id: string;
    description: string;
    actions: {
      id: string;
      description: string;
      assignee: string;
      dueDate: Date;
      status: typeof ACTION_STATUS[number];
      resources: string[];
    }[];
  };
}

interface ActionDialogState {
  open: boolean;
  objectiveIndex: number;
  editIndex: number | null;
  action: {
    id: string;
    description: string;
    assignee: string;
    dueDate: Date;
    status: typeof ACTION_STATUS[number];
    resources: string[];
  };
}

export const ActionPlan: React.FC<ActionPlanProps> = ({
  actionPlan,
  onUpdate,
  readonly = false
}) => {
  const [objectiveDialog, setObjectiveDialog] = useState<ObjectiveDialogState>({
    open: false,
    editIndex: null,
    objective: {
      id: '',
      description: '',
      actions: []
    }
  });

  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    open: false,
    objectiveIndex: -1,
    editIndex: null,
    action: {
      id: '',
      description: '',
      assignee: '',
      dueDate: new Date(),
      status: 'Not Started',
      resources: []
    }
  });

  const [newResource, setNewResource] = useState('');

  const handleAddObjective = () => {
    setObjectiveDialog({
      open: true,
      editIndex: null,
      objective: {
        id: Date.now().toString(),
        description: '',
        actions: []
      }
    });
  };

  const handleEditObjective = (index: number) => {
    setObjectiveDialog({
      open: true,
      editIndex: index,
      objective: { ...actionPlan.objectives[index] }
    });
  };

  const handleDeleteObjective = (index: number) => {
    const updatedObjectives = actionPlan.objectives.filter((_, i) => i !== index);
    onUpdate({ ...actionPlan, objectives: updatedObjectives });
  };

  const handleSaveObjective = () => {
    const updatedObjectives = [...actionPlan.objectives];
    if (objectiveDialog.editIndex !== null) {
      updatedObjectives[objectiveDialog.editIndex] = objectiveDialog.objective;
    } else {
      updatedObjectives.push(objectiveDialog.objective);
    }
    onUpdate({ ...actionPlan, objectives: updatedObjectives });
    setObjectiveDialog({ ...objectiveDialog, open: false });
  };

  const handleAddAction = (objectiveIndex: number) => {
    setActionDialog({
      open: true,
      objectiveIndex,
      editIndex: null,
      action: {
        id: Date.now().toString(),
        description: '',
        assignee: '',
        dueDate: new Date(),
        status: 'Not Started',
        resources: []
      }
    });
  };

  const handleEditAction = (objectiveIndex: number, actionIndex: number) => {
    setActionDialog({
      open: true,
      objectiveIndex,
      editIndex: actionIndex,
      action: { ...actionPlan.objectives[objectiveIndex].actions[actionIndex] }
    });
  };

  const handleDeleteAction = (objectiveIndex: number, actionIndex: number) => {
    const updatedObjectives = [...actionPlan.objectives];
    updatedObjectives[objectiveIndex].actions = updatedObjectives[objectiveIndex].actions.filter(
      (_, i) => i !== actionIndex
    );
    onUpdate({ ...actionPlan, objectives: updatedObjectives });
  };

  const handleSaveAction = () => {
    const updatedObjectives = [...actionPlan.objectives];
    if (actionDialog.editIndex !== null) {
      updatedObjectives[actionDialog.objectiveIndex].actions[actionDialog.editIndex] =
        actionDialog.action;
    } else {
      updatedObjectives[actionDialog.objectiveIndex].actions.push(actionDialog.action);
    }
    onUpdate({ ...actionPlan, objectives: updatedObjectives });
    setActionDialog({ ...actionDialog, open: false });
  };

  const handleAddResource = () => {
    if (newResource.trim()) {
      setActionDialog({
        ...actionDialog,
        action: {
          ...actionDialog.action,
          resources: [...actionDialog.action.resources, newResource.trim()]
        }
      });
      setNewResource('');
    }
  };

  const handleDeleteResource = (index: number) => {
    setActionDialog({
      ...actionDialog,
      action: {
        ...actionDialog.action,
        resources: actionDialog.action.resources.filter((_, i) => i !== index)
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Action Plan</Typography>
          {!readonly && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddObjective}
            >
              Add Objective
            </Button>
          )}
        </Stack>

        {actionPlan.objectives.map((objective, objectiveIndex) => (
          <Accordion key={objective.id} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                pr={4}
              >
                <Typography variant="subtitle1">{objective.description}</Typography>
                {!readonly && (
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditObjective(objectiveIndex);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteObjective(objectiveIndex);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {!readonly && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddAction(objectiveIndex)}
                  sx={{ mb: 2 }}
                >
                  Add Action
                </Button>
              )}
              <List>
                {objective.actions.map((action, actionIndex) => (
                  <ListItem key={action.id} divider>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="subtitle2">{action.description}</Typography>
                          <Chip
                            label={action.status}
                            size="small"
                            color={getStatusColor(action.status) as any}
                          />
                        </Stack>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Assignee: {action.assignee}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Due Date: {new Date(action.dueDate).toLocaleDateString()}
                          </Typography>
                          {action.resources.length > 0 && (
                            <Stack direction="row" spacing={1} mt={1}>
                              {action.resources.map((resource, i) => (
                                <Chip
                                  key={i}
                                  size="small"
                                  icon={<AssignmentIcon />}
                                  label={resource}
                                />
                              ))}
                            </Stack>
                          )}
                        </Box>
                      }
                    />
                    {!readonly && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditAction(objectiveIndex, actionIndex)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAction(objectiveIndex, actionIndex)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Objective Dialog */}
        <Dialog
          open={objectiveDialog.open}
          onClose={() => setObjectiveDialog({ ...objectiveDialog, open: false })}
        >
          <DialogTitle>
            {objectiveDialog.editIndex !== null ? 'Edit Objective' : 'Add Objective'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Description"
              value={objectiveDialog.objective.description}
              onChange={(e) =>
                setObjectiveDialog({
                  ...objectiveDialog,
                  objective: {
                    ...objectiveDialog.objective,
                    description: e.target.value
                  }
                })
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setObjectiveDialog({ ...objectiveDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSaveObjective} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ ...actionDialog, open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {actionDialog.editIndex !== null ? 'Edit Action' : 'Add Action'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={actionDialog.action.description}
                  onChange={(e) =>
                    setActionDialog({
                      ...actionDialog,
                      action: { ...actionDialog.action, description: e.target.value }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assignee"
                  value={actionDialog.action.assignee}
                  onChange={(e) =>
                    setActionDialog({
                      ...actionDialog,
                      action: { ...actionDialog.action, assignee: e.target.value }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  value={new Date(actionDialog.action.dueDate).toISOString().split('T')[0]}
                  onChange={(e) =>
                    setActionDialog({
                      ...actionDialog,
                      action: {
                        ...actionDialog.action,
                        dueDate: new Date(e.target.value)
                      }
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={actionDialog.action.status}
                    label="Status"
                    onChange={(e) =>
                      setActionDialog({
                        ...actionDialog,
                        action: {
                          ...actionDialog.action,
                          status: e.target.value as typeof ACTION_STATUS[number]
                        }
                      })
                    }
                  >
                    {ACTION_STATUS.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Resources</Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="Add resource"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddResource}
                    disabled={!newResource.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {actionDialog.action.resources.map((resource, index) => (
                    <Chip
                      key={index}
                      label={resource}
                      onDelete={() => handleDeleteResource(index)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ ...actionDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSaveAction} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
