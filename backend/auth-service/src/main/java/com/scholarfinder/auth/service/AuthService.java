package com.scholarfinder.auth.service;

import com.scholarfinder.auth.dto.request.ForgotPasswordRequest;
import com.scholarfinder.auth.dto.request.LoginRequest;
import com.scholarfinder.auth.dto.request.RefreshTokenRequest;
import com.scholarfinder.auth.dto.request.RegisterRequest;
import com.scholarfinder.auth.dto.request.ResetPasswordRequest;
import com.scholarfinder.auth.dto.request.StudentAccountRecoveryRequest;
import com.scholarfinder.auth.dto.response.AuthResponse;
import com.scholarfinder.auth.dto.response.ForgotPasswordResponse;
import com.scholarfinder.auth.entity.RefreshToken;
import com.scholarfinder.auth.entity.Role;
import com.scholarfinder.auth.entity.User;
import com.scholarfinder.auth.exception.AuthException;
import com.scholarfinder.auth.repository.RefreshTokenRepository;
import com.scholarfinder.auth.repository.UserRepository;
import com.scholarfinder.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final int DEFAULT_REFRESH_TOKEN_DAYS = 7;
    private static final int REMEMBER_ME_REFRESH_TOKEN_DAYS = 30;
    private static final int PASSWORD_RESET_TOKEN_MINUTES = 30;
    private static final int MAX_PROFILE_PICTURE_LENGTH = 1_500_000;
    private static final SecureRandom PASSWORD_RESET_CODE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetEmailService passwordResetEmailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .isVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {} with role: {}", user.getEmail(), user.getRole());

        // Generate tokens
        String accessToken = jwtTokenProvider.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse registerOrRecoverStudent(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Passwords do not match");
        }

        if (request.getRole() != null && request.getRole() != Role.STUDENT) {
            throw new AuthException("Only student accounts can use this registration flow");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .map(existingUser -> {
                    if (existingUser.getRole() != Role.STUDENT) {
                        throw new AuthException("This email is already registered for another account type");
                    }
                    if (!existingUser.getIsActive()) {
                        throw new AuthException("Account is deactivated. Please contact support.");
                    }
                    existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                    existingUser.setIsVerified(true);
                    existingUser.setResetPasswordToken(null);
                    existingUser.setResetPasswordExpires(null);
                    existingUser.setLastLogin(LocalDateTime.now());
                    return existingUser;
                })
                .orElseGet(() -> User.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .role(Role.STUDENT)
                        .isActive(true)
                        .isVerified(false)
                        .verificationToken(UUID.randomUUID().toString())
                        .lastLogin(LocalDateTime.now())
                        .build());

        user = userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        log.info("Student account ready for email: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            String email = request.getEmail().trim();
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new AuthException("User not found"));

            // Check if user is active
            if (!user.getIsActive()) {
                throw new AuthException("Account is deactivated. Please contact support.");
            }

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate tokens
            String accessToken = jwtTokenProvider.generateToken(authentication);
            String refreshToken = createRefreshToken(user, Boolean.TRUE.equals(request.getRememberMe()));

            log.info("User logged in: {}", user.getEmail());

            return buildAuthResponse(user, accessToken, refreshToken);

        } catch (BadCredentialsException e) {
            if (hasActivePasswordReset(request.getEmail())) {
                throw new AuthException(
                        "Password reset is not complete. Enter the reset code from your email and update your password before signing in."
                );
            }
            throw new AuthException("Invalid email or password");
        }
    }

    private boolean hasActivePasswordReset(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        return userRepository.findByEmailIgnoreCase(email.trim())
                .filter(user -> user.getResetPasswordToken() != null && !user.getResetPasswordToken().isBlank())
                .filter(user -> user.getResetPasswordExpires() != null)
                .filter(user -> LocalDateTime.now().isBefore(user.getResetPasswordExpires()))
                .isPresent();
    }

    @Transactional
    public AuthResponse recoverStudentAccount(StudentAccountRecoveryRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Passwords do not match");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Student account not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new AuthException("This email is already registered for another account type");
        }

        if (!user.getIsActive()) {
            throw new AuthException("Account is deactivated. Please contact support.");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsVerified(true);
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        log.info("Student account recovered for email: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        return userRepository.findByEmailIgnoreCase(email)
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .map(user -> {
                    String resetToken = generateResetCode();
                    LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(PASSWORD_RESET_TOKEN_MINUTES);

                    user.setResetPasswordToken(resetToken);
                    user.setResetPasswordExpires(expiresAt);
                    userRepository.save(user);

                    String recipientEmail = user.getEmail().trim();
                    passwordResetEmailService.sendResetCode(recipientEmail, resetToken, expiresAt);

                    log.info("Password reset code generated and emailed for {}", recipientEmail);
                    return ForgotPasswordResponse.builder()
                            .expiresAt(expiresAt)
                            .build();
                })
                .orElseGet(() -> {
                    log.info("Password reset requested for non-existent or inactive account: {}", email);
                    return ForgotPasswordResponse.builder().build();
                });
    }

    private String generateResetCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String code = String.format(Locale.ROOT, "%06d", PASSWORD_RESET_CODE_RANDOM.nextInt(1_000_000));
            if (userRepository.findByResetPasswordToken(code).isEmpty()) {
                return code;
            }
        }

        return UUID.randomUUID().toString();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Passwords do not match");
        }

        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new AuthException("Invalid or expired password reset code"));

        if (user.getResetPasswordExpires() == null ||
                LocalDateTime.now().isAfter(user.getResetPasswordExpires())) {
            user.setResetPasswordToken(null);
            user.setResetPasswordExpires(null);
            userRepository.save(user);
            throw new AuthException("Invalid or expired password reset code");
        }

        if (!user.getIsActive()) {
            throw new AuthException("Account is deactivated. Please contact support.");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsVerified(true);
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        refreshTokenRepository.deleteByUser(user);
        userRepository.save(user);

        log.info("Password reset completed for user: {}", user.getEmail());
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AuthException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new AuthException("Refresh token has expired. Please login again.");
        }

        User user = refreshToken.getUser();

        // Delete old refresh token
        refreshTokenRepository.delete(refreshToken);

        // Generate new tokens
        String newAccessToken = jwtTokenProvider.generateToken(user.getEmail());
        boolean rememberMeSession = refreshToken.getExpiresAt()
                .isAfter(LocalDateTime.now().plusDays(DEFAULT_REFRESH_TOKEN_DAYS));
        String newRefreshToken = createRefreshToken(user, rememberMeSession);

        log.info("Token refreshed for user: {}", user.getEmail());

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));

        // Delete all refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);

        log.info("User logged out: {}", email);
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new AuthException("Invalid verification token"));

        user.setIsVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        log.info("Email verified for user: {}", user.getEmail());
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AuthException("User not found"));
    }

    @Transactional
    public AuthResponse.UserDto updateProfilePicture(String email, String profilePictureUrl) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AuthException("User not found"));

        String normalizedPicture = normalizeProfilePicture(profilePictureUrl);
        user.setProfilePictureUrl(normalizedPicture);
        User saved = userRepository.save(user);

        log.info("Profile picture updated for user: {}", saved.getEmail());
        return buildUserDto(saved);
    }

    private String normalizeProfilePicture(String profilePictureUrl) {
        if (profilePictureUrl == null || profilePictureUrl.isBlank()) {
            return null;
        }

        String value = profilePictureUrl.trim();
        if (value.length() > MAX_PROFILE_PICTURE_LENGTH) {
            throw new AuthException("Profile picture must be smaller than 1 MB");
        }

        String lower = value.toLowerCase(Locale.ROOT);
        boolean isSupportedDataUrl =
                lower.startsWith("data:image/png;base64,") ||
                lower.startsWith("data:image/jpeg;base64,") ||
                lower.startsWith("data:image/jpg;base64,") ||
                lower.startsWith("data:image/webp;base64,") ||
                lower.startsWith("data:image/gif;base64,");
        boolean isRemoteUrl = lower.startsWith("https://") || lower.startsWith("http://");

        if (!isSupportedDataUrl && !isRemoteUrl) {
            throw new AuthException("Profile picture must be a JPG, PNG, WebP, or GIF image");
        }

        return value;
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    private String createRefreshToken(User user) {
        return createRefreshToken(user, false);
    }

    private String createRefreshToken(User user, boolean rememberMe) {
        // Delete existing refresh tokens for this user (optional - for single session)
        // refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(
                        rememberMe ? REMEMBER_ME_REFRESH_TOKEN_DAYS : DEFAULT_REFRESH_TOKEN_DAYS
                ))
                .build();

        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .user(buildUserDto(user))
                .build();
    }

    private AuthResponse.UserDto buildUserDto(User user) {
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }
}
