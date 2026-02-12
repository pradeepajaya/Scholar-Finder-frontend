package com.scholarfinder.notification.repository;

import com.scholarfinder.notification.entity.EmailNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {

    /**
     * Find pending emails that need to be sent.
     */
    @Query("SELECT e FROM EmailNotification e WHERE e.status = 'PENDING' " +
           "AND (e.scheduledAt IS NULL OR e.scheduledAt <= :now) " +
           "ORDER BY e.createdAt ASC")
    List<EmailNotification> findPendingEmails(@Param("now") LocalDateTime now);

    /**
     * Find failed emails that can be retried.
     */
    @Query("SELECT e FROM EmailNotification e WHERE e.status = 'RETRY' " +
           "AND e.retryCount < e.maxRetries " +
           "ORDER BY e.createdAt ASC")
    List<EmailNotification> findRetryableEmails();

    /**
     * Find emails by status.
     */
    Page<EmailNotification> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    /**
     * Find emails by notification type.
     */
    Page<EmailNotification> findByNotificationTypeOrderByCreatedAtDesc(String notificationType, Pageable pageable);

    /**
     * Find emails by reference.
     */
    List<EmailNotification> findByReferenceIdAndReferenceType(Long referenceId, String referenceType);

    /**
     * Find emails sent to a specific recipient.
     */
    Page<EmailNotification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail, Pageable pageable);

    /**
     * Count emails by status.
     */
    long countByStatus(String status);

    /**
     * Count emails sent after a specific date.
     */
    long countBySentAtAfter(LocalDateTime date);

    /**
     * Find emails sent between dates.
     */
    List<EmailNotification> findBySentAtBetween(LocalDateTime start, LocalDateTime end);
}
