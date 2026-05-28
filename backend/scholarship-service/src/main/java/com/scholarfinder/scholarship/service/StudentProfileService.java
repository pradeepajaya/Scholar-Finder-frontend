package com.scholarfinder.scholarship.service;

import com.scholarfinder.scholarship.dto.StudentProfileRequest;
import com.scholarfinder.scholarship.dto.StudentProfileResponse;
import com.scholarfinder.scholarship.entity.StudentProfile;
import com.scholarfinder.scholarship.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    @Transactional
    public StudentProfileResponse upsertProfile(StudentProfileRequest request) {
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }

        Long userId = request.getUserId() != null ? request.getUserId() : generateUserId();
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseGet(StudentProfile::new);

        mapRequestToProfile(request, profile, userId);

        LocalDateTime now = LocalDateTime.now();
        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(now);
        }
        profile.setUpdatedAt(now);

        if (request.getProfileCompletionPercentage() != null) {
            profile.setProfileCompletionPercentage(request.getProfileCompletionPercentage());
        } else {
            profile.setProfileCompletionPercentage(calculateProfileCompletion(profile));
        }

        StudentProfile saved = studentProfileRepository.save(profile);
        log.info("Student profile saved for userId: {}", saved.getUserId());

        return StudentProfileResponse.builder()
            .userId(saved.getUserId())
            .fullName(saved.getFullName())
            .profileCompletionPercentage(saved.getProfileCompletionPercentage())
            .build();
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        return StudentProfileResponse.builder()
            .userId(profile.getUserId())
            .fullName(profile.getFullName())
            .profileCompletionPercentage(profile.getProfileCompletionPercentage())
            .build();
    }

    private void mapRequestToProfile(StudentProfileRequest request, StudentProfile profile, Long userId) {
        profile.setUserId(userId);
        profile.setFullName(request.getFullName().trim());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setNationality(request.getNationality());
        profile.setNicPassport(request.getNicPassport());
        profile.setDistrict(request.getDistrict());
        profile.setProvince(request.getProvince());
        profile.setCity(request.getCity());
        profile.setMobile(request.getMobile());
        profile.setPreferredLanguage(request.getPreferredLanguage());

        profile.setHighestEducation(request.getHighestEducation());
        profile.setCurrentStatus(request.getCurrentStatus());
        profile.setIntendedLevel(request.getIntendedLevel());
        profile.setIntendedYear(request.getIntendedYear());
        profile.setPreferredMode(request.getPreferredMode());
        profile.setPreferredLocation(request.getPreferredLocation());

        profile.setOlYear(request.getOlYear());
        profile.setOlType(request.getOlType());
        profile.setOlMedium(request.getOlMedium());
        profile.setOlPassed(request.getOlPassed());
        profile.setOlACount(request.getOlACount());
        profile.setOlBCount(request.getOlBCount());
        profile.setOlCCount(request.getOlCCount());
        profile.setMathsGrade(request.getMathsGrade());
        profile.setScienceGrade(request.getScienceGrade());
        profile.setEnglishGrade(request.getEnglishGrade());

        profile.setAlYear(request.getAlYear());
        profile.setAlStream(request.getAlStream());
        profile.setAlMedium(request.getAlMedium());
        profile.setSubject1(request.getSubject1());
        profile.setGrade1(request.getGrade1());
        profile.setSubject2(request.getSubject2());
        profile.setGrade2(request.getGrade2());
        profile.setSubject3(request.getSubject3());
        profile.setGrade3(request.getGrade3());
        profile.setZScore(request.getZScore());

        profile.setEnglishTest(request.getEnglishTest());
        profile.setOverallScore(request.getOverallScore());
        profile.setExamYear(request.getExamYear());

        profile.setHouseholdIncome(request.getHouseholdIncome());
        profile.setDependents(request.getDependents());
        profile.setEmploymentStatus(request.getEmploymentStatus());
        profile.setGovernmentAssistance(request.getGovernmentAssistance());

        profile.setBackground(request.getBackground());
        profile.setDisability(request.getDisability());
        profile.setSports(request.getSports());
        profile.setLeadership(request.getLeadership());
        profile.setFirstGeneration(request.getFirstGeneration());

        profile.setPreferredCountries(request.getPreferredCountries());
        profile.setPreferredFields(request.getPreferredFields());
        profile.setScholarshipType(request.getScholarshipType());
        profile.setWillingToReturn(request.getWillingToReturn());
    }

    private int calculateProfileCompletion(StudentProfile profile) {
        int total = 10;
        int completed = 0;

        if (hasText(profile.getFullName())) completed++;
        if (profile.getDateOfBirth() != null) completed++;
        if (hasText(profile.getHighestEducation())) completed++;
        if (hasText(profile.getCurrentStatus())) completed++;
        if (hasText(profile.getIntendedLevel())) completed++;
        if (hasText(profile.getAlStream())) completed++;
        if (hasText(profile.getEnglishTest())) completed++;
        if (hasText(profile.getHouseholdIncome())) completed++;
        if (profile.getPreferredFields() != null && profile.getPreferredFields().length > 0) completed++;
        if (profile.getPreferredCountries() != null && profile.getPreferredCountries().length > 0) completed++;

        return Math.min(100, Math.round((completed * 100f) / total));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private Long generateUserId() {
        long candidate = System.currentTimeMillis();
        while (studentProfileRepository.existsByUserId(candidate)) {
            candidate++;
        }
        return candidate;
    }
}
