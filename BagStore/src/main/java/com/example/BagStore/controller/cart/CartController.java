package com.example.BagStore.controller.cart;

import com.example.BagStore.dto.CartRequest;
import com.example.BagStore.dto.CartResponse;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartResponse>> getMyCart(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getUser().getUserId();

        List<CartResponse> cartList = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartList);
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestBody CartRequest request,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getUser().getUserId();

        CartResponse response = cartService.addToCart(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{cartId}/quantity")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Integer cartId,
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        int newQuantity = body.get("quantity");
        cartService.updateQuantity(userDetails.getUser().getUserId(), cartId, newQuantity);
        return ResponseEntity.ok("Quantity updated");
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Integer cartId) {
        try {
            cartService.deleteCartItem(cartId);
            return ResponseEntity.ok().body("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/count")
    public int getCartCount(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartService.getCartItemCount(userDetails.getUser().getUserId());
    }


}
