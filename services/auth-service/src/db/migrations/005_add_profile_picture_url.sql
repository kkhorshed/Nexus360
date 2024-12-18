-- Add profile_picture_url column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(2048);

-- Create index for profile_picture_url
CREATE INDEX IF NOT EXISTS idx_users_profile_picture_url ON users(profile_picture_url);
