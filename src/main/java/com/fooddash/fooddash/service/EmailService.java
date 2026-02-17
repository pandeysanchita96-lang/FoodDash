package com.fooddash.fooddash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Async
    public void sendWelcomeEmail(String to, String name) {
        if (mailSender == null) {
            System.out.println("[EmailService] Mail sender not configured. Skipping welcome email to: " + to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to FoodDash! 🍕");
            message.setText(
                    "Hi " + name + ",\n\n" +
                            "Welcome to FoodDash! We're excited to have you on board.\n\n" +
                            "You can now:\n" +
                            "✓ Browse restaurants and cuisines\n" +
                            "✓ Place orders with fast delivery\n" +
                            "✓ Track your orders in real-time\n\n" +
                            "Start ordering your favorite food today!\n\n" +
                            "Best regards,\n" +
                            "The FoodDash Team");
            mailSender.send(message);
            System.out.println("[EmailService] Welcome email sent to: " + to);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    @Async
    public void sendOrderConfirmation(String to, String name, Long orderId, double total) {
        if (mailSender == null) {
            System.out.println("[EmailService] Mail sender not configured. Skipping order confirmation to: " + to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Order Confirmed! #" + orderId + " 🎉");
            message.setText(
                    "Hi " + name + ",\n\n" +
                            "Great news! Your order #" + orderId + " has been confirmed.\n\n" +
                            "Order Total: ₹" + String.format("%.2f", total) + "\n\n" +
                            "You can track your order status in the app.\n\n" +
                            "Thank you for choosing FoodDash!\n\n" +
                            "Best regards,\n" +
                            "The FoodDash Team");
            mailSender.send(message);
            System.out.println("[EmailService] Order confirmation sent to: " + to);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    @Async
    public void sendVendorNewOrderNotification(String to, String vendorName, Long orderId) {
        if (mailSender == null) {
            System.out.println("[EmailService] Mail sender not configured. Skipping vendor notification to: " + to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("New Order Received! #" + orderId + " 🔔");
            message.setText(
                    "Hi " + vendorName + ",\n\n" +
                            "You have received a new order #" + orderId + "!\n\n" +
                            "Please log in to your Vendor Dashboard to view and process the order.\n\n" +
                            "Best regards,\n" +
                            "The FoodDash Team");
            mailSender.send(message);
            System.out.println("[EmailService] Vendor notification sent to: " + to);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String name, String tempPassword) {
        if (mailSender == null) {
            System.out.println("[EmailService] Mail sender not configured. Skipping password reset email to: " + to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password Reset - FoodDash 🔐");
            message.setText(
                    "Hi " + name + ",\n\n" +
                            "We received a request to reset your password.\n\n" +
                            "Your temporary password is: " + tempPassword + "\n\n" +
                            "Please log in using this password and change it immediately from your profile settings.\n\n"
                            +
                            "If you did not request this, please contact support.\n\n" +
                            "Best regards,\n" +
                            "The FoodDash Team");
            mailSender.send(message);
            System.out.println("[EmailService] Password reset email sent to: " + to);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
