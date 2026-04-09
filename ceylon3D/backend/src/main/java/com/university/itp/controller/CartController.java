package com.university.itp.controller;

import com.university.itp.dto.CartItemDTO;
import com.university.itp.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(Authentication auth){
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(Authentication auth, @RequestBody Map<String, Object> req){
        try {
            String productId = req.get("productId").toString();
            int quantity = req.containsKey("quantity") ? Integer.parseInt(req.get("quantity").toString()) : 1;
            
            CartItemDTO saved = cartService.addToCart(auth.getName(), productId, quantity);
            
            return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "productId", productId,
                "quantity", saved.getQuantity()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody Map<String, Object> req, Authentication auth){
        try {
            int quantity = Integer.parseInt(req.get("quantity").toString());
            CartItemDTO updated = cartService.updateCartItem(auth.getName(), id, quantity);
            
            return ResponseEntity.ok(Map.of(
                "id", updated.getId(),
                "productId", updated.getProduct() != null ? updated.getProduct().getId() : null,
                "quantity", updated.getQuantity()
            ));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable("id") String id, Authentication auth){
        try {
            cartService.removeCartItem(auth.getName(), id);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(Authentication auth){
        try {
            cartService.clearCart(auth.getName());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}