package com.scholarfinder.content.controller;

import com.scholarfinder.content.dto.ApiResponse;
import com.scholarfinder.content.dto.CategoryDto;
import com.scholarfinder.content.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Create a new category.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @Valid @RequestBody CategoryDto request) {
        
        CategoryDto category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(category, "Category created successfully"));
    }

    /**
     * Update an existing category.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto request) {
        
        CategoryDto category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success(category, "Category updated successfully"));
    }

    /**
     * Get category by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryById(@PathVariable Long id) {
        CategoryDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    /**
     * Get category by slug.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryBySlug(@PathVariable String slug) {
        CategoryDto category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    /**
     * Get all active categories.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllActiveCategories() {
        List<CategoryDto> categories = categoryService.getAllActiveCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * Get categories by content type (NEWS, BLOG, or BOTH).
     */
    @GetMapping("/type/{contentType}")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategoriesByContentType(
            @PathVariable String contentType) {
        
        List<CategoryDto> categories = categoryService.getCategoriesByContentType(contentType.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * Get root categories (no parent).
     */
    @GetMapping("/root")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getRootCategories() {
        List<CategoryDto> categories = categoryService.getRootCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * Get child categories.
     */
    @GetMapping("/{parentId}/children")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getChildCategories(
            @PathVariable Long parentId) {
        
        List<CategoryDto> categories = categoryService.getChildCategories(parentId);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * Toggle category active status.
     */
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<CategoryDto>> toggleActive(@PathVariable Long id) {
        CategoryDto category = categoryService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success(category, 
            category.getIsActive() ? "Category activated" : "Category deactivated"));
    }

    /**
     * Delete a category.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }
}
