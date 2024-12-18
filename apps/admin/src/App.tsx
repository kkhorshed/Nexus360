import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Users from './features/users/Users';
import Roles from './features/roles/Roles';
import AuditLogs from './features/audit/AuditLogs';
import AzureConfig from './features/azure-config';

// Placeholder components for settings routes
const AdminSettings = () => <div>Admin Settings</div>;
const AccessControl = () => <div>Access Control</div>;
const ActivityLog = () => <div>Activity Log</div>;
const Dashboard = () => <div>Dashboard</div>;

export default function App() {
  return (
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
  );
}
