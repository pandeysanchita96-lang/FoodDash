package com.fooddash.fooddash.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemRequest {
    @NotBlank(message = "Item name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private Double price;

    private String category;

    private String imageUrl;

    private Boolean available = true;

    private Integer calories;
    private Double protein;
    private Double fat;
    private Double carbs;
}
