package com.example.smartdonation.controller;

import com.example.smartdonation.entity.User;
import com.example.smartdonation.service.UserService;
import com.example.smartdonation.config.JwtUtil;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ---------------- DTOs ----------------
    static class LoginDTO { public String email; public String password; }
    static class OTPRequestDTO { public String email; }
    static class OTPVerifyDTO { public String email; public String otp; }
    static class ResetPasswordDTO { public String email; public String otp; public String newPassword; }
    static class StaffCreateDTO {
        @Valid public User staff;
        public Long organizationId;
    }
    static class LoginResponseDTO { public String token;public String role;public Long userId;
        public LoginResponseDTO(String token, String role, Long userId) {
            this.token = token;
            this.role = role;
            this.userId = userId;
        }
    }
    public static class UserResponseDTO {
        public Long id;
        public String name;
        public String email;
        public String role;
        public String mobile;
        public String createdAt;

        public UserResponseDTO(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole();
            this.mobile = user.getMobile();
            this.createdAt = user.getCreatedAt() != null
                    ? user.getCreatedAt().toString()
                    : null;
        }
    }
    public static class ThemeDTO {
        public String theme; // "light" or "dark"
    }

    public static class UpdateUserDTO {

        private String name;
        private String mobile;

        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getMobile() {
            return mobile;
        }
        public void setMobile(String mobile) {
            this.mobile = mobile;
        }
    }

    // 🔥 ADMIN creates ADMIN / DONOR
    public static class AdminCreateUserDTO {
        public String name;
        public String email;
        public String password;
        public String mobile;
        public String role; // ADMIN or DONOR
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginDTO dto){

        User user = userService.login(dto.email, dto.password);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new LoginResponseDTO(token, user.getRole(), user.getId());
    }

    @PostMapping("/donor")
    public String createDonor(@Valid @RequestBody User donor){
        userService.createDonor(donor);
        return "Donor registered";
    }

    @PostMapping("/staff")
    public String createStaff(@Valid @RequestBody StaffCreateDTO dto){
        userService.createStaff(dto.staff, dto.organizationId);
        return "Staff registered";
    }

    @GetMapping("/{orgId}/staff")
    public List<User> getOrganizationStaff(@PathVariable Long orgId){
        return userService.getOrganizationStaff(orgId);
    }

    @DeleteMapping("/{orgId}/staff/{staffId}")
    public String deleteStaff(
            @PathVariable Long orgId,
            @PathVariable Long staffId){

        userService.deleteStaff(staffId, orgId);
        return "Staff deleted successfully";
    }


    @PostMapping("/forgot-password/request")
    public String requestOtp(@RequestBody OTPRequestDTO dto){
        userService.requestOtp(dto.email);
        return "OTP sent";
    }

    @PostMapping("/forgot-password/verify")
    public String verifyOtp(@RequestBody OTPVerifyDTO dto){
        userService.verifyOtp(dto.email, dto.otp);
        return "OTP verified";
    }

    @PostMapping("/forgot-password/reset")
    public String resetPassword(@RequestBody ResetPasswordDTO dto){
        userService.resetPassword(dto.email, dto.otp, dto.newPassword);
        return "Password reset";
    }

    @PutMapping("/profile/{userId}")
    public String updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserDTO dto
    ) {
        userService.updateUserProfile(userId, dto);
        return "User profile updated";
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/admin/create-user")
    public String adminCreateUser(
            @RequestBody AdminCreateUserDTO dto,
            @RequestAttribute("email") String adminEmail
    ) {
        userService.adminCreateUser(dto, adminEmail);
        return "User created by admin";
    }
    @PutMapping("/theme/{userId}")
    public String updateTheme(
            @PathVariable Long userId,
            @RequestBody ThemeDTO dto
    ) {
        userService.updateTheme(userId, dto.theme);
        return "Theme updated";
    }

    @GetMapping("/all")
    public List<UserResponseDTO> getAllUsers(
            @RequestAttribute("email") String adminEmail
    ) {
        return userService.getAllUsers(adminEmail);
    }
}
