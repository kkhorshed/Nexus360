import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 240;

function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header 
        drawerWidth={DRAWER_WIDTH} 
        onDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            xs: '100%',
            md: `calc(100% - ${DRAWER_WIDTH}px)` 
          },
          mt: '64px',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
