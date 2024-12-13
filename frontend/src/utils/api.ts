import { BaseResponse, QueryParams } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestConfig extends RequestInit {
  params?: QueryParams;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson ? data.message : 'An error occurred';
    throw new ApiError(response.status, message);
  }

  return data as T;
}

function buildUrl(endpoint: string, params?: QueryParams): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }

  return url.toString();
}

export const api = {
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
      ...requestConfig,
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
      ...requestConfig,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
      ...requestConfig,
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
      ...requestConfig,
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse<T>(response);
  },
};

// Common API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  deals: {
    base: '/deals',
    byId: (id: string) => `/deals/${id}`,
  },
  products: {
    base: '/products',
    byId: (id: string) => `/products/${id}`,
  },
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
  },
};

// API hooks
export function useApiRequest<T>() {
  const makeRequest = async (
    method: keyof typeof api,
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<BaseResponse<T>> => {
    try {
      return await api[method](endpoint, data, config);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };

  return makeRequest;
}
