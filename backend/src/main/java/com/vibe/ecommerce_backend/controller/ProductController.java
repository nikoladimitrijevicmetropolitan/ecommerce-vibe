package com.vibe.ecommerce_backend.controller;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Dozvoli frontend pozive
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String category,
                                   @RequestParam(required = false) String search) {
        if (category != null && search != null) {
            return productRepository.findByCategoryAndNameContainingIgnoreCase(category, search);
        } else if (category != null) {
            return productRepository.findByCategory(category);
        } else if (search != null) {
            return productRepository.findByNameContainingIgnoreCase(search);
        } else {
            return productRepository.findAll();
        }
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Proizvod nije pronađen"));
    }
}
