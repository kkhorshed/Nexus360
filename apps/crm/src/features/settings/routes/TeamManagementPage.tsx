import { Box, Typography } from '@mui/material';
import TeamManagement from '../components/TeamManagement';

export default function TeamManagementPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Team Management
      </Typography>
      <TeamManagement />
    </Box>
  );
}
