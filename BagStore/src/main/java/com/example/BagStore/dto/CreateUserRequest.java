package com.example.BagStore.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    private String username;
    private String email;
    private String phone;
    private String password;
    private String role; // USER / ADMIN
}

