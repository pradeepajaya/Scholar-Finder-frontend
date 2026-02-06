package com.scholarfinder.scholarship.repository;

import com.scholarfinder.scholarship.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {

    /**
     * Find all active scholarships with deadline in the future.
     */
    @Query("SELECT s FROM Scholarship s WHERE s.status = 'ACTIVE' AND s.applicationDeadline >= :today ORDER BY s.applicationDeadline ASC")
    List<Scholarship> findActiveScholarships(@Param("today") LocalDate today);

    /**
     * Find scholarships by institution.
     */
    List<Scholarship> findByInstitutionIdAndStatus(Long institutionId, String status);

    /**
     * Find scholarships matching education level.
     */
    @Query("SELECT s FROM Scholarship s WHERE s.status = 'ACTIVE' AND :level = ANY(s.eligibleLevels) AND s.applicationDeadline >= :today")
    List<Scholarship> findByEducationLevel(@Param("level") String level, @Param("today") LocalDate today);

    /**
     * Find featured scholarships.
     */
    @Query("SELECT s FROM Scholarship s WHERE s.status = 'ACTIVE' AND s.isFeatured = true AND s.applicationDeadline >= :today ORDER BY s.applicationDeadline ASC")
    List<Scholarship> findFeaturedScholarships(@Param("today") LocalDate today);

    /**
     * Find scholarships by country.
     */
    @Query("SELECT s FROM Scholarship s WHERE s.status = 'ACTIVE' AND :country = ANY(s.eligibleCountries) AND s.applicationDeadline >= :today")
    List<Scholarship> findByCountry(@Param("country") String country, @Param("today") LocalDate today);

    /**
     * Count active scholarships.
     */
    @Query("SELECT COUNT(s) FROM Scholarship s WHERE s.status = 'ACTIVE' AND s.applicationDeadline >= :today")
    long countActiveScholarships(@Param("today") LocalDate today);
}
