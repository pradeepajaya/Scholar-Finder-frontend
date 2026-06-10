package com.scholarfinder.scholarship.controller;

import com.scholarfinder.scholarship.dto.ApiResponse;
import com.scholarfinder.scholarship.dto.StudentDocumentDto;
import com.scholarfinder.scholarship.service.StudentDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships/students/{studentId}/documents")
@RequiredArgsConstructor
@Slf4j
public class StudentDocumentController {

    private final StudentDocumentService studentDocumentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDocumentDto>>> getDocuments(
            @PathVariable Long studentId) {
        try {
            List<StudentDocumentDto> documents = studentDocumentService.getDocuments(studentId);
            return ResponseEntity.ok(ApiResponse.success(documents, "Student documents retrieved"));
        } catch (Exception e) {
            log.error("Error retrieving student documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve student documents: " + e.getMessage()));
        }
    }

    @PutMapping("/{documentKey}")
    public ResponseEntity<ApiResponse<StudentDocumentDto>> upsertDocument(
            @PathVariable Long studentId,
            @PathVariable String documentKey,
            @RequestBody StudentDocumentDto request) {
        try {
            StudentDocumentDto document = studentDocumentService.upsertDocument(
                studentId,
                documentKey,
                request
            );
            return ResponseEntity.ok(ApiResponse.success(document, "Student document saved"));
        } catch (Exception e) {
            log.error("Error saving student document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to save student document: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{documentKey}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @PathVariable Long studentId,
            @PathVariable String documentKey) {
        try {
            studentDocumentService.deleteDocument(studentId, documentKey);
            return ResponseEntity.ok(ApiResponse.success(null, "Student document removed"));
        } catch (Exception e) {
            log.error("Error removing student document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to remove student document: " + e.getMessage()));
        }
    }
}
