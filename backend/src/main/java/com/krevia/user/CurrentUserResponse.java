package com.krevia.user;

public record CurrentUserResponse(
        Long userId,
        String fullName,
        String email,
        UserRole role,
        AccountType accountType,
        AccountStatus status
) {
}