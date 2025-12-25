package com.example.BagStore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
public class OrderRequestDTO {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(0[3|5|7|8|9])[0-9]{8}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phone;

    @NotBlank(message = "Địa chỉ cụ thể không được để trống")
    private String subAddress;

    @NotBlank(message = "Phường / Quận / Tỉnh không được để trống")
    private String address;

    private String note;

    @NotEmpty(message = "Danh sách sản phẩm không được rỗng")
    @Valid
    private List<OrderItemRequestDTO> items;

    private String paymentMethod; // BANK | COD | MOMO
    private String paymentRef;    // tempCode (chỉ BANK)
}

