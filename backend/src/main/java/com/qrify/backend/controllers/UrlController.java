package com.qrify.backend.controllers;

import com.qrify.backend.Services.ShortUrlService;
import com.qrify.backend.controllers.dto.ShortenUrlRequest;
import com.qrify.backend.controllers.dto.ShortenUrlResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class UrlController {

    private final ShortUrlService shortUrlService;

    @Autowired
    public UrlController(ShortUrlService shortUrlService) {
        this.shortUrlService = shortUrlService;
    }

    @PostMapping("/api/shorten")
    public ResponseEntity<?> createShortUrl(
            @RequestBody ShortenUrlRequest request,
            HttpServletRequest httpRequest
    ) {
        String longUrl = request.getLongUrl();
        if (longUrl == null || longUrl.isBlank()) {
            return ResponseEntity.badRequest().body("longUrl must be provided.");
        }

        String shortKey = shortUrlService.createShortUrl(longUrl.trim());
        String baseUrl = httpRequest.getScheme() + "://" + httpRequest.getServerName();
        if (httpRequest.getServerPort() != 80 && httpRequest.getServerPort() != 443) {
            baseUrl += ":" + httpRequest.getServerPort();
        }

        return ResponseEntity.ok(new ShortenUrlResponse(shortKey, baseUrl + "/" + shortKey, longUrl.trim()));
    }

    @GetMapping("/{shortUrl}")
    public void redirectToLongUrl(@PathVariable String shortUrl, HttpServletResponse response) throws IOException {
        shortUrlService.getLongUrl(shortUrl)
                .ifPresentOrElse(
                        longUrl -> {
                            response.setHeader("Location", longUrl);
                            response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY); // 301
                        },
                        () -> response.setStatus(HttpServletResponse.SC_NOT_FOUND) // 404
                );
    }
}