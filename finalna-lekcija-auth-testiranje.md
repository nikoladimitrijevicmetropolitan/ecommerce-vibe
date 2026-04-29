# Sveobuhvatni Vodič: Autentifikacija, Testiranje i Git Workflow

Ovaj dokument je kruna našeg rada na **Fazi 3**. Naučićemo kako da povežemo sigurnosne protokole sa modernim frontendom, uz održavanje visokog kvaliteta koda kroz testove.

---

## 1. Arhitektura Bezbednosti (Spring Security 7 + JWT)

U modernim aplikacijama ne koristimo sesije na serveru (Stateless). Umesto toga, koristimo **JWT (JSON Web Token)**.

### Backend Komponente:
- **`User` & `UserRepository`**: Temelj za čuvanje korisnika. Lozinke se **UVEK** kriptuju koristeći `BCrypt`.
- **`JwtUtils`**: Naša fabrika tokena. Ona "potpisuje" tokene tajnim ključem koristeći `SecretKey` objekat (JJWT 0.12.x API).
- **`AuthTokenFilter`**: Izbacivač koji proverava svaki dolazni zahtev.
- **`WebSecurityConfig`**: Centralna konfiguracija. Ovde definišemo šta je javno (`/api/products`), a šta zaključano (`/api/orders`).

### Frontend Komponente:
- **`AuthContext`**: React Context koji drži stanje korisnika (`user`, `login`, `logout`).
- **`Login.jsx` & `Register.jsx`**: Stranice koje komuniciraju sa `/api/auth` endpointima.
- **`localStorage`**: Mesto gde čuvamo token da korisnik ne bi morao da se loguje pri svakom osvežavanju stranice.

---

## 2. Kompatibilnost sa Spring Boot 4

Tokom razvoja smo identifikovali i rešili sledeće probleme kompatibilnosti:

### A. JJWT Biblioteka (0.11.5 → 0.12.6)
Stari API (0.11.5) je koristio deprecated metode koje su uklonjene u novijim verzijama:

| Stari API (0.11.5) | Novi API (0.12.6) |
|---|---|
| `Jwts.parser().setSigningKey(string)` | `Jwts.parser().verifyWith(secretKey).build()` |
| `.parseClaimsJws(token)` | `.parseSignedClaims(token)` |
| `.getBody().getSubject()` | `.getPayload().getSubject()` |
| `.setSubject(name)` | `.subject(name)` |
| `.signWith(SignatureAlgorithm.HS512, string)` | `.signWith(secretKey)` |

### B. Spring Security 7 (DaoAuthenticationProvider)
U Spring Security 7, `DaoAuthenticationProvider` zahteva `UserDetailsService` u konstruktoru:
```java
// Stari način (SS6):
DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
authProvider.setUserDetailsService(userDetailsService);

// Novi način (SS7):
DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
```

### C. Testiranje sa STATELESS sesijama
`@WithMockUser` ne radi sa STATELESS sesijama jer naš `AuthTokenFilter` traži pravi JWT. Rešenje: generišemo pravi token u testu:
```java
@Autowired
private JwtUtils jwtUtils;

@Test
void test() throws Exception {
    String token = jwtUtils.generateJwtToken("testuser");
    mockMvc.perform(post("/api/orders")
            .header("Authorization", "Bearer " + token)
            ...);
}
```

### D. Java Verzija
Spring Boot 4 preporučuje Java 21+. Naš projekat trenutno koristi Java 17 (jer nemamo Java 21 na sistemu), ali sve funkcionalnosti rade korektno.

---

## 3. Strategija Testiranja (Piramida Testova)

Implementirali smo testove na tri nivoa:

### A. Unit Testovi (Brzi i precizni)
- **Alat**: Mockito / JUnit.
- **Cilj**: Testiramo izolovanu logiku (npr. `OrderService`).
- **Primer**: Proveravamo da li se zalihe smanjuju nakon kupovine, bez dodirivanja prave baze.

### B. Integracioni Testovi (Provera saobraćaja)
- **Alat**: MockMvc + pravi JWT token.
- **Cilj**: Proveravamo HTTP odgovore i bezbednosna pravila.
- **Naučena lekcija**: U STATELESS modu, moramo koristiti pravi JWT token umesto `@WithMockUser`.

### C. E2E (End-to-End) Testovi (Korisničko iskustvo)
- **Alat**: Playwright.
- **Cilj**: Simuliramo pravog korisnika koji klikće u browseru.
- **Flow**: Otvori browser → Registruj se → Prijavi se → Proveri da li Navbar vidi tvoje ime.

---

## 4. Git Workflow (Profesionalni pristup)

Radili smo po **Feature Branch** modelu:
1.  `git checkout -b feature/authentication` — Odvajamo rad na novoj funkcionalnosti.
2.  `git add .` i `git commit -m "feat: ..."` — Jasne poruke (feat, fix, docs).
3.  `git checkout main` i `git merge feature/authentication` — Spajanje tek nakon što svi testovi prođu.
4.  `git push origin main` — Slanje stabilne verzije na server.

---

## 5. Rešavanje Problema (Troubleshooting)

Tokom rada smo naišli na tipične prepreke:
- **JJWT Deprecation**: Rešeno ažuriranjem na 0.12.6 i korišćenjem novog fluent API-ja.
- **DaoAuthenticationProvider greška**: Rešeno korišćenjem konstruktora sa parametrom (SS7 zahtev).
- **403 Forbidden u testovima**: Rešeno generisanjem pravog JWT tokena umesto korišćenja `@WithMockUser`.
- **Java verzija**: Dokumentovano kao poznato ograničenje (Java 17 umesto preporučene 21).

---
*Savet studentima: Sigurnost se ne dodaje na kraju projekta. Ona se planira od početka, paralelno sa testovima. Uvek proverite kompatibilnost biblioteka sa verzijom Spring Boot-a pre nego što počnete implementaciju.*
