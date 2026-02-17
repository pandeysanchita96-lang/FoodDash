package com.fooddash.fooddash.dto;

public class AdminStatsDTO {
    private Long totalUsers;
    private Long totalVendors;
    private Long totalOrders;
    private Double totalRevenue;

    public AdminStatsDTO(Long totalUsers, Long totalVendors, Long totalOrders, Double totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalVendors = totalVendors;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalVendors() {
        return totalVendors;
    }

    public void setTotalVendors(Long totalVendors) {
        this.totalVendors = totalVendors;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
