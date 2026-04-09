package com.university.itp.mapper;

import com.university.itp.dto.OrderDTO;
import com.university.itp.dto.OrderItemDTO;
import com.university.itp.model.OrderEntity;
import com.university.itp.model.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface OrderMapper {
    OrderDTO toDTO(OrderEntity orderEntity);
    OrderEntity toEntity(OrderDTO orderDTO);

    OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    OrderItem toOrderItemEntity(OrderItemDTO orderItemDTO);
}
