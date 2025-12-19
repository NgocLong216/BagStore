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

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

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
}
