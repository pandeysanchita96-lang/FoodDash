package com.fooddash.fooddash.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long vendorId;
    private String deliveryAddress;
    private String notes;
    private String transactionId;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long itemId;
        private Integer quantity;
    }
}
