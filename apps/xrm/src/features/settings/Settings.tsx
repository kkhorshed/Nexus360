import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagementPage from './routes/UserManagementPage';
import TeamManagementPage from './routes/TeamManagementPage';
import SecurityPage from './routes/SecurityPage';

export default function Settings() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="user-management" replace />} />
      <Route path="user-management" element={<UserManagementPage />} />
      <Route path="team-management" element={<TeamManagementPage />} />
      <Route path="security" element={<SecurityPage />} />
    </Routes>
  );
}
