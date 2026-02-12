package com.scholarfinder.scholarship.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for the matching algorithm.
 * Values are loaded from application.yml under 'matching' prefix.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "matching")
public class MatchingConfig {

    private Weights weights = new Weights();
    private Thresholds thresholds = new Thresholds();

    @Data
    public static class Weights {
        private int educationLevel = 20;
        private int academicPerformance = 15;
        private int englishProficiency = 15;
        private int age = 10;
        private int nationality = 10;
        private int financialNeed = 10;
        private int fieldOfStudy = 10;
        private int specialCategories = 10;

        public int getTotal() {
            return educationLevel + academicPerformance + englishProficiency +
                   age + nationality + financialNeed + fieldOfStudy + specialCategories;
        }
    }

    @Data
    public static class Thresholds {
        private int minimumMatchPercentage = 50;
        private int excellentMatch = 90;
        private int goodMatch = 75;
    }
}
