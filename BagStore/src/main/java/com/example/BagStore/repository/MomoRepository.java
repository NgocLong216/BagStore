package com.example.BagStore.repository;

import com.example.BagStore.dto.CreateMomoRequest;
import com.example.BagStore.dto.CreateMomoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "momo",
        url = "https://test-payment.momo.vn"
)
public interface MomoRepository {

    @PostMapping(
            value = "/v2/gateway/api/create",
            consumes = "application/json"
    )
    CreateMomoResponse createMomoQR(@RequestBody CreateMomoRequest request);
}