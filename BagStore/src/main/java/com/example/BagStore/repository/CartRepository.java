package com.example.BagStore.repository;


import com.example.BagStore.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByUserId(Integer userId);
    Cart findByUserIdAndProduct_ProductId(Integer userId, Long productId);
    Optional<Cart> findByCartIdAndUserId(Integer cartId, Integer userId);
    void deleteByCartId(Integer cartId);


}

