import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout, PageWrapper, DataCard, DataTable } from '@nexus360/ui';
import type { ColumnsType } from 'antd/es/table';

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

interface Contact {
  name: string;
  email: string;
  company: string;
  status: string;
  lastContact: string;
  value: number;
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

const menuItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Contacts', path: '/contacts' },
  { name: 'Leads', path: '/leads' },
  { name: 'Reports', path: '/reports' }
];

function App() {
  const [user, setUser] = useState<User | null>(null);

  const columns: ColumnsType<Contact> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      sorter: (a, b) => a.company.localeCompare(b.company)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          status === 'Active' ? 'bg-green-100 text-green-800' :
          status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      title: 'Last Contact',
      dataIndex: 'lastContact',
      key: 'lastContact'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.value - b.value
    }
  ];

  const contactData: Contact[] = [
    {
      name: 'John Doe',
      email: 'john.doe@company.com',
      company: 'Tech Corp',
      status: 'Active',
      lastContact: '2024-01-15',
      value: 50000
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@enterprise.com',
      company: 'Enterprise Ltd',
      status: 'Pending',
      lastContact: '2024-01-14',
      value: 75000
    },
    {
      name: 'Bob Wilson',
      email: 'bob.wilson@startup.com',
      company: 'Startup Inc',
      status: 'Active',
      lastContact: '2024-01-13',
      value: 25000
    }
  ];

  useEffect(() => {
    // Check if we have auth token in URL params (redirected from auth service)
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (!authToken && !userParam) {
      window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
      return;
    }

    if (userParam) {
      try {
        const userData = JSON.parse(userParam);
        setUser({
          name: userData.displayName,
          email: userData.userPrincipalName,
          avatar: userData.avatar
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear auth token and user data
    window.location.href = `${AUTH_SERVICE_URL}/api/auth/login`;
  };

  return (
    <AppLayout 
      appName="CRM"
      menuItems={menuItems}
      user={user || undefined}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={
          <PageWrapper
            title="Dashboard"
            description="Overview of key metrics and activities"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <DataCard
                title="Total Contacts"
                value="1,234"
                trend={{
                  value: 15,
                  direction: 'up'
                }}
                className="bg-white shadow-md rounded-lg p-4"
              />
              <DataCard
                title="Active Leads"
                value="567"
                trend={{
                  value: 23,
                  direction: 'up'
                }}
                className="bg-white shadow-md rounded-lg p-4"
              />
              <DataCard
                title="Total Value"
                value="$150K"
                trend={{
                  value: 8,
                  direction: 'up'
                }}
                className="bg-white shadow-md rounded-lg p-4"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Recent Contacts</h2>
              <DataTable<Contact>
                data={contactData}
                columns={columns}
                rowKey="email"
                className="bg-white shadow-md rounded-lg"
              />
            </div>
          </PageWrapper>
        } />
        <Route path="/contacts" element={
          <PageWrapper
            title="Contacts"
            description="Manage your customer contacts"
          >
            <div>Contacts Content</div>
          </PageWrapper>
        } />
        <Route path="/leads" element={
          <PageWrapper
            title="Leads"
            description="Track and manage potential opportunities"
          >
            <div>Leads Content</div>
          </PageWrapper>
        } />
        <Route path="/reports" element={
          <PageWrapper
            title="Reports"
            description="Analytics and performance reports"
          >
            <div>Reports Content</div>
          </PageWrapper>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
