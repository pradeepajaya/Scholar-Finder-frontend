package com.scholarfinder.content.dto;

import jakarta.validation.constraints.Size;

public class TestimonialReviewRequest {

    @Size(max = 2000, message = "Rejection reason must be 2000 characters or fewer")
    private String rejectionReason;

    @Size(max = 255, message = "Reviewer name must be 255 characters or fewer")
    private String reviewedBy;

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
}
