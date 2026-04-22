package com.vibe.ecommerce_backend.controller;

import com.vibe.ecommerce_backend.model.Order;
import com.vibe.ecommerce_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        // U realnoj aplikaciji ovde bi išla dodatna validacija i obrada plaćanja
        return orderRepository.save(order);
    }
}
