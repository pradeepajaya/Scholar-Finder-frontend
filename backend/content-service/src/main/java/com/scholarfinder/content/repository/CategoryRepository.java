package com.scholarfinder.content.repository;

import com.scholarfinder.content.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find category by slug.
     */
    Optional<Category> findBySlug(String slug);

    /**
     * Find active categories by content type.
     */
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND (c.contentType = :type OR c.contentType = 'BOTH') ORDER BY c.displayOrder ASC")
    List<Category> findActiveByContentType(@Param("type") String contentType);

    /**
     * Find all active categories.
     */
    List<Category> findByIsActiveTrueOrderByDisplayOrderAsc();

    /**
     * Find root categories (no parent).
     */
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL AND c.isActive = true ORDER BY c.displayOrder ASC")
    List<Category> findRootCategories();

    /**
     * Find child categories.
     */
    List<Category> findByParentIdAndIsActiveTrue(Long parentId);

    /**
     * Check if slug exists.
     */
    boolean existsBySlug(String slug);
}
