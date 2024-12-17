import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import theme from '../../theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header 
          isSidebarOpen={isSidebarOpen} 
          onSidebarToggle={handleSidebarToggle} 
        />
        <Sidebar 
          open={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: isSidebarOpen ? 240 : 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
