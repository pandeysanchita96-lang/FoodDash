package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.entity.Favorite;
import com.fooddash.fooddash.entity.User;
import com.fooddash.fooddash.repository.FavoriteRepository;
import com.fooddash.fooddash.repository.UserRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<Favorite> getFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUserId(user.getId());
    }

    @PostMapping("/{vendorId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> toggleFavorite(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long vendorId) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndVendorId(user.getId(), vendorId);

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return ResponseEntity.ok("Removed from favorites");
        } else {
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setVendor(vendorRepository.findById(vendorId)
                    .orElseThrow(() -> new RuntimeException("Vendor not found")));
            favoriteRepository.save(favorite);
            return ResponseEntity.ok("Added to favorites");
        }
    }
}
