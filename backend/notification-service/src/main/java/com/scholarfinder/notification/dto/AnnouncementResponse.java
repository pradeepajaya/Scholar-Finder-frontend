package com.scholarfinder.notification.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AnnouncementResponse {

    private AnnouncementRecipientGroup recipientGroup;
    private int recipientCount;
    private int sentCount;
    private int failedCount;
    private int skippedDuplicateCount;
    private List<AnnouncementFailureDto> failures = new ArrayList<>();
    private List<AnnouncementSkippedDuplicateDto> skippedDuplicates = new ArrayList<>();
    private LocalDateTime sentAt;

    public AnnouncementRecipientGroup getRecipientGroup() {
        return recipientGroup;
    }

    public void setRecipientGroup(AnnouncementRecipientGroup recipientGroup) {
        this.recipientGroup = recipientGroup;
    }

    public int getRecipientCount() {
        return recipientCount;
    }

    public void setRecipientCount(int recipientCount) {
        this.recipientCount = recipientCount;
    }

    public int getSentCount() {
        return sentCount;
    }

    public void setSentCount(int sentCount) {
        this.sentCount = sentCount;
    }

    public int getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(int failedCount) {
        this.failedCount = failedCount;
    }

    public int getSkippedDuplicateCount() {
        return skippedDuplicateCount;
    }

    public void setSkippedDuplicateCount(int skippedDuplicateCount) {
        this.skippedDuplicateCount = skippedDuplicateCount;
    }

    public List<AnnouncementFailureDto> getFailures() {
        return failures;
    }

    public void setFailures(List<AnnouncementFailureDto> failures) {
        this.failures = failures == null ? new ArrayList<>() : failures;
    }

    public List<AnnouncementSkippedDuplicateDto> getSkippedDuplicates() {
        return skippedDuplicates;
    }

    public void setSkippedDuplicates(List<AnnouncementSkippedDuplicateDto> skippedDuplicates) {
        this.skippedDuplicates = skippedDuplicates == null ? new ArrayList<>() : skippedDuplicates;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
