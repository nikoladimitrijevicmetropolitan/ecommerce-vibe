# Lekcija 29.04. - Strategije i Nivoi Testiranja Softvera

Danas učimo kako da izgradimo poverenje u naš kod. Testiranje nije samo "provera da li radi", već proces osiguravanja da izmene koje uvedemo danas ne polome ono što je radilo juče.

---

## 1. Piramida Testiranja (Testing Pyramid)

U modernom razvoju softvera koristimo koncept **piramide testiranja**. Ona nam govori da treba da imamo mnogo malih, brzih testova u dnu, a manje kompleksnih testova pri vrhu.

```
       /  E2E  \          <-- Najskuplji, najsporiji, ali najbliži korisniku
      / Integr. \         <-- Proveravaju saradnju delova sistema
     /   UNIT    \        <-- Najbrži, najbrojniji, testiraju izolovanu logiku
    /_____________\
```

---

## 2. Unit Testiranje (Jedinično testiranje)

**Definicija**: Testiranje najmanjeg mogućeg dela koda (npr. jedne funkcije ili metode) u potpunoj izolaciji.

- **Cilj**: Potvrditi da logika u toj funkciji radi ispravno za sve ulazne parametre.
- **Izolacija**: Ako funkcija zavisi od baze ili drugog servisa, te zavisnosti se "lažiraju" (tzv. **Mock-ovanje**).
- **Primer**: Testiramo funkciju `calculateTotal()` u korpi. Ne zanima nas baza podataka, samo da li `2 + 2` daje `4`.

---

## 3. Integraciono Testiranje

**Definicija**: Testiranje saradnje između dve ili više komponenti sistema.

- **Cilj**: Osigurati da podaci ispravno "teku" kroz sistem.
- **Fokus**: Interakcija sa bazom podataka, pozivi eksternih API-ja, komunikacija između frontenda i backenda.
- **Primer**: Proveravamo da li `OrderController` ispravno šalje podatke u bazu i da li se ti podaci tamo stvarno čuvaju.

---

## 4. Zašto ponovo pokrećemo E2E testove?

Možda se pitate: *"Ako imamo Unit testove za svaki deo i Integracione za spojeve, zašto nam treba Playwright (E2E)?"*

**Razlog**: Unit i integracioni testovi testiraju "delove mosta". E2E test proverava da li se ceo most sruši kada preko njega pređe kamion (pravi korisnik).

- **E2E (End-to-End)** simulira stvarno ponašanje: otvaranje browsera, kliktanje mišem, čekanje na mrežu.
- On može otkriti greške koje ni jedan mali test ne vidi (npr. dugme je sakriveno iza drugog elementa, ili JavaScript greška blokira ceo UI).

---

## Plan rada za danas (29.04.)

### 1. Priprema Okruženja
- Kreiranje Git grane `feature/testing-setup` (već urađeno).
- Instalacija **Vitest** i **React Testing Library** u frontend delu.
- Provera Maven zavisnosti za **Spring Boot Test** i **MockMvc**.

### 2. Frontend Testiranje (React + Vitest)
- **Unit Test (Logika)**: Kreiramo `CartContext.test.jsx`. Cilj je da testiramo čistu JavaScript logiku korpe:
    - Da li se proizvod ispravno dodaje?
    - Da li se ukupna cena (Total Price) tačno računa?
    - Da li `localStorage` čuva podatke nakon osvežavanja?
- **Integration/Component Test**: Kreiramo `ProductCard.test.jsx`. Ovde proveravamo interakciju:
    - Da li komponenta ispravno prikazuje ime i cenu?
    - Da li se klikom na "Dodaj u korpu" poziva funkcija iz konteksta?

### 3. Backend Testiranje (Spring Boot + MockMvc)
- **Integration Test (API)**: Kreiramo `ProductControllerIntegrationTest.java`. Fokusiramo se na HTTP sloj:
    - Da li GET `/api/products` vraća status 200 OK?
    - Da li pretraga po nazivu (npr. `?search=Laptop`) vraća tačan broj rezultata?
    - Da li filtriranje po kategoriji ispravno filtrira podatke iz baze?

