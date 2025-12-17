package com.example.BagStore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_specifications")
@Getter
@Setter
public class ProductSpecification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer specId;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String specName;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String specValue;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
