package com.fooddash.fooddash.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VendorRegisterRequest {

    @NotBlank(message = "Business name is required")
    private String businessName;

    private String description;

    private String address;

    private String phone;
}
