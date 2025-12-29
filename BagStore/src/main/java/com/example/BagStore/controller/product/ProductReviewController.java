package com.example.BagStore.controller.product;

import com.example.BagStore.entity.ProductReview;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.ProductReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product-review")
public class ProductReviewController {
    @Autowired
    private ProductReviewService reviewService;

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(
            @PathVariable Long id,
            @RequestBody ProductReview req,
            Authentication authentication
    ) {
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        Integer userId = userDetails.getUser().getUserId();

        reviewService.addReview(
                id,
                userId,
                req
        );

        return ResponseEntity.ok("Đã thêm đánh giá");
    }
}
