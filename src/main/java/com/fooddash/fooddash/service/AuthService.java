package com.fooddash.fooddash.service;

import com.fooddash.fooddash.dto.*;
import com.fooddash.fooddash.entity.Role;
import com.fooddash.fooddash.entity.User;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.repository.UserRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import com.fooddash.fooddash.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private EmailService emailService;

    @Transactional
    public ApiResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.USER);
        user.setActive(true);

        userRepository.save(user);

        return new ApiResponse(true, "User registered successfully");
    }

    @Transactional
    public ApiResponse registerVendor(VendorSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already exists");
        }

        // Create user account with VENDOR role
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.VENDOR);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Create vendor profile
        Vendor vendor = new Vendor();
        vendor.setUser(savedUser);
        vendor.setBusinessName(request.getBusinessName());
        vendor.setDescription(request.getDescription());
        vendor.setAddress(request.getAddress());
        vendor.setPhone(request.getPhone());
        vendor.setApproved(false); // Requires admin approval

        vendorRepository.save(vendor);

        return new ApiResponse(true, "Vendor registered successfully. Awaiting admin approval.");
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long vendorId = null;
        String businessName = null;

        if (user.getRole() == Role.VENDOR) {
            Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(null);
            if (vendor != null) {
                vendorId = vendor.getId();
                businessName = vendor.getBusinessName();
            }
        }

        return new LoginResponse(token, user.getEmail(), user.getName(), user.getRole().name(), vendorId, businessName,
                user.getPhone());
    }

    @Transactional
    public ApiResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            // We return true even if user not found for security reasons (don't leak
            // emails)
            // But in a internal dev demo, we can be more explicit if needed.
            // Let's return true anyway to follow best practices.
            return new ApiResponse(true, "If an account exists with this email, a reset link has been sent.");
        }

        // Generate temporary password
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), tempPassword);

        return new ApiResponse(true, "A temporary password has been sent to your email.");
    }
}
