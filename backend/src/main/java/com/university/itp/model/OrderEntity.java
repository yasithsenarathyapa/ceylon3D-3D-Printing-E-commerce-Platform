package com.university.itp.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

	@Id
	@Column(nullable = false, updatable = false)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
	@Builder.Default
	private List<OrderItem> items = new ArrayList<>();

	private BigDecimal totalAmount;

	@Enumerated(EnumType.STRING)
	private OrderCategory category;

	private String status;

	private String shippingAddress;

	private String trackingNumber;

	@Builder.Default
	@Column(nullable = false, updatable = false)
	private Instant createdAt = Instant.now();

	@PrePersist
	public void prePersist() {
		if (id == null || id.isBlank()) {
			id = UUID.randomUUID().toString();
		}
		if (createdAt == null) {
			createdAt = Instant.now();
		}
	}
}
