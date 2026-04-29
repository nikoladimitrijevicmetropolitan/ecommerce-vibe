package com.vibe.ecommerce_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Pomoćna klasa za generisanje, parsiranje i validaciju JWT tokena.
 * 
 * JJWT 0.12.x API (kompatibilan sa Spring Boot 4):
 * - Koristi SecretKey umesto String za potpisivanje
 * - Koristi Jwts.parser().verifyWith(key).build() umesto Jwts.parser().setSigningKey()
 * - Koristi getPayload() umesto getBody()
 * - Koristi parseSignedClaims() umesto parseClaimsJws()
 */
@Component
public class JwtUtils {
    // U produkciji ovo ide u application.properties ili .env fajl!
    private final String jwtSecret = "vibeShopSecretKey2026vibeShopSecretKey2026vibeShopSecretKey2026";
    private final int jwtExpirationMs = 86400000; // 24 sata

    /**
     * Kreira SecretKey objekat iz String ključa.
     * JJWT 0.12.x zahteva SecretKey umesto raw String-a.
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateJwtToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Nevalidan JWT: " + e.getMessage());
        }
        return false;
    }
}