### 4. Završna Verifikacija
- Pokretanje svih testova:
    - `npm test` (Frontend)
    - `./mvnw test` (Backend)
    - `npx playwright test` (E2E)
- **Git Commit**: Beležimo sve promene uz edukativne poruke.

---

## Izveštaj o implementaciji (Rezime časa)

Danas smo uspešno prešli put od teorije do kompletne testne pokrivenosti aplikacije. Evo detalja:

### 1. Frontend: Vitest & RTL
Uveli smo **Vitest** kao primarni alat za unit testiranje jer je optimizovan za Vite projekte.
- **Šta smo testirali**: 
    - `CartContext.test.jsx`: Proverili smo logiku korpe (dodavanje, brisanje, dupliranje stavki). Otkrili smo važnost mock-ovanja `localStorage`-a.
    - `ProductCard.test.jsx`: Potvrdili smo da se podaci ispravno mapiraju na UI i da dugme za kupovinu poziva odgovarajuću funkciju.
- **Rezultat**: 7/7 testova prošlo.

### 2. Backend: JUnit 5 & MockMvc
Naišli smo na **važan problem**: Testovi nisu hteli da se kompajliraju zbog pogrešne verzije Spring Boot-a (`4.0.5` koja ne postoji).
- **Rešenje**: Refaktorisali smo `pom.xml`, spustili verziju na stabilnu `3.4.2` i dodali `spring-boot-starter-test`.
- **Šta smo testirali**: 
    - `ProductControllerIntegrationTest.java`: Provera listanja, pretrage i filtriranja.
    - `OrderControllerIntegrationTest.java`: Provera uspešnog kreiranja porudžbine putem POST zahteva.
- **Rezultat**: 6/6 testova prošlo.

### 3. E2E: Playwright
Na kraju smo pokrenuli celu bateriju E2E testova kako bismo bili sigurni da nove zavisnosti i promene u `pom.xml` nisu narušile stabilnost aplikacije.
- **Rezultat**: 9/9 testova prošlo na svim browserima (Chromium, Firefox, WebKit).

---

## Upgrade na Spring Boot 4.0.6

Nakon što su svi testovi prošli na verziji 3.4.2, odlučili smo da pokušamo upgrade na najnoviju stabilnu verziju **Spring Boot 4.0.6** (izašla 23.04.2026).

### Šta smo promenili

#### `pom.xml` — 3 izmene:
| Pre (3.4.2) | Posle (4.0.6) | Razlog |
| :--- | :--- | :--- |
| `spring-boot-starter-web` | `spring-boot-starter-webmvc` | SB4 razdvojio web module |
| `spring-boot-starter-test` | `spring-boot-starter-test` + `spring-boot-starter-webmvc-test` | MockMvc premešten u poseban modul |
| verzija `3.4.2` | verzija `4.0.6` | Upgrade parent POM |

#### Importovi u testovima — promena paketa:
```java
// STARO (Spring Boot 3.x)
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

// NOVO (Spring Boot 4.x)
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
```

#### `OrderControllerIntegrationTest` — ObjectMapper problem:
- U Spring Boot 4, `ObjectMapper` (Jackson) nije automatski dostupan kao bean u test kontekstu.
- **Rešenje**: Umesto `ObjectMapper` koristimo Java **Text Block** (`"""..."""`) za direktan JSON string.
- Ovo je ujedno i čitljiviji pristup za edukativne svrhe:
```java
// Umesto: objectMapper.writeValueAsString(order)
// Pišemo direktno:
String orderJson = """
    {
        "customerName": "Jovan Jovanović",
        "customerEmail": "jovan@example.com",
        "customerAddress": "Ulica 1",
        "items": [],
        "totalPrice": 1000.0
    }
    """;
```

### Ključna lekcija za studente:
Upgrade major verzije frameworka (3.x → 4.x) **nikada** nije trivijalan. Čak i kada su promene "samo u nazivima paketa", bez automatizovanih testova bismo proveli sate tražeći šta ne radi. Upravo zato smo **prvo** napisali testove, pa tek onda uradili upgrade — testovi su nam bili sigurnosna mreža koja je odmah pokazala šta je puklo.

---
*Status projekta: 22 testa ukupno, svi su zeleni (PASS) na Spring Boot 4.0.6.*
