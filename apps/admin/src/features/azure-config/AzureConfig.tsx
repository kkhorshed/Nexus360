import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { Save as SaveIcon, Refresh as TestIcon } from '@mui/icons-material';
import PageWrapper from '../../components/common/PageWrapper';
import { useAzureConfig } from './hooks';
import { AzureConfig as AzureConfigType } from './types';

const AzureConfiguration: React.FC = () => {
  const { loading, error, config, fetchConfig, saveConfig, testConnection } = useAzureConfig();
  const [formData, setFormData] = useState<AzureConfigType>({
    tenantId: '',
    clientId: '',
    clientSecret: ''
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setFormData(prev => ({
        ...prev,
        tenantId: config.tenantId || '',
        clientId: config.clientId || '',
        clientSecret: '' // Don't populate secret from server
      }));
    }
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsSaving(true);
    try {
      const success = await saveConfig(formData);
      if (success) {
        setSuccessMessage('Configuration saved successfully');
        // Clear the secret field after successful save
        setFormData(prev => ({
          ...prev,
          clientSecret: ''
        }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setSuccessMessage('');
    setConnectionLogs([]);
    setIsTesting(true);
    try {
      const success = await testConnection();
      if (success) {
        setSuccessMessage('Connection test successful - Azure AD integration is working properly');
      } else {
        // Add error to logs
        setConnectionLogs(prev => [...prev, 'Azure AD connection failed: Failed to fetch users']);
      }
    } catch (err) {
      setConnectionLogs(prev => [...prev, `Error: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setIsTesting(false);
    }
  };

  const isProcessing = isSaving || isTesting;

  return (
    <PageWrapper
      title="Azure AD Configuration"
      description="Configure Azure AD integration settings"
      breadcrumbs={[
        { text: 'Settings', href: '/settings' },
        { text: 'Azure Configuration' }
      ]}
    >
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Tenant ID"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={isProcessing}
              helperText="Azure AD Directory (tenant) ID from Overview page"
              placeholder="e.g., 12345678-1234-1234-1234-123456789012"
            />

            <TextField
              label="Client ID"
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={isProcessing}
              helperText="Application (client) ID from Overview page"
              placeholder="e.g., 87654321-4321-4321-4321-210987654321"
            />

            <TextField
              label="Client Secret"
              name="clientSecret"
              value={formData.clientSecret}
              onChange={handleInputChange}
              fullWidth
              required={!config?.tenantId}
              disabled={isProcessing}
              type="password"
              helperText={
                config?.tenantId 
                  ? "Leave blank to keep existing secret" 
                  : "Client secret VALUE (not ID) from Certificates & secrets"
              }
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isProcessing}
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>

              <Button
                variant="outlined"
                startIcon={isTesting ? <CircularProgress size={20} /> : <TestIcon />}
                onClick={handleTestConnection}
                disabled={isProcessing || (!config?.tenantId && !formData.tenantId)}
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configuration Guide
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          <Box component="ol" sx={{ pl: 2, '& li': { mb: 1 } }}>
            <li>Go to Azure Portal and navigate to Azure Active Directory</li>
            <li>Register a new application or select an existing one</li>
            <li>From the Overview page, copy the Directory (tenant) ID</li>
            <li>Also from Overview, copy the Application (client) ID</li>
            <li>Under Certificates & secrets:
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <li>Create a new client secret if needed</li>
                <li>Copy the secret VALUE immediately after creation</li>
                <li>Important: Use the secret VALUE, not the secret ID</li>
              </Box>
            </li>
            <li>Under API permissions:
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <li>Add User.Read permission</li>
                <li>Add Directory.Read.All permission</li>
                <li>Add GroupMember.Read.All permission</li>
              </Box>
            </li>
            <li>Click "Grant admin consent" for the added permissions</li>
            <li>Enter these details in the form above and save</li>
          </Box>
        </Typography>
      </Paper>

      {/* Connection Logs Window */}
      {connectionLogs.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Connection Logs
          </Typography>
          <Box 
            sx={{ 
              backgroundColor: '#000',
              color: '#fff',
              p: 2,
              borderRadius: 1,
              fontFamily: 'monospace',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
          >
            {connectionLogs.map((log, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {log}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
    </PageWrapper>
  );
};

export default AzureConfiguration;
