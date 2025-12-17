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
public class OrderDetailResponseDTO {

    private Long orderId;
    private String status;
    private BigDecimal totalPrice;

    private String fullName;
    private String phone;
    private String subAddress;
    private String address;
    private String note;

    private LocalDateTime createdAt;

    private List<OrderItemResponseDTO> items;
}
