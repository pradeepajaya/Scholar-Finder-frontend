package com.scholarfinder.notification.dto;

public class AnnouncementFailureDto {

    private String recipientEmail;
    private String status;
    private String errorMessage;

    public AnnouncementFailureDto() {}

    public AnnouncementFailureDto(String recipientEmail, String status, String errorMessage) {
        this.recipientEmail = recipientEmail;
        this.status = status;
        this.errorMessage = errorMessage;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
