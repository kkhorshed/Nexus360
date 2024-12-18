import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Paper, 
  Toolbar, 
  Typography, 
  useTheme,
  alpha,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import { AppLauncher } from '@nexus360/ui';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface SecurityFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SecurityFeature({ icon, title, description }: SecurityFeatureProps) {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
        height: '100%'
      }}>
        <Box sx={{ 
          color: 'primary.main',
          mb: 2,
          p: 1,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.1)
        }}>
          {icon}
        </Box>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600, 
          color: 'primary.main',
          mb: 1
        }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function MainLayout() {
  const theme = useTheme();
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Simple background accent */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '30%',
        height: '30%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          bgcolor: 'white',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 300,
                letterSpacing: 1,
                lineHeight: 1
              }}
            >
              NEXUS<span style={{ fontWeight: 600 }}>360</span>
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: theme.palette.text.secondary }}
            >
              A Platform by CEQUENS
            </Typography>
          </Box>
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography 
                variant="body1" 
                sx={{ color: theme.palette.text.primary }}
              >
                {user?.displayName}
              </Typography>
              <Button 
                onClick={logout}
                variant="outlined"
                color="primary"
              >
                Sign Out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container 
        component="main" 
        sx={{ 
          mt: 8,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {isAuthenticated ? (
          <Paper 
            elevation={0}
            sx={{
              maxWidth: 1200,
              width: '100%',
              p: 4,
              borderRadius: 3,
              bgcolor: 'white',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <AppLauncher />
          </Paper>
        ) : (
          <Card 
            elevation={2}
            sx={{
              maxWidth: 600,
              width: '100%',
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              background: 'white',
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 300,
                    mb: 2,
                    letterSpacing: 1
                  }}
                >
                  Welcome to <span style={{ fontWeight: 600 }}>Nexus360</span>
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontWeight: 300
                  }}
                >
                  Your secure gateway to enterprise solutions
                </Typography>
              </Box>

              <Button 
                onClick={login}
                variant="contained"
                size="large"
                fullWidth
                startIcon={<LockIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: theme.shadows[2],
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  mb: 4
                }}
              >
                Sign in with Microsoft
              </Button>

              <Divider sx={{ mb: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Security Features
                </Typography>
              </Divider>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <SecurityFeature 
                    icon={<SecurityIcon />}
                    title="Azure AD"
                    description="Enterprise-grade identity verification"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <SecurityFeature 
                    icon={<VerifiedUserIcon />}
                    title="MFA"
                    description="Additional security layer with Microsoft"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <SecurityFeature 
                    icon={<LockIcon />}
                    title="Encryption"
                    description="Industry-standard protocols"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 3,
          textAlign: 'center',
          color: theme.palette.text.secondary,
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          bgcolor: 'white',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Cequens. All rights reserved.
        </Typography>
      </Box>
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
