import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for token and user data
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get('token');
    const userData = params.get('user');
    const errorParam = params.get('error');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }

    if (authToken && userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        setToken(authToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setError(null);

        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Failed to parse user data');
      }
    }
  }, []);

  const login = () => {
    // Redirect to auth service login endpoint
    window.location.href = 'http://localhost:3000/api/auth/login';
  };

  const logout = () => {
    // Clear auth state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Store current URL for redirect back after logout
    const currentUrl = window.location.href;
    const encodedRedirect = encodeURIComponent(currentUrl);

    // Redirect to auth service logout
    window.location.href = `http://localhost:3000/api/auth/logout?returnTo=${encodedRedirect}`;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
