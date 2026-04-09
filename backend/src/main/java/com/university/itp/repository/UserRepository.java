package com.university.itp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.itp.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}