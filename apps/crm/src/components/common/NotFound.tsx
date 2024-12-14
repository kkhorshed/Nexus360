import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px - 48px)', // viewport height - header - padding
      }}
    >
      <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
        Page Not Found
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </Box>
  );
}
