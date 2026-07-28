package com.krevia.discover;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/discover")
public class DiscoverController {

    private final DiscoverManager discoverManager;

    public DiscoverController(
            DiscoverManager discoverManager
    ) {
        this.discoverManager = discoverManager;
    }

    @GetMapping("/creators")
    public List<PublicCreatorResponse> discoverCreators(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String category
    ) {
        return discoverManager.discoverCreators(
                search,
                category
        );
    }

    @GetMapping("/creators/{userId}")
    public PublicCreatorResponse getCreator(
            @PathVariable Long userId
    ) {
        return discoverManager.getCreator(userId);
    }
}
