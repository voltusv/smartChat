-- Add user fields to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_context JSONB DEFAULT '{}';

-- Create auth_configs table
CREATE TABLE IF NOT EXISTS auth_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id),
    
    auth_mode VARCHAR(50) DEFAULT 'none',
    
    login_url VARCHAR(500),
    login_method VARCHAR(10) DEFAULT 'POST',
    
    email_field VARCHAR(100) DEFAULT 'email',
    password_field VARCHAR(100) DEFAULT 'password',
    
    response_user_id_path VARCHAR(255) DEFAULT 'user._id',
    response_token_path VARCHAR(255) DEFAULT 'token',
    response_name_path VARCHAR(255),
    response_email_path VARCHAR(255),
    
    extra_headers JSONB DEFAULT '{}',
    jwt_secret VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
