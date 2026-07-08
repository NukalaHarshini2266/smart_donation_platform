package com.example.smartdonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String type; // DONATION / ORG / NEED

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore   // ✅ VERY IMPORTANT (prevents 500 error)
    private User user;

    // getters
    public Long getId() { return id; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // setters
    public void setMessage(String message) { this.message = message; }
    public void setType(String type) { this.type = type; }
    public void setUser(User user) { this.user = user; }
}