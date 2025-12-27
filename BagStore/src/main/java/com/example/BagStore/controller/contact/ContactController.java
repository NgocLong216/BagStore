package com.example.BagStore.controller.contact;


import com.example.BagStore.dto.ContactRequest;
import com.example.BagStore.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactRequest request) {
        contactService.save(request);
        return ResponseEntity.ok().build();
    }
}
