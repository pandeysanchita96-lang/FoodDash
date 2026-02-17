package com.fooddash.fooddash.dto;

import com.fooddash.fooddash.entity.Item;
import com.fooddash.fooddash.entity.Vendor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GlobalSearchResponse {
    private List<Vendor> vendors;
    private List<Item> items;
}
