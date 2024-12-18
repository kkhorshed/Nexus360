import { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

interface CompensationSettings {
  defaultCurrency: string;
  paymentSchedule: string;
  commissionRoundingDecimal: string;
  minimumCommissionAmount: string;
  acceleratorThreshold: string;
}

export default function CompensationSettingsPage() {
  const [settings, setSettings] = useState<CompensationSettings>({
    defaultCurrency: 'USD',
    paymentSchedule: 'Monthly',
    commissionRoundingDecimal: '2',
    minimumCommissionAmount: '100',
    acceleratorThreshold: '120',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof CompensationSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real application, this would make an API call
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const actions = (
    <Button
      variant="contained"
      onClick={handleSave}
      size="large"
    >
      Save Settings
    </Button>
  );

  return (
    <PageWrapper 
      title="Compensation Settings"
      description="Configure global compensation calculation settings"
      actions={actions}
    >
      {saved && (
        <Alert severity="success">
          Settings saved successfully
        </Alert>
      )}

      <PageSection>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Default Currency"
              value={settings.defaultCurrency}
              onChange={handleChange('defaultCurrency')}
              SelectProps={{
                native: true,
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Payment Schedule"
              value={settings.paymentSchedule}
              onChange={handleChange('paymentSchedule')}
              SelectProps={{
                native: true,
              }}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bi-weekly">Bi-weekly</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Commission Rounding Decimal"
              value={settings.commissionRoundingDecimal}
              onChange={handleChange('commissionRoundingDecimal')}
              SelectProps={{
                native: true,
              }}
            >
              <option value="0">0 decimals</option>
              <option value="1">1 decimal</option>
              <option value="2">2 decimals</option>
              <option value="3">3 decimals</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Minimum Commission Amount"
              value={settings.minimumCommissionAmount}
              onChange={handleChange('minimumCommissionAmount')}
              type="number"
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Accelerator Threshold"
              value={settings.acceleratorThreshold}
              onChange={handleChange('acceleratorThreshold')}
              type="number"
              InputProps={{
                endAdornment: '%',
              }}
              helperText="Percentage of quota achievement where accelerators kick in"
            />
          </Grid>
        </Grid>
      </PageSection>
    </PageWrapper>
  );
}
