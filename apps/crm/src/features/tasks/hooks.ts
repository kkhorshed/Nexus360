import { useState } from 'react';
import { Task, TaskFormData } from './types';
import { mockTasks } from './data/mockData';

interface UseTasksViewReturn {
  tasks: Task[];
  view: 'card' | 'list';
  formDrawerOpen: boolean;
  filterDrawerOpen: boolean;
  editingTask: Task | undefined;
  setView: (view: 'card' | 'list') => void;
  handleAddClick: () => void;
  handleEditClick: (task: Task) => void;
  handleFormClose: () => void;
  handleSubmit: (taskData: Task | TaskFormData) => void;
  handleDeleteTask: (taskId: string) => void;
  handleFilterDrawerToggle: () => void;
}

export const useTasksView = (): UseTasksViewReturn => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [view, setView] = useState<'card' | 'list'>('card');
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddClick = () => {
    setEditingTask(undefined);
    setFormDrawerOpen(true);
  };

  const handleFormClose = () => {
    setFormDrawerOpen(false);
    setEditingTask(undefined);
  };

  const handleSubmit = (taskData: Task | TaskFormData) => {
    if ('id' in taskData) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === taskData.id ? taskData as Task : task
      ));
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
      };
      setTasks([...tasks, newTask]);
    }
    handleFormClose();
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormDrawerOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  return {
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
  };
};

interface UseTaskFilteringReturn {
  filters: Record<string, any>;
  activeConditions: any[];
  handleFilterChange: (newFilters: Record<string, any>) => void;
  setActiveConditions: (conditions: any[]) => void;
}

export const useTaskFiltering = (): UseTaskFilteringReturn => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [activeConditions, setActiveConditions] = useState<any[]>([]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  return {
    filters,
    activeConditions,
    handleFilterChange,
    setActiveConditions,
  };
};
