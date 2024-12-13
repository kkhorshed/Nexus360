import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/Common/PageWrapper';
import layout from '../../styles/Layout.module.css';
import styles from '../../styles/Settings.module.css';

interface SSOSettings {
  AZURE_AD_CLIENT_ID: string;
  AZURE_AD_CLIENT_SECRET: string;
  AZURE_AD_TENANT_ID: string;
  AZURE_AD_REDIRECT_URI: string;
  enableAutoProvisioning: boolean;
}

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

const SSOConfiguration: React.FC = () => {
  const [settings, setSettings] = useState<SSOSettings>({
    AZURE_AD_CLIENT_ID: '',
    AZURE_AD_CLIENT_SECRET: '',
    AZURE_AD_TENANT_ID: '',
    AZURE_AD_REDIRECT_URI: '',
    enableAutoProvisioning: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const [connectionStatus, setConnectionStatus] = useState<{
    status: 'connected' | 'disconnected' | 'testing';
    message: string;
    lastTested: string | null;
  }>({
    status: 'disconnected',
    message: 'Connection status unknown',
    lastTested: null
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const loadSettings = async () => {
    try {
      addDebugLog('Loading SSO settings...');
      const response = await fetch(`${AUTH_SERVICE_URL}/auth/sso-settings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSettings(data);
      addDebugLog('SSO settings loaded successfully');
    } catch (error) {
      console.error('Failed to load settings:', error);
      addDebugLog(`Failed to load settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSaveMessage({
        type: 'error',
        text: 'Failed to load SSO settings. Please check if the auth service is running.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      addDebugLog('Saving SSO settings...');

      const response = await fetch(`${AUTH_SERVICE_URL}/auth/sso-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to save settings');

      addDebugLog('SSO settings saved successfully');
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings';
      addDebugLog(`Error saving settings: ${errorMessage}`);
      setSaveMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      setConnectionStatus(prev => ({
        ...prev,
        status: 'testing',
        message: 'Testing connection...'
      }));
      addDebugLog('Starting SSO connection test...');

      const response = await fetch(`${AUTH_SERVICE_URL}/auth/test-connection`);
      const data = await response.json();

      // Add detailed logs from the response
      if (data.logs) {
        data.logs.forEach((log: string) => addDebugLog(log));
      }

      setConnectionStatus({
        status: data.success ? 'connected' : 'disconnected',
        message: data.message,
        lastTested: new Date().toLocaleString()
      });

      addDebugLog(`Connection test result: ${data.success ? 'Success' : 'Failed'}`);
      addDebugLog(`Status message: ${data.message}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addDebugLog(`Connection test error: ${errorMessage}`);
      setConnectionStatus({
        status: 'disconnected',
        message: 'Connection test failed. Please check if the auth service is running.',
        lastTested: new Date().toLocaleString()
      });
    }
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  return (
    <PageWrapper
      title="SSO Configuration"
      description="Configure Single Sign-On settings"
    >
      <section id="Settings.controls" className={layout.section}>
        <div className={styles.headerControls}>
          {saveMessage && (
            <div className={`${styles.saveMessage} ${styles[saveMessage.type]}`}>
              {saveMessage.text}
            </div>
          )}
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </section>

      <section id="Settings.sso" className={layout.section}>
        <div className={styles.ssoConfig}>
          <div className={styles.configSection}>
            <h3>Identity Provider Settings</h3>
            <div className={styles.formGroup}>
              <label>Azure AD Client ID</label>
              <input 
                type="text"
                name="AZURE_AD_CLIENT_ID"
                value={settings.AZURE_AD_CLIENT_ID}
                onChange={handleInputChange}
                placeholder="Enter your Azure AD Client ID"
                className={styles.input}
              />
              <span className={styles.helpText}>
                The client ID from your Azure AD application registration
              </span>
            </div>
            <div className={styles.formGroup}>
              <label>Azure AD Client Secret</label>
              <input 
                type="password"
                name="AZURE_AD_CLIENT_SECRET"
                value={settings.AZURE_AD_CLIENT_SECRET}
                onChange={handleInputChange}
                placeholder="Enter your Azure AD Client Secret"
                className={styles.input}
              />
              <span className={styles.helpText}>
                The client secret from your Azure AD application registration
              </span>
            </div>
            <div className={styles.formGroup}>
              <label>Azure AD Tenant ID</label>
              <input 
                type="text"
                name="AZURE_AD_TENANT_ID"
                value={settings.AZURE_AD_TENANT_ID}
                onChange={handleInputChange}
                placeholder="Enter your Azure AD Tenant ID"
                className={styles.input}
              />
              <span className={styles.helpText}>
                Your Azure AD tenant ID (Directory ID)
              </span>
            </div>
            <div className={styles.formGroup}>
              <label>Redirect URI</label>
              <input 
                type="text"
                name="AZURE_AD_REDIRECT_URI"
                value={settings.AZURE_AD_REDIRECT_URI}
                onChange={handleInputChange}
                placeholder="Enter your redirect URI"
                className={styles.input}
              />
              <span className={styles.helpText}>
                The URI where users will be redirected after authentication
              </span>
            </div>
          </div>

          <div className={styles.configSection}>
            <h3>Advanced Settings</h3>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  name="enableAutoProvisioning"
                  checked={settings.enableAutoProvisioning}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <span>Enable automatic user provisioning</span>
              </label>
              <span className={styles.helpText}>
                Automatically create user accounts when users sign in via SSO
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="Settings.content" className={layout.section}>
        <div className={styles.configSection}>
          <h3>Connection Status</h3>
          <div className={styles.statusCard}>
            <div className={styles.statusIndicator}>
              <span className={`${styles.statusDot} ${styles[connectionStatus.status]}`}></span>
              <span>{connectionStatus.status === 'testing' ? 'Testing...' : connectionStatus.message}</span>
            </div>
            {connectionStatus.lastTested && (
              <p>Last tested: {connectionStatus.lastTested}</p>
            )}
            <button 
              className={styles.testButton}
              onClick={testConnection}
              disabled={connectionStatus.status === 'testing'}
            >
              {connectionStatus.status === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        <div className={`${styles.configSection} ${styles.debugSection}`}>
          <div className={styles.debugHeader}>
            <h3>Debug Logs</h3>
            <button 
              className={styles.clearLogsButton}
              onClick={clearLogs}
            >
              Clear Logs
            </button>
          </div>
          <div className={styles.debugLogs}>
            {debugLogs.map((log, index) => (
              <div key={index} className={styles.logEntry}>
                {log}
              </div>
            ))}
            {debugLogs.length === 0 && (
              <div className={styles.noLogs}>No logs available</div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default SSOConfiguration;
