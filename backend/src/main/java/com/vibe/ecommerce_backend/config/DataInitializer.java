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
                new Product(null, "Laptop Pro", "Moćan laptop za programere", 120000.0, "Elektronika", "https://picsum.photos/seed/laptop/400/300", 10),
                new Product(null, "Smartphone X", "Najnoviji model telefona", 85000.0, "Elektronika", "https://picsum.photos/seed/phone/400/300", 25),
                new Product(null, "Slušalice", "Bežične slušalice sa noise cancelling-om", 18000.0, "Oprema", "https://picsum.photos/seed/headphones/400/300", 50),
                new Product(null, "Mehanička tastatura", "RGB tastatura sa plavim prekidačima", 12000.0, "Oprema", "https://picsum.photos/seed/keyboard/400/300", 15),
                new Product(null, "Monitor 4K", "Ultra HD monitor za dizajnere", 55000.0, "Elektronika", "https://picsum.photos/seed/monitor/400/300", 8),
                new Product(null, "Gaming Miš", "Ergonomski miš sa 16000 DPI", 6000.0, "Oprema", "https://picsum.photos/seed/mouse/400/300", 40),
                new Product(null, "Eksterni SSD 1TB", "Brzi prenosni disk", 15000.0, "Elektronika", "https://picsum.photos/seed/ssd/400/300", 20)
            ));
        };
    }
}
