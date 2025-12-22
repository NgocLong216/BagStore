package com.example.BagStore.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageDTO {
    private Long imageId;
    private String imageUrl;
}

