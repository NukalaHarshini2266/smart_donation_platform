package com.example.smartdonation.service;

import com.example.smartdonation.entity.Organization;
import com.example.smartdonation.entity.OrganizationDocument;
import com.example.smartdonation.entity.User;
import com.example.smartdonation.repository.OrganizationDocumentRepository;
import com.example.smartdonation.controller.OrganizationController;
import com.example.smartdonation.repository.OrganizationRepository;
import com.example.smartdonation.repository.UserRepository;
import com.example.smartdonation.repository.DonationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrganizationService {

    private final OrganizationRepository orgRepo;
    private final OrganizationDocumentRepository docRepo;
    private final UserRepository userRepo;
    private final DonationRepository donationRepo;
    private final NotificationService notificationService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final String uploadDir = System.getProperty("user.dir") +"/uploads/organizations/";

    public OrganizationService(OrganizationRepository orgRepo,
                               OrganizationDocumentRepository docRepo,
                               UserRepository userRepo,
                               DonationRepository donationRepo,
                               NotificationService notificationService,
                               BCryptPasswordEncoder passwordEncoder){
        this.orgRepo = orgRepo;
        this.docRepo = docRepo;
        this.userRepo = userRepo;
        this.donationRepo = donationRepo;
        this.notificationService=notificationService;
        this.passwordEncoder = passwordEncoder;
        File dir = new File(uploadDir);
        if(!dir.exists()) dir.mkdirs();
    }

    public Organization registerOrganization(
            String name, String type, String address,
            String userName, String userEmail, String userPassword, String userMobile,
            MultipartFile[] files, String[] descriptions
    ) throws IOException {
        if(files.length != descriptions.length)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Files and descriptions count mismatch");

        Organization org = new Organization();
        org.setName(name); org.setType(type); org.setAddress(address);
        org.setStatus("PENDING");
        org.setDocumentsVerified(false);
        org.setInspectionCompleted(false);
        Organization savedOrg = orgRepo.save(org);

        // Save documents
        for(int i=0;i<files.length;i++){
            MultipartFile file = files[i];
            String desc = descriptions[i];
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir+ fileName;
            System.out.println("Uploading to path: " + filePath);
            file.transferTo(new File(filePath));
            OrganizationDocument doc = new OrganizationDocument();
            //doc.setOrganizationId(savedOrg.getId());
            doc.setOrganization(savedOrg);
            doc.setFileName(fileName);
            doc.setFilePath("/uploads/organizations/" + fileName);
            doc.setDescription(desc);
            docRepo.save(doc);

            // 🔔 Notify all admins
            List<User> admins = userRepo.findByRole("ADMIN");

            for (User admin : admins) {
                notificationService.send(admin,
                        "New organization registered: " + savedOrg.getName(),
                        "ORG");
            }
        }

        // First org user
        User firstUser = new User();
        firstUser.setName(userName);
        firstUser.setEmail(userEmail);
        firstUser.setMobile(userMobile);
        firstUser.setPassword(passwordEncoder.encode(userPassword));
        firstUser.setRole("ORGANIZATION");
        //firstUser.setOrganizationId(savedOrg.getId());
        firstUser.setStatus("ACTIVE");
        firstUser.setOrganization(savedOrg);
        userRepo.save(firstUser);

        return savedOrg;
    }

    public long getTotalOrganizations() {
        return orgRepo.count();
    }

    public long getPendingOrganizationscount() {
        return orgRepo.countByStatus("PENDING");
    }

    public long getApprovedOrganizationscount() {
        return orgRepo.countByStatus("ACTIVE");
    }

    public List<Organization> getAllOrganizations() {
        return orgRepo.findAllWithRelations();
    }



    public List<OrganizationDocument> getOrganizationDocuments(Long orgId) {
        return docRepo.findByOrganizationId(orgId);
    }

    public Resource loadFile(String fileName) throws IOException {

        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"File not found: " + fileName);
        }
    }

    // Get all pending organizations
    public List<Organization> getPendingOrganizations() {
        return orgRepo.findByStatus("PENDING");
    }

    // Update checklist (documents / inspection)
    public void updateChecklist(Long orgId, String type, boolean value,String email ) {
        User admin = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"ADMIN".equals(admin.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");

        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Org not found"));

        if ("DOCUMENTS".equals(type)) {
            org.setDocumentsVerified(value);
        }

        if ("INSPECTION".equals(type)) {
            org.setInspectionCompleted(value);
        }

        orgRepo.save(org);
    }

    // Approve organization

    public void approveOrganization(Long orgId, String email) {

        User admin = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"ADMIN".equals(admin.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Org not found"));

        if (!org.isDocumentsVerified() || !org.isInspectionCompleted())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Checklist incomplete");

        org.setStatus("ACTIVE");
        org.setApprovedAt(LocalDateTime.now());
        orgRepo.save(org);

        User orgUser = org.getUsers()
                .stream()
                .findFirst()
                .orElse(null);

        if (orgUser != null) {
            notificationService.send(orgUser,
                    "Your organization has been APPROVED",
                    "ORG");
        }

    }

    // Reject organization
    public void rejectOrganization(Long orgId, String email) {
        User admin = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"ADMIN".equals(admin.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");

        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Org not found"));

        org.setStatus("REJECTED");
        orgRepo.save(org);

        User orgUser = org.getUsers()
                .stream()
                .findFirst()
                .orElse(null);

        if (orgUser != null) {
            notificationService.send(orgUser,
                    "Your organization has been REJECTED",
                    "ORG");
        }
    }

    public long getOrgTotalDonations(Long orgId) {
        return donationRepo.countByOrganizationId(orgId);
    }

    public long getOrgMoneyDonations(Long orgId) {
        return donationRepo.countByOrganizationIdAndType(orgId, "MONEY");
    }

    public long getOrgFoodDonations(Long orgId) {
        return donationRepo.countByOrganizationIdAndType(orgId, "FOOD");
    }

    public long getOrgServiceDonations(Long orgId) {
        return donationRepo.countByOrganizationIdAndType(orgId, "SERVICE");
    }

    @Transactional(readOnly = true)
    public Organization getOrganizationByUserId(Long userId) {

        return orgRepo.findByUserIdWithAll(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Organization not found"));
    }


    public List<Organization> getApprovedOrganizations() {
        return orgRepo.findByStatus("ACTIVE"); // ✅ CORRECT
    }

    @Transactional
    public void updateOrganization(Long orgId,
                                   OrganizationController.OrganizationUpdateDTO dto,
                                   MultipartFile[] newFiles) {

        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Org not found"));

        // ---------------- UPDATE ORGANIZATION ----------------
        if (dto.name != null) org.setName(dto.name);
        if (dto.address != null) org.setAddress(dto.address);

        // ---------------- UPDATE USER ----------------
        User orgHead = org.getUsers()
                .stream()
                .filter(u -> "ORGANIZATION".equals(u.getRole()))
                .findFirst()
                .orElseThrow();

        if (dto.userName != null) orgHead.setName(dto.userName);
        if (dto.userMobile != null) orgHead.setMobile(dto.userMobile);

        userRepo.save(orgHead);

        org.setStatus("PENDING");
        orgRepo.save(org);

        // ---------------- 1. UPDATE EXISTING DOCUMENTS ----------------
        if (dto.documents != null) {

            for (OrganizationController.OrganizationUpdateDTO.DocumentUpdateDTO d : dto.documents) {

                if (d.id == null) continue;

                OrganizationDocument doc = docRepo.findById(d.id)
                        .orElse(null);

                if (doc == null) continue;

                if (d.description != null) {
                    doc.setDescription(d.description);
                    docRepo.save(doc);
                }
            }
        }

        // ---------------- 2. ADD NEW DOCUMENTS ----------------
        if (newFiles != null) {

            for (int i = 0; i < newFiles.length; i++) {

                MultipartFile file = newFiles[i];

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                try {
                    file.transferTo(new File(uploadDir + fileName));
                }catch (IOException e) {
                    throw new RuntimeException("Upload failed", e);
                }
                OrganizationDocument doc = new OrganizationDocument();
                doc.setOrganization(org);
                doc.setFileName(fileName);
                doc.setFilePath("/uploads/organizations/" + fileName);

                String desc = null;

                if (dto.newDescriptions != null && i < dto.newDescriptions.size()) {
                    desc = dto.newDescriptions.get(i);
                }

                doc.setDescription(desc);

                docRepo.save(doc);
            }
        }
    }

    public void adminCreateOrganization(
            String name, String type, String address,
            String userName, String userEmail, String userPassword, String userMobile,
            String adminEmail
    ) {

        // 🔹 Check admin
        User admin = userRepo.findByEmail(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        if (!"ADMIN".equals(admin.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin allowed");

        // 🔹 Check email exists
        if (userRepo.findByEmail(userEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User email already exists");
        }

        // 🔹 Create Organization
        Organization org = new Organization();
        org.setName(name);
        org.setType(type);
        org.setAddress(address);
        org.setStatus("ACTIVE"); // directly active (admin created)
        org.setDocumentsVerified(true);
        org.setInspectionCompleted(true);
        org.setApprovedAt(LocalDateTime.now());

        Organization savedOrg = orgRepo.save(org);

        // 🔹 Create Org User
        User user = new User();
        user.setName(userName);
        user.setEmail(userEmail);
        user.setMobile(userMobile);
        user.setPassword(passwordEncoder.encode(userPassword));
        user.setRole("ORGANIZATION");
        user.setStatus("ACTIVE");
        user.setOrganization(savedOrg);

        userRepo.save(user);

        // 🔔 Notification to Org User
        notificationService.send(
                user,
                "Your organization account was created by admin. Please update your profile if needed.",
                "ORG"
        );
    }
}
