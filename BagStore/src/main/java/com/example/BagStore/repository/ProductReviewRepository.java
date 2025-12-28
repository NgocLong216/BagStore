package com.example.BagStore.repository;

import com.example.BagStore.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    Page<ProductReview> findByProductId(Long productId, Pageable pageable);

    List<ProductReview> findAllByProductId(Long productId);

    boolean existsByProductIdAndUserId(Long productId, Integer userId);
}

