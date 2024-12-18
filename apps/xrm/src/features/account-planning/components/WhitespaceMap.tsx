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
  Rating,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { WhitespaceMap as WhitespaceMapType } from '../types';
import { DEVOPS_STAGES } from '../constants';

interface WhitespaceMapProps {
  whitespaceMap: WhitespaceMapType;
  onUpdate: (whitespaceMap: WhitespaceMapType) => void;
  readonly?: boolean;
}

interface VendorDialogState {
  open: boolean;
  stage: string;
  vendorIndex: number | null;
  vendor: {
    name: string;
    annualInvestment: number;
    contractRenewal: Date;
    satisfaction: number;
    painPoints: string[];
  };
}

export const WhitespaceMap: React.FC<WhitespaceMapProps> = ({
  whitespaceMap,
  onUpdate,
  readonly = false
}) => {
  const [vendorDialog, setVendorDialog] = useState<VendorDialogState>({
    open: false,
    stage: '',
    vendorIndex: null,
    vendor: {
      name: '',
      annualInvestment: 0,
      contractRenewal: new Date(),
      satisfaction: 3,
      painPoints: []
    }
  });

  const [newPainPoint, setNewPainPoint] = useState('');

  const handleAddVendor = (stage: string) => {
    setVendorDialog({
      open: true,
      stage,
      vendorIndex: null,
      vendor: {
        name: '',
        annualInvestment: 0,
        contractRenewal: new Date(),
        satisfaction: 3,
        painPoints: []
      }
    });
  };

  const handleEditVendor = (stage: string, vendorIndex: number) => {
    const stageData = whitespaceMap.technologyStack.find(s => s.stage === stage);
    if (stageData) {
      setVendorDialog({
        open: true,
        stage,
        vendorIndex,
        vendor: { ...stageData.currentVendors[vendorIndex] }
      });
    }
  };

  const handleDeleteVendor = (stage: string, vendorIndex: number) => {
    const updatedStack = whitespaceMap.technologyStack.map(s => {
      if (s.stage === stage) {
        return {
          ...s,
          currentVendors: s.currentVendors.filter((_, i) => i !== vendorIndex)
        };
      }
      return s;
    });
    onUpdate({ ...whitespaceMap, technologyStack: updatedStack });
  };

  const handleSaveVendor = () => {
    const updatedStack = whitespaceMap.technologyStack.map(s => {
      if (s.stage === vendorDialog.stage) {
        const updatedVendors = [...s.currentVendors];
        if (vendorDialog.vendorIndex !== null) {
          updatedVendors[vendorDialog.vendorIndex] = vendorDialog.vendor;
        } else {
          updatedVendors.push(vendorDialog.vendor);
        }
        return { ...s, currentVendors: updatedVendors };
      }
      return s;
    });
    onUpdate({ ...whitespaceMap, technologyStack: updatedStack });
    setVendorDialog({ ...vendorDialog, open: false });
  };

  const handleAddPainPoint = () => {
    if (newPainPoint.trim()) {
      setVendorDialog({
        ...vendorDialog,
        vendor: {
          ...vendorDialog.vendor,
          painPoints: [...vendorDialog.vendor.painPoints, newPainPoint.trim()]
        }
      });
      setNewPainPoint('');
    }
  };

  const handleDeletePainPoint = (index: number) => {
    setVendorDialog({
      ...vendorDialog,
      vendor: {
        ...vendorDialog.vendor,
        painPoints: vendorDialog.vendor.painPoints.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Whitespace Map
        </Typography>

        {/* Technology Stack Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Technology Stack Analysis
          </Typography>
          
          {DEVOPS_STAGES.map(stage => {
            const stageData = whitespaceMap.technologyStack.find(s => s.stage === stage) || {
              stage,
              currentVendors: []
            };

            return (
              <Box key={stage} mb={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1">{stage}</Typography>
                  {!readonly && (
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddVendor(stage)}
                    >
                      Add Vendor
                    </Button>
                  )}
                </Stack>

                <List>
                  {stageData.currentVendors.map((vendor, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle2">{vendor.name}</Typography>
                            <Rating value={vendor.satisfaction} readOnly size="small" />
                          </Stack>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Annual Investment: ${vendor.annualInvestment.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Contract Renewal: {new Date(vendor.contractRenewal).toLocaleDateString()}
                            </Typography>
                            {vendor.painPoints.length > 0 && (
                              <Stack direction="row" spacing={1} mt={1}>
                                {vendor.painPoints.map((point, i) => (
                                  <Chip key={i} label={point} size="small" color="warning" />
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
                            onClick={() => handleEditVendor(stage, index)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteVendor(stage, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            );
          })}
        </Box>

        {/* Vendor Dialog */}
        <Dialog
          open={vendorDialog.open}
          onClose={() => setVendorDialog({ ...vendorDialog, open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {vendorDialog.vendorIndex !== null ? 'Edit Vendor' : 'Add Vendor'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vendor Name"
                  value={vendorDialog.vendor.name}
                  onChange={(e) =>
                    setVendorDialog({
                      ...vendorDialog,
                      vendor: { ...vendorDialog.vendor, name: e.target.value }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Annual Investment ($)"
                  value={vendorDialog.vendor.annualInvestment}
                  onChange={(e) =>
                    setVendorDialog({
                      ...vendorDialog,
                      vendor: {
                        ...vendorDialog.vendor,
                        annualInvestment: Number(e.target.value)
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Contract Renewal Date"
                  value={new Date(vendorDialog.vendor.contractRenewal).toISOString().split('T')[0]}
                  onChange={(e) =>
                    setVendorDialog({
                      ...vendorDialog,
                      vendor: {
                        ...vendorDialog.vendor,
                        contractRenewal: new Date(e.target.value)
                      }
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Satisfaction Level</Typography>
                <Rating
                  value={vendorDialog.vendor.satisfaction}
                  onChange={(_, newValue) =>
                    setVendorDialog({
                      ...vendorDialog,
                      vendor: {
                        ...vendorDialog.vendor,
                        satisfaction: newValue || 0
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Pain Points</Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    placeholder="Add pain point"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddPainPoint}
                    disabled={!newPainPoint.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {vendorDialog.vendor.painPoints.map((point, index) => (
                    <Chip
                      key={index}
                      label={point}
                      onDelete={() => handleDeletePainPoint(index)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVendorDialog({ ...vendorDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSaveVendor} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
