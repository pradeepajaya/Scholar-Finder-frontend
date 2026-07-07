package com.scholarfinder.scholarship.repository;

import com.scholarfinder.scholarship.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    /**
     * Find profiles that belong to active student accounts.
     */
    @Query(
        value = """
            SELECT sp.*
            FROM users.student_profiles sp
            JOIN auth.users u ON u.id = sp.user_id
            WHERE u.role = 'STUDENT'
              AND u.is_active = TRUE
              AND u.is_verified = TRUE
            ORDER BY sp.created_at DESC
            """,
        nativeQuery = true
    )
    List<StudentProfile> findActiveRegisteredStudentProfiles();

    /**
     * Find student profile by user ID.
     */
    Optional<StudentProfile> findByUserId(Long userId);

    /**
     * Check that the profile belongs to a real active student auth account.
     */
    @Query(
        value = """
            SELECT EXISTS (
                SELECT 1
                FROM auth.users u
                WHERE u.id = :userId
                  AND lower(u.email) = lower(:email)
                  AND u.role = 'STUDENT'
                  AND u.is_active = TRUE
            )
            """,
        nativeQuery = true
    )
    boolean existsActiveStudentAuthUser(@Param("userId") Long userId, @Param("email") String email);

    /**
     * Check if profile exists for user.
     */
    boolean existsByUserId(Long userId);
}
