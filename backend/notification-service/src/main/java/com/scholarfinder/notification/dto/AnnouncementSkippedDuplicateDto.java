package com.scholarfinder.notification.dto;

public class AnnouncementSkippedDuplicateDto {

    private String recipientEmail;
    private String recipientName;
    private String reason;

    public AnnouncementSkippedDuplicateDto() {}

    public AnnouncementSkippedDuplicateDto(String recipientEmail, String recipientName, String reason) {
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.reason = reason;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
