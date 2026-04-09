package com.university.itp.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stl_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StlOrder {

    @Id
    @Column(nullable = false, updatable = false)
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

    /** Linked user account (null if uploaded anonymously with no matching user) */
    private String userId;

    private String note;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Builder.Default
    private String status = "PENDING_QUOTE";

    @PrePersist
    public void prePersist() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (status == null || status.isBlank()) {
            status = "PENDING_QUOTE";
        }
    }
}
