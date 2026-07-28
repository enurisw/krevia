package com.krevia.profile;

import com.krevia.user.AccountType;

import java.util.Set;

public record UserProfileResponse(
        Long profileId,
        Long userId,
        String fullName,
        String email,
        AccountType accountType,
        ProfileType profileType,
        String headline,
        String bio,
        String location,
        String websiteUrl,
        String avatarUrl,
        Set<String> skills,
        boolean onboardingCompleted
) {
}
