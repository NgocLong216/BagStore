package com.example.BagStore.service;

import com.example.BagStore.dto.*;
import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.ProductImage;
import com.example.BagStore.entity.ProductSpecification;
import com.example.BagStore.repository.CartRepository;
import com.example.BagStore.repository.ProductImageRepository;
import com.example.BagStore.repository.ProductRepository;
import com.example.BagStore.repository.ProductSpecificationRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CartRepository cartRepository;

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


    @Transactional
    public ProductDTO createProduct(
            ProductRequestDTO request,
            List<MultipartFile> images
    ) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        productRepository.save(product);

        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                if (file.isEmpty()) continue;

                String imageUrl = fileStorageService.storeFile(file);

                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(imageUrl);
                img.setThumbnail(i == 0);

                // 🔥 QUAN TRỌNG
                product.getImages().add(img);
            }
        }

        // chỉ cần save product
        productRepository.save(product);

        return new ProductDTO(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getImages().isEmpty()
                        ? null
                        : product.getImages().get(0).getImageUrl(),
                product.getStock()
        );
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

    @Transactional
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // 1️⃣ XÓA CART TRƯỚC (KHÔNG QUERY)
        cartRepository.deleteByProduct_ProductId(productId);

        // 2️⃣ XÓA FILE ẢNH
        product.getImages().forEach(img -> {
            try {
                Path path = Paths.get("uploads",
                        img.getImageUrl().replace("/uploads/", ""));
                Files.deleteIfExists(path);
            } catch (Exception e) {
                System.err.println("Không xóa được ảnh: " + img.getImageUrl());
            }
        });

        // 3️⃣ XÓA PRODUCT (cascade image + spec)
        productRepository.delete(product);
    }


}

