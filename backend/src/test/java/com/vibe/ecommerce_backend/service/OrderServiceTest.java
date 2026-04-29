package com.vibe.ecommerce_backend.service;

import com.vibe.ecommerce_backend.model.Order;
import com.vibe.ecommerce_backend.model.OrderItem;
import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.OrderRepository;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void trebaDaBaciGreskuAkoNemaDovoljnoZaliha() {
        // Arrange
        Product p = new Product(1L, "Laptop", "Desc", 1000.0, "Kat", "url", 5); // Samo 5 na stanju
        
        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(10); // Kupac traži 10

        Order order = new Order();
        order.setCustomerEmail("test@example.com");
        order.setItems(List.of(item));

        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            orderService.createOrder(order);
        });

        assertTrue(exception.getMessage().contains("Nedovoljno proizvoda na stanju"));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void trebaDaSmanjiZaliheNakonUspesnePorudzbine() {
        // Arrange
        Product p = new Product(1L, "Laptop", "Desc", 1000.0, "Kat", "url", 10);
        
        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(3);

        Order order = new Order();
        order.setCustomerEmail("test@example.com");
        order.setItems(List.of(item));

        when(productRepository.findById(1L)).thenReturn(Optional.of(p));
        when(orderRepository.save(any())).thenReturn(order);

        // Act
        orderService.createOrder(order);

        // Assert
        assertEquals(7, p.getStock()); // 10 - 3 = 7
        verify(productRepository, times(1)).save(p);
        verify(orderRepository, times(1)).save(order);
    }
}
