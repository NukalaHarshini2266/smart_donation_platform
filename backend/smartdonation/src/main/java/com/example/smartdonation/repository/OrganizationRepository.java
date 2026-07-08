package com.example.smartdonation.repository;

import com.example.smartdonation.entity.Organization;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    long countByStatus(String status);

    @Query("""
    SELECT DISTINCT o FROM Organization o
    LEFT JOIN FETCH o.documents
    LEFT JOIN FETCH o.users
    LEFT JOIN FETCH o.donations
    """)
    List<Organization> findAllWithRelations();

    List<Organization> findByStatus(String status);

    @Query("SELECT o FROM Organization o JOIN o.users u WHERE u.id = :userId")
    Optional<Organization> findByUserIdWithAll(@Param("userId") Long userId);



}
