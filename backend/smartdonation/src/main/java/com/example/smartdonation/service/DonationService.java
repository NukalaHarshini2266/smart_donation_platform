
package com.example.smartdonation.service;

import com.example.smartdonation.entity.*;
import com.example.smartdonation.repository.*;
import com.example.smartdonation.service.NotificationService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

import java.time.LocalDateTime;
import java.util.List;
import java.time.temporal.ChronoUnit;

@Service
public class DonationService {

    private final DonationRepository donationRepo;
    private final UserRepository userRepo;
    private final OrganizationRepository orgRepo;
    private final NeedRepository needRepo;
    private final NotificationService notificationService;

    public DonationService(DonationRepository donationRepo,
                           UserRepository userRepo,
                           OrganizationRepository orgRepo,
                           NeedRepository needRepo,
                           NotificationService notificationService) {

        this.donationRepo = donationRepo;
        this.userRepo = userRepo;
        this.orgRepo = orgRepo;
        this.needRepo = needRepo;
        this.notificationService = notificationService;
    }

    // ✅ UPDATED VALIDATION
    private void validateDonation(Donation donation){

        if(donation.getType()==null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Donation type required");
        }

        switch (donation.getType()) {

            case "MONEY":

                if(donation.getAmount()==null){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Amount required");
                }

                // ✅ NEW LOGIC: payment mode required
                if(donation.getPaymentMode()==null){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Payment mode required (UPI/CASH)");
                }

                // ✅ CASH → needs pickup details
                if("CASH".equalsIgnoreCase(donation.getPaymentMode())){
                    if(donation.getDonorAddress()==null || donation.getPreferredPickupTime()==null){
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Address & pickup time required for cash donation");
                    }
                }

                // ❌ remove unnecessary fields
                donation.setQuantity(null);
                donation.setUnit(null);

                break;


            case "FOOD":

                if(donation.getQuantity()==null || donation.getUnit()==null){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Food quantity & unit required");
                }

                // ✅ pickup required
                if(donation.getDonorAddress()==null || donation.getPreferredPickupTime()==null){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Address & pickup time required for food donation");
                }

                donation.setAmount(null);
                break;


            case "SERVICE":

                if(donation.getQuantity()==null || donation.getUnit()==null){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Service hours required");
                }

                // ✅ service scheduling required
                if(donation.getServiceDate()==null || donation.getServiceTime()==null){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Service date & time required");
                }

                donation.setAmount(null);
                break;


            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid donation type");
        }
    }



    // ✅ NEED DONATION (UPDATED WITH RESTRICTION LOGIC)
    public Donation donateToNeed(Long donorId, Long needId, Donation donation){

        User donor = userRepo.findById(donorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Donor not found"));

        Need need = needRepo.findById(needId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Need not found"));

        validateDonation(donation);



        donation.setDonor(donor);
        donation.setOrganization(need.getOrganization());
        donation.setNeed(need);

        donation.setStatus("PENDING");

        //return donationRepo.save(donation);
        Donation saved = donationRepo.save(donation);

        // donor
        notificationService.send(donor,
                "Your donation has been submitted successfully",
                "DONATION");

        // organization (notify org head)
        User orgUser = need.getOrganization().getUsers()
                .stream()
                .findFirst()
                .orElse(null);

        if (orgUser != null) {
            notificationService.send(orgUser,
                    "New donation received for need: " + need.getTitle(),
                    "DONATION");
        }

        return saved;
    }


    // ✅ COMPLETE DONATION
    public Donation completeDonation(Long id){

        Donation donation = donationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Donation not found"));

        donation.setStatus("COMPLETED");

        if(donation.getNeed()!=null){

            Need need = donation.getNeed();

            Double collected = need.getCollectedQuantity()==null ? 0 : need.getCollectedQuantity();

            if("MONEY".equals(donation.getType())){
                collected += donation.getAmount().doubleValue();
            } else {
                collected += donation.getQuantity();
            }

            need.setCollectedQuantity(collected);
            needRepo.save(need);
        }

        notificationService.send(donation.getDonor(),
                "Your donation is COMPLETED",
                "DONATION");

        return donationRepo.save(donation);
    }

    // ✅ MANUAL DONATION (NO RESTRICTIONS)
    public Donation manualDonation(Long donorId, Long orgId, Donation donation){

        User donor = userRepo.findById(donorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Donor not found"));

        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Organization not found"));

        validateDonation(donation);

        // ✅ NO item restriction here (free donation)

        donation.setDonor(donor);
        donation.setOrganization(org);


//        if("MONEY".equals(donation.getType()) &&
//                "UPI".equalsIgnoreCase(donation.getPaymentMode())){
//
//            donation.setStatus("COMPLETED"); // ✅ only here
//        }else{
//            donation.setStatus("PENDING");
//        }
        donation.setStatus("PENDING");

        Donation saved = donationRepo.save(donation);

        // donor
        notificationService.send(donor,
                "Your donation has been submitted successfully",
                "DONATION");

        // organization
        User orgUser = org.getUsers()
                .stream()
                .findFirst()
                .orElse(null);

        if (orgUser != null) {
            notificationService.send(orgUser,
                    "New donation received",
                    "DONATION");
        }

        return saved;

    }


    // Accept donation
    public Donation acceptDonation(Long id){

        Donation donation = donationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Donation not found"));

        donation.setStatus("ACCEPTED");

        notificationService.send(donation.getDonor(),
                "Your donation has been ACCEPTED",
                "DONATION");

        return donationRepo.save(donation);
    }


    // Reject donation
    public Donation rejectDonation(Long id, String reason){

        Donation donation = donationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Donation not found"));

        donation.setStatus("REJECTED");
        donation.setRejectionReason(reason);
        notificationService.send(donation.getDonor(),
                "Your donation was REJECTED: " + reason,
                "DONATION");

        return donationRepo.save(donation);
    }


    // Existing APIs (unchanged)

    public List<Donation> getAllDonations() {
        return donationRepo.findAll();
    }

    public List<Donation> getDonationsByDonor(Long donorId) {

        User donor = userRepo.findById(donorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Donor not found"));

        return donationRepo.findByDonor(donor);
    }

    public List<Donation> getDonationsByOrganization(Long orgId) {

        Organization org = orgRepo.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Organization not found"));

        return donationRepo.findByOrganization(org);
    }

    public long getTotalDonations() {
        return donationRepo.count();
    }

    public long getMoneyDonationsCount() {
        return donationRepo.countByType("MONEY");
    }

    public long getFoodDonationsCount() {
        return donationRepo.countByType("FOOD");
    }

    public long getServiceDonationsCount() {
        return donationRepo.countByType("SERVICE");
    }



}