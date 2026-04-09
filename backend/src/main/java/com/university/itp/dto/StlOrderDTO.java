package com.university.itp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StlOrderDTO {
    private String id;
    private String customerName;
    private String customerEmail;
    private String customerEmail2;
    private String phone;
    private String address;
    private String fileName;
    private Long fileSizeBytes;
    private String material;
    private Integer quantity;
    private BigDecimal estimatedPrice;
    private Integer printTimeHours;
    private Integer printTimeMinutes;
    private Double weightGrams;
    private Boolean supportStructures;
    private String status;
    private String userId;
    private String note;
    private Instant createdAt;
}
