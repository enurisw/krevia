package com.krevia.service;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SaveCreatorServiceRequest(

        @NotBlank(message = "Service title is required")
        @Size(max = 120)
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 1500)
        String description,

        @NotBlank(message = "Category is required")
        @Size(max = 80)
        String category,

        @NotNull(message = "Starting price is required")
        @DecimalMin(value = "0.00")
        BigDecimal startingPrice,

        @NotNull(message = "Delivery time is required")
        @Min(value = 1)
        @Max(value = 365)
        Integer deliveryDays

) {
}
