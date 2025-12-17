package com.example.BagStore.controller.user;

import com.example.BagStore.entity.UserContact;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.UserContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class UserContactController {

    @Autowired
    private UserContactService userContactService;

    @GetMapping
    public ResponseEntity<List<UserContact>> getMyContacts(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getUser().getUserId();

        List<UserContact> contacts = userContactService.getContactsByUserId(userId);

        return ResponseEntity.ok(contacts);
    }

    @PostMapping
    public UserContact createContact(Authentication authentication, @RequestBody UserContact contact) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        contact.setUser(userDetails.getUser());
        return userContactService.saveContact(contact);
    }

    @PutMapping("/{id}")
    public UserContact updateContact(@PathVariable Integer id, @RequestBody UserContact contact) {
        contact.setContactId(id);
        return userContactService.saveContact(contact);
    }

    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable Integer id) {
        userContactService.deleteContact(id);
    }

    @PutMapping("/default/{id}")
    public ResponseEntity<String> setDefault(Authentication authentication, @PathVariable Integer id) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getUser().getUserId();

        userContactService.setDefaultContact(userId, id);
        return ResponseEntity.ok("Đã cập nhật địa chỉ mặc định");
    }

}


