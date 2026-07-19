package com.qrify.backend.controllers.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShortenUrlRequest {
    // We can add validation annotations here later, like @NotBlank or @URL
    private String longUrl;
}