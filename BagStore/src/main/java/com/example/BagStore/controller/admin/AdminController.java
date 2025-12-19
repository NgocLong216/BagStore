package com.example.BagStore.controller.admin;

import com.example.BagStore.dto.CreateUserRequest;
import com.example.BagStore.dto.UserResponse;
import com.example.BagStore.entity.User;
import com.example.BagStore.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody @Valid CreateUserRequest request
    ) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<?> lockUser(@PathVariable Integer id) {
        userService.lockUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("users/{id}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Integer id) {
        userService.unlockUser(id);
        return ResponseEntity.ok().build();
    }
}
