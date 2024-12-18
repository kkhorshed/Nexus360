export interface AzureConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

export interface ConfigurationState {
  loading: boolean;
  error: string | null;
  config: AzureConfig | null;
}
