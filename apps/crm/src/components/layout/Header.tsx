import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  InputBase,
  Badge,
  Avatar,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  isMobile: boolean;
}

export default function Header({ drawerWidth, onDrawerToggle, isMobile }: HeaderProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: '#ffffff',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                borderRadius: 1.5 // 6px - suitable for small action button
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Nexus360 CRM
          </Typography>
        </Box>

        {/* Search Box */}
        <Box
          sx={{
            position: 'relative',
            backgroundColor: (theme) => alpha(theme.palette.common.black, 0.04),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.common.black, 0.08),
            },
            marginRight: 2,
            marginLeft: 2,
            width: 'auto',
            flex: 1,
            maxWidth: '600px',
          }}
        >
          <Box sx={{ padding: '0 12px', height: '100%', position: 'absolute', display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </Box>
          <InputBase
            placeholder="Search..."
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: '8px 8px 8px 48px',
              },
            }}
          />
        </Box>

        {/* Right Section - Notifications & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit" 
            aria-label="show notifications"
            sx={{ borderRadius: 1.5 }} // 6px - suitable for small action button
          >
            <Badge 
              badgeContent={4} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  borderRadius: 1 // 4px - smaller radius for the notification badge
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="user profile"
            aria-haspopup="true"
            color="inherit"
            sx={{ borderRadius: 1.5 }} // 6px - suitable for small action button
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: theme.palette.primary.main,
                borderRadius: 2 // 8px - matches the theme's base borderRadius
              }}
            >
              U
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
