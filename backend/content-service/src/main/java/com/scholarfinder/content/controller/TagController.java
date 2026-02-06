package com.scholarfinder.content.controller;

import com.scholarfinder.content.dto.ApiResponse;
import com.scholarfinder.content.dto.TagDto;
import com.scholarfinder.content.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * Create a new tag.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TagDto>> createTag(
            @Valid @RequestBody TagDto request) {
        
        TagDto tag = tagService.createTag(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(tag, "Tag created successfully"));
    }

    /**
     * Update an existing tag.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TagDto>> updateTag(
            @PathVariable Long id,
            @Valid @RequestBody TagDto request) {
        
        TagDto tag = tagService.updateTag(id, request);
        return ResponseEntity.ok(ApiResponse.success(tag, "Tag updated successfully"));
    }

    /**
     * Get tag by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TagDto>> getTagById(@PathVariable Long id) {
        TagDto tag = tagService.getTagById(id);
        return ResponseEntity.ok(ApiResponse.success(tag));
    }

    /**
     * Get tag by slug.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<TagDto>> getTagBySlug(@PathVariable String slug) {
        TagDto tag = tagService.getTagBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(tag));
    }

    /**
     * Get all tags.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagDto>>> getAllTags() {
        List<TagDto> tags = tagService.getAllTags();
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    /**
     * Get popular tags.
     */
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<TagDto>>> getPopularTags(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<TagDto> tags = tagService.getPopularTags(limit);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    /**
     * Search tags by name.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TagDto>>> searchTags(
            @RequestParam String query) {
        
        List<TagDto> tags = tagService.searchTags(query);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    /**
     * Get or create a tag by name.
     */
    @PostMapping("/get-or-create")
    public ResponseEntity<ApiResponse<TagDto>> getOrCreateTag(
            @RequestParam String name) {
        
        TagDto tag = tagService.getOrCreateTag(name);
        return ResponseEntity.ok(ApiResponse.success(tag));
    }

    /**
     * Delete a tag.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tag deleted successfully"));
    }
}
