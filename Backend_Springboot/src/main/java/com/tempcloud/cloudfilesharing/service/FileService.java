package com.tempcloud.cloudfilesharing.service;

import com.tempcloud.cloudfilesharing.config.FileStorageProperties;
import com.tempcloud.cloudfilesharing.model.FileRecord;
import com.tempcloud.cloudfilesharing.repository.FileRecordRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileService {

    private final Path storageRoot;
    private final FileRecordRepository repo;
    private final SecureRandom random = new SecureRandom();

    public FileService(FileStorageProperties props, FileRecordRepository repo) throws IOException {
        this.storageRoot = Paths.get(props.getUploadDir()).toAbsolutePath().normalize();
        this.repo = repo;
        Files.createDirectories(this.storageRoot);
    }

    /** Save incoming file to disk, persist metadata, return record */
    public FileRecord saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IOException("Empty upload");

        String original = Path.of(file.getOriginalFilename()).getFileName().toString();

        // hashed/unique filename: UUID + 8 random bytes + original extension
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);

        String randomHex = HexFormat.of().formatHex(random.generateSeed(8));
        String unique = (UUID.randomUUID().toString() + "-" + randomHex).toLowerCase(Locale.ROOT) + ext;

        Path target = storageRoot.resolve(unique);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        FileRecord rec = new FileRecord();
        rec.setOriginalFilename(original);
        rec.setUniqueFilename(unique);
        rec.setShareCode(generateShareCode(6));
        rec.setUploadedAt(LocalDateTime.now());

        return repo.save(rec);
    }

    /** Retrieve metadata by share code */
    public Optional<FileRecord> getByCode(String code) {
        return repo.findByShareCode(code.toUpperCase(Locale.ROOT));
    }

    /** Resolve a Resource for streaming/download */
    public Resource getResourceFor(FileRecord rec) throws MalformedURLException {
        Path path = storageRoot.resolve(rec.getUniqueFilename()).normalize();
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists()) throw new RuntimeException("File on disk missing");
        return resource;
    }

    private String generateShareCode(int len) {
        // 0-9A-Z code (like your Flask uppercase code)
        final String alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) sb.append(alphabet.charAt(random.nextInt(alphabet.length())));
        return sb.toString();
    }
}
