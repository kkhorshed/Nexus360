import React from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400
}) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          p: 2
        }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          p: 2
        }}>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default RightDrawer;
