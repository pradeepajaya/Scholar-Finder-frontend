package com.scholarfinder.content.dto;

import com.scholarfinder.content.entity.Testimonial;

import java.time.LocalDateTime;

public class TestimonialDto {

    private Long id;
    private String scholarName;
    private String scholarshipName;
    private Integer yearCompleted;
    private String fieldOfStudy;
    private String university;
    private String testimonialText;
    private Integer rating;
    private Boolean isAnonymous;
    private Boolean isFeatured;
    private String status;
    private LocalDateTime createdAt;

    public static TestimonialDto fromEntity(Testimonial testimonial) {
        TestimonialDto dto = new TestimonialDto();
        dto.setId(testimonial.getId());
        dto.setScholarName(testimonial.getScholarName());
        dto.setScholarshipName(testimonial.getScholarshipName());
        dto.setYearCompleted(testimonial.getYearCompleted());
        dto.setFieldOfStudy(testimonial.getFieldOfStudy());
        dto.setUniversity(testimonial.getUniversity());
        dto.setTestimonialText(testimonial.getTestimonialText());
        dto.setRating(testimonial.getRating());
        dto.setIsAnonymous(Boolean.TRUE.equals(testimonial.getIsAnonymous()));
        dto.setIsFeatured(Boolean.TRUE.equals(testimonial.getIsFeatured()));
        dto.setStatus(testimonial.getStatus());
        dto.setCreatedAt(testimonial.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getScholarName() {
        return scholarName;
    }

    public void setScholarName(String scholarName) {
        this.scholarName = scholarName;
    }

    public String getScholarshipName() {
        return scholarshipName;
    }

    public void setScholarshipName(String scholarshipName) {
        this.scholarshipName = scholarshipName;
    }

    public Integer getYearCompleted() {
        return yearCompleted;
    }

    public void setYearCompleted(Integer yearCompleted) {
        this.yearCompleted = yearCompleted;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getTestimonialText() {
        return testimonialText;
    }

    public void setTestimonialText(String testimonialText) {
        this.testimonialText = testimonialText;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean anonymous) {
        isAnonymous = anonymous;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean featured) {
        isFeatured = featured;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
