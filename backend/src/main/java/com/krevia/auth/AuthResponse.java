package com.krevia.auth;

import com.krevia.user.AccountType;
import com.krevia.user.UserRole;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        UserRole role,
        AccountType accountType
) {
}