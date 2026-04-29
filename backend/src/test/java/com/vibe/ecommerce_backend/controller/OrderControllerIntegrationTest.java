package com.vibe.ecommerce_backend.controller;

import com.vibe.ecommerce_backend.model.User;
import com.vibe.ecommerce_backend.repository.UserRepository;
import com.vibe.ecommerce_backend.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integracioni test za OrderController sa pravim JWT tokenom.
 * 
 * U Spring Security 7 sa STATELESS sesijama, koristimo pravi
 * JWT token umesto @WithMockUser jer naš AuthTokenFilter
 * očekuje Bearer token u Authorization zaglavlju.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Kreiraj testnog korisnika ako ne postoji
        if (!userRepository.existsByUsername("testuser")) {
            User user = new User();
            user.setUsername("testuser");
            user.setEmail("test@vibe.com");
            user.setPassword(passwordEncoder.encode("password123"));
            userRepository.save(user);
        }
    }

    @Test
    void trebaDaKreiraPorudzbinu() throws Exception {
        String token = jwtUtils.generateJwtToken("testuser");

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
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Jovan Jovanović"))
                .andExpect(jsonPath("$.id").exists());
    }
}
