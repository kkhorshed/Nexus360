import React from 'react';
import { Box, Paper, Typography, Breadcrumbs, Link, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ text: string; href?: string; }>;
}

interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ text: string; href?: string; }>;
}

const PageHeader = ({ title, description, actions, breadcrumbs }: PageHeaderProps) => {
  const theme = useTheme();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Paper
      elevation={0}
      sx={{ 
        backgroundColor: '#ffffff',
        borderRadius: 0,
        p: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: 0.9,
        },
        transition: 'all 0.2s ease-in-out',
        '&:hover::before': {
          opacity: 1,
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: 2.5,
        width: '100%'
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600, 
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            ml: 2,
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            {actions}
          </Box>
        )}
      </Box>
      
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ 
          width: '100%',
          '& .MuiBreadcrumbs-separator': { 
            mx: 1,
            color: 'text.secondary',
          },
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'wrap',
          }
        }}
      >
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ 
            textDecoration: 'none',
            '&:hover': { 
              textDecoration: 'underline',
              color: 'primary.main'
            },
            transition: 'color 0.2s ease-in-out',
          }}
        >
          Dashboard
        </Link>
        {breadcrumbs ? (
          breadcrumbs.map((crumb, index) => {
            const last = index === breadcrumbs.length - 1;
            return last ? (
              <Typography color="text.primary" key={crumb.text}>
                {crumb.text}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                to={crumb.href || '#'}
                key={crumb.text}
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { 
                    textDecoration: 'underline',
                    color: 'primary.main'
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {crumb.text}
              </Link>
            );
          })
        ) : (
          pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return last ? (
              <Typography color="text.primary" key={to}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                to={to}
                key={to}
                color="inherit"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { 
                    textDecoration: 'underline',
                    color: 'primary.main'
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
            );
          })
        )}
      </Breadcrumbs>
    </Paper>
  );
};

const PageSection = ({ children, title, actions }: PageSectionProps) => {
  return (
    <Paper
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
      }}
    >
      {(title || actions) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2.5,
          width: '100%'
        }}>
          {title && (
            <Typography 
              variant="h6" 
              component="h2"
              sx={{
                fontWeight: 500,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              {title}
            </Typography>
          )}
          {actions && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      {children}
    </Paper>
  );
};

export default function PageWrapper({ children, title, description, actions, breadcrumbs }: PageWrapperProps) {
  return (
    <Box 
      sx={{ 
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '100%',
          flex: 1,
        }}
      >
        <PageHeader 
          title={title} 
          description={description} 
          actions={actions} 
          breadcrumbs={breadcrumbs}
        />
        {React.Children.map(children, (child, index) => {
          if (!child) return null;
          
          if (React.isValidElement(child) && child.type === PageSection) {
            return child;
          }
          
          return <PageSection key={index}>{child}</PageSection>;
        })}
      </Box>
    </Box>
  );
}

export { PageSection };
