package com.vibe.ecommerce_backend.config;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            repository.saveAll(List.of(
                new Product(null, "Laptop Pro", "Moćan laptop za programere", 1200.0, "Elektronika", "https://picsum.photos/seed/laptop/400/300"),
                new Product(null, "Smartphone X", "Najnoviji model telefona", 800.0, "Elektronika", "https://picsum.photos/seed/phone/400/300"),
                new Product(null, "Slušalice", "Bežične slušalice sa noise cancelling-om", 150.0, "Oprema", "https://picsum.photos/seed/headphones/400/300"),
                new Product(null, "Mehanička tastatura", "RGB tastatura sa plavim prekidačima", 100.0, "Oprema", "https://picsum.photos/seed/keyboard/400/300"),
                new Product(null, "Monitor 4K", "Ultra HD monitor za dizajnere", 450.0, "Elektronika", "https://picsum.photos/seed/monitor/400/300")
            ));
        };
    }
}
