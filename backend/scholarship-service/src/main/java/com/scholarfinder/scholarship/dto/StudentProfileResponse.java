package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Response DTO for student profile operations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {

    private Long userId;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private Integer age;
    private String gender;
    private String nationality;
    private String nicPassport;
    private String district;
    private String province;
    private String city;
    private String mobile;
    private String preferredLanguage;

    private String highestEducation;
    private String currentStatus;
    private String intendedLevel;
    private String intendedYear;
    private String preferredMode;
    private String preferredLocation;

    private String olYear;
    private String olType;
    private String olMedium;
    private Integer olPassed;
    private Integer olACount;
    private Integer olBCount;
    private Integer olCCount;
    private String mathsGrade;
    private String scienceGrade;
    private String englishGrade;

    private String alYear;
    private String alStream;
    private String alMedium;
    private String subject1;
    private String grade1;
    private String subject2;
    private String grade2;
    private String subject3;
    private String grade3;
    private BigDecimal zScore;
    private BigDecimal calculatedGpa;

    private String englishTest;
    private String overallScore;
    private String examYear;

    private String householdIncome;
    private Integer dependents;
    private String employmentStatus;
    private String governmentAssistance;

    private String background;
    private String disability;
    private String sports;
    private String leadership;
    private String firstGeneration;

    private String[] preferredCountries;
    private String[] preferredFields;
    private String scholarshipType;
    private String willingToReturn;
    private String profilePictureUrl;
    private Integer profileCompletionPercentage;
}
