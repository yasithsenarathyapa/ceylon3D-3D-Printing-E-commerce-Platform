package com.university.itp.controller;

import com.university.itp.dto.StlOrderDTO;
import com.university.itp.service.StlOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stl-orders")
public class StlOrderController {

    @Autowired
    private StlOrderService stlOrderService;

    @GetMapping("/my")
    public ResponseEntity<List<StlOrderDTO>> myStlOrders(Authentication auth) {
        return ResponseEntity.ok(stlOrderService.getUserStlOrders(auth.getName()));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<List<StlOrderDTO>> allStlOrders() {
        return ResponseEntity.ok(stlOrderService.getAllStlOrders());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") String id, @RequestBody Map<String, String> req) {
        try {
            StlOrderDTO updatedOrder = stlOrderService.updateStatus(id, req.get("status"));
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/price")
    public ResponseEntity<?> updatePrice(@PathVariable("id") String id, @RequestBody Map<String, Object> req) {
        try {
            StlOrderDTO updatedOrder = stlOrderService.updatePrice(id, req);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/my/{id}")
    public ResponseEntity<?> updateMyOrder(@PathVariable("id") String id, @RequestBody Map<String, Object> req, Authentication auth) {
        try {
            StlOrderDTO updatedOrder = stlOrderService.updateMyOrder(auth.getName(), id, req);
            return ResponseEntity.ok(updatedOrder);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/my/{id}/confirm")
    public ResponseEntity<?> confirmOrder(@PathVariable("id") String id, Authentication auth) {
        try {
            StlOrderDTO confirmedOrder = stlOrderService.confirmOrder(auth.getName(), id);
            return ResponseEntity.ok(confirmedOrder);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteStlOrder(@PathVariable("id") String id) {
        try {
            stlOrderService.deleteStlOrder(id);
            return ResponseEntity.ok(Map.of("message", "STL order deleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable("id") String id) {
        try {
            Resource resource = stlOrderService.downloadFile(id);
            if (resource == null) {
                return ResponseEntity.notFound().build();
            }
            
            String originalName = stlOrderService.getOriginalFileName(id);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalName + "\"")
                    .body(resource);
        } catch (MalformedURLException | IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/calculate-cost")
    public ResponseEntity<Map<String, Object>> calculateCost(@RequestBody Map<String, Object> req) {
        try {
            return ResponseEntity.ok(stlOrderService.calculateCost(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
