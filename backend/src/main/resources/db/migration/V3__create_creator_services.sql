CREATE TABLE creator_services (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(1500) NOT NULL,
    category VARCHAR(80) NOT NULL,
    starting_price NUMERIC(12, 2) NOT NULL,
    delivery_days INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_creator_services_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_service_price
        CHECK (starting_price >= 0),

    CONSTRAINT chk_delivery_days
        CHECK (delivery_days BETWEEN 1 AND 365)
);

CREATE INDEX idx_creator_services_user_id
    ON creator_services(user_id);

CREATE INDEX idx_creator_services_category
    ON creator_services(category);
