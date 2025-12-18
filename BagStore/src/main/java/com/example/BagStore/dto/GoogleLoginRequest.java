package com.example.BagStore.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {
    private String token; // access_token từ Google
}
