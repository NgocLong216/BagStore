package com.example.BagStore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BagStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(BagStoreApplication.class, args);
	}

}
