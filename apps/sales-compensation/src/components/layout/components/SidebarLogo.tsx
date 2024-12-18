import React from 'react';
import { Box } from '@mui/material';
import { logoContainerStyles, logoStyles } from '../styles/sidebar.styles';

const SidebarLogo: React.FC = () => (
  <Box sx={logoContainerStyles}>
    <Box
      component="img"
      src="/cequens-logo.svg"
      alt="Cequens Logo"
      sx={logoStyles}
    />
  </Box>
);

export default SidebarLogo;
