package com.krevia.enquiry;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EnquiryResponse(
        Long id,
        Long senderId,
        String senderName,
        Long recipientId,
        String recipientName,
        Long serviceId,
        String serviceTitle,
        String title,
        String description,
        BigDecimal budget,
        LocalDate preferredDeadline,
        EnquiryStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
