package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.entity.Review;
import com.fooddash.fooddash.entity.User;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.repository.ReviewRepository;
import com.fooddash.fooddash.repository.UserRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @GetMapping("/public/vendors/{vendorId}/reviews")
    public List<Review> getVendorReviews(@PathVariable Long vendorId) {
        return reviewRepository.findByVendorId(vendorId);
    }

    @PostMapping("/user/reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Review> addReview(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Review review) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        review.setUser(user);

        Vendor vendor = vendorRepository.findById(review.getVendor().getId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        review.setVendor(vendor);

        Review savedReview = reviewRepository.save(review);

        // Update vendor rating
        updateVendorRating(vendor);

        return ResponseEntity.ok(savedReview);
    }

    private void updateVendorRating(Vendor vendor) {
        List<Review> reviews = reviewRepository.findByVendorId(vendor.getId());
        double avgRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        vendor.setRating(avgRating);
        vendor.setRatingCount(reviews.size());
        vendorRepository.save(vendor);
    }
}
