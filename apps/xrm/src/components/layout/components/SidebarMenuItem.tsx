import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  text,
  icon,
  path,
  isSelected,
}) => {
  const theme = useTheme();
  const styles = getMenuItemStyles(theme, isSelected);

  return (
    <ListItem disablePadding sx={styles.menuItem}>
      <ListItemButton
        component={RouterLink}
        to={path}
        selected={isSelected}
      >
        <ListItemIcon
          sx={{
            ...styles.icon,
            color: isSelected ? 'common.white' : 'text.primary',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={styles.text}
        />
      </ListItemButton>
    </ListItem>
  );
};
