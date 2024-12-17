export const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
} as const;

export const statusColors = {
  todo: 'default',
  in_progress: 'primary',
  completed: 'success',
} as const;

export const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const TASK_COLUMNS = [
  { id: 'title', label: 'Title', numeric: false },
  { id: 'description', label: 'Description', numeric: false },
  { id: 'status', label: 'Status', numeric: false },
  { id: 'priority', label: 'Priority', numeric: false },
  { id: 'dueDate', label: 'Due Date', numeric: false },
  { id: 'assignedTo', label: 'Assigned To', numeric: false },
];
