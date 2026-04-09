package com.university.itp;

import com.university.itp.model.Product;
import com.university.itp.model.Role;
import com.university.itp.model.User;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder encoder){
        return args -> {
            if(!userRepository.existsByEmail("admin@itp.edu")){
                User admin = User.builder()
                        .email("admin@itp.edu")
                        .password(encoder.encode("adminpass"))
                        .fullName("Admin User")
                        .roles(Set.of(Role.ROLE_ADMIN))
                        .build();
                userRepository.save(admin);
            }

            if(productRepository.count() == 0){
                productRepository.save(Product.builder()
                        .name("PLA Filament 1kg")
                        .description("High quality 1kg PLA filament")
                        .price(new BigDecimal("19.99"))
                        .stock(100)
                        .imagePath("/assets/filament.jpg")
                        .build());

                productRepository.save(Product.builder()
                        .name("Resin 1L")
                        .description("Standard resin")
                        .price(new BigDecimal("29.99"))
                        .stock(50)
                        .imagePath("/assets/resin.jpg")
                        .build());
            }
        };
    }
}