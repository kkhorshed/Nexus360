import { useState, useEffect } from 'react';
import { authApi } from '@nexus360/api-client';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
}

interface AuthUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  avatar?: string;
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

export const useSharedAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
    user: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check URL parameters for new tokens
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userParam = params.get('user');

        // If found in URL, save and use them
        if (token && userParam) {
          const userData = JSON.parse(userParam) as AuthUser;
          
          // Store in localStorage
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', userParam);

          // Clean up URL parameters
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);

          setAuth({
            isAuthenticated: true,
            isLoading: false,
            token,
            user: {
              id: userData.id,
              name: userData.displayName,
              email: userData.userPrincipalName,
              avatar: userData.avatar
            }
          });
          return;
        }

        // If not in URL, check localStorage
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken) {
          try {
            // Verify token with auth service
            const response = await authApi.get('/users/me', {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            
            // Check if we got a new token from a refresh
            const newToken = response.data.token;
            if (newToken) {
              localStorage.setItem('auth_token', newToken);
            }

            const userData = response.data.user || response.data;
            setAuth({
              isAuthenticated: true,
              isLoading: false,
              token: newToken || storedToken,
              user: {
                id: userData.id,
                name: userData.displayName,
                email: userData.userPrincipalName,
                avatar: userData.avatar
              }
            });
            return;
          } catch (error) {
            // If token is invalid or expired and refresh failed, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }

        // No valid token found anywhere, redirect to login
        const currentUrl = window.location.href;
        window.location.href = `${AUTH_SERVICE_URL}/api/auth/login?returnTo=${encodeURIComponent(currentUrl)}`;
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuth({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          user: null
        });
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      // Clear all auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      setAuth({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null
      });

      // Call auth service logout endpoint
      const currentUrl = window.location.href;
      window.location.href = `${AUTH_SERVICE_URL}/api/auth/logout?returnTo=${encodeURIComponent(currentUrl)}`;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { ...auth, logout };
};
