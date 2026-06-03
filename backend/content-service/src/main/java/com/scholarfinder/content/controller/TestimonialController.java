package com.scholarfinder.content.controller;

import com.scholarfinder.content.dto.ApiResponse;
import com.scholarfinder.content.dto.TestimonialDto;
import com.scholarfinder.content.service.TestimonialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
