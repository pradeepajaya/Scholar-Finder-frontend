package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentApplicationDto {
    private Long applicationId;
    private Long scholarshipId;
    private String scholarshipTitle;
    private String providerName;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private Double matchPercentage;
    private String[] requiredDocuments;
}
