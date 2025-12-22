package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class RevenueByMonthDTO {
    private String month; // vd: 01/2025
    private BigDecimal revenue;
}
