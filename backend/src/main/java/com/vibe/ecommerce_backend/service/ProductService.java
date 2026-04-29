package com.vibe.ecommerce_backend.service;

import com.vibe.ecommerce_backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<Product> getAllProducts(String category, String search, Pageable pageable);
    Product getProductById(Long id);
}
