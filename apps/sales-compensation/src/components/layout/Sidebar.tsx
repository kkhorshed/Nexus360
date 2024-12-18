import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Drawer, List, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MonetizationOn as CompensationIcon,
  Assessment as PerformanceIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  ManageAccounts as UserManagementIcon,
  Groups as TeamManagementIcon,
  Notifications as NotificationsIcon,
  AttachMoney as CompensationSettingsIcon,
} from '@mui/icons-material';
import SidebarLogo from './components/SidebarLogo';
import SidebarMenuItem from './components/SidebarMenuItem';
import SidebarNestedMenuItem from './components/SidebarNestedMenuItem';
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
  { text: 'Compensation Plans', icon: <CompensationIcon />, path: '/compensation-plans' },
  { text: 'Performance', icon: <PerformanceIcon />, path: '/performance' },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { text: 'Compensation', icon: <CompensationSettingsIcon />, path: '/settings/compensation' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/settings/notifications' },
      { text: 'User Management', icon: <UserManagementIcon />, path: '/settings/user-management' },
      { text: 'Team Management', icon: <TeamManagementIcon />, path: '/settings/team-management' },
      { text: 'Security', icon: <SecurityIcon />, path: '/settings/security' },
    ],
  },
];

function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle, isMobile }: SidebarProps) {
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
}

export default Sidebar;
