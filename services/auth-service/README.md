# Auth Service

## Azure AD Configuration Storage

The Azure AD configuration is securely stored in PostgreSQL using the following schema:

```sql
CREATE TABLE app_config (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Security Features

1. Encryption:
   - Sensitive values (like client secrets) are encrypted before storage
   - Uses AES-256-GCM encryption with salt and IV
   - Encryption key is configured via ENCRYPTION_KEY environment variable

2. Database Security:
   - Values are stored in a dedicated config table
   - Encrypted values are marked with encrypted=true
   - Timestamps track creation and updates
   - Uses database transactions for atomic updates

## Environment Variables

Required environment variables:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Encryption Configuration
ENCRYPTION_KEY=your-encryption-key-min-32-chars-long

# Default Azure AD Configuration (optional)
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
```

## Setup Instructions

1. Database Setup:
   ```bash
   # Run the migration script
   psql -U your_user -d your_database -f src/db/migrations/001_create_config_table.sql
   ```

2. Environment Setup:
   - Copy `.env.example` to `.env`
   - Update database connection string
   - Set encryption key
   - (Optional) Set default Azure AD credentials

3. Start the Service:
   ```bash
   npm run dev
   ```

## Configuration Management

The configuration can be managed through:

1. Admin Interface:
   - Navigate to Settings > Azure Configuration
   - Input Azure AD credentials
   - Test connection
   - Save configuration (automatically encrypted)

2. API Endpoints:
   - GET /api/config/azure - Get current configuration
   - POST /api/config/azure - Update configuration
   - POST /api/config/azure/test - Test current configuration

## Security Considerations

1. Database Security:
   - Use strong PostgreSQL user passwords
   - Configure proper database access controls
   - Enable SSL for database connections
   - Regular database backups

2. Encryption:
   - Use a strong ENCRYPTION_KEY (min 32 characters)
   - Store ENCRYPTION_KEY securely (e.g., Azure Key Vault in production)
   - Rotate encryption keys periodically

3. Access Control:
   - API endpoints require authentication
   - Configuration access is logged
   - Failed attempts are monitored

## Backup and Recovery

1. Database Backup:
   ```bash
   pg_dump -U your_user -d your_database -t app_config > config_backup.sql
   ```

2. Database Restore:
   ```bash
   psql -U your_user -d your_database -f config_backup.sql
   ```

## Development Notes

- The service uses a singleton pattern for database connections
- Configuration changes are validated before saving
- Failed configurations are automatically rolled back
- All operations are logged for auditing
