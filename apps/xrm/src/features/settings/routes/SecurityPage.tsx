import { Box, Typography } from '@mui/material';
import Security from '../components/Security';

export default function SecurityPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Security
      </Typography>
      <Security />
    </Box>
  );
}
