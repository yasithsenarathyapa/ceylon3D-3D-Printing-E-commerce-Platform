package com.university.itp.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Path UPLOAD_DIR = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-product-images");

    public String storeFile(MultipartFile file, String pathPrefix) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        Files.createDirectories(UPLOAD_DIR);
        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "image.jpg" : file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "-" + originalName;
        Path target = UPLOAD_DIR.resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        
        return pathPrefix + storedName;
    }

    public Resource loadFileAsResource(String filename) throws IOException {
        Path filePath = UPLOAD_DIR.resolve(filename);
        if (!Files.exists(filePath)) {
            return null;
        }
        return new UrlResource(filePath.toUri());
    }

    public Path getFilePath(String filename) {
        return UPLOAD_DIR.resolve(filename);
    }
}
