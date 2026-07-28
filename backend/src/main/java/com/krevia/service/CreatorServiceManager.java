package com.krevia.service;

import com.krevia.user.User;
import com.krevia.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CreatorServiceManager {

    private final CreatorServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public CreatorServiceManager(
            CreatorServiceRepository serviceRepository,
            UserRepository userRepository
    ) {
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CreatorServiceResponse> getMyServices(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        return serviceRepository
                .findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(CreatorServiceResponse::from)
                .toList();
    }

    @Transactional
    public CreatorServiceResponse createService(
            Authentication authentication,
            SaveCreatorServiceRequest request
    ) {
        User user = getCurrentUser(authentication);
        validateCreatorAccount(user);

        CreatorService service = new CreatorService();

        service.setUserId(user.getId());
        applyRequest(service, request);

        CreatorService saved =
                serviceRepository.save(service);

        return CreatorServiceResponse.from(saved);
    }

    @Transactional
    public CreatorServiceResponse updateService(
            Authentication authentication,
            Long serviceId,
            SaveCreatorServiceRequest request
    ) {
        User user = getCurrentUser(authentication);
        validateCreatorAccount(user);

        CreatorService service = serviceRepository
                .findByIdAndUserId(serviceId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Service not found"
                ));

        applyRequest(service, request);

        return CreatorServiceResponse.from(
                serviceRepository.save(service)
        );
    }

    @Transactional
    public void deleteService(
            Authentication authentication,
            Long serviceId
    ) {
        User user = getCurrentUser(authentication);

        CreatorService service = serviceRepository
                .findByIdAndUserId(serviceId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Service not found"
                ));

        serviceRepository.delete(service);
    }

    private User getCurrentUser(
            Authentication authentication
    ) {
        return userRepository
                .findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"
                ));
    }

    private void validateCreatorAccount(User user) {
        String accountType =
                user.getAccountType().name();

        if (
                !accountType.equals("CREATOR") &&
                !accountType.equals("BOTH")
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only creator accounts can add services"
            );
        }
    }

    private void applyRequest(
            CreatorService service,
            SaveCreatorServiceRequest request
    ) {
        service.setTitle(request.title().trim());
        service.setDescription(request.description().trim());
        service.setCategory(request.category().trim());
        service.setStartingPrice(request.startingPrice());
        service.setDeliveryDays(request.deliveryDays());
    }
}
