package com.qrify.backend.controllers;

import com.qrify.backend.Services.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @Autowired
    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping(value = "/api/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQrCode(@RequestParam("url") String url) {
        try {
            byte[] qrCode = qrCodeService.generateQrCode(url, 256, 256);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrCode);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
