package com.scholarfinder.notification.controller;

import com.scholarfinder.notification.dto.AdminAlertDto;
import com.scholarfinder.notification.dto.AlertRequest;
import com.scholarfinder.notification.dto.AnnouncementRequest;
import com.scholarfinder.notification.dto.AnnouncementResponse;
import com.scholarfinder.notification.dto.ApiResponse;
import com.scholarfinder.notification.dto.AudienceCountsResponse;
import com.scholarfinder.notification.dto.PagedResponse;
import com.scholarfinder.notification.service.AdminAlertService;
import com.scholarfinder.notification.service.AnnouncementService;
import com.scholarfinder.notification.service.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling notification/alert requests from other microservices.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    private final EmailService emailService;
    private final AnnouncementService announcementService;
    private final AdminAlertService adminAlertService;

    public NotificationController(EmailService emailService,
                                  AnnouncementService announcementService,
                                  AdminAlertService adminAlertService) {
        this.emailService = emailService;
        this.announcementService = announcementService;
        this.adminAlertService = adminAlertService;
    }

    /**
     * Send an alert/notification email.
     *
     * POST /api/notifications/alert
     */
    @PostMapping("/alert")
    public ResponseEntity<ApiResponse<String>> sendAlert(@Valid @RequestBody AlertRequest request) {
        log.info("Received alert request for: {} (type: {})", request.getRecipientEmail(), request.getNotificationType());

        try {
            emailService.sendAlertEmail(
                request.getRecipientEmail(),
                request.getRecipientName(),
                request.getSubject(),
                request.getMessage(),
                request.getNotificationType(),
                request.getReferenceId(),
                request.getReferenceType()
            );

            return ResponseEntity.ok(ApiResponse.success("Alert sent successfully", "Notification dispatched"));
        } catch (Exception e) {
            log.error("Failed to send alert: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to send alert: " + e.getMessage()));
        }
    }

    /**
     * Send an admin announcement to real account emails or a custom recipient list.
     *
     * POST /api/notifications/announcements
     */
    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> sendAnnouncement(
            @Valid @RequestBody AnnouncementRequest request) {
        log.info("Received announcement request for audience: {}", request.getRecipientGroup());

        AnnouncementResponse response = announcementService.sendAnnouncement(request);
        boolean fullySent = response.getFailedCount() == 0;
        String message = fullySent
            ? String.format("Announcement sent to %d recipient(s).", response.getSentCount())
            : String.format(
                "Announcement sent to %d recipient(s); %d recipient(s) failed.",
                response.getSentCount(),
                response.getFailedCount()
            );

        return ResponseEntity.ok(new ApiResponse<>(fullySent, message, response));
    }

    /**
     * Count active announcement recipients for the admin compose UI.
     */
    @GetMapping("/announcements/audience-counts")
    public ResponseEntity<ApiResponse<AudienceCountsResponse>> getAudienceCounts(
            @RequestParam(defaultValue = "true") boolean verifiedOnly) {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getAudienceCounts(verifiedOnly)));
    }

    /**
     * Get recent alerts for the admin portal bell.
     */
    @GetMapping("/admin/alerts")
    public ResponseEntity<ApiResponse<PagedResponse<AdminAlertDto>>> getAdminAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(adminAlertService.getRecentAlerts(page, size)));
    }

    /**
     * Health check for notification service.
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", "Notification service is running"));
    }
}
