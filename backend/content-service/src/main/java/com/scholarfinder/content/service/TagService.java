package com.scholarfinder.content.service;

import com.scholarfinder.content.dto.TagDto;
import com.scholarfinder.content.entity.Tag;
import com.scholarfinder.content.repository.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Create a new tag.
     */
    public TagDto createTag(TagDto request) {
        // Check if tag with same name exists
        if (tagRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Tag with name '" + request.getName() + "' already exists");
        }

        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setSlug(generateSlug(request.getName()));
        tag.setDescription(request.getDescription());
        tag.setUsageCount(0);
        
        Tag saved = tagRepository.save(tag);
        return mapToDto(saved);
    }

    /**
     * Update an existing tag.
     */
    public TagDto updateTag(Long id, TagDto request) {
        Tag tag = tagRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
        
        tag.setName(request.getName());
        tag.setDescription(request.getDescription());
        
        Tag saved = tagRepository.save(tag);
        return mapToDto(saved);
    }

    /**
     * Get tag by ID.
     */
    @Transactional(readOnly = true)
    public TagDto getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
        return mapToDto(tag);
    }

    /**
     * Get tag by slug.
     */
    @Transactional(readOnly = true)
    public TagDto getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
            .orElseThrow(() -> new EntityNotFoundException("Tag not found with slug: " + slug));
        return mapToDto(tag);
    }

    /**
     * Get all tags.
     */
    @Transactional(readOnly = true)
    public List<TagDto> getAllTags() {
        return tagRepository.findAll()
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get popular tags.
     */
    @Transactional(readOnly = true)
    public List<TagDto> getPopularTags(int limit) {
        return tagRepository.findPopular()
            .stream()
            .limit(limit)
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Search tags by name.
     */
    @Transactional(readOnly = true)
    public List<TagDto> searchTags(String query) {
        return tagRepository.search(query)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Delete a tag.
     */
    public void deleteTag(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new EntityNotFoundException("Tag not found with id: " + id);
        }
        tagRepository.deleteById(id);
    }

    /**
     * Get or create tag by name.
     */
    public TagDto getOrCreateTag(String name) {
        return tagRepository.findByNameIgnoreCase(name)
            .map(this::mapToDto)
            .orElseGet(() -> {
                TagDto dto = new TagDto();
                dto.setName(name);
                return createTag(dto);
            });
    }

    // Helper methods

    private TagDto mapToDto(Tag tag) {
        TagDto dto = new TagDto();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());
        dto.setDescription(tag.getDescription());
        dto.setUsageCount(tag.getUsageCount());
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
        while (tagRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }

        return slug;
    }
}
