package com.example.BagStore.controller.admin;

import com.example.BagStore.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/upload")
public class AdminUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/product-image")
    public ResponseEntity<?> uploadProductImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = fileStorageService.storeFile(file);

        return ResponseEntity.ok(
                Map.of("url", imageUrl)
        );
    }
}
