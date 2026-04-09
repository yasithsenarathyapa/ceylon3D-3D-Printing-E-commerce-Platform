package com.university.itp.mapper;

import com.university.itp.dto.ProductDTO;
import com.university.itp.model.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDTO toDTO(Product product);
    Product toEntity(ProductDTO productDTO);
}
