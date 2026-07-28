package com.krevia.enquiry;

import com.krevia.service.CreatorService;
import com.krevia.service.CreatorServiceRepository;
import com.krevia.user.User;
import com.krevia.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnquiryManager {

    private final EnquiryRepository enquiryRepository;
    private final UserRepository userRepository;
    private final CreatorServiceRepository serviceRepository;

    public EnquiryManager(
            EnquiryRepository enquiryRepository,
            UserRepository userRepository,
            CreatorServiceRepository serviceRepository
    ) {
        this.enquiryRepository = enquiryRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public EnquiryResponse createEnquiry(
            CreateEnquiryRequest request,
            Authentication authentication
    ) {
        User sender = getCurrentUser(authentication);
        validateSender(sender);

        User recipient = userRepository
                .findById(request.recipientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Creator not found"
                ));

        validateRecipient(recipient);

        if (sender.getId().equals(recipient.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot send an enquiry to yourself"
            );
        }

        if (request.serviceId() != null) {
            CreatorService service = serviceRepository
                    .findById(request.serviceId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Service not found"
                    ));

            if (!service.getUserId().equals(recipient.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "The selected service does not belong to this creator"
                );
            }

            if (!Boolean.TRUE.equals(service.getActive())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "The selected service is not available"
                );
            }
        }

        Enquiry enquiry = new Enquiry();

        enquiry.setSenderId(sender.getId());
        enquiry.setRecipientId(recipient.getId());
        enquiry.setServiceId(request.serviceId());
        enquiry.setTitle(request.title().trim());
        enquiry.setDescription(request.description().trim());
        enquiry.setBudget(request.budget());
        enquiry.setPreferredDeadline(
                request.preferredDeadline()
        );
        enquiry.setStatus(EnquiryStatus.PENDING);

        return toResponse(enquiryRepository.save(enquiry));
    }

    @Transactional(readOnly = true)
    public List<EnquiryResponse> getSentEnquiries(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        return enquiryRepository
                .findAllBySenderIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EnquiryResponse> getReceivedEnquiries(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        return enquiryRepository
                .findAllByRecipientIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EnquiryResponse updateStatus(
            Long enquiryId,
            UpdateEnquiryStatusRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Enquiry not found"
                ));

        if (enquiry.getStatus() != EnquiryStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This enquiry has already been updated"
            );
        }

        boolean isSender =
                enquiry.getSenderId().equals(user.getId());

        boolean isRecipient =
                enquiry.getRecipientId().equals(user.getId());

        if (isSender) {
            if (request.status() != EnquiryStatus.CANCELLED) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "The sender can only cancel an enquiry"
                );
            }
        } else if (isRecipient) {
            if (
                    request.status() != EnquiryStatus.ACCEPTED &&
                            request.status() != EnquiryStatus.DECLINED
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Use ACCEPTED or DECLINED"
                );
            }
        } else {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot update this enquiry"
            );
        }

        enquiry.setStatus(request.status());

        return toResponse(enquiryRepository.save(enquiry));
    }

    private User getCurrentUser(
            Authentication authentication
    ) {
        return userRepository
                .findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found"
                ));
    }

    private void validateSender(User user) {
        String accountType = user.getAccountType().name();

        if (
                !accountType.equals("CLIENT") &&
                        !accountType.equals("BOTH")
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only client accounts can send enquiries"
            );
        }
    }

    private void validateRecipient(User user) {
        String accountType = user.getAccountType().name();

        if (
                !accountType.equals("CREATOR") &&
                        !accountType.equals("BOTH")
        ) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Creator not found"
            );
        }
    }

    private EnquiryResponse toResponse(Enquiry enquiry) {
        User sender = userRepository
                .findById(enquiry.getSenderId())
                .orElseThrow();

        User recipient = userRepository
                .findById(enquiry.getRecipientId())
                .orElseThrow();

        String serviceTitle = null;

        if (enquiry.getServiceId() != null) {
            serviceTitle = serviceRepository
                    .findById(enquiry.getServiceId())
                    .map(CreatorService::getTitle)
                    .orElse(null);
        }

        return new EnquiryResponse(
                enquiry.getId(),
                sender.getId(),
                sender.getFullName(),
                recipient.getId(),
                recipient.getFullName(),
                enquiry.getServiceId(),
                serviceTitle,
                enquiry.getTitle(),
                enquiry.getDescription(),
                enquiry.getBudget(),
                enquiry.getPreferredDeadline(),
                enquiry.getStatus(),
                enquiry.getCreatedAt(),
                enquiry.getUpdatedAt()
        );
    }
}
