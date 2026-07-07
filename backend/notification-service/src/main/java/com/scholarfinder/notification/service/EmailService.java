package com.scholarfinder.notification.service;

import com.scholarfinder.notification.entity.EmailNotification;
import com.scholarfinder.notification.repository.EmailNotificationRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final EmailNotificationRepository emailRepository;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.admin-email}")
    private String adminEmail;

    @Value("${app.mail.support-email}")
    private String supportEmail;

    public EmailService(JavaMailSender mailSender, 
                       TemplateEngine templateEngine,
                       EmailNotificationRepository emailRepository) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.emailRepository = emailRepository;
    }

    /**
     * Send a simple email.
     */
    @Async
    public void sendEmail(String to, String subject, String body) {
        sendEmail(to, null, subject, body, null);
    }

    /**
     * Send an email with HTML content.
     */
    @Async
    public void sendEmail(String to, String recipientName, String subject, String body, String htmlBody) {
        EmailNotification notification = new EmailNotification();
        notification.setRecipientEmail(to);
        notification.setRecipientName(recipientName);
        notification.setSubject(subject);
        notification.setBody(body);
        notification.setBodyHtml(htmlBody);
        notification.setStatus("PENDING");
        
        emailRepository.save(notification);
        
        processEmail(notification);
    }

    /**
     * Send an alert email and keep its notification metadata for auditing.
     */
    public EmailNotification sendAlertEmail(String to, String recipientName, String subject, String body,
                                            String notificationType, Long referenceId, String referenceType) {
        EmailNotification notification = new EmailNotification();
        notification.setRecipientEmail(to);
        notification.setRecipientName(recipientName);
        notification.setSubject(subject);
        notification.setBody(body);
        notification.setNotificationType(notificationType);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);
        notification.setStatus("PENDING");

        emailRepository.save(notification);
        return processEmail(notification);
    }

    /**
     * Send an admin announcement and return the tracked notification status.
     */
    public EmailNotification sendAnnouncementEmail(String to, String recipientName, String subject, String message) {
        return sendAnnouncementEmail(to, recipientName, subject, message, null);
    }

    /**
     * Send an admin announcement and keep a duplicate-tracking key for later sends.
     */
    public EmailNotification sendAnnouncementEmail(String to, String recipientName, String subject, String message,
                                                   String dedupeKey) {
        String greetingName = recipientName == null || recipientName.isBlank()
            ? "Scholar Finder member"
            : recipientName.trim();
        String body = String.format(
            "Dear %s,\n\n%s\n\nBest regards,\nScholar Finder Team",
            greetingName,
            message
        );

        EmailNotification notification = new EmailNotification();
        notification.setRecipientEmail(to);
        notification.setRecipientName(recipientName);
        notification.setSubject(subject);
        notification.setBody(body);
        notification.setBodyHtml(buildAnnouncementHtml(greetingName, message));
        notification.setNotificationType("ADMIN_ANNOUNCEMENT");
        notification.setReferenceType("ADMIN_ANNOUNCEMENT");
        notification.setTemplateData(dedupeKey);
        notification.setStatus("PENDING");

        emailRepository.save(notification);
        return processEmail(notification);
    }

    /**
     * Send an email using a template.
     */
    @Async
    public void sendTemplatedEmail(String to, String recipientName, String subject, 
                                   String templateName, Map<String, Object> templateData,
                                   String notificationType, Long referenceId, String referenceType) {
        try {
            // Process template
            Context context = new Context();
            context.setVariables(templateData);
            String htmlContent = templateEngine.process(templateName, context);
            
            // Create notification record
            EmailNotification notification = new EmailNotification();
            notification.setRecipientEmail(to);
            notification.setRecipientName(recipientName);
            notification.setSubject(subject);
            notification.setBody(htmlContent); // Plain text fallback
            notification.setBodyHtml(htmlContent);
            notification.setTemplateName(templateName);
            notification.setNotificationType(notificationType);
            notification.setReferenceId(referenceId);
            notification.setReferenceType(referenceType);
            notification.setStatus("PENDING");
            
            emailRepository.save(notification);
            
            processEmail(notification);
        } catch (Exception e) {
            log.error("Failed to process email template: {}", templateName, e);
        }
    }

    /**
     * Send contact form confirmation to user.
     */
    public void sendContactConfirmation(String to, String firstName, String subject, Long contactId) {
        String emailSubject = "We received your message - Scholar Finder";
        String body = String.format(
            "Dear %s,\n\n" +
            "Thank you for contacting Scholar Finder. We have received your message regarding:\n\n" +
            "\"%s\"\n\n" +
            "Our support team will review your inquiry and get back to you within 24-48 hours.\n\n" +
            "Your reference number is: #%d\n\n" +
            "If you have any urgent matters, please don't hesitate to reach out to us at %s.\n\n" +
            "Best regards,\n" +
            "Scholar Finder Support Team",
            firstName, subject, contactId, supportEmail
        );
        
        EmailNotification notification = new EmailNotification();
        notification.setRecipientEmail(to);
        notification.setRecipientName(firstName);
        notification.setSubject(emailSubject);
        notification.setBody(body);
        notification.setNotificationType("CONTACT_CONFIRMATION");
        notification.setReferenceId(contactId);
        notification.setReferenceType("CONTACT_MESSAGE");
        notification.setStatus("PENDING");
        
        emailRepository.save(notification);
        processEmail(notification);
    }

    /**
     * Send contact form notification to admin.
     */
    public void sendContactNotificationToAdmin(String senderName, String senderEmail, 
                                                String subject, String message, Long contactId) {
        String emailSubject = "[Contact Form] New message from " + senderName;
        String body = String.format(
            "New contact form submission received:\n\n" +
            "Reference: #%d\n" +
            "From: %s <%s>\n" +
            "Subject: %s\n\n" +
            "Message:\n%s\n\n" +
            "---\n" +
            "Please log in to the admin portal to respond to this message.",
            contactId, senderName, senderEmail, subject, message
        );
        
        EmailNotification notification = new EmailNotification();
        notification.setRecipientEmail(adminEmail);
        notification.setRecipientName("Admin");
        notification.setSubject(emailSubject);
        notification.setBody(body);
        notification.setNotificationType("CONTACT_ADMIN_NOTIFICATION");
        notification.setReferenceId(contactId);
        notification.setReferenceType("CONTACT_MESSAGE");
        notification.setStatus("PENDING");
        
        emailRepository.save(notification);
        processEmail(notification);
    }

    /**
     * Send response to contact message.
     */
    public void sendContactResponse(String to, String firstName, String originalSubject, 
                                    String response, Long contactId) {
        String emailSubject = "Re: " + originalSubject + " - Scholar Finder";
        String body = String.format(
            "Dear %s,\n\n" +
            "Thank you for contacting Scholar Finder. Here is our response to your inquiry:\n\n" +
            "---\n%s\n---\n\n" +
            "Reference number: #%d\n\n" +
            "If you have any further questions, please feel free to reply to this email.\n\n" +
            "Best regards,\n" +
            "Scholar Finder Support Team",
            firstName, response, contactId
        );
        
        EmailNotification notification = new EmailNotification();
        notification.setRecipientEmail(to);
        notification.setRecipientName(firstName);
        notification.setSubject(emailSubject);
        notification.setBody(body);
        notification.setNotificationType("CONTACT_RESPONSE");
        notification.setReferenceId(contactId);
        notification.setReferenceType("CONTACT_MESSAGE");
        notification.setStatus("PENDING");
        
        emailRepository.save(notification);
        processEmail(notification);
    }

    /**
     * Process and send an email notification.
     */
    private EmailNotification processEmail(EmailNotification notification) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String from = requireText(fromEmail, "From email");
            String to = requireText(notification.getRecipientEmail(), "Recipient email");
            String subject = requireText(notification.getSubject(), "Email subject");
            String body = requireText(notification.getBody(), "Email body");
            String bodyHtml = notification.getBodyHtml();

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);

            if (bodyHtml != null && !bodyHtml.isBlank()) {
                helper.setText(body, bodyHtml);
            } else {
                helper.setText(body);
            }
            
            mailSender.send(message);
            
            notification.setStatus("SENT");
            notification.setSentAt(LocalDateTime.now());
            emailRepository.save(notification);
            
            log.info("Email sent successfully to: {}", notification.getRecipientEmail());
        } catch (Exception e) {
            log.error("Failed to send email to: {}", notification.getRecipientEmail(), e);

            int retryCount = notification.getRetryCount() == null ? 0 : notification.getRetryCount();
            int maxRetries = notification.getMaxRetries() == null ? 3 : notification.getMaxRetries();
            int nextRetryCount = retryCount + 1;

            notification.setStatus(nextRetryCount >= maxRetries ? "FAILED" : "RETRY");
            notification.setRetryCount(nextRetryCount);
            notification.setErrorMessage(errorMessage(e));
            emailRepository.save(notification);
        }

        return notification;
    }

    /**
     * Scheduled job to process pending emails.
     */
    @Scheduled(fixedDelay = 60000) // Every minute
    public void processPendingEmails() {
        List<EmailNotification> pendingEmails = emailRepository.findPendingEmails(LocalDateTime.now());
        
        for (EmailNotification email : pendingEmails) {
            processEmail(email);
        }
    }

    /**
     * Scheduled job to retry failed emails.
     */
    @Scheduled(fixedDelay = 300000) // Every 5 minutes
    public void retryFailedEmails() {
        List<EmailNotification> retryableEmails = emailRepository.findRetryableEmails();
        
        for (EmailNotification email : retryableEmails) {
            log.info("Retrying email {} (attempt {})", email.getId(), email.getRetryCount() + 1);
            processEmail(email);
        }
    }

    private String requireText(String value, String label) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(label + " is required");
        }
        return value;
    }

    private String errorMessage(Exception e) {
        String message = e.getMessage();
        return message == null || message.isBlank() ? e.getClass().getSimpleName() : message;
    }

    private String buildAnnouncementHtml(String greetingName, String message) {
        String escapedMessage = escapeHtml(message)
            .replace("\r\n", "\n")
            .replace("\r", "\n")
            .replace("\n", "<br>");

        return """
            <!doctype html>
            <html>
              <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
                <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
                  <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:28px;">
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Dear %s,</p>
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">%s</p>
                    <p style="margin:0;font-size:15px;line-height:1.5;color:#475569;">
                      Best regards,<br>Scholar Finder Team
                    </p>
                  </div>
                </div>
              </body>
            </html>
            """.formatted(escapeHtml(greetingName), escapedMessage);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }

        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}
