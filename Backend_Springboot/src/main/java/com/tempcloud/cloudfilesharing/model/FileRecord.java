package com.tempcloud.cloudfilesharing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_records")
public class FileRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalFilename;

    @Column(nullable = false, unique = true, length = 255)
    private String uniqueFilename; // hashed/storage name

    @Column(nullable = false, unique = true, length = 16)
    private String shareCode;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    // getters/setters
    public Long getId() { return id; }
    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }
    public String getUniqueFilename() { return uniqueFilename; }
    public void setUniqueFilename(String uniqueFilename) { this.uniqueFilename = uniqueFilename; }
    public String getShareCode() { return shareCode; }
    public void setShareCode(String shareCode) { this.shareCode = shareCode; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
