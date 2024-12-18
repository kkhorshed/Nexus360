import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Switch, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';

interface SettingItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (checked: boolean) => void;
}

const SettingItem = ({ title, description, enabled, onChange }: SettingItemProps) => (
  <ListItem>
    <ListItemText
      primary={title}
      secondary={description}
      primaryTypographyProps={{
        fontWeight: 500
      }}
    />
    <ListItemSecondaryAction>
      <Switch
        edge="end"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </ListItemSecondaryAction>
  </ListItem>
);

export default function AdminSettings() {
  const [settings, setSettings] = React.useState({
    twoFactor: true,
    emailNotifications: true,
    auditLogging: true,
    autoLockout: false,
    maintenanceMode: false
  });

  const handleSettingChange = (setting: keyof typeof settings) => (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: checked
    }));
  };

  return (
    <PageWrapper
      title="Admin Settings"
      description="Configure system-wide administration settings"
      breadcrumbs={[
        { text: 'Settings', href: '/settings' },
        { text: 'Admin Settings' }
      ]}
    >
      <PageSection title="Security Settings">
        <List>
          <SettingItem
            title="Two-Factor Authentication"
            description="Require 2FA for all admin accounts"
            enabled={settings.twoFactor}
            onChange={handleSettingChange('twoFactor')}
          />
          <Divider component="li" />
          <SettingItem
            title="Auto Account Lockout"
            description="Automatically lock accounts after failed login attempts"
            enabled={settings.autoLockout}
            onChange={handleSettingChange('autoLockout')}
          />
        </List>
      </PageSection>

      <PageSection title="Notifications">
        <List>
          <SettingItem
            title="Email Notifications"
            description="Send email notifications for important system events"
            enabled={settings.emailNotifications}
            onChange={handleSettingChange('emailNotifications')}
          />
        </List>
      </PageSection>

      <PageSection title="System">
        <List>
          <SettingItem
            title="Audit Logging"
            description="Enable detailed audit logging for all admin actions"
            enabled={settings.auditLogging}
            onChange={handleSettingChange('auditLogging')}
          />
          <Divider component="li" />
          <SettingItem
            title="Maintenance Mode"
            description="Put the system in maintenance mode (restricts user access)"
            enabled={settings.maintenanceMode}
            onChange={handleSettingChange('maintenanceMode')}
          />
        </List>
      </PageSection>
    </PageWrapper>
  );
}
