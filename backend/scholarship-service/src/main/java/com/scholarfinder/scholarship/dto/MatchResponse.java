package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for scholarship matching results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {

    private Long studentId;
    private String studentName;
    
    /**
     * Total number of scholarships analyzed.
     */
    private int totalScholarshipsAnalyzed;
    
    /**
     * Number of scholarships with matches above threshold.
     */
    private int matchesFound;
    
    /**
     * Number of excellent matches (>= 90%).
     */
    private int excellentMatches;
    
    /**
     * Number of good matches (>= 75%).
     */
    private int goodMatches;
    
    /**
     * Number of fair matches (>= 50%).
     */
    private int fairMatches;
    
    /**
     * List of matched scholarships with details.
     */
    private List<ScholarshipMatchDto> scholarships;
    
    /**
     * Suggestions for the student to improve their matches.
     */
    private List<String> improvementSuggestions;
}
