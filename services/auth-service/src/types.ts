export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  saltRounds: number;
}

export interface AzureConfig {
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

export interface CorsConfig {
  allowedOrigins: string[];
}

export interface Config {
  env: string;
  port: string | number;
  logLevel: LogLevel;
  auth: AuthConfig;
  azure: AzureConfig;
  database: DatabaseConfig;
  cors: CorsConfig;
}
