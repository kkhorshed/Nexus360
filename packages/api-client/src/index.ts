import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '@nexus360/utils';

// Create a new axios instance with default config
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor for auth
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Handle token refresh or logout
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Default service URLs
const DEFAULT_AUTH_URL = 'http://localhost:3001/api';
const DEFAULT_INTEGRATION_URL = 'http://localhost:3002/api';
const DEFAULT_NOTIFICATION_URL = 'http://localhost:3003/api';

// Create API clients with environment-aware URLs
export const authApi = createApiClient(
  typeof process !== 'undefined' && process.env.VITE_AUTH_SERVICE_URL || 
  typeof window !== 'undefined' && (window as any).__ENV?.VITE_AUTH_SERVICE_URL || 
  DEFAULT_AUTH_URL
);

export const integrationApi = createApiClient(
  typeof process !== 'undefined' && process.env.VITE_INTEGRATION_HUB_URL || 
  typeof window !== 'undefined' && (window as any).__ENV?.VITE_INTEGRATION_HUB_URL || 
  DEFAULT_INTEGRATION_URL
);

export const notificationApi = createApiClient(
  typeof process !== 'undefined' && process.env.VITE_NOTIFICATION_SERVICE_URL || 
  typeof window !== 'undefined' && (window as any).__ENV?.VITE_NOTIFICATION_SERVICE_URL || 
  DEFAULT_NOTIFICATION_URL
);

// API utilities
export const createEndpoint = <T>(
  client: AxiosInstance,
  path: string
) => ({
  get: (config?: AxiosRequestConfig) => 
    client.get<ApiResponse<T>>(path, config).then(res => res.data),
  
  getById: (id: string | number, config?: AxiosRequestConfig) => 
    client.get<ApiResponse<T>>(`${path}/${id}`, config).then(res => res.data),
  
  create: (data: Partial<T>, config?: AxiosRequestConfig) => 
    client.post<ApiResponse<T>>(path, data, config).then(res => res.data),
  
  update: (id: string | number, data: Partial<T>, config?: AxiosRequestConfig) => 
    client.put<ApiResponse<T>>(`${path}/${id}`, data, config).then(res => res.data),
  
  delete: (id: string | number, config?: AxiosRequestConfig) => 
    client.delete<ApiResponse<void>>(`${path}/${id}`, config).then(res => res.data)
});

// Helper functions
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500
  };
};
