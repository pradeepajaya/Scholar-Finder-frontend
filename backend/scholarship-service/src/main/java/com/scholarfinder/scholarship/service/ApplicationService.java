package com.scholarfinder.scholarship.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarfinder.scholarship.dto.ApplicationResponse;
import com.scholarfinder.scholarship.dto.ApplicationSubmitRequest;
import com.scholarfinder.scholarship.dto.InstitutionApplicationDto;
import com.scholarfinder.scholarship.dto.MatchResult;
import com.scholarfinder.scholarship.entity.Application;
import com.scholarfinder.scholarship.entity.Scholarship;
import com.scholarfinder.scholarship.entity.StudentProfile;
import com.scholarfinder.scholarship.repository.ApplicationRepository;
import com.scholarfinder.scholarship.repository.ScholarshipRepository;
import com.scholarfinder.scholarship.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MatchingService matchingService;
    private final ObjectMapper objectMapper;

    @Transactional
    public ApplicationResponse submitApplication(Long scholarshipId, ApplicationSubmitRequest request) {
        Long safeScholarshipId = requireId(scholarshipId, "Scholarship");
        Long studentId = request != null ? request.getStudentId() : null;
        Long safeStudentId = requireId(studentId, "Student");

        Scholarship scholarship = scholarshipRepository.findById(safeScholarshipId)
            .orElseThrow(() -> new IllegalArgumentException("Scholarship not found"));

        boolean existingApplication = applicationRepository
            .existsByStudentIdAndScholarshipId(safeStudentId, safeScholarshipId);

        Application application = applicationRepository
            .findByStudentIdAndScholarshipId(safeStudentId, safeScholarshipId)
            .orElseGet(Application::new);

        application.setScholarshipId(safeScholarshipId);
        application.setStudentId(safeStudentId);
        application.setStatus("SUBMITTED");
        application.setCoverLetter(request.getCoverLetter());
        application.setStatementOfPurpose(request.getQualificationSummary());
        application.setDocuments(toApplicationJson(scholarship, request));
        application.setMatchScore(resolveMatchScore(safeStudentId, scholarship));

        Application saved = applicationRepository.save(application);

        if (!existingApplication) {
            Integer totalApplications = scholarship.getTotalApplications() != null
                ? scholarship.getTotalApplications()
                : 0;
            scholarship.setTotalApplications(totalApplications + 1);
            scholarshipRepository.save(scholarship);
        }

        log.info("Application {} submitted for student {} and scholarship {}",
            saved.getId(), safeStudentId, safeScholarshipId);

        return ApplicationResponse.builder()
            .id(saved.getId())
            .scholarshipId(saved.getScholarshipId())
            .studentId(saved.getStudentId())
            .status(saved.getStatus())
            .matchScore(saved.getMatchScore())
            .updatedExistingApplication(existingApplication)
            .submittedAt(saved.getCreatedAt())
            .build();
    }

    private BigDecimal resolveMatchScore(Long studentId, Scholarship scholarship) {
        return studentProfileRepository.findByUserId(studentId)
            .map(profile -> calculateMatchScore(profile, scholarship))
            .orElse(null);
    }

    private BigDecimal calculateMatchScore(StudentProfile profile, Scholarship scholarship) {
        try {
            MatchResult matchResult = matchingService.calculateMatch(profile, scholarship);
            return matchResult.getMatchPercentage();
        } catch (Exception e) {
            log.warn("Could not calculate match score for application: {}", e.getMessage());
            return null;
        }
    }

    private String toApplicationJson(Scholarship scholarship, ApplicationSubmitRequest request) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("scholarshipTitle", scholarship.getTitle());
        payload.put("providerName", scholarship.getProviderName());
        payload.put("requiredDocuments", request.getRequiredDocuments());
        payload.put("documents", request.getDocuments());
        payload.put("qualifications", buildQualifications(request));
        payload.put("submittedAt", LocalDateTime.now().toString());

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not process application documents", e);
        }
    }

    private Map<String, Object> buildQualifications(ApplicationSubmitRequest request) {
        Map<String, Object> qualifications = new LinkedHashMap<>();
        qualifications.put("fullName", request.getFullName());
        qualifications.put("email", request.getEmail());
        qualifications.put("phone", request.getPhone());
        qualifications.put("currentEducation", request.getCurrentEducation());
        qualifications.put("intendedLevel", request.getIntendedLevel());
        qualifications.put("fieldOfStudy", request.getFieldOfStudy());
        qualifications.put("alStream", request.getAlStream());
        qualifications.put("alResults", request.getAlResults());
        qualifications.put("zScore", request.getZScore());
        qualifications.put("gpa", request.getGpa());
        qualifications.put("englishTest", request.getEnglishTest());
        qualifications.put("englishScore", request.getEnglishScore());
        qualifications.put("householdIncome", request.getHouseholdIncome());
        qualifications.put("achievements", request.getAchievements());
        return qualifications;
    }

    private Long requireId(Long id, String label) {
        if (id == null) {
            throw new IllegalArgumentException(label + " id is required");
        }
        return id;
    }

    public List<InstitutionApplicationDto> getApplicationsByInstitutionId(Long institutionId) {
        List<Application> applications = applicationRepository.findByInstitutionId(institutionId);
        
        return applications.stream().map(app -> {
            Scholarship scholarship = scholarshipRepository.findById(app.getScholarshipId()).orElse(null);
            StudentProfile student = studentProfileRepository.findByUserId(app.getStudentId()).orElse(null);
            
            String qualificationSummary = "";
            String currentEducation = "";
            try {
                if (app.getDocuments() != null) {
                    Map<String, Object> docs = objectMapper.readValue(app.getDocuments(), Map.class);
                    qualificationSummary = (String) docs.get("qualificationSummary");
                    currentEducation = (String) docs.get("currentEducation");
                }
            } catch (Exception e) {
                log.error("Failed to parse documents JSON for application ID {}", app.getId());
            }

            return InstitutionApplicationDto.builder()
                .applicationId(app.getId())
                .scholarshipId(scholarship != null ? scholarship.getId() : null)
                .scholarshipTitle(scholarship != null ? scholarship.getTitle() : "Unknown Scholarship")
                .studentId(app.getStudentId())
                .studentName(student != null ? student.getFirstName() + " " + student.getLastName() : "Unknown Student")
                .studentEmail(student != null ? student.getEmail() : "")
                .studentPhone(student != null ? student.getPhone() : "")
                .qualificationSummary(qualificationSummary)
                .currentEducation(currentEducation)
                .status(app.getStatus())
                .appliedAt(app.getCreatedAt())
                .matchPercentage(app.getMatchScore() != null ? app.getMatchScore().doubleValue() : 0.0)
                .build();
        }).collect(Collectors.toList());
    }
}
