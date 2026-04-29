# Sveobuhvatni Vodič: Autentifikacija, Testiranje i Git Workflow

Ovaj dokument je kruna našeg rada na **Fazi 3**. Naučićemo kako da povežemo sigurnosne protokole sa modernim frontendom, uz održavanje visokog kvaliteta koda kroz testove.

---

## 1. Arhitektura Bezbednosti (Spring Security + JWT)

U modernim aplikacijama ne koristimo sesije na serveru (Stateless). Umesto toga, koristimo **JWT (JSON Web Token)**.

### Backend Komponente:
- **`User` & `UserRepository`**: Temelj za čuvanje korisnika. Lozinke se **UVEK** kriptuju koristeći `BCrypt`.
- **`JwtUtils`**: Naša fabrika tokena. Ona "potpisuje" tokene tajnim ključem.
- **`AuthTokenFilter`**: Izbacivač koji proverava svaki dolazni zahtev.
- **`WebSecurityConfig`**: Centralna konfiguracija. Ovde definišemo šta je javno (`/api/products`), a šta zaključano (`/api/orders`).

### Frontend Komponente:
- **`AuthContext`**: React Context koji drži stanje korisnika (`user`, `login`, `logout`).
- **`Login.jsx` & `Register.jsx`**: Stranice koje komuniciraju sa `/api/auth` endpointima.
- **`localStorage`**: Mesto gde čuvamo token da korisnik ne bi morao da se loguje pri svakom osvežavanju stranice.

---

## 2. Strategija Testiranja (Piramida Testova)

Danas smo implementirali testove na tri nivoa:

### A. Unit Testovi (Brzi i precizni)
- **Alat**: Mockito / JUnit.
- **Cilj**: Testiramo izolovanu logiku (npr. `OrderService`).
- **Primer**: Proveravamo da li se zalihe smanjuju nakon kupovine, bez dodirivanja prave baze.

### B. Integracioni Testovi (Provera saobraćaja)
- **Alat**: MockMvc + `@WithMockUser`.
- **Cilj**: Proveravamo HTTP odgovore i bezbednosna pravila.
- **Naučena lekcija**: Kada koristimo Spring Security, testovima moramo reći ko je "lažni" korisnik pomoću `@WithMockUser(roles = "USER")`.

### C. E2E (End-to-End) Testovi (Korisničko iskustvo)
- **Alat**: Playwright.
- **Cilj**: Simuliramo pravog korisnika koji klikće u browseru.
- **Flow**: Otvori browser -> Registruj se -> Prijavi se -> Proveri da li Navbar vidi tvoje ime.

---

## 3. Git Workflow (Profesionalni pristup)

Radili smo po **Feature Branch** modelu:
1.  `git checkout -b feature/authentication` - Odvajamo rad na novoj funkcionalnosti.
2.  `git add .` i `git commit -m "feat: ..."` - Jasne poruke (feat, fix, docs).
3.  `git checkout main` i `git merge feature/authentication` - Spajanje tek nakon što svi testovi prođu.
4.  `git push origin main` - Slanje stabilne verzije na server.

---

## 4. Rešavanje Problema (Troubleshooting)

Tokom rada smo naišli na tipične prepreke:
- **Circular Dependency**: Rešeno pomeranjem filtera u poseban bin.
- **Compilation Errors**: Rešeno čišćenjem projekta (`mvn clean`) i dodavanjem `spring-security-test` zavisnosti.
- **Forbidden (403) u testovima**: Rešeno pravilnim mapiranjem rola u `@WithMockUser`.

---
*Savet studentima: Sigurnost se ne dodaje na kraju projekta. Ona se planira od početka, paralelno sa testovima.*
