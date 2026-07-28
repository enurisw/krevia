package com.krevia.profile;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profiles")
public class UserProfileController {

    private final UserProfileService profileService;

    public UserProfileController(
            UserProfileService profileService
    ) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public UserProfileResponse getMyProfile(
            Authentication authentication
    ) {
        return profileService.getMyProfile(
                authentication.getName()
        );
    }

    @PutMapping("/me")
    public UserProfileResponse saveMyProfile(
            Authentication authentication,
            @Valid @RequestBody SaveProfileRequest request
    ) {
        return profileService.saveMyProfile(
                authentication.getName(),
                request
        );
    }
}
