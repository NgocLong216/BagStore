package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TopProductDTO {
    private Long productId;
    private String productName;
    private String imageUrl;
    private Long totalSold;
}

