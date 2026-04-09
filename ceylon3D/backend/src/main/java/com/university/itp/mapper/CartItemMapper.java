package com.university.itp.mapper;

import com.university.itp.dto.CartItemDTO;
import com.university.itp.model.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CartItemMapper {
    CartItemDTO toDTO(CartItem cartItem);
    CartItem toEntity(CartItemDTO cartItemDTO);
}
