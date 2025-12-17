package com.example.BagStore.service;

import com.example.BagStore.dto.ProductDetailDTO;
import com.example.BagStore.dto.ProductDTO;
import com.example.BagStore.dto.SpecificationDTO;
import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.ProductImage;
import com.example.BagStore.entity.ProductSpecification;
import com.example.BagStore.repository.ProductImageRepository;
import com.example.BagStore.repository.ProductRepository;
import com.example.BagStore.repository.ProductSpecificationRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSpecificationRepository productSpecificationRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<ProductDTO> getTop4Products() {
        return productRepository.findTop4ByOrderByCreatedAtDesc()
                .stream()
                .map(p -> new ProductDTO(
                        p.getProductId(),
                        p.getName(),
                        p.getPrice(),
                        productImageRepository
                                .findFirstByProduct_ProductId(p.getProductId())
                                .map(ProductImage::getImageUrl)
                                .orElse("/images/default.jpg"),
                        p.getStock()
                ))
                .toList();
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Page<ProductDTO> getProducts(
            String keyword,
            int page,
            int size,
            String sortBy,
            String order
    ) {
        Sort sort = order.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage =
                (keyword != null && !keyword.isEmpty())
                        ? productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                        : productRepository.findAll(pageable);

        return productPage.map(p ->
                new ProductDTO(
                        p.getProductId(),
                        p.getName(),
                        p.getPrice(),
                        productImageRepository
                                .findFirstByProduct_ProductId(p.getProductId())
                                .map(ProductImage::getImageUrl)
                                .orElse("/images/default.jpg"),
                        p.getStock()
                )
        );
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public ProductDetailDTO getProductDetail(Long productId) {
        // 1. Lấy product chính
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // 2. Lấy danh sách specifications bằng JPQL constructor expression
        List<ProductSpecification> specs = productSpecificationRepository
                .findByProduct_ProductId(productId);

        // Map sang DTO
        List<SpecificationDTO> specDTOs = specs.stream()
                .map(s -> new SpecificationDTO(s.getSpecName(), s.getSpecValue()))
                .toList();

        // 3. Trả về response gồm cả product + specs
        return ProductDetailDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .detail(product.getDetail())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .specifications(specDTOs)
                .build();
    }

    public List<ProductDTO> getRecommendedProducts(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        List<Product> products = productRepository
                .findTop4ByCategoryAndProductIdNot(
                        product.getCategory(),
                        productId
                );

        return products.stream()
                .map(p -> new ProductDTO(
                        p.getProductId(),
                        p.getName(),
                        p.getPrice(),
                        productImageRepository
                                .findFirstByProduct_ProductId(p.getProductId())
                                .map(ProductImage::getImageUrl)
                                .orElse(null),
                        p.getStock()
                ))
                .toList();
    }

}

