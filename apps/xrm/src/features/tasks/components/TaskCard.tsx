import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { TaskCardProps } from '../types';
import { priorityColors, statusColors } from '../constants';
import { formatDate } from '../utils/helpers';

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onUpdate();
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    handleMenuClose();
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
        },
      }}>
        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography variant="h6" component="h2" sx={{ pr: 4 }}>
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={task.status.replace('_', ' ')}
                  color={statusColors[task.status]}
                  size="small"
                />
                <Chip
                  label={task.priority}
                  color={priorityColors[task.priority]}
                  size="small"
                />
              </Box>
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Due: {formatDate(task.dueDate)}
            </Typography>

            {task.assignedTo && (
              <Typography variant="body2" color="text.secondary">
                Assigned to: {task.assignedTo}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
