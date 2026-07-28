package com.krevia.profile;

import com.krevia.user.User;
import com.krevia.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;

    public UserProfileService(
            UserRepository userRepository,
            UserProfileRepository profileRepository
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(String email) {
        User user = findUser(email);

        UserProfile profile = profileRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Profile has not been created"
                ));

        return createResponse(profile);
    }

    @Transactional
    public UserProfileResponse saveMyProfile(
            String email,
            SaveProfileRequest request
    ) {
        User user = findUser(email);

        UserProfile profile = profileRepository
                .findByUserId(user.getId())
                .orElseGet(UserProfile::new);

        profile.setUser(user);
        profile.setProfileType(request.profileType());
        profile.setHeadline(clean(request.headline()));
        profile.setBio(clean(request.bio()));
        profile.setLocation(clean(request.location()));
        profile.setWebsiteUrl(clean(request.websiteUrl()));
        profile.setSkills(cleanSkills(request.skills()));
        profile.setOnboardingCompleted(true);

        user.setAccountType(request.accountType());
        userRepository.save(user);

        return createResponse(profileRepository.save(profile));
    }

    private User findUser(String email) {
        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User account not found"
                ));
    }

    private Set<String> cleanSkills(Set<String> skills) {
        if (skills == null) {
            return new LinkedHashSet<>();
        }

        return skills.stream()
                .filter(skill -> skill != null && !skill.isBlank())
                .map(String::trim)
                .limit(20)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private UserProfileResponse createResponse(UserProfile profile) {
        User user = profile.getUser();

        return new UserProfileResponse(
                profile.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAccountType(),
                profile.getProfileType(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getLocation(),
                profile.getWebsiteUrl(),
                profile.getAvatarUrl(),
                profile.getSkills(),
                profile.isOnboardingCompleted()
        );
    }
}
