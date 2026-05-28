package com.scholarfinder.content.service;

import com.scholarfinder.content.dto.TestimonialDto;
import com.scholarfinder.content.repository.TestimonialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;

    public TestimonialService(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    public List<TestimonialDto> getPublishedTestimonials() {
        return testimonialRepository.findPublishedOrderByFeaturedAndCreatedAt()
            .stream()
            .map(TestimonialDto::fromEntity)
            .toList();
    }
}
