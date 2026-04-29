package com.vibe.ecommerce_backend.service;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void trebaDaVratiProizvodPoId() {
        Product product = new Product(1L, "Test", "Desc", 100.0, "Kat", "url", 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product found = productService.getProductById(1L);

        assertNotNull(found);
        assertEquals("Test", found.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void trebaDaVratiSveProizvode() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(new Product()));
        when(productRepository.findAll(pageable)).thenReturn(page);

        Page<Product> result = productService.getAllProducts(null, null, pageable);

        assertEquals(1, result.getContent().size());
        verify(productRepository, times(1)).findAll(pageable);
    }
}
