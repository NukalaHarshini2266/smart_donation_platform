package com.example.smartdonation.service;

import com.example.smartdonation.entity.Need;
import com.example.smartdonation.entity.Organization;
import com.example.smartdonation.repository.NeedRepository;
import com.example.smartdonation.repository.OrganizationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NeedService {

    private final NeedRepository needRepo;
    private final OrganizationRepository orgRepo;

    public NeedService(NeedRepository needRepo,
                       OrganizationRepository orgRepo) {
        this.needRepo = needRepo;
        this.orgRepo = orgRepo;
    }

    public Need createNeed(Long orgId, Need need) {

        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Organization not found"));

        need.setOrganization(org);
        need.setCollectedQuantity(0.0);
        need.setStatus("OPEN");
        need.setCreatedAt(LocalDateTime.now());

        return needRepo.save(need);
    }

    public List<Need> getNeedsByOrganization(Long orgId) {

        List<Need> needs = needRepo.findByOrganizationId(orgId);

        for (Need need : needs) {

            if (need.getStatus().equals("OPEN") &&
                    need.getDeadline().isBefore(LocalDateTime.now())) {

                need.setStatus("EXPIRED");
                needRepo.save(need);
            }
        }

        return needs;
    }

    public Need extendDeadline(Long id, LocalDateTime newDeadline) {

        Need need = needRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Need not found"));

        if (newDeadline.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("New deadline must be future date");
        }

        need.setDeadline(newDeadline);
        need.setStatus("OPEN");

        return needRepo.save(need);
    }

    public Need updateNeed(Long id, Need updatedNeed) {

        Need existing = needRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Need not found"));

        existing.setTitle(updatedNeed.getTitle());
        existing.setDescription(updatedNeed.getDescription());
        existing.setCategory(updatedNeed.getCategory());
        existing.setRequiredQuantity(updatedNeed.getRequiredQuantity());
        existing.setUnit(updatedNeed.getUnit());
        existing.setLocation(updatedNeed.getLocation());
        existing.setUrgency(updatedNeed.getUrgency());
        existing.setDeadline(updatedNeed.getDeadline());

        // 🔥 Auto-fix status based on deadline
        if (existing.getDeadline().isBefore(LocalDateTime.now())) {
            existing.setStatus("EXPIRED");
        } else if (!existing.getStatus().equals("CANCELLED")) {
            existing.setStatus("OPEN");
        }

        return needRepo.save(existing);
    }

    public Need cancelNeed(Long id) {
        Need need = needRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Need not found"));

        need.setStatus("CANCELLED");
        return needRepo.save(need);
    }

    public Need reopenNeed(Long id) {

        Need need = needRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Need not found"));

        if (!need.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Only cancelled needs can be reopened");
        }

        // ❗ If deadline expired → force extend instead
        if (need.getDeadline().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Deadline expired. Please extend deadline.");
        }

        need.setStatus("OPEN");
        return needRepo.save(need);
    }

    @Scheduled(fixedRate = 60000) // runs every 1 minute
    public void autoExpireNeeds() {

        List<Need> openNeeds = needRepo.findByStatus("OPEN");

        for (Need need : openNeeds) {
            if (need.getDeadline().isBefore(LocalDateTime.now())) {
                need.setStatus("EXPIRED");
                needRepo.save(need);
            }
        }

    }

    public List<Need> getAllOpenNeeds() {
        return needRepo.findByStatus("OPEN");
    }

}