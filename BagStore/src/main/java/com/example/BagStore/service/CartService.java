package com.example.BagStore.service;

import com.example.BagStore.dto.CartRequest;
import com.example.BagStore.dto.CartResponse;
import com.example.BagStore.dto.ProductDTO;
import com.example.BagStore.entity.Cart;
import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.ProductImage;
import com.example.BagStore.repository.CartRepository;
import com.example.BagStore.repository.ProductImageRepository;
import com.example.BagStore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    public List<CartResponse> getCartByUserId(Integer userId) {

        List<Cart> carts = cartRepository.findByUserId(userId);

        return carts.stream().map(cart -> {

            //  Lấy 1 ảnh đại diện của sản phẩm
            String imageUrl = productImageRepository
                    .findFirstByProduct_ProductId(cart.getProduct().getProductId())
                    .map(ProductImage::getImageUrl)
                    .orElse("/images/default.jpg");

            return CartResponse.builder()
                    .cartId(cart.getCartId())
                    .quantity(cart.getQuantity())
                    .addedAt(cart.getAddedAt())
                    .product(
                            ProductDTO.builder()
                                    .productId(cart.getProduct().getProductId())
                                    .name(cart.getProduct().getName())
                                    .price(cart.getProduct().getPrice())
                                    .stock(cart.getProduct().getStock())
                                    .imageUrl(imageUrl) //  THÊM ẢNH
                                    .build()
                    )
                    .build();
        }).collect(Collectors.toList());
    }

    public CartResponse addToCart(Integer userId, CartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Cart existingCart = cartRepository.findByUserIdAndProduct_ProductId(userId, request.getProductId());

        if (existingCart != null) {
            int newQuantity = existingCart.getQuantity() + request.getQuantity();

            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Số lượng vượt quá tồn kho (" + product.getStock() + ")");
            }

            existingCart.setQuantity(newQuantity);
            Cart saved = cartRepository.save(existingCart);

            return CartResponse.builder()
                    .cartId(saved.getCartId())
                    .quantity(saved.getQuantity())
                    .addedAt(saved.getAddedAt())
                    .product(ProductDTO.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .build())
                    .build();
        } else {
            if (request.getQuantity() > product.getStock()) {
                throw new RuntimeException("Số lượng vượt quá tồn kho (" + product.getStock() + ")");
            }

            Cart newCart = Cart.builder()
                    .userId(userId)
                    .product(product)
                    .quantity(request.getQuantity())
                    .addedAt(LocalDateTime.now())
                    .build();

            Cart saved = cartRepository.save(newCart);

            return CartResponse.builder()
                    .cartId(saved.getCartId())
                    .quantity(saved.getQuantity())
                    .addedAt(saved.getAddedAt())
                    .product(ProductDTO.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .build())
                    .build();
        }
    }


    public void updateQuantity(Integer userId, Integer cartId, int quantity) {
        Cart item = cartRepository.findByCartIdAndUserId(cartId, userId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setQuantity(quantity);
        cartRepository.save(item);
    }

    public void deleteCartItem(Integer cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng");
        }
        cartRepository.deleteById(cartId);
    }

    public int getCartItemCount(Integer userId) {
        List<Cart> carts = cartRepository.findByUserId(userId);

        return carts.stream()
                .mapToInt(Cart::getQuantity)
                .sum();
    }

}
