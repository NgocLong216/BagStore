package com.example.BagStore.controller.user;

import com.example.BagStore.dto.ChangePasswordRequest;
import com.example.BagStore.dto.UserResponse;
import com.example.BagStore.dto.UserUpdateRequest;
import com.example.BagStore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserResponse userResponse = userService.getCurrentUser(authentication);
        if (userResponse == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            Authentication authentication,
            @RequestBody UserUpdateRequest request
    ) {
        UserResponse updated = userService.updateCurrentUser(authentication, request);
        if (updated == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadAvatar(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        String url = userService.uploadAvatar(authentication, file);
        return ResponseEntity.ok(url);
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount(Authentication authentication) {
        String username = authentication.getName(); // lấy từ JWT
        userService.deleteUserByUsername(username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        userService.changePassword(username, request);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }


}
