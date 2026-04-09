package com.university.itp.controller;

import com.university.itp.dto.RegisterRequest;
import com.university.itp.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.web.client.TestRestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanup(){
        userRepository.deleteAll();
    }

    @Test
    void register_requires_email() {
        RegisterRequest req = new RegisterRequest();
        req.setPassword("Pass@1234");
        req.setFullName("User One");
        // missing email

        ResponseEntity<String> resp = restTemplate.postForEntity("/api/auth/register", new HttpEntity<>(req), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void register_duplicate_email_fails(){
        RegisterRequest r1 = new RegisterRequest();
        // Use a unique email that won't clash with DataSeeder's seeded users.
        r1.setEmail("u_unique@example.com");
        r1.setPassword("Pass@1234");
        r1.setFullName("User Unique");
        ResponseEntity<String> r1resp = restTemplate.postForEntity("/api/auth/register", new HttpEntity<>(r1), String.class);
        assertThat(r1resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        RegisterRequest r2 = new RegisterRequest();
        r2.setEmail("u_unique@example.com");
        r2.setPassword("Pass@1234");
        r2.setFullName("User Three");
        ResponseEntity<String> r2resp = restTemplate.postForEntity("/api/auth/register", new HttpEntity<>(r2), String.class);
        assertThat(r2resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(r2resp.getBody()).contains("Email already in use");
    }
}