package com.university.itp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.itp.dto.StlOrderDTO;
import com.university.itp.mapper.StlOrderMapper;
import com.university.itp.model.OrderCategory;
import com.university.itp.model.OrderEntity;
import com.university.itp.model.OrderItem;
import com.university.itp.model.StlOrder;
import com.university.itp.model.User;
import com.university.itp.repository.OrderRepository;
import com.university.itp.repository.StlOrderRepository;
import com.university.itp.repository.UserRepository;

@Service
public class StlOrderService {

    private static final Set<String> ALLOWED_MATERIALS = Set.of("PLA", "PLA+", "ABS", "ABS+");

    @Autowired
    private StlOrderRepository stlOrderRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StlOrderMapper stlOrderMapper;

    public List<StlOrderDTO> getUserStlOrders(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        String userId = user != null ? user.getId() : "__none__";
        return stlOrderRepository.findByUserIdOrCustomerEmailIgnoreCaseOrderByCreatedAtDesc(userId, email).stream()
                .map(stlOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<StlOrderDTO> getAllStlOrders() {
        return stlOrderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(stlOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public StlOrderDTO updateStatus(String id, String status) {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));
        order.setStatus(status);
        return stlOrderMapper.toDTO(stlOrderRepository.save(order));
    }

    public StlOrderDTO updatePrice(String id, Map<String, Object> req) {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));
        
        BigDecimal price = new BigDecimal(req.get("estimatedPrice").toString());
        order.setEstimatedPrice(price);

        if (req.containsKey("printTimeHours")) {
            order.setPrintTimeHours(((Number) req.get("printTimeHours")).intValue());
        }
        if (req.containsKey("printTimeMinutes")) {
            order.setPrintTimeMinutes(((Number) req.get("printTimeMinutes")).intValue());
        }
        if (req.containsKey("weightGrams")) {
            order.setWeightGrams(((Number) req.get("weightGrams")).doubleValue());
        }
        if (req.containsKey("supportStructures")) {
            order.setSupportStructures(Boolean.TRUE.equals(req.get("supportStructures")));
        }
        if (req.containsKey("material")) {
            order.setMaterial(normalizeMaterial((String) req.get("material")));
        }

        if ("PENDING_QUOTE".equals(order.getStatus())) {
            order.setStatus("QUOTED");
        }
        return stlOrderMapper.toDTO(stlOrderRepository.save(order));
    }

