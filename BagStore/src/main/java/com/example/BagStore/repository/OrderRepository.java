package com.example.BagStore.repository;

import com.example.BagStore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findAll();
    List<Order> findByStatus(String status);
    void deleteByUserId(Integer userId);
}
