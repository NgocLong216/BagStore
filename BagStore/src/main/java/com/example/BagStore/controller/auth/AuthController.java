package com.example.BagStore.controller.auth;

import com.example.BagStore.config.JwtUtil;
import com.example.BagStore.dto.GoogleLoginRequest;
import com.example.BagStore.dto.GoogleUserInfo;
import com.example.BagStore.dto.LoginRequest;
import com.example.BagStore.dto.SignupRequest;
import com.example.BagStore.entity.User;
import com.example.BagStore.enums.Role;
import com.example.BagStore.repository.UserRepository;
import com.example.BagStore.service.AuthService;
import com.example.BagStore.service.GoogleAuthService;
import com.example.BagStore.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

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

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(
            @RequestBody GoogleLoginRequest request
    ) {
        GoogleUserInfo googleUser =
                googleAuthService.getUserInfo(request.getToken());

        if (googleUser.getEmail() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Không lấy được email từ Google");
        }

        User user = userRepository
                .findByEmail(googleUser.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(googleUser.getEmail());
                    newUser.setUsername(
                            googleUser.getName() != null
                                    ? googleUser.getName()
                                    : googleUser.getEmail()
                    );
                    newUser.setPassword(null);      // Google account
                    newUser.setPhone(null);
                    newUser.setRole(Role.USER);
                    newUser.setAvatar(googleUser.getPicture());
                    newUser.setActive(true);
                    newUser.setCreatedAt(LocalDateTime.now());
                    return userRepository.save(newUser);
                });

        //  Nếu account bị khóa
        if (Boolean.FALSE.equals(user.getActive())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Tài khoản đã bị khóa");
        }

        String jwt = jwtUtil.generateToken(user);

        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "user", user
        ));
    }

}
