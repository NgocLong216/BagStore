package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class TopProductDTO {
    private Long productId;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private Long totalSold;

}

