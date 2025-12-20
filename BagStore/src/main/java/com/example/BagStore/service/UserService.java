package com.example.BagStore.service;

import com.example.BagStore.dto.CreateUserRequest;
import com.example.BagStore.dto.UpdateUserRequest;
import com.example.BagStore.dto.UserResponse;
import com.example.BagStore.dto.UserUpdateRequest;
import com.example.BagStore.entity.User;
import com.example.BagStore.enums.Role;
import com.example.BagStore.repository.UserRepository;
import com.example.BagStore.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.BeanDefinitionDsl;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getPhone(),
                user.getEmail(),
                user.getRole(),
                user.getActive(),
                user.getAvatar()
        );
    }

    public UserResponse updateCurrentUser(Authentication authentication, UserUpdateRequest request) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Update field
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        User updated = userRepository.save(user);

        return new UserResponse(
                updated.getUserId(),
                updated.getUsername(),
                updated.getPhone(),
                updated.getEmail(),
                updated.getRole(),
                updated.getActive(),
                updated.getAvatar()
        );
    }

    public String uploadAvatar(Authentication authentication, MultipartFile file) {
        if (authentication == null) return null;

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        try {
            // Tạo folder nếu chưa có
            String uploadDir = "src/main/resources/static/avatars/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            // Tạo tên file duy nhất
            String filename = "user_" + user.getUserId() + "_" + System.currentTimeMillis()
                    + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir + filename);
            Files.write(path, file.getBytes());

            // Tạo URL trả về
            String avatarUrl = "/avatars/" + filename;

            // Lưu vào DB
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            return avatarUrl;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload avatar failed");
        }
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getUserId(),
                        user.getUsername(),
                        user.getPhone(),
                        user.getEmail(),
                        user.getRole(),
                        user.getActive(),
                        user.getAvatar()
                ))
                .toList();
    }

    public UserResponse createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return UserResponse.fromEntity(user);
    }

    public void lockUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setActive(false);
        userRepository.save(user);
    }

    public void unlockUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setActive(true);
        userRepository.save(user);
    }

    public User updateUser(Integer adminId, Integer userId, UpdateUserRequest req) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // ❌ Không cho admin tự hạ role
        if (admin.getUserId().equals(userId)
                && !admin.getRole().equals(req.getRole())) {
            throw new RuntimeException("Không thể thay đổi vai trò của chính bạn");
        }

        // ❌ Check trùng username
        if (!user.getUsername().equals(req.getUsername())
                && userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        // ❌ Check trùng email
        if (!user.getEmail().equals(req.getEmail())
                && userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole());

        return userRepository.save(user);
    }


}


