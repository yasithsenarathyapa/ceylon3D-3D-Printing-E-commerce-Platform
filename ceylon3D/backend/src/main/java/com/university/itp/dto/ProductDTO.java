package com.university.itp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imagePath;
    private String category;
    private Instant createdAt;
}
