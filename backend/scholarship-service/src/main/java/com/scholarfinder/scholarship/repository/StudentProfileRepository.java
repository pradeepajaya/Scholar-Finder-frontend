package com.scholarfinder.scholarship.repository;

import com.scholarfinder.scholarship.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    /**
     * Find student profile by user ID.
     */
    Optional<StudentProfile> findByUserId(Long userId);

    /**
     * Check if profile exists for user.
     */
    boolean existsByUserId(Long userId);
}
