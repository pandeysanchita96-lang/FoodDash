package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double amount = Double.parseDouble(data.get("amount").toString());
            String orderData = paymentService.createOrder(amount);
            return ResponseEntity.ok(orderData);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Error creating Razorpay order: " + e.getMessage());
        }
    }
}
