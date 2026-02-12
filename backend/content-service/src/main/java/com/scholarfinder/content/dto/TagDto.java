package com.scholarfinder.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Tag responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private Integer usageCount;
}
