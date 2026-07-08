package com.example.smartdonation.repository;

import com.example.smartdonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByOrganizationIdAndRole(Long organizationId, String role);
    List<User> findByRole(String role);
}
