import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './hooks';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
  getAuthHeaders: () => { [key: string]: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
