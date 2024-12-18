import { ReactNode } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function RightDrawer({ open, onClose, title, children }: RightDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: '600px',
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 0,
          boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
      </Box>
    </Drawer>
  );
}
