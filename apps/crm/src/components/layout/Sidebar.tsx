import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as ContactsIcon,
  Business as CompaniesIcon,
  Inventory as ProductsIcon,
  TrendingUp as LeadsIcon,
  BusinessCenter as OpportunitiesIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Group as TeamIcon,
  Security as SecurityIcon,
  ManageAccounts as UserManagementIcon,
} from '@mui/icons-material';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isMobile: boolean;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Companies', icon: <CompaniesIcon />, path: '/companies' },
  { text: 'Contacts', icon: <ContactsIcon />, path: '/contacts' },
  { text: 'Products', icon: <ProductsIcon />, path: '/products' },
  { text: 'Leads', icon: <LeadsIcon />, path: '/leads' },
  { text: 'Opportunities', icon: <OpportunitiesIcon />, path: '/opportunities' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

const settingsItems: MenuItem[] = [
  { text: 'User Management', icon: <UserManagementIcon />, path: '/settings/users' },
  { text: 'Team Management', icon: <TeamIcon />, path: '/settings/teams' },
  { text: 'Security', icon: <SecurityIcon />, path: '/settings/security' },
];

export default function Sidebar({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  isMobile,
}: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();

  const renderMenuItem = (item: MenuItem) => {
    const isSelected = item.path ? location.pathname === item.path : false;

    return (
      <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          component={RouterLink}
          to={item.path || ''}
          selected={isSelected}
          sx={{
            borderRadius: '8px',
            py: 1.25,
            px: 2,
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: '60%',
              bgcolor: 'primary.main',
              borderRadius: '0 4px 4px 0',
              opacity: isSelected ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '& .MuiListItemIcon-root': {
                color: 'common.white',
                transform: 'scale(1.1)',
              },
              '& .MuiListItemText-primary': {
                color: 'common.white',
                fontWeight: 600,
              },
            },
            '&:hover': {
              backgroundColor: isSelected ? 'primary.dark' : theme.palette.action.hover,
              transform: 'translateX(4px)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: isSelected ? 'common.white' : 'text.primary',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            sx={{
              '& .MuiTypography-root': {
                fontSize: '0.875rem',
                fontWeight: isSelected ? 600 : 500,
                transition: 'all 0.2s ease-in-out',
              }
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <>
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          height: 64,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box 
          component="img"
          src="/cequens-logo.svg"
          alt="Cequens Logo"
          sx={{ 
            height: 27,
          }}
        />
      </Box>
      <List sx={{ pt: 2, px: 1.5 }}>
        {menuItems.map((item) => renderMenuItem(item))}
        
        <Box sx={{ mt: 3, mb: 1.5, px: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: 'text.secondary',
            transition: 'color 0.2s ease-in-out',
            '&:hover': {
              color: 'text.primary',
            }
          }}>
            <SettingsIcon sx={{ fontSize: '1.25rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Settings
            </Typography>
          </Box>
        </Box>
        {settingsItems.map((item) => renderMenuItem(item))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRadius: 0,
              backgroundColor: 'background.default',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRadius: 0,
              backgroundColor: 'background.default',
              boxShadow: 1,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
}
