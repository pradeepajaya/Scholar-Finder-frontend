package com.scholarfinder.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Blog post responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDto {

    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String featuredImage;
    private String imageAlt;
    
    private CategoryDto category;
    private List<TagDto> tags;
    
    private Long authorId;
    private String authorName;
    private String authorBio;
    private String authorAvatar;
    
    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;
    
    private Integer readingTime;
    
    private String status;
    private Boolean isFeatured;
    private Boolean allowComments;
    
    private Integer viewsCount;
    private Integer likesCount;
    private Integer commentsCount;
    
    private List<Long> relatedScholarshipIds;
    
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
