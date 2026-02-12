package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for getting scholarship matches for a student.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {

    /**
     * The student's user ID.
     */
    private Long studentUserId;

    /**
     * Optional: Filter by specific scholarship IDs.
     */
    private List<Long> scholarshipIds;

    /**
     * Optional: Filter by education level (UNDERGRADUATE, POSTGRADUATE, PHD).
     */
    private String educationLevel;

    /**
     * Optional: Filter by country.
     */
    private String country;

    /**
     * Optional: Filter by field of study.
     */
    private String fieldOfStudy;

    /**
     * Optional: Filter by scholarship type (FULL, PARTIAL).
     */
    private String scholarshipType;

    /**
     * Minimum match percentage to include (default: 0).
     */
    @Builder.Default
    private Integer minimumMatchPercentage = 0;

    /**
     * Maximum number of results to return.
     */
    @Builder.Default
    private Integer limit = 50;

    /**
     * Sort order: MATCH_DESC, MATCH_ASC, DEADLINE_ASC, DEADLINE_DESC.
     */
    @Builder.Default
    private String sortBy = "MATCH_DESC";
}
