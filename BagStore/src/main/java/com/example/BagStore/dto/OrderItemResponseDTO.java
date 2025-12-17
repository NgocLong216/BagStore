package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDTO {

    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subTotal;
}

