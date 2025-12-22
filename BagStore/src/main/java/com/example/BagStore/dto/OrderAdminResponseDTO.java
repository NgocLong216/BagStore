package com.example.BagStore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderAdminResponseDTO(
        Long orderId,
        Integer userId,
        String fullName,
        String phone,
        BigDecimal totalPrice,
        String status,
        LocalDateTime createdAt
) {}

