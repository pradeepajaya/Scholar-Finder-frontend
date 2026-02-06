package com.scholarfinder.notification.dto;

/**
 * Statistics DTO for contact messages dashboard.
 */
public class ContactStatsDto {
    private long totalMessages;
    private long newMessages;
    private long inProgressMessages;
    private long resolvedMessages;
    private long todayMessages;
    private long thisWeekMessages;
    private long thisMonthMessages;
    private double averageResponseTimeHours;

    // Getters and Setters
    public long getTotalMessages() { return totalMessages; }
    public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }

    public long getNewMessages() { return newMessages; }
    public void setNewMessages(long newMessages) { this.newMessages = newMessages; }

    public long getInProgressMessages() { return inProgressMessages; }
    public void setInProgressMessages(long inProgressMessages) { this.inProgressMessages = inProgressMessages; }

    public long getResolvedMessages() { return resolvedMessages; }
    public void setResolvedMessages(long resolvedMessages) { this.resolvedMessages = resolvedMessages; }

    public long getTodayMessages() { return todayMessages; }
    public void setTodayMessages(long todayMessages) { this.todayMessages = todayMessages; }

    public long getThisWeekMessages() { return thisWeekMessages; }
    public void setThisWeekMessages(long thisWeekMessages) { this.thisWeekMessages = thisWeekMessages; }

    public long getThisMonthMessages() { return thisMonthMessages; }
    public void setThisMonthMessages(long thisMonthMessages) { this.thisMonthMessages = thisMonthMessages; }

    public double getAverageResponseTimeHours() { return averageResponseTimeHours; }
    public void setAverageResponseTimeHours(double averageResponseTimeHours) { this.averageResponseTimeHours = averageResponseTimeHours; }
}
