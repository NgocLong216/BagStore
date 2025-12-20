package com.example.BagStore.controller.admin;

import com.example.BagStore.config.JwtUtil;
import com.example.BagStore.dto.CreateUserRequest;
import com.example.BagStore.dto.ProductResponseDTO;
import com.example.BagStore.dto.UpdateUserRequest;
import com.example.BagStore.dto.UserResponse;
import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.User;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.ProductService;
import com.example.BagStore.service.UserService;
import io.jsonwebtoken.Jwt;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;


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

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request,
            BindingResult result,
            Authentication authentication
    ) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message", "Dữ liệu không hợp lệ",
                            "errors", errors
                    )
            );
        }

        CustomUserDetails admin =
                (CustomUserDetails) authentication.getPrincipal();

        Integer adminId = admin.getUser().getUserId();

        try {
            User updated = userService.updateUser(adminId, id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/products")
    public List<ProductResponseDTO> getAll() {
        return productService.getAll();
    }

}
