package com.university.itp.dto;

import com.university.itp.model.Role;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String id;
    private String email;
    private String fullName;
    private Set<Role> roles;
    private Instant createdAt;
}
