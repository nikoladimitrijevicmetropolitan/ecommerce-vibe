package com.vibe.ecommerce_backend.controller;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Page<Product> getProducts(@RequestParam(required = false) String category,
                                   @RequestParam(required = false) String search,
                                   @PageableDefault(size = 8, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return productService.getAllProducts(category, search, pageable);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}
