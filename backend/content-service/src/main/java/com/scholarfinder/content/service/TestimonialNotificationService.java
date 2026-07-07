package com.scholarfinder.content.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarfinder.content.entity.Testimonial;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class TestimonialNotificationService {

    private static final Logger log = LoggerFactory.getLogger(TestimonialNotificationService.class);
    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(10);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(CONNECT_TIMEOUT)
        .build();

    @Value("${app.notifications.base-url:http://localhost:8085}")
    private String notificationBaseUrl;

    @Value("${app.mail.admin-email:admin@scholarfinder.lk}")
    private String adminEmail;

    public TestimonialNotificationService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void notifyAdminOfSubmission(Testimonial testimonial) {
        if (testimonial == null || testimonial.getId() == null) {
            return;
        }

        String scholarName = displayName(testimonial);
        String message = String.format(
            """
            A new success story is waiting for admin review.

            Story ID: %d
            Submitted by: %s
            Email: %s
            Scholarship: %s
            University: %s

            Please log in to the Scholar Finder admin portal to approve or reject this story.
            """,
            testimonial.getId(),
            scholarName,
            safeText(testimonial.getSubmitterEmail(), "Not provided"),
            safeText(testimonial.getScholarshipName(), "Not provided"),
            safeText(testimonial.getUniversity(), "Not provided")
        );

        sendAlert(
            adminEmail,
            "Admin",
            "[Success Story] New story pending review",
            message,
            "SUCCESS_STORY_SUBMITTED",
            testimonial.getId(),
            "TESTIMONIAL"
        );
    }

    public void notifySubmitterOfRejection(Testimonial testimonial) {
        if (testimonial == null || isBlank(testimonial.getSubmitterEmail())) {
            log.warn("Skipping success story rejection email because submitter email is missing");
            return;
        }

        String reason = isBlank(testimonial.getRejectionReason())
            ? "Our admin team could not approve it for publication at this time."
            : testimonial.getRejectionReason().trim();

        String message = String.format(
            """
            Dear %s,

            Thank you for sharing your Scholar Finder success story.

            After review, our admin team could not approve your story for publication at this time.

            Reason:
            %s

            You can update your story and submit a new version whenever you are ready.

            Best regards,
            Scholar Finder Team
            """,
            displayName(testimonial),
            reason
        );

        sendAlert(
            testimonial.getSubmitterEmail(),
            displayName(testimonial),
            "Your Scholar Finder success story was not approved",
            message,
            "SUCCESS_STORY_REJECTED",
            testimonial.getId(),
            "TESTIMONIAL"
        );
    }

    public void notifySubmitterOfApproval(Testimonial testimonial) {
        if (testimonial == null || isBlank(testimonial.getSubmitterEmail())) {
            log.warn("Skipping success story approval email because submitter email is missing");
            return;
        }

        String message = String.format(
            """
            Dear %s,

            Good news! Your Scholar Finder success story has been approved by our admin team.

            It is now published on the Success Stories page for students to read. Thank you for sharing your journey and helping encourage other scholarship applicants.

            Scholarship: %s
            University: %s

            Best regards,
            Scholar Finder Team
            """,
            displayName(testimonial),
            safeText(testimonial.getScholarshipName(), "Not provided"),
            safeText(testimonial.getUniversity(), "Not provided")
        );

        sendAlert(
            testimonial.getSubmitterEmail(),
            displayName(testimonial),
            "Your Scholar Finder success story was approved",
            message,
            "SUCCESS_STORY_APPROVED",
            testimonial.getId(),
            "TESTIMONIAL"
        );
    }

    private void sendAlert(String recipientEmail, String recipientName, String subject, String message,
                           String notificationType, Long referenceId, String referenceType) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("recipientEmail", recipientEmail);
        payload.put("recipientName", recipientName);
        payload.put("subject", subject);
        payload.put("message", message);
        payload.put("notificationType", notificationType);
        payload.put("referenceId", referenceId);
        payload.put("referenceType", referenceType);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(notificationEndpoint()))
                .timeout(REQUEST_TIMEOUT)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Notification request failed with status {}: {}", response.statusCode(), response.body());
            }
        } catch (JsonProcessingException e) {
            log.warn("Could not prepare success story notification payload", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Success story notification request was interrupted", e);
        } catch (IOException | IllegalArgumentException e) {
            log.warn("Success story notification request failed", e);
        }
    }

    private String notificationEndpoint() {
        String baseUrl = notificationBaseUrl == null ? "" : notificationBaseUrl.trim();
        while (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        if (baseUrl.isBlank()) {
            throw new IllegalArgumentException("Notification service URL is not configured");
        }
        return baseUrl + "/api/notifications/alert";
    }

    private String displayName(Testimonial testimonial) {
        if (testimonial != null && !isBlank(testimonial.getScholarName())) {
            return testimonial.getScholarName().trim();
        }
        return "Scholar Finder member";
    }

    private String safeText(String value, String fallback) {
        return isBlank(value) ? fallback : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
