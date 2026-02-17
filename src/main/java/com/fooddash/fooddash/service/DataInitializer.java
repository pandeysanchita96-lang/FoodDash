package com.fooddash.fooddash.service;

import com.fooddash.fooddash.entity.*;
import com.fooddash.fooddash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Checking data initialization...");

        // Ensure we have vendors
        if (vendorRepository.count() < 3) {
            createSampleVendors();
        }

        // Ensure all vendors have items
        vendorRepository.findAll().forEach(this::populateVendorMenu);

        // Force approve all vendors
        vendorRepository.findAll().forEach(v -> {
            if (v.getApproved() == null || !v.getApproved()) {
                v.setApproved(true);
                vendorRepository.save(v);
            }
        });

        logger.info("Data initialization complete. Vendors: {}, Items: {}", vendorRepository.count(),
                itemRepository.count());
    }

    private void createSampleVendors() {
        logger.info("Creating sample vendors...");

        // Vendor 1: The Pizza Projekt
        if (!userRepository.existsByEmail("pizza@example.com")) {
            User u = createBaseUser("Pizza Master", "pizza@example.com", Role.VENDOR);
            createVendor(u, "The Pizza Projekt", "Pizza, Italian, Fast Food", "Hinjewadi, Pune",
                    "Authentic wood-fired pizzas and sides.");
        }

        // Vendor 2: Biryani Blues
        if (!userRepository.existsByEmail("biryani@example.com")) {
            User u = createBaseUser("Biryani Expert", "biryani@example.com", Role.VENDOR);
            createVendor(u, "Biryani Blues", "Biryani, North Indian, Kebab", "Baner, Pune",
                    "Traditional Hyderabadi flavors.");
        }

        // Vendor 3: Burger Kingdome
        if (!userRepository.existsByEmail("burger@example.com")) {
            User u = createBaseUser("Burger Chief", "burger@example.com", Role.VENDOR);
            createVendor(u, "Burger Kingdome", "Burgers, American, Shakes", "Aundh, Pune",
                    "Gourmet burgers and thick milkshakes.");
        }

        // Admin
        if (!userRepository.existsByEmail("admin@fooddash.com")) {
            createBaseUser("Admin", "admin@fooddash.com", Role.ADMIN);
        }

        // User
        if (!userRepository.existsByEmail("user@example.com")) {
            createBaseUser("John Doe", "user@example.com", Role.USER);
        }
    }

    private User createBaseUser(String name, String email, Role role) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode("password123"));
        u.setRole(role);
        u.setActive(true);
        return userRepository.save(u);
    }

    private void createVendor(User user, String bizName, String cat, String addr, String desc) {
        Vendor v = new Vendor();
        v.setUser(user);
        v.setBusinessName(bizName);
        v.setCategory(cat);
        v.setAddress(addr);
        v.setDescription(desc);
        v.setPhone("9876543210");
        v.setApproved(true);
        vendorRepository.save(v);
    }

    private void populateVendorMenu(Vendor v) {
        if (itemRepository.findByVendorId(v.getId()).size() >= 10) {
            return; // Already has enough items
        }

        logger.info("Populating menu for: {}", v.getBusinessName());
        List<Item> items = new ArrayList<>();

        if (v.getBusinessName().contains("Pizza")) {
            items.add(createItem(v, "Margherita Pizza", "Classic tomato, mozzarella and basil.", 299.0, "Pizzas"));
            items.add(createItem(v, "Pepperoni Feast", "Double pepperoni with extra mozzarella.", 449.0, "Pizzas"));
            items.add(createItem(v, "BBQ Chicken Pizza", "Smoky BBQ sauce and grilled chicken.", 399.0, "Pizzas"));
            items.add(createItem(v, "Veggie Paradise", "Onion, capsicum, mushroom, and corn.", 349.0, "Pizzas"));
            items.add(createItem(v, "Farmhouse Pizza", "Deluxe veg pizza with all toppings.", 379.0, "Pizzas"));
            items.add(createItem(v, "Garlic Bread", "Freshly baked with garlic butter.", 149.0, "Sides"));
            items.add(createItem(v, "Stuffed Garlic Bread", "Filled with cheese and jalapeños.", 199.0, "Sides"));
            items.add(createItem(v, "Potato Wedges", "Crispy and seasoned.", 129.0, "Sides"));
            items.add(createItem(v, "Peri Peri Wings", "Spicy chicken wings (6 pcs).", 249.0, "Starters"));
            items.add(createItem(v, "Arancini Balls", "Fried risotto balls with cheese.", 219.0, "Starters"));
            items.add(createItem(v, "Tiramisu", "Classic Italian coffee dessert.", 249.0, "Desserts"));
            items.add(createItem(v, "Choco Lava Cake", "Warm chocolate center.", 129.0, "Desserts"));
            items.add(createItem(v, "Coke (500ml)", "Chilled soft drink.", 60.0, "Beverages"));
            items.add(createItem(v, "Iced Tea", "Refreshing lemon flavor.", 89.0, "Beverages"));
            items.add(createItem(v, "Mineral Water", "1 Litre bottle.", 40.0, "Beverages"));
        } else if (v.getBusinessName().contains("Biryani")) {
            items.add(createItem(v, "Chicken Dum Biryani", "Hyderabadi style with spice.", 350.0, "Main Course"));
            items.add(createItem(v, "Mutton Biryani", "Slow cooked tender meat.", 499.0, "Main Course"));
            items.add(createItem(v, "Veg Hyderabadi Biryani", "Fragrant veg biryani.", 299.0, "Main Course"));
            items.add(createItem(v, "Egg Biryani", "With boiled eggs and masala.", 310.0, "Main Course"));
            items.add(createItem(v, "Paneer Tikka Biryani", "Fusion favorite.", 340.0, "Main Course"));
            items.add(createItem(v, "Paneer Tikka", "Grilled cottage cheese cubes.", 280.0, "Starters"));
            items.add(createItem(v, "Chicken 65", "Spicy deep fried chicken.", 299.0, "Starters"));
            items.add(createItem(v, "Seekh Kebab", "Minced mutton on skewers.", 399.0, "Starters"));
            items.add(createItem(v, "Butter Naan", "Soft leavened bread.", 60.0, "Sides"));
            items.add(createItem(v, "Garlic Naan", "With minced garlic.", 75.0, "Sides"));
            items.add(createItem(v, "Boondi Raita", "Yogurt with boondi.", 80.0, "Sides"));
            items.add(createItem(v, "Gulab Jamun", "Two soft milk dumplings.", 99.0, "Desserts"));
            items.add(createItem(v, "Rasmalai", "Creamy Bengali sweet.", 149.0, "Desserts"));
            items.add(createItem(v, "Mango Lassi", "Thick yogurt drink.", 120.0, "Beverages"));
            items.add(createItem(v, "Fresh Lime Soda", "Sweet or Salted.", 70.0, "Beverages"));
        } else {
            // Default or Burger
            items.add(createItem(v, "Classic Veg Burger", "Crispy veg patty.", 149.0, "Burgers"));
            items.add(createItem(v, "Cheese Burger", "Extra slice of cheddar.", 179.0, "Burgers"));
            items.add(createItem(v, "Spicy Chicken Burger", "With zesty mayo.", 219.0, "Burgers"));
            items.add(createItem(v, "Monster Beef Burger", "Double patty, bacon, egg.", 449.0, "Burgers"));
            items.add(createItem(v, "Mushroom Swiss", "Veggie delight.", 229.0, "Burgers"));
            items.add(createItem(v, "Classic Fries", "Salted and golden.", 119.0, "Sides"));
            items.add(createItem(v, "Peri Peri Fries", "Spicy seasoning.", 139.0, "Sides"));
            items.add(createItem(v, "Onion Rings", "Deep fried loops.", 159.0, "Sides"));
            items.add(createItem(v, "Chicken Nuggets", "10 pcs with dip.", 249.0, "Starters"));
            items.add(createItem(v, "Mozzarella Sticks", "Gooey and crispy.", 229.0, "Starters"));
            items.add(createItem(v, "Chocolate Shake", "Rich and creamy.", 189.0, "Beverages"));
            items.add(createItem(v, "Vanilla Shake", "Classic vanilla bean.", 179.0, "Beverages"));
            items.add(createItem(v, "Hot Brownie", "With chocolate sauce.", 199.0, "Desserts"));
            items.add(createItem(v, "Apple Pie", "Baked fresh.", 169.0, "Desserts"));
            items.add(createItem(v, "Cold Coffee", "With vanilla ice cream.", 149.0, "Beverages"));
        }

        itemRepository.saveAll(items);
    }

    private Item createItem(Vendor v, String name, String desc, Double price, String cat) {
        Item item = new Item();
        item.setVendor(v);
        item.setName(name);
        item.setDescription(desc);
        item.setPrice(price);
        item.setCategory(cat);
        item.setAvailable(true);
        return item;
    }
}
