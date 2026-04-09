package com.university.itp.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PlaceOrderRequest {

    @NotBlank
    private String shippingAddress;

    @NotEmpty
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String productId; // optional – links to a DB product if it exists
    }
}
