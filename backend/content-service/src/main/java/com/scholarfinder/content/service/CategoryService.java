package com.scholarfinder.content.service;

import com.scholarfinder.content.dto.CategoryDto;
import com.scholarfinder.content.entity.Category;
import com.scholarfinder.content.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Create a new category.
     */
    public CategoryDto createCategory(CategoryDto request) {
        Category category = new Category();
        mapToEntity(request, category);
        category.setSlug(generateSlug(request.getName()));
        
        Category saved = categoryRepository.save(requireCategory(category));
        return mapToDto(saved);
    }

    /**
     * Update an existing category.
     */
    public CategoryDto updateCategory(Long id, CategoryDto request) {
        Long categoryId = requireId(id);
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        
        mapToEntity(request, category);
        Category saved = categoryRepository.save(requireCategory(category));
        return mapToDto(saved);
    }

    /**
     * Get category by ID.
     */
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Long categoryId = requireId(id);
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        return mapToDto(category);
    }

    /**
     * Get category by slug.
     */
    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new EntityNotFoundException("Category not found with slug: " + slug));
        return mapToDto(category);
    }

    /**
     * Get all active categories.
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
            .stream()
            .map(category -> mapToDto(requireCategory(category)))
            .collect(Collectors.toList());
    }

    /**
     * Get categories by content type (NEWS, BLOG, or BOTH).
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesByContentType(String contentType) {
        return categoryRepository.findActiveByContentType(contentType)
            .stream()
            .map(category -> mapToDto(requireCategory(category)))
            .collect(Collectors.toList());
    }

    /**
     * Get root categories (no parent).
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getRootCategories() {
        return categoryRepository.findRootCategories()
            .stream()
            .map(category -> mapToDto(requireCategory(category)))
            .collect(Collectors.toList());
    }

    /**
     * Get child categories.
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getChildCategories(Long parentId) {
        Long safeParentId = requireId(parentId);
        return categoryRepository.findByParentIdAndIsActiveTrue(safeParentId)
            .stream()
            .map(category -> mapToDto(requireCategory(category)))
            .collect(Collectors.toList());
    }

    /**
     * Delete a category.
     */
    public void deleteCategory(Long id) {
        Long categoryId = requireId(id);
        if (!categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(categoryId);
    }

    /**
     * Toggle category active status.
     */
    public CategoryDto toggleActive(Long id) {
        Long categoryId = requireId(id);
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        
        category.setIsActive(!category.getIsActive());
        Category saved = categoryRepository.save(requireCategory(category));
        return mapToDto(saved);
    }

    // Helper methods

    private void mapToEntity(CategoryDto dto, Category category) {
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIconName(dto.getIconName());
        category.setColorHex(dto.getColorHex());
        category.setContentType(dto.getContentType() != null ? dto.getContentType() : "BOTH");
        category.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getParentId() != null) {
            Long parentId = requireId(dto.getParentId());
            Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new EntityNotFoundException("Parent category not found with id: " + dto.getParentId()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
    }

    private CategoryDto mapToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setDescription(category.getDescription());
        dto.setIconName(category.getIconName());
        dto.setColorHex(category.getColorHex());
        dto.setContentType(category.getContentType());
        dto.setDisplayOrder(category.getDisplayOrder());
        dto.setIsActive(category.getIsActive());
        
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }
        
        return dto;
    }

    private String generateSlug(String name) {
        String slug = name.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");

        // Check if slug exists and add suffix if needed
        String originalSlug = slug;
        int counter = 1;
        while (categoryRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }

        return slug;
    }

    private @NonNull Long requireId(@Nullable Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Category id is required");
        }
        return id;
    }

    private @NonNull Category requireCategory(@Nullable Category category) {
        if (category == null) {
            throw new IllegalArgumentException("Category is required");
        }
        return category;
    }
}
