package com.example.smartdonation.repository;

import com.example.smartdonation.entity.Need;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NeedRepository extends JpaRepository<Need, Long> {

    List<Need> findByOrganizationId(Long organizationId);

    List<Need> findByStatus(String status);
}