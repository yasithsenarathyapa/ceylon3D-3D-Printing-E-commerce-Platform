package com.university.itp.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.university.itp.model.StlOrder;
import com.university.itp.model.User;
import com.university.itp.repository.StlOrderRepository;
import com.university.itp.repository.UserRepository;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);
    private static final Set<String> ALLOWED_MATERIALS = Set.of("PLA", "ABS", "PETG", "RESIN");

    @Autowired
    private StlOrderRepository stlOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(value = "/stl", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadStl(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "email2", required = false) String email2,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "message", required = false) String message,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam(value = "quantity", required = false) Integer quantity
    ) {
        logger.info("Received STL upload request: file={}, name={}, email={}, phone={}, address={}, material={}, quantity={}",
                file != null ? file.getOriginalFilename() : "null", name, email, phone, address, material, quantity);

        try {
            if (file == null || file.isEmpty()) {
                logger.warn("No file uploaded in request");
                return ResponseEntity.badRequest().body(Map.of("message", "No file uploaded"));
            }

            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
            String lowerName = originalName.toLowerCase();
            if (!lowerName.endsWith(".stl") && !lowerName.endsWith(".pdf") && !lowerName.endsWith(".jpg") && !lowerName.endsWith(".jpeg")) {
                logger.warn("Invalid file extension: {}", originalName);
                return ResponseEntity.badRequest().body(Map.of("message", "Only .stl, .pdf, .jpg and .jpeg files are allowed"));
            }

            logger.debug("Creating upload directory");
            Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-uploads");
            Files.createDirectories(uploadDir);

            String storedFileName = UUID.randomUUID() + "-" + originalName;
            Path targetPath = uploadDir.resolve(storedFileName);
            logger.debug("Copying file to: {}", targetPath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("File saved successfully: {}", storedFileName);

            String normalizedMaterial = normalizeMaterial(material);
            int safeQuantity = quantity == null || quantity < 1 ? 1 : quantity;
            BigDecimal estimatedPrice = calculateEstimatedPrice(file.getSize(), normalizedMaterial, safeQuantity);

            String linkedUserId = null;
            if (email != null && !email.isBlank()) {
                logger.debug("Looking up user by email: {}", email.trim());
                linkedUserId = userRepository.findByEmail(email.trim())
                        .map(User::getId)
                        .orElse(null);
                logger.debug("User lookup result: {}", linkedUserId);
            }

            StlOrder stlOrder = StlOrder.builder()
                    .customerName(name == null ? "" : name)
                    .customerEmail(email == null ? "" : email)
                    .customerEmail2(email2 == null ? "" : email2)
                    .phone(phone == null ? "" : phone)
                    .address(address == null ? "" : address)
                    .fileName(storedFileName)
                    .fileSizeBytes(file.getSize())
                    .material(normalizedMaterial)
                    .quantity(safeQuantity)
                    .estimatedPrice(estimatedPrice)
                    .status("PENDING_QUOTE")
                    .userId(linkedUserId)
                    .note(message == null ? "" : message)
                    .build();

            logger.debug("Saving STL order to database");
            StlOrder savedOrder = stlOrderRepository.save(stlOrder);
            logger.info("STL order saved successfully with ID: {}", savedOrder.getId());

            Map<String, String> response = Map.of(
                    "message", "Upload successful",
                    "fileName", storedFileName,
                    "name", name == null ? "" : name,
                    "email", email == null ? "" : email,
                    "phone", phone == null ? "" : phone,
                    "material", normalizedMaterial,
                    "quantity", String.valueOf(safeQuantity),
                    "estimatedPrice", estimatedPrice.toPlainString(),
                    "stlOrderId", String.valueOf(savedOrder.getId()),
                    "messageText", message == null ? "" : message
            );

            logger.info("Upload completed successfully for order ID: {}", savedOrder.getId());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            logger.error("Error while processing STL upload", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error while processing upload: " + ex.getMessage()));
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        logger.error("Unhandled exception in UploadController", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Unhandled server error: " + ex.getMessage()));
    }

    private String normalizeMaterial(String material) {
        if (material == null || material.isBlank()) {
            return "PLA";
        }

        String normalized = material.trim().toUpperCase();
        return ALLOWED_MATERIALS.contains(normalized) ? normalized : "PLA";
    }

    private BigDecimal calculateEstimatedPrice(long fileSizeBytes, String material, int quantity) {
        BigDecimal baseCharge = BigDecimal.valueOf(8.00);
        BigDecimal sizeInMb = BigDecimal.valueOf(fileSizeBytes)
                .divide(BigDecimal.valueOf(1024 * 1024), 4, RoundingMode.HALF_UP);
        BigDecimal sizeCost = sizeInMb.multiply(BigDecimal.valueOf(4.00));
        BigDecimal materialMultiplier = switch (material) {
            case "ABS" -> BigDecimal.valueOf(1.15);
            case "PETG" -> BigDecimal.valueOf(1.30);
            case "RESIN" -> BigDecimal.valueOf(1.60);
            default -> BigDecimal.ONE;
        };

        BigDecimal unitPrice = baseCharge.add(sizeCost).multiply(materialMultiplier);
        return unitPrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }
}
