package com.university.itp.mapper;

import com.university.itp.dto.UserDTO;
import com.university.itp.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);
}
