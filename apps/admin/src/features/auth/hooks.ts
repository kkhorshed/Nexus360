import { useState, useCallback, useEffect } from 'react';

interface User {
  id: string;
  displayName: string;
  email: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const AUTH_SERVICE_URL = 'http://localhost:3000';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      isAuthenticated: !!token,
      user,
      token
    };
  });

  useEffect(() => {
    // Check URL parameters for token and user data
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Update state
        setAuthState({
          isAuthenticated: true,
          user,
          token
        });
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const login = useCallback(async () => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/url`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }, []);

  return {
    ...authState,
    login,
    logout,
    getAuthHeaders
  };
};
