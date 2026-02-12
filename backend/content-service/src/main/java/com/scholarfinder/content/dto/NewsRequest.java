package com.scholarfinder.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for creating/updating news articles.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    private String slug;

    @Size(max = 500, message = "Summary must be less than 500 characters")
    private String summary;

    @NotBlank(message = "Content is required")
    private String content;

    private String featuredImage;
    private String imageCaption;

    private Long categoryId;
    private List<Long> tagIds;

    private String authorName;

    private String metaTitle;
    private String metaDescription;

    private Boolean isFeatured;
    private Boolean isBreaking;

    private String sourceName;
    private String sourceUrl;

    // Set to true to publish immediately
    private Boolean publish;
}
