import { FormEvent } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  options?: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface FormSubmitHandler<T> {
  (values: T): Promise<void> | void;
}

export interface FormProps<T> {
  initialValues?: Partial<T>;
  onSubmit: FormSubmitHandler<T>;
  onCancel?: () => void;
  visible?: boolean;
}

export const handleFormSubmit = async <T>(
  event: FormEvent,
  values: T,
  onSubmit: FormSubmitHandler<T>
): Promise<void> => {
  event.preventDefault();
  try {
    await onSubmit(values);
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
};
