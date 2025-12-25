package com.example.bagstore.controller.pay;

import com.example.bagstore.dto.MomoPaymentRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.fluent.Request;
import org.apache.hc.core5.http.ContentType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
public class PaymentController {

    private static final String MOMO_PARTNER_CODE = "MOMOT5BZ20231213_TEST";
    private static final String MOMO_ACCESS_KEY = "F8BBA842ECF85";
    private static final String MOMO_SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    private static final String MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";

    private static final String REDIRECT_URL = "http://localhost:5173/order-success";
    private static final String IPN_URL = "http://localhost:8080/api/pay/momo-callback";


    @PostMapping("/momo")
    public ResponseEntity<?> payMomo(@RequestBody MomoPaymentRequest request) {
        try {
            // Dùng payload test cố định nếu không có request
            String orderId = String.valueOf(request.getOrderId());
            Long amount = request.getAmount();

            String requestId = System.currentTimeMillis() + "";

            String extraData = Base64.getEncoder()
                    .encodeToString(("{\"orderId\":\"" + orderId + "\"}")
                            .getBytes(StandardCharsets.UTF_8));

            // 1️ tạo raw signature đúng chuẩn Momo
            String rawSignature =
                    "accessKey=" + MOMO_ACCESS_KEY +
                            "&amount=" + amount +
                            "&extraData=" + extraData +
                            "&ipnUrl=" + IPN_URL +
                            "&orderId=" + orderId +
                            "&orderInfo=Thanh toán đơn hàng_" + orderId +
                            "&partnerCode=" + MOMO_PARTNER_CODE +
                            "&redirectUrl=" + REDIRECT_URL +
                            "&requestId=" + requestId +
                            "&requestType=captureWallet";



            // 2️ tạo HMAC SHA256 signature
            String signature = hmacSHA256(rawSignature, MOMO_SECRET_KEY);



            // 3️ tạo payload JSON gửi Momo
            Map<String, Object> payload = new HashMap<>();
            payload.put("partnerCode", MOMO_PARTNER_CODE);
            payload.put("requestId", requestId);
            payload.put("amount", amount);
            payload.put("orderId", orderId);
            payload.put("orderInfo", "Thanh_toan_don_hang_" + orderId);
            payload.put("redirectUrl", REDIRECT_URL);
            payload.put("ipnUrl", IPN_URL);
            payload.put("extraData", extraData);
            payload.put("requestType", "captureWallet");
            payload.put("lang", "vi");
            payload.put("signature", signature);



            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(payload);

            // 4️ gửi request POST tới Momo sandbox
            String response = Request.post(MOMO_ENDPOINT)
                    .bodyString(json, ContentType.APPLICATION_JSON)
                    .execute().returnContent().asString();

            System.out.println("Momo raw response: " + response);

            // 5️ parse payUrl nếu có, nếu không log nguyên JSON
            JsonNode node = mapper.readTree(response);
            Map<String, Object> result = new HashMap<>();
            if (node.has("payUrl")) {
                String payUrl = node.get("payUrl").asText();
                result.put("payUrl", payUrl);
            } else {
                result.put("error", node.toString());
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Thanh toán Momo thất bại", "error", e.getMessage()));
        }
    }

    // ===== CALLBACK Momo =====
    @PostMapping("/momo-callback")
    public ResponseEntity<?> momoCallback(@RequestBody Map<String, Object> payload) {
        System.out.println("Momo callback: " + payload);

        // TODO: validate signature từ Momo

        int resultCode = (int) payload.get("resultCode");
        String orderId = (String) payload.get("orderId");

        if (resultCode == 0) {
            System.out.println("Thanh toán thành công orderId=" + orderId);
        } else {
            System.out.println("Thanh toán thất bại orderId=" + orderId);
        }

        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    // ===== HMAC SHA256 =====
    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes("UTF-8"));
        return bytesToHex(hash);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
