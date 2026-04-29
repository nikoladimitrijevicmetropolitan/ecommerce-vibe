package com.vibe.ecommerce_backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void trebaDaKreiraPorudzbinu() throws Exception {
        String orderJson = """
                {
                    "customerName": "Jovan Jovanović",
                    "customerEmail": "jovan@example.com",
                    "customerAddress": "Ulica 1",
                    "items": [],
                    "totalPrice": 1000.0
                }
                """;

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Jovan Jovanović"))
                .andExpect(jsonPath("$.id").exists());
    }
}
