package com.example.BagStore.service;

import com.example.BagStore.dto.ProductReviewDTO;
import com.example.BagStore.dto.ReviewStatsDTO;
import com.example.BagStore.dto.TopProductDTO;
import com.example.BagStore.entity.*;
import com.example.BagStore.repository.OrderRepository;
import com.example.BagStore.repository.ProductReviewRepository;
import com.example.BagStore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Page<ProductReviewDTO> getReviewsByProductId(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProductReview> reviewPage = reviewRepository.findByProductId(productId, pageable);

        return reviewPage.map(review -> {
            // Lấy user theo userId
            User user = userRepository.findById(review.getUserId()).orElse(null);

            // Tạo URL avatar
            String avatarUrl = (user != null && user.getAvatar() != null)
                    ? user.getAvatar()
                    : null;

            return ProductReviewDTO.builder()
                    .reviewId(review.getReviewId())
                    .rating(review.getRating())
                    .comment(review.getComment())
                    .createdAt(review.getCreatedAt())
                    .userId(review.getUserId())
                    .username(user != null ? user.getUsername() : "Người dùng ẩn danh")
                    .avatarUrl(avatarUrl)
                    .build();
        });
    }

    public ReviewStatsDTO getReviewStatsByProductId(Long productId) {
        List<ProductReview> allReviews = reviewRepository.findAllByProductId(productId);

        int totalReviews = allReviews.size();
        double averageRating = totalReviews == 0 ? 0 :
                allReviews.stream().mapToInt(ProductReview::getRating).average().orElse(0.0);

        return ReviewStatsDTO.builder()
                .totalReviews(totalReviews)
                .averageRating(Math.round(averageRating * 10.0) / 10.0) // làm tròn 1 chữ số thập phân
                .build();
    }

    public void addReview(Long productId, Integer userId, ProductReview req) {

        if (req.getRating() == null || req.getRating() < 1 || req.getRating() > 5) {
            throw new RuntimeException("Rating không hợp lệ");
        }

        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi");
        }

        ProductReview review = ProductReview.builder()
                .productId(productId)
                .userId(userId)
                .rating(req.getRating())
                .comment(req.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);
    }



}

