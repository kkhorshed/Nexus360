/**
 * Gets the color for a task status
 */
export const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'todo':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Gets the color for a task priority
 */
export const getPriorityColor = (priority: string): 'error' | 'warning' | 'info' | 'default' => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Formats a date string to a localized date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Gets the initial date for new tasks (today's date in YYYY-MM-DD format)
 */
export const getInitialDueDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Sorts tasks by due date
 */
export const sortTasksByDueDate = <T extends { dueDate: string }>(tasks: T[]): T[] => {
  return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

/**
 * Filters tasks by status
 */
export const filterTasksByStatus = <T extends { status: string }>(
  tasks: T[],
  status: string
): T[] => {
  return tasks.filter(task => task.status === status);
};
