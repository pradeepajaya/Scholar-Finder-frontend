package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String currentEducation;
    private String intendedLevel;
    private String fieldOfStudy;
    private String alStream;
    private String alResults;
    private String zScore;
    private String gpa;
    private String englishTest;
    private String englishScore;
    private String householdIncome;
    private String achievements;
    private String qualificationSummary;
    private String coverLetter;
    private List<ApplicationDocumentDto> submittedDocuments;
}
