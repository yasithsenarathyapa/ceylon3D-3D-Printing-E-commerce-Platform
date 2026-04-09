package com.university.itp.config;

import com.university.itp.model.Role;
import com.university.itp.model.StlOrder;
import com.university.itp.model.User;
import com.university.itp.repository.StlOrderRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@ceylon3d.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("Admin")
                        .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_CUSTOMER))
                        .build();
                userRepository.save(admin);
                System.out.println(">>> Admin user seeded: " + adminEmail + " / admin123");
            }
        };
    }

    @Bean
    public CommandLineRunner seedTestStlOrders(StlOrderRepository stlOrderRepository) {
        return args -> {
            if (stlOrderRepository.count() == 0) {
                stlOrderRepository.save(StlOrder.builder()
                        .customerName("Kamal Perera")
                        .customerEmail("kamal@example.com")
                        .phone("0771234567")
                        .fileName("dragon_figurine.stl")
                        .fileSizeBytes(2_450_000L)
                        .material("PLA")
                        .quantity(1)
                        .estimatedPrice(BigDecimal.ZERO)
                        .note("Please print in red PLA, medium quality is fine.")
                        .build());

                stlOrderRepository.save(StlOrder.builder()
                        .customerName("Nimal Silva")
                        .customerEmail("nimal.silva@gmail.com")
                        .phone("0769876543")
                        .fileName("custom_phone_case_v2.stl")
                        .fileSizeBytes(890_000L)
                        .material("ABS")
                        .quantity(2)
                        .estimatedPrice(BigDecimal.ZERO)
                        .note("Need support structures. Black ABS preferred.")
                        .build());

                stlOrderRepository.save(StlOrder.builder()
                        .customerName("Amaya Fernando")
                        .customerEmail("amaya.f@outlook.com")
                        .phone("0712345678")
                        .fileName("gear_assembly_part3.stl")
                        .fileSizeBytes(5_120_000L)
                        .material("PLA+")
                        .quantity(3)
                        .estimatedPrice(BigDecimal.ZERO)
                        .note("High infill needed – functional part for a machine.")
                        .build());

                System.out.println(">>> 3 test STL orders seeded");
            }
        };
    }
}
