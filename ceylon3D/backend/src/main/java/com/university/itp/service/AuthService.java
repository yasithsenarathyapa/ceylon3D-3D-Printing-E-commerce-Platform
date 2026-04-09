package com.university.itp.service;

import com.university.itp.dto.AuthResponse;
import com.university.itp.dto.LoginRequest;
import com.university.itp.dto.RegisterRequest;
import com.university.itp.dto.UserDTO;
import com.university.itp.mapper.UserMapper;
import com.university.itp.model.Role;
import com.university.itp.model.User;
import com.university.itp.repository.UserRepository;
import com.university.itp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserMapper userMapper;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .roles(Collections.singleton(Role.ROLE_CUSTOMER))
                .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        UserDTO userDTO = userMapper.toDTO(user);

        return new AuthResponse(token, "Bearer", userDTO);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String token = jwtUtil.generateToken(user.getEmail());
        UserDTO userDTO = userMapper.toDTO(user);

        return new AuthResponse(token, "Bearer", userDTO);
    }

    public UserDTO getCurrentUser(String tokenHeader) {
        String token = tokenHeader.substring(7);
        String email = jwtUtil.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return userMapper.toDTO(user);
    }
}
