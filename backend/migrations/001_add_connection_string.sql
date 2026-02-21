-- Add connection_string column to db_connections
-- This allows using full MongoDB URIs for replica sets, special auth, etc.

ALTER TABLE db_connections 
ADD COLUMN IF NOT EXISTS connection_string TEXT;

-- Make individual connection params nullable (they're optional when using connection_string)
ALTER TABLE db_connections ALTER COLUMN host DROP NOT NULL;
ALTER TABLE db_connections ALTER COLUMN port DROP NOT NULL;
ALTER TABLE db_connections ALTER COLUMN database DROP NOT NULL;
ALTER TABLE db_connections ALTER COLUMN username DROP NOT NULL;
ALTER TABLE db_connections ALTER COLUMN password DROP NOT NULL;
