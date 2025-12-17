package com.example.BagStore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ProductReviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "product_id")
    private Long productId;

    private Integer rating;

    @Column(columnDefinition = "NVARCHAR(2000)")
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;  // <--- Quan hệ để lấy username
}
