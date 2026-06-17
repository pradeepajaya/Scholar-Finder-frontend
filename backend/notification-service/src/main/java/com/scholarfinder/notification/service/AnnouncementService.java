package com.scholarfinder.notification.service;

import com.scholarfinder.notification.dto.AnnouncementFailureDto;
import com.scholarfinder.notification.dto.AnnouncementRecipientGroup;
import com.scholarfinder.notification.dto.AnnouncementRequest;
import com.scholarfinder.notification.dto.AnnouncementResponse;
import com.scholarfinder.notification.dto.AudienceCountsResponse;
import com.scholarfinder.notification.entity.EmailNotification;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class AnnouncementService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final EmailService emailService;

    public AnnouncementService(NamedParameterJdbcTemplate jdbcTemplate, EmailService emailService) {
        this.jdbcTemplate = jdbcTemplate;
        this.emailService = emailService;
    }

    public AudienceCountsResponse getAudienceCounts(boolean verifiedOnly) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("verifiedOnly", verifiedOnly)
            .addValue("roles", List.of("STUDENT", "INSTITUTION"));

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            """
            SELECT role, COUNT(*) AS total
            FROM auth.users
            WHERE is_active = TRUE
              AND (:verifiedOnly = FALSE OR is_verified = TRUE)
              AND role IN (:roles)
            GROUP BY role
            """,
            params
        );

        Map<String, Long> counts = new LinkedHashMap<>();
        for (Map<String, Object> row : rows) {
            counts.put((String) row.get("role"), ((Number) row.get("total")).longValue());
        }

        return new AudienceCountsResponse(
            counts.getOrDefault("STUDENT", 0L),
            counts.getOrDefault("INSTITUTION", 0L)
        );
    }

    public AnnouncementResponse sendAnnouncement(AnnouncementRequest request) {
        List<Recipient> recipients = resolveRecipients(request);
        if (recipients.isEmpty()) {
            throw new IllegalArgumentException("No recipients found for the selected audience.");
        }

        AnnouncementResponse response = new AnnouncementResponse();
        response.setRecipientGroup(request.getRecipientGroup());
        response.setRecipientCount(recipients.size());
        response.setSentAt(LocalDateTime.now());

        int sentCount = 0;
        List<AnnouncementFailureDto> failures = new ArrayList<>();

        for (Recipient recipient : recipients) {
            EmailNotification notification = emailService.sendAnnouncementEmail(
                recipient.email(),
                recipient.name(),
                request.getSubject().trim(),
                request.getMessage().trim()
            );

            if ("SENT".equals(notification.getStatus())) {
                sentCount++;
            } else {
                failures.add(new AnnouncementFailureDto(
                    recipient.email(),
                    notification.getStatus(),
                    notification.getErrorMessage()
                ));
            }
        }

        response.setSentCount(sentCount);
        response.setFailedCount(failures.size());
        response.setFailures(failures);

        return response;
    }

    private List<Recipient> resolveRecipients(AnnouncementRequest request) {
        AnnouncementRecipientGroup recipientGroup = request.getRecipientGroup();
        if (recipientGroup == AnnouncementRecipientGroup.CUSTOM) {
            return customRecipients(request.getRecipientEmails());
        }

        boolean verifiedOnly = Boolean.TRUE.equals(request.getVerifiedOnly());
        return accountRecipients(rolesFor(recipientGroup), verifiedOnly);
    }

    private List<Recipient> accountRecipients(List<String> roles, boolean verifiedOnly) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("roles", roles)
            .addValue("verifiedOnly", verifiedOnly);

        List<Recipient> recipients = jdbcTemplate.query(
            """
            SELECT
                u.email,
                COALESCE(
                    NULLIF(sp.full_name, ''),
                    NULLIF(ip.institution_name, ''),
                    split_part(u.email, '@', 1)
                ) AS recipient_name
            FROM auth.users u
            LEFT JOIN users.student_profiles sp ON sp.user_id = u.id
            LEFT JOIN users.institution_profiles ip ON ip.user_id = u.id
            WHERE u.is_active = TRUE
              AND (:verifiedOnly = FALSE OR u.is_verified = TRUE)
              AND u.role IN (:roles)
            ORDER BY u.email
            """,
            params,
            (rs, rowNum) -> new Recipient(rs.getString("email"), rs.getString("recipient_name"))
        );

        return dedupeRecipients(recipients);
    }

    private List<String> rolesFor(AnnouncementRecipientGroup recipientGroup) {
        if (recipientGroup == AnnouncementRecipientGroup.STUDENTS) {
            return List.of("STUDENT");
        }
        if (recipientGroup == AnnouncementRecipientGroup.INSTITUTIONS) {
            return List.of("INSTITUTION");
        }
        return List.of("STUDENT", "INSTITUTION");
    }

    private List<Recipient> customRecipients(List<String> emails) {
        if (emails == null || emails.isEmpty()) {
            throw new IllegalArgumentException("Add at least one recipient email.");
        }

        List<Recipient> recipients = new ArrayList<>();
        for (String email : emails) {
            String normalizedEmail = normalizeEmail(email);
            if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
                throw new IllegalArgumentException("Invalid recipient email: " + email);
            }
            recipients.add(new Recipient(normalizedEmail, null));
        }

        return dedupeRecipients(recipients);
    }

    private List<Recipient> dedupeRecipients(List<Recipient> recipients) {
        LinkedHashMap<String, Recipient> deduped = new LinkedHashMap<>();
        for (Recipient recipient : recipients) {
            String normalizedEmail = normalizeEmail(recipient.email());
            if (!normalizedEmail.isBlank()) {
                deduped.putIfAbsent(normalizedEmail, new Recipient(normalizedEmail, recipient.name()));
            }
        }
        return new ArrayList<>(deduped.values());
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private record Recipient(String email, String name) {}
}
