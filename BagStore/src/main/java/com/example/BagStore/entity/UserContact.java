package com.example.BagStore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "UserContacts")
public class UserContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contactId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(255)")
    private String fullName;

    private String phone;

    @Column(name = "sub_address", columnDefinition = "NVARCHAR(255)")
    private String subAddress;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "added_at")
    private LocalDateTime addedAt;
}

