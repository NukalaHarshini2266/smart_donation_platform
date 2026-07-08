package com.example.smartdonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "needs")
public class Need {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category; // MONEY / FOOD / SERVICE

    private Double requiredQuantity;
    private Double collectedQuantity = 0.0;

    private String unit;
    private String location;
    private String urgency;

    private LocalDateTime deadline;

    private String imageUrl;

    private String status = "OPEN"; // OPEN / FULFILLED / CLOSED / CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private Organization organization;

    // =====================
    // GETTERS AND SETTERS
    // =====================

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getTitle() {return title;}

    public void setTitle(String title) {this.title = title;}

    public String getDescription() {return description;}

    public void setDescription(String description) {this.description = description;}

    public String getCategory() {return category;}

    public void setCategory(String category) {this.category = category;}

    public Double getRequiredQuantity() {return requiredQuantity;}

    public void setRequiredQuantity(Double requiredQuantity) {this.requiredQuantity = requiredQuantity;}

    public Double getCollectedQuantity() {return collectedQuantity;}

    public void setCollectedQuantity(Double collectedQuantity) {this.collectedQuantity = collectedQuantity;}

    public String getUnit() {return unit;}

    public void setUnit(String unit) {this.unit = unit;}

    public String getLocation() {return location;}

    public void setLocation(String location) {this.location = location;}

    public String getUrgency() {return urgency;}

    public void setUrgency(String urgency) {this.urgency = urgency;}

    public LocalDateTime getDeadline() {return deadline;}

    public void setDeadline(LocalDateTime deadline) {this.deadline = deadline;}

    public String getImageUrl() { return imageUrl; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() {return status;}

    public void setStatus(String status) {this.status = status;}

    public LocalDateTime getCreatedAt() {return createdAt;}

    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}

    public LocalDateTime getUpdatedAt() {return updatedAt;}

    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}

    public Organization getOrganization() {return organization;}

    public void setOrganization(Organization organization) {this.organization = organization;}
}