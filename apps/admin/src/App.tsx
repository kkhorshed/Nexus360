import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import Layout from './components/layout/Layout';
import Users from './features/users/Users';
import Roles from './features/roles/Roles';
import AuditLogs from './features/audit/AuditLogs';
import AzureConfig from './features/azure-config/AzureConfig';
import Dashboard from './features/dashboard/Dashboard';
import AdminSettings from './features/settings/AdminSettings';
import AccessControl from './features/settings/AccessControl';
import ActivityLog from './features/settings/ActivityLog';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="settings">
              <Route path="admin" element={<AdminSettings />} />
              <Route path="access" element={<AccessControl />} />
              <Route path="activity" element={<ActivityLog />} />
              <Route path="azure" element={<AzureConfig />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
