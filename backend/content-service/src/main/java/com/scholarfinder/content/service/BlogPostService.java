package com.scholarfinder.content.service;

import com.scholarfinder.content.dto.BlogPostDto;
import com.scholarfinder.content.dto.BlogPostRequest;
import com.scholarfinder.content.dto.PagedResponse;
import com.scholarfinder.content.entity.BlogPost;
import com.scholarfinder.content.entity.Category;
import com.scholarfinder.content.entity.Tag;
import com.scholarfinder.content.repository.BlogPostRepository;
import com.scholarfinder.content.repository.CategoryRepository;
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
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public BlogPostService(BlogPostRepository blogPostRepository,
                           CategoryRepository categoryRepository,
                           TagRepository tagRepository) {
        this.blogPostRepository = blogPostRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    /**
     * Create a new blog post.
     */
    public BlogPostDto createBlogPost(BlogPostRequest request, Long authorId) {
        BlogPost blogPost = new BlogPost();
        mapRequestToEntity(request, blogPost);
        blogPost.setAuthorId(authorId);
        blogPost.setSlug(generateSlug(request.getTitle()));
        blogPost.setStatus("DRAFT");
        blogPost.setViewsCount(0);
        blogPost.setLikesCount(0);
        blogPost.setCommentsCount(0);
        
        BlogPost saved = blogPostRepository.save(blogPost);
        
        // Increment tag usage counts
        if (blogPost.getTags() != null) {
            blogPost.getTags().forEach(tag -> tagRepository.incrementUsageCount(tag.getId()));
        }
        
        return mapToDto(saved);
    }

    /**
     * Update an existing blog post.
     */
    public BlogPostDto updateBlogPost(Long id, BlogPostRequest request) {
        BlogPost blogPost = blogPostRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));
        
        // Track old tags to update usage counts
        Set<Tag> oldTags = new HashSet<>(blogPost.getTags() != null ? blogPost.getTags() : new HashSet<>());
        
        mapRequestToEntity(request, blogPost);
        BlogPost saved = blogPostRepository.save(blogPost);
        
        // Update tag usage counts
        if (request.getTagIds() != null) {
            Set<Tag> newTags = new HashSet<>(tagRepository.findAllByIdIn(request.getTagIds()));
            
            // Decrement count for removed tags
            oldTags.stream()
                .filter(tag -> !newTags.contains(tag))
                .forEach(tag -> tagRepository.decrementUsageCount(tag.getId()));
            
            // Increment count for new tags
            newTags.stream()
                .filter(tag -> !oldTags.contains(tag))
                .forEach(tag -> tagRepository.incrementUsageCount(tag.getId()));
        }
        
        return mapToDto(saved);
    }

    /**
     * Get blog post by ID.
     */
    @Transactional(readOnly = true)
    public BlogPostDto getBlogPostById(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));
        return mapToDto(blogPost);
    }

    /**
     * Get blog post by slug and increment view count.
     */
    public BlogPostDto getBlogPostBySlug(String slug) {
        BlogPost blogPost = blogPostRepository.findBySlug(slug)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with slug: " + slug));
        blogPostRepository.incrementViewCount(blogPost.getId());
        return mapToDto(blogPost);
    }

    /**
     * Get published blog posts with pagination.
     */
    @Transactional(readOnly = true)
    public PagedResponse<BlogPostDto> getPublishedBlogPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPostPage = blogPostRepository.findPublished(pageable);
        return createPagedResponse(blogPostPage);
    }

    /**
     * Get featured blog posts.
     */
    @Transactional(readOnly = true)
    public List<BlogPostDto> getFeaturedBlogPosts(int limit) {
        return blogPostRepository.findFeatured(PageRequest.of(0, limit))
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get popular blog posts.
     */
    @Transactional(readOnly = true)
    public List<BlogPostDto> getPopularBlogPosts(int limit) {
        return blogPostRepository.findPopular(PageRequest.of(0, limit))
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get blog posts by category.
     */
    @Transactional(readOnly = true)
    public PagedResponse<BlogPostDto> getBlogPostsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPostPage = blogPostRepository.findByCategory(categoryId, pageable);
        return createPagedResponse(blogPostPage);
    }

    /**
     * Get blog posts by tag.
     */
    @Transactional(readOnly = true)
    public PagedResponse<BlogPostDto> getBlogPostsByTag(Long tagId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPostPage = blogPostRepository.findByTag(tagId, pageable);
        return createPagedResponse(blogPostPage);
    }

    /**
     * Search blog posts.
     */
    @Transactional(readOnly = true)
    public PagedResponse<BlogPostDto> searchBlogPosts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPostPage = blogPostRepository.search(query, pageable);
        return createPagedResponse(blogPostPage);
    }

    /**
     * Get recent blog posts.
     */
    @Transactional(readOnly = true)
    public List<BlogPostDto> getRecentBlogPosts(int limit) {
        return blogPostRepository.findRecent(PageRequest.of(0, limit))
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Publish a blog post.
     */
    public BlogPostDto publishBlogPost(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));
        
        blogPost.setStatus("PUBLISHED");
        blogPost.setPublishedAt(LocalDateTime.now());
        
        BlogPost saved = blogPostRepository.save(blogPost);
        return mapToDto(saved);
    }

    /**
     * Archive a blog post.
     */
    public BlogPostDto archiveBlogPost(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));
        
        blogPost.setStatus("ARCHIVED");
        
        BlogPost saved = blogPostRepository.save(blogPost);
        return mapToDto(saved);
    }

    /**
     * Delete a blog post.
     */
    public void deleteBlogPost(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));
        
        // Decrement tag usage counts
        if (blogPost.getTags() != null) {
            blogPost.getTags().forEach(tag -> tagRepository.decrementUsageCount(tag.getId()));
        }
        
        blogPostRepository.deleteById(id);
    }

    /**
     * Set blog post as featured.
     */
    public BlogPostDto setFeatured(Long id, boolean featured) {
        BlogPost blogPost = blogPostRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));
        
        blogPost.setIsFeatured(featured);
        BlogPost saved = blogPostRepository.save(blogPost);
        return mapToDto(saved);
    }

    /**
     * Like a blog post.
     */
    public void likeBlogPost(Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new EntityNotFoundException("Blog post not found with id: " + id);
        }
        blogPostRepository.incrementLikeCount(id);
    }

    // Helper methods

    private void mapRequestToEntity(BlogPostRequest request, BlogPost blogPost) {
        blogPost.setTitle(request.getTitle());
        blogPost.setExcerpt(request.getExcerpt());
        blogPost.setContent(request.getContent());
        blogPost.setFeaturedImage(request.getFeaturedImage());
        blogPost.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        blogPost.setAllowComments(request.getAllowComments() != null ? request.getAllowComments() : true);
        blogPost.setReadingTimeMinutes(calculateReadingTime(request.getContent()));
        blogPost.setMetaTitle(request.getMetaTitle());
        blogPost.setMetaDescription(request.getMetaDescription());

        // Set category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + request.getCategoryId()));
            blogPost.setCategory(category);
        }

        // Set tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllByIdIn(request.getTagIds()));
            blogPost.setTags(tags);
        }
    }

    private BlogPostDto mapToDto(BlogPost blogPost) {
        BlogPostDto dto = new BlogPostDto();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setSlug(blogPost.getSlug());
        dto.setExcerpt(blogPost.getExcerpt());
        dto.setContent(blogPost.getContent());
        dto.setFeaturedImage(blogPost.getFeaturedImage());
        dto.setAuthorId(blogPost.getAuthorId());
        dto.setStatus(blogPost.getStatus());
        dto.setIsFeatured(blogPost.getIsFeatured());
        dto.setAllowComments(blogPost.getAllowComments());
        dto.setViewsCount(blogPost.getViewsCount());
        dto.setLikesCount(blogPost.getLikesCount());
        dto.setCommentsCount(blogPost.getCommentsCount());
        dto.setReadingTimeMinutes(blogPost.getReadingTimeMinutes());
        dto.setPublishedAt(blogPost.getPublishedAt());
        dto.setCreatedAt(blogPost.getCreatedAt());
        dto.setUpdatedAt(blogPost.getUpdatedAt());
        dto.setMetaTitle(blogPost.getMetaTitle());
        dto.setMetaDescription(blogPost.getMetaDescription());

        if (blogPost.getCategory() != null) {
            dto.setCategoryId(blogPost.getCategory().getId());
            dto.setCategoryName(blogPost.getCategory().getName());
        }

        if (blogPost.getTags() != null) {
            dto.setTagIds(blogPost.getTags().stream().map(Tag::getId).collect(Collectors.toList()));
            dto.setTagNames(blogPost.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
        }

        return dto;
    }

    private PagedResponse<BlogPostDto> createPagedResponse(Page<BlogPost> page) {
        List<BlogPostDto> content = page.getContent().stream()
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
        while (blogPostRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }

        return slug;
    }

    private Integer calculateReadingTime(String content) {
        if (content == null || content.isEmpty()) {
            return 1;
        }
        // Average reading speed is about 200 words per minute
        int wordCount = content.split("\\s+").length;
        int readingTime = (int) Math.ceil(wordCount / 200.0);
        return Math.max(1, readingTime);
    }
}
