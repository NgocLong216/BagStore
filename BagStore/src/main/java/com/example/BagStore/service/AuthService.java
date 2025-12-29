package com.example.BagStore.service;

import com.example.BagStore.config.JwtUtil;
import com.example.BagStore.dto.LoginRequest;
import com.example.BagStore.dto.LoginResponse;
import com.example.BagStore.entity.User;
import com.example.BagStore.enums.Role;
import com.example.BagStore.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    public LoginResult login(LoginRequest req) {
        Optional<User> userOpt = userRepository.findByUsername(req.getUsername());

        if (userOpt.isEmpty()) {
            return LoginResult.fail("Invalid username or password");
        }

        User user = userOpt.get();

        if (!Boolean.TRUE.equals(user.getActive())) {
            return LoginResult.fail("User not active");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return LoginResult.fail("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user);
        LoginResponse resp = new LoginResponse(token, user);
        return LoginResult.success(resp);
    }

    public static class LoginResult {
        private final boolean success;
        private final LoginResponse response;
        private final String error;

        private LoginResult(boolean success, LoginResponse response, String error) {
            this.success = success;
            this.response = response;
            this.error = error;
        }

        public static LoginResult success(LoginResponse resp) {
            return new LoginResult(true, resp, null);
        }

        public static LoginResult fail(String error) {
            return new LoginResult(false, null, error);
        }

        public boolean isSuccess() { return success; }
        public LoginResponse getResponse() { return response; }
        public String getError() { return error; }
    }

    @Transactional
    public User signup(String username, String email, String password) {
        // Kiểm tra username hoặc email đã tồn tại
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);

        return userRepository.save(user);
    }

    @Transactional
    public void sendResetPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            emailService.send(
                    user.getEmail(),
                    "Đặt lại mật khẩu",
                    "Click link: http://localhost:5173/reset-password?token=" + token
            );
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
    }


}
