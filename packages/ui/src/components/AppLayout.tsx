import React, { useState } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import {
  Box,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Toolbar,
  Button,
  Tooltip,
  Container,
  useTheme,
  Typography
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { UserProfile } from '../components/UserProfile';

const DRAWER_WIDTH = 250;

interface AppLayoutProps {
  appName: string;
  menuItems: { name: string; path: string; children?: { name: string; path: string }[] }[];
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  appName,
  menuItems, 
  children,
  user,
  onLogout
}) => {
  const [open, setOpen] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const location = useLocation();
  const theme = useTheme();

  // Helper function to check if a path matches the current location
  const isPathActive = (path: string) => {
    return !!matchPath(path, location.pathname);
  };

  // Helper function to check if a menu item or any of its children is active
  const isMenuItemActive = (item: { path: string; children?: { path: string }[] }) => {
    if (isPathActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isPathActive(child.path));
    }
    return false;
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleSubMenuToggle = (name: string) => {
    setOpenSubMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const renderMenuItem = (item: { name: string; path: string; children?: { name: string; path: string }[] }) => {
    if (item.children) {
      return (
        <Box key={item.name}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleSubMenuToggle(item.name)}
              selected={isMenuItemActive(item)}
            >
              <ListItemText primary={item.name} />
              {openSubMenus.includes(item.name) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubMenus.includes(item.name)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={child.path}
                    selected={isPathActive(child.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={child.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={isPathActive(item.path)}
        >
          <ListItemText primary={item.name} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#fff',
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/cequens-logo.svg" 
              alt="CEQUENS Logo" 
              style={{ height: 32, marginRight: 16, cursor: 'pointer' }} 
              title="Go to Dashboard"
            />
            <Typography variant="h6" color="inherit" noWrap>
              {appName}
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <UserProfile 
              user={user}
              onLogout={onLogout}
            />
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : theme.spacing(7),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : theme.spacing(7),
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open={open}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => renderMenuItem(item))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : theme.spacing(7)}px)` },
          ml: { sm: `${open ? DRAWER_WIDTH : theme.spacing(7)}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
