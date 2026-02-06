package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO representing the result of matching a student with a scholarship.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResult {

    private Long scholarshipId;
    private Long studentId;
    
    /**
     * Overall match percentage (0-100).
     */
    private BigDecimal matchPercentage;
    
    /**
     * Match quality classification.
     */
    private MatchQuality matchQuality;
    
    /**
     * List of criteria that the student meets.
     */
    private List<MatchedCriterion> matchedCriteria;
    
    /**
     * List of criteria that the student does not meet.
     */
    private List<UnmatchedCriterion> unmatchedCriteria;
    
    /**
     * Detailed breakdown of scores by category.
     */
    private MatchBreakdown breakdown;
    
    /**
     * Whether the student is eligible to apply (meets minimum requirements).
     */
    private boolean eligible;
    
    /**
     * Reason for ineligibility if not eligible.
     */
    private String ineligibilityReason;

    public enum MatchQuality {
        EXCELLENT,  // >= 90%
        GOOD,       // >= 75%
        FAIR,       // >= 50%
        POOR        // < 50%
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchedCriterion {
        private String category;
        private String criterion;
        private String studentValue;
        private String requiredValue;
        private int pointsEarned;
        private int maxPoints;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnmatchedCriterion {
        private String category;
        private String criterion;
        private String studentValue;
        private String requiredValue;
        private int pointsMissed;
        private boolean mandatory;
        private String suggestion;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchBreakdown {
        private CategoryScore educationLevel;
        private CategoryScore academicPerformance;
        private CategoryScore englishProficiency;
        private CategoryScore age;
        private CategoryScore nationality;
        private CategoryScore financialNeed;
        private CategoryScore fieldOfStudy;
        private CategoryScore specialCategories;
        private CategoryScore preferences;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryScore {
        private String category;
        private int earned;
        private int maximum;
        private BigDecimal percentage;
    }
}
