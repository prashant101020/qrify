package com.qrify.backend.controllers.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortenUrlResponse {
    private final String shortKey;
    private final String shortUrl;
    private final String longUrl;
}
