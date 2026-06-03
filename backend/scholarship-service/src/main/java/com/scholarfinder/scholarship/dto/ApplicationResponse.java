package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for submitted scholarship applications.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;
    private Long scholarshipId;
    private Long studentId;
    private String status;
    private BigDecimal matchScore;
    private boolean updatedExistingApplication;
    private LocalDateTime submittedAt;
}
