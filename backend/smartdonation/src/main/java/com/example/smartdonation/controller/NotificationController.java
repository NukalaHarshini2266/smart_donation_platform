package com.example.smartdonation.controller;

import com.example.smartdonation.service.NotificationService;
import com.example.smartdonation.service.NotificationService.NotificationDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // ✅ GET notifications (DTO)
    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return service.getUserNotifications(userId);
    }

    // ✅ DELETE = mark as read
    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
        return "Notification removed";
    }
}