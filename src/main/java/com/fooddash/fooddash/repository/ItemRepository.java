package com.fooddash.fooddash.repository;

import com.fooddash.fooddash.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByVendorId(Long vendorId);

    List<Item> findByAvailable(Boolean available);

    List<Item> findByVendorIdAndAvailable(Long vendorId, Boolean available);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Item i WHERE i.vendor.approved = true AND i.available = true AND ("
            +
            "LOWER(i.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Item> searchGlobal(String query);

    List<Item> findByCategoryAndAvailable(String category, Boolean available);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.category FROM Item i WHERE i.category IS NOT NULL")
    List<String> findDistinctCategories();
}
