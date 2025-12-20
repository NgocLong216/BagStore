package com.example.BagStore.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private String detail;
    private BigDecimal price;
    private Integer stock;
    private String category;
}
