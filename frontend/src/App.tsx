import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, Paper, Toolbar, Typography, useTheme } from '@mui/material';
import { AppLauncher } from '@nexus360/ui';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';

function MainLayout() {
  const theme = useTheme();
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={4}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1">
            Nexus360
          </Typography>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">
                Welcome, {user?.displayName}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}
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
          {isAuthenticated ? (
            <AppLauncher />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Please log in to access the platform
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                onClick={login}
                sx={{ mt: 2 }}
              >
                Login with Azure AD
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
