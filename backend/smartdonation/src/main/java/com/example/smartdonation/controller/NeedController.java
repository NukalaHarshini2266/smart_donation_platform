package com.example.smartdonation.controller;

import com.example.smartdonation.entity.Need;
import com.example.smartdonation.service.NeedService;
import com.example.smartdonation.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/needs")
@CrossOrigin(origins = "http://localhost:5173")
public class NeedController {

    private final NeedService needService;

    public NeedController(NeedService needService) {
        this.needService = needService;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Need createNeed(
            @RequestParam Long organizationId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double requiredQuantity,
            @RequestParam String unit,
            @RequestParam String location,
            @RequestParam String urgency,
            @RequestParam java.time.LocalDateTime deadline,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        Need need = new Need();
        need.setTitle(title);
        need.setDescription(description);
        need.setCategory(category);
        need.setRequiredQuantity(requiredQuantity);
        need.setUnit(unit);
        need.setLocation(location);
        need.setUrgency(urgency);
        need.setDeadline(deadline);

        // ✅ IMAGE SAVE LOGIC
        if (image != null && !image.isEmpty()) {

            String uploadDir = "uploads/needs";
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, image.getBytes());

            need.setImageUrl(fileName);
        }

        return needService.createNeed(organizationId, need);
    }

    @GetMapping("/org-needs/{orgId}")
    public List<Need> getNeedsByOrg(@PathVariable Long orgId) {
        return needService.getNeedsByOrganization(orgId);
    }

//    @PutMapping("/{id}/extend")
//    public Need extendNeed(
//            @PathVariable Long id,
//            @RequestParam String newDeadline) {
//
//        LocalDateTime parsedDate = LocalDateTime.parse(newDeadline);
//
//        return needService.extendDeadline(id, parsedDate);
//    }
    @PutMapping("/{id}/extend")
    public Need extendNeed(
            @PathVariable Long id,
            @RequestParam
            @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime newDeadline) {

        return needService.extendDeadline(id, newDeadline);
    }

    @PutMapping("/{id}/update")
    public Need updateNeed(@PathVariable Long id,
                           @RequestBody Need need) {
        return needService.updateNeed(id, need);
    }

    @PutMapping("/{id}/cancel")
    public Need cancelNeed(@PathVariable Long id) {
        return needService.cancelNeed(id);
    }

    @PutMapping("/{id}/reopen")
    public Need reopenNeed(@PathVariable Long id) {
        return needService.reopenNeed(id);
    }
    static class NeedResponseDTO {
        public Long needId;
        public String title;
        public String description;
        public String category;
        public Double requiredQuantity;
        public Double collectedQuantity;
        public String unit;
        public String location;
        public String urgency;
        public String status;
        public LocalDateTime deadline;
        public String imageUrl;

        public Long organizationId;
        public String organizationName;
        public String organizationAddress;

        public String organizationHeadName;
        public String organizationHeadEmail;
        public String organizationHeadPhone;
    }

    // ==========================================================
    // ALL OPEN NEEDS FOR DONOR DASHBOARD
    // ==========================================================

    @GetMapping("/all-open")
    public List<NeedResponseDTO> getAllOpenNeeds() {

        return needService.getAllOpenNeeds()
                .stream()
                .map(need -> {

                    NeedResponseDTO dto = new NeedResponseDTO();

                    dto.needId = need.getId();
                    dto.title = need.getTitle();
                    dto.description = need.getDescription();
                    dto.category = need.getCategory();
                    dto.requiredQuantity = need.getRequiredQuantity();
                    dto.collectedQuantity = need.getCollectedQuantity();
                    dto.unit = need.getUnit();
                    dto.location = need.getLocation();
                    dto.urgency = need.getUrgency();
                    dto.status = need.getStatus();
                    dto.deadline = need.getDeadline();
                    dto.imageUrl = need.getImageUrl();

                    dto.organizationId = need.getOrganization().getId();
                    dto.organizationName = need.getOrganization().getName();
                    dto.organizationAddress = need.getOrganization().getAddress();

                    // 🔥 Get ORG_HEAD
                    User head = need.getOrganization().getUsers()
                            .stream()
                            .filter(u -> "ORGANIZATION".equals(u.getRole()))
                            .findFirst()
                            .orElse(null);

                    if (head != null) {
                        dto.organizationHeadName = head.getName();
                        dto.organizationHeadEmail = head.getEmail();
                        dto.organizationHeadPhone = head.getMobile();
                    } else {
                        dto.organizationHeadName = "Not Available";
                        dto.organizationHeadEmail = "Not Available";
                        dto.organizationHeadPhone = "Not Available";
                    }

                    return dto;
                })
                .toList();
    }



}