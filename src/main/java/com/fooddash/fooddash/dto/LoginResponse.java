package com.fooddash.fooddash.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String name;
    private String role;
    private Long vendorId;
    private String businessName;
    private String phone;
}
