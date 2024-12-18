import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

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
  return (
    <ListItem
      button
      component={Link}
      to={path}
      selected={isSelected}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          '& .MuiListItemIcon-root': {
            color: 'inherit',
          },
        },
        '&:hover': {
          backgroundColor: 'action.hover',
          '&.Mui-selected': {
            backgroundColor: 'primary.dark',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: isSelected ? 'inherit' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          fontSize: '0.875rem',
          fontWeight: isSelected ? 600 : 400,
        }}
      />
    </ListItem>
  );
};
