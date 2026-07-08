package com.example.smartdonation.service;

import com.example.smartdonation.controller.UserController;
import com.example.smartdonation.entity.User;
import com.example.smartdonation.repository.UserRepository;
import com.example.smartdonation.entity.Organization;
import com.example.smartdonation.repository.OrganizationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final OrganizationRepository orgRepo;
    private final NotificationService notificationService;
    private final BCryptPasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepo,
                       OrganizationRepository orgRepo,
                       EmailService emailService,
                       NotificationService notificationService,
                       BCryptPasswordEncoder passwordEncoder){
        this.userRepo = userRepo;
        this.orgRepo = orgRepo;
        this.emailService = emailService;
        this.notificationService=notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------------- LOGIN ----------------
    public User login(String email, String password){
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        if(!passwordEncoder.matches(password, user.getPassword()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid password");
        if("BLOCKED".equals(user.getStatus())) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"User blocked");
        return user;
    }

    // ---------------- DONOR ----------------
    public void createDonor(User donor){
        donor.setPassword(passwordEncoder.encode(donor.getPassword()));
        donor.setRole("DONOR");
        donor.setStatus("ACTIVE");
        userRepo.save(donor);
    }

    // ---------------- ORG STAFF ----------------
    public void createStaff(User staff, Long organizationId){

        Organization organization = orgRepo.findById(organizationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Organization not found"));

        staff.setOrganization(organization);   // ✅ Correct JPA way
        staff.setRole("ORG_STAFF");
        staff.setStatus("ACTIVE");
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));

        userRepo.save(staff);
    }

    public List<User> getOrganizationStaff(Long organizationId){
        return userRepo.findByOrganizationIdAndRole(organizationId, "ORG_STAFF");
    }

    public void deleteStaff(Long staffId, Long organizationId){

        User staff = userRepo.findById(staffId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Staff not found"));

        if(!"ORG_STAFF".equals(staff.getRole()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Not a staff member");

        if(!staff.getOrganization().getId().equals(organizationId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Unauthorized");

        userRepo.delete(staff);
    }



    // ---------------- OTP ----------------
    public void requestOtp(String email){
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String otp = String.format("%06d", new Random().nextInt(999999));

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        userRepo.save(user);

        try {emailService.sendEmail(user.getEmail(), "OTP Reset", "Your OTP is: " + otp);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Email sending failed");
        }
    }

    public void verifyOtp(String email, String otp){
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOtp() == null || user.getOtpExpiry() == null || !otp.equals(user.getOtp()) || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP invalid or expired");
        }
    }

    public void resetPassword(String email, String otp, String newPassword){
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOtp() == null || user.getOtpExpiry() == null || !otp.equals(user.getOtp()) || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP invalid or expired");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepo.save(user);
    }
    public void updateUserProfile(Long userId, UserController.UpdateUserDTO dto) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (dto.getName() != null && !dto.getName().isEmpty()) {
            user.setName(dto.getName());
        }

        if (dto.getMobile() != null && !dto.getMobile().isEmpty()) {
            user.setMobile(dto.getMobile());
        }

        userRepo.save(user);
    }

    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void adminCreateUser(UserController.AdminCreateUserDTO dto, String adminEmail) {

        // 🔹 Check admin
        User admin = userRepo.findByEmail(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        if (!"ADMIN".equals(admin.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin allowed");

        // 🔹 Validate role
        if (!"ADMIN".equals(dto.role) && !"DONOR".equals(dto.role)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }

        // 🔹 Check email
        if (userRepo.findByEmail(dto.email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        // 🔹 Create user
        User user = new User();
        user.setName(dto.name);
        user.setEmail(dto.email);
        user.setPassword(passwordEncoder.encode(dto.password));
        user.setMobile(dto.mobile);
        user.setRole(dto.role);
        user.setStatus("ACTIVE");

        userRepo.save(user);

        // 🔔 Notification (IMPORTANT)
        notificationService.send(
                user,
                "Your profile was created by admin. Please update if needed.",
                "USER"
        );
    }
    public void updateTheme(Long userId, String theme) {

        if (!"light".equals(theme) && !"dark".equals(theme)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid theme");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setTheme(theme);
        userRepo.save(user);
    }

    public List<UserController.UserResponseDTO> getAllUsers(String adminEmail) {

        // 🔒 Only admin can view all users
        User admin = userRepo.findByEmail(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        if (!"ADMIN".equals(admin.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin allowed");
        }

        return userRepo.findAll()
                .stream()
                .map(UserController.UserResponseDTO::new)
                .toList();
    }
}
