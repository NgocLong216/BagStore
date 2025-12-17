package com.example.BagStore.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewStatsDTO {
    private int totalReviews;
    private double averageRating;
}
