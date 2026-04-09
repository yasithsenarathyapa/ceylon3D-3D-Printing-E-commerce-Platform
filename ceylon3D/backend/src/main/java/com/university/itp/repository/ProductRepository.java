package com.university.itp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.itp.model.Product;

public interface ProductRepository extends JpaRepository<Product, String> {
}
