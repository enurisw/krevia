package com.krevia.discover;

import com.krevia.profile.UserProfile;
import com.krevia.profile.UserProfileRepository;
import com.krevia.service.CreatorServiceRepository;
import com.krevia.service.CreatorServiceResponse;
import com.krevia.user.User;
import com.krevia.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class DiscoverManager {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final CreatorServiceRepository serviceRepository;

    public DiscoverManager(
            UserRepository userRepository,
            UserProfileRepository profileRepository,
            CreatorServiceRepository serviceRepository
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<PublicCreatorResponse> discoverCreators(
            String search,
            String category
    ) {
        String searchValue = normalize(search);
        String categoryValue = normalize(category);

        return userRepository.findAll()
                .stream()
                .filter(this::isCreator)
                .flatMap(user -> profileRepository
                        .findByUserId(user.getId())
                        .stream()
                        .map(profile -> buildPublicCreator(user, profile)))
                .filter(creator -> matchesSearch(
                        creator,
                        searchValue
                ))
                .filter(creator -> matchesCategory(
                        creator,
                        categoryValue
                ))
                .toList();
    }

    public PublicCreatorResponse getCreator(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Creator not found"
                ));

        if (!isCreator(user)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Creator not found"
            );
        }

        UserProfile profile = profileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Creator profile not found"
                ));

        return buildPublicCreator(user, profile);
    }

    private PublicCreatorResponse buildPublicCreator(
            User user,
            UserProfile profile
    ) {
        List<CreatorServiceResponse> services =
                serviceRepository
                        .findAllByUserIdAndActiveTrueOrderByCreatedAtDesc(
                                user.getId()
                        )
                        .stream()
                        .map(CreatorServiceResponse::from)
                        .toList();

        return PublicCreatorResponse.from(
                user,
                profile,
                services
        );
    }

    private boolean isCreator(User user) {
        String accountType =
                user.getAccountType().name();

        return accountType.equals("CREATOR") ||
                accountType.equals("BOTH");
    }

    private boolean matchesSearch(
            PublicCreatorResponse creator,
            String search
    ) {
        if (search.isBlank()) {
            return true;
        }

        boolean profileMatches =
                contains(creator.fullName(), search) ||
                        contains(creator.headline(), search) ||
                        contains(creator.bio(), search) ||
                        contains(creator.location(), search) ||
                        creator.skills()
                                .stream()
                                .anyMatch(skill -> contains(skill, search));

        boolean serviceMatches = creator.services()
                .stream()
                .anyMatch(service ->
                        contains(service.title(), search) ||
                                contains(service.description(), search) ||
                                contains(service.category(), search)
                );

        return profileMatches || serviceMatches;
    }

    private boolean matchesCategory(
            PublicCreatorResponse creator,
            String category
    ) {
        if (category.isBlank()) {
            return true;
        }

        return creator.services()
                .stream()
                .anyMatch(service ->
                        contains(service.category(), category)
                );
    }

    private boolean contains(
            String value,
            String search
    ) {
        return value != null &&
                value.toLowerCase(Locale.ROOT)
                        .contains(search);
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.trim().toLowerCase(Locale.ROOT);
    }
}
