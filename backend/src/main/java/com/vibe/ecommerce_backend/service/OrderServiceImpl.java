package com.vibe.ecommerce_backend.service;

import com.vibe.ecommerce_backend.model.Order;
import com.vibe.ecommerce_backend.model.OrderItem;
import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.OrderRepository;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import com.vibe.ecommerce_backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public Order createOrder(Order order) {
        // 1. Osnovna validacija
        if (order.getCustomerEmail() == null || !order.getCustomerEmail().contains("@")) {
            throw new RuntimeException("Nevalidan email format");
        }

        // 2. Provera zaliha i ažuriranje stanja
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Proizvod sa ID " + item.getProduct().getId() + " nije pronađen"));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Nedovoljno proizvoda na stanju: " + product.getName());
            }

            // Smanji zalihe
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // 3. Snimi porudžbinu
        return orderRepository.save(order);
    }
}
