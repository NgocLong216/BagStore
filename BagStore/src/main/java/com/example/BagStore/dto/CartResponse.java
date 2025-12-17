package com.example.BagStore.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private Integer cartId;
    private Integer quantity;
    private LocalDateTime addedAt;
    private ProductDTO product;
}
