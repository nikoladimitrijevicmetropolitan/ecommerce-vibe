package com.vibe.ecommerce_backend.repository;

import com.vibe.ecommerce_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryAndNameContainingIgnoreCase(String category, String name);
}
