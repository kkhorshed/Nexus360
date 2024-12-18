import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  useTheme,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { getMenuItemStyles } from '../styles/sidebar.styles';
import { SidebarMenuItem } from './SidebarMenuItem';

interface NestedMenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarNestedMenuItemProps {
  text: string;
  icon: React.ReactNode;
  children: NestedMenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  isParentSelected: boolean;
  currentPath: string;
}

export const SidebarNestedMenuItem: React.FC<SidebarNestedMenuItemProps> = ({
  text,
  icon,
  children,
  isOpen,
  onToggle,
  isParentSelected,
  currentPath,
}) => {
  const theme = useTheme();
  const styles = getMenuItemStyles(theme, isParentSelected);

  return (
    <>
      <ListItem disablePadding sx={styles.menuItem}>
        <ListItemButton
          onClick={onToggle}
          selected={isParentSelected}
        >
          <ListItemIcon
            sx={{
              ...styles.icon,
              color: isParentSelected ? 'common.white' : 'text.primary',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={text}
            sx={styles.text}
          />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {children.map((child) => (
            <SidebarMenuItem
              key={child.text}
              text={child.text}
              icon={child.icon}
              path={child.path}
              isSelected={currentPath === child.path}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};
