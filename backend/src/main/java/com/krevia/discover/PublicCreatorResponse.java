package com.krevia.discover;

import com.krevia.profile.UserProfile;
import com.krevia.service.CreatorServiceResponse;
import com.krevia.user.User;

import java.util.List;

public record PublicCreatorResponse(
        Long userId,
        String fullName,
        String profileType,
        String headline,
        String bio,
        String location,
        String websiteUrl,
        List<String> skills,
        List<CreatorServiceResponse> services
) {
    public static PublicCreatorResponse from(
            User user,
            UserProfile profile,
            List<CreatorServiceResponse> services
    ) {
        return new PublicCreatorResponse(
                user.getId(),
                user.getFullName(),
                profile.getProfileType() == null
                        ? null
                        : profile.getProfileType().name(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getLocation(),
                profile.getWebsiteUrl(),
                profile.getSkills() == null
                        ? List.of()
                        : List.copyOf(profile.getSkills()),
                services
        );
    }
}
