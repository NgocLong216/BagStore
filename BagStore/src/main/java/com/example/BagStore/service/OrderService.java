package com.example.BagStore.service;

import com.example.BagStore.dto.*;
import com.example.BagStore.entity.*;
import com.example.BagStore.repository.*;
import io.swagger.v3.oas.annotations.info.Contact;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserContactRepository userContactRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(Integer userId, OrderRequestDTO request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // ================== LƯU ĐỊA CHỈ NẾU LẦN ĐẦU ==================
        List<UserContact> contacts = userContactRepository.findByUser_UserId(userId);

        if (contacts.isEmpty()) {
            // Lần đầu checkout → lưu địa chỉ mặc định
            UserContact contact = new UserContact();
            contact.setUser(user);
            contact.setFullName(request.getFullName());
            contact.setPhone(request.getPhone());
            contact.setSubAddress(request.getSubAddress()); // số nhà, đường
            contact.setAddress(request.getAddress());       // phường / quận / tỉnh
            contact.setIsDefault(true);
            contact.setAddedAt(LocalDateTime.now());

            userContactRepository.save(contact);
        }

        // ================== TẠO ORDER ==================
        Order order = Order.builder()
                .userId(userId)
                .status("PENDING")
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .subAddress(request.getSubAddress())
                .address(request.getAddress())
                .note(request.getNote())
                .createdAt(LocalDateTime.now())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequestDTO itemDTO : request.getItems()) {

            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

            // ===== CHECK TỒN KHO =====
            if (product.getStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Sản phẩm không đủ tồn kho");
            }

            // ===== TRỪ TỒN =====
            product.setStock(product.getStock() - itemDTO.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemDTO.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .price(product.getPrice())
                    .quantity(itemDTO.getQuantity())
                    .build();

            orderItems.add(orderItem);
            total = total.add(itemTotal);

            // ===== XOÁ CHỈ CART ĐÃ THANH TOÁN =====
            cartRepository.deleteByCartId(itemDTO.getCartId());
        }

        order.setTotalPrice(total);
        order.setItems(orderItems);

        return orderRepository.save(order);
    }




    public List<OrderResponseDTO> getOrdersByUser(Integer userId) {

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return orders.stream()
                .map(order -> {

                    List<OrderItemResponseDTO> items =
                            order.getItems().stream()
                                    .map(item -> {

                                        Product product = item.getProduct();

                                        String imageUrl = product.getImages().isEmpty()
                                                ? null
                                                : product.getImages().get(0).getImageUrl();

                                        return new OrderItemResponseDTO(
                                                product.getProductId(),
                                                product.getName(),
                                                imageUrl,
                                                product.getPrice(),
                                                item.getQuantity(),
                                                product.getPrice()
                                                        .multiply(BigDecimal.valueOf(item.getQuantity()))
                                        );
                                    })
                                    .toList();

                    return new OrderResponseDTO(
                            order.getOrderId(),
                            order.getTotalPrice(),
                            order.getStatus(),
                            order.getCreatedAt(),
                            items
                    );
                })
                .toList();
    }

    public OrderDetailResponseDTO getOrderDetail(Long orderId, Integer userId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Không có quyền truy cập");
        }

        List<OrderItemResponseDTO> items = order.getItems().stream()
                .map(item -> {

                    Product product = item.getProduct();

                    String imageUrl = product.getImages().isEmpty()
                            ? null
                            : product.getImages().get(0).getImageUrl();

                    BigDecimal subTotal =
                            item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                    return new OrderItemResponseDTO(
                            product.getProductId(),
                            product.getName(),
                            imageUrl,
                            item.getPrice(),
                            item.getQuantity(),
                            subTotal
                    );
                })
                .toList();

        return new OrderDetailResponseDTO(
                order.getOrderId(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getFullName(),
                order.getPhone(),
                order.getSubAddress(),
                order.getAddress(),
                order.getNote(),
                order.getCreatedAt(),
                items
        );
    }


    public void cancelOrder(Long orderId, Integer userId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Kiểm tra quyền
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Không có quyền hủy đơn này");
        }

        // Kiểm tra trạng thái
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Chỉ được hủy đơn đang xử lý");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    public List<OrderAdminResponseDTO> getAllOrders() {

        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        return orders.stream()
                .map(order -> new OrderAdminResponseDTO(
                        order.getOrderId(),
                        order.getUserId(),
                        order.getFullName(),
                        order.getPhone(),
                        order.getTotalPrice(),
                        order.getStatus(),
                        order.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        String currentStatus = order.getStatus();

        // Không cho thay đổi nếu đã hoàn tất hoặc đã hủy
        if ("COMPLETED".equals(currentStatus)) {
            throw new RuntimeException("Đơn hàng đã hoàn thành, không thể thay đổi");
        }

        if ("CANCELLED".equals(currentStatus)) {
            throw new RuntimeException("Đơn hàng đã bị hủy");
        }

        // Validate status
        if (!List.of("PENDING", "COMPLETED", "CANCELLED").contains(newStatus)) {
            throw new RuntimeException("Trạng thái không hợp lệ");
        }

        // ===== ROLLBACK TỒN KHO KHI HỦY =====
        if ("PENDING".equals(currentStatus) && "CANCELLED".equals(newStatus)) {

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                product.setStock(
                        product.getStock() + item.getQuantity()
                );

                productRepository.save(product);
            }
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
    }



}


