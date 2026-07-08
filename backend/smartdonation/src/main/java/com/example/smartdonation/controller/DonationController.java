package com.example.smartdonation.controller;

import com.example.smartdonation.entity.Donation;
import com.example.smartdonation.service.DonationService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/donation")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    static class CreateDonationDTO {

        public Long donorId;
        public Long organizationId;
        public Long needId;

        public BigDecimal amount;
        public Double quantity;
        public String unit;

        public String description;
        public String type;

        // NEW
        public String donorAddress;
        public String donorPhone;
        public String preferredPickupTime;

        public String paymentMode;
        public String serviceDate;
        public String serviceTime;


    }

    static class DonationResponseDTO {

        public Long id;

        public String donorName;
        public Long donorId;

        public String organizationName;
        public Long organizationId;

        public Long needId;

        public BigDecimal amount;
        public Double quantity;
        public String unit;

        public String description;
        public String type;
        public String status;

        public String createdAt;

        // ✅ ADD THESE
        public String donorAddress;
        public String donorPhone;
        public String preferredPickupTime;

        public String paymentMode;

        public String serviceDate;
        public String serviceTime;

        public String rejectionReason; // optional but useful
    }

    private DonationResponseDTO mapToDTO(Donation d){

        DonationResponseDTO dto = new DonationResponseDTO();

        dto.id = d.getId();
        dto.amount = d.getAmount();
        dto.quantity = d.getQuantity();
        dto.unit = d.getUnit();
        dto.description = d.getDescription();
        dto.type = d.getType();
        dto.status = d.getStatus();

        // ✅ NEW MAPPINGS
        dto.donorAddress = d.getDonorAddress();
        dto.donorPhone = d.getDonorPhone();
        dto.preferredPickupTime = d.getPreferredPickupTime();

        dto.paymentMode = d.getPaymentMode();
        dto.serviceDate = d.getServiceDate();
        dto.serviceTime = d.getServiceTime();

        dto.rejectionReason = d.getRejectionReason(); // if exists in entity

        if(d.getCreatedAt()!=null)
            dto.createdAt = d.getCreatedAt().toString();

        if(d.getDonor()!=null){
            dto.donorId = d.getDonor().getId();
            dto.donorName = d.getDonor().getName();
        }

        if(d.getOrganization()!=null){
            dto.organizationId = d.getOrganization().getId();
            dto.organizationName = d.getOrganization().getName();
        }

        if(d.getNeed()!=null){
            dto.needId = d.getNeed().getId();
        }

        return dto;
    }




    // EXISTING API
    @GetMapping("/all")
    public List<DonationResponseDTO> getAllDonations() {
        return donationService.getAllDonations()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // EXISTING API
    @GetMapping("/stats")
    public Object getDonationStats() {
        return new Object() {
            public long total = donationService.getTotalDonations();
            public long money = donationService.getMoneyDonationsCount();
            public long food = donationService.getFoodDonationsCount();
            public long service = donationService.getServiceDonationsCount();
        };
    }

    // EXISTING API
    @GetMapping("/by-donor/{donorId}")
    public List<DonationResponseDTO> getDonationsByDonor(@PathVariable Long donorId){
        return donationService.getDonationsByDonor(donorId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // EXISTING API
    @GetMapping("/by-organization/{orgId}")
    public List<DonationResponseDTO> getDonationsByOrganization(@PathVariable Long orgId){
        return donationService.getDonationsByOrganization(orgId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // NEW API – donate to need
    @PostMapping("/need-donation")
    public DonationResponseDTO donateToNeed(
            @RequestParam Long donorId,
            @RequestParam Long needId,
            @RequestBody CreateDonationDTO dto
    ){

        Donation donation = new Donation();

        donation.setAmount(dto.amount);
        donation.setQuantity(dto.quantity);
        donation.setUnit(dto.unit);
        donation.setType(dto.type);
        donation.setDescription(dto.description);

        donation.setDonorAddress(dto.donorAddress);
        donation.setDonorPhone(dto.donorPhone);
        donation.setPreferredPickupTime(dto.preferredPickupTime);

        donation.setPaymentMode(dto.paymentMode);
        donation.setServiceDate(dto.serviceDate);
        donation.setServiceTime(dto.serviceTime);



        Donation d = donationService.donateToNeed(donorId, needId, donation);

        return mapToDTO(d);
    }

    @PutMapping("/{id}/complete")
    public String completeDonation(@PathVariable Long id){
        donationService.completeDonation(id);
        return "Donation completed";
    }


    // NEW API – manual donation
    @PostMapping("/manual")
    public DonationResponseDTO manualDonation(
            @RequestParam Long donorId,
            @RequestParam Long organizationId,
            @RequestBody Donation donation
    ){

        Donation d = donationService.manualDonation(donorId, organizationId, donation);

//        DonationResponseDTO dto = new DonationResponseDTO();
//        dto.id = d.getId();
//        dto.amount = d.getAmount();
//        dto.type = d.getType();
//        dto.status = d.getStatus();
//
//        return dto;
        return mapToDTO(d);
    }

    // NEW API – accept donation
    @PutMapping("/{id}/accept")
    public String acceptDonation(@PathVariable Long id){
        donationService.acceptDonation(id);
        return "Donation accepted";
    }

    // NEW API – reject donation
    @PutMapping("/{id}/reject")
    public String rejectDonation(@PathVariable Long id, @RequestParam String reason){
        donationService.rejectDonation(id, reason);
        return "Donation rejected";
    }
}