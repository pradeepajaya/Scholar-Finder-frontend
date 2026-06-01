package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for submitting a student's scholarship application.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSubmitRequest {

    private Long studentId;
    private Long scholarshipId;

    private String fullName;
    private String email;
    private String phone;

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

    private List<String> requiredDocuments;
    private List<ApplicationDocumentDto> documents;
}
