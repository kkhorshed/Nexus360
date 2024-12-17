import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PageWrapperProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    text: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  children
}) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        {breadcrumbs && (
          <Breadcrumbs sx={{ mb: 1 }}>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography
                  key={crumb.text}
                  color="text.primary"
                  fontSize="0.875rem"
                >
                  {crumb.text}
                </Typography>
              ) : (
                <Link
                  key={crumb.text}
                  component={RouterLink}
                  to={crumb.href || '#'}
                  color="inherit"
                  fontSize="0.875rem"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {crumb.text}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: description ? 1 : 0
        }}>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {actions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {actions}
            </Box>
          )}
        </Box>

        {description && (
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Content Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default PageWrapper;
