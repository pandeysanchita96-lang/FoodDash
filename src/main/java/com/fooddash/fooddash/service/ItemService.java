package com.fooddash.fooddash.service;

import com.fooddash.fooddash.dto.ItemRequest;
import com.fooddash.fooddash.entity.Item;
import com.fooddash.fooddash.entity.Vendor;
import com.fooddash.fooddash.repository.ItemRepository;
import com.fooddash.fooddash.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VendorRepository vendorRepository;

    public List<Item> getAllItems() {
        return itemRepository.findByAvailable(true);
    }

    public List<Item> searchItems(String query) {
        return itemRepository.searchGlobal(query);
    }

    public List<Item> getItemsByCategory(String category) {
        return itemRepository.findByCategoryAndAvailable(category, true);
    }

    public List<String> getCategories() {
        return itemRepository.findDistinctCategories();
    }

    public List<Item> getVendorItems(Long vendorId) {
        return itemRepository.findByVendorId(vendorId);
    }

    public List<Item> getVendorItemsByUserId(Long userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        return itemRepository.findByVendorId(vendor.getId());
    }

    public Item addItem(Long userId, ItemRequest request) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vendor not found for user"));

        Item item = new Item();
        item.setVendor(vendor);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable());
        item.setCalories(request.getCalories());
        item.setProtein(request.getProtein());
        item.setFat(request.getFat());
        item.setCarbs(request.getCarbs());

        return itemRepository.save(item);
    }

    public Item updateItem(Long itemId, ItemRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable());
        item.setCalories(request.getCalories());
        item.setProtein(request.getProtein());
        item.setFat(request.getFat());
        item.setCarbs(request.getCarbs());

        return itemRepository.save(item);
    }

    public void deleteItem(Long itemId) {
        itemRepository.deleteById(itemId);
    }
}
