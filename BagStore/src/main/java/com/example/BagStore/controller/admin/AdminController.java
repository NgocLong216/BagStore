package com.example.BagStore.controller.admin;

import com.example.BagStore.config.JwtUtil;
import com.example.BagStore.dto.*;
import com.example.BagStore.entity.Order;
import com.example.BagStore.entity.Product;
import com.example.BagStore.entity.ProductImage;
import com.example.BagStore.entity.User;
import com.example.BagStore.repository.ProductImageRepository;
import com.example.BagStore.security.CustomUserDetails;
import com.example.BagStore.service.*;
import io.jsonwebtoken.Jwt;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private InvoicePdfService invoicePdfService;

    @Autowired
    private DashboardService dashboardService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody @Valid CreateUserRequest request
    ) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<?> lockUser(@PathVariable Integer id) {
        userService.lockUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("users/{id}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Integer id) {
        userService.unlockUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request,
            BindingResult result,
            Authentication authentication
    ) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message", "Dữ liệu không hợp lệ",
                            "errors", errors
                    )
            );
        }

        CustomUserDetails admin =
                (CustomUserDetails) authentication.getPrincipal();

        Integer adminId = admin.getUser().getUserId();

        try {
            User updated = userService.updateUser(adminId, id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/products")
    public List<ProductResponseDTO> getAll() {
        return productService.getAll();
    }

    @PostMapping(
            value = "/products",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ProductDTO> createProduct(
            @ModelAttribute ProductRequestDTO request,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        ProductDTO productDTO = productService.createProduct(request, images);
        return ResponseEntity.ok(productDTO);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping(
            value = "/products/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @ModelAttribute ProductRequestDTO request,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "deletedImageIds", required = false) List<Long> deletedImageIds

    ) {
        return ResponseEntity.ok(
                productService.updateProduct(id, request, images, deletedImageIds)
        );
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderAdminResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        orderService.updateOrderStatus(id, request.status());
        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công");
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderAdminDetailResponseDTO> getOrderDetailAdmin(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.getOrderDetailAdmin(id));
    }

    @GetMapping("/orders/{id}/invoice")
    public ResponseEntity<byte[]> printInvoice(@PathVariable Long id) {

        byte[] pdf = orderService.generateInvoicePdf(id);

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=invoice_" + id + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    @GetMapping("/dashboard")
    public DashboardResponseDTO getDashboard() {
        return dashboardService.getDashboard();
    }

    @GetMapping("/dashboard/top-products")
    public List<TopProductDTO> topProducts(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return dashboardService.getTopSellingProducts(limit);
    }

    @GetMapping("/dashboard/revenue-by-month")
    public List<RevenueByMonthDTO> revenueByMonth(
            @RequestParam int year
    ) {
        return dashboardService.getRevenueByMonth(year);
    }


}
