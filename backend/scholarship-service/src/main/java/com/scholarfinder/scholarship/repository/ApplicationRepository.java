package com.scholarfinder.scholarship.repository;

import com.scholarfinder.scholarship.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /**
     * Find applications by student.
     */
    List<Application> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    /**
     * Find applications by scholarship.
     */
    List<Application> findByScholarshipIdOrderByMatchScoreDesc(Long scholarshipId);

    /**
     * Find application by student and scholarship.
     */
    Optional<Application> findByStudentIdAndScholarshipId(Long studentId, Long scholarshipId);

    /**
     * Check if student has already applied.
     */
    boolean existsByStudentIdAndScholarshipId(Long studentId, Long scholarshipId);

    /**
     * Find applications by status.
     */
    List<Application> findByScholarshipIdAndStatus(Long scholarshipId, String status);

    /**
     * Count applications for a scholarship.
     */
    long countByScholarshipId(Long scholarshipId);

    /**
     * Count applications submitted by a student.
     */
    long countByStudentId(Long studentId);

    /**
     * Get top candidates by match score.
     */
    @Query("SELECT a FROM Application a WHERE a.scholarshipId = :scholarshipId ORDER BY a.matchScore DESC")
    List<Application> findTopCandidates(@Param("scholarshipId") Long scholarshipId);

    /**
     * Find applications by institution ID (through the associated scholarship)
     */
    @Query("SELECT a FROM Application a JOIN Scholarship s ON a.scholarshipId = s.id WHERE s.institutionId = :institutionId ORDER BY a.createdAt DESC")
    List<Application> findByInstitutionId(@Param("institutionId") Long institutionId);
}
