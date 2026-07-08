package com.example.smartdonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "organization_documents")
public class OrganizationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Raw FK column (read-only, mapped to same DB column)
//    @Column(name = "organization_id", insertable = false, updatable = false)
//    private Long organizationId;

    private String fileName;
    private String filePath;
    private String description;

    // Proper JPA relation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private Organization organization;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

//    public Long getOrganizationId() { return organizationId; }
//    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
}
