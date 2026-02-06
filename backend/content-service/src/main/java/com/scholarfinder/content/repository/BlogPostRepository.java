package com.scholarfinder.content.repository;

import com.scholarfinder.content.entity.BlogPost;
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
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    /**
     * Find blog post by slug.
     */
    Optional<BlogPost> findBySlug(String slug);

    /**
     * Find all published blog posts, ordered by published date.
     */
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.publishedAt DESC")
    Page<BlogPost> findPublished(Pageable pageable);

    /**
     * Find featured blog posts.
     */
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' AND b.isFeatured = true ORDER BY b.publishedAt DESC")
    List<BlogPost> findFeatured(Pageable pageable);

    /**
     * Find blog posts by category.
     */
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' AND b.category.id = :categoryId ORDER BY b.publishedAt DESC")
    Page<BlogPost> findByCategory(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Find blog posts by tag.
     */
    @Query("SELECT b FROM BlogPost b JOIN b.tags t WHERE b.status = 'PUBLISHED' AND t.id = :tagId ORDER BY b.publishedAt DESC")
    Page<BlogPost> findByTag(@Param("tagId") Long tagId, Pageable pageable);

    /**
     * Search blog posts by title or content.
     */
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%'))) ORDER BY b.publishedAt DESC")
    Page<BlogPost> search(@Param("query") String query, Pageable pageable);

    /**
     * Find recent blog posts.
     */
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.publishedAt DESC")
    List<BlogPost> findRecent(Pageable pageable);

    /**
     * Find popular blog posts by views.
     */
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.viewsCount DESC")
    List<BlogPost> findPopular(Pageable pageable);

    /**
     * Find blog posts by author.
     */
    Page<BlogPost> findByAuthorIdAndStatus(Long authorId, String status, Pageable pageable);

    /**
     * Increment view count.
     */
    @Modifying
    @Query("UPDATE BlogPost b SET b.viewsCount = b.viewsCount + 1 WHERE b.id = :id")
    void incrementViewCount(@Param("id") Long id);

    /**
     * Increment like count.
     */
    @Modifying
    @Query("UPDATE BlogPost b SET b.likesCount = b.likesCount + 1 WHERE b.id = :id")
    void incrementLikeCount(@Param("id") Long id);

    /**
     * Count published blog posts.
     */
    @Query("SELECT COUNT(b) FROM BlogPost b WHERE b.status = 'PUBLISHED'")
    long countPublished();

    /**
     * Check if slug exists.
     */
    boolean existsBySlug(String slug);
}
