package com.scholarfinder.scholarship.service;

import com.scholarfinder.scholarship.config.MatchingConfig;
import com.scholarfinder.scholarship.dto.MatchResult;
import com.scholarfinder.scholarship.dto.MatchResult.*;
import com.scholarfinder.scholarship.entity.Scholarship;
import com.scholarfinder.scholarship.entity.StudentProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Rule-based matching service that calculates match scores between students and scholarships.
 * 
 * The algorithm evaluates multiple criteria categories:
 * 1. Education Level (20%) - Does the student's intended level match?
 * 2. Academic Performance (15%) - GPA, Z-score, A/L results
 * 3. English Proficiency (15%) - IELTS/TOEFL/PTE scores
 * 4. Age (10%) - Is student within age requirements?
 * 5. Nationality (10%) - Is student from eligible country?
 * 6. Financial Need (10%) - Does student meet financial criteria?
 * 7. Field of Study (10%) - Does preferred field match?
 * 8. Special Categories (10%) - Sports, leadership, first-generation, disability
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final MatchingConfig config;

    // Income level mapping for comparison
    private static final Map<String, Integer> INCOME_LEVELS = Map.of(
        "Below LKR 30,000", 1,
        "LKR 30,000 - 50,000", 2,
        "LKR 50,000 - 75,000", 3,
        "LKR 75,000 - 100,000", 4,
        "LKR 100,000 - 150,000", 5,
        "LKR 150,000 - 200,000", 6,
        "Above LKR 200,000", 7
    );

    /**
     * Calculate match result between a student and a scholarship.
     */
    public MatchResult calculateMatch(StudentProfile student, Scholarship scholarship) {
        log.debug("Calculating match for student {} with scholarship {}", 
                  student.getUserId(), scholarship.getId());

        List<MatchedCriterion> matchedCriteria = new ArrayList<>();
        List<UnmatchedCriterion> unmatchedCriteria = new ArrayList<>();
        
        // Calculate scores for each category
        CategoryScore educationScore = evaluateEducationLevel(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore academicScore = evaluateAcademicPerformance(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore englishScore = evaluateEnglishProficiency(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore ageScore = evaluateAge(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore nationalityScore = evaluateNationality(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore financialScore = evaluateFinancialNeed(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore fieldScore = evaluateFieldOfStudy(student, scholarship, matchedCriteria, unmatchedCriteria);
        CategoryScore specialScore = evaluateSpecialCategories(student, scholarship, matchedCriteria, unmatchedCriteria);
        
        // Calculate total score
        int totalEarned = educationScore.getEarned() + academicScore.getEarned() + 
                          englishScore.getEarned() + ageScore.getEarned() +
                          nationalityScore.getEarned() + financialScore.getEarned() +
                          fieldScore.getEarned() + specialScore.getEarned();
        
        int totalMax = config.getWeights().getTotal();
        
        BigDecimal matchPercentage = BigDecimal.valueOf(totalEarned)
            .divide(BigDecimal.valueOf(totalMax), 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .setScale(2, RoundingMode.HALF_UP);

        // Determine match quality
        MatchQuality quality = determineMatchQuality(matchPercentage);
        
        // Check eligibility (must meet mandatory criteria)
        EligibilityResult eligibility = checkEligibility(student, scholarship, unmatchedCriteria);

        // Build breakdown
        MatchBreakdown breakdown = MatchBreakdown.builder()
            .educationLevel(educationScore)
            .academicPerformance(academicScore)
            .englishProficiency(englishScore)
            .age(ageScore)
            .nationality(nationalityScore)
            .financialNeed(financialScore)
            .fieldOfStudy(fieldScore)
            .specialCategories(specialScore)
            .build();

        return MatchResult.builder()
            .scholarshipId(scholarship.getId())
            .studentId(student.getUserId())
            .matchPercentage(matchPercentage)
            .matchQuality(quality)
            .matchedCriteria(matchedCriteria)
            .unmatchedCriteria(unmatchedCriteria)
            .breakdown(breakdown)
            .eligible(eligibility.isEligible())
            .ineligibilityReason(eligibility.getReason())
            .build();
    }

    /**
     * Evaluate education level match (20 points).
     */
    private CategoryScore evaluateEducationLevel(StudentProfile student, Scholarship scholarship,
                                                  List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getEducationLevel();
        int earnedPoints = 0;
        String category = "Education Level";

        String studentLevel = student.getIntendedLevel();
        String[] eligibleLevels = scholarship.getEligibleLevels();

        if (eligibleLevels != null && studentLevel != null) {
            boolean levelMatches = Arrays.asList(eligibleLevels).contains(studentLevel.toUpperCase());
            
            if (levelMatches) {
                earnedPoints = maxPoints;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Education level matches")
                    .studentValue(studentLevel)
                    .requiredValue(String.join(", ", eligibleLevels))
                    .pointsEarned(earnedPoints)
                    .maxPoints(maxPoints)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Education level does not match")
                    .studentValue(studentLevel)
                    .requiredValue(String.join(", ", eligibleLevels))
                    .pointsMissed(maxPoints)
                    .mandatory(true)
                    .suggestion("This scholarship is for " + String.join(" or ", eligibleLevels) + " students")
                    .build());
            }
        } else {
            // If no level requirement, give full points
            earnedPoints = maxPoints;
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate academic performance (15 points).
     * Considers: GPA/A-L grades, Z-score, O/L results
     */
    private CategoryScore evaluateAcademicPerformance(StudentProfile student, Scholarship scholarship,
                                                       List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getAcademicPerformance();
        int earnedPoints = 0;
        String category = "Academic Performance";

        // Check GPA (5 points)
        BigDecimal studentGpa = student.getCalculatedGpa();
        BigDecimal requiredGpa = scholarship.getMinGpa();
        
        if (requiredGpa != null && studentGpa != null) {
            if (studentGpa.compareTo(requiredGpa) >= 0) {
                earnedPoints += 5;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("GPA requirement met")
                    .studentValue(studentGpa.toString())
                    .requiredValue("Minimum " + requiredGpa.toString())
                    .pointsEarned(5)
                    .maxPoints(5)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("GPA below requirement")
                    .studentValue(studentGpa.toString())
                    .requiredValue("Minimum " + requiredGpa.toString())
                    .pointsMissed(5)
                    .mandatory(false)
                    .suggestion("Improve academic grades to meet minimum GPA of " + requiredGpa)
                    .build());
            }
        } else {
            earnedPoints += 5; // No GPA requirement
        }

        // Check Z-score (5 points)
        BigDecimal studentZScore = student.getZScore();
        BigDecimal requiredZScore = scholarship.getMinZScore();
        
        if (requiredZScore != null && studentZScore != null) {
            if (studentZScore.compareTo(requiredZScore) >= 0) {
                earnedPoints += 5;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Z-score requirement met")
                    .studentValue(studentZScore.toString())
                    .requiredValue("Minimum " + requiredZScore.toString())
                    .pointsEarned(5)
                    .maxPoints(5)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Z-score below requirement")
                    .studentValue(studentZScore.toString())
                    .requiredValue("Minimum " + requiredZScore.toString())
                    .pointsMissed(5)
                    .mandatory(false)
                    .suggestion("Z-score requirement not met")
                    .build());
            }
        } else {
            earnedPoints += 5; // No Z-score requirement
        }

        // Check A/L stream (5 points)
        String studentStream = student.getAlStream();
        String requiredStream = scholarship.getRequiredAlStream();
        
        if (requiredStream != null && !"ANY".equalsIgnoreCase(requiredStream) && studentStream != null) {
            if (requiredStream.equalsIgnoreCase(studentStream)) {
                earnedPoints += 5;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("A/L stream matches")
                    .studentValue(studentStream)
                    .requiredValue(requiredStream)
                    .pointsEarned(5)
                    .maxPoints(5)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("A/L stream does not match")
                    .studentValue(studentStream)
                    .requiredValue(requiredStream)
                    .pointsMissed(5)
                    .mandatory(false)
                    .suggestion("This scholarship prefers " + requiredStream + " stream students")
                    .build());
            }
        } else {
            earnedPoints += 5; // No stream requirement
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate English proficiency (15 points).
     */
    private CategoryScore evaluateEnglishProficiency(StudentProfile student, Scholarship scholarship,
                                                      List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getEnglishProficiency();
        int earnedPoints = 0;
        String category = "English Proficiency";

        String requiredTest = scholarship.getRequiredEnglishTest();
        BigDecimal requiredScore = scholarship.getMinEnglishScore();
        
        String studentTest = student.getEnglishTest();
        BigDecimal studentScore = student.getEnglishScoreAsNumber();

        if (requiredTest != null && requiredScore != null) {
            if (studentTest != null && studentScore != null) {
                // Check if test type matches (or is equivalent)
                boolean testMatches = requiredTest.equalsIgnoreCase(studentTest) ||
                                     isEquivalentEnglishTest(studentTest, requiredTest);
                
                if (testMatches) {
                    // Convert scores if needed and compare
                    BigDecimal normalizedStudentScore = normalizeEnglishScore(studentScore, studentTest, requiredTest);
                    
                    if (normalizedStudentScore.compareTo(requiredScore) >= 0) {
                        earnedPoints = maxPoints;
                        matched.add(MatchedCriterion.builder()
                            .category(category)
                            .criterion("English proficiency met")
                            .studentValue(studentTest + " " + studentScore)
                            .requiredValue(requiredTest + " " + requiredScore)
                            .pointsEarned(maxPoints)
                            .maxPoints(maxPoints)
                            .build());
                    } else {
                        // Partial credit for having the test
                        earnedPoints = maxPoints / 2;
                        unmatched.add(UnmatchedCriterion.builder()
                            .category(category)
                            .criterion("English score below requirement")
                            .studentValue(studentTest + " " + studentScore)
                            .requiredValue(requiredTest + " " + requiredScore + " or higher")
                            .pointsMissed(maxPoints - earnedPoints)
                            .mandatory(false)
                            .suggestion("Retake " + requiredTest + " to achieve score of " + requiredScore)
                            .build());
                    }
                } else {
                    // Wrong test type
                    earnedPoints = maxPoints / 3;
                    unmatched.add(UnmatchedCriterion.builder()
                        .category(category)
                        .criterion("Different English test taken")
                        .studentValue(studentTest)
                        .requiredValue(requiredTest + " required")
                        .pointsMissed(maxPoints - earnedPoints)
                        .mandatory(false)
                        .suggestion("Take " + requiredTest + " test with minimum score of " + requiredScore)
                        .build());
                }
            } else {
                // No English test taken
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("English proficiency test not provided")
                    .studentValue("Not available")
                    .requiredValue(requiredTest + " " + requiredScore)
                    .pointsMissed(maxPoints)
                    .mandatory(true)
                    .suggestion("Take " + requiredTest + " test and achieve score of " + requiredScore + " or higher")
                    .build());
            }
        } else {
            // No English requirement
            earnedPoints = maxPoints;
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate age requirement (10 points).
     */
    private CategoryScore evaluateAge(StudentProfile student, Scholarship scholarship,
                                       List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getAge();
        int earnedPoints = 0;
        String category = "Age";

        Integer studentAge = student.getAge();
        Integer minAge = scholarship.getMinAge();
        Integer maxAge = scholarship.getMaxAge();

        if (studentAge != null) {
            boolean ageValid = true;
            String requirement = "";
            
            if (minAge != null && studentAge < minAge) {
                ageValid = false;
                requirement = "Minimum age " + minAge;
            }
            if (maxAge != null && studentAge > maxAge) {
                ageValid = false;
                requirement = "Maximum age " + maxAge;
            }
            
            if (ageValid) {
                earnedPoints = maxPoints;
                String ageRange = (minAge != null ? minAge + "" : "No min") + " - " + 
                                  (maxAge != null ? maxAge + "" : "No max");
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Age requirement met")
                    .studentValue(studentAge + " years old")
                    .requiredValue(ageRange)
                    .pointsEarned(maxPoints)
                    .maxPoints(maxPoints)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Age outside required range")
                    .studentValue(studentAge + " years old")
                    .requiredValue(requirement)
                    .pointsMissed(maxPoints)
                    .mandatory(true)
                    .suggestion("Age requirement cannot be changed")
                    .build());
            }
        } else {
            // No age info, give partial credit
            earnedPoints = maxPoints / 2;
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate nationality (10 points).
     */
    private CategoryScore evaluateNationality(StudentProfile student, Scholarship scholarship,
                                               List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getNationality();
        int earnedPoints = 0;
        String category = "Nationality";

        String studentNationality = student.getNationality();
        String[] eligibleCountries = scholarship.getEligibleCountries();

        if (eligibleCountries != null && eligibleCountries.length > 0 && studentNationality != null) {
            boolean isEligible = Arrays.stream(eligibleCountries)
                .anyMatch(country -> country.equalsIgnoreCase(studentNationality) ||
                                    country.equalsIgnoreCase("Sri Lanka") && studentNationality.contains("Sri Lankan"));
            
            if (isEligible) {
                earnedPoints = maxPoints;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Nationality eligible")
                    .studentValue(studentNationality)
                    .requiredValue(String.join(", ", eligibleCountries))
                    .pointsEarned(maxPoints)
                    .maxPoints(maxPoints)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Nationality not in eligible list")
                    .studentValue(studentNationality)
                    .requiredValue(String.join(", ", eligibleCountries))
                    .pointsMissed(maxPoints)
                    .mandatory(true)
                    .suggestion("This scholarship is only for citizens of " + String.join(", ", eligibleCountries))
                    .build());
            }
        } else {
            // No nationality restriction
            earnedPoints = maxPoints;
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate financial need (10 points).
     */
    private CategoryScore evaluateFinancialNeed(StudentProfile student, Scholarship scholarship,
                                                 List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getFinancialNeed();
        int earnedPoints = 0;
        String category = "Financial Need";

        Boolean requiresFinancialNeed = scholarship.getRequiresFinancialNeed();
        String maxIncome = scholarship.getMaxHouseholdIncome();

        if (Boolean.TRUE.equals(requiresFinancialNeed)) {
            String studentIncome = student.getHouseholdIncome();
            
            if (studentIncome != null && maxIncome != null) {
                int studentIncomeLevel = INCOME_LEVELS.getOrDefault(studentIncome, 5);
                int maxIncomeLevel = INCOME_LEVELS.getOrDefault(maxIncome, 5);
                
                if (studentIncomeLevel <= maxIncomeLevel) {
                    earnedPoints = maxPoints;
                    matched.add(MatchedCriterion.builder()
                        .category(category)
                        .criterion("Financial need criteria met")
                        .studentValue(studentIncome)
                        .requiredValue("Maximum " + maxIncome)
                        .pointsEarned(maxPoints)
                        .maxPoints(maxPoints)
                        .build());
                } else {
                    unmatched.add(UnmatchedCriterion.builder()
                        .category(category)
                        .criterion("Income above threshold")
                        .studentValue(studentIncome)
                        .requiredValue("Maximum " + maxIncome)
                        .pointsMissed(maxPoints)
                        .mandatory(false)
                        .suggestion("This scholarship prioritizes students from lower income backgrounds")
                        .build());
                }
            } else if (studentIncome != null) {
                // Has financial info but no specific requirement
                earnedPoints = maxPoints / 2;
            }
        } else {
            // No financial need requirement
            earnedPoints = maxPoints;
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate field of study match (10 points).
     */
    private CategoryScore evaluateFieldOfStudy(StudentProfile student, Scholarship scholarship,
                                                List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getFieldOfStudy();
        int earnedPoints = 0;
        String category = "Field of Study";

        String[] eligibleFields = scholarship.getEligibleFields();
        String[] studentFields = student.getPreferredFields();

        if (eligibleFields != null && eligibleFields.length > 0) {
            if (studentFields != null && studentFields.length > 0) {
                // Check for any matching field
                boolean hasMatch = Arrays.stream(studentFields)
                    .anyMatch(sf -> Arrays.stream(eligibleFields)
                        .anyMatch(ef -> ef.equalsIgnoreCase(sf) || 
                                       ef.toLowerCase().contains(sf.toLowerCase()) ||
                                       sf.toLowerCase().contains(ef.toLowerCase())));
                
                if (hasMatch) {
                    earnedPoints = maxPoints;
                    matched.add(MatchedCriterion.builder()
                        .category(category)
                        .criterion("Field of study matches")
                        .studentValue(String.join(", ", studentFields))
                        .requiredValue(String.join(", ", eligibleFields))
                        .pointsEarned(maxPoints)
                        .maxPoints(maxPoints)
                        .build());
                } else {
                    unmatched.add(UnmatchedCriterion.builder()
                        .category(category)
                        .criterion("Field of study does not match")
                        .studentValue(String.join(", ", studentFields))
                        .requiredValue(String.join(", ", eligibleFields))
                        .pointsMissed(maxPoints)
                        .mandatory(false)
                        .suggestion("This scholarship is for " + String.join(", ", eligibleFields) + " fields")
                        .build());
                }
            } else {
                // Student hasn't specified preferred fields
                earnedPoints = maxPoints / 2;
            }
        } else {
            // No field restriction
            earnedPoints = maxPoints;
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Evaluate special categories (10 points).
     * Sports, leadership, first-generation, disability-friendly
     */
    private CategoryScore evaluateSpecialCategories(StudentProfile student, Scholarship scholarship,
                                                     List<MatchedCriterion> matched, List<UnmatchedCriterion> unmatched) {
        int maxPoints = config.getWeights().getSpecialCategories();
        int earnedPoints = 0;
        String category = "Special Categories";
        int criteriaCount = 0;
        int matchedCount = 0;

        // Sports achievement
        if (Boolean.TRUE.equals(scholarship.getSportsAchievementRequired())) {
            criteriaCount++;
            if ("Yes".equalsIgnoreCase(student.getSports())) {
                matchedCount++;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Sports achievement")
                    .studentValue("Yes")
                    .requiredValue("Sports achievement required")
                    .pointsEarned(maxPoints / 4)
                    .maxPoints(maxPoints / 4)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Sports achievement not indicated")
                    .studentValue("No")
                    .requiredValue("Sports achievement preferred")
                    .pointsMissed(maxPoints / 4)
                    .mandatory(false)
                    .suggestion("Highlight any sports achievements in your profile")
                    .build());
            }
        }

        // Leadership
        if (Boolean.TRUE.equals(scholarship.getLeadershipRequired())) {
            criteriaCount++;
            if ("Yes".equalsIgnoreCase(student.getLeadership())) {
                matchedCount++;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Leadership experience")
                    .studentValue("Yes")
                    .requiredValue("Leadership experience required")
                    .pointsEarned(maxPoints / 4)
                    .maxPoints(maxPoints / 4)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Leadership experience not indicated")
                    .studentValue("No")
                    .requiredValue("Leadership experience preferred")
                    .pointsMissed(maxPoints / 4)
                    .mandatory(false)
                    .suggestion("Highlight any leadership roles in your profile")
                    .build());
            }
        }

        // First generation priority
        if (Boolean.TRUE.equals(scholarship.getFirstGenerationPriority())) {
            criteriaCount++;
            if ("Yes".equalsIgnoreCase(student.getFirstGeneration())) {
                matchedCount++;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("First-generation student")
                    .studentValue("Yes")
                    .requiredValue("First-generation students prioritized")
                    .pointsEarned(maxPoints / 4)
                    .maxPoints(maxPoints / 4)
                    .build());
            }
        }

        // Disability friendly
        if (Boolean.TRUE.equals(scholarship.getDisabilityFriendly()) && 
            "Yes".equalsIgnoreCase(student.getDisability())) {
            matchedCount++;
            matched.add(MatchedCriterion.builder()
                .category(category)
                .criterion("Disability-friendly scholarship")
                .studentValue("Yes")
                .requiredValue("Disability support available")
                .pointsEarned(maxPoints / 4)
                .maxPoints(maxPoints / 4)
                .build());
        }

        // Return requirement
        if (Boolean.TRUE.equals(scholarship.getReturnToHomeRequired())) {
            criteriaCount++;
            if ("Yes".equalsIgnoreCase(student.getWillingToReturn())) {
                matchedCount++;
                matched.add(MatchedCriterion.builder()
                    .category(category)
                    .criterion("Willing to return to home country")
                    .studentValue("Yes")
                    .requiredValue("Must return after studies")
                    .pointsEarned(maxPoints / 4)
                    .maxPoints(maxPoints / 4)
                    .build());
            } else {
                unmatched.add(UnmatchedCriterion.builder()
                    .category(category)
                    .criterion("Return requirement")
                    .studentValue("Not specified")
                    .requiredValue("Must return to home country after studies")
                    .pointsMissed(maxPoints / 4)
                    .mandatory(true)
                    .suggestion("This scholarship requires returning to your home country")
                    .build());
            }
        }

        // Calculate earned points
        if (criteriaCount > 0) {
            earnedPoints = (matchedCount * maxPoints) / Math.max(criteriaCount, 4);
        } else {
            earnedPoints = maxPoints; // No special requirements
        }

        return buildCategoryScore(category, earnedPoints, maxPoints);
    }

    /**
     * Determine match quality based on percentage.
     */
    private MatchQuality determineMatchQuality(BigDecimal percentage) {
        int pct = percentage.intValue();
        if (pct >= config.getThresholds().getExcellentMatch()) {
            return MatchQuality.EXCELLENT;
        } else if (pct >= config.getThresholds().getGoodMatch()) {
            return MatchQuality.GOOD;
        } else if (pct >= config.getThresholds().getMinimumMatchPercentage()) {
            return MatchQuality.FAIR;
        }
        return MatchQuality.POOR;
    }

    /**
     * Check if student is eligible (meets all mandatory criteria).
     */
    private EligibilityResult checkEligibility(StudentProfile student, Scholarship scholarship,
                                                List<UnmatchedCriterion> unmatchedCriteria) {
        // Check for mandatory unmatched criteria
        Optional<UnmatchedCriterion> mandatory = unmatchedCriteria.stream()
            .filter(UnmatchedCriterion::isMandatory)
            .findFirst();
        
        if (mandatory.isPresent()) {
            return new EligibilityResult(false, mandatory.get().getCriterion());
        }
        
        return new EligibilityResult(true, null);
    }

    /**
     * Check if two English tests are equivalent.
     */
    private boolean isEquivalentEnglishTest(String test1, String test2) {
        // IELTS, TOEFL, and PTE are generally accepted equivalents
        Set<String> acceptableTests = Set.of("IELTS", "TOEFL", "PTE", "TOEFL IBT", "TOEFL ITP");
        return acceptableTests.contains(test1.toUpperCase()) && 
               acceptableTests.contains(test2.toUpperCase());
    }

    /**
     * Normalize English score for comparison.
     */
    private BigDecimal normalizeEnglishScore(BigDecimal score, String fromTest, String toTest) {
        // Simplified conversion - in production, use proper conversion tables
        if (fromTest.equalsIgnoreCase(toTest)) {
            return score;
        }
        
        // IELTS is 0-9, TOEFL is 0-120, PTE is 10-90
        // This is a simplified approximation
        if ("IELTS".equalsIgnoreCase(fromTest) && "TOEFL".equalsIgnoreCase(toTest)) {
            // IELTS 7.0 ≈ TOEFL 94
            return score.multiply(BigDecimal.valueOf(13.4));
        }
        if ("TOEFL".equalsIgnoreCase(fromTest) && "IELTS".equalsIgnoreCase(toTest)) {
            return score.divide(BigDecimal.valueOf(13.4), 1, RoundingMode.HALF_UP);
        }
        
        return score;
    }

    /**
     * Build category score object.
     */
    private CategoryScore buildCategoryScore(String category, int earned, int maximum) {
        BigDecimal percentage = maximum > 0 
            ? BigDecimal.valueOf(earned).divide(BigDecimal.valueOf(maximum), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;
        
        return CategoryScore.builder()
            .category(category)
            .earned(earned)
            .maximum(maximum)
            .percentage(percentage)
            .build();
    }

    /**
     * Helper class for eligibility result.
     */
    private record EligibilityResult(boolean isEligible, String reason) {}
}
