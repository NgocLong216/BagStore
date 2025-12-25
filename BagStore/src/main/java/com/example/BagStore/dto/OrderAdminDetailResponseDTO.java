package com.example.BagStore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderAdminDetailResponseDTO(
        Long orderId,
        Integer userId,
        String fullName,
        String phone,
        String subAddress,
        String address,
        String note,
        String status,
        BigDecimal totalPrice,
        LocalDateTime createdAt,
        String paymentMethod,
        String paymentRef,
        List<OrderItemAdminDTO> items
) {}
