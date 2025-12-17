package com.example.BagStore.repository;

import com.example.BagStore.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {
    List<ProductSpecification> findByProduct_ProductId(Long productId);
}
