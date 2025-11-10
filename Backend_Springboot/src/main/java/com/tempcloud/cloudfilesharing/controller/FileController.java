package com.tempcloud.cloudfilesharing.controller;

import com.tempcloud.cloudfilesharing.model.FileRecord;
import com.tempcloud.cloudfilesharing.service.FileService;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class FileController {

    private final FileService service;

    public FileController(FileService service) {
        this.service = service;
    }

    // POST /upload  -> returns { message, code, link }
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            FileRecord rec = service.saveFile(file);
            String code = rec.getShareCode();
            String link = "/retrieve/" + code; // frontend can prefix with base URL

            return ResponseEntity
                    .created(URI.create(link))
                    .body(Map.of(
                            "message", "File uploaded successfully",
                            "code", code,
                            "link", link
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An internal error occurred during file upload"));
        }
    }

    // GET /check/{code} -> { message } or 404
    @GetMapping("/check/{code}")
    public ResponseEntity<?> check(@PathVariable String code) {
        return service.getByCode(code)
                .map(r -> ResponseEntity.ok(Map.of("message", "File exists")))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Share code not found")));
    }

    // GET /retrieve/{code} -> download
    @GetMapping("/retrieve/{code}")
    public ResponseEntity<?> retrieve(@PathVariable String code) {
        return service.getByCode(code).map(rec -> {
            try {
                Resource res = service.getResourceFor(rec);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                ContentDisposition.attachment()
                                        .filename(rec.getOriginalFilename())
                                        .build().toString())
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(res);
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Error retrieving file"));
            }
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "File not found with this code")));
    }
}
