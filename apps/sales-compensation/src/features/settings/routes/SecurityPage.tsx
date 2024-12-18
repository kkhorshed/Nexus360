import { useState } from 'react';
import {
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordExpiration: string;
  sessionTimeout: string;
  ipRestriction: boolean;
  auditLogging: boolean;
  dataEncryption: boolean;
}

export default function SecurityPage() {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    passwordExpiration: '90',
    sessionTimeout: '30',
    ipRestriction: false,
    auditLogging: true,
    dataEncryption: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SecuritySettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setSettings((prev) => ({
      ...prev,
      [field]: value,
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
      title="Security Settings"
      description="Configure security and access control settings"
      actions={actions}
    >
      {saved && (
        <Alert severity="success">
          Settings saved successfully
        </Alert>
      )}

      <PageSection title="Authentication">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={handleChange('twoFactorAuth')}
                />
              }
              label={
                <div>
                  <Typography variant="body1" fontWeight={500}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Require two-factor authentication for all users
                  </Typography>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Password Expiration"
              value={settings.passwordExpiration}
              onChange={handleChange('passwordExpiration')}
              helperText="Days until password expires"
            >
              <MenuItem value="30">30 days</MenuItem>
              <MenuItem value="60">60 days</MenuItem>
              <MenuItem value="90">90 days</MenuItem>
              <MenuItem value="180">180 days</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Session Timeout"
              value={settings.sessionTimeout}
              onChange={handleChange('sessionTimeout')}
              helperText="Minutes until session expires"
            >
              <MenuItem value="15">15 minutes</MenuItem>
              <MenuItem value="30">30 minutes</MenuItem>
              <MenuItem value="60">60 minutes</MenuItem>
              <MenuItem value="120">120 minutes</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection title="Access Control">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.ipRestriction}
                  onChange={handleChange('ipRestriction')}
                />
              }
              label={
                <div>
                  <Typography variant="body1" fontWeight={500}>
                    IP Restriction
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Restrict access to specific IP addresses
                  </Typography>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.auditLogging}
                  onChange={handleChange('auditLogging')}
                />
              }
              label={
                <div>
                  <Typography variant="body1" fontWeight={500}>
                    Audit Logging
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Log all user actions for audit purposes
                  </Typography>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dataEncryption}
                  onChange={handleChange('dataEncryption')}
                />
              }
              label={
                <div>
                  <Typography variant="body1" fontWeight={500}>
                    Data Encryption
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Enable end-to-end encryption for sensitive data
                  </Typography>
                </div>
              }
            />
          </Grid>
        </Grid>
      </PageSection>
    </PageWrapper>
  );
}
