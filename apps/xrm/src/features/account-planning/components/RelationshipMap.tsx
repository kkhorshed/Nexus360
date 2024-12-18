import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
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
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccountTree as AccountTreeIcon
} from '@mui/icons-material';
import { RelationshipMap as RelationshipMapType } from '../types';
import { INFLUENCE_LEVELS, SENTIMENT_TYPES, EXTERNAL_INFLUENCER_TYPES } from '../constants';

interface RelationshipMapProps {
  relationshipMap: RelationshipMapType;
  onUpdate: (relationshipMap: RelationshipMapType) => void;
  readonly?: boolean;
}

interface ContactDialogState {
  open: boolean;
  editIndex: number | null;
  contact: RelationshipMapType['contacts'][0];
}

export const RelationshipMap: React.FC<RelationshipMapProps> = ({
  relationshipMap,
  onUpdate,
  readonly = false
}) => {
  const [contactDialog, setContactDialog] = useState<ContactDialogState>({
    open: false,
    editIndex: null,
    contact: {
      id: '',
      name: '',
      role: '',
      influence: 'Medium',
      sentiment: 'Neutral',
      businessUnit: '',
      relationships: []
    }
  });

  const handleAddContact = () => {
    setContactDialog({
      open: true,
      editIndex: null,
      contact: {
        id: Date.now().toString(),
        name: '',
        role: '',
        influence: 'Medium',
        sentiment: 'Neutral',
        businessUnit: '',
        relationships: []
      }
    });
  };

  const handleEditContact = (index: number) => {
    setContactDialog({
      open: true,
      editIndex: index,
      contact: { ...relationshipMap.contacts[index] }
    });
  };

  const handleDeleteContact = (index: number) => {
    const updatedContacts = relationshipMap.contacts.filter((_, i) => i !== index);
    onUpdate({
      ...relationshipMap,
      contacts: updatedContacts
    });
  };

  const handleSaveContact = () => {
    const updatedContacts = [...relationshipMap.contacts];
    if (contactDialog.editIndex !== null) {
      updatedContacts[contactDialog.editIndex] = contactDialog.contact;
    } else {
      updatedContacts.push(contactDialog.contact);
    }
    onUpdate({
      ...relationshipMap,
      contacts: updatedContacts
    });
    setContactDialog({ ...contactDialog, open: false });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Promoter':
        return 'success';
      case 'Detractor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'High':
        return 'primary';
      case 'Medium':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Relationship & Influence Map
        </Typography>

        {/* Contacts Section */}
        <Box mb={4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Key Contacts</Typography>
            {!readonly && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddContact}
              >
                Add Contact
              </Button>
            )}
          </Stack>

          <List>
            {relationshipMap.contacts.map((contact, index) => (
              <ListItem key={contact.id} divider>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">{contact.name}</Typography>
                      <Chip
                        label={contact.sentiment}
                        size="small"
                        color={getSentimentColor(contact.sentiment) as any}
                      />
                      <Chip
                        label={`Influence: ${contact.influence}`}
                        size="small"
                        color={getInfluenceColor(contact.influence) as any}
                      />
                    </Stack>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {contact.role} - {contact.businessUnit}
                      </Typography>
                      {contact.relationships.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="caption" color="textSecondary">
                            Related Contacts:
                          </Typography>
                          <Stack direction="row" spacing={1} mt={0.5}>
                            {contact.relationships.map((rel, i) => (
                              <Chip
                                key={i}
                                size="small"
                                icon={<AccountTreeIcon />}
                                label={relationshipMap.contacts.find(c => c.id === rel.contactId)?.name || 'Unknown'}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  }
                />
                {!readonly && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditContact(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteContact(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Contact Dialog */}
        <Dialog open={contactDialog.open} onClose={() => setContactDialog({ ...contactDialog, open: false })}>
          <DialogTitle>
            {contactDialog.editIndex !== null ? 'Edit Contact' : 'Add Contact'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={contactDialog.contact.name}
                  onChange={(e) =>
                    setContactDialog({
                      ...contactDialog,
                      contact: { ...contactDialog.contact, name: e.target.value }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  value={contactDialog.contact.role}
                  onChange={(e) =>
                    setContactDialog({
                      ...contactDialog,
                      contact: { ...contactDialog.contact, role: e.target.value }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Influence</InputLabel>
                  <Select
                    value={contactDialog.contact.influence}
                    label="Influence"
                    onChange={(e) =>
                      setContactDialog({
                        ...contactDialog,
                        contact: {
                          ...contactDialog.contact,
                          influence: e.target.value as typeof INFLUENCE_LEVELS[number]
                        }
                      })
                    }
                  >
                    {INFLUENCE_LEVELS.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sentiment</InputLabel>
                  <Select
                    value={contactDialog.contact.sentiment}
                    label="Sentiment"
                    onChange={(e) =>
                      setContactDialog({
                        ...contactDialog,
                        contact: {
                          ...contactDialog.contact,
                          sentiment: e.target.value as typeof SENTIMENT_TYPES[number]
                        }
                      })
                    }
                  >
                    {SENTIMENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Unit"
                  value={contactDialog.contact.businessUnit}
                  onChange={(e) =>
                    setContactDialog({
                      ...contactDialog,
                      contact: {
                        ...contactDialog.contact,
                        businessUnit: e.target.value
                      }
                    })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialog({ ...contactDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
