package com.example.smartdonation.controller;

import com.example.smartdonation.entity.Organization;
import com.example.smartdonation.entity.OrganizationDocument;
import com.example.smartdonation.entity.User;
import com.example.smartdonation.service.OrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;


@Validated
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/organization")
public class OrganizationController {

    private final OrganizationService orgService;
    public OrganizationController(OrganizationService orgService){ this.orgService = orgService; }
    static class StaffDTO {
        public Long id;
        public String name;
        public String email;
        public String role;
        public String mobile;
    }

    static class DocumentDTO {
        public Long id;
        public String fileName;
        public String description;
        public String filePath;
    }

    static class DonationDTO {
            public Long id;
            public String donor;       // donor name
            public String donorEmail;  // donor email
            public String type;        // MONEY / FOOD / SERVICE
            public java.math.BigDecimal amount; // for money donation
            public Double quantity;    // for food/service
            public String unit;        // kg / meals / hours etc.
            public String description; // donor message
            public String needTitle;   // which need this donation is for
            public String status;      // PENDING / ACCEPTED / COMPLETED
            public java.time.LocalDateTime createdAt; // donation date
    }

    static class OrganizationFullDTO {
        public Long id;
        public String name;
        public String type;
        public String address;
        public String status;
        public boolean documentsVerified;
        public boolean inspectionCompleted;

        public LocalDateTime createdAt;
        public LocalDateTime approvedAt;

        public StaffDTO head;
        public List<StaffDTO> staff;
        public List<DocumentDTO> documents;
        public List<DonationDTO> donations;
    }

    public static class OrganizationRegisterDTO {

        @NotBlank(message = "Organization name is required")
        @Size(min = 3, max = 100)
        private String name;

        @NotBlank(message = "Organization type is required")
        private String type;

        @NotBlank(message = "Address is required")
        @Size(min = 10)
        private String address;

        @NotBlank(message = "User name is required")
        private String userName;

        @Email(message="Invalid email")
        @NotBlank
        private String userEmail;

        @NotBlank
        @Size(min = 6)
        private String userPassword;

        @Pattern(regexp = "^[6-9]\\d{9}$")
        private String userMobile;

        // 🔥 ADD THESE
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

        public String getUserPassword() { return userPassword; }
        public void setUserPassword(String userPassword) { this.userPassword = userPassword; }

        public String getUserMobile() { return userMobile; }
        public void setUserMobile(String userMobile) { this.userMobile = userMobile; }
    }

    public static class OrganizationNameDTO {
        public Long id;
        public String name;
        public String mobile;
    }

    @PutMapping(value = "/{orgId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateOrganization(
            @PathVariable Long orgId,

            @RequestPart("data") OrganizationUpdateDTO dto,

            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {

        orgService.updateOrganization(orgId, dto, files);

        return ResponseEntity.ok("Organization updated successfully");
    }

    // ===================== DTO INSIDE CONTROLLER =====================
    public static class OrganizationUpdateDTO {

        // ORGANIZATION
        public String name;
        public String address;

        // USER (HEAD)
        public String userName;
        public String userMobile;

        public List<String> newDescriptions;

        // EXISTING DOCUMENT UPDATES
        public List<DocumentUpdateDTO> documents;

        public static class DocumentUpdateDTO {
            public Long id;
            public String description;
        }
    }



    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public String registerOrganization(
            @Valid @ModelAttribute OrganizationRegisterDTO dto,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("descriptions") String[] descriptions
    ) throws IOException {

        orgService.registerOrganization(
                dto.name,
                dto.type,
                dto.address,
                dto.userName,
                dto.userEmail,
                dto.userPassword,
                dto.userMobile,
                files,
                descriptions
        );

        return "Organization registered successfully";
    }


    @GetMapping("/stats")
    public Object getOrganizationStats() {
        return new Object() {
            public long total = orgService.getTotalOrganizations();
            public long pending = orgService.getPendingOrganizationscount();
            public long approved = orgService.getApprovedOrganizationscount();
        };
    }

    @GetMapping("/all")
    public List<OrganizationFullDTO> getAllOrganizations() {

        List<Organization> orgs = orgService.getAllOrganizations();

        return orgs.stream().map(org -> {

            OrganizationFullDTO dto = new OrganizationFullDTO();

            dto.id = org.getId();
            dto.name = org.getName();
            dto.type = org.getType();
            dto.address = org.getAddress();
            dto.status = org.getStatus();
            dto.documentsVerified = org.isDocumentsVerified();
            dto.inspectionCompleted = org.isInspectionCompleted();
            dto.createdAt = org.getCreatedAt();
            dto.approvedAt = org.getApprovedAt();

            dto.head = org.getUsers().stream()
                    .filter(u -> "ORGANIZATION".equals(u.getRole()))
                    .findFirst()
                    .map(u -> {
                        StaffDTO h = new StaffDTO();
                        h.id = u.getId();
                        h.name = u.getName();
                        h.email = u.getEmail();
                        h.role = u.getRole();
                        h.mobile = u.getMobile();
                        return h;
                    }).orElse(null);

            dto.staff = org.getUsers().stream()
                    .filter(u -> "ORG_STAFF".equals(u.getRole()))
                    .map(u -> {
                        StaffDTO s = new StaffDTO();
                        s.id = u.getId();
                        s.name = u.getName();
                        s.email = u.getEmail();
                        s.role = u.getRole();
                        s.mobile = u.getMobile();
                        return s;
                    }).toList();

            dto.documents = org.getDocuments().stream()
                    .map(d -> {
                        DocumentDTO doc = new DocumentDTO();
                        doc.id = d.getId();
                        doc.fileName = d.getFileName();
                        doc.description = d.getDescription();
                        doc.filePath = d.getFilePath();
                        return doc;
                    }).toList();

            dto.donations = org.getDonations().stream()
                    .map(d -> {

                        DonationDTO don = new DonationDTO();

                        don.id = d.getId();
                        don.type = d.getType();
                        don.amount = d.getAmount();
                        don.quantity = d.getQuantity();
                        don.unit = d.getUnit();
                        don.description = d.getDescription();
                        don.status = d.getStatus();
                        don.createdAt = d.getCreatedAt();

                        if(d.getDonor()!=null){
                            don.donor = d.getDonor().getName();
                            don.donorEmail = d.getDonor().getEmail();
                        }

                        if(d.getNeed()!=null){
                            don.needTitle = d.getNeed().getTitle();
                        }

                        return don;

                    }).toList();

            return dto;

        }).toList();
    }


    @GetMapping("/{id}/documents")
    public List<OrganizationDocument> getOrgDocuments(@PathVariable Long id) {
        return orgService.getOrganizationDocuments(id);
    }


    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws Exception {

        Resource resource = orgService.loadFile(fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                .body(resource);
    }


    // Get all pending organizations
    @GetMapping("/pending")
    public List<OrganizationFullDTO> getPendingOrgs() {

        List<Organization> orgs = orgService.getPendingOrganizations();

        return orgs.stream().map(org -> {

            OrganizationFullDTO dto = new OrganizationFullDTO();

            dto.id = org.getId();
            dto.name = org.getName();
            dto.type = org.getType();
            dto.address = org.getAddress();
            dto.status = org.getStatus();
            dto.documentsVerified = org.isDocumentsVerified();
            dto.inspectionCompleted = org.isInspectionCompleted();
            dto.createdAt = org.getCreatedAt();
            dto.approvedAt = org.getApprovedAt();

            // ✅ HEAD
            dto.head = org.getUsers().stream()
                    .filter(u -> "ORGANIZATION".equals(u.getRole()))
                    .findFirst()
                    .map(u -> {
                        StaffDTO h = new StaffDTO();
                        h.id = u.getId();
                        h.name = u.getName();
                        h.email = u.getEmail();
                        h.mobile = u.getMobile();
                        h.role = u.getRole();
                        return h;
                    }).orElse(null);

            // ✅ STAFF
            dto.staff = org.getUsers().stream()
                    .filter(u -> "ORG_STAFF".equals(u.getRole()))
                    .map(u -> {
                        StaffDTO s = new StaffDTO();
                        s.id = u.getId();
                        s.name = u.getName();
                        s.email = u.getEmail();
                        s.mobile = u.getMobile();
                        s.role = u.getRole();
                        return s;
                    }).toList();

            // ✅ DOCUMENTS
            dto.documents = org.getDocuments().stream()
                    .map(d -> {
                        DocumentDTO doc = new DocumentDTO();
                        doc.id = d.getId();
                        doc.fileName = d.getFileName();
                        doc.description = d.getDescription();
                        doc.filePath = d.getFilePath();
                        return doc;
                    }).toList();

            // ✅ DONATIONS
            dto.donations = org.getDonations().stream()
                    .map(d -> {
                        DonationDTO don = new DonationDTO();
                        don.id = d.getId();
                        don.type = d.getType();
                        don.amount = d.getAmount();
                        don.quantity = d.getQuantity();
                        don.unit = d.getUnit();
                        don.description = d.getDescription();
                        don.status = d.getStatus();
                        don.createdAt = d.getCreatedAt();

                        if (d.getDonor() != null) {
                            don.donor = d.getDonor().getName();
                            don.donorEmail = d.getDonor().getEmail();
                        }

                        if (d.getNeed() != null) {
                            don.needTitle = d.getNeed().getTitle();
                        }

                        return don;
                    }).toList();

            return dto;

        }).toList();
    }

    // Update checklist
    @PostMapping("/update-checklist")
    public String updateChecklist(
            @RequestParam Long orgId,
            @RequestParam String type,
            @RequestParam boolean value,
            @RequestAttribute("email") String email) {

        orgService.updateChecklist(orgId, type, value, email);
        return "Checklist updated";
    }


    @PostMapping("/approve")
    public String approveOrg(@RequestParam Long orgId,
                             @RequestAttribute("email") String email) {

        orgService.approveOrganization(orgId, email);
        return "Organization approved";
    }

    // Reject
    @PostMapping("/reject")
    public String rejectOrg(@RequestParam Long orgId, @RequestAttribute("email") String email) {
        orgService.rejectOrganization(orgId, email);
        return "Organization rejected";
    }

    @GetMapping("/{orgId}/statistics")
    public Object getOrganizationStatistics(@PathVariable Long orgId) {

        return new Object() {
            public long total = orgService.getOrgTotalDonations(orgId);
            public long money = orgService.getOrgMoneyDonations(orgId);
            public long food = orgService.getOrgFoodDonations(orgId);
            public long service = orgService.getOrgServiceDonations(orgId);
        };
    }

    @GetMapping("/by-user/{userId}")
    public OrganizationFullDTO getOrgByUser(@PathVariable Long userId) {

        Organization org = orgService.getOrganizationByUserId(userId);

        OrganizationFullDTO dto = new OrganizationFullDTO();
        dto.id = org.getId();
        dto.name = org.getName();
        dto.type = org.getType();
        dto.address = org.getAddress();
        dto.status = org.getStatus();
        dto.documentsVerified = org.isDocumentsVerified();
        dto.inspectionCompleted = org.isInspectionCompleted();

        dto.head = org.getUsers().stream()
                .filter(u -> "ORGANIZATION".equals(u.getRole()))
                .findFirst()
                .map(u -> {
                    StaffDTO h = new StaffDTO();
                    h.id = u.getId();
                    h.name = u.getName();
                    h.email = u.getEmail();
                    h.role = u.getRole();
                    h.mobile=u.getMobile();
                    return h;
                }).orElse(null);

        dto.staff = org.getUsers().stream()
                .filter(u -> "ORG_STAFF".equals(u.getRole()))
                .map(u -> {
                    StaffDTO s = new StaffDTO();
                    s.id = u.getId();
                    s.name = u.getName();
                    s.email = u.getEmail();
                    s.role = u.getRole();
                    s.mobile=u.getMobile();
                    return s;
                }).toList();

        dto.documents = org.getDocuments().stream()
                .map(d -> {
                    DocumentDTO doc = new DocumentDTO();
                    doc.id = d.getId();
                    doc.fileName = d.getFileName();
                    doc.description = d.getDescription();
                    doc.filePath=d.getFilePath();
                    return doc;
                }).toList();

        dto.donations = org.getDonations().stream()
                .map(d -> {

                    DonationDTO don = new DonationDTO();

                    don.id = d.getId();
                    don.type = d.getType();
                    don.amount = d.getAmount();
                    don.quantity = d.getQuantity();
                    don.unit = d.getUnit();
                    don.description = d.getDescription();
                    don.status = d.getStatus();
                    don.createdAt = d.getCreatedAt();

                    if(d.getDonor()!=null){
                        don.donor = d.getDonor().getName();
                        don.donorEmail = d.getDonor().getEmail();
                    }

                    if(d.getNeed()!=null){
                        don.needTitle = d.getNeed().getTitle();
                    }

                    return don;

                }).toList();

        return dto;
    }

    @GetMapping("/orgnames")
    public List<OrganizationNameDTO> getApprovedOrganizations() {

        return orgService.getApprovedOrganizations()
                .stream()
                .map(o -> {
                    OrganizationNameDTO dto = new OrganizationNameDTO();
                    dto.id = o.getId();
                    dto.name = o.getName();

                    // ✅ Get ORG HEAD mobile
                    dto.mobile = o.getUsers().stream()
                            .filter(u -> "ORGANIZATION".equals(u.getRole()))
                            .findFirst()
                            .map(User::getMobile)
                            .orElse("N/A");

                    return dto;
                })
                .toList();
    }

    @PostMapping("/admin/create")
    public String adminCreateOrganization(
            @Valid @RequestBody OrganizationRegisterDTO dto,
            @RequestAttribute("email") String adminEmail
    ) {

        orgService.adminCreateOrganization(
                dto.getName(),
                dto.getType(),
                dto.getAddress(),
                dto.getUserName(),
                dto.getUserEmail(),
                dto.getUserPassword(),
                dto.getUserMobile(),
                adminEmail
        );

        return "Organization created by admin";
    }



}
