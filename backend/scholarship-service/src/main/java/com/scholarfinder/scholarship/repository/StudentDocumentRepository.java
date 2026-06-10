package com.scholarfinder.scholarship.repository;

import com.scholarfinder.scholarship.entity.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {

    List<StudentDocument> findByStudentIdOrderByUploadedAtDesc(Long studentId);

    Optional<StudentDocument> findByStudentIdAndDocumentKey(Long studentId, String documentKey);

    void deleteByStudentIdAndDocumentKey(Long studentId, String documentKey);
}
