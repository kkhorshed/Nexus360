import { useState, useCallback } from 'react';
import { AzureConfig, ConfigurationState } from './types';

const AUTH_SERVICE_URL = 'http://localhost:3000';

export const useAzureConfig = () => {
  const [state, setState] = useState<ConfigurationState>({
    loading: false,
    error: null,
    config: null
  });

  const fetchConfig = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/config/azure`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Azure configuration');
      }

      const config = await response.json();
      setState(prev => ({ ...prev, loading: false, config }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch configuration'
      }));
    }
  }, []);

  const saveConfig = useCallback(async (config: AzureConfig) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/config/azure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save Azure configuration');
      }

      setState(prev => ({ ...prev, loading: false, config: data }));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save configuration';
      setState(prev => ({
        ...prev,
        loading: false,
        error: message.includes('Invalid Azure AD configuration') 
          ? 'Please verify your Azure AD credentials and try again'
          : message
      }));
      return false;
    }
  }, []);

  const testConnection = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/config/azure/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Azure AD connection test failed');
      }

      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection test failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: message.includes('configuration is incomplete') 
          ? 'Please save your Azure AD configuration first'
          : message.includes('configuration is invalid')
          ? 'Please verify your Azure AD credentials and try again'
          : message
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    fetchConfig,
    saveConfig,
    testConnection
  };
};
