import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@nexus360/ui';

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

const menuItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Contacts', path: '/contacts' },
  { name: 'Leads', path: '/leads' },
  { name: 'Reports', path: '/reports' }
];

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if we have auth token in URL params (redirected from auth service)
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (!authToken && !userParam) {
      window.location.href = 'http://localhost:3006/api/auth/login';
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
    window.location.href = 'http://localhost:3006/api/auth/login';
  };

  return (
    <AppLayout 
      appName="CRM"
      menuItems={menuItems}
      user={user || undefined}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<div>Dashboard Content</div>} />
        <Route path="/contacts" element={<div>Contacts Content</div>} />
        <Route path="/leads" element={<div>Leads Content</div>} />
        <Route path="/reports" element={<div>Reports Content</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
