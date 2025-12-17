package com.example.BagStore.repository;

import com.example.BagStore.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductProductId(Long productId);
    Optional<ProductImage> findFirstByProduct_ProductId(Long productId);
}

