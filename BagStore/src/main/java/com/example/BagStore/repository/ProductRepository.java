package com.example.BagStore.repository;

import com.example.BagStore.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByProductId(Long productId);
    List<Product> findTop4ByOrderByCreatedAtDesc();
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    List<Product> findTop4ByCategoryAndProductIdNot(String category, Long productId);

}

