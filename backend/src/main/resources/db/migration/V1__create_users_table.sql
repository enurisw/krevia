CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    account_type VARCHAR(20) NOT NULL DEFAULT 'BOTH',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_role
        CHECK (role IN ('USER', 'ADMIN')),

    CONSTRAINT chk_users_account_type
        CHECK (account_type IN ('CLIENT', 'CREATOR', 'BOTH')),

    CONSTRAINT chk_users_status
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);