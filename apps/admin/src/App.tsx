import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import Layout from './components/layout/Layout';
import Dashboard from './features/dashboard/Dashboard';
import Users from './features/users/Users';
import Roles from './features/roles/Roles';
import AuditLogs from './features/audit/AuditLogs';

// Placeholder components for routes that haven't been implemented yet
const UserManagement = () => <div>User Management</div>;
const AdminSettings = () => <div>Admin Settings</div>;
const AccessControl = () => <div>Access Control</div>;
const ActivityLog = () => <div>Activity Log</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Default route redirects to dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Main routes */}
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="audit" element={<AuditLogs />} />
            
            {/* Settings routes */}
            <Route path="settings">
              <Route path="usermanagement" element={<UserManagement />} />
              <Route path="adminsetting" element={<AdminSettings />} />
              <Route path="accesscontrol" element={<AccessControl />} />
              <Route path="activitylog" element={<ActivityLog />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
