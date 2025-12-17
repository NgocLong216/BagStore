package com.example.BagStore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    private String username;
    private String phone;
    private String email;
    private String password;
    private String role;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private Boolean active;
}

