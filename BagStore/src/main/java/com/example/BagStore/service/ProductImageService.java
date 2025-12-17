package com.example.BagStore.service;

import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.ProductImage;
import com.example.BagStore.repository.ProductImageRepository;
import com.example.BagStore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductImageService {

    @Autowired
    private ProductImageRepository imageRepository;

    @Autowired
    private ProductRepository productRepository;

    public ProductImageService(ProductImageRepository imageRepository,
                               ProductRepository productRepository) {
        this.imageRepository = imageRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public ProductImage addImage(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductImage image = ProductImage.builder()
                .imageUrl(imageUrl)
                .product(product)
                .build();

        product.getImages().add(image); // thêm vào danh sách để JPA quản lý
        return imageRepository.save(image);
    }

    public List<ProductImage> getImagesByProduct(Long productId) {
        return imageRepository.findByProductProductId(productId);
    }
}

