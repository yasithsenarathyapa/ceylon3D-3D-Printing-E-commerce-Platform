package com.university.itp.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.university.itp.dto.ProductDTO;
import com.university.itp.mapper.ProductMapper;
import com.university.itp.model.Product;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(String id) {
        return productRepository.findById(id)
                .map(productMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    public ProductDTO createProduct(String name, String description, BigDecimal price, Integer stock, String category, MultipartFile image) throws IOException {
        String imagePath = fileStorageService.storeFile(image, "/api/products/images/");

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .category(category)
                .imagePath(imagePath)
                .build();
                
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    public ProductDTO updateProduct(String id, String name, String description, BigDecimal price, Integer stock, String category, MultipartFile image) throws IOException {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        existingProduct.setName(name);
        existingProduct.setDescription(description);
        existingProduct.setPrice(price);
        existingProduct.setStock(stock);
        existingProduct.setCategory(category);

        if (image != null && !image.isEmpty()) {
            String imagePath = fileStorageService.storeFile(image, "/api/products/images/");
            existingProduct.setImagePath(imagePath);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toDTO(updatedProduct);
    }

    public void deleteProduct(String id) {
        // Find product or throw error
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        
        // Delete cart entries referencing this product first.
        cartItemRepository.deleteAllByProduct(product);

        // Order history is preserved via productName/unitPrice snapshots in OrderItem.
        productRepository.delete(product);
    }
}
