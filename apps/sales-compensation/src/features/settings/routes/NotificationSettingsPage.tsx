import { useState } from 'react';
import {
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  FormGroup,
  Typography,
} from '@mui/material';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

interface NotificationSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  commissionPayoutNotifications: boolean;
  planChangesNotifications: boolean;
  quotaUpdatesNotifications: boolean;
  teamPerformanceNotifications: boolean;
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    notificationsEnabled: true,
    emailNotifications: true,
    commissionPayoutNotifications: true,
    planChangesNotifications: true,
    quotaUpdatesNotifications: true,
    teamPerformanceNotifications: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof NotificationSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.checked;
    
    if (field === 'notificationsEnabled' && !value) {
      // If notifications are disabled, disable all other notifications
      setSettings(prev => ({
        ...prev,
        notificationsEnabled: false,
        emailNotifications: false,
        commissionPayoutNotifications: false,
        planChangesNotifications: false,
        quotaUpdatesNotifications: false,
        teamPerformanceNotifications: false,
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value,
      }));
    }
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
      title="Notification Settings"
      description="Configure your notification preferences"
      actions={actions}
    >
      {saved && (
        <Alert severity="success">
          Settings saved successfully
        </Alert>
      )}

      <PageSection>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationsEnabled}
                    onChange={handleChange('notificationsEnabled')}
                  />
                }
                label={
                  <Typography variant="subtitle1" fontWeight={500}>
                    Enable All Notifications
                  </Typography>
                }
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleChange('emailNotifications')}
                    disabled={!settings.notificationsEnabled}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.commissionPayoutNotifications}
                    onChange={handleChange('commissionPayoutNotifications')}
                    disabled={!settings.notificationsEnabled}
                  />
                }
                label="Commission Payout Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.planChangesNotifications}
                    onChange={handleChange('planChangesNotifications')}
                    disabled={!settings.notificationsEnabled}
                  />
                }
                label="Plan Changes Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.quotaUpdatesNotifications}
                    onChange={handleChange('quotaUpdatesNotifications')}
                    disabled={!settings.notificationsEnabled}
                  />
                }
                label="Quota Updates Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.teamPerformanceNotifications}
                    onChange={handleChange('teamPerformanceNotifications')}
                    disabled={!settings.notificationsEnabled}
                  />
                }
                label="Team Performance Notifications"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </PageSection>
    </PageWrapper>
  );
}
