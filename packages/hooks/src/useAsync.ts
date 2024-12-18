import { useState, useCallback } from 'react';

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for handling async operations with loading, success, and error states
 * @param asyncFunction The async function to execute
 * @param immediate Whether to execute the function immediately
 * @returns Object containing status, data, error, execute and reset functions
 */
export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ status: 'pending', data: null, error: null });

      try {
        const response = await asyncFunction(...args);
        setState({ status: 'success', data: response, error: null });
      } catch (error) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  // Execute immediately if specified
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return {
    ...state,
    execute,
    reset,
  };
}

export default useAsync;
