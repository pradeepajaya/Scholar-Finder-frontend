package com.scholarfinder.scholarship.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "student_documents",
    schema = "scholarships",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_documents_student_key",
            columnNames = {"student_id", "document_key"}
        )
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "document_key", nullable = false, length = 120)
    private String documentKey;

    @Column(name = "document_name", nullable = false)
    private String name;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "uploaded";

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_data", columnDefinition = "BYTEA")
    private byte[] fileData;

    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (uploadedAt == null) {
            uploadedAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
