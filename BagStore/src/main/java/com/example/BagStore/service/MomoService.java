package com.example.BagStore.service;

import com.example.BagStore.dto.CreateMomoRequest;
import com.example.BagStore.dto.CreateMomoResponse;
import com.example.BagStore.repository.MomoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {

    @Value("${momo.partner-code}")
    private String PARTNER_CODE;

    @Value("${momo.access-key}")
    private String ACCESS_KEY;

    @Value("${momo.secret-key}")
    private String SECRET_KEY;

    @Value("${momo.redirect-url}")
    private String REDIRECT_URL;

    @Value("${momo.ipn-url}")
    private String IPN_URL;

    @Value("${momo.request-type}")
    private String REQUEST_TYPE;


    private final MomoRepository momoRepository;

    public CreateMomoResponse createQR() {

        String orderId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toan don hang: " + orderId;
        String requestId = UUID.randomUUID().toString();
        long amount = 100000;
        String extraDataRaw = "khong co khuyen mai gi het";
        String extraData = Base64.getEncoder()
                .encodeToString(extraDataRaw.getBytes(StandardCharsets.UTF_8));

        String rawSignature =
                "accessKey=" + ACCESS_KEY +
                        "&amount=" + amount +
                        "&extraData=" + extraData +
                        "&ipnUrl=" + IPN_URL +
                        "&orderId=" + orderId +
                        "&orderInfo=" + orderInfo +
                        "&partnerCode=" + PARTNER_CODE +
                        "&redirectUrl=" + REDIRECT_URL +
                        "&requestId=" + requestId +
                        "&requestType=" + REQUEST_TYPE;

        String prettySignature = "";
        try {
            prettySignature = signHmacSHA256(rawSignature, SECRET_KEY);
        } catch (Exception e) {
            log.error(">>>> Co loi khi hash code: " + e);
            return null;
        }

        if (prettySignature.isBlank()) {
            log.error(">>>> signature is blank");
            return null;
        }

        CreateMomoRequest request = CreateMomoRequest.builder()
                .partnerCode(PARTNER_CODE)
                .requestType(REQUEST_TYPE)
                .ipnUrl(IPN_URL)
                .redirectUrl(REDIRECT_URL)
                .orderId(orderId)
                .orderInfo(orderInfo)
                .requestId(requestId)
                .extraData(extraData)
                .amount(amount)
                .signature(prettySignature)
                .lang("vi")
                .build();

        return momoRepository.createMomoQR(request);
    }

    private String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);

        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }
}
