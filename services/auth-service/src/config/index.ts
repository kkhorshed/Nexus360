interface Config {
  port: number;
  nodeEnv: string;
  cors: {
    allowedOrigins: string[];
  };
  azure: {
    clientId: string;
    clientSecret: string;
    tenantId: string;
  };
  logging: {
    level: string;
    format: string;
  };
}

// Default values for testing
const defaultConfig: Config = {
  port: 3001,
  nodeEnv: 'test',
  cors: {
    allowedOrigins: ['http://localhost:3000']
  },
  azure: {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    tenantId: 'test-tenant-id'
  },
  logging: {
    level: 'info',
    format: 'json'
  }
};

export const config: Config = {
  port: Number(process.env.PORT) || defaultConfig.port,
  nodeEnv: process.env.NODE_ENV || defaultConfig.nodeEnv,
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || defaultConfig.cors.allowedOrigins
  },
  azure: {
    clientId: process.env.AZURE_AD_CLIENT_ID || defaultConfig.azure.clientId,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET || defaultConfig.azure.clientSecret,
    tenantId: process.env.AZURE_AD_TENANT_ID || defaultConfig.azure.tenantId
  },
  logging: {
    level: process.env.LOG_LEVEL || defaultConfig.logging.level,
    format: process.env.LOG_FORMAT || defaultConfig.logging.format
  }
};
