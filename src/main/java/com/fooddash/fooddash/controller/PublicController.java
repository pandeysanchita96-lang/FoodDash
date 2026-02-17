package com.fooddash.fooddash.controller;

import com.fooddash.fooddash.dto.GlobalSearchResponse;
import com.fooddash.fooddash.entity.Item;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.repository.ItemRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/vendors")
    public List<Vendor> getApprovedVendors() {
        return vendorRepository.findByApproved(true);
    }

    @GetMapping("/vendors/search")
    public List<Vendor> searchVendors(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String q,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String category) {

        if (q != null && !q.isEmpty()) {
            return vendorRepository.findByApprovedTrueAndBusinessNameContainingIgnoreCase(q);
        } else if (category != null && !category.isEmpty()) {
            return vendorRepository.findByApprovedTrueAndCategoryContainingIgnoreCase(category);
        }
        return vendorRepository.findByApproved(true);
    }

    @GetMapping("/search/global")
    public GlobalSearchResponse globalSearch(@org.springframework.web.bind.annotation.RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return new GlobalSearchResponse(vendorRepository.findByApproved(true),
                    itemRepository.findByAvailable(true));
        }

        String query = q.trim();
        List<Vendor> vendors = vendorRepository.findByApprovedTrueAndBusinessNameContainingIgnoreCase(query);
        List<Vendor> categoryVendors = vendorRepository.findByApprovedTrueAndCategoryContainingIgnoreCase(query);

        // Merge vendors and remove duplicates if any (though JPA might return same
        // objects)
        for (Vendor v : categoryVendors) {
            if (!vendors.contains(v)) {
                vendors.add(v);
            }
        }

        List<Item> items = itemRepository.searchGlobal(query);

        return new GlobalSearchResponse(vendors, items);
    }
}
