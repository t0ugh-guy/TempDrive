package com.tempcloud.cloudfilesharing.repository;

import com.tempcloud.cloudfilesharing.model.FileRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileRecordRepository extends JpaRepository<FileRecord, Long> {
    Optional<FileRecord> findByShareCode(String shareCode);
}
