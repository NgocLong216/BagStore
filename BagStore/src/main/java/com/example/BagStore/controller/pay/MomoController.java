package com.example.BagStore.controller.pay;

import com.example.BagStore.dto.CreateMomoResponse;
import com.example.BagStore.service.MomoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/momo")
public class MomoController {
    private final MomoService momoService;

    @PostMapping("create")
    public CreateMomoResponse createQR(){
        return momoService.createQR();
    }
}
