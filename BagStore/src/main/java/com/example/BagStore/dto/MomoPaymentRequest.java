package com.example.bagstore.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MomoPaymentRequest {
    @NotNull
    private Long orderId;
    @NotNull
    private Long amount;

}

