import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Typography,
  Chip
} from '@mui/material';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';

interface AccessRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: 'global' | 'role' | 'user';
}

const initialRules: AccessRule[] = [
  {
    id: '1',
    name: 'IP Restriction',
    description: 'Restrict access to specific IP addresses',
    enabled: true,
    scope: 'global'
  },
  {
    id: '2',
    name: 'Time-based Access',
    description: 'Restrict access to specific time periods',
    enabled: false,
    scope: 'role'
  },
  {
    id: '3',
    name: 'Device Restriction',
    description: 'Restrict access to approved devices',
    enabled: true,
    scope: 'user'
  },
  {
    id: '4',
    name: 'Location-based Access',
    description: 'Restrict access based on geographic location',
    enabled: false,
    scope: 'global'
  },
  {
    id: '5',
    name: 'Multi-factor Authentication',
    description: 'Require MFA for sensitive operations',
    enabled: true,
    scope: 'role'
  }
];

const getScopeColor = (scope: string) => {
  switch (scope) {
    case 'global':
      return 'primary';
    case 'role':
      return 'secondary';
    case 'user':
      return 'success';
    default:
      return 'default';
  }
};

export default function AccessControl() {
  const [rules, setRules] = React.useState<AccessRule[]>(initialRules);

  const handleToggleRule = (ruleId: string) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <PageWrapper
      title="Access Control"
      description="Configure system access control rules and policies"
      breadcrumbs={[
        { text: 'Settings', href: '/settings' },
        { text: 'Access Control' }
      ]}
    >
      <PageSection title="Access Rules">
        <List>
          {rules.map((rule, index) => (
            <React.Fragment key={rule.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {rule.name}
                      <Chip
                        label={rule.scope}
                        size="small"
                        color={getScopeColor(rule.scope) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {rule.description}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </PageSection>

      <PageSection title="Active Policies">
        <Typography variant="body1" color="text.secondary">
          {rules.filter(rule => rule.enabled).length} of {rules.length} access rules are currently active.
        </Typography>
      </PageSection>

      <PageSection title="Access Scopes">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Global Rules</Typography>
            <Typography variant="body2" color="text.secondary">
              {rules.filter(rule => rule.scope === 'global').length} rules
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Role-based Rules</Typography>
            <Typography variant="body2" color="text.secondary">
              {rules.filter(rule => rule.scope === 'role').length} rules
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>User-specific Rules</Typography>
            <Typography variant="body2" color="text.secondary">
              {rules.filter(rule => rule.scope === 'user').length} rules
            </Typography>
          </Box>
        </Box>
      </PageSection>
    </PageWrapper>
  );
}
