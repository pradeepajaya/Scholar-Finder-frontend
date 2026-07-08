package com.scholarfinder.scholarship.controller;

import com.scholarfinder.scholarship.dto.ApiResponse;
import com.scholarfinder.scholarship.dto.ProfilePictureRequest;
import com.scholarfinder.scholarship.dto.StudentProfileRequest;
import com.scholarfinder.scholarship.dto.StudentProfileResponse;
import com.scholarfinder.scholarship.service.StudentProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for student profile operations used by matching.
 */
@RestController
@RequestMapping("/api/scholarships/students")
@RequiredArgsConstructor
@Slf4j
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    /**
     * Create or update a student profile.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StudentProfileResponse>> upsertProfile(
            @RequestBody StudentProfileRequest request) {
        try {
            StudentProfileResponse response = studentProfileService.upsertProfile(request);
            return ResponseEntity.ok(ApiResponse.success(response, "Student profile saved"));
        } catch (Exception e) {
            log.error("Error saving student profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to save student profile: " + e.getMessage()));
        }
    }

    /**
     * Get all student profiles for the admin portal.
     */
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<StudentProfileResponse>>> getAllProfiles() {
        try {
            List<StudentProfileResponse> response = studentProfileService.getAllProfiles();
            return ResponseEntity.ok(ApiResponse.success(response, "Student profiles retrieved"));
        } catch (Exception e) {
            log.error("Error retrieving student profiles: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve student profiles: " + e.getMessage()));
        }
    }

    /**
     * Get a student profile by user ID.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(@PathVariable Long userId) {
        try {
            StudentProfileResponse response = studentProfileService.getProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(response, "Student profile retrieved"));
        } catch (Exception e) {
            log.error("Error retrieving student profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve student profile: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}/profile-picture")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfilePicture(
            @PathVariable Long userId,
            @RequestBody ProfilePictureRequest request) {
        try {
            StudentProfileResponse response = studentProfileService.updateProfilePicture(
                userId,
                request.getProfilePictureUrl()
            );
            return ResponseEntity.ok(ApiResponse.success(response, "Profile picture updated"));
        } catch (Exception e) {
            log.error("Error updating student profile picture: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update profile picture: " + e.getMessage()));
        }
    }
}
