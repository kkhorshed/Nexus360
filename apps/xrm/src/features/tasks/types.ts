export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo?: string;
  [key: string]: string | undefined; // Add index signature for DataFilter compatibility
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo?: string;
}

export interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: (taskId: string) => void;
}

export interface TaskFormProps {
  initialData?: Task;
  onSubmit: (task: Task | TaskFormData) => void;
  onCancel: () => void;
}
