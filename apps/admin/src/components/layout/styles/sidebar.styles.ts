import { Theme } from '@mui/material';

export const getMenuItemStyles = (theme: Theme, isSelected: boolean) => ({
  menuItem: {
    mb: 0.25,
    '& .MuiListItemButton-root': {
      borderRadius: '6px',
      py: 0.75,
      px: 1.5,
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 3,
        height: '70%',
        bgcolor: 'primary.main',
        borderRadius: '0 3px 3px 0',
        opacity: isSelected ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      },
      '&.Mui-selected': {
        backgroundColor: 'primary.light',
        '&:hover': {
          backgroundColor: 'primary.main',
        },
        '& .MuiListItemIcon-root': {
          color: 'primary.main',
          transform: 'scale(1.05)',
        },
        '& .MuiListItemText-primary': {
          color: 'primary.main',
          fontWeight: 600,
        },
      },
      '&:hover': {
        backgroundColor: isSelected ? 'primary.main' : 'action.hover',
        transform: 'translateX(2px)',
        '& .MuiListItemIcon-root': {
          transform: 'scale(1.05)',
        },
      },
    },
  },
  icon: {
    minWidth: 32,
    transition: 'all 0.2s ease-in-out',
    color: isSelected ? 'primary.main' : 'text.secondary',
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
  text: {
    '& .MuiTypography-root': {
      fontSize: '0.8125rem',
      fontWeight: isSelected ? 600 : 400,
      color: isSelected ? 'primary.main' : 'text.primary',
      transition: 'all 0.2s ease-in-out',
    },
  },
});

export const logoContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  p: 1.5,
  height: 64,
  borderBottom: 1,
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

export const logoStyles = {
  height: 28,
};

export const drawerStyles = {
  permanent: {
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      borderRadius: 0,
      backgroundColor: 'background.paper',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    },
  },
  temporary: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      borderRadius: 0,
      backgroundColor: 'background.paper',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    },
  },
};
