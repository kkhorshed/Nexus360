// Platform integration types and utilities
export type IntegrationType = 'internal' | 'external';

// Base configuration interface for integrations
export interface IntegrationConfig {
    type: IntegrationType;
    enabled: boolean;
    timeout?: number;
}
