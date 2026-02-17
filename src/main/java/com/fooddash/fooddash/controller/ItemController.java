package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.dto.ItemRequest;
import com.fooddash.fooddash.entity.Item;
import com.fooddash.fooddash.repository.UserRepository;
import com.fooddash.fooddash.service.ItemService;
import jakarta.validation.Valid;
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
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserRepository userRepository;

    // Public: Browse available items with search/filter
    @GetMapping("/public/items")
    public List<Item> getAllItems(@RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        if (search != null && !search.isEmpty()) {
            return itemService.searchItems(search);
        } else if (category != null && !category.isEmpty()) {
            return itemService.getItemsByCategory(category);
        }
        return itemService.getAllItems();
    }

    @GetMapping("/public/items/categories")
    public List<String> getCategories() {
        return itemService.getCategories();
    }

    @GetMapping("/public/vendors/{vendorId}/items")
    public List<Item> getVendorItemsPublic(@PathVariable Long vendorId) {
        return itemService.getVendorItems(vendorId);
    }

    // Vendor: Manage their own items
    @GetMapping("/vendor/items")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public List<Item> getVendorItems(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userRepository.findByEmail(userDetails.getUsername()).get().getId();
            return itemService.getVendorItemsByUserId(userId);
        } catch (Exception e) {
            // Gracefully handle if user has no vendor profile (like an ADMIN)
            System.out.println("[ItemController] No vendor profile for user " + userDetails.getUsername()
                    + ". Returning empty items.");
            return new java.util.ArrayList<>();
        }
    }

    @PostMapping("/vendor/items")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Item> addItem(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ItemRequest request) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).get().getId();
        return ResponseEntity.ok(itemService.addItem(userId, request));
    }

    @PutMapping("/vendor/items/{itemId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Item> updateItem(@PathVariable Long itemId, @Valid @RequestBody ItemRequest request) {
        return ResponseEntity.ok(itemService.updateItem(itemId, request));
    }

    @DeleteMapping("/vendor/items/{itemId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.ok().build();
    }
}
