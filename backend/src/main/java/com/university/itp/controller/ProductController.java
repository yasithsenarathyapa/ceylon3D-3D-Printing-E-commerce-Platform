package com.university.itp.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.university.itp.model.Product;
import com.university.itp.repository.ProductRepository;
import com.university.itp.service.ProductService;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    // # === SECTION: Configuration and Dependency Injection ===
    
    // Directory where product images are temporarily stored
    private static final Path UPLOAD_DIR = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-product-images");

    // Repository for direct database access
    @Autowired
    private ProductRepository productRepository;

    // Service layer for business logic (especially for cascade deletion)
    @Autowired
    private ProductService productService;

    // # === SECTION: Product Retrieval (Read Operations) ===

    
    @GetMapping
    public List<Product> list(){
        // Fetch all products from database and return as REST response
        return productRepository.findAll();
    }

    /**
     * Retrieve a single product by its ID
     * 
     * HTTP: GET /api/products/{id}
     * Public endpoint - no authentication required
     * 
     * @param id - The unique product identifier (primary key)
     * @return ResponseEntity containing Product if found, 404 Not Found if missing
     * 
     * Logic:
     * - Searches database for product with matching ID
     * - If found: returns product in 200 OK response
     * - If not found: returns 404 Not Found response
     * - Used when user clicks on a product to view details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable("id") String id){
        // Try to find product by ID, return it if exists, else return 404 Not Found
        return productRepository.findById(id)
                .map(ResponseEntity::ok)  // If product exists, wrap it in 200 OK response
                .orElse(ResponseEntity.notFound().build());  // If not found, return 404
    }

    // # === SECTION: Product Creation (Admin Only) ===

    /**
     * Create a new product with optional image (file upload OR URL link)
     * 
     * HTTP: POST /api/products (multipart/form-data)
     * Requires: ROLE_ADMIN
     * 
     * @param name - Product name (required)
     * @param description - Product description (required)
     * @param price - Product price in LKR (required)
     * @param stock - Initial stock quantity (required)
     * @param category - Product category like "Art & Decor" (optional)
     * @param image - Product image file upload (optional)
     * @param photoUrl - External image URL link (optional) - e.g., from Cloudinary, S3, etc.
     * @return ResponseEntity with created Product object
     * @throws IOException if image file operations fail
     * 
     * Logic Flow:
     * STEP 1: Handle image - prioritize file upload, then URL, then null
     *   - If file upload provided: save to disk and generate server URL
     *   - Else if photoUrl provided: use the URL directly
     *   - Else: use null (no image)
     * 
     * STEP 2: Create Product object
     *   - Build new Product with all provided details
     *   - Set imagePath from STEP 1 (could be server path or external URL or null)
     * 
     * STEP 3: Save and return
     *   - Save product to database
     *   - Return created product to client
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createWithImage(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "photoUrl", required = false) String photoUrl
    ) throws IOException {
        // STEP 1: Determine image path - prioritize file upload over URL
        String imagePath = null;
        
        if (image != null && !image.isEmpty()) {
            // File upload provided - save to disk
            Files.createDirectories(UPLOAD_DIR);
            
            String originalName = StringUtils.cleanPath(
                    image.getOriginalFilename() == null ? "image.jpg" : image.getOriginalFilename());
            String storedName = UUID.randomUUID() + "-" + originalName;
            Path target = UPLOAD_DIR.resolve(storedName);
            
            Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            imagePath = "/api/products/images/" + storedName;
        } 
        else if (photoUrl != null && !photoUrl.trim().isEmpty()) {
            // No file upload, but URL provided - use the URL directly
            // Supports external URLs from cloud services (Cloudinary, S3, etc.)
            imagePath = photoUrl.trim();
        }
        // If neither file nor URL provided, imagePath remains null

        // STEP 2: Create Product object with all details
        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .category(category)
                .imagePath(imagePath)  // Can be server path, external URL, or null
                .build();
        
        // STEP 3: Save product to database and return it
        productRepository.save(product);
        return ResponseEntity.ok(product);
    }

    // # === SECTION: Image Serving (Public) ===

    /**
     * Serve product images from disk storage to frontend/browser
     * 
     * HTTP: GET /api/products/images/{filename}
     * Public endpoint - no authentication required
     * Allows browsers to display product images on shop pages
     * 
     * @param filename - Name of image file to retrieve (UUID-based format)
     * @return ResponseEntity with image file resource and proper MIME type
     * @throws IOException if file reading fails
     * 
     * Logic Flow:
     * STEP 1: Construct full file path from filename parameter
     * STEP 2: Check if file exists on disk
     * STEP 3: If exists: determine MIME type (image/jpeg, image/png, etc.)
     * STEP 4: Return file with appropriate content-type header
     * STEP 5: If not exists: return 404 Not Found
     */
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable("filename") String filename) throws IOException {
        // STEP 1: Build full path to the image file
        Path filePath = UPLOAD_DIR.resolve(filename);
        
        // STEP 2: Check if file actually exists on disk (security check)
        if (!Files.exists(filePath)) {
            // File not found - return 404 Not Found response
            return ResponseEntity.notFound().build();
        }
        
        // STEP 3: Create a Resource object pointing to the file (Spring can serve this)
        Resource resource = new UrlResource(filePath.toUri());
        
        // STEP 4: Automatically detect the MIME type from file content
        // Examples: image/jpeg, image/png, image/webp, etc.
        String contentType = Files.probeContentType(filePath);
        // If MIME type cannot be detected, default to generic binary type
        if (contentType == null) contentType = "application/octet-stream";
        
        // STEP 5: Return file with proper headers for browser to render as image
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))  // Set correct MIME type
                .body(resource);  // Send file content to browser
    }

    // # === SECTION: Product Update (Admin Only) ===

    /**
     * Update an existing product's details and optionally replace its image
     * 
     * HTTP: PUT /api/products/{id} (multipart/form-data)
     * Requires: ROLE_ADMIN
     * 
     * @param id - Product ID to update
     * @param name - Updated product name
     * @param description - Updated product description
     * @param price - Updated product price
     * @param stock - Updated stock quantity
     * @param category - Updated product category (optional)
     * @param image - New product image file upload (optional - old image kept if not provided)
     * @param photoUrl - New external image URL link (optional - old image kept if not provided)
     * @return ResponseEntity with updated Product, or 404 if product not found
     * @throws IOException if image upload fails
     * 
     * Logic Flow:
     * STEP 1: Find product in database by ID
     * STEP 2: If found: update all fields with new values
     * STEP 3: If new image provided: process and save it
     *         - Prioritize file upload over URL
     *         - If no file: use URL if provided
     *         - If neither: keep existing image
     * STEP 4: Save updated product to database
     * STEP 5: Return updated product
     * STEP 6: If product not found: return 404
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable("id") String id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "photoUrl", required = false) String photoUrl
    ) throws IOException {
        // STEP 1: Try to find the product - if not found, return 404
        return productRepository.findById(id).map(p -> {
            // STEP 2: Update basic product information
            p.setName(name);
            p.setDescription(description);
            p.setPrice(price);
            p.setStock(stock);
            p.setCategory(category);
            
            // STEP 3: Handle optional image update - prioritize file upload over URL
            if (image != null && !image.isEmpty()) {
                try {
                    // File upload provided - save to disk
                    Files.createDirectories(UPLOAD_DIR);
                    String originalName = StringUtils.cleanPath(
                            image.getOriginalFilename() == null ? "image.jpg" : image.getOriginalFilename());
                    String storedName = UUID.randomUUID() + "-" + originalName;
                    Path target = UPLOAD_DIR.resolve(storedName);
                    
                    Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                    p.setImagePath("/api/products/images/" + storedName);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image", e);
                }
            }
            else if (photoUrl != null && !photoUrl.trim().isEmpty()) {
                // No file upload, but URL provided - use the URL directly
                p.setImagePath(photoUrl.trim());
            }
            // If neither file nor URL provided, existing imagePath is preserved
            
            // STEP 4: Save updated product to database
            productRepository.save(p);
            
            // STEP 5: Return updated product as response
            return ResponseEntity.ok(p);
        }).orElse(ResponseEntity.notFound().build());  // STEP 6: Product not found
    }

    // # === SECTION: Product Deletion with Cascade Cleanup (Admin Only) ===

    /**
     * Delete a product using cascade deletion pattern to handle foreign key constraints
     * 
     * HTTP: DELETE /api/products/{id}
     * Requires: ROLE_ADMIN
     * 
     * @param id - Product ID to delete
     * @return 200 OK if deleted successfully, 404 if product not found
     * 
     * ⚠️ CRITICAL LOGIC - CASCADE DELETION PATTERN:
     * 
     * Why cascade deletion is needed:
     * Products have foreign key relationships:
     *   - CartItems reference products (active shopping carts)
     *   - OrderItems reference products (order history)
     * Database constraint: Cannot delete product if child records exist
     * Direct deletion would fail with:
     *   "Cannot delete parent row: foreign key constraint fails"
     * 
     * Solution - Three-step cascade deletion (handled in ProductService):
     * STEP 1: Delete all CartItems referencing this product
     *   → Removes customer shopping carts
     *   → Unblocks product deletion
     * 
     * STEP 2: Nullify product references in OrderItems
     *   → Sets order_items.product_id = NULL
     *   → Preserves order history (order still exists)
     *   → OrderItems store historical data (name, price, quantity)
     * 
     * STEP 3: Delete the product
     *   → Now safe - no foreign key constraints remain
     *   → Product removed from database
     * 
     * Transaction safety:
     * - All 3 steps wrapped in @Transactional
     * - If any step fails: entire operation rolls back
     * - Database remains consistent
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id){
        try {
            // Call ProductService which handles cascade deletion properly
            // (See ProductService.deleteProduct() for detailed cascade logic)
            productService.deleteProduct(id);
            
            // Deletion successful - return 200 OK
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            // Product not found with this ID
            return ResponseEntity.notFound().build();
        }
        // Any database errors will propagate and return 500 Internal Server Error
    }
}