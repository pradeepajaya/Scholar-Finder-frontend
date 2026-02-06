package com.scholarfinder.notification.controller;

import com.scholarfinder.notification.dto.*;
import com.scholarfinder.notification.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * Submit a contact form (public endpoint).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessageDto>> submitContactForm(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        ContactMessageDto message = contactService.submitContactForm(request, ipAddress, userAgent);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(message, "Your message has been sent successfully. We'll get back to you soon!"));
    }

    /**
     * Get contact message by ID (admin only).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactMessageDto>> getMessageById(@PathVariable Long id) {
        ContactMessageDto message = contactService.getMessageById(id);
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    /**
     * Get all messages with pagination (admin only).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageDto>>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        PagedResponse<ContactMessageDto> messages = contactService.getAllMessages(page, size);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Get messages by status (admin only).
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageDto>>> getMessagesByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        PagedResponse<ContactMessageDto> messages = contactService.getMessagesByStatus(status.toUpperCase(), page, size);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Search messages (admin only).
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageDto>>> searchMessages(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        PagedResponse<ContactMessageDto> messages = contactService.searchMessages(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Get recent messages (admin only).
     */
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<ContactMessageDto>>> getRecentMessages(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<ContactMessageDto> messages = contactService.getRecentMessages(limit);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Get high priority messages (admin only).
     */
    @GetMapping("/high-priority")
    public ResponseEntity<ApiResponse<List<ContactMessageDto>>> getHighPriorityMessages() {
        List<ContactMessageDto> messages = contactService.getHighPriorityMessages();
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Get contact statistics (admin only).
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ContactStatsDto>> getStatistics() {
        ContactStatsDto stats = contactService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Update message status (admin only).
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContactMessageDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        ContactMessageDto message = contactService.updateStatus(id, status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success(message, "Status updated successfully"));
    }

    /**
     * Update message priority (admin only).
     */
    @PutMapping("/{id}/priority")
    public ResponseEntity<ApiResponse<ContactMessageDto>> updatePriority(
            @PathVariable Long id,
            @RequestParam String priority) {
        
        ContactMessageDto message = contactService.updatePriority(id, priority.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success(message, "Priority updated successfully"));
    }

    /**
     * Assign message to admin (admin only).
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<ContactMessageDto>> assignMessage(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {
        
        Long effectiveAdminId = adminId != null ? adminId : 1L;
        ContactMessageDto message = contactService.assignMessage(id, effectiveAdminId);
        return ResponseEntity.ok(ApiResponse.success(message, "Message assigned successfully"));
    }

    /**
     * Respond to a message (admin only).
     */
    @PostMapping("/{id}/respond")
    public ResponseEntity<ApiResponse<ContactMessageDto>> respondToMessage(
            @PathVariable Long id,
            @Valid @RequestBody ContactResponseRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {
        
        Long effectiveAdminId = adminId != null ? adminId : 1L;
        ContactMessageDto message = contactService.respondToMessage(id, request, effectiveAdminId);
        return ResponseEntity.ok(ApiResponse.success(message, "Response sent successfully"));
    }

    /**
     * Add admin notes (admin only).
     */
    @PostMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<ContactMessageDto>> addAdminNotes(
            @PathVariable Long id,
            @RequestBody String notes) {
        
        ContactMessageDto message = contactService.addAdminNotes(id, notes);
        return ResponseEntity.ok(ApiResponse.success(message, "Notes added successfully"));
    }

    /**
     * Delete a message (admin only).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Message deleted successfully"));
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("OK", "Notification service is running"));
    }

    // Helper method to get client IP
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
