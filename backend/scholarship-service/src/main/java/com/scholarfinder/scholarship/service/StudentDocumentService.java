package com.scholarfinder.scholarship.service;

import com.scholarfinder.scholarship.dto.StudentDocumentDto;
import com.scholarfinder.scholarship.entity.StudentDocument;
import com.scholarfinder.scholarship.repository.StudentDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class StudentDocumentService {

    private static final Pattern DATA_URL_PATTERN =
        Pattern.compile("^data:([^;,]+)?(;base64)?,(.*)$", Pattern.DOTALL);

    private final StudentDocumentRepository studentDocumentRepository;

    @Transactional(readOnly = true)
    public List<StudentDocumentDto> getDocuments(Long studentId) {
        validateStudentId(studentId);
        return studentDocumentRepository.findByStudentIdOrderByUploadedAtDesc(studentId)
            .stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public StudentDocumentDto upsertDocument(
            Long studentId,
            String documentKey,
            StudentDocumentDto request) {
        validateStudentId(studentId);
        String safeKey = requireText(documentKey, "Document id is required");

        StudentDocument document = studentDocumentRepository
            .findByStudentIdAndDocumentKey(studentId, safeKey)
            .orElseGet(StudentDocument::new);

        byte[] fileData = decodeDataUrl(request.getFileDataUrl());
        if (fileData.length == 0 && document.getFileData() == null && isBlank(request.getFileUrl())) {
            throw new IllegalArgumentException("Document file data is required");
        }

        String fileType = firstNonBlank(
            request.getFileType(),
            getMimeTypeFromDataUrl(request.getFileDataUrl()),
            document.getFileType(),
            "application/octet-stream"
        );

        document.setStudentId(studentId);
        document.setDocumentKey(safeKey);
        document.setName(requireText(request.getName(), "Document name is required"));
        document.setStatus(firstNonBlank(request.getStatus(), "uploaded"));
        document.setFileName(firstNonBlank(request.getFileName(), document.getFileName()));
        document.setFileType(fileType);
        document.setFileUrl(emptyToNull(request.getFileUrl()));
        document.setUploadedAt(parseUploadedAt(request.getUploadedAt()));
        if (fileData.length > 0) {
            document.setFileData(fileData);
            document.setFileSize(request.getFileSize() != null ? request.getFileSize() : (long) fileData.length);
        } else {
            document.setFileSize(request.getFileSize() != null ? request.getFileSize() : document.getFileSize());
        }

        return toDto(studentDocumentRepository.save(document));
    }

    @Transactional
    public void deleteDocument(Long studentId, String documentKey) {
        validateStudentId(studentId);
        studentDocumentRepository.deleteByStudentIdAndDocumentKey(
            studentId,
            requireText(documentKey, "Document id is required")
        );
    }

    private StudentDocumentDto toDto(StudentDocument document) {
        return StudentDocumentDto.builder()
            .id(document.getDocumentKey())
            .studentId(document.getStudentId())
            .name(document.getName())
            .status(document.getStatus())
            .fileName(document.getFileName())
            .fileType(document.getFileType())
            .fileSize(document.getFileSize())
            .fileDataUrl(toDataUrl(document))
            .fileUrl(document.getFileUrl())
            .uploadedAt(document.getUploadedAt() != null ? document.getUploadedAt().toString() : null)
            .build();
    }

    private String toDataUrl(StudentDocument document) {
        byte[] data = document.getFileData();
        if (data == null || data.length == 0) {
            return null;
        }

        String fileType = firstNonBlank(document.getFileType(), "application/octet-stream");
        return "data:" + fileType + ";base64," + Base64.getEncoder().encodeToString(data);
    }

    private byte[] decodeDataUrl(String fileDataUrl) {
        if (isBlank(fileDataUrl)) {
            return new byte[0];
        }

        Matcher matcher = DATA_URL_PATTERN.matcher(fileDataUrl);
        if (!matcher.matches()) {
            return Base64.getDecoder().decode(fileDataUrl);
        }

        String encodedData = matcher.group(3);
        if (matcher.group(2) != null) {
            return Base64.getDecoder().decode(encodedData);
        }

        return URLDecoder.decode(encodedData, StandardCharsets.UTF_8).getBytes(StandardCharsets.UTF_8);
    }

    private String getMimeTypeFromDataUrl(String fileDataUrl) {
        if (isBlank(fileDataUrl)) {
            return null;
        }

        Matcher matcher = DATA_URL_PATTERN.matcher(fileDataUrl);
        return matcher.matches() ? matcher.group(1) : null;
    }

    private LocalDateTime parseUploadedAt(String value) {
        if (isBlank(value)) {
            return LocalDateTime.now();
        }

        try {
            return OffsetDateTime.parse(value).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            return LocalDateTime.parse(value);
        }
    }

    private void validateStudentId(Long studentId) {
        if (studentId == null || studentId <= 0) {
            throw new IllegalArgumentException("Student id is required");
        }
    }

    private String requireText(String value, String message) {
        if (isBlank(value)) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value.trim();
            }
        }
        return null;
    }

    private String emptyToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
