package com.example.BagStore.controller.cart;

import com.example.BagStore.dto.OrderDetailResponseDTO;
import com.example.BagStore.dto.OrderRequestDTO;
import com.example.BagStore.dto.OrderResponseDTO;
import com.example.BagStore.entity.Order;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody OrderRequestDTO request
    ) {
        Order order = orderService.createOrder(user.getUser().getUserId(), request);

        return ResponseEntity.ok(Map.of(
                "orderId", order.getOrderId(),
                "totalPrice", order.getTotalPrice()
        ));
    }

    @GetMapping("/my")
    public List<OrderResponseDTO> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return orderService.getOrdersByUser(
                user.getUser().getUserId()
        );
    }

    @GetMapping("/{orderId}")
    public OrderDetailResponseDTO getOrderDetail(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Integer userId = userDetails.getUser().getUserId();
        return orderService.getOrderDetail(orderId, userId);
    }


    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Integer userId = userDetails.getUser().getUserId();

        orderService.cancelOrder(orderId, userId);

        return ResponseEntity.ok(Map.of(
                "message", "Hủy đơn hàng thành công"
        ));
    }

}
