package com.example.BagStore.controller.auth;

import com.example.BagStore.dto.LoginRequest;
import com.example.BagStore.dto.SignupRequest;
import com.example.BagStore.entity.User;
import com.example.BagStore.service.AuthService;
import com.example.BagStore.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        AuthService.LoginResult result = authService.login(req);

        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getResponse());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", result.getError()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        User user = authService.signup(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok(user);
    }

}
