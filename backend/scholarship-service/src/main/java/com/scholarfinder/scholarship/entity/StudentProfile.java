package com.scholarfinder.scholarship.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * StudentProfile entity for matching purposes.
 * This is a read-only view of the student profiles from users schema.
 */
@Entity
@Table(name = "student_profiles", schema = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    @Builder.Default
    private String nationality = "Sri Lankan";

    @Column(name = "nic_passport")
    private String nicPassport;

    private String district;
    private String province;
    private String city;
    private String mobile;

    @Column(name = "preferred_language")
    @Builder.Default
    private String preferredLanguage = "English";

    // Academic Information
    @Column(name = "highest_education")
    private String highestEducation;

    @Column(name = "current_status")
    private String currentStatus;

    @Column(name = "intended_level")
    private String intendedLevel; // UNDERGRADUATE, POSTGRADUATE, PHD

    @Column(name = "intended_year")
    private String intendedYear;

    @Column(name = "preferred_mode")
    private String preferredMode;

    @Column(name = "preferred_location")
    private String preferredLocation;

    // O/L Results
    @Column(name = "ol_year")
    private String olYear;

    @Column(name = "ol_type")
    private String olType;

    @Column(name = "ol_medium")
    private String olMedium;

    @Column(name = "ol_passed")
    private Integer olPassed;

    @Column(name = "ol_a_count")
    private Integer olACount;

    @Column(name = "ol_b_count")
    private Integer olBCount;

    @Column(name = "ol_c_count")
    private Integer olCCount;

    @Column(name = "maths_grade")
    private String mathsGrade;

    @Column(name = "science_grade")
    private String scienceGrade;

    @Column(name = "english_grade")
    private String englishGrade;

    // A/L Results
    @Column(name = "al_year")
    private String alYear;

    @Column(name = "al_stream")
    private String alStream; // SCIENCE, COMMERCE, ARTS

    @Column(name = "al_medium")
    private String alMedium;

    private String subject1;
    private String grade1;
    private String subject2;
    private String grade2;
    private String subject3;
    private String grade3;

    @Column(name = "z_score", precision = 4, scale = 3)
    private BigDecimal zScore;

    // English Proficiency
    @Column(name = "english_test")
    private String englishTest; // IELTS, TOEFL, PTE

    @Column(name = "overall_score")
    private String overallScore;

    @Column(name = "exam_year")
    private String examYear;

    // Financial Information
    @Column(name = "household_income")
    private String householdIncome;

    private Integer dependents;

    @Column(name = "employment_status")
    private String employmentStatus;

    @Column(name = "government_assistance")
    private String governmentAssistance;

    // Background Information
    private String background;
    private String disability;
    private String sports;
    private String leadership;

    @Column(name = "first_generation")
    private String firstGeneration;

    // Preferences
    @Column(name = "preferred_countries", columnDefinition = "TEXT[]")
    private String[] preferredCountries;

    @Column(name = "preferred_fields", columnDefinition = "TEXT[]")
    private String[] preferredFields;

    @Column(name = "scholarship_type")
    private String scholarshipType;

    @Column(name = "willing_to_return")
    private String willingToReturn;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "profile_completion_percentage")
    @Builder.Default
    private Integer profileCompletionPercentage = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Calculate student's age based on date of birth.
     */
    public Integer getAge() {
        if (dateOfBirth == null) {
            return null;
        }
        return java.time.Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /**
     * Calculate GPA equivalent from A/L results.
     * A=4.0, B=3.0, C=2.0, S=1.0
     */
    public BigDecimal getCalculatedGpa() {
        double total = 0;
        int count = 0;
        
        total += gradeToPoints(grade1);
        if (grade1 != null) count++;
        
        total += gradeToPoints(grade2);
        if (grade2 != null) count++;
        
        total += gradeToPoints(grade3);
        if (grade3 != null) count++;
        
        if (count == 0) return null;
        return BigDecimal.valueOf(total / count);
    }

    private double gradeToPoints(String grade) {
        if (grade == null) return 0;
        return switch (grade.toUpperCase()) {
            case "A" -> 4.0;
            case "B" -> 3.0;
            case "C" -> 2.0;
            case "S" -> 1.0;
            default -> 0;
        };
    }

    /**
     * Count A/L passes (A, B, C, or S grades).
     */
    public int getAlPassCount() {
        int count = 0;
        if (isPass(grade1)) count++;
        if (isPass(grade2)) count++;
        if (isPass(grade3)) count++;
        return count;
    }

    private boolean isPass(String grade) {
        if (grade == null) return false;
        return switch (grade.toUpperCase()) {
            case "A", "B", "C", "S" -> true;
            default -> false;
        };
    }

    /**
     * Parse English score as a number.
     */
    public BigDecimal getEnglishScoreAsNumber() {
        if (overallScore == null || overallScore.isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(overallScore);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
