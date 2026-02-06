package com.scholarfinder.content.controller;

import com.scholarfinder.content.dto.ApiResponse;
import com.scholarfinder.content.dto.NewsDto;
import com.scholarfinder.content.dto.NewsRequest;
import com.scholarfinder.content.dto.PagedResponse;
import com.scholarfinder.content.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    /**
     * Create a new news article.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NewsDto>> createNews(
            @Valid @RequestBody NewsRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long authorId) {
        
        // Use a default author ID if not provided (for testing)
        Long effectiveAuthorId = authorId != null ? authorId : 1L;
        
        NewsDto news = newsService.createNews(request, effectiveAuthorId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(news, "News article created successfully"));
    }

    /**
     * Update an existing news article.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsDto>> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsRequest request) {
        
        NewsDto news = newsService.updateNews(id, request);
        return ResponseEntity.ok(ApiResponse.success(news, "News article updated successfully"));
    }

    /**
     * Get news by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsDto>> getNewsById(@PathVariable Long id) {
        NewsDto news = newsService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get news by slug.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<NewsDto>> getNewsBySlug(@PathVariable String slug) {
        NewsDto news = newsService.getNewsBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get all published news with pagination.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<NewsDto>>> getPublishedNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<NewsDto> news = newsService.getPublishedNews(page, size);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get featured news.
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<NewsDto>>> getFeaturedNews(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<NewsDto> news = newsService.getFeaturedNews(limit);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get breaking news.
     */
    @GetMapping("/breaking")
    public ResponseEntity<ApiResponse<List<NewsDto>>> getBreakingNews() {
        List<NewsDto> news = newsService.getBreakingNews();
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get recent news.
     */
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<NewsDto>>> getRecentNews(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<NewsDto> news = newsService.getRecentNews(limit);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get news by category.
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PagedResponse<NewsDto>>> getNewsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<NewsDto> news = newsService.getNewsByCategory(categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Get news by tag.
     */
    @GetMapping("/tag/{tagId}")
    public ResponseEntity<ApiResponse<PagedResponse<NewsDto>>> getNewsByTag(
            @PathVariable Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<NewsDto> news = newsService.getNewsByTag(tagId, page, size);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Search news.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<NewsDto>>> searchNews(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<NewsDto> news = newsService.searchNews(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    /**
     * Publish a news article.
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<NewsDto>> publishNews(@PathVariable Long id) {
        NewsDto news = newsService.publishNews(id);
        return ResponseEntity.ok(ApiResponse.success(news, "News article published successfully"));
    }

    /**
     * Archive a news article.
     */
    @PostMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<NewsDto>> archiveNews(@PathVariable Long id) {
        NewsDto news = newsService.archiveNews(id);
        return ResponseEntity.ok(ApiResponse.success(news, "News article archived successfully"));
    }

    /**
     * Set news as featured.
     */
    @PutMapping("/{id}/featured")
    public ResponseEntity<ApiResponse<NewsDto>> setFeatured(
            @PathVariable Long id,
            @RequestParam boolean featured) {
        
        NewsDto news = newsService.setFeatured(id, featured);
        return ResponseEntity.ok(ApiResponse.success(news, 
            featured ? "News marked as featured" : "News removed from featured"));
    }

    /**
     * Set news as breaking.
     */
    @PutMapping("/{id}/breaking")
    public ResponseEntity<ApiResponse<NewsDto>> setBreaking(
            @PathVariable Long id,
            @RequestParam boolean breaking) {
        
        NewsDto news = newsService.setBreaking(id, breaking);
        return ResponseEntity.ok(ApiResponse.success(news,
            breaking ? "News marked as breaking" : "News removed from breaking"));
    }

    /**
     * Delete a news article.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok(ApiResponse.success(null, "News article deleted successfully"));
    }
}
