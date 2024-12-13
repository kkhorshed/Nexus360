import { IntegrationProvider, useIntegration } from './context/IntegrationContext';

export {
    IntegrationProvider,
    useIntegration
};

export interface IntegrationStatus {
    isConnected: boolean;
    lastSync?: Date;
    error?: string;
}

export interface IntegrationService {
    name: string;
    status: IntegrationStatus;
}
