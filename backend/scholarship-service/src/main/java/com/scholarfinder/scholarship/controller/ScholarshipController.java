package com.scholarfinder.scholarship.controller;

import com.scholarfinder.scholarship.dto.*;
import com.scholarfinder.scholarship.entity.Scholarship;
import com.scholarfinder.scholarship.service.ScholarshipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for scholarship matching operations.
 */
@RestController
@RequestMapping("/api/scholarships")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    /**
     * Get matched scholarships for a student.
     * 
     * POST /api/scholarships/matches
     * Body: MatchRequest
     */
    @PostMapping("/matches")
    public ResponseEntity<ApiResponse<MatchResponse>> getMatches(@RequestBody MatchRequest request) {
        log.info("Getting scholarship matches for student: {}", request.getStudentUserId());
        
        try {
            MatchResponse matches = scholarshipService.getMatchesForStudent(request);
            return ResponseEntity.ok(ApiResponse.success(matches, "Matches retrieved successfully"));
        } catch (Exception e) {
            log.error("Error getting matches: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to get matches: " + e.getMessage()));
        }
    }

    /**
     * Get matches for a student by user ID (simplified endpoint).
     * 
     * GET /api/scholarships/matches/{studentUserId}
     */
    @GetMapping("/matches/{studentUserId}")
    public ResponseEntity<ApiResponse<MatchResponse>> getMatchesByUserId(
            @PathVariable Long studentUserId,
            @RequestParam(defaultValue = "0") Integer minMatch,
            @RequestParam(defaultValue = "50") Integer limit,
            @RequestParam(defaultValue = "MATCH_DESC") String sortBy) {
        
        MatchRequest request = MatchRequest.builder()
            .studentUserId(studentUserId)
            .minimumMatchPercentage(minMatch)
            .limit(limit)
            .sortBy(sortBy)
            .build();
        
        return getMatches(request);
    }

    /**
     * Get detailed match result for a specific student-scholarship pair.
     * 
     * GET /api/scholarships/{scholarshipId}/match/{studentUserId}
     */
    @GetMapping("/{scholarshipId}/match/{studentUserId}")
    public ResponseEntity<ApiResponse<MatchResult>> getMatchDetails(
            @PathVariable Long scholarshipId,
            @PathVariable Long studentUserId) {
        
        log.info("Getting match details for student {} and scholarship {}", studentUserId, scholarshipId);
        
        try {
            MatchResult result = scholarshipService.getMatchDetails(studentUserId, scholarshipId);
            return ResponseEntity.ok(ApiResponse.success(result, "Match details retrieved"));
        } catch (Exception e) {
            log.error("Error getting match details: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to get match details: " + e.getMessage()));
        }
    }

    /**
     * Get all active scholarships.
     * 
     * GET /api/scholarships
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Scholarship>>> getActiveScholarships() {
        List<Scholarship> scholarships = scholarshipService.getActiveScholarships();
        return ResponseEntity.ok(ApiResponse.success(scholarships, "Scholarships retrieved"));
    }

    /**
     * Get scholarship by ID.
     * 
     * GET /api/scholarships/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Scholarship>> getScholarship(@PathVariable Long id) {
        return scholarshipService.getScholarshipById(id)
            .map(s -> ResponseEntity.ok(ApiResponse.success(s, "Scholarship found")))
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get featured scholarships.
     * 
     * GET /api/scholarships/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Scholarship>>> getFeaturedScholarships() {
        List<Scholarship> scholarships = scholarshipService.getFeaturedScholarships();
        return ResponseEntity.ok(ApiResponse.success(scholarships, "Featured scholarships retrieved"));
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "scholarship-service"
        ));
    }
}
