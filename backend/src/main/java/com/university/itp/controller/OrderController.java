package com.university.itp.controller;

import com.university.itp.dto.OrderDTO;
import com.university.itp.dto.PlaceOrderRequest;
import com.university.itp.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(Authentication auth, @Valid @RequestBody PlaceOrderRequest req){
        try {
            OrderDTO saved = orderService.placeOrder(auth.getName(), req);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> myOrders(Authentication auth){
        try {
            return ResponseEntity.ok(orderService.getUserOrders(auth.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<List<OrderDTO>> allOrders(){
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") String id, @RequestBody java.util.Map<String, String> req){
        try {
            OrderDTO orderDTO = orderService.updateOrderStatus(id, req.get("status"));
            return ResponseEntity.ok(orderDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/tracking")
    public ResponseEntity<?> updateTrackingNumber(@PathVariable("id") String id, @RequestBody java.util.Map<String, String> req) {
        try {
            OrderDTO orderDTO = orderService.updateTrackingNumber(id, req.get("trackingNumber"));
            return ResponseEntity.ok(orderDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}