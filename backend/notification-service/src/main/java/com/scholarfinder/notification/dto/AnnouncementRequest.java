package com.scholarfinder.notification.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class AnnouncementRequest {

    @NotNull(message = "Recipient group is required")
    private AnnouncementRecipientGroup recipientGroup = AnnouncementRecipientGroup.ALL;

    @NotBlank(message = "Subject is required")
    @Size(max = 255, message = "Subject must be 255 characters or less")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(max = 10000, message = "Message must be 10000 characters or less")
    private String message;

    @Size(max = 500, message = "Duplicate tracking key must be 500 characters or less")
    private String dedupeKey;

    private Boolean verifiedOnly = true;

    @Size(max = 500, message = "Announcements can be sent to at most 500 custom recipients")
    private List<@NotBlank(message = "Recipient email cannot be blank") @Email(message = "Recipient email must be valid") String> recipientEmails = new ArrayList<>();

    @Valid
    @Size(max = 500, message = "Announcements can be sent to at most 500 custom recipients")
    private List<AnnouncementRecipientDto> recipients = new ArrayList<>();

    public AnnouncementRecipientGroup getRecipientGroup() {
        return recipientGroup;
    }

    public void setRecipientGroup(AnnouncementRecipientGroup recipientGroup) {
        this.recipientGroup = recipientGroup;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getVerifiedOnly() {
        return verifiedOnly;
    }

    public void setVerifiedOnly(Boolean verifiedOnly) {
        this.verifiedOnly = verifiedOnly;
    }

    public String getDedupeKey() {
        return dedupeKey;
    }

    public void setDedupeKey(String dedupeKey) {
        this.dedupeKey = dedupeKey;
    }

    public List<String> getRecipientEmails() {
        return recipientEmails;
    }

    public void setRecipientEmails(List<String> recipientEmails) {
        this.recipientEmails = recipientEmails == null ? new ArrayList<>() : recipientEmails;
    }

    public List<AnnouncementRecipientDto> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<AnnouncementRecipientDto> recipients) {
        this.recipients = recipients == null ? new ArrayList<>() : recipients;
    }
}
