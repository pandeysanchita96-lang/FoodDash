package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public ResponseEntity<String> testEmail(@RequestParam String to) {
        try {
            emailService.sendWelcomeEmail(to, "Test User");
            return ResponseEntity.ok("Test email sent successfully to " + to + ". Please check your inbox.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}
