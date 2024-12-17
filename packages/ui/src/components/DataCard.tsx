import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

export interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  className = ''
}) => {
  const theme = useTheme();

  return (
    <Card 
      className={className}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 2
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography 
            variant="h4" 
            component="div"
            sx={{ fontWeight: 'bold', mr: 2 }}
          >
            {value}
          </Typography>
          
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trend.direction === 'up' 
                  ? theme.palette.success.main 
                  : theme.palette.error.main,
                backgroundColor: trend.direction === 'up'
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(theme.palette.error.main, 0.1),
                borderRadius: 1,
                px: 1,
                py: 0.5
              }}
            >
              {trend.direction === 'up' ? (
                <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
              ) : (
                <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
              )}
              <Typography variant="body2" component="span">
                {trend.value}%
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataCard;
