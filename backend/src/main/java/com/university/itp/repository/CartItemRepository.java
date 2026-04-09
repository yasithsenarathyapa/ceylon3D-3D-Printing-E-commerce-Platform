package com.university.itp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteAllByUser(User user);
    void deleteAllByProduct(Product product);
}
