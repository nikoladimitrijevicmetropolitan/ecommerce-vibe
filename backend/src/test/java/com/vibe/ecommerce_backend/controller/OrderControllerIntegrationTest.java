package com.vibe.ecommerce_backend.controller;

import com.vibe.ecommerce_backend.model.Order;
import com.vibe.ecommerce_backend.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void trebaDaKreiraPorudzbinu() throws Exception {
        Order order = new Order();
        order.setCustomerName("Jovan Jovanović");
        order.setCustomerEmail("jovan@example.com");
        order.setCustomerAddress("Ulica 1");
        order.setItems(new ArrayList<>());
        order.setTotalPrice(1000.0);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Jovan Jovanović"))
                .andExpect(jsonPath("$.id").exists());
    }
}
