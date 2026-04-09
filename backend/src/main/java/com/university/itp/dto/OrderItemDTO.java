package com.university.itp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private String id;
    private String productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
}
