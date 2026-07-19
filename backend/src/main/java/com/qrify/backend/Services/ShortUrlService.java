package com.qrify.backend.Services;

import com.qrify.backend.models.UrlMapping;
import com.qrify.backend.repositories.UrlMappingRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ShortUrlService {

    private final UrlMappingRepository urlMappingRepository;

    @Autowired
    public ShortUrlService(UrlMappingRepository urlMappingRepository) {
        this.urlMappingRepository = urlMappingRepository;
    }

    public String createShortUrl(String longUrl) {
        String shortKey;
        // Loop to ensure the generated key is unique.
        // This prevents collisions if a key already exists in the database.
        do {
            shortKey = RandomStringUtils.randomAlphanumeric(7);
        } while (urlMappingRepository.findByShortUrl(shortKey).isPresent());
        
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setLongUrl(longUrl);
        urlMapping.setShortUrl(shortKey);

        urlMappingRepository.save(urlMapping);

        return shortKey;
    }

    public Optional<String> getLongUrl(String shortUrl) {
        return urlMappingRepository.findByShortUrl(shortUrl)
                .map(UrlMapping::getLongUrl);
    }
}
