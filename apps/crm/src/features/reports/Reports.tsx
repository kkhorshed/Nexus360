import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  BarChart as SalesIcon,
  PieChart as LeadsIcon,
  Timeline as ActivityIcon,
  Inventory as ProductIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';

interface Report {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  lastGenerated?: string;
  scheduled?: boolean;
}

const reports: Report[] = [
  {
    id: 'sales',
    title: 'Sales Performance Report',
    description: 'Detailed analysis of sales performance, revenue, and trends',
    icon: <SalesIcon fontSize="large" color="primary" />,
    lastGenerated: '2024-01-15 09:30:00',
    scheduled: true,
  },
  {
    id: 'leads',
    title: 'Lead Conversion Report',
    description: 'Analysis of lead sources, conversion rates, and pipeline metrics',
    icon: <LeadsIcon fontSize="large" color="primary" />,
    lastGenerated: '2024-01-14 16:45:00',
  },
  {
    id: 'activity',
    title: 'User Activity Report',
    description: 'Overview of user activities, engagement, and interactions',
    icon: <ActivityIcon fontSize="large" color="primary" />,
    lastGenerated: '2024-01-14 10:15:00',
    scheduled: true,
  },
  {
    id: 'products',
    title: 'Product Performance Report',
    description: 'Analysis of product sales, inventory, and popularity metrics',
    icon: <ProductIcon fontSize="large" color="primary" />,
    lastGenerated: '2024-01-13 14:20:00',
  },
];

export default function Reports() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, reportId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting ${selectedReport} as ${format}`);
    handleMenuClose();
  };

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
  };

  const actions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => {
        console.log('Create new report');
      }}
      size={isMobile ? "small" : "medium"}
    >
      {!isMobile && "Create Report"}
    </Button>
  );

  return (
    <PageWrapper 
      title="Reports" 
      description="Generate and manage analytical reports for your business insights"
      actions={actions}
    >
      <PageSection>
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column'
        }}>
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              width: '100%',
              margin: 0,
              display: 'flex',
              flexGrow: 1,
            }}
          >
            {reports.map((report) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                lg={4} 
                key={report.id}
                sx={{ 
                  p: '8px !important',
                  width: '100%',
                  display: 'flex'
                }}
              >
                <Card sx={{ 
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: isMobile ? 'flex-start' : 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 2 : 3,
                      mb: 2,
                      width: '100%'
                    }}>
                      {report.icon}
                      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                          {report.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            width: '100%'
                          }}
                        >
                          {report.description}
                        </Typography>
                      </Box>
                      <IconButton
                        aria-label="report options"
                        onClick={(e) => handleMenuClick(e, report.id)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      flexWrap: 'wrap',
                      gap: 1,
                      width: '100%'
                    }}>
                      {report.scheduled && (
                        <Tooltip title="Scheduled Report">
                          <Chip
                            icon={<ScheduleIcon />}
                            label="Scheduled"
                            size="small"
                            color="success"
                          />
                        </Tooltip>
                      )}
                      {report.lastGenerated && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            flex: 1,
                            minWidth: isMobile ? '100%' : 'auto'
                          }}
                        >
                          Last generated: {new Date(report.lastGenerated).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleGenerateReport(report.id)}
                      fullWidth={isMobile}
                      sx={{ width: '100%' }}
                    >
                      Generate Report
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
          <MenuItem onClick={() => handleExport('excel')}>Export as Excel</MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        </Menu>
      </PageSection>
    </PageWrapper>
  );
}
