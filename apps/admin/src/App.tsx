import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Layout from './components/layout/Layout';

// Features
import Dashboard from './features/dashboard/Dashboard';
import Users from './features/users/Users';
import Roles from './features/roles/Roles';
import AuditLogs from './features/audit/AuditLogs';
import AdminSettings from './features/settings/AdminSettings';
import UserManagement from './features/settings/UserManagement';
import AccessControl from './features/settings/AccessControl';
import ActivityLog from './features/settings/ActivityLog';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Main routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/audit" element={<AuditLogs />} />
            
            {/* Settings routes */}
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/settings/usermanagement" element={<UserManagement />} />
            <Route path="/settings/accesscontrol" element={<AccessControl />} />
            <Route path="/settings/ActivityLog" element={<ActivityLog />} />
            <Route path="/settings/adminsetting" element={<AdminSettings />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
