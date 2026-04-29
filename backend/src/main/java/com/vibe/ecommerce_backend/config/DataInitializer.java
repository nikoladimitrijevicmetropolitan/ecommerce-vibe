package com.vibe.ecommerce_backend.config;

import com.vibe.ecommerce_backend.model.Product;
import com.vibe.ecommerce_backend.model.User;
import com.vibe.ecommerce_backend.repository.ProductRepository;
import com.vibe.ecommerce_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository, 
                                 UserRepository userRepository, 
                                 PasswordEncoder passwordEncoder) {
        return args -> {
            // Inicijalizacija proizvoda (ako je baza prazna)
            if (productRepository.count() == 0) {
                productRepository.saveAll(List.of(
                    new Product(null, "Laptop Pro", "Moćan laptop za programere", 120000.0, "Elektronika", "https://picsum.photos/seed/laptop/400/300", 10),
                    new Product(null, "Smartphone X", "Najnoviji model telefona", 85000.0, "Elektronika", "https://picsum.photos/seed/phone/400/300", 25),
                    new Product(null, "Slušalice", "Bežične slušalice sa noise cancelling-om", 18000.0, "Oprema", "https://picsum.photos/seed/headphones/400/300", 50),
                    new Product(null, "Mehanička tastatura", "RGB tastatura sa plavim prekidačima", 12000.0, "Oprema", "https://picsum.photos/seed/keyboard/400/300", 15),
                    new Product(null, "Monitor 4K", "Ultra HD monitor za dizajnere", 55000.0, "Elektronika", "https://picsum.photos/seed/monitor/400/300", 8),
                    new Product(null, "Gaming Miš", "Ergonomski miš sa 16000 DPI", 6000.0, "Oprema", "https://picsum.photos/seed/mouse/400/300", 40),
                    new Product(null, "Eksterni SSD 1TB", "Brzi prenosni disk", 15000.0, "Elektronika", "https://picsum.photos/seed/ssd/400/300", 20),
                    new Product(null, "Web Kamera", "1080p rezolucija", 5000.0, "Oprema", "https://picsum.photos/seed/webcam/400/300", 15),
                    new Product(null, "Tablet 10\"", "Lagan i prenosiv", 30000.0, "Elektronika", "https://picsum.photos/seed/tablet/400/300", 12),
                    new Product(null, "USB-C Hub", "Višenamenski adapter", 3500.0, "Oprema", "https://picsum.photos/seed/hub/400/300", 30),
                    new Product(null, "Grafička karta", "High-end performanse", 95000.0, "Elektronika", "https://picsum.photos/seed/gpu/400/300", 3),
                    new Product(null, "Gaming Stolica", "Ergonomski dizajn", 25000.0, "Oprema", "https://picsum.photos/seed/chair/400/300", 5),
                    new Product(null, "Zvučnici 2.1", "Čist zvuk sa basom", 9000.0, "Elektronika", "https://picsum.photos/seed/speakers/400/300", 18),
                    new Product(null, "Podloga za miša", "Velika površina", 2000.0, "Oprema", "https://picsum.photos/seed/mousepad/400/300", 100),
                    new Product(null, "Mikrofon", "Studijski kvalitet", 14000.0, "Oprema", "https://picsum.photos/seed/mic/400/300", 7),
                    new Product(null, "WiFi Router", "Brza konekcija", 7500.0, "Elektronika", "https://picsum.photos/seed/router/400/300", 22),
                    new Product(null, "Bluetooth Speaker", "Prenosni zvučnik", 4500.0, "Oprema", "https://picsum.photos/seed/btspk/400/300", 35),
                    new Product(null, "Smart Watch", "Prati zdravlje", 12000.0, "Elektronika", "https://picsum.photos/seed/watch/400/300", 14),
                    new Product(null, "Power Bank", "20000mAh kapacitet", 4000.0, "Oprema", "https://picsum.photos/seed/pwr/400/300", 40),
                    new Product(null, "Radni sto", "Moderan dizajn", 15000.0, "Nameštaj", "https://picsum.photos/seed/desk/400/300", 4)
                ));
            }

            // Inicijalizacija Admin korisnika
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@vibe.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("Admin korisnik kreiran: admin / admin123");
            }
        };
    }
}
