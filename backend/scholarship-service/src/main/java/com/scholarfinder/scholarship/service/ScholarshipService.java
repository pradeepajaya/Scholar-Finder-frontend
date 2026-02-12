package com.scholarfinder.scholarship.service;

import com.scholarfinder.scholarship.config.MatchingConfig;
import com.scholarfinder.scholarship.dto.*;
import com.scholarfinder.scholarship.entity.Scholarship;
import com.scholarfinder.scholarship.entity.StudentProfile;
import com.scholarfinder.scholarship.repository.ScholarshipRepository;
import com.scholarfinder.scholarship.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for scholarship operations including finding matches for students.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MatchingService matchingService;
    private final MatchingConfig matchingConfig;

    /**
     * Get all matched scholarships for a student.
     */
    @Transactional(readOnly = true)
    public MatchResponse getMatchesForStudent(MatchRequest request) {
        log.info("Finding scholarship matches for student: {}", request.getStudentUserId());

        // Get student profile
        StudentProfile student = studentProfileRepository.findByUserId(request.getStudentUserId())
            .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + request.getStudentUserId()));

        // Get active scholarships
        List<Scholarship> scholarships = getFilteredScholarships(request);
        log.debug("Found {} active scholarships to analyze", scholarships.size());

        // Calculate matches for each scholarship
        List<ScholarshipMatchDto> matchedScholarships = new ArrayList<>();
        int excellentCount = 0;
        int goodCount = 0;
        int fairCount = 0;

        for (Scholarship scholarship : scholarships) {
            MatchResult matchResult = matchingService.calculateMatch(student, scholarship);
            
            // Filter by minimum match percentage
            if (matchResult.getMatchPercentage().intValue() >= request.getMinimumMatchPercentage()) {
                ScholarshipMatchDto dto = mapToMatchDto(scholarship, matchResult);
                matchedScholarships.add(dto);

                // Count by quality
                switch (matchResult.getMatchQuality()) {
                    case EXCELLENT -> excellentCount++;
                    case GOOD -> goodCount++;
                    case FAIR -> fairCount++;
                    default -> {}
                }
            }
        }

        // Sort results
        sortMatches(matchedScholarships, request.getSortBy());

        // Limit results
        if (request.getLimit() != null && matchedScholarships.size() > request.getLimit()) {
            matchedScholarships = matchedScholarships.subList(0, request.getLimit());
        }

        // Generate improvement suggestions
        List<String> suggestions = generateImprovementSuggestions(student, matchedScholarships);

        return MatchResponse.builder()
            .studentId(student.getUserId())
            .studentName(student.getFullName())
            .totalScholarshipsAnalyzed(scholarships.size())
            .matchesFound(matchedScholarships.size())
            .excellentMatches(excellentCount)
            .goodMatches(goodCount)
            .fairMatches(fairCount)
            .scholarships(matchedScholarships)
            .improvementSuggestions(suggestions)
            .build();
    }

    /**
     * Get match result for a specific student-scholarship pair.
     */
    @Transactional(readOnly = true)
    public MatchResult getMatchDetails(Long studentUserId, Long scholarshipId) {
        StudentProfile student = studentProfileRepository.findByUserId(studentUserId)
            .orElseThrow(() -> new RuntimeException("Student profile not found"));
        
        Scholarship scholarship = scholarshipRepository.findById(scholarshipId)
            .orElseThrow(() -> new RuntimeException("Scholarship not found"));

        return matchingService.calculateMatch(student, scholarship);
    }

    /**
     * Get filtered scholarships based on request criteria.
     */
    private List<Scholarship> getFilteredScholarships(MatchRequest request) {
        LocalDate today = LocalDate.now();
        List<Scholarship> scholarships;

        if (request.getScholarshipIds() != null && !request.getScholarshipIds().isEmpty()) {
            // Get specific scholarships
            scholarships = scholarshipRepository.findAllById(request.getScholarshipIds());
        } else {
            // Get all active scholarships
            scholarships = scholarshipRepository.findActiveScholarships(today);
        }

        // Apply additional filters
        return scholarships.stream()
            .filter(s -> filterByEducationLevel(s, request.getEducationLevel()))
            .filter(s -> filterByCountry(s, request.getCountry()))
            .filter(s -> filterByScholarshipType(s, request.getScholarshipType()))
            .collect(Collectors.toList());
    }

    private boolean filterByEducationLevel(Scholarship s, String level) {
        if (level == null || level.isEmpty()) return true;
        if (s.getEligibleLevels() == null) return true;
        return Arrays.asList(s.getEligibleLevels()).contains(level.toUpperCase());
    }

    private boolean filterByCountry(Scholarship s, String country) {
        if (country == null || country.isEmpty()) return true;
        if (s.getEligibleCountries() == null) return true;
        return Arrays.asList(s.getEligibleCountries()).contains(country);
    }

    private boolean filterByScholarshipType(Scholarship s, String type) {
        if (type == null || type.isEmpty()) return true;
        return type.equalsIgnoreCase(s.getScholarshipType());
    }

    /**
     * Map scholarship and match result to DTO.
     */
    private ScholarshipMatchDto mapToMatchDto(Scholarship scholarship, MatchResult matchResult) {
        List<String> matchedStrings = matchResult.getMatchedCriteria().stream()
            .map(c -> c.getCriterion())
            .collect(Collectors.toList());

        List<String> unmatchedStrings = matchResult.getUnmatchedCriteria().stream()
            .map(c -> c.getCriterion() + (c.getSuggestion() != null ? " - " + c.getSuggestion() : ""))
            .collect(Collectors.toList());

        String amountDisplay = formatAmount(scholarship);
        String deadlineDisplay = formatDeadline(scholarship.getApplicationDeadline());

        return ScholarshipMatchDto.builder()
            .id(scholarship.getId())
            .title(scholarship.getTitle())
            .description(scholarship.getDescription())
            .provider("Institution #" + scholarship.getInstitutionId()) // TODO: Fetch actual institution name
            .country(scholarship.getEligibleCountries() != null && scholarship.getEligibleCountries().length > 0 
                     ? scholarship.getEligibleCountries()[0] : "Multiple")
            .scholarshipType(scholarship.getScholarshipType())
            .amount(scholarship.getAmount())
            .currency(scholarship.getCurrency())
            .amountDisplay(amountDisplay)
            .level(scholarship.getEligibleLevels() != null 
                   ? String.join(", ", scholarship.getEligibleLevels()) : "All levels")
            .applicationDeadline(scholarship.getApplicationDeadline())
            .deadlineDisplay(deadlineDisplay)
            .isFeatured(Boolean.TRUE.equals(scholarship.getIsFeatured()))
            .matchPercentage(matchResult.getMatchPercentage())
            .matchQuality(matchResult.getMatchQuality().name())
            .matchedCriteria(matchedStrings)
            .unmatchedCriteria(unmatchedStrings)
            .isEligible(matchResult.isEligible())
            .build();
    }

    private String formatAmount(Scholarship scholarship) {
        if ("FULL".equalsIgnoreCase(scholarship.getScholarshipType())) {
            return "Fully Funded";
        }
        if (scholarship.getAmount() != null) {
            return scholarship.getCurrency() + " " + scholarship.getAmount().toPlainString();
        }
        if (scholarship.getCoveragePercentage() != null) {
            return scholarship.getCoveragePercentage() + "% Coverage";
        }
        return "Contact for details";
    }

    private String formatDeadline(LocalDate deadline) {
        if (deadline == null) return "No deadline";
        return deadline.toString();
    }

    /**
     * Sort matches based on sort criteria.
     */
    private void sortMatches(List<ScholarshipMatchDto> matches, String sortBy) {
        Comparator<ScholarshipMatchDto> comparator = switch (sortBy) {
            case "MATCH_ASC" -> Comparator.comparing(ScholarshipMatchDto::getMatchPercentage);
            case "DEADLINE_ASC" -> Comparator.comparing(
                s -> s.getApplicationDeadline() != null ? s.getApplicationDeadline() : LocalDate.MAX);
            case "DEADLINE_DESC" -> Comparator.comparing(
                (ScholarshipMatchDto s) -> s.getApplicationDeadline() != null ? s.getApplicationDeadline() : LocalDate.MIN).reversed();
            default -> Comparator.comparing(ScholarshipMatchDto::getMatchPercentage).reversed(); // MATCH_DESC
        };
        matches.sort(comparator);
    }

    /**
     * Generate improvement suggestions based on common unmatched criteria.
     */
    private List<String> generateImprovementSuggestions(StudentProfile student, List<ScholarshipMatchDto> matches) {
        List<String> suggestions = new ArrayList<>();

        // Check English proficiency
        if (student.getEnglishTest() == null || student.getOverallScore() == null) {
            suggestions.add("Take an English proficiency test (IELTS/TOEFL) to unlock more scholarship opportunities");
        }

        // Check profile completion
        if (student.getProfileCompletionPercentage() != null && student.getProfileCompletionPercentage() < 80) {
            suggestions.add("Complete your profile to " + (100 - student.getProfileCompletionPercentage()) + "% more to improve matching accuracy");
        }

        // Check preferred fields
        if (student.getPreferredFields() == null || student.getPreferredFields().length == 0) {
            suggestions.add("Specify your preferred fields of study to find more relevant scholarships");
        }

        // Check financial information
        if (student.getHouseholdIncome() == null) {
            suggestions.add("Add financial information to access need-based scholarships");
        }

        // Limit to top 5 suggestions
        return suggestions.stream().limit(5).collect(Collectors.toList());
    }

    /**
     * Get all active scholarships (for browsing without matching).
     */
    @Transactional(readOnly = true)
    public List<Scholarship> getActiveScholarships() {
        return scholarshipRepository.findActiveScholarships(LocalDate.now());
    }

    /**
     * Get scholarship by ID.
     */
    @Transactional(readOnly = true)
    public Optional<Scholarship> getScholarshipById(Long id) {
        return scholarshipRepository.findById(id);
    }

    /**
     * Get featured scholarships.
     */
    @Transactional(readOnly = true)
    public List<Scholarship> getFeaturedScholarships() {
        return scholarshipRepository.findFeaturedScholarships(LocalDate.now());
    }
}
