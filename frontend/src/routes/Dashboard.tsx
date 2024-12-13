import React, { useEffect, useState } from 'react';
import { Card, Typography, Layout, Menu, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;

interface UserProfile {
  name: string;
  email: string;
  roles: string[];
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      try {
        // Get token from URL hash or localStorage
        const hashToken = location.hash.split('token=')[1];
        const storedToken = localStorage.getItem('auth_token');
        const token = hashToken || storedToken;
        
        if (!token) {
          navigate('/login');
          return;
        }

        // Store token if it came from URL hash
        if (hashToken) {
          localStorage.setItem('auth_token', hashToken);
          // Clean up URL
          window.location.hash = '';
        }

        // Fetch user profile
        const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        const data = await response.json();
        if (data.authenticated) {
          setUserProfile(data.user);
        } else {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        message.error('Authentication failed');
        navigate('/login');
      }
    };

    init();
  }, [location.hash, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = `${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/logout`;
  };

  if (!userProfile) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/cequens-logo.svg" alt="Logo" style={{ height: '32px' }} />
          <Title level={4} style={{ margin: 0 }}>CRM Dashboard</Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text>{userProfile.name}</Text>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            type="text"
          >
            Logout
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'companies', label: 'Companies' },
              { key: 'contacts', label: 'Contacts' },
              { key: 'deals', label: 'Deals' },
              { key: 'products', label: 'Products' },
              { key: 'teams', label: 'Teams' }
            ]}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content>
            <Card>
              <Title level={3}>Welcome, {userProfile.name}!</Title>
              <Text>You are logged in as {userProfile.email}</Text>
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary">Roles: {userProfile.roles.join(', ')}</Text>
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
