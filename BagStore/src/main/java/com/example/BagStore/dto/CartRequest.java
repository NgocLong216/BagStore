package com.example.BagStore.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartRequest {
    private Long productId;
    private Integer quantity;
}
