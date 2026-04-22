# Plan Proširenja - Nivo 2 (Napredne Tehnologije i Arhitektura)

Ovaj dokument je namenjen kao nastavak na osnovni `PLAN-PROSIRENJA.md`. Fokusira se na prelazak sa monolitne arhitekture na arhitekturu spremnu za produkciju, uvođenje novih alata i napredne DevOps prakse.

---

## Faza 7: Produkciona Baza i Caching

**Cilj**: Odbacivanje in-memory baze (H2) i uvođenje pravog sistema za upravljanje bazama podataka (PostgreSQL) uz Redis za keširanje.

**Git lekcija**: Rešavanje kompleksnih merge konflikata, rad sa `git rerere`.

### Backend izmene
- **PostgreSQL**: Povezivanje Spring Boot aplikacije sa PostgreSQL bazom (promena `application.properties`, dodavanje drajvera).
- **Flyway / Liquibase**: Uvođenje alata za migraciju šeme baze podataka umesto generisanja entiteta iz koda.
- **Redis**: Implementacija `@Cacheable` na endpoint-ima za pretragu i listanje proizvoda radi poboljšanja performansi.

### Testiranje
- **Testcontainers**: Ažuriranje integracionih testova tako da podižu prave PostgreSQL i Redis Docker kontejnere tokom testiranja, umesto H2 baze.

### Git i DevOps
- Učenje kako se bekapuje baza (nije direktno Git, ali je deo okruženja).
- Korišćenje `git rerere` (Reuse Recorded Resolution) za pamćenje rešenih konflikata prilikom rebase-a.

---

## Faza 8: Real-time Komunikacija (WebSockets)

**Cilj**: Omogućiti dvosmernu komunikaciju između servera i klijenta u realnom vremenu.

**Git lekcija**: Git Submodules - izdvajanje zajedničkih DTO klasa u poseban repozitorijum.

### Backend izmene
- **Spring WebSockets / STOMP**: Konfiguracija WebSocket brokera.
- Obaveštenja o promeni zaliha u realnom vremenu (npr. kada se proda poslednji komad).
- Notifikacija adminu kada stigne nova porudžbina.

### Frontend izmene
- Povezivanje na WebSocket server.
- Globalni Notification centar u UI-u koji prikazuje obaveštenja (npr. "Korisnik iz Beograda je upravo kupio Laptop Pro").

### Testiranje
- Mockovanje WebSocket konekcija u React komponentama za unit testiranje.
- Postman ili K6 za testiranje opterećenja WebSocket konekcija na backendu.

---

## Faza 9: Napredni Frontend State Management

**Cilj**: Prebacivanje sa React Context-a na Redux Toolkit (RTK) ili Zustand za skalabilnije upravljanje stanjem aplikacije.

**Git lekcija**: `git filter-branch` ili `git filter-repo` za uklanjanje osetljivih fajlova iz istorije.

### Frontend izmene
- Instalacija Redux Toolkit-a i React-Redux.
- Refaktorisane CartContext-a u CartSlice.
- Uvođenje RTK Query za rad sa API-jem, koji donosi automatsko keširanje na frontendu, deduplikaciju zahteva i polling.

### Testiranje
- Ažuriranje postojećih frontend testova da koriste Redux Provider.
- Testiranje RTK Query reducers-a i thunk-ova izolirano.

---

## Faza 10: Kontejnerizacija (Docker & Docker Compose)

**Cilj**: Standardizacija okruženja za razvoj i isporuku aplikacije putem kontejnera.

**Git lekcija**: Git LFS (Large File Storage) za upravljanje velikim assetima (slikama proizvoda).

### Backend izmene
- Pisanje višeslojnog `Dockerfile`-a za Spring Boot aplikaciju.

### Frontend izmene
- Pisanje `Dockerfile`-a baziranog na Nginx-u za serviranje build-ovanog React koda.

### Infrastruktura
- Kreiranje `docker-compose.yml` fajla koji jednim klikom podiže:
  - PostgreSQL bazu
  - Redis
  - Spring Boot Backend
  - React Frontend
  - PgAdmin (za pregled baze)

### Testiranje
- E2E testovi (Playwright) se konfigurišu da se vrte protiv Docker okruženja u CI/CD pipeline-u.

---

## Faza 11: Sigurnost i OAuth2 / OpenID Connect

**Cilj**: Omogućiti "Login with Google/GitHub" na našoj e-commerce aplikaciji.

**Git lekcija**: Upravljanje izdanjima (Git Tags, GitHub Releases) i semantičko verzionisanje (SemVer).

### Backend izmene
- Integracija Spring Security OAuth2 Client-a.
- Rad sa JWT tokenima i eksternim Identity Provider-ima.

### Frontend izmene
- Dugmad za Social Login.
- Handlovanje callback ruta nakon uspešnog login-a.

---

## Pregled Naprednih Faza

| Faza | Arhitektura / Tehnologija | Git Fokus | Testiranje |
| :--- | :--- | :--- | :--- |
| 7 | PostgreSQL, Redis, Flyway | Rerere, rešavanje konflikata | Testcontainers (Integracioni) |
| 8 | WebSockets, Real-time | Git Submodules | Mockovanje socketa, K6 (Performanse) |
| 9 | Redux Toolkit, RTK Query | filter-repo (čišćenje istorije) | Redux Testing, Thunk testovi |
| 10 | Docker, Docker Compose | Git LFS (Large File Storage) | CI/CD E2E u kontejnerima |
| 11 | OAuth2, Social Login | SemVer, Git Tags, Releases | Sigurnosni testovi (Penetration) |
