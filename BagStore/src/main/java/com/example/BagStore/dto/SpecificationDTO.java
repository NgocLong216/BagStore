package com.example.BagStore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class SpecificationDTO {
    private String specName;
    private String specValue;
}
