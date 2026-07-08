package com.example.smartdonation.repository;

import com.example.smartdonation.entity.OrganizationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrganizationDocumentRepository extends JpaRepository<OrganizationDocument, Long> {
    List<OrganizationDocument> findByOrganizationId(Long orgId);
}