    public StlOrderDTO updateMyOrder(String email, String id, Map<String, Object> req) {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));

        if (!email.equalsIgnoreCase(order.getCustomerEmail())) {
            throw new SecurityException("You can only update your own orders");
        }
        if (!"PENDING_QUOTE".equals(order.getStatus())) {
            throw new IllegalStateException("Only pending orders can be updated");
        }

        if (req.containsKey("material")) {
            order.setMaterial(normalizeMaterial((String) req.get("material")));
        }
        if (req.containsKey("quantity")) {
            int qty = ((Number) req.get("quantity")).intValue();
            order.setQuantity(Math.max(qty, 1));
        }
        if (req.containsKey("note")) {
            order.setNote((String) req.get("note"));
        }
        return stlOrderMapper.toDTO(stlOrderRepository.save(order));
    }

    @Transactional
    public StlOrderDTO confirmOrder(String email, String id) {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));

        if (!email.equalsIgnoreCase(order.getCustomerEmail())) {
            throw new SecurityException("You can only confirm your own orders");
        }
        if (!"QUOTED".equals(order.getStatus())) {
            throw new IllegalStateException("Only quoted orders can be confirmed");
        }

        order.setStatus("CONFIRMED");
        StlOrder savedOrder = stlOrderRepository.save(order);
        System.out.println(">>> STL Order confirmed with ID: " + id + ", Status: CONFIRMED");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));
        
        OrderEntity shopOrder = new OrderEntity();
        shopOrder.setUser(user);
        shopOrder.setCategory(OrderCategory.STL);
        shopOrder.setStatus("PENDING");
        shopOrder.setTotalAmount(order.getEstimatedPrice());
        shopOrder.setShippingAddress(order.getCustomerName() + "\n" + (order.getPhone() != null ? order.getPhone() : ""));

        String displayFileName = order.getFileName();
        if (displayFileName != null) {
            int dashIdx = displayFileName.indexOf('-');
            if (dashIdx > 0 && dashIdx < displayFileName.length() - 1) {
                displayFileName = displayFileName.substring(dashIdx + 1);
            }
        }

        OrderItem item = new OrderItem();
        item.setProductName("3D Print: " + (displayFileName != null ? displayFileName : "STL File") + " (" + order.getMaterial() + ")");
        item.setQuantity(order.getQuantity() != null ? order.getQuantity() : 1);
        item.setUnitPrice(order.getEstimatedPrice());

        List<OrderItem> items = new ArrayList<>();
        items.add(item);
        shopOrder.setItems(items);

        OrderEntity savedShopOrder = orderRepository.save(shopOrder);
        System.out.println(">>> Shop Order created for STL confirmation with ID: " + savedShopOrder.getId() + ", Status: PENDING");

        return stlOrderMapper.toDTO(savedOrder);
    }

    public void deleteStlOrder(String id) {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));

        try {
            Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-uploads");
            Path filePath = uploadDir.resolve(order.getFileName());
            Files.deleteIfExists(filePath);
        } catch (Exception ignored) {
            // File may already be deleted; continue with DB removal
        }
        stlOrderRepository.delete(order);
    }

    public Resource downloadFile(String id) throws MalformedURLException {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));

        Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-uploads");
        Path filePath = uploadDir.resolve(order.getFileName());
        
        if (!Files.exists(filePath)) {
            return null;
        }
        return new UrlResource(filePath.toUri());
    }
    
    public String getOriginalFileName(String id) {
        StlOrder order = stlOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("STL Order not found"));
        
        String originalName = order.getFileName();
        int dashIndex = originalName.indexOf('-');
        if (dashIndex > 0 && dashIndex < originalName.length() - 1) {
            return originalName.substring(dashIndex + 1);
        }
        return originalName;
    }

    public Map<String, Object> calculateCost(Map<String, Object> req) {
        int printTimeHours = (int) extractLong(req.get("printTimeHours"), 0L);
        int printTimeMinutes = (int) extractLong(req.get("printTimeMinutes"), 0L);
        double weightGrams = extractDouble(req.get("weightGrams"), 0.0);
        String material = normalizeMaterial((String) req.get("material"));
        boolean supportStructures = Boolean.TRUE.equals(req.get("supportStructures"));

        if (weightGrams <= 0) {
            throw new IllegalArgumentException("weightGrams must be greater than 0");
        }

        double totalHours = printTimeHours + (printTimeMinutes / 60.0);

        // Material Cost
        double materialRate = (material.startsWith("ABS")) ? 6.00 : 5.00;
        BigDecimal materialCost = BigDecimal.valueOf(weightGrams * materialRate);

        BigDecimal machineCost = BigDecimal.valueOf(totalHours * 50.00);
        BigDecimal energyCost = BigDecimal.valueOf(totalHours * 30.00);
        BigDecimal laborCost = BigDecimal.valueOf(100.00);
        BigDecimal supportCost = supportStructures ? BigDecimal.valueOf(100.00) : BigDecimal.ZERO;

        BigDecimal totalCost = materialCost.add(machineCost).add(energyCost).add(laborCost).add(supportCost);
        BigDecimal sellingPrice = totalCost.multiply(BigDecimal.valueOf(1.5)).setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> result = new HashMap<>();
        result.put("material", material);
        result.put("weightGrams", weightGrams);
        result.put("printTimeHours", printTimeHours);
        result.put("printTimeMinutes", printTimeMinutes);
        result.put("supportStructures", supportStructures);
        result.put("materialCost", materialCost.setScale(2, RoundingMode.HALF_UP));
        result.put("machineCost", machineCost.setScale(2, RoundingMode.HALF_UP));
        result.put("energyCost", energyCost.setScale(2, RoundingMode.HALF_UP));
        result.put("laborCost", laborCost.setScale(2, RoundingMode.HALF_UP));
        result.put("supportCost", supportCost.setScale(2, RoundingMode.HALF_UP));
        result.put("totalCost", totalCost.setScale(2, RoundingMode.HALF_UP));
        result.put("sellingPrice", sellingPrice);

        return result;
    }

    private String normalizeMaterial(String material) {
        if (material == null || material.isBlank()) {
            return "PLA";
        }
        String normalized = material.trim().toUpperCase();
        return ALLOWED_MATERIALS.contains(normalized) ? normalized : "PLA";
    }

    private long extractLong(Object value, long fallback) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            try {
                return Long.parseLong(text.trim());
            } catch (NumberFormatException ignored) {
                return fallback;
            }
        }
        return fallback;
    }

    private double extractDouble(Object value, double fallback) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        if (value instanceof String text) {
            try {
                return Double.parseDouble(text.trim());
            } catch (NumberFormatException ignored) {
                return fallback;
            }
        }
        return fallback;
    }
}
