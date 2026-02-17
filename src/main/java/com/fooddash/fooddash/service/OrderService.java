package com.fooddash.fooddash.service;

import com.fooddash.fooddash.dto.OrderRequest;
import com.fooddash.fooddash.entity.*;
import com.fooddash.fooddash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Order createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Order order = new Order();
        order.setUser(user);
        order.setVendor(vendor);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setNotes(request.getNotes());
        order.setStatus(OrderStatus.PENDING);
        order.setTransactionId(request.getTransactionId());
        order.setPaymentStatus(request.getTransactionId() != null ? "PAID" : "PENDING");
        order.setCreatedAt(LocalDateTime.now());

        double totalAmount = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemReq.getItemId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setItem(item);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(item.getPrice());

            totalAmount += item.getPrice() * itemReq.getQuantity();
            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        System.out.println("[OrderService] Saving order for user: " + userId + " with total amount: " + totalAmount);
        Order savedOrder = orderRepository.save(order);
        System.out.println("[OrderService] Order saved successfully with ID: " + savedOrder.getId());

        // Send real-time notification to vendor via WebSocket AFTER transaction commits
        // Pre-extract values while session is still open (avoid
        // LazyInitializationException)
        final Long notifyVendorId = vendor.getId();
        final Long notifyOrderId = savedOrder.getId();
        final Double notifyTotalAmount = savedOrder.getTotalAmount();
        final String notifyCustomerName = user.getName();
        final int notifyItemCount = orderItems.size();
        final String notifyCreatedAt = savedOrder.getCreatedAt() != null
                ? savedOrder.getCreatedAt().toString()
                : LocalDateTime.now().toString();

        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            System.out.println("[OrderService] Registering transaction synchronization for order #" + notifyOrderId);
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    System.out
                            .println("[OrderService] Transaction committed, sending WebSocket notification for order #"
                                    + notifyOrderId);
                    notifyVendorNewOrder(notifyVendorId, notifyOrderId, notifyTotalAmount,
                            notifyCustomerName, notifyItemCount, notifyCreatedAt);
                }
            });
        } else {
            System.out.println(
                    "[OrderService] No active transaction synchronization. Sending notification immediately for order #"
                            + notifyOrderId);
            notifyVendorNewOrder(notifyVendorId, notifyOrderId, notifyTotalAmount,
                    notifyCustomerName, notifyItemCount, notifyCreatedAt);
        }

        // Send order confirmation email to user
        emailService.sendOrderConfirmation(
                user.getEmail(),
                user.getName(),
                savedOrder.getId(),
                savedOrder.getTotalAmount());

        return savedOrder;
    }

    private void notifyVendorNewOrder(Long vendorId, Long orderId, Double totalAmount,
            String customerName, int itemCount, String createdAt) {
        if (messagingTemplate == null) {
            System.out.println("[OrderService] WebSocket not configured. Skipping real-time notification.");
            return;
        }

        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("type", "NEW_ORDER");
            notification.put("orderId", orderId);
            notification.put("totalAmount", totalAmount);
            notification.put("customerName", customerName);
            notification.put("itemCount", itemCount);
            notification.put("createdAt", createdAt);

            messagingTemplate.convertAndSend("/topic/vendor/" + vendorId + "/orders", notification);
            messagingTemplate.convertAndSend("/topic/all-orders", notification);
            System.out
                    .println("[OrderService] Sent real-time notification to vendor " + vendorId + " and global topic");
        } catch (Exception e) {
            System.err.println("[OrderService] Failed to send WebSocket notification: " + e.getMessage());
        }
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getVendorOrders(Long vendorId) {
        return orderRepository.findByVendorId(vendorId);
    }

    public com.fooddash.fooddash.dto.VendorStatsDTO getVendorStats(Long vendorId) {
        List<Order> orders = orderRepository.findByVendorId(vendorId);

        long totalOrders = orders.size();
        double totalEarnings = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long activeOrders = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.DELIVERED && o.getStatus() != OrderStatus.CANCELLED)
                .count();

        long completedOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        return new com.fooddash.fooddash.dto.VendorStatsDTO(totalOrders, totalEarnings, activeOrders, completedOrders);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllWithDetails();
    }

    public com.fooddash.fooddash.dto.VendorStatsDTO getAllStats() {
        List<Order> orders = orderRepository.findAll();

        long totalOrders = orders.size();
        double totalEarnings = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long activeOrders = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.DELIVERED && o.getStatus() != OrderStatus.CANCELLED)
                .count();

        long completedOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        return new com.fooddash.fooddash.dto.VendorStatsDTO(totalOrders, totalEarnings, activeOrders, completedOrders);
    }
}
