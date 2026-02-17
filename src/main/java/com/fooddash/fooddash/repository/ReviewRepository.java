package com.fooddash.fooddash.repository;

import com.fooddash.fooddash.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVendorId(Long vendorId);
}
