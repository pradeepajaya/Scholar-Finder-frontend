package com.scholarfinder.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for responding to a contact message.
 */
public class ContactResponseRequest {

    @NotBlank(message = "Response message is required")
    @Size(min = 10, max = 5000, message = "Response must be between 10 and 5000 characters")
    private String response;

    private String adminNotes;

    private String status; // Optional: defaults to RESOLVED

    // Getters and Setters
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
