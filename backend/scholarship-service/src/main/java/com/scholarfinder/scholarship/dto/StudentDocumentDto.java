package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDocumentDto {

    private String id;
    private Long studentId;
    private String name;
    private String status;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String fileDataUrl;
    private String fileUrl;
    private String uploadedAt;
}
