import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '@nexus360/api-client';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRoles = [],
  redirectPath = '/login'
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.get('/auth/me');
        setIsAuthenticated(true);
        setUserRoles(response.data.roles || []);
      } catch (error) {
        setIsAuthenticated(false);
        setUserRoles([]);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(role => userRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
