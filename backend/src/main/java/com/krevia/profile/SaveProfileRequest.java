package com.krevia.profile;

import com.krevia.user.AccountType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record SaveProfileRequest(
        @NotNull
        ProfileType profileType,

        @NotNull
        AccountType accountType,

        @Size(max = 150)
        String headline,

        @Size(max = 1000)
        String bio,

        @Size(max = 100)
        String location,

        @Size(max = 255)
        String websiteUrl,

        @Size(max = 20)
        Set<@Size(max = 80) String> skills
) {
}
