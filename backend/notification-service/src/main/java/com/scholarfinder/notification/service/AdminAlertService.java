package com.scholarfinder.notification.service;

import com.scholarfinder.notification.dto.AdminAlertDto;
import com.scholarfinder.notification.dto.PagedResponse;
import com.scholarfinder.notification.entity.EmailNotification;
import com.scholarfinder.notification.repository.EmailNotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminAlertService {

    private final EmailNotificationRepository emailNotificationRepository;

    public AdminAlertService(EmailNotificationRepository emailNotificationRepository) {
        this.emailNotificationRepository = emailNotificationRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<AdminAlertDto> getRecentAlerts(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        PageRequest pageRequest = PageRequest.of(
            safePage,
            safeSize,
            Sort.by(Sort.Direction.DESC, "createdAt", "id")
        );

        Page<EmailNotification> alertPage = emailNotificationRepository.findAll(pageRequest);
        List<AdminAlertDto> alerts = alertPage.getContent().stream()
            .map(this::mapToDto)
            .toList();

        return new PagedResponse<>(
            alerts,
            alertPage.getNumber(),
            alertPage.getSize(),
            alertPage.getTotalElements(),
            alertPage.getTotalPages(),
            alertPage.isFirst(),
            alertPage.isLast()
        );
    }

    private AdminAlertDto mapToDto(EmailNotification notification) {
        AdminAlertDto dto = new AdminAlertDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getSubject());
        dto.setMessage(notification.getBody());
        dto.setStatus(notification.getStatus());
        dto.setSeverity(severityFor(notification.getStatus()));
        dto.setNotificationType(notification.getNotificationType());
        dto.setReferenceType(notification.getReferenceType());
        dto.setReferenceId(notification.getReferenceId());
        dto.setRecipientEmail(notification.getRecipientEmail());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setSentAt(notification.getSentAt());
        dto.setErrorMessage(notification.getErrorMessage());
        return dto;
    }

    private String severityFor(String status) {
        if ("FAILED".equals(status)) {
            return "ERROR";
        }
        if ("RETRY".equals(status) || "PENDING".equals(status)) {
            return "WARNING";
        }
        return "INFO";
    }
}
