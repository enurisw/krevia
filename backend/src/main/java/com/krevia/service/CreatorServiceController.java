package com.krevia.service;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class CreatorServiceController {

    private final CreatorServiceManager serviceManager;

    public CreatorServiceController(
            CreatorServiceManager serviceManager
    ) {
        this.serviceManager = serviceManager;
    }

    @GetMapping("/me")
    public List<CreatorServiceResponse> getMyServices(
            Authentication authentication
    ) {
        return serviceManager.getMyServices(authentication);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatorServiceResponse createService(
            Authentication authentication,
            @Valid @RequestBody SaveCreatorServiceRequest request
    ) {
        return serviceManager.createService(
                authentication,
                request
        );
    }

    @PutMapping("/{serviceId}")
    public CreatorServiceResponse updateService(
            Authentication authentication,
            @PathVariable Long serviceId,
            @Valid @RequestBody SaveCreatorServiceRequest request
    ) {
        return serviceManager.updateService(
                authentication,
                serviceId,
                request
        );
    }

    @DeleteMapping("/{serviceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(
            Authentication authentication,
            @PathVariable Long serviceId
    ) {
        serviceManager.deleteService(
                authentication,
                serviceId
        );
    }
}
