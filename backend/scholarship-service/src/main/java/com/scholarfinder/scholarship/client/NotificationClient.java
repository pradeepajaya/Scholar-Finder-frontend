package com.scholarfinder.scholarship.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

/**
 * Feign client for inter-service communication with the notification-service.
 * Used to send alerts/notifications to institutions when scholarships are modified.
 */
@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationClient {

    /**
     * Send an alert notification to a recipient (e.g., an institution).
     *
     * @param alertRequest map containing: recipientEmail, recipientName, subject, message,
     *                     notificationType, referenceId, referenceType
     */
    @PostMapping("/alert")
    void sendAlert(@RequestBody Map<String, Object> alertRequest);
}
