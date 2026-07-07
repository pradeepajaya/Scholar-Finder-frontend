package com.scholarfinder.scholarship.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarfinder.scholarship.dto.ApplicationDocumentDto;
import com.scholarfinder.scholarship.dto.ApplicationResponse;
import com.scholarfinder.scholarship.dto.ApplicationSubmitRequest;
import com.scholarfinder.scholarship.dto.InstitutionApplicationDto;
import com.scholarfinder.scholarship.dto.MatchResult;
import com.scholarfinder.scholarship.dto.StudentApplicationDto;
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
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private static final TypeReference<Map<String, Object>> APPLICATION_DOCUMENTS_TYPE = new TypeReference<>() {};
    private static final TypeReference<List<ApplicationDocumentDto>> APPLICATION_DOCUMENT_LIST_TYPE =
        new TypeReference<>() {};

    private final ApplicationRepository applicationRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MatchingService matchingService;
    private final ObjectMapper objectMapper;

    @Transactional
    public ApplicationResponse submitApplication(Long scholarshipId, ApplicationSubmitRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Application request is required");
        }

        Long safeScholarshipId = requireId(scholarshipId, "Scholarship");
        Long safeStudentId = requireId(request.getStudentId(), "Student");

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
        return applications.stream()
            .map(this::toInstitutionApplicationDto)
            .collect(Collectors.toList());
    }

    public List<InstitutionApplicationDto> getApplicationsByInstitutionUserId(Long institutionUserId) {
        List<Application> applications = applicationRepository.findByInstitutionUserId(institutionUserId);
        return applications.stream()
            .map(this::toInstitutionApplicationDto)
            .collect(Collectors.toList());
    }

    private InstitutionApplicationDto toInstitutionApplicationDto(Application app) {
        Scholarship scholarship = scholarshipRepository.findById(app.getScholarshipId()).orElse(null);
        StudentProfile student = studentProfileRepository.findByUserId(app.getStudentId()).orElse(null);
        Map<String, Object> docs = readApplicationDocuments(app);
        Map<String, Object> qualifications = readQualifications(docs);

        String studentName = firstPresent(
            stringValue(qualifications.get("fullName")),
            student != null ? student.getFullName() : null,
            "Unknown Student"
        );
        String studentEmail = firstPresent(
            stringValue(qualifications.get("email")),
            student != null ? student.getEmail() : null,
            ""
        );
        String studentPhone = firstPresent(
            stringValue(qualifications.get("phone")),
            student != null ? student.getMobile() : null,
            ""
        );
        String qualificationSummary = firstPresent(
            app.getStatementOfPurpose(),
            stringValue(docs.get("qualificationSummary")),
            ""
        );
        String currentEducation = firstPresent(
            stringValue(qualifications.get("currentEducation")),
            stringValue(docs.get("currentEducation")),
            student != null ? student.getCurrentStatus() : null,
            ""
        );

        return InstitutionApplicationDto.builder()
            .applicationId(app.getId())
            .scholarshipId(scholarship != null ? scholarship.getId() : null)
            .scholarshipTitle(scholarship != null ? scholarship.getTitle() : "Unknown Scholarship")
            .studentId(app.getStudentId())
            .studentName(studentName)
            .studentEmail(studentEmail)
            .studentPhone(studentPhone)
            .qualificationSummary(qualificationSummary)
            .currentEducation(currentEducation)
            .status(app.getStatus())
            .appliedAt(app.getCreatedAt())
            .matchPercentage(app.getMatchScore() != null ? app.getMatchScore().doubleValue() : 0.0)
            .build();
    }

    public List<StudentApplicationDto> getApplicationsByStudentId(Long studentId) {
        List<Application> applications = applicationRepository.findByStudentIdOrderByCreatedAtDesc(studentId);

        return applications.stream().map(app -> {
            Scholarship scholarship = scholarshipRepository.findById(app.getScholarshipId()).orElse(null);
            Map<String, Object> docs = readApplicationDocuments(app);
            Map<String, Object> qualifications = readQualifications(docs);

            return StudentApplicationDto.builder()
                .applicationId(app.getId())
                .scholarshipId(app.getScholarshipId())
                .scholarshipTitle(firstPresent(
                    scholarship != null ? scholarship.getTitle() : null,
                    stringValue(docs.get("scholarshipTitle")),
                    "Unknown Scholarship"
                ))
                .providerName(firstPresent(
                    scholarship != null ? scholarship.getProviderName() : null,
                    stringValue(docs.get("providerName")),
                    ""
                ))
                .status(app.getStatus())
                .appliedAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .matchPercentage(app.getMatchScore() != null ? app.getMatchScore().doubleValue() : null)
                .requiredDocuments(scholarship != null
                    ? scholarship.getRequiredDocuments()
                    : readRequiredDocuments(docs))
                .applicantName(stringValue(qualifications.get("fullName")))
                .applicantEmail(stringValue(qualifications.get("email")))
                .applicantPhone(stringValue(qualifications.get("phone")))
                .currentEducation(stringValue(qualifications.get("currentEducation")))
                .intendedLevel(stringValue(qualifications.get("intendedLevel")))
                .fieldOfStudy(stringValue(qualifications.get("fieldOfStudy")))
                .alStream(stringValue(qualifications.get("alStream")))
                .alResults(stringValue(qualifications.get("alResults")))
                .zScore(stringValue(qualifications.get("zScore")))
                .gpa(stringValue(qualifications.get("gpa")))
                .englishTest(stringValue(qualifications.get("englishTest")))
                .englishScore(stringValue(qualifications.get("englishScore")))
                .householdIncome(stringValue(qualifications.get("householdIncome")))
                .achievements(stringValue(qualifications.get("achievements")))
                .qualificationSummary(app.getStatementOfPurpose())
                .coverLetter(app.getCoverLetter())
                .submittedDocuments(readSubmittedDocuments(docs))
                .build();
        }).collect(Collectors.toList());
    }

    private Map<String, Object> readApplicationDocuments(Application app) {
        if (app.getDocuments() == null || app.getDocuments().isBlank()) {
            return Collections.emptyMap();
        }

        try {
            return objectMapper.readValue(app.getDocuments(), APPLICATION_DOCUMENTS_TYPE);
        } catch (Exception e) {
            log.error("Failed to parse documents JSON for application ID {}", app.getId(), e);
            return Collections.emptyMap();
        }
    }

    private Map<String, Object> readQualifications(Map<String, Object> docs) {
        Object qualifications = docs.get("qualifications");
        if (qualifications instanceof Map<?, ?> qualificationsMap) {
            Map<String, Object> result = new LinkedHashMap<>();
            qualificationsMap.forEach((key, value) -> {
                if (key instanceof String stringKey) {
                    result.put(stringKey, value);
                }
            });
            return result;
        }
        return Collections.emptyMap();
    }

    private List<ApplicationDocumentDto> readSubmittedDocuments(Map<String, Object> docs) {
        Object documents = docs.get("documents");
        if (documents == null) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.convertValue(documents, APPLICATION_DOCUMENT_LIST_TYPE);
        } catch (IllegalArgumentException e) {
            log.warn("Failed to parse submitted application documents: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private String[] readRequiredDocuments(Map<String, Object> docs) {
        Object requiredDocuments = docs.get("requiredDocuments");
        if (requiredDocuments instanceof List<?> values) {
            return values.stream()
                .map(this::stringValue)
                .filter(value -> value != null && !value.isBlank())
                .toArray(String[]::new);
        }
        return null;
    }

    private String firstPresent(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private String stringValue(Object value) {
        if (value instanceof String stringValue) {
            return stringValue;
        }
        return value != null ? String.valueOf(value) : null;
    }
}
