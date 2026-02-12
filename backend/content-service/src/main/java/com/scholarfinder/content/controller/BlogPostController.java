package com.scholarfinder.content.controller;

import com.scholarfinder.content.dto.ApiResponse;
import com.scholarfinder.content.dto.BlogPostDto;
import com.scholarfinder.content.dto.BlogPostRequest;
import com.scholarfinder.content.dto.PagedResponse;
import com.scholarfinder.content.service.BlogPostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostService blogPostService;

    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    /**
     * Create a new blog post.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BlogPostDto>> createBlogPost(
            @Valid @RequestBody BlogPostRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long authorId) {
        
        // Use a default author ID if not provided (for testing)
        Long effectiveAuthorId = authorId != null ? authorId : 1L;
        
        BlogPostDto blogPost = blogPostService.createBlogPost(request, effectiveAuthorId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(blogPost, "Blog post created successfully"));
    }

    /**
     * Update an existing blog post.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostDto>> updateBlogPost(
            @PathVariable Long id,
            @Valid @RequestBody BlogPostRequest request) {
        
        BlogPostDto blogPost = blogPostService.updateBlogPost(id, request);
        return ResponseEntity.ok(ApiResponse.success(blogPost, "Blog post updated successfully"));
    }

    /**
     * Get blog post by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostDto>> getBlogPostById(@PathVariable Long id) {
        BlogPostDto blogPost = blogPostService.getBlogPostById(id);
        return ResponseEntity.ok(ApiResponse.success(blogPost));
    }

    /**
     * Get blog post by slug.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogPostDto>> getBlogPostBySlug(@PathVariable String slug) {
        BlogPostDto blogPost = blogPostService.getBlogPostBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(blogPost));
    }

    /**
     * Get all published blog posts with pagination.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<BlogPostDto>>> getPublishedBlogPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<BlogPostDto> blogPosts = blogPostService.getPublishedBlogPosts(page, size);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Get featured blog posts.
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<BlogPostDto>>> getFeaturedBlogPosts(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<BlogPostDto> blogPosts = blogPostService.getFeaturedBlogPosts(limit);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Get popular blog posts.
     */
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<BlogPostDto>>> getPopularBlogPosts(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<BlogPostDto> blogPosts = blogPostService.getPopularBlogPosts(limit);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Get recent blog posts.
     */
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<BlogPostDto>>> getRecentBlogPosts(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<BlogPostDto> blogPosts = blogPostService.getRecentBlogPosts(limit);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Get blog posts by category.
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PagedResponse<BlogPostDto>>> getBlogPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<BlogPostDto> blogPosts = blogPostService.getBlogPostsByCategory(categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Get blog posts by tag.
     */
    @GetMapping("/tag/{tagId}")
    public ResponseEntity<ApiResponse<PagedResponse<BlogPostDto>>> getBlogPostsByTag(
            @PathVariable Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<BlogPostDto> blogPosts = blogPostService.getBlogPostsByTag(tagId, page, size);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Search blog posts.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<BlogPostDto>>> searchBlogPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<BlogPostDto> blogPosts = blogPostService.searchBlogPosts(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(blogPosts));
    }

    /**
     * Publish a blog post.
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<BlogPostDto>> publishBlogPost(@PathVariable Long id) {
        BlogPostDto blogPost = blogPostService.publishBlogPost(id);
        return ResponseEntity.ok(ApiResponse.success(blogPost, "Blog post published successfully"));
    }

    /**
     * Archive a blog post.
     */
    @PostMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<BlogPostDto>> archiveBlogPost(@PathVariable Long id) {
        BlogPostDto blogPost = blogPostService.archiveBlogPost(id);
        return ResponseEntity.ok(ApiResponse.success(blogPost, "Blog post archived successfully"));
    }

    /**
     * Set blog post as featured.
     */
    @PutMapping("/{id}/featured")
    public ResponseEntity<ApiResponse<BlogPostDto>> setFeatured(
            @PathVariable Long id,
            @RequestParam boolean featured) {
        
        BlogPostDto blogPost = blogPostService.setFeatured(id, featured);
        return ResponseEntity.ok(ApiResponse.success(blogPost,
            featured ? "Blog post marked as featured" : "Blog post removed from featured"));
    }

    /**
     * Like a blog post.
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<Void>> likeBlogPost(@PathVariable Long id) {
        blogPostService.likeBlogPost(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Blog post liked successfully"));
    }

    /**
     * Delete a blog post.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlogPost(@PathVariable Long id) {
        blogPostService.deleteBlogPost(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Blog post deleted successfully"));
    }
}
