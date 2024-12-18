-- Drop existing function if it exists
DROP FUNCTION IF EXISTS sync_azure_user;

-- Create updated function with profile_picture_url parameter
CREATE OR REPLACE FUNCTION sync_azure_user(
    p_id VARCHAR(255),
    p_email VARCHAR(255),
    p_display_name VARCHAR(255),
    p_given_name VARCHAR(255),
    p_surname VARCHAR(255),
    p_job_title VARCHAR(255),
    p_department VARCHAR(255),
    p_office_location VARCHAR(255),
    p_profile_picture_url VARCHAR(2048)
)
RETURNS TABLE (
    id VARCHAR(255),
    email VARCHAR(255),
    display_name VARCHAR(255),
    given_name VARCHAR(255),
    surname VARCHAR(255),
    job_title VARCHAR(255),
    department VARCHAR(255),
    office_location VARCHAR(255),
    profile_picture_url VARCHAR(2048),
    is_active BOOLEAN,
    last_sync_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    WITH upsert AS (
        INSERT INTO users (
            id,
            email,
            display_name,
            given_name,
            surname,
            job_title,
            department,
            office_location,
            profile_picture_url,
            is_active,
            last_sync_at
        )
        VALUES (
            p_id,
            p_email,
            p_display_name,
            p_given_name,
            p_surname,
            p_job_title,
            p_department,
            p_office_location,
            p_profile_picture_url,
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
            profile_picture_url = EXCLUDED.profile_picture_url,
            is_active = true,
            last_sync_at = CURRENT_TIMESTAMP
        RETURNING *
    )
    SELECT * FROM upsert;
END;
$$ LANGUAGE plpgsql;
