import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Security as RolesIcon,
  Assessment as AuditIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  VpnKey as AccessIcon,
  History as ActivityIcon,
  ManageAccounts as UserManagementIcon,
} from '@mui/icons-material';
import { SidebarMenuItem } from './components/SidebarMenuItem';
import { SidebarNestedMenuItem } from './components/SidebarNestedMenuItem';
import { SidebarLogo } from './components/SidebarLogo';
import { drawerStyles } from './styles/sidebar.styles';

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
  children?: Array<{
    text: string;
    icon: React.ReactNode;
    path: string;
  }>;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Roles', icon: <RolesIcon />, path: '/roles' },
  { text: 'Audit Logs', icon: <AuditIcon />, path: '/audit' },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { text: 'User Management', icon: <UserManagementIcon />, path: '/settings/usermanagement' },
      { text: 'Admin Settings', icon: <AdminIcon />, path: '/settings/adminsetting' },
      { text: 'Access Control', icon: <AccessIcon />, path: '/settings/accesscontrol' },
      { text: 'Activity Log', icon: <ActivityIcon />, path: '/settings/activitylog' }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  isMobile,
}) => {
  const location = useLocation();
  const [openSettings, setOpenSettings] = useState(
    location.pathname.startsWith('/settings')
  );

  const handleSettingsClick = () => {
    setOpenSettings(!openSettings);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isParentSelected = item.children.some(
        child => location.pathname === child.path
      );

      return (
        <SidebarNestedMenuItem
          key={item.text}
          text={item.text}
          icon={item.icon}
          children={item.children}
          isOpen={openSettings}
          onToggle={handleSettingsClick}
          isParentSelected={isParentSelected}
          currentPath={location.pathname}
        />
      );
    }

    return (
      <SidebarMenuItem
        key={item.text}
        text={item.text}
        icon={item.icon}
        path={item.path!}
        isSelected={location.pathname === item.path}
      />
    );
  };

  const drawer = (
    <>
      <SidebarLogo />
      <List sx={{ pt: 1, px: 1 }}>
        {menuItems.map(renderMenuItem)}
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
            ...drawerStyles.temporary,
            '& .MuiDrawer-paper': {
              ...drawerStyles.temporary['& .MuiDrawer-paper'],
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            ...drawerStyles.permanent,
            '& .MuiDrawer-paper': {
              ...drawerStyles.permanent['& .MuiDrawer-paper'],
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
