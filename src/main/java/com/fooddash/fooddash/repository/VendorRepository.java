package com.fooddash.fooddash.repository;

import com.fooddash.fooddash.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByUserId(Long userId);

    List<Vendor> findByApproved(Boolean approved);

    List<Vendor> findByApprovedTrueAndBusinessNameContainingIgnoreCase(String name);

    List<Vendor> findByApprovedTrueAndCategoryContainingIgnoreCase(String category);
}
