package com.scholarfinder.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for creating/updating blog posts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    private String slug;

    @Size(max = 500, message = "Excerpt must be less than 500 characters")
    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    private String featuredImage;
    private String imageAlt;

    private Long categoryId;
    private List<Long> tagIds;

    private String authorName;
    private String authorBio;
    private String authorAvatar;

    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;

    private Boolean isFeatured;
    private Boolean allowComments;

    private List<Long> relatedScholarshipIds;

    // Set to true to publish immediately
    private Boolean publish;
}
