package com.scholarfinder.notification.repository;

import com.scholarfinder.notification.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    /**
     * Find messages by status.
     */
    Page<ContactMessage> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    /**
     * Find messages by category.
     */
    Page<ContactMessage> findByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);

    /**
     * Find messages by priority.
     */
    Page<ContactMessage> findByPriorityOrderByCreatedAtDesc(String priority, Pageable pageable);

    /**
     * Find messages assigned to a specific admin.
     */
    Page<ContactMessage> findByAssignedToOrderByCreatedAtDesc(Long assignedTo, Pageable pageable);

    /**
     * Find messages by email.
     */
    List<ContactMessage> findByEmailOrderByCreatedAtDesc(String email);

    /**
     * Search messages by subject or content.
     */
    @Query("SELECT c FROM ContactMessage c WHERE " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY c.createdAt DESC")
    Page<ContactMessage> search(@Param("query") String query, Pageable pageable);

    /**
     * Find all messages ordered by creation date.
     */
    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Count messages by status.
     */
    long countByStatus(String status);

    /**
     * Count messages created after a specific date.
     */
    long countByCreatedAtAfter(LocalDateTime date);

    /**
     * Count messages created between dates.
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Find unassigned messages.
     */
    @Query("SELECT c FROM ContactMessage c WHERE c.assignedTo IS NULL AND c.status IN ('NEW', 'READ') ORDER BY c.priority DESC, c.createdAt ASC")
    List<ContactMessage> findUnassigned();

    /**
     * Find high priority new messages.
     */
    @Query("SELECT c FROM ContactMessage c WHERE c.priority IN ('HIGH', 'URGENT') AND c.status = 'NEW' ORDER BY c.createdAt ASC")
    List<ContactMessage> findHighPriorityNew();

    /**
     * Get recent messages.
     */
    @Query("SELECT c FROM ContactMessage c ORDER BY c.createdAt DESC")
    List<ContactMessage> findRecent(Pageable pageable);
}
