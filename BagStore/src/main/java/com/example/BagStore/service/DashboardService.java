package com.example.BagStore.service;

import com.example.BagStore.dto.DashboardResponseDTO;
import com.example.BagStore.dto.RevenueByMonthDTO;
import com.example.BagStore.dto.TopProductDTO;
import com.example.BagStore.entity.Order;
import com.example.BagStore.entity.OrderItem;
import com.example.BagStore.entity.Product;
import com.example.BagStore.repository.OrderRepository;
import com.example.BagStore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardResponseDTO getDashboard() {

        List<Order> orders = orderRepository.findAll();

        long totalOrders = orders.size();

        long pendingOrders = orders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()))
                .count();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> "COMPLETED".equals(o.getStatus()))
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalUsers = userRepository.count();

        return new DashboardResponseDTO(
                totalOrders,
                pendingOrders,
                totalRevenue,
                totalUsers
        );
    }

    public List<TopProductDTO> getTopSellingProducts(int limit) {

        List<Order> completedOrders =
                orderRepository.findByStatus("COMPLETED");

        Map<Product, Long> productSoldMap = new HashMap<>();

        for (Order order : completedOrders) {
            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();
                long quantity = item.getQuantity();

                productSoldMap.put(
                        product,
                        productSoldMap.getOrDefault(product, 0L) + quantity
                );
            }
        }

        return productSoldMap.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(limit)
                .map(entry -> {
                    Product p = entry.getKey();

                    String imageUrl = p.getImages().isEmpty()
                            ? null
                            : p.getImages().get(0).getImageUrl();

                    return new TopProductDTO(
                            p.getProductId(),
                            p.getName(),
                            imageUrl,
                            entry.getValue()
                    );
                })
                .toList();
    }

    public List<RevenueByMonthDTO> getRevenueByMonth(int year) {

        List<Order> orders = orderRepository.findAll();

        Map<String, BigDecimal> revenueMap = new HashMap<>();

        for (Order order : orders) {

            if (!"COMPLETED".equals(order.getStatus())) continue;

            LocalDateTime createdAt = order.getCreatedAt();
            if (createdAt.getYear() != year) continue;

            String monthKey = String.format(
                    "%02d/%d",
                    createdAt.getMonthValue(),
                    createdAt.getYear()
            );

            revenueMap.put(
                    monthKey,
                    revenueMap.getOrDefault(monthKey, BigDecimal.ZERO)
                            .add(order.getTotalPrice())
            );
        }

        // Đảm bảo đủ 12 tháng
        List<RevenueByMonthDTO> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            String key = String.format("%02d/%d", m, year);
            result.add(new RevenueByMonthDTO(
                    key,
                    revenueMap.getOrDefault(key, BigDecimal.ZERO)
            ));
        }

        return result;
    }
}

