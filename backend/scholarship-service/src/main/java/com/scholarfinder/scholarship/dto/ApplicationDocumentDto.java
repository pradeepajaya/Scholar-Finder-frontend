package com.scholarfinder.scholarship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Document selected or uploaded for a scholarship application requirement.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDocumentDto {

    private String requirementName;
    private String source; // EXISTING_PROFILE_DOCUMENT or NEW_UPLOAD
    private String documentId;
    private String documentName;
    private String fileName;
}
