# Plan Proširenja E-commerce Vibe Projekta

Ovaj dokument je vodič za profesora i studente koji žele da nastave rad na projektu. Svaka faza je osmišljena tako da studenti istovremeno uče **razvoj aplikacija**, **Git workflow** i **testiranje**.

---

## Trenutno stanje projekta

### Backend (Spring Boot)
- Modeli: `Product`, `Order`, `OrderItem`
- Kontroleri: `ProductController`, `OrderController`
- Repozitorijumi: `ProductRepository`, `OrderRepository`
- H2 baza sa testnim podacima (7 proizvoda)
- Nema servisnog sloja, nema validacije, nema error handling-a

### Frontend (React + Vite)
- Komponente: Navbar, ProductList, ProductCard, ProductDetails, Cart, CheckoutForm, OrderSuccess
- State management: React Context (CartContext)
- Nema loading skeleton-a, nema error prikaza, nema paginacije

### Testiranje
- 1 Playwright E2E test (kompletan tok kupovine)
- Nema unit testova (ni backend ni frontend)
- Nema integration testova

### Git Edukacija
- `learning-git.md`: Osnovne komande (init, add, commit, branch, merge, reset, revert, ignore)
- `advanced-git.md`: Napredne komande (amend, cherry-pick, rebase, reflog, blame, bisect, worktree, aliases)

---

## Faza 1: Servisni Sloj i Validacija

**Cilj**: Naučiti studente razdvajanje odgovornosti (Service Layer pattern) i validaciju ulaznih podataka.

**Git lekcija**: Rad na feature grani (`feature/service-layer`)

### Backend izmene

#### [NEW] `ProductService.java`
- Premestiti poslovnu logiku iz kontrolera u servis
- Dodati validaciju: cena > 0, ime nije prazno, stock >= 0
- Bacati custom exception-e (`ProductNotFoundException`, `OutOfStockException`)

#### [NEW] `OrderService.java`
- Validacija porudžbine (email format, adresa nije prazna)
- Provera dostupnosti zaliha pre kreiranja porudžbine
- Automatsko smanjivanje stock-a nakon uspešne porudžbine

#### [NEW] `GlobalExceptionHandler.java`
- `@ControllerAdvice` klasa za centralizovano rukovanje greškama
- Vraćanje JSON odgovora sa statusnim kodovima (400, 404, 500)

#### [MODIFY] `ProductController.java`
- Injectovanje `ProductService` umesto direktnog korišćenja repozitorijuma

#### [MODIFY] `OrderController.java`
- Injectovanje `OrderService` umesto direktnog korišćenja repozitorijuma

### Testiranje
- **Unit testovi** za `ProductService` (JUnit + Mockito)
- **Unit testovi** za `OrderService`

### Git komande koje se uče
```bash
git checkout -b feature/service-layer    # Nova grana
git add -p                                # Selektivno dodavanje
git commit -m "refactor: ..."            # Konvencija za refaktoring
git merge --no-ff feature/service-layer  # Merge sa čuvanjem istorije grane
```

---

## Faza 2: Paginacija i Sortiranje

**Cilj**: Naučiti studente rad sa velikim skupovima podataka i query parametrima.

**Git lekcija**: Interaktivni rebase (`git rebase -i`) za čišćenje istorije pre merge-a

### Backend izmene

#### [MODIFY] `ProductRepository.java`
- Dodati `PagingAndSortingRepository` ili koristiti `Pageable`

#### [MODIFY] `ProductController.java`
- Dodati query parametre: `page`, `size`, `sortBy`, `sortDir`
- Endpoint vraća `Page<Product>` umesto `List<Product>`

#### [NEW] `DataInitializer.java` (ažuriran)
- Dodati 50+ proizvoda u bazu za testiranje paginacije

### Frontend izmene

#### [NEW] `Pagination.jsx` + `Pagination.css`
- Komponenta sa brojevima strana, "Prethodna" i "Sledeća" dugmad
- Prikaz ukupnog broja rezultata

#### [MODIFY] `ProductList.jsx`
- Dodati dropdown za sortiranje (po ceni, po imenu)
- Integracija sa `Pagination` komponentom

### Testiranje
- **Backend test**: Provera paginacije i sortiranja
- **Playwright test**: Klik kroz stranice, promena sortiranja

### Git komande koje se uče
```bash
git rebase -i HEAD~4          # Spajanje sitnih commit-ova u jedan
git push --force-with-lease   # Siguran force-push nakon rebase-a
```

---

## Faza 3: Autentifikacija Korisnika

**Cilj**: Naučiti studente osnove bezbednosti (Spring Security, JWT tokeni).

**Git lekcija**: Rad sa `.env` fajlovima, `git stash`, `cherry-pick`

### Backend izmene

#### [NEW] `User.java` (model)
- Polja: id, email, password (hashovan), ime, uloga (CUSTOMER/ADMIN)

#### [NEW] `UserRepository.java`

#### [NEW] `AuthController.java`
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prijava (vraća JWT token)

#### [NEW] `JwtService.java`
- Generisanje i validacija JWT tokena

#### [NEW] `SecurityConfig.java`
- Konfiguracija Spring Security-ja
- Definisanje zaštićenih i javnih ruta

#### [MODIFY] `OrderController.java`
- Porudžbina se vezuje za ulogovanog korisnika

### Frontend izmene

#### [NEW] `LoginPage.jsx` + `LoginPage.css`
- Forma za prijavu (email + lozinka)

#### [NEW] `RegisterPage.jsx` + `RegisterPage.css`
- Forma za registraciju

