package com.krevia.enquiry;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateEnquiryRequest(
        @NotNull
        Long recipientId,

        Long serviceId,

        @NotBlank
        @Size(max = 150)
        String title,

        @NotBlank
        @Size(max = 3000)
        String description,

        @PositiveOrZero
        BigDecimal budget,

        @FutureOrPresent
        LocalDate preferredDeadline
) {
}
