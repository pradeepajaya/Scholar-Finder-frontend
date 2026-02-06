package com.scholarfinder.content.repository;

import com.scholarfinder.content.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * Find tag by slug.
     */
    Optional<Tag> findBySlug(String slug);

    /**
     * Find tag by name (case-insensitive).
     */
    Optional<Tag> findByNameIgnoreCase(String name);

    /**
     * Find popular tags by usage count.
     */
    @Query("SELECT t FROM Tag t ORDER BY t.usageCount DESC")
    List<Tag> findPopular();

    /**
     * Search tags by name.
     */
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY t.usageCount DESC")
    List<Tag> search(@Param("query") String query);

    /**
     * Increment usage count.
     */
    @Modifying
    @Query("UPDATE Tag t SET t.usageCount = t.usageCount + 1 WHERE t.id = :id")
    void incrementUsageCount(@Param("id") Long id);

    /**
     * Decrement usage count.
     */
    @Modifying
    @Query("UPDATE Tag t SET t.usageCount = GREATEST(0, t.usageCount - 1) WHERE t.id = :id")
    void decrementUsageCount(@Param("id") Long id);

    /**
     * Check if slug exists.
     */
    boolean existsBySlug(String slug);

    /**
     * Find all tags by IDs.
     */
    List<Tag> findAllByIdIn(List<Long> ids);
}
