package com.webgame.webgame.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("listOrder")
    public Map<String, Object> listOrders(
            @RequestParam("page") int page,
            @RequestParam("sortDirection") String sortDirection,
            @RequestParam("sortField") String sortField
            ) {
        int size = 10;

//        Chấp nhận tham số "ASC" hoặc "DESC"
        Page<Object[]> orders = orderService.getListOrder(sortDirection,sortField, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("orderList", orders.getContent());
        response.put("currentPage", page);
        response.put("totalPages", orders.getTotalPages());
        return response;
    }

    @GetMapping("getOrderCountRevenue")
    public Map<String, Object> getOrderCountRevenue() {

        List<Object[]> orderCountRevenue= orderService.getOrderCountRevenue();

        Map<String, Object> response = new HashMap<>();
        response.put("orderCountRevenue", orderCountRevenue);
        return response;
    }

    @GetMapping("getOrderByUserId")
    public Map<String, Object> getOrderByUserId(
            @RequestParam("userId") Long userId,
            @RequestParam("page") int page,
            @RequestParam("sortDirection") String sortDirection,
            @RequestParam("sortField") String sortField
    ) {
        int size = 10;

//        Chấp nhận tham số "ASC" hoặc "DESC"
        Page<Object[]> orders = orderService.getOrderByUserId(userId, sortDirection,sortField, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("orderList", orders.getContent());
        response.put("currentPage", page);
        response.put("totalPages", orders.getTotalPages());
        return response;
    }

    @PostMapping("addOrder")
    public ResponseEntity<Map<String, Object>> addOrder(@RequestBody JsonNode orderData) {
        Map<String, Object> response = new HashMap<>();
        try {
            orderService.addOrder(orderData);
            response.put("status", "success");
            response.put("message", "Add order successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error add order: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
