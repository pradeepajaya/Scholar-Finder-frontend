package com.scholarfinder.content.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "testimonials", schema = "content")
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scholar_name")
    private String scholarName;

    @Column(name = "scholarship_name", nullable = false)
    private String scholarshipName;

    @Column(name = "year_completed")
    private Integer yearCompleted;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @Column(name = "university")
    private String university;

    @Column(name = "testimonial_text", nullable = false, columnDefinition = "TEXT")
    private String testimonialText;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "is_anonymous")
    private Boolean isAnonymous;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
