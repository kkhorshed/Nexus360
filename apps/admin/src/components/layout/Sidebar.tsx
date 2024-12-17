import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Security as RolesIcon,
  Assessment as AuditIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/'
  },
  {
    text: 'Users',
    icon: <UsersIcon />,
    path: '/users'
  },
  {
    text: 'Roles & Permissions',
    icon: <RolesIcon />,
    path: '/roles'
  },
  {
    text: 'Audit Logs',
    icon: <AuditIcon />,
    path: '/audit'
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        width: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        minHeight: 64
      }}>
        {/* Logo or branding can go here */}
      </Box>
      
      <Divider />

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '1A', // 10% opacity
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '33', // 20% opacity
                  },
                },
                borderRadius: '0 24px 24px 0',
                mr: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{
                color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  color: isActive(item.path) ? theme.palette.primary.main : 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'center' }}>
        {/* Footer content can go here */}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      onClose={onClose}
      sx={{
        width: open ? 240 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
