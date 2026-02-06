package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for scholarship data with match result.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScholarshipMatchDto {

    private Long id;
    private String title;
    private String description;
    private String provider; // Institution name
    private String country;
    private String scholarshipType;
    private BigDecimal amount;
    private String currency;
    private String amountDisplay; // Formatted amount string
    private String level; // Education level
    private LocalDate applicationDeadline;
    private String deadlineDisplay;
    private boolean isFeatured;
    private String applyLink;
    private String imageUrl;

    // Matching Information
    private BigDecimal matchPercentage;
    private String matchQuality;
    private List<String> matchedCriteria;
    private List<String> unmatchedCriteria;
    private boolean isEligible;
}
