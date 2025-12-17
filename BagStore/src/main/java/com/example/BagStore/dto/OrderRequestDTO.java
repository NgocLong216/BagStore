package com.example.BagStore.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {
    private String fullName;
    private String phone;
    private String subAddress;
    private String address;
    private String note;
    private List<OrderItemRequestDTO> items;
}

