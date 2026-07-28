package com.krevia.enquiry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnquiryRepository
        extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findAllBySenderIdOrderByCreatedAtDesc(
            Long senderId
    );

    List<Enquiry> findAllByRecipientIdOrderByCreatedAtDesc(
            Long recipientId
    );
}
