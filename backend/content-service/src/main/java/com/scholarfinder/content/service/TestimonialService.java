package com.scholarfinder.content.service;

import com.scholarfinder.content.dto.TestimonialDto;
import com.scholarfinder.content.dto.TestimonialRequest;
import com.scholarfinder.content.dto.TestimonialReviewRequest;
import com.scholarfinder.content.entity.Testimonial;
import com.scholarfinder.content.repository.TestimonialRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;
    private final TestimonialNotificationService notificationService;

    public TestimonialService(TestimonialRepository testimonialRepository,
                              TestimonialNotificationService notificationService) {
        this.testimonialRepository = testimonialRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> getPublishedTestimonials() {
        return testimonialRepository.findPublishedOrderByFeaturedAndCreatedAt()
            .stream()
            .map(testimonial -> TestimonialDto.fromEntity(testimonial, false))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> getAllForAdmin() {
        return testimonialRepository.findAllForAdminReview()
            .stream()
            .map(TestimonialDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> getByStatus(String status) {
        return testimonialRepository.findByStatusOrderByCreatedAtDesc(normalizeStatus(status))
            .stream()
            .map(TestimonialDto::fromEntity)
            .toList();
    }

    public TestimonialDto submitStory(TestimonialRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Testimonial testimonial = new Testimonial();
        testimonial.setScholarName(trimToNull(request.getScholarName()));
        testimonial.setSubmitterEmail(trimToNull(request.getSubmitterEmail()));
        testimonial.setScholarshipName(trimToNull(request.getScholarshipName()));
        testimonial.setYearCompleted(request.getYearCompleted());
        testimonial.setFieldOfStudy(trimToNull(request.getFieldOfStudy()));
        testimonial.setUniversity(trimToNull(request.getUniversity()));
        testimonial.setTestimonialText(trimToNull(request.getTestimonialText()));
        testimonial.setRating(request.getRating() != null ? request.getRating() : 5);
        testimonial.setIsAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()));
        testimonial.setIsFeatured(false);
        testimonial.setStatus("PENDING");
        testimonial.setCreatedAt(now);
        testimonial.setUpdatedAt(now);

        Testimonial saved = testimonialRepository.save(testimonial);
        notificationService.notifyAdminOfSubmission(saved);
        return TestimonialDto.fromEntity(saved);
    }

    public TestimonialDto approveStory(Long id, TestimonialReviewRequest request) {
        Testimonial testimonial = findTestimonial(id);
        LocalDateTime now = LocalDateTime.now();
        testimonial.setStatus("PUBLISHED");
        testimonial.setRejectionReason(null);
        testimonial.setReviewedBy(reviewedBy(request));
        testimonial.setReviewedAt(now);
        testimonial.setUpdatedAt(now);

        Testimonial saved = testimonialRepository.save(testimonial);
        notificationService.notifySubmitterOfApproval(saved);
        return TestimonialDto.fromEntity(saved);
    }

    public TestimonialDto rejectStory(Long id, TestimonialReviewRequest request) {
        Testimonial testimonial = findTestimonial(id);
        LocalDateTime now = LocalDateTime.now();
        testimonial.setStatus("REJECTED");
        testimonial.setRejectionReason(trimToNull(request.getRejectionReason()));
        testimonial.setReviewedBy(reviewedBy(request));
        testimonial.setReviewedAt(now);
        testimonial.setUpdatedAt(now);

        Testimonial saved = testimonialRepository.save(testimonial);
        notificationService.notifySubmitterOfRejection(saved);
        return TestimonialDto.fromEntity(saved);
    }

    private Testimonial findTestimonial(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Success story id is required");
        }
        return testimonialRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Success story not found with id: " + id));
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "PENDING";
        }
        return status.trim().toUpperCase();
    }

    private String reviewedBy(TestimonialReviewRequest request) {
        String reviewedBy = request == null ? null : trimToNull(request.getReviewedBy());
        return reviewedBy == null ? "Admin" : reviewedBy;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
