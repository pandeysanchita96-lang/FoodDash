package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.dto.*;
import com.fooddash.fooddash.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        ApiResponse response = authService.registerUser(request);
        if (response.getSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/register-vendor")
    public ResponseEntity<?> registerVendor(@Valid @RequestBody VendorSignupRequest request) {
        ApiResponse response = authService.registerVendor(request);
        if (response.getSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid email or password"));
        }
    }

    @PostMapping({ "/forgot-password", "/forgot_password" })
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        ApiResponse response = authService.forgotPassword(email);
        return ResponseEntity.ok(response);
    }
}
