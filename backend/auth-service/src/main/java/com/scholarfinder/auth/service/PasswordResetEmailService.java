package com.scholarfinder.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarfinder.auth.exception.AuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetEmailService {

    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(10);
    private static final DateTimeFormatter EMAIL_TIME_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(CONNECT_TIMEOUT)
            .build();

    @Value("${app.notifications.base-url:http://localhost:8085}")
    private String notificationBaseUrl;

    public void sendResetCode(String email, String resetCode, LocalDateTime expiresAt) {
        String endpoint = notificationEndpoint();
        String body = buildResetEmailBody(resetCode, expiresAt);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("recipientEmail", email);
        payload.put("recipientName", displayNameFromEmail(email));
        payload.put("subject", "Your Scholar Finder password reset code");
        payload.put("message", body);
        payload.put("notificationType", "PASSWORD_RESET");
        payload.put("referenceType", "AUTH_PASSWORD_RESET");

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .timeout(REQUEST_TIMEOUT)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("Password reset email request failed with status {}: {}",
                        response.statusCode(), response.body());
                throw new AuthException("Could not send reset email. Please try again later.");
            }
        } catch (JsonProcessingException e) {
            throw new AuthException("Could not prepare reset email. Please try again later.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AuthException("Could not send reset email. Please try again later.");
        } catch (IOException | IllegalArgumentException e) {
            log.error("Password reset email request failed", e);
            throw new AuthException("Could not send reset email. Please try again later.");
        }
    }

    private String notificationEndpoint() {
        String baseUrl = notificationBaseUrl == null ? "" : notificationBaseUrl.trim();
        if (baseUrl.isBlank()) {
            throw new AuthException("Notification service URL is not configured.");
        }

        while (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl + "/api/notifications/alert";
    }

    private String buildResetEmailBody(String resetCode, LocalDateTime expiresAt) {
        return String.format(
                """
                Hello,

                Use this password reset code to create a new Scholar Finder password:

                %s

                This code expires at %s.

                If you did not request this reset, you can safely ignore this email.

                Best regards,
                Scholar Finder Team
                """,
                resetCode,
                expiresAt.format(EMAIL_TIME_FORMAT)
        );
    }

    private String displayNameFromEmail(String email) {
        if (email == null || email.isBlank()) {
            return "Scholar Finder member";
        }

        int atIndex = email.indexOf('@');
        if (atIndex <= 0) {
            return "Scholar Finder member";
        }

        return email.substring(0, atIndex);
    }
}
