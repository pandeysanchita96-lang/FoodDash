package com.fooddash.fooddash.dto;

public class VendorStatsDTO {
    private Long totalOrders;
    private Double totalEarnings;
    private Long activeOrders;
    private Long completedOrders;

    public VendorStatsDTO(Long totalOrders, Double totalEarnings, Long activeOrders, Long completedOrders) {
        this.totalOrders = totalOrders;
        this.totalEarnings = totalEarnings;
        this.activeOrders = activeOrders;
        this.completedOrders = completedOrders;
    }

    // Getters and Setters
    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(Double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public Long getActiveOrders() {
        return activeOrders;
    }

    public void setActiveOrders(Long activeOrders) {
        this.activeOrders = activeOrders;
    }

    public Long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Long completedOrders) {
        this.completedOrders = completedOrders;
    }
}
