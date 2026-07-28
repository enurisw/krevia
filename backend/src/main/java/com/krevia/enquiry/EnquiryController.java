package com.krevia.enquiry;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enquiries")
public class EnquiryController {

    private final EnquiryManager enquiryManager;

    public EnquiryController(
            EnquiryManager enquiryManager
    ) {
        this.enquiryManager = enquiryManager;
    }

    @PostMapping
    public EnquiryResponse createEnquiry(
            @Valid @RequestBody CreateEnquiryRequest request,
            Authentication authentication
    ) {
        return enquiryManager.createEnquiry(
                request,
                authentication
        );
    }

    @GetMapping("/sent")
    public List<EnquiryResponse> getSentEnquiries(
            Authentication authentication
    ) {
        return enquiryManager.getSentEnquiries(authentication);
    }

    @GetMapping("/received")
    public List<EnquiryResponse> getReceivedEnquiries(
            Authentication authentication
    ) {
        return enquiryManager.getReceivedEnquiries(
                authentication
        );
    }

    @PatchMapping("/{enquiryId}/status")
    public EnquiryResponse updateStatus(
            @PathVariable Long enquiryId,
            @Valid @RequestBody
            UpdateEnquiryStatusRequest request,
            Authentication authentication
    ) {
        return enquiryManager.updateStatus(
                enquiryId,
                request,
                authentication
        );
    }
}
