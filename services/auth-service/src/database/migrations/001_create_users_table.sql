-- Create users table to persist Azure AD users
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,  -- Azure AD Object ID
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    given_name VARCHAR(255),
    surname VARCHAR(255),
    job_title VARCHAR(255),
    department VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_display_name ON users(display_name);
CREATE INDEX idx_users_department ON users(department);

-- Add foreign key constraints to existing tables
ALTER TABLE user_app_access
ADD CONSTRAINT fk_user_app_access_user
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE user_app_roles
ADD CONSTRAINT fk_user_app_roles_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- Create view for user permissions
CREATE VIEW user_permissions_view AS
SELECT 
    u.id as user_id,
    u.email,
    u.display_name,
    a.id as app_id,
    a.name as app_name,
    ar.id as role_id,
    ar.name as role_name,
    ap.id as permission_id,
    ap.name as permission_name
FROM users u
JOIN user_app_access uaa ON u.id = uaa.user_id
JOIN applications a ON uaa.app_id = a.id
JOIN user_app_roles uar ON u.id = uar.user_id
JOIN app_roles ar ON uar.app_role_id = ar.id
JOIN app_role_permissions arp ON ar.id = arp.app_role_id
JOIN app_permissions ap ON arp.permission_id = ap.id
WHERE u.is_active = true
    AND uaa.is_active = true
    AND uar.is_active = true;

-- Create function to sync Azure AD user
CREATE OR REPLACE FUNCTION sync_azure_user(
    p_id VARCHAR(255),
    p_email VARCHAR(255),
    p_display_name VARCHAR(255),
    p_given_name VARCHAR(255),
    p_surname VARCHAR(255),
    p_job_title VARCHAR(255),
    p_department VARCHAR(255)
) RETURNS users AS $$
BEGIN
    INSERT INTO users (
        id, email, display_name, given_name, surname, 
        job_title, department, last_sync_at
    ) VALUES (
        p_id, p_email, p_display_name, p_given_name, p_surname,
        p_job_title, p_department, CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
        email = p_email,
        display_name = p_display_name,
        given_name = p_given_name,
        surname = p_surname,
        job_title = p_job_title,
        department = p_department,
        last_sync_at = CURRENT_TIMESTAMP;
        
    RETURN (SELECT * FROM users WHERE id = p_id);
END;
$$ LANGUAGE plpgsql;
