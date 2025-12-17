package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductReviewDTO {
    private Long reviewId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    private Integer userId;
    private String username;
    private String avatarUrl;
}

