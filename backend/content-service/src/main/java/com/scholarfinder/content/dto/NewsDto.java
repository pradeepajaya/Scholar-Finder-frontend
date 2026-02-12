package com.scholarfinder.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for News article responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDto {

    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String featuredImage;
    private String imageCaption;
    
    private CategoryDto category;
    private List<TagDto> tags;
    
    private Long authorId;
    private String authorName;
    
    private String metaTitle;
    private String metaDescription;
    
    private String status;
    private Boolean isFeatured;
    private Boolean isBreaking;
    
    private String sourceName;
    private String sourceUrl;
    
    private Integer viewsCount;
    
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
