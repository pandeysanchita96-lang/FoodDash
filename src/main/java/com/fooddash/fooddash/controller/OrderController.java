package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.dto.OrderRequest;
import com.fooddash.fooddash.entity.Order;
import com.fooddash.fooddash.entity.OrderStatus;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.repository.UserRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import com.fooddash.fooddash.service.OrderService;
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
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @PostMapping("/user/orders")
    @PreAuthorize("hasAnyRole('USER', 'VENDOR', 'ADMIN')")
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequest request) {
        try {
            Long userId = userRepository.findByEmail(userDetails.getUsername()).get().getId();
            System.out.println("[OrderController] Received order request from user: " + userId + " for vendor: "
                    + request.getVendorId());
            Order savedOrder = orderService.createOrder(userId, request);
            System.out.println("[OrderController] Order created successfully: " + savedOrder.getId());
            return ResponseEntity.ok(savedOrder);
        } catch (Throwable t) {
            System.err.println("[OrderController] CRITICAL ERROR during order placement:");
            t.printStackTrace();
            String message = t.getMessage() != null ? t.getMessage() : t.getClass().getName();
            return ResponseEntity.internalServerError().body("Failed to place order: " + message);
        }
    }

    @GetMapping("/user/orders")
    @PreAuthorize("hasAnyRole('USER', 'VENDOR', 'ADMIN')")
    public List<Order> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userRepository.findByEmail(userDetails.getUsername()).get().getId();
            return orderService.getUserOrders(userId);
        } catch (Exception e) {
            System.err.println("[OrderController] Error fetching user orders: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    @GetMapping("/vendor/orders")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public List<Order> getVendorOrders(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userRepository.findByEmail(userDetails.getUsername()).get().getId();
            System.out.println("[OrderController] Fetching orders for user: " + userId);

            Long vendorId = vendorRepository.findByUserId(userId)
                    .map(Vendor::getId)
                    .orElse(null);

            if (vendorId == null) {
                System.out.println("[OrderController] No vendor profile found for user: " + userId
                        + ". Returning empty order list.");
                return new java.util.ArrayList<>();
            }

            System.out.println("[OrderController] Fetching orders for vendor: " + vendorId);
            List<Order> orders = orderService.getVendorOrders(vendorId);
            System.out.println("[OrderController] Found " + orders.size() + " orders for vendor " + vendorId);
            return orders;
        } catch (Exception e) {
            System.err.println("[OrderController] Error in getVendorOrders: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    @GetMapping("/vendor/stats")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public com.fooddash.fooddash.dto.VendorStatsDTO getVendorStats(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userRepository.findByEmail(userDetails.getUsername()).get().getId();
            Long vendorId = vendorRepository.findByUserId(userId)
                    .map(Vendor::getId)
                    .orElse(null);

            if (vendorId == null) {
                return new com.fooddash.fooddash.dto.VendorStatsDTO(0L, 0.0, 0L, 0L);
            }
            return orderService.getVendorStats(vendorId);
        } catch (Exception e) {
            System.err.println("[OrderController] Error in getVendorStats: " + e.getMessage());
            return new com.fooddash.fooddash.dto.VendorStatsDTO(0L, 0.0, 0L, 0L);
        }
    }

    @GetMapping("/vendor/all-orders")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String role = userDetails.getAuthorities().toString();
            System.out.println("[OrderController] Global view access for user: " + userDetails.getUsername()
                    + " with roles: " + role);
            System.out.println("[OrderController] Fetching ALL orders for global view");
            long start = System.currentTimeMillis();
            List<Order> orders = orderService.getAllOrders();
            long end = System.currentTimeMillis();
            System.out.println(
                    "[OrderController] Successfully fetched " + orders.size() + " orders in " + (end - start) + "ms");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("[OrderController] ERROR fetching all orders:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch all orders: " + e.getMessage());
        }
    }

    @GetMapping("/vendor/all-stats")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllStats(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            System.out.println(
                    "[OrderController] Fetching ALL stats for global view. Requested by: " + userDetails.getUsername());
            return ResponseEntity.ok(orderService.getAllStats());
        } catch (Exception e) {
            System.err.println("[OrderController] ERROR fetching all stats:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to fetch all stats: " + e.getMessage());
        }
    }

    @PatchMapping("/vendor/orders/{orderId}/status")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
