import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  useTheme,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { getMenuItemStyles } from '../styles/sidebar.styles';

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

export default function SidebarNestedMenuItem({
  text,
  icon,
  children,
  isOpen,
  onToggle,
  isParentSelected,
  currentPath,
}: SidebarNestedMenuItemProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const parentStyles = getMenuItemStyles(theme, isParentSelected);

  return (
    <>
      <ListItem sx={parentStyles.menuItem} disablePadding>
        <ListItemButton
          selected={isParentSelected}
          onClick={onToggle}
        >
          <ListItemIcon sx={parentStyles.icon}>
            {icon}
          </ListItemIcon>
          <ListItemText sx={parentStyles.text} primary={text} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {children.map((item) => {
            const isSelected = currentPath === item.path;
            const styles = getMenuItemStyles(theme, isSelected);

            return (
              <ListItem key={item.text} sx={styles.menuItem} disablePadding>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon sx={styles.icon}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText sx={styles.text} primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
}
