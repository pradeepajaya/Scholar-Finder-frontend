package com.scholarfinder.content.repository;

import com.scholarfinder.content.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    /**
     * Find news by slug.
     */
    Optional<News> findBySlug(String slug);

    /**
     * Find all published news, ordered by published date.
     */
    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' ORDER BY n.publishedAt DESC")
    Page<News> findPublished(Pageable pageable);

    /**
     * Find featured news.
     */
    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' AND n.isFeatured = true ORDER BY n.publishedAt DESC")
    List<News> findFeatured(Pageable pageable);

    /**
     * Find breaking news.
     */
    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' AND n.isBreaking = true ORDER BY n.publishedAt DESC")
    List<News> findBreaking();

    /**
     * Find news by category.
     */
    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' AND n.category.id = :categoryId ORDER BY n.publishedAt DESC")
    Page<News> findByCategory(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Find news by tag.
     */
    @Query("SELECT n FROM News n JOIN n.tags t WHERE n.status = 'PUBLISHED' AND t.id = :tagId ORDER BY n.publishedAt DESC")
    Page<News> findByTag(@Param("tagId") Long tagId, Pageable pageable);

    /**
     * Search news by title or content.
     */
    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :query, '%'))) ORDER BY n.publishedAt DESC")
    Page<News> search(@Param("query") String query, Pageable pageable);

    /**
     * Find recent news.
     */
    @Query("SELECT n FROM News n WHERE n.status = 'PUBLISHED' ORDER BY n.publishedAt DESC")
    List<News> findRecent(Pageable pageable);

    /**
     * Find news by author.
     */
    Page<News> findByAuthorIdAndStatus(Long authorId, String status, Pageable pageable);

    /**
     * Increment view count.
     */
    @Modifying
    @Query("UPDATE News n SET n.viewsCount = n.viewsCount + 1 WHERE n.id = :id")
    void incrementViewCount(@Param("id") Long id);

    /**
     * Count published news.
     */
    @Query("SELECT COUNT(n) FROM News n WHERE n.status = 'PUBLISHED'")
    long countPublished();

    /**
     * Check if slug exists.
     */
    boolean existsBySlug(String slug);
}
