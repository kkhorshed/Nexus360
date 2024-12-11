import React from 'react';
import { FormProps, FormField, handleFormSubmit } from '../../utils/forms';
import { useAsync } from '../../utils/hooks';

interface SharedFormProps<T> extends FormProps<T> {
  fields: FormField[];
  title?: string;
}

export function Form<T extends Record<string, any>>({
  fields,
  initialValues = {} as Partial<T>,
  onSubmit,
  onCancel,
  title,
  visible = true
}: SharedFormProps<T>) {
  const [values, setValues] = React.useState<Partial<T>>(initialValues);
  const { status, error, execute } = useAsync(async () => {
    await onSubmit(values as T);
  }, false);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute();
  };

  if (!visible) return null;

  return (
    <form onSubmit={handleSubmitWrapper} className="space-y-4">
      {title && (
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      )}
      
      {fields.map((field) => (
        <div key={field.name} className="form-field">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={values[field.name as keyof T] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={values[field.name as keyof T] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={values[field.name as keyof T] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          )}
        </div>
      ))}

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error.message}
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={status === 'pending'}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {status === 'pending' ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
