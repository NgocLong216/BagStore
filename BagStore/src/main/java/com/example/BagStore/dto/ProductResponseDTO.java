package com.example.BagStore.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductResponseDTO {
    private Long productId;
    private String name;
    private String description;
    private String detail;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private LocalDateTime createdAt;

    private String thumbnail;
    private List<ProductImageDTO> images;
}
