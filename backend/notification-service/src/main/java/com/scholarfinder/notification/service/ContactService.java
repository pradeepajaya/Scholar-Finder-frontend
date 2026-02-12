package com.scholarfinder.notification.service;

import com.scholarfinder.notification.dto.*;
import com.scholarfinder.notification.entity.ContactMessage;
import com.scholarfinder.notification.repository.ContactMessageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository contactRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactRepository, EmailService emailService) {
        this.contactRepository = contactRepository;
        this.emailService = emailService;
    }

    /**
     * Submit a new contact message (public endpoint).
     */
    public ContactMessageDto submitContactForm(ContactRequest request, String ipAddress, String userAgent) {
        log.info("New contact form submission from: {}", request.getEmail());

        ContactMessage message = new ContactMessage();
        message.setFirstName(request.getFirstName());
        message.setLastName(request.getLastName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        message.setCategory(request.getCategory() != null ? request.getCategory() : "GENERAL");
        message.setStatus("NEW");
        message.setPriority(determinePriority(request));
        message.setIpAddress(ipAddress);
        message.setUserAgent(userAgent);

        ContactMessage saved = contactRepository.save(message);
        log.info("Contact message saved with ID: {}", saved.getId());

        // Send confirmation email to user
        try {
            emailService.sendContactConfirmation(
                saved.getEmail(),
                saved.getFirstName(),
                saved.getSubject(),
                saved.getId()
            );
        } catch (Exception e) {
            log.error("Failed to send confirmation email", e);
        }

        // Send notification to admin
        try {
            emailService.sendContactNotificationToAdmin(
                saved.getFullName(),
                saved.getEmail(),
                saved.getSubject(),
                saved.getMessage(),
                saved.getId()
            );
        } catch (Exception e) {
            log.error("Failed to send admin notification email", e);
        }

        return mapToDto(saved);
    }

    /**
     * Get contact message by ID.
     */
    @Transactional(readOnly = true)
    public ContactMessageDto getMessageById(Long id) {
        ContactMessage message = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        return mapToDto(message);
    }

    /**
     * Get all messages with pagination.
     */
    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDto> getAllMessages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContactMessage> messagePage = contactRepository.findAllByOrderByCreatedAtDesc(pageable);
        return createPagedResponse(messagePage);
    }

    /**
     * Get messages by status.
     */
    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDto> getMessagesByStatus(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContactMessage> messagePage = contactRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return createPagedResponse(messagePage);
    }

    /**
     * Search messages.
     */
    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDto> searchMessages(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContactMessage> messagePage = contactRepository.search(query, pageable);
        return createPagedResponse(messagePage);
    }

    /**
     * Update message status.
     */
    public ContactMessageDto updateStatus(Long id, String status) {
        ContactMessage message = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        
        message.setStatus(status);
        ContactMessage saved = contactRepository.save(message);
        return mapToDto(saved);
    }

    /**
     * Update message priority.
     */
    public ContactMessageDto updatePriority(Long id, String priority) {
        ContactMessage message = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        
        message.setPriority(priority);
        ContactMessage saved = contactRepository.save(message);
        return mapToDto(saved);
    }

    /**
     * Assign message to admin.
     */
    public ContactMessageDto assignMessage(Long id, Long adminId) {
        ContactMessage message = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        
        message.setAssignedTo(adminId);
        if ("NEW".equals(message.getStatus())) {
            message.setStatus("IN_PROGRESS");
        }
        
        ContactMessage saved = contactRepository.save(message);
        return mapToDto(saved);
    }

    /**
     * Respond to a contact message.
     */
    public ContactMessageDto respondToMessage(Long id, ContactResponseRequest request, Long adminId) {
        ContactMessage message = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        
        message.setResponse(request.getResponse());
        message.setAdminNotes(request.getAdminNotes());
        message.setRespondedAt(LocalDateTime.now());
        message.setRespondedBy(adminId);
        message.setStatus(request.getStatus() != null ? request.getStatus() : "RESOLVED");
        
        ContactMessage saved = contactRepository.save(message);
        
        // Send response email to user
        try {
            emailService.sendContactResponse(
                saved.getEmail(),
                saved.getFirstName(),
                saved.getSubject(),
                saved.getResponse(),
                saved.getId()
            );
        } catch (Exception e) {
            log.error("Failed to send response email", e);
        }
        
        return mapToDto(saved);
    }

    /**
     * Add admin notes.
     */
    public ContactMessageDto addAdminNotes(Long id, String notes) {
        ContactMessage message = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        
        String existingNotes = message.getAdminNotes() != null ? message.getAdminNotes() + "\n\n" : "";
        message.setAdminNotes(existingNotes + "[" + LocalDateTime.now() + "]\n" + notes);
        
        ContactMessage saved = contactRepository.save(message);
        return mapToDto(saved);
    }

    /**
     * Delete a message.
     */
    public void deleteMessage(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new EntityNotFoundException("Contact message not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    /**
     * Get contact statistics.
     */
    @Transactional(readOnly = true)
    public ContactStatsDto getStatistics() {
        ContactStatsDto stats = new ContactStatsDto();
        
        stats.setTotalMessages(contactRepository.count());
        stats.setNewMessages(contactRepository.countByStatus("NEW"));
        stats.setInProgressMessages(contactRepository.countByStatus("IN_PROGRESS"));
        stats.setResolvedMessages(contactRepository.countByStatus("RESOLVED"));
        
        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime weekAgo = today.minusWeeks(1);
        LocalDateTime monthAgo = today.minusMonths(1);
        
        stats.setTodayMessages(contactRepository.countByCreatedAtAfter(today));
        stats.setThisWeekMessages(contactRepository.countByCreatedAtAfter(weekAgo));
        stats.setThisMonthMessages(contactRepository.countByCreatedAtAfter(monthAgo));
        
        // Calculate average response time (simplified)
        stats.setAverageResponseTimeHours(24.0); // Placeholder
        
        return stats;
    }

    /**
     * Get recent messages.
     */
    @Transactional(readOnly = true)
    public List<ContactMessageDto> getRecentMessages(int limit) {
        return contactRepository.findRecent(PageRequest.of(0, limit))
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    /**
     * Get high priority new messages.
     */
    @Transactional(readOnly = true)
    public List<ContactMessageDto> getHighPriorityMessages() {
        return contactRepository.findHighPriorityNew()
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    // Helper methods

    private String determinePriority(ContactRequest request) {
        String subject = request.getSubject().toLowerCase();
        String message = request.getMessage().toLowerCase();
        
        // Check for urgent keywords
        if (subject.contains("urgent") || message.contains("urgent") ||
            subject.contains("emergency") || message.contains("deadline")) {
            return "HIGH";
        }
        
        // Check for complaint category
        if ("COMPLAINT".equals(request.getCategory())) {
            return "HIGH";
        }
        
        return "NORMAL";
    }

    private ContactMessageDto mapToDto(ContactMessage message) {
        ContactMessageDto dto = new ContactMessageDto();
        dto.setId(message.getId());
        dto.setFirstName(message.getFirstName());
        dto.setLastName(message.getLastName());
        dto.setFullName(message.getFullName());
        dto.setEmail(message.getEmail());
        dto.setPhone(message.getPhone());
        dto.setSubject(message.getSubject());
        dto.setMessage(message.getMessage());
        dto.setStatus(message.getStatus());
        dto.setCategory(message.getCategory());
        dto.setPriority(message.getPriority());
        dto.setAssignedTo(message.getAssignedTo());
        dto.setAdminNotes(message.getAdminNotes());
        dto.setResponse(message.getResponse());
        dto.setRespondedAt(message.getRespondedAt());
        dto.setRespondedBy(message.getRespondedBy());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setUpdatedAt(message.getUpdatedAt());
        return dto;
    }

    private PagedResponse<ContactMessageDto> createPagedResponse(Page<ContactMessage> page) {
        List<ContactMessageDto> content = page.getContent().stream()
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
}
