package com.vibe.ecommerce_backend.service;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<Product> getAllProducts(String category, String search, Pageable pageable) {
        if (category != null && search != null) {
            return productRepository.findByCategoryAndNameContainingIgnoreCase(category, search, pageable);
        } else if (category != null) {
            return productRepository.findByCategory(category, pageable);
        } else if (search != null) {
            return productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proizvod sa ID " + id + " nije pronađen"));
    }
}
