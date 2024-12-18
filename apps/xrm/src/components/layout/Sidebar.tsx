import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  Box,
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
  Task as TaskIcon,
  History as AuditIcon,
  ManageAccounts as UserManagementIcon,
  Groups as TeamManagementIcon,
  Security as SecurityIcon,
  AccountTree as AccountPlanningIcon,
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
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Companies', icon: <CompaniesIcon />, path: '/companies' },
  { text: 'Contacts', icon: <ContactsIcon />, path: '/contacts' },
  { text: 'Products', icon: <ProductsIcon />, path: '/products' },
  { text: 'Leads', icon: <LeadsIcon />, path: '/leads' },
  { text: 'Opportunities', icon: <OpportunitiesIcon />, path: '/opportunities' },
  { text: 'Account Planning', icon: <AccountPlanningIcon />, path: '/account-planning' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { text: 'User Management', icon: <UserManagementIcon />, path: '/settings/user-management' },
      { text: 'Team Management', icon: <TeamManagementIcon />, path: '/settings/team-management' },
      { text: 'Security', icon: <SecurityIcon />, path: '/settings/security' },
      { text: 'Audit Trail', icon: <AuditIcon />, path: '/audit' }
    ],
  },
];

export default function Sidebar({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  isMobile,
}: SidebarProps) {
  const location = useLocation();
  const [openSettings, setOpenSettings] = useState(
    location.pathname.startsWith('/settings') || location.pathname === '/audit'
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
        isSelected={location.pathname === item.path || 
          (item.path === '/account-planning' && location.pathname.startsWith('/account-planning/'))}
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
