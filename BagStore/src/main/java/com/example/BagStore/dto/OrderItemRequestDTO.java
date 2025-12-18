package com.example.BagStore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Data
public class OrderItemRequestDTO {
    @NotNull(message = "ProductId không được để trống")
    private Long productId;

    @NotNull(message = "CartId không được để trống")
    private Integer cartId;

    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer quantity;
}

