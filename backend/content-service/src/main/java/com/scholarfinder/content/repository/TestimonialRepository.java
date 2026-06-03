package com.scholarfinder.content.repository;

import com.scholarfinder.content.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {

    @Query("SELECT t FROM Testimonial t WHERE t.status = 'PUBLISHED' ORDER BY t.isFeatured DESC, t.createdAt DESC")
    List<Testimonial> findPublishedOrderByFeaturedAndCreatedAt();
}
