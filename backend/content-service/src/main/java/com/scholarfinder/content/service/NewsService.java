package com.scholarfinder.content.service;

import com.scholarfinder.content.dto.NewsDto;
import com.scholarfinder.content.dto.NewsRequest;
import com.scholarfinder.content.dto.PagedResponse;
import com.scholarfinder.content.entity.Category;
import com.scholarfinder.content.entity.News;
import com.scholarfinder.content.entity.Tag;
import com.scholarfinder.content.repository.CategoryRepository;
import com.scholarfinder.content.repository.NewsRepository;
import com.scholarfinder.content.repository.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class NewsService {

    private final NewsRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public NewsService(NewsRepository newsRepository,
                       CategoryRepository categoryRepository,
                       TagRepository tagRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    /**
     * Create a new news article.
     */
    public NewsDto createNews(NewsRequest request, Long authorId) {
        News news = new News();
        mapRequestToEntity(request, news);
        news.setAuthorId(authorId);
        news.setSlug(generateSlug(request.getTitle()));
        news.setStatus("DRAFT");
        news.setViewsCount(0);
        
        News saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    /**
     * Update an existing news article.
     */
    public NewsDto updateNews(Long id, NewsRequest request) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + id));
        
        mapRequestToEntity(request, news);
        News saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    /**
     * Get news by ID.
     */
    @Transactional(readOnly = true)
    public NewsDto getNewsById(Long id) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + id));
        return mapToDto(news);
    }

    /**
     * Get news by slug and increment view count.
     */
    public NewsDto getNewsBySlug(String slug) {
        News news = newsRepository.findBySlug(slug)
            .orElseThrow(() -> new EntityNotFoundException("News not found with slug: " + slug));
        newsRepository.incrementViewCount(news.getId());
        return mapToDto(news);
    }

    /**
     * Get published news with pagination.
     */
    @Transactional(readOnly = true)
    public PagedResponse<NewsDto> getPublishedNews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage = newsRepository.findPublished(pageable);
        return createPagedResponse(newsPage);
    }

    /**
     * Get featured news.
     */
    @Transactional(readOnly = true)
    public List<NewsDto> getFeaturedNews(int limit) {
        return newsRepository.findFeatured(PageRequest.of(0, limit))
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get breaking news.
     */
    @Transactional(readOnly = true)
    public List<NewsDto> getBreakingNews() {
        return newsRepository.findBreaking()
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get news by category.
     */
    @Transactional(readOnly = true)
    public PagedResponse<NewsDto> getNewsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage = newsRepository.findByCategory(categoryId, pageable);
        return createPagedResponse(newsPage);
    }

    /**
     * Get news by tag.
     */
    @Transactional(readOnly = true)
    public PagedResponse<NewsDto> getNewsByTag(Long tagId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage = newsRepository.findByTag(tagId, pageable);
        return createPagedResponse(newsPage);
    }

    /**
     * Search news.
     */
    @Transactional(readOnly = true)
    public PagedResponse<NewsDto> searchNews(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage = newsRepository.search(query, pageable);
        return createPagedResponse(newsPage);
    }

    /**
     * Get recent news.
     */
    @Transactional(readOnly = true)
    public List<NewsDto> getRecentNews(int limit) {
        return newsRepository.findRecent(PageRequest.of(0, limit))
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Publish a news article.
     */
    public NewsDto publishNews(Long id) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + id));
        
        news.setStatus("PUBLISHED");
        news.setPublishedAt(LocalDateTime.now());
        
        News saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    /**
     * Archive a news article.
     */
    public NewsDto archiveNews(Long id) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + id));
        
        news.setStatus("ARCHIVED");
        
        News saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    /**
     * Delete a news article.
     */
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new EntityNotFoundException("News not found with id: " + id);
        }
        newsRepository.deleteById(id);
    }

    /**
     * Set news as featured.
     */
    public NewsDto setFeatured(Long id, boolean featured) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + id));
        
        news.setIsFeatured(featured);
        News saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    /**
     * Set news as breaking.
     */
    public NewsDto setBreaking(Long id, boolean breaking) {
        News news = newsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + id));
        
        news.setIsBreaking(breaking);
        News saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    // Helper methods

    private void mapRequestToEntity(NewsRequest request, News news) {
        news.setTitle(request.getTitle());
        news.setSummary(request.getSummary());
        news.setContent(request.getContent());
        news.setFeaturedImage(request.getFeaturedImage());
        news.setSource(request.getSource());
        news.setSourceUrl(request.getSourceUrl());
        news.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        news.setIsBreaking(request.getIsBreaking() != null ? request.getIsBreaking() : false);
        news.setMetaTitle(request.getMetaTitle());
        news.setMetaDescription(request.getMetaDescription());

        // Set category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + request.getCategoryId()));
            news.setCategory(category);
        }

        // Set tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllByIdIn(request.getTagIds()));
            news.setTags(tags);
        }
    }

    private NewsDto mapToDto(News news) {
        NewsDto dto = new NewsDto();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setSlug(news.getSlug());
        dto.setSummary(news.getSummary());
        dto.setContent(news.getContent());
        dto.setFeaturedImage(news.getFeaturedImage());
        dto.setAuthorId(news.getAuthorId());
        dto.setSource(news.getSource());
        dto.setSourceUrl(news.getSourceUrl());
        dto.setStatus(news.getStatus());
        dto.setIsFeatured(news.getIsFeatured());
        dto.setIsBreaking(news.getIsBreaking());
        dto.setViewsCount(news.getViewsCount());
        dto.setPublishedAt(news.getPublishedAt());
        dto.setCreatedAt(news.getCreatedAt());
        dto.setUpdatedAt(news.getUpdatedAt());
        dto.setMetaTitle(news.getMetaTitle());
        dto.setMetaDescription(news.getMetaDescription());

        if (news.getCategory() != null) {
            dto.setCategoryId(news.getCategory().getId());
            dto.setCategoryName(news.getCategory().getName());
        }

        if (news.getTags() != null) {
            dto.setTagIds(news.getTags().stream().map(Tag::getId).collect(Collectors.toList()));
            dto.setTagNames(news.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
        }

        return dto;
    }

    private PagedResponse<NewsDto> createPagedResponse(Page<News> page) {
        List<NewsDto> content = page.getContent().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());

        return new PagedResponse<>(
            content,
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast()
        );
    }

    private String generateSlug(String title) {
        String slug = title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");

        // Check if slug exists and add suffix if needed
        String originalSlug = slug;
        int counter = 1;
        while (newsRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }

        return slug;
    }
}
