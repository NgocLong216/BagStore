package com.example.BagStore.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter @Builder
public class ProductDetailDTO {
    private Long productId;
    private String name;
    private String description;
    private String detail;
    private String category;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private List<SpecificationDTO> specifications;
}
