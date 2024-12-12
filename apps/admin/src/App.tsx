import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Table, Button, message, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, AppstoreOutlined, LoginOutlined, SyncOutlined } from '@ant-design/icons';
import { AppLayout, PageWrapper } from '@nexus360/ui';

const { Title } = Typography;

interface AzureADUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  mail?: string;
}

interface Application {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
}

interface UserAccess {
  application: Application;
  roles: string[];
  permissions: string[];
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

const App: React.FC = () => {
  const [users, setUsers] = useState<AzureADUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const [currentUser, setCurrentUser] = useState<AzureADUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Applications', path: '/applications' },
    { name: 'Settings', path: '/settings' }
  ];

  useEffect(() => {
    // Check URL parameters for auth token and user data
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        setAuthToken(token);
        setCurrentUser(user);
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        message.success(`Welcome, ${user.displayName}!`);
      } catch (error) {
        console.error('Error parsing user data:', error);
        message.error('Failed to load user data');
      }
    }
  }, []);

  const fetchAllUsers = async () => {
    if (!authToken) {
      message.error('Authentication required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      message.success(`Successfully fetched ${Array.isArray(data) ? data.length : 0} users`);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string = '') => {
    if (!authToken) {
      message.error('Authentication required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/users/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching users:', error);
      message.error('Failed to search users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccess = async (userId: string) => {
    if (!authToken) {
      message.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/users/${userId}/groups`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const groups = await response.json();
      setUserAccess(groups.map((group: string) => ({
        application: {
          id: group,
          name: group,
          enabled: true
        },
        roles: ['Member'],
        permissions: ['Access']
      })));
    } catch (error) {
      console.error('Error fetching user access:', error);
      message.error('Failed to fetch user access details');
    }
  };

  useEffect(() => {
    if (authToken) {
      searchUsers();
    }
  }, [authToken]);

  useEffect(() => {
    if (selectedUser && authToken) {
      fetchUserAccess(selectedUser);
    }
  }, [selectedUser, authToken]);

  const handleLogin = () => {
    window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
  };

  const columns: ColumnsType<AzureADUser> = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'userPrincipalName',
      key: 'userPrincipalName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type={selectedUser === record.id ? 'primary' : 'default'}
          onClick={() => setSelectedUser(record.id)}
        >
          View Access
        </Button>
      ),
    },
  ];

  const accessColumns: ColumnsType<UserAccess> = [
    {
      title: 'Application',
      dataIndex: ['application', 'name'],
      key: 'application',
      render: (text) => (
        <Space>
          <AppstoreOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <>
          {permissions.map((permission) => (
            <Tag color="green" key={permission}>
              {permission}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  const mappedUser = currentUser ? {
    name: currentUser.displayName,
    email: currentUser.userPrincipalName,
    avatar: undefined
  } : undefined;

  if (!authToken || !currentUser) {
    return (
      <Router>
        <AppLayout
          appName="Admin"
          menuItems={menuItems}
          onLogout={() => {/* Implement logout handler */}}
        >
          <PageWrapper title="Dashboard">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '60vh'
            }}>
              <div style={{ 
                textAlign: 'center',
                background: '#fff',
                padding: '48px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Title level={2}>Nexus360 Admin</Title>
                <Button 
                  type="primary" 
                  icon={<LoginOutlined />} 
                  size="large"
                  onClick={handleLogin}
                >
                  Login with Azure AD
                </Button>
              </div>
            </div>
          </PageWrapper>
        </AppLayout>
      </Router>
    );
  }

  return (
    <Router>
      <AppLayout
        appName="Admin"
        menuItems={menuItems}
        user={mappedUser}
        onLogout={() => {/* Implement logout handler */}}
      >
        <PageWrapper
          title="Dashboard"
          description="User Management & Access Control"
        >
          <div style={{ 
            background: '#fff', 
            padding: '24px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <Title level={4}>Azure AD Users</Title>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={fetchAllUsers}
                loading={loading}
              >
                Fetch All Users
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={users}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
            {selectedUser && (
              <div style={{ marginTop: '24px' }}>
                <Title level={4}>Application Access</Title>
                <Table
                  columns={accessColumns}
                  dataSource={userAccess}
                  rowKey={(record) => record.application.id}
                  pagination={false}
                />
              </div>
            )}
          </div>
        </PageWrapper>
      </AppLayout>
    </Router>
  );
};

export default App;
