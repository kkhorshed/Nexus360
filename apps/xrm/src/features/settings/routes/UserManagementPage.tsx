import { Box, Typography } from '@mui/material';
import UserManagement from '../components/UserManagement';

export default function UserManagementPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Management
      </Typography>
      <UserManagement />
    </Box>
  );
}
