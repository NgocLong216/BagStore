package com.example.BagStore.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateOrderStatusRequest(
        @NotBlank(message = "Trạng thái không được để trống")
        String status
) {}

