package com.example.BagStore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 20, message = "Username phải từ 4–20 ký tự")
    private String username;

//    @NotBlank(message = "Email không được để trống")
//    @Email(message = "Email không hợp lệ")
//    private String email;

    @Pattern(
            regexp = "^[0-9]{9,11}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;
}
