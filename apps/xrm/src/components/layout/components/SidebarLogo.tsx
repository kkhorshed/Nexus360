import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const SidebarLogo: React.FC = () => {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          color: 'primary.main',
          letterSpacing: '0.05em',
        }}
      >
        Nexus360
      </Typography>
    </Box>
  );
};
