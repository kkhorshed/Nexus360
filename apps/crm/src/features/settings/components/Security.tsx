import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
} from '@mui/material';
import {
  Security as SecurityIcon,
  VpnKey as PasswordIcon,
  Shield as PermissionsIcon,
  History as AuditIcon,
} from '@mui/icons-material';
import PageWrapper, { PageSection } from '../../../components/common/PageWrapper';

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Permission {
  id: string;
  module: string;
  action: string;
  enabled: boolean;
}

const securitySettings: SecuritySetting[] = [
  {
    id: '2fa',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all users',
    enabled: true,
  },
  {
    id: 'password-policy',
    name: 'Strong Password Policy',
    description: 'Enforce complex password requirements',
    enabled: true,
  },
  {
    id: 'session-timeout',
    name: 'Session Timeout',
    description: 'Automatically log out inactive users after 30 minutes',
    enabled: true,
  },
  {
    id: 'ip-restriction',
    name: 'IP Restriction',
    description: 'Restrict access to specific IP addresses',
    enabled: false,
  },
];

const permissions: Permission[] = [
  { id: 'users-view', module: 'Users', action: 'View', enabled: true },
  { id: 'users-create', module: 'Users', action: 'Create', enabled: false },
  { id: 'users-edit', module: 'Users', action: 'Edit', enabled: false },
  { id: 'users-delete', module: 'Users', action: 'Delete', enabled: false },
  { id: 'teams-view', module: 'Teams', action: 'View', enabled: true },
  { id: 'teams-create', module: 'Teams', action: 'Create', enabled: false },
  { id: 'teams-edit', module: 'Teams', action: 'Edit', enabled: false },
  { id: 'teams-delete', module: 'Teams', action: 'Delete', enabled: false },
];

export default function Security() {
  const [settings, setSettings] = useState(securitySettings);
  const [rolePermissions, setRolePermissions] = useState(permissions);

  const handleSettingToggle = (settingId: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handlePermissionToggle = (permissionId: string) => {
    setRolePermissions(prevPermissions =>
      prevPermissions.map(permission =>
        permission.id === permissionId
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  return (
    <PageWrapper
      title="Security"
      description="Manage security settings and permissions"
    >
      <PageSection title="Security Settings">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6">General Settings</Typography>
        </Box>
        <List>
          {settings.map((setting, index) => (
            <React.Fragment key={setting.id}>
              <ListItem>
                <ListItemText
                  primary={setting.name}
                  secondary={setting.description}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={setting.enabled}
                    onChange={() => handleSettingToggle(setting.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {index < settings.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </PageSection>

      <PageSection title="Role Permissions">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PermissionsIcon color="primary" />
          <Typography variant="h6">Access Control</Typography>
        </Box>
        <FormGroup>
          {rolePermissions.map((permission) => (
            <FormControlLabel
              key={permission.id}
              control={
                <Checkbox
                  checked={permission.enabled}
                  onChange={() => handlePermissionToggle(permission.id)}
                />
              }
              label={`${permission.module} - ${permission.action}`}
            />
          ))}
        </FormGroup>
      </PageSection>

      <PageSection title="Password Policy">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PasswordIcon color="primary" />
          <Typography variant="h6">Password Requirements</Typography>
        </Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Current password policy requires minimum 8 characters, including uppercase, lowercase, numbers, and special characters.
        </Alert>
        <Button variant="outlined" color="primary">
          Update Password Policy
        </Button>
      </PageSection>

      <PageSection title="Security Audit">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AuditIcon color="primary" />
          <Typography variant="h6">Audit Logs</Typography>
        </Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          Security audit logging is enabled and actively monitoring system events.
        </Alert>
        <Button variant="outlined" color="primary">
          View Audit Logs
        </Button>
      </PageSection>
    </PageWrapper>
  );
}
