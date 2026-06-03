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
public class InstitutionApplicationDto {
    private Long applicationId;
    private Long scholarshipId;
    private String scholarshipTitle;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String qualificationSummary;
    private String currentEducation;
    private String status;
    private LocalDateTime appliedAt;
    private Double matchPercentage;
}
