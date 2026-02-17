package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.entity.User;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.dto.AdminStatsDTO;
import com.fooddash.fooddash.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/vendors")
    public List<Vendor> getAllVendors() {
        return adminService.getAllVendors();
    }

    @GetMapping("/orders")
    public List<com.fooddash.fooddash.entity.Order> getAllOrders() {
        return adminService.getAllOrders();
    }

    @GetMapping("/stats")
    public AdminStatsDTO getPlatformStats() {
        return adminService.getPlatformStats();
    }

    @PatchMapping("/vendors/{vendorId}/approve")
    public ResponseEntity<Vendor> approveVendor(@PathVariable Long vendorId, @RequestParam Boolean approved) {
        return ResponseEntity.ok(adminService.approveVendor(vendorId, approved));
    }

    @PatchMapping("/users/{userId}/active")
    public ResponseEntity<User> toggleUserActive(@PathVariable Long userId, @RequestParam Boolean active) {
        return ResponseEntity.ok(adminService.toggleUserActive(userId, active));
    }
}
