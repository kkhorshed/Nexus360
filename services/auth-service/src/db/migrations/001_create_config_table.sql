-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_app_config_updated_at ON app_config;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Create config table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_config (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
CREATE TRIGGER update_app_config_updated_at
    BEFORE UPDATE ON app_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index on key if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_app_config_key ON app_config(key);

-- Insert initial Azure AD config keys (values will be updated through the app)
INSERT INTO app_config (key, value, encrypted) VALUES
    ('azure_ad_tenant_id', '', false),
    ('azure_ad_client_id', '', false),
    ('azure_ad_client_secret', '', true)
ON CONFLICT (key) DO NOTHING;
