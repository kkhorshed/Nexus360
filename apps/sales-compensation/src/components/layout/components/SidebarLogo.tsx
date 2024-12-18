import React from 'react';
import { Box, Link } from '@mui/material';
import { logoContainerStyles, logoStyles } from '../styles/sidebar.styles';

const SidebarLogo: React.FC = () => (
  <Box sx={logoContainerStyles}>
    <Link href="/" sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        component="img"
        src="/cequens-logo.svg"
        alt="Cequens Logo"
        sx={logoStyles}
      />
    </Link>
  </Box>
);

export default SidebarLogo;
