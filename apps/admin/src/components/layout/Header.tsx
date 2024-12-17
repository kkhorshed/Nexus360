import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { UserProfile } from '@nexus360/ui';

interface HeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isSidebarOpen, 
  onSidebarToggle 
}) => {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(isSidebarOpen && {
          marginLeft: 240,
          width: `calc(100% - 240px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onSidebarToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap>
            Admin Portal
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <UserProfile 
          user={{
            name: 'Admin User',
            email: 'admin@example.com'
          }}
          onLogout={() => {
            // Implement logout
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
