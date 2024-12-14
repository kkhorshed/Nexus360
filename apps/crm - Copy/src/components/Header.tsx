import React, { useEffect, useState } from 'react';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface User {
  displayName: string;
  email: string;
  jobTitle?: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from URL parameters
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const token = params.get('token');

    if (userParam && token) {
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Parse and set user data
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        setUser(userData);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        // Remove params from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // Try to get user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // If there's an error, clear the storage and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = 'http://localhost:3006/api/auth/login';
        }
      } else {
        // No stored user data, redirect to login
        window.location.href = 'http://localhost:3006/api/auth/login';
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = 'http://localhost:3006/api/auth/login';
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 'bold' }}>{user?.displayName}</div>
          <div style={{ color: '#666' }}>{user?.email}</div>
          {user?.jobTitle && <div style={{ color: '#666' }}>{user.jobTitle}</div>}
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader style={{ 
      padding: '0 24px', 
      background: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{ margin: 0, fontSize: '20px' }}>Nexus360 CRM</h1>
      
      {user && (
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>{user.displayName}</span>
          </Space>
        </Dropdown>
      )}
    </AntHeader>
  );
};

export default Header;
