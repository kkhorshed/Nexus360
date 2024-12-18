import { Grid, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

// Mock data - In a real application, this would come from an API
const performanceData = [
  { month: 'Jan', actual: 4000, target: 3000 },
  { month: 'Feb', actual: 3000, target: 3000 },
  { month: 'Mar', actual: 5000, target: 3000 },
  { month: 'Apr', actual: 2780, target: 3000 },
  { month: 'May', actual: 4890, target: 3000 },
  { month: 'Jun', actual: 3390, target: 3000 },
];

const MetricCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
  <PageSection>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" component="div">
      {value}
    </Typography>
    <Typography variant="subtitle2" color="textSecondary">
      {subtitle}
    </Typography>
  </PageSection>
);

export default function Dashboard() {
  return (
    <PageWrapper 
      title="Sales Dashboard"
      description="Monitor your sales performance and compensation metrics"
    >
      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Earnings"
            value="$45,230"
            subtitle="Current Quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Deals Closed"
            value="28"
            subtitle="Last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Target Progress"
            value="78%"
            subtitle="Quarter to Date"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Commission Rate"
            value="8.5%"
            subtitle="Average"
          />
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <PageSection title="Performance vs Target">
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#1976d2" name="Actual Sales" />
              <Bar dataKey="target" fill="#dc004e" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </PageSection>

      {/* Recent Activity */}
      <PageSection title="Recent Activity">
        <Box>
          <Typography variant="body2" color="textSecondary" paragraph>
            • New compensation plan "Q1 2024 Accelerator" published
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • Achieved monthly sales target - 105% completion
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • Commission payout processed for December 2023
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Team ranking updated - Currently #2 in region
          </Typography>
        </Box>
      </PageSection>
    </PageWrapper>
  );
}
