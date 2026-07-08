
package com.example.smartdonation.repository;

import com.example.smartdonation.entity.Donation;
import com.example.smartdonation.entity.User;
import com.example.smartdonation.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonor(User donor);

    List<Donation> findByOrganization(Organization organization);

    long countByType(String type);

    long countByOrganizationId(Long organizationId);

    long countByOrganizationIdAndType(Long organizationId, String type);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donor = :donor")
    long countByDonor(@Param("donor") User donor);

    @Query("SELECT COALESCE(AVG(d.amount),0) FROM Donation d WHERE d.donor.id = :donorId")
    Double getAvgAmount(@Param("donorId") Long donorId);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donor.id = :donorId AND d.createdAt >= CURRENT_TIMESTAMP - 1 DAY")
    long countLast24h(@Param("donorId") Long donorId);
}