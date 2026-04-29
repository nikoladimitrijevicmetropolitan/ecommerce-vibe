package com.vibe.ecommerce_backend.controller;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        productRepository.save(new Product(null, "Laptop Pro", "Opis", 120000.0, "Elektronika", "url", 10));
        productRepository.save(new Product(null, "Smartphone", "Opis", 80000.0, "Elektronika", "url", 20));
        productRepository.save(new Product(null, "Slušalice", "Opis", 5000.0, "Oprema", "url", 50));
    }

    @Test
    void trebaDaVratiSveProizvode() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void trebaDaFiltriraPoKategoriji() throws Exception {
        mockMvc.perform(get("/api/products?category=Elektronika"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void trebaDaPretraziPoImenu() throws Exception {
        mockMvc.perform(get("/api/products?search=Laptop"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Laptop Pro"));
    }

    @Test
    void trebaDaVratiPojedinacniProizvod() throws Exception {
        Product saved = productRepository.findAll().get(0);
        mockMvc.perform(get("/api/products/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(saved.getName()));
    }
}
