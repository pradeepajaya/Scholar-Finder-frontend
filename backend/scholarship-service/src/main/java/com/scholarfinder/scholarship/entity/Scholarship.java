package com.scholarfinder.scholarship.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Scholarship entity representing a scholarship opportunity.
 * Maps to the scholarships.scholarships table.
 */
@Entity
@Table(name = "scholarships", schema = "scholarships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "institution_id", nullable = false)
    private Long institutionId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Scholarship Details
    @Column(name = "scholarship_type")
    private String scholarshipType; // FULL, PARTIAL, TUITION, LIVING_EXPENSES

    @Column(name = "coverage_percentage")
    private Integer coveragePercentage;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    // Eligibility Criteria
    @Column(name = "eligible_countries", columnDefinition = "TEXT[]")
    private String[] eligibleCountries;

    @Column(name = "eligible_fields", columnDefinition = "TEXT[]")
    private String[] eligibleFields;

    @Column(name = "eligible_levels", columnDefinition = "TEXT[]")
    private String[] eligibleLevels; // UNDERGRADUATE, POSTGRADUATE, PHD

    @Column(name = "min_gpa", precision = 3, scale = 2)
    private BigDecimal minGpa;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(name = "required_english_test")
    private String requiredEnglishTest; // IELTS, TOEFL, PTE

    @Column(name = "min_english_score", precision = 5, scale = 2)
    private BigDecimal minEnglishScore;

    // A/L Requirements
    @Column(name = "min_al_passes")
    private Integer minAlPasses;

    @Column(name = "required_al_stream")
    private String requiredAlStream; // SCIENCE, COMMERCE, ARTS, ANY

    @Column(name = "min_z_score", precision = 4, scale = 3)
    private BigDecimal minZScore;

    // Financial Need
    @Column(name = "requires_financial_need")
    @Builder.Default
    private Boolean requiresFinancialNeed = false;

    @Column(name = "max_household_income")
    private String maxHouseholdIncome;

    // Special Categories
    @Column(name = "sports_achievement_required")
    @Builder.Default
    private Boolean sportsAchievementRequired = false;

    @Column(name = "leadership_required")
    @Builder.Default
    private Boolean leadershipRequired = false;

    @Column(name = "first_generation_priority")
    @Builder.Default
    private Boolean firstGenerationPriority = false;

    @Column(name = "disability_friendly")
    @Builder.Default
    private Boolean disabilityFriendly = false;

    // Return Requirement
    @Column(name = "return_to_home_required")
    @Builder.Default
    private Boolean returnToHomeRequired = false;

    // Dates
    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "duration_months")
    private Integer durationMonths;

    // Requirements
    @Column(name = "required_documents", columnDefinition = "TEXT[]")
    private String[] requiredDocuments;

    @Column(name = "additional_requirements", columnDefinition = "TEXT")
    private String additionalRequirements;

    // Status
    @Column(length = 50)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, ACTIVE, CLOSED, EXPIRED

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    // Stats
    @Column(name = "total_applications")
    @Builder.Default
    private Integer totalApplications = 0;

    @Column(name = "views_count")
    @Builder.Default
    private Integer viewsCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
