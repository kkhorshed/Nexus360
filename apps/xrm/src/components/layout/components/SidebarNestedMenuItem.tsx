import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { SidebarMenuItem } from './SidebarMenuItem';

interface SidebarNestedMenuItemProps {
  text: string;
  icon: React.ReactNode;
  children: Array<{
    text: string;
    icon: React.ReactNode;
    path: string;
  }>;
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
  return (
    <>
      <ListItem
        button
        onClick={onToggle}
        sx={{
          borderRadius: 1,
          mb: 0.5,
          backgroundColor: isParentSelected ? 'action.selected' : 'transparent',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: isParentSelected ? 'primary.main' : 'text.secondary',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: isParentSelected ? 600 : 400,
          }}
        />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2 }}>
          <List component="div" disablePadding>
            {children.map((child) => (
              <SidebarMenuItem
                key={child.path}
                text={child.text}
                icon={child.icon}
                path={child.path}
                isSelected={currentPath === child.path}
              />
            ))}
          </List>
        </Box>
      </Collapse>
    </>
  );
};
