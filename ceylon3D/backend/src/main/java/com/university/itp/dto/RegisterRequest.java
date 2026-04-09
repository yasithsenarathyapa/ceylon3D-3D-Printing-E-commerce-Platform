package com.university.itp.dto;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
public class RegisterRequest {
    @Email(message = "Please enter a valid email address")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$",
            message = "Password must contain at least one uppercase letter and one special character"
    )
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;
}