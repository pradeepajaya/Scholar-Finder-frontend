package com.scholarfinder.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Category responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconName;
    private String colorHex;
    private Long parentId;
    private String parentName;
    private String contentType;
    private Integer displayOrder;
    private Boolean isActive;
}
