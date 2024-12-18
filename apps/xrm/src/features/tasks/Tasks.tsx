import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TaskCard, TaskForm } from './components';
import { TASK_COLUMNS } from './constants';
import { formatDate, getStatusColor, getPriorityColor } from './utils/helpers';
import { useTasksView, useTaskFiltering } from './hooks';
import PageWrapper from '../../components/common/PageWrapper';
import RightDrawer from '../../components/common/RightDrawer';
import { DataFilter, applyFilters } from '../../components/common/DataFilter';

export default function Tasks() {
  const {
    tasks,
    view,
    formDrawerOpen,
    filterDrawerOpen,
    editingTask,
    setView,
    handleAddClick,
    handleEditClick,
    handleFormClose,
    handleSubmit,
    handleDeleteTask,
    handleFilterDrawerToggle,
  } = useTasksView();

  const {
    filters,
    activeConditions,
    handleFilterChange,
    setActiveConditions,
  } = useTaskFiltering();

  const filteredTasks = useMemo(() => {
    return applyFilters(tasks, activeConditions, (task, field) => {
      const value = task[field];
      return value !== undefined ? String(value) : '';
    });
  }, [tasks, activeConditions]);

  const renderCardView = () => (
    <Grid container spacing={3}>
      {filteredTasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <Paper 
            elevation={2}
            sx={{
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
          >
            <TaskCard
              task={task}
              onUpdate={() => handleEditClick(task)}
              onDelete={handleDeleteTask}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <Paper elevation={2}>
      <List>
        {filteredTasks.map((task, index) => (
          <React.Fragment key={task.id}>
            {index > 0 && <Divider />}
            <ListItem
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <AssignmentIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Chip
                      size="small"
                      label={task.status.replace('_', ' ')}
                      color={getStatusColor(task.status)}
                    />
                    <Chip
                      size="small"
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Due: {formatDate(task.dueDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assigned to: {task.assignedTo}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit task">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleEditClick(task)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  return (
    <PageWrapper
      title="Tasks"
      description="Organize and track your team's tasks and activities"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter tasks">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterDrawerToggle}
              color={Object.keys(filters).length > 0 ? "primary" : "inherit"}
            >
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </Button>
          </Tooltip>
          <Tooltip title={view === 'card' ? 'Switch to list view' : 'Switch to card view'}>
            <Button
              variant="outlined"
              onClick={() => setView(view === 'card' ? 'list' : 'card')}
            >
              {view === 'card' ? <ViewListIcon /> : <ViewModuleIcon />}
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Task
          </Button>
        </Box>
      }
    >
      {view === 'card' ? renderCardView() : renderListView()}

      <RightDrawer
        open={filterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        title="Filter Tasks"
      >
        <DataFilter
          currentFilters={filters}
          onFilterLoad={handleFilterChange}
          columns={TASK_COLUMNS}
          data={tasks}
          storageKey="taskTableFilters"
        />
      </RightDrawer>

      <RightDrawer
        open={formDrawerOpen}
        onClose={handleFormClose}
        title={editingTask ? 'Edit Task' : 'Add Task'}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleFormClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
