package com.example.BagStore.dto;

import com.example.BagStore.entity.User;
import com.example.BagStore.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String username;
    private String phone;
    private String email;
    private Role role;
    private Boolean active;
    private String avatar;

    public static UserResponse fromEntity(User user) {
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
}
