package com.example.smartdonation.service;

import com.example.smartdonation.entity.Notification;
import com.example.smartdonation.entity.User;
import com.example.smartdonation.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    // ✅ SEND notification
    public void send(User user, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setType(type);
        repo.save(n);
    }

    // ✅ RETURN DTO instead of entity
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(n -> new NotificationDTO(
                        n.getId(),
                        n.getMessage(),
                        n.getType(),
                        n.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // ✅ DELETE = mark as read
    public void deleteNotification(Long id) {
        repo.deleteById(id);
    }

    // ✅ DTO CLASS (inside same file)
    public static class NotificationDTO {
        private Long id;
        private String message;
        private String type;
        private java.time.LocalDateTime createdAt;

        public NotificationDTO(Long id, String message, String type, java.time.LocalDateTime createdAt) {
            this.id = id;
            this.message = message;
            this.type = type;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public String getMessage() { return message; }
        public String getType() { return type; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    }
}