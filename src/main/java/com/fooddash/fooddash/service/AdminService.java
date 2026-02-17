package com.fooddash.fooddash.service;

import com.fooddash.fooddash.dto.AdminStatsDTO;
import com.fooddash.fooddash.entity.User;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.repository.UserRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private com.fooddash.fooddash.repository.OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public List<com.fooddash.fooddash.entity.Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public AdminStatsDTO getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalVendors = vendorRepository.count();
        long totalOrders = orderRepository.count();
        double totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == com.fooddash.fooddash.entity.OrderStatus.DELIVERED)
                .mapToDouble(com.fooddash.fooddash.entity.Order::getTotalAmount)
                .sum();

        return new AdminStatsDTO(totalUsers, totalVendors, totalOrders, totalRevenue);
    }

    @Transactional
    public Vendor approveVendor(Long vendorId, Boolean approved) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setApproved(approved);
        return vendorRepository.save(vendor);
    }

    @Transactional
    public User toggleUserActive(Long userId, Boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        return userRepository.save(user);
    }
}
