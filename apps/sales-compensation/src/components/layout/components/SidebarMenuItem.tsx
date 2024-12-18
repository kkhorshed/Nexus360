import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { getMenuItemStyles } from '../styles/sidebar.styles';

interface SidebarMenuItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
  isSelected: boolean;
}

export default function SidebarMenuItem({
  text,
  icon,
  path,
  isSelected,
}: SidebarMenuItemProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getMenuItemStyles(theme, isSelected);

  return (
    <ListItem sx={styles.menuItem} disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={() => navigate(path)}
      >
        <ListItemIcon sx={styles.icon}>
          {icon}
        </ListItemIcon>
        <ListItemText sx={styles.text} primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
