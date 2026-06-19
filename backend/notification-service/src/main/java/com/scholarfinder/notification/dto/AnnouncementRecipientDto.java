package com.scholarfinder.notification.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AnnouncementRecipientDto {

    @NotBlank(message = "Recipient email cannot be blank")
    @Email(message = "Recipient email must be valid")
    private String email;

    @Size(max = 120, message = "Recipient name must be 120 characters or less")
    private String name;

    public AnnouncementRecipientDto() {}

    public AnnouncementRecipientDto(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
