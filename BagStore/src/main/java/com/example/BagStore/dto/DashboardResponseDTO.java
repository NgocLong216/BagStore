package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class DashboardResponseDTO {
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private long totalUsers;
}

