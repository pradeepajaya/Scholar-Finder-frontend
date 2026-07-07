package com.scholarfinder.content.controller;

import com.scholarfinder.content.dto.ApiResponse;
import com.scholarfinder.content.dto.TestimonialDto;
import com.scholarfinder.content.dto.TestimonialRequest;
import com.scholarfinder.content.dto.TestimonialReviewRequest;
import com.scholarfinder.content.service.TestimonialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestimonialDto>>> getPublishedTestimonials() {
        List<TestimonialDto> testimonials = testimonialService.getPublishedTestimonials();
        return ResponseEntity.ok(ApiResponse.success(testimonials));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestimonialDto>> submitStory(@Valid @RequestBody TestimonialRequest request) {
        TestimonialDto testimonial = testimonialService.submitStory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(testimonial, "Success story submitted for admin review"));
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<TestimonialDto>>> getAdminTestimonials(
            @RequestParam(required = false) String status) {
        List<TestimonialDto> testimonials = status == null || status.isBlank()
            ? testimonialService.getAllForAdmin()
            : testimonialService.getByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(testimonials));
    }

    @PostMapping("/admin/{id}/approve")
    public ResponseEntity<ApiResponse<TestimonialDto>> approveStory(
            @PathVariable Long id,
            @RequestBody(required = false) TestimonialReviewRequest request) {
        TestimonialReviewRequest safeRequest = request == null ? new TestimonialReviewRequest() : request;
        TestimonialDto testimonial = testimonialService.approveStory(id, safeRequest);
        return ResponseEntity.ok(ApiResponse.success(testimonial, "Success story approved and published"));
    }

    @PostMapping("/admin/{id}/reject")
    public ResponseEntity<ApiResponse<TestimonialDto>> rejectStory(
            @PathVariable Long id,
            @Valid @RequestBody TestimonialReviewRequest request) {
        TestimonialDto testimonial = testimonialService.rejectStory(id, request);
        return ResponseEntity.ok(ApiResponse.success(testimonial, "Success story rejected and submitter notified"));
    }
}
