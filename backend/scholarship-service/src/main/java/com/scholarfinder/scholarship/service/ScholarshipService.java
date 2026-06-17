package com.scholarfinder.scholarship.service;

import com.scholarfinder.scholarship.client.NotificationClient;
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

    private static final String DELETED_STATUS = "DELETED";

    private final ScholarshipRepository scholarshipRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MatchingService matchingService;
    private final NotificationClient notificationClient;

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
            if (matchResult.isEligible()
                    && matchResult.getMatchPercentage().intValue() >= request.getMinimumMatchPercentage()) {
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
        Long safeStudentUserId = requireId(studentUserId, "Student");
        Long safeScholarshipId = requireId(scholarshipId, "Scholarship");
        StudentProfile student = studentProfileRepository.findByUserId(safeStudentUserId)
            .orElseThrow(() -> new RuntimeException("Student profile not found"));
        
        Scholarship scholarship = scholarshipRepository.findById(safeScholarshipId)
            .orElseThrow(() -> new RuntimeException("Scholarship not found"));

        return matchingService.calculateMatch(student, scholarship);
    }

    /**
     * Get filtered scholarships based on request criteria.
     */
    private List<Scholarship> getFilteredScholarships(MatchRequest request) {
        LocalDate today = LocalDate.now();
        List<Scholarship> scholarships;

        List<Long> scholarshipIds = request.getScholarshipIds();
        if (scholarshipIds != null && !scholarshipIds.isEmpty()) {
            // Get specific scholarships
            scholarships = scholarshipRepository.findAllById(requireIds(scholarshipIds));
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
            .provider(resolveProviderName(scholarship))
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
            .applyLink(scholarship.getApplicationUrl())
            .imageUrl(scholarship.getImageUrl())
            .matchPercentage(matchResult.getMatchPercentage())
            .matchQuality(matchResult.getMatchQuality().name())
            .matchedCriteria(matchedStrings)
            .unmatchedCriteria(unmatchedStrings)
            .isEligible(matchResult.isEligible())
            .build();
    }

    private String resolveProviderName(Scholarship scholarship) {
        if (scholarship.getProviderName() != null && !scholarship.getProviderName().isBlank()) {
            return scholarship.getProviderName();
        }
        return "Institution #" + scholarship.getInstitutionId();
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
        Long scholarshipId = requireId(id, "Scholarship");
        return scholarshipRepository.findById(scholarshipId);
    }

    private Long requireId(Long id, String label) {
        if (id == null) {
            throw new IllegalArgumentException(label + " id is required");
        }
        return id;
    }

    private List<Long> requireIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("Scholarship ids are required");
        }
        return ids;
    }

    /**
     * Get all scholarships regardless of status (for admin).
     */
    @Transactional(readOnly = true)
    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll().stream()
            .filter(s -> !DELETED_STATUS.equalsIgnoreCase(s.getStatus()))
            .collect(Collectors.toList());
    }

    /**
     * Update an existing scholarship and notify the institution.
     */
    @Transactional
    public Scholarship updateScholarship(Long id, Scholarship updatedData) {
        Long scholarshipId = requireId(id, "Scholarship");
        Scholarship existing = scholarshipRepository.findById(scholarshipId)
            .orElseThrow(() -> new RuntimeException("Scholarship not found with id: " + scholarshipId));

        // Update fields
        if (updatedData.getTitle() != null) existing.setTitle(updatedData.getTitle());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getScholarshipType() != null) existing.setScholarshipType(updatedData.getScholarshipType());
        if (updatedData.getCoveragePercentage() != null) existing.setCoveragePercentage(updatedData.getCoveragePercentage());
        if (updatedData.getAmount() != null) existing.setAmount(updatedData.getAmount());
        if (updatedData.getCurrency() != null) existing.setCurrency(updatedData.getCurrency());
        if (updatedData.getEligibleCountries() != null) existing.setEligibleCountries(updatedData.getEligibleCountries());
        if (updatedData.getEligibleFields() != null) existing.setEligibleFields(updatedData.getEligibleFields());
        if (updatedData.getEligibleLevels() != null) existing.setEligibleLevels(updatedData.getEligibleLevels());
        if (updatedData.getMinGpa() != null) existing.setMinGpa(updatedData.getMinGpa());
        if (updatedData.getMinAge() != null) existing.setMinAge(updatedData.getMinAge());
        if (updatedData.getMaxAge() != null) existing.setMaxAge(updatedData.getMaxAge());
        if (updatedData.getRequiredEnglishTest() != null) existing.setRequiredEnglishTest(updatedData.getRequiredEnglishTest());
        if (updatedData.getMinEnglishScore() != null) existing.setMinEnglishScore(updatedData.getMinEnglishScore());
        if (updatedData.getMinAlPasses() != null) existing.setMinAlPasses(updatedData.getMinAlPasses());
        if (updatedData.getRequiredAlStream() != null) existing.setRequiredAlStream(updatedData.getRequiredAlStream());
        if (updatedData.getMinZScore() != null) existing.setMinZScore(updatedData.getMinZScore());
        if (updatedData.getApplicationDeadline() != null) existing.setApplicationDeadline(updatedData.getApplicationDeadline());
        if (updatedData.getStartDate() != null) existing.setStartDate(updatedData.getStartDate());
        if (updatedData.getEndDate() != null) existing.setEndDate(updatedData.getEndDate());
        if (updatedData.getDurationMonths() != null) existing.setDurationMonths(updatedData.getDurationMonths());
        if (updatedData.getApplicationUrl() != null) existing.setApplicationUrl(updatedData.getApplicationUrl());
        if (updatedData.getContactEmail() != null) existing.setContactEmail(updatedData.getContactEmail());
        if (updatedData.getContactPhone() != null) existing.setContactPhone(updatedData.getContactPhone());
        if (updatedData.getWebsiteUrl() != null) existing.setWebsiteUrl(updatedData.getWebsiteUrl());
        if (updatedData.getImageUrl() != null) existing.setImageUrl(updatedData.getImageUrl());
        if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
        if (updatedData.getIsFeatured() != null) existing.setIsFeatured(updatedData.getIsFeatured());
        if (updatedData.getProviderName() != null) existing.setProviderName(updatedData.getProviderName());
        if (updatedData.getRequiredDocuments() != null) existing.setRequiredDocuments(updatedData.getRequiredDocuments());
        if (updatedData.getAdditionalRequirements() != null) existing.setAdditionalRequirements(updatedData.getAdditionalRequirements());
        if (updatedData.getBenefits() != null) existing.setBenefits(updatedData.getBenefits());
        if (updatedData.getSelectionCriteria() != null) existing.setSelectionCriteria(updatedData.getSelectionCriteria());
        if (updatedData.getApplicationSteps() != null) existing.setApplicationSteps(updatedData.getApplicationSteps());
        if (updatedData.getRequiresFinancialNeed() != null) existing.setRequiresFinancialNeed(updatedData.getRequiresFinancialNeed());
        if (updatedData.getMaxHouseholdIncome() != null) existing.setMaxHouseholdIncome(updatedData.getMaxHouseholdIncome());
        if (updatedData.getSportsAchievementRequired() != null) existing.setSportsAchievementRequired(updatedData.getSportsAchievementRequired());
        if (updatedData.getLeadershipRequired() != null) existing.setLeadershipRequired(updatedData.getLeadershipRequired());
        if (updatedData.getFirstGenerationPriority() != null) existing.setFirstGenerationPriority(updatedData.getFirstGenerationPriority());
        if (updatedData.getDisabilityFriendly() != null) existing.setDisabilityFriendly(updatedData.getDisabilityFriendly());
        if (updatedData.getReturnToHomeRequired() != null) existing.setReturnToHomeRequired(updatedData.getReturnToHomeRequired());

        Scholarship saved = scholarshipRepository.save(existing);

        // Send alert to institution
        sendInstitutionAlert(saved, "updated");

        return saved;
    }

    /**
     * Delete a scholarship by ID.
     */
    @Transactional
    public void deleteScholarship(Long id) {
        Long scholarshipId = requireId(id, "Scholarship");
        Scholarship existing = scholarshipRepository.findById(scholarshipId)
            .orElseThrow(() -> new RuntimeException("Scholarship not found with id: " + scholarshipId));

        existing.setStatus(DELETED_STATUS);
        Scholarship saved = scholarshipRepository.save(existing);
        sendInstitutionAlert(saved, "deleted");
        log.info("Deleted scholarship: {} (id: {})", saved.getTitle(), scholarshipId);
    }

    /**
     * Send an alert notification to the institution that owns a scholarship.
     */
    private void sendInstitutionAlert(Scholarship scholarship, String action) {
        try {
            String recipientEmail = scholarship.getContactEmail();
            if (recipientEmail == null || recipientEmail.isBlank()) {
                log.warn("No contact email for scholarship {} (institution {}). Skipping alert.",
                    scholarship.getId(), scholarship.getInstitutionId());
                return;
            }

            Map<String, Object> alertRequest = new HashMap<>();
            alertRequest.put("recipientEmail", recipientEmail);
            alertRequest.put("recipientName", scholarship.getProviderName() != null
                ? scholarship.getProviderName() : "Institution");
            alertRequest.put("subject",
                "[Scholar Finder] Your scholarship \"" + scholarship.getTitle() + "\" has been " + action + " by Admin");
            alertRequest.put("message", String.format(
                "Dear %s,\n\n" +
                "This is to inform you that your scholarship \"%s\" (ID: %d) has been %s by a Scholar Finder administrator.\n\n" +
                "Please log in to your institution dashboard to review the changes.\n\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\nScholar Finder Admin Team",
                scholarship.getProviderName() != null ? scholarship.getProviderName() : "Institution",
                scholarship.getTitle(),
                scholarship.getId(),
                action
            ));
            alertRequest.put("notificationType", "deleted".equals(action)
                ? "SCHOLARSHIP_DELETED_BY_ADMIN"
                : "SCHOLARSHIP_UPDATED_BY_ADMIN");
            alertRequest.put("referenceId", scholarship.getId());
            alertRequest.put("referenceType", "SCHOLARSHIP");

            notificationClient.sendAlert(alertRequest);
            log.info("Alert sent to institution for scholarship: {}", scholarship.getTitle());
        } catch (Exception e) {
            // Don't fail the update if the alert fails
            log.error("Failed to send institution alert for scholarship {}: {}", scholarship.getId(), e.getMessage());
        }
    }

    /**
     * Get featured scholarships.
     */
    @Transactional(readOnly = true)
    public List<Scholarship> getFeaturedScholarships() {
        return scholarshipRepository.findFeaturedScholarships(LocalDate.now());
    }
}
