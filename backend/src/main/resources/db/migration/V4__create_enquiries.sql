CREATE TABLE enquiries (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    service_id BIGINT,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(3000) NOT NULL,
    budget NUMERIC(12, 2),
    preferred_deadline DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_enquiries_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_enquiries_recipient
        FOREIGN KEY (recipient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_enquiries_service
        FOREIGN KEY (service_id)
        REFERENCES creator_services(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_enquiries_budget
        CHECK (budget IS NULL OR budget >= 0),

    CONSTRAINT chk_enquiries_status
        CHECK (status IN (
            'PENDING',
            'ACCEPTED',
            'DECLINED',
            'CANCELLED'
        ))
);

CREATE INDEX idx_enquiries_sender_id
    ON enquiries(sender_id);

CREATE INDEX idx_enquiries_recipient_id
    ON enquiries(recipient_id);

CREATE INDEX idx_enquiries_status
    ON enquiries(status);
