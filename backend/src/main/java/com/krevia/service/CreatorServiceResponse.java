package com.krevia.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record CreatorServiceResponse(
        Long id,
        Long userId,
        String title,
        String description,
        String category,
        BigDecimal startingPrice,
        Integer deliveryDays,
        Boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static CreatorServiceResponse from(
            CreatorService service
    ) {
        return new CreatorServiceResponse(
                service.getId(),
                service.getUserId(),
                service.getTitle(),
                service.getDescription(),
                service.getCategory(),
                service.getStartingPrice(),
                service.getDeliveryDays(),
                service.getActive(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }
}
