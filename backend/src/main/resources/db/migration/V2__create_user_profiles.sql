CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    profile_type VARCHAR(30) NOT NULL,
    headline VARCHAR(150),
    bio VARCHAR(1000),
    location VARCHAR(100),
    website_url VARCHAR(255),
    avatar_url VARCHAR(500),
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_profile_type
        CHECK (profile_type IN (
            'STUDENT',
            'INDEPENDENT_CREATOR',
            'PROFESSIONAL_FREELANCER',
            'STARTUP_FOUNDER',
            'STARTUP_TEAM',
            'AGENCY',
            'BUSINESS',
            'GENERAL_CLIENT'
        ))
);

CREATE TABLE user_profile_skills (
    profile_id BIGINT NOT NULL,
    skill VARCHAR(80) NOT NULL,

    PRIMARY KEY (profile_id, skill),

    CONSTRAINT fk_profile_skills_profile
        FOREIGN KEY (profile_id)
        REFERENCES user_profiles(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_profile_type
    ON user_profiles(profile_type);

CREATE INDEX idx_user_profile_skills_skill
    ON user_profile_skills(skill);
