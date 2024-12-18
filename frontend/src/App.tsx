import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Box, Container, Paper, Toolbar, Typography, useTheme } from '@mui/material';
import { AppLauncher } from '@nexus360/ui';

function App() {
  const theme = useTheme();

  const MainLayout = () => (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={4}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1">
            Nexus360
          </Typography>
        </Toolbar>
      </AppBar>
      <Container 
        component="main" 
        sx={{ 
          pt: 10, 
          pb: 4,
          px: 3
        }}
      >
        <Paper 
          elevation={2}
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography 
            variant="h3" 
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Welcome to Nexus360 Platform
          </Typography>
          <AppLauncher />
        </Paper>
      </Container>
    </Box>
  );

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
