package com.university.itp.mapper;

import com.university.itp.dto.StlOrderDTO;
import com.university.itp.model.StlOrder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StlOrderMapper {
    StlOrderDTO toDTO(StlOrder stlOrder);
    StlOrder toEntity(StlOrderDTO stlOrderDTO);
}
