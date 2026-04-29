# Vodič za Migraciju na Spring Boot 4 i Spring Security 7

Ovaj dokument opisuje sve probleme kompatibilnosti koje smo pronašli i rešili tokom implementacije autentifikacije na Spring Boot 4.0.6.

---

## 1. Šta se promenilo u Spring Boot 4?

Spring Boot 4 (novembar 2025) je veliki prelomni upgrade koji donosi:
- **Spring Framework 7.0**
- **Spring Security 7.0**
- **Jakarta EE 11**
- Preporuka za **Java 21+** (mada radi i sa Java 17)
- Podrazumevani **Jackson 3**

---

## 2. JJWT Biblioteka: 0.11.5 → 0.12.6

Ovo je bila najveća promena u našem kodu. JJWT 0.12.x je potpuno preradio API da bude fluent, imutabilan i usklađen sa JWT specifikacijom.

### Tabela migracije:

| Koncept | Stari API (0.11.5) | Novi API (0.12.6) |
|---|---|---|
| **Potpisivanje** | `.signWith(SignatureAlgorithm.HS512, "string")` | `.signWith(secretKey)` |
| **Postavljanje subjekta** | `.setSubject(username)` | `.subject(username)` |
| **Datum izdavanja** | `.setIssuedAt(new Date())` | `.issuedAt(new Date())` |
| **Datum isteka** | `.setExpiration(date)` | `.expiration(date)` |
| **Kreiranje parsera** | `Jwts.parser().setSigningKey("string")` | `Jwts.parser().verifyWith(secretKey).build()` |
| **Parsiranje tokena** | `.parseClaimsJws(token)` | `.parseSignedClaims(token)` |
| **Čitanje tela** | `.getBody().getSubject()` | `.getPayload().getSubject()` |
| **Tip ključa** | `String` | `SecretKey` (javax.crypto) |

### Primer koda — BEFORE vs AFTER:

**Pre migracije (0.11.5):**
```java
// Generisanje
Jwts.builder()
    .setSubject(username)
    .setIssuedAt(new Date())
    .setExpiration(new Date(now + expiration))
    .signWith(SignatureAlgorithm.HS512, "mojTajniKljuc")
    .compact();

// Validacija
Jwts.parser()
    .setSigningKey("mojTajniKljuc")
    .parseClaimsJws(token)
    .getBody()
    .getSubject();
```

**Posle migracije (0.12.6):**
```java
// Ključ se kreira kao SecretKey objekat
private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
}

// Generisanje
Jwts.builder()
    .subject(username)
    .issuedAt(new Date())
    .expiration(new Date(now + expiration))
    .signWith(getSigningKey())
    .compact();

// Validacija
Jwts.parser()
    .verifyWith(getSigningKey())
    .build()
    .parseSignedClaims(token)
    .getPayload()
    .getSubject();
```

---

## 3. Spring Security 7: DaoAuthenticationProvider

U Spring Security 6.x, `DaoAuthenticationProvider` je imao prazan konstruktor i setter metode. U Spring Security 7.0, konstruktor **zahteva** `UserDetailsService` kao parametar.

**Pre (SS6):**
```java
DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
authProvider.setUserDetailsService(userDetailsService);
authProvider.setPasswordEncoder(passwordEncoder());
```

**Posle (SS7):**
```java
@Bean
public DaoAuthenticationProvider authenticationProvider(
        UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder);
    return authProvider;
}
```

---

## 4. Testiranje u STATELESS modu

Ovo je bio najsuptilniji problem. `@WithMockUser` anotacija iz `spring-security-test` radi tako što postavlja lažnog korisnika u `SecurityContext` NAKON što se svi filteri izvrše. Ali u STATELESS modu, naš `AuthTokenFilter` se izvršava PRVI i traži pravi JWT token u `Authorization` zaglavlju. Ako ga ne nađe — vraća `403 Forbidden`.

**Rešenje**: Generišemo pravi JWT token u testu i šaljemo ga u zaglavlju:
```java
@Autowired
private JwtUtils jwtUtils;

@Autowired
private UserRepository userRepository;

@BeforeEach
void setUp() {
    if (!userRepository.existsByUsername("testuser")) {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@vibe.com");
        user.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(user);
    }
}

@Test
void trebaDaKreiraPorudzbinu() throws Exception {
    String token = jwtUtils.generateJwtToken("testuser");

    mockMvc.perform(post("/api/orders")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(orderJson))
            .andExpect(status().isOk());
}
```

---

## 5. Potrebne zavisnosti (pom.xml)

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT (JJWT 0.12.6 - kompatibilan sa Spring Boot 4) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>

<!-- Za testiranje sa Spring Security -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

## 6. Poznata ograničenja

| Ograničenje | Opis | Status |
|---|---|---|
| Java verzija | Spring Boot 4 preporučuje Java 21+, ali radi sa Java 17 | Dokumentovano |
| `@WithMockUser` | Ne radi sa STATELESS sesijama + custom JWT filterom | Rešeno (pravi token) |
| JJWT deprecation warnings | Stari API generiše upozorenja pri kompilaciji | Rešeno (upgrade na 0.12.6) |

---

## 7. Rezime svih fajlova izmenjenih za kompatibilnost

| Fajl | Izmena |
|---|---|
| `pom.xml` | JJWT 0.11.5 → 0.12.6, dodat spring-security-test |
| `JwtUtils.java` | Kompletan prepis na JJWT 0.12.x fluent API |
| `WebSecurityConfig.java` | DaoAuthenticationProvider sa konstruktorom |
| `OrderControllerIntegrationTest.java` | Pravi JWT token umesto @WithMockUser |

---
*Verzija dokumenta: 1.0 | Datum: 29.04.2026 | Spring Boot: 4.0.6 | JJWT: 0.12.6*
