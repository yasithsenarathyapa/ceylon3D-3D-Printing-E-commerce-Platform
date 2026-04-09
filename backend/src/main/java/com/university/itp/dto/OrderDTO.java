package com.university.itp.dto;

import com.university.itp.model.OrderCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private String id;
    private UserDTO user;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private OrderCategory category;
    private String status;
    private String shippingAddress;
    private String trackingNumber;
    private Instant createdAt;
}
