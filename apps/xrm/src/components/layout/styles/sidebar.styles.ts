import { SxProps, Theme } from '@mui/material';

interface DrawerStyles {
  temporary: SxProps<Theme>;
  permanent: SxProps<Theme>;
}

export const drawerStyles: DrawerStyles = {
  temporary: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      borderRight: '1px solid',
      borderColor: 'divider',
    },
  },
  permanent: {
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      borderRight: '1px solid',
      borderColor: 'divider',
    },
  },
};
