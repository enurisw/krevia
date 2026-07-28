package com.krevia.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CreatorServiceRepository
        extends JpaRepository<CreatorService, Long> {

    List<CreatorService> findAllByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    Optional<CreatorService> findByIdAndUserId(
            Long id,
            Long userId
    );
}
