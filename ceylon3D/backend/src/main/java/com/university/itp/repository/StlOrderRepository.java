package com.university.itp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.itp.model.StlOrder;

public interface StlOrderRepository extends JpaRepository<StlOrder, String> {
    List<StlOrder> findAllByOrderByCreatedAtDesc();
    List<StlOrder> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    /** Find STL orders that belong to a user — by userId OR by matching email (case-insensitive) */
    List<StlOrder> findByUserIdOrCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String userId, String email);
}
