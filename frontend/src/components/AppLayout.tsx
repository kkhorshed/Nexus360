import React from 'react';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  name: string;
  path: string;
}

interface AppLayoutProps {
  appName: string;
  menuItems: MenuItem[];
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ appName, menuItems, children }) => {
  const location = useLocation();
  const currentTab = menuItems.findIndex((item: MenuItem) => item.path === location.pathname);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f0f2f5',
      p: 2
    }}>
      <AppBar 
        position="static" 
        color="default" 
        elevation={1}
        sx={{
          borderRadius: 2,
          mb: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              fontSize: '18px',
              mr: 6
            }}
          >
            {appName}
          </Typography>
          <Tabs 
            value={currentTab !== -1 ? currentTab : false}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: 2
              }
            }}
          >
            {menuItems.map((item: MenuItem) => (
              <Tab
                key={item.path}
                label={item.name}
                component={Link}
                to={item.path}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          minHeight: '280px'
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;
