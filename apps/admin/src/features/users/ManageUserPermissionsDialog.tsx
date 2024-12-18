import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { User, AppPermission } from './types';

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, roles: string[], appPermissions: AppPermission[]) => Promise<void>;
}

const AUTH_SERVICE_URL = 'http://localhost:3001';

const ManageUserPermissionsDialog: React.FC<Props> = ({
  open,
  user,
  onClose,
  onSave
}) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [apps, setApps] = useState<{ id: string; name: string; }[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<AppPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch available roles and apps
  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      setLoading(true);
      setError(null);
      try {
        const [rolesResponse, appsResponse] = await Promise.all([
          fetch(`${AUTH_SERVICE_URL}/api/roles`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${AUTH_SERVICE_URL}/api/apps`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!rolesResponse.ok || !appsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [rolesData, appsData] = await Promise.all([
          rolesResponse.json(),
          appsResponse.json()
        ]);

        setRoles(rolesData);
        setApps(appsData);

        // Initialize selections with user's current permissions
        if (user) {
          setSelectedRoles(user.roles);
          setSelectedApps(user.appPermissions || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, user]);

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleAppPermissionChange = (appId: string, appName: string) => {
    setSelectedApps(prev => {
      const existing = prev.find(p => p.appId === appId);
      if (existing) {
        return prev.map(p => 
          p.appId === appId
            ? { ...p, hasAccess: !p.hasAccess }
            : p
        );
      }
      return [...prev, { appId, appName, hasAccess: true }];
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(user.id, selectedRoles, selectedApps);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Manage Permissions - {user.displayName}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Roles</FormLabel>
                <FormGroup>
                  {roles.map(role => (
                    <FormControlLabel
                      key={role}
                      control={
                        <Checkbox
                          checked={selectedRoles.includes(role)}
                          onChange={() => handleRoleChange(role)}
                        />
                      }
                      label={role}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                App Access
              </Typography>
              <FormGroup>
                {apps.map(app => (
                  <FormControlLabel
                    key={app.id}
                    control={
                      <Checkbox
                        checked={selectedApps.some(p => p.appId === app.id && p.hasAccess)}
                        onChange={() => handleAppPermissionChange(app.id, app.name)}
                      />
                    }
                    label={app.name}
                  />
                ))}
              </FormGroup>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageUserPermissionsDialog;
