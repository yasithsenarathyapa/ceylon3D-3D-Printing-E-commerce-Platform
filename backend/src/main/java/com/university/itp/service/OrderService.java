package com.university.itp.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.itp.dto.OrderDTO;
import com.university.itp.dto.PlaceOrderRequest;
import com.university.itp.mapper.OrderMapper;
import com.university.itp.model.OrderCategory;
import com.university.itp.model.OrderEntity;
import com.university.itp.model.OrderItem;
import com.university.itp.model.User;
import com.university.itp.repository.OrderRepository;
import com.university.itp.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Transactional
    public OrderDTO placeOrder(String email, PlaceOrderRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setCategory(OrderCategory.SHOP);
        order.setStatus("PENDING");
        order.setShippingAddress(req.getShippingAddress());

        List<OrderItem> items = req.getItems().stream().map(dto -> {
            OrderItem oi = new OrderItem();
            oi.setProductName(dto.getProductName());
            oi.setQuantity(dto.getQuantity());
            oi.setUnitPrice(dto.getUnitPrice());
            oi.setProductId(dto.getProductId());
            return oi;
        }).collect(Collectors.toList());

        order.setItems(items);
        BigDecimal total = items.stream()
            .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        OrderEntity saved = orderRepository.save(order);
        return orderMapper.toDTO(saved);
    }

    @Transactional
    public List<OrderDTO> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return orderRepository.findByUser(user).stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrderStatus(String id, String status) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return orderMapper.toDTO(orderRepository.save(order));
    }

    @Transactional
    public OrderDTO updateTrackingNumber(String id, String trackingNumber) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setTrackingNumber(trackingNumber);
        return orderMapper.toDTO(orderRepository.save(order));
    }
}
