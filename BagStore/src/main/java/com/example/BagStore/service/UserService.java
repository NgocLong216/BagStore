package com.example.BagStore.service;

import com.example.BagStore.dto.UserResponse;
import com.example.BagStore.dto.UserUpdateRequest;
import com.example.BagStore.entity.User;
import com.example.BagStore.repository.UserRepository;
import com.example.BagStore.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private final UserRepository userRepository;

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

    public List<User> getAll() {
        return userRepository.findAll();
    }
}


