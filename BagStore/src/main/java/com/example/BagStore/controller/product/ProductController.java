package com.example.BagStore.controller.product;

import com.example.BagStore.dto.*;
import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.ProductImage;
import com.example.BagStore.entity.ProductReview;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.ProductImageService;
import com.example.BagStore.service.ProductReviewService;
import com.example.BagStore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private ProductReviewService reviewService;

    @Autowired
    private ProductImageService imageService;

    @GetMapping("/top4")
    public ResponseEntity<List<ProductDTO>> getTop4Products() {
        return ResponseEntity.ok(productService.getTop4Products());
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        return ResponseEntity.ok(
                productService.getProducts(keyword, category, page, size, sortBy, order)
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

    @GetMapping("/{id}/recommend")
    public ResponseEntity<List<ProductDTO>> getRecommendedProducts(
            @PathVariable("id") Long productId
    ) {
        return ResponseEntity.ok(
                productService.getRecommendedProducts(productId)
        );
    }


    @GetMapping("/{productId}/reviews")
    public ResponseEntity<Page<ProductReviewDTO>> getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<ProductReviewDTO> reviews = reviewService.getReviewsByProductId(productId, page, size);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}/reviews/stats")
    public ReviewStatsDTO getReviewStats(@PathVariable("id") Long productId) {
        return reviewService.getReviewStatsByProductId(productId);
    }

    @PostMapping("/{productId}/images")
    public ProductImage addImage(@PathVariable Long productId,
                                 @RequestParam String imageUrl) {
        return imageService.addImage(productId, imageUrl);
    }

    @GetMapping("/{productId}/images")
    public List<ProductImage> getImages(@PathVariable Long productId) {
        return imageService.getImagesByProduct(productId);
    }



    @GetMapping("/top-selling")
    public List<TopProductDTO> topProducts(
            @RequestParam(defaultValue = "4") int limit
    ) {
        return productService.getTopSellingProducts(limit);
    }



}

