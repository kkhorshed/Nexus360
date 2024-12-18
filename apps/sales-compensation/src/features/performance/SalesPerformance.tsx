import { Grid, Typography, Box, LinearProgress } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

// Mock data - In a real application, this would come from an API
const performanceData = [
  { month: 'Jan', revenue: 4000, deals: 15 },
  { month: 'Feb', revenue: 3000, deals: 12 },
  { month: 'Mar', revenue: 5000, deals: 18 },
  { month: 'Apr', revenue: 2780, deals: 10 },
  { month: 'May', revenue: 4890, deals: 20 },
  { month: 'Jun', revenue: 3390, deals: 14 },
];

const teamPerformance = [
  {
    name: 'John Smith',
    revenue: 125000,
    target: 150000,
    deals: 25,
    conversion: 68,
  },
  {
    name: 'Sarah Johnson',
    revenue: 180000,
    target: 150000,
    deals: 32,
    conversion: 75,
  },
  {
    name: 'Michael Brown',
    revenue: 145000,
    target: 150000,
    deals: 28,
    conversion: 70,
  },
  {
    name: 'Emily Davis',
    revenue: 160000,
    target: 150000,
    deals: 30,
    conversion: 72,
  },
];

const MetricCard = ({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) => (
  <PageSection>
    <Typography color="textSecondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h5" component="div">
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="textSecondary">
        {subtitle}
      </Typography>
    )}
  </PageSection>
);

export default function SalesPerformance() {
  return (
    <PageWrapper 
      title="Sales Performance"
      description="Track and analyze sales team performance metrics"
    >
      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value="$610,000"
            subtitle="YTD"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average Deal Size"
            value="$22,500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Win Rate"
            value="71%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pipeline Value"
            value="$890,000"
          />
        </Grid>
      </Grid>

      {/* Performance Trend */}
      <PageSection title="Performance Trend">
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={performanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#1976d2"
                name="Revenue ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="deals"
                stroke="#dc004e"
                name="Deals Closed"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </PageSection>

      {/* Team Performance Table */}
      <PageSection title="Team Performance">
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Name</th>
                <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Revenue</th>
                <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Target Progress</th>
                <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Deals</th>
                <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((member) => (
                <tr key={member.name}>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    {member.name}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    ${member.revenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(member.revenue / member.target) * 100}
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="textSecondary">
                          {Math.round((member.revenue / member.target) * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    {member.deals}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    {member.conversion}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </PageSection>
    </PageWrapper>
  );
}
