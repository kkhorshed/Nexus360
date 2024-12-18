-- Insert test users if they don't exist
INSERT INTO users (
    id,
    email,
    display_name,
    given_name,
    surname,
    job_title,
    department,
    is_active,
    last_sync_at
) VALUES 
(
    'test-admin-001',
    'test@example.com',
    'Development Admin',
    'Development',
    'Admin',
    'System Administrator',
    'IT',
    true,
    CURRENT_TIMESTAMP
),
(
    'test-user-001',
    'john.doe@example.com',
    'John Doe',
    'John',
    'Doe',
    'Senior Software Engineer',
    'Engineering',
    true,
    CURRENT_TIMESTAMP
),
(
    'test-user-002',
    'jane.smith@example.com',
    'Jane Smith',
    'Jane',
    'Smith',
    'Product Manager',
    'Product',
    true,
    CURRENT_TIMESTAMP
),
(
    'test-user-003',
    'bob.wilson@example.com',
    'Bob Wilson',
    'Bob',
    'Wilson',
    'Sales Director',
    'Sales',
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    given_name = EXCLUDED.given_name,
    surname = EXCLUDED.surname,
    job_title = EXCLUDED.job_title,
    department = EXCLUDED.department,
    is_active = EXCLUDED.is_active,
    last_sync_at = CURRENT_TIMESTAMP;
