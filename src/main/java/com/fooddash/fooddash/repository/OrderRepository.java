package com.fooddash.fooddash.repository;

import com.fooddash.fooddash.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.item LEFT JOIN FETCH o.user LEFT JOIN FETCH o.vendor WHERE o.user.id = :userId")
    List<Order> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.item LEFT JOIN FETCH o.user LEFT JOIN FETCH o.vendor WHERE o.vendor.id = :vendorId")
    List<Order> findByVendorId(@org.springframework.data.repository.query.Param("vendorId") Long vendorId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.item LEFT JOIN FETCH o.user LEFT JOIN FETCH o.vendor")
    List<Order> findAllWithDetails();
}
