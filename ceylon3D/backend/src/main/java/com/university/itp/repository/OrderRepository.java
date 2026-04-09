package com.university.itp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.itp.model.OrderEntity;
import com.university.itp.model.User;

public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    List<OrderEntity> findByUser(User user);
}
