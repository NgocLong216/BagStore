package com.example.BagStore.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long productId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;
}
