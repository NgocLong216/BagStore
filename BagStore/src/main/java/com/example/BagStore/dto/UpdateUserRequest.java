package com.example.BagStore.dto;

import com.example.BagStore.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(
            regexp = "^(0[0-9]{9})?$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;

    @NotNull(message = "Vai trò không được để trống")
    private Role role; // USER / ADMIN
}
