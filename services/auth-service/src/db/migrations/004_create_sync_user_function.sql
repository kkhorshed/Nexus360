-- Create or replace the sync_azure_user function
CREATE OR REPLACE FUNCTION sync_azure_user(
    p_id VARCHAR,
    p_email VARCHAR,
    p_display_name VARCHAR,
    p_given_name VARCHAR,
    p_surname VARCHAR,
    p_job_title VARCHAR,
    p_department VARCHAR,
    p_office_location VARCHAR
) RETURNS users AS $$
DECLARE
    v_user users;
BEGIN
    -- Insert or update the user
    INSERT INTO users (
        id,
        email,
        display_name,
        given_name,
        surname,
        job_title,
        department,
        office_location,
        is_active,
        last_sync_at
    ) VALUES (
        p_id,
        p_email,
        p_display_name,
        p_given_name,
        p_surname,
        p_job_title,
        p_department,
        p_office_location,
        true,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        given_name = EXCLUDED.given_name,
        surname = EXCLUDED.surname,
        job_title = EXCLUDED.job_title,
        department = EXCLUDED.department,
        office_location = EXCLUDED.office_location,
        is_active = true,
        last_sync_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    RETURNING * INTO v_user;

    RETURN v_user;
END;
$$ LANGUAGE plpgsql;

-- Create user_permissions_view if it doesn't exist
CREATE OR REPLACE VIEW user_permissions_view AS
SELECT 
    u.id as user_id,
    u.email,
    u.display_name,
    u.department,
    u.job_title,
    u.office_location,
    u.last_sync_at,
    'Default App' as app_name,  -- Placeholder for actual app name
    'Default Role' as role_name,  -- Placeholder for actual role
    'Default Permission' as permission_name  -- Placeholder for actual permission
FROM users u
WHERE u.is_active = true;
