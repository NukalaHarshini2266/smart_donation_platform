package com.example.smartdonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import  java.util.Set;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Organization name is required")
    @Size(min = 3, max = 100, message = "Organization name must be 3–100 characters")
    private String name;

    @NotBlank(message = "Organization type is required")
    private String type;

    @NotBlank(message = "Address is required")
    @Size(min = 10, message = "Address must be at least 10 characters")
    private String address;

    private String status; // PENDING / ACTIVE / REJECTED
    private boolean documentsVerified;
    private boolean inspectionCompleted;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime approvedAt;


    // 🔥 Added JSON mapping
    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("organization")
    private Set<OrganizationDocument> documents=new HashSet<>();;

    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("organization")
    private Set<User> users=new HashSet<>();;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("organization")
    private Set<Donation> donations = new HashSet<>();;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Need> needs = new HashSet<>();;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isDocumentsVerified() { return documentsVerified; }
    public void setDocumentsVerified(boolean documentsVerified) { this.documentsVerified = documentsVerified; }

    public boolean isInspectionCompleted() { return inspectionCompleted; }
    public void setInspectionCompleted(boolean inspectionCompleted) { this.inspectionCompleted = inspectionCompleted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }


    public Set<OrganizationDocument> getDocuments() { return documents; }
    public void setDocuments(Set<OrganizationDocument> documents) { this.documents = documents; }

    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }

    public Set<Donation> getDonations() {
        return donations;
    }

    public void setDonations(Set<Donation> donations) {
        this.donations = donations;
    }

    public Set<Need> getNeeds() {
        return needs;
    }

    public void setNeeds(Set<Need> needs) {
        this.needs = needs;
    }
}
