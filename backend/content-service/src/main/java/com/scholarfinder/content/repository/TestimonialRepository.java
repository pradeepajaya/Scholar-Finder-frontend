package com.scholarfinder.content.repository;

import com.scholarfinder.content.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {

    @Query("""
        SELECT t FROM Testimonial t
        WHERE t.status = 'PUBLISHED'
        ORDER BY COALESCE(t.reviewedAt, t.createdAt) DESC, t.isFeatured DESC
        """)
    List<Testimonial> findPublishedOrderByFeaturedAndCreatedAt();

    @Query("""
        SELECT t FROM Testimonial t
        ORDER BY
            CASE
                WHEN t.status = 'PENDING' THEN 0
                WHEN t.status = 'PUBLISHED' THEN 1
                WHEN t.status = 'REJECTED' THEN 2
                ELSE 3
            END,
            t.createdAt DESC
        """)
    List<Testimonial> findAllForAdminReview();

    List<Testimonial> findByStatusOrderByCreatedAtDesc(String status);
}
