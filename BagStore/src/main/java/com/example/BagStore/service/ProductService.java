package com.example.BagStore.service;

import com.example.BagStore.dto.*;
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

import java.time.LocalDateTime;
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

    public ProductResponseDTO toDTO(Product p) {
        String thumbnail = null;

        if (p.getImages() != null && !p.getImages().isEmpty()) {
            thumbnail = p.getImages().get(0).getImageUrl();
        }

        return ProductResponseDTO.builder()
                .productId(p.getProductId())
                .name(p.getName())
                .price(p.getPrice())
                .stock(p.getStock())
                .category(p.getCategory())
                .thumbnail(thumbnail)
                .build();
    }

    public List<ProductResponseDTO> getAll() {
        return productRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }


    public Product create(ProductRequestDTO dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .detail(dto.getDetail())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(dto.getCategory())
                .createdAt(LocalDateTime.now())
                .build();

        return productRepository.save(product);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public Product update(Long id, ProductRequestDTO dto) {
        Product p = getById(id);

        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setDetail(dto.getDetail());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        p.setCategory(dto.getCategory());

        return productRepository.save(p);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
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

