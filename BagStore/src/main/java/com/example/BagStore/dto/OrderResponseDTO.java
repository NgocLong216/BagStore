package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Long orderId;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private String paymentMethod;
    private String paymentRef;
    private List<OrderItemResponseDTO> items;

}