#### [NEW] `AuthContext.jsx`
- Čuvanje JWT tokena u localStorage
- Automatsko dodavanje tokena u header svakog API poziva

#### [MODIFY] `Navbar.jsx`
- Prikaz "Prijavi se" / "Odjavi se" u zavisnosti od stanja

### Testiranje
- **Unit testovi**: `JwtService`, `AuthController`
- **Playwright testovi**: Registracija, prijava, zaštićeni resursi

### Git komande koje se uče
```bash
git stash save "nedovršen login"   # Sklanjanje nedovršenog rada
git stash pop                       # Vraćanje nedovršenog rada
git cherry-pick <hash>              # Preuzimanje konkretnog commit-a
echo "JWT_SECRET=..." >> .env       # Tajni podaci u .env
```

---

## Faza 4: Admin Panel

**Cilj**: Naučiti studente CRUD operacije na frontendu i autorizaciju po ulogama.

**Git lekcija**: Pull Request workflow (simulacija timskog rada)

### Backend izmene

#### [MODIFY] `ProductController.java`
- `POST /api/products` - Dodavanje novog proizvoda (samo ADMIN)
- `PUT /api/products/{id}` - Izmena proizvoda (samo ADMIN)
- `DELETE /api/products/{id}` - Brisanje proizvoda (samo ADMIN)

### Frontend izmene

#### [NEW] `AdminDashboard.jsx` + `AdminDashboard.css`
- Tabela svih proizvoda sa dugmadima za izmenu i brisanje
- Forma za dodavanje novog proizvoda

#### [NEW] `ProductForm.jsx` + `ProductForm.css`
- Reusable forma za kreiranje i editovanje proizvoda

#### [MODIFY] `App.jsx`
- Zaštićena ruta `/admin` (pristup samo za ADMIN korisnike)

### Testiranje
- **Playwright testovi**: Admin dodaje proizvod, menja cenu, briše proizvod
- **Backend testovi**: Provera da CUSTOMER ne može da pristupi admin rutama

### Git komande koje se uče
```bash
# Simulacija Pull Request-a
git checkout -b feature/admin-panel
# ... rad na kodu ...
git push -u origin feature/admin-panel
# Na GitHub-u: Create Pull Request → Code Review → Merge
```

---

## Faza 5: Napredni Frontend (UX poboljšanja)

**Cilj**: Naučiti studente napredne React paterne i poboljšanje korisničkog iskustva.

**Git lekcija**: `git bisect` za pronalaženje bug-ova, `git blame`

### Frontend izmene

#### [NEW] `LoadingSkeleton.jsx` + `LoadingSkeleton.css`
- Animirani skeleton umesto texta "Učitavanje..."
- Shimmer efekat za kartice proizvoda

#### [NEW] `Toast.jsx` + `Toast.css`
- Notifikacije (success/error) pri dodavanju u korpu, slanju porudžbine
- Auto-dismiss nakon 3 sekunde

#### [NEW] `useDebounce.js` (custom hook)
- Debounce za pretragu (ne šalje API poziv na svako kucanje)

#### [MODIFY] `ProductList.jsx`
- Infinite scroll umesto/pored paginacije
- Animirane tranzicije pri filtriranju

#### [NEW] `WishList.jsx` + `WishlistContext.jsx`
- Lista želja sa čuvanjem u localStorage

### Testiranje
- **Playwright testovi**: Toast notifikacije, debounce pretraga, wishlist tok
- **Frontend unit testovi**: `useDebounce` hook, CartContext logika

### Git komande koje se uče
```bash
git bisect start             # Početak binarne pretrage za bug
git bisect bad               # Trenutna verzija je loša
git bisect good <hash>       # Ova verzija je bila dobra
git blame src/App.jsx        # Ko je menjao koji red
```

---

## Faza 6: Integracija i CI/CD

**Cilj**: Naučiti studente automatizaciju procesa (Continuous Integration).

**Git lekcija**: Git Hooks, GitHub Actions

### Nove datoteke

#### [NEW] `.github/workflows/ci.yml`
- Automatsko pokretanje testova na svakom push-u
- Build provera za backend i frontend

#### [NEW] `.git/hooks/pre-commit`
- Lokalna provera pre svakog commit-a (lint, format)

### Testiranje
- Svi testovi se pokreću automatski na GitHub-u
- Badge u README.md koji pokazuje status testova

### Git komande koje se uče
```bash
git tag v1.0.0                    # Označavanje verzije
git push origin v1.0.0            # Slanje taga na GitHub
git log --since="2 weeks ago"     # Pregled aktivnosti
```

---

## Pregled Faza i Git Lekcija

| Faza | Funkcionalnost | Git Lekcija | Testiranje |
| :--- | :--- | :--- | :--- |
| 1 | Servisni sloj + Validacija | Feature branch, `--no-ff` merge | JUnit + Mockito |
| 2 | Paginacija + Sortiranje | Interaktivni rebase | Backend + Playwright |
| 3 | Autentifikacija (JWT) | Stash, cherry-pick, .env | Security testovi |
| 4 | Admin Panel (CRUD) | Pull Request workflow | Autorizacija testovi |
| 5 | UX poboljšanja | Bisect, blame | Custom hook testovi |
| 6 | CI/CD | Hooks, Tags, Actions | Automatizovani pipeline |

---

*Svaka faza je projektovana da traje 1-2 nedelje nastave. Studenti rade u parovima ili timovima od 3-4 člana, svaki tim radi na svojoj grani i pravi Pull Request.*
