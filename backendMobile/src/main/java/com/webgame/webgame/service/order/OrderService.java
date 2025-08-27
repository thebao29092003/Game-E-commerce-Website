package com.webgame.webgame.service.order;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;


public interface OrderService {
    Page<Object[]> getListOrder(String sortDirection, String sortField, int page, int size);
    List<Object[]> getOrderCountRevenue();
    Page<Object[]> getOrderByUserId(Long userId, String sortDirection, String sortField, int page, int size);
    void addOrder(JsonNode orderData);

}
