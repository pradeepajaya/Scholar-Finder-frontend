package com.scholarfinder.auth.controller;

import com.scholarfinder.auth.dto.request.ForgotPasswordRequest;
import com.scholarfinder.auth.dto.request.LoginRequest;
import com.scholarfinder.auth.dto.request.ProfilePictureRequest;
import com.scholarfinder.auth.dto.request.RefreshTokenRequest;
import com.scholarfinder.auth.dto.request.RegisterRequest;
import com.scholarfinder.auth.dto.request.ResetPasswordRequest;
import com.scholarfinder.auth.dto.request.StudentAccountRecoveryRequest;
import com.scholarfinder.auth.dto.response.ApiResponse;
import com.scholarfinder.auth.dto.response.AuthResponse;
import com.scholarfinder.auth.dto.response.ForgotPasswordResponse;
import com.scholarfinder.auth.entity.User;
import com.scholarfinder.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user (Student, Institution, or Admin)
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request for email: {} with role: {}", request.getEmail(), request.getRole());
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    /**
     * Login with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Password reset request for email: {}", request.getEmail());
        ForgotPasswordResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(
                "If an active account exists for this email, a password reset code has been sent.",
                response
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful", null));
    }

    @PostMapping("/students/recover-account")
    public ResponseEntity<ApiResponse<AuthResponse>> recoverStudentAccount(
            @Valid @RequestBody StudentAccountRecoveryRequest request) {
        log.info("Student account recovery request for email: {}", request.getEmail());
        AuthResponse response = authService.recoverStudentAccount(request);
        return ResponseEntity.ok(ApiResponse.success("Student account recovered successfully", response));
    }

    @PostMapping("/students/register-or-recover")
    public ResponseEntity<ApiResponse<AuthResponse>> registerOrRecoverStudent(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Student register-or-recover request for email: {}", request.getEmail());
        AuthResponse response = authService.registerOrRecoverStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student account ready", response));
    }

    /**
     * Refresh access token using refresh token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    /**
     * Logout user (invalidate refresh token)
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    /**
     * Verify email address
     */
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", null));
    }

    /**
     * Get current authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication is required"));
        }
        User user = authService.getCurrentUser(userDetails.getUsername());
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", userDto));
    }

    @PutMapping("/me/profile-picture")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> updateProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfilePictureRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication is required"));
        }

        AuthResponse.UserDto userDto = authService.updateProfilePicture(
                userDetails.getUsername(),
                request.getProfilePictureUrl()
        );
        return ResponseEntity.ok(ApiResponse.success("Profile picture updated", userDto));
    }

    /**
     * Validate token (used by other services)
     */
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(ApiResponse.success("Token validation result", isValid));
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Auth service is running", "OK"));
    }
}
