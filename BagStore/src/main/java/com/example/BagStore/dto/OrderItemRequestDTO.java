package com.example.BagStore.dto;

import lombok.*;

@Getter
@Setter
public class OrderItemRequestDTO {
    private Integer cartId;
    private Long productId;
    private Integer quantity;
}

