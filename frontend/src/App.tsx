import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Typography, theme } from 'antd';
import { AppLauncher, UserProfile } from '@nexus360/ui';

const { Header, Content } = Layout;
const { Title } = Typography;

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

function App() {
  const { token } = theme.useToken();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have auth token in URL params (redirected from auth service)
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (!authToken && !userParam) {
      // Check if we have stored auth data
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken || !storedUser) {
        window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
      }
    } else if (authToken && userParam) {
      try {
        const userData = JSON.parse(userParam);
        const user = {
          name: userData.displayName,
          email: userData.userPrincipalName,
          avatar: userData.avatar
        };
        
        // Store auth data
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        
        // Clear URL parameters and navigate to the same path
        navigate(location.pathname, { replace: true });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate, location]);

  const handleLogout = () => {
    // Clear auth token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
  };

  const MainLayout = () => (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 24px',
          background: token.colorPrimary,
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          justifyContent: 'space-between'
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Nexus360
        </Title>
        {user && (
          <UserProfile 
            user={user}
            onLogout={handleLogout}
          />
        )}
      </Header>
      <Content 
        style={{ 
          padding: '24px',
          marginTop: 64,
          background: token.colorBgLayout
        }}
      >
        <div style={{ 
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px',
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow
        }}>
          <Title 
            level={2}
            style={{ 
              textAlign: 'center',
              marginBottom: 48,
              color: token.colorTextHeading
            }}
          >
            Welcome to Nexus360 Platform
          </Title>
          <AppLauncher />
        </div>
      </Content>
    </Layout>
  );

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
