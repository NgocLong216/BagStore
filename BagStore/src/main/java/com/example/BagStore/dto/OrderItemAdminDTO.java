package com.example.BagStore.dto;

import java.math.BigDecimal;

public record OrderItemAdminDTO(
        Long productId,
        String productName,
        String imageUrl,
        BigDecimal price,
        Integer quantity,
        BigDecimal subTotal
) {}
