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

## Faza 1: Servisni Sloj i Validacija [COMPLETED 01.05.]

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

## Faza 2: Paginacija i Sortiranje [COMPLETED 30.04.]

**Cilj**: Naučiti studente rad sa velikim skupovima podataka i query parametrima.

**Git lekcija**: Rad na feature grani (`feature/pagination-sorting`) i interaktivni rebase.

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

## Faza 3: Autentifikacija Korisnika [COMPLETED 02.05.]

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

## Strategija Testiranja (Piramida Testova)

Testovi se organizuju u tri nivoa, poput piramide:

```
        /  E2E  \          ← Malo testova, ali pokrivaju ceo tok
       / Integra- \        ← Srednji broj, testiraju saradnju komponenti
      /   cioni    \
     /  Unit testovi \     ← Najviše testova, brzi i izolovani
    /________________\
```

### Pravilo: Svaka faza mora imati testove na sva tri nivoa pre merge-a u `main`.

---

### A. Unit Testovi (Izolovani, Brzi)

Testiraju **jednu funkciju ili klasu** bez zavisnosti od baze, mreže ili drugih servisa.

#### Backend (JUnit 5 + Mockito)

##### Primer: `ProductServiceTest.java`
```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void trebaDaVratiProizvodKadaPostoji() {
        Product laptop = new Product(1L, "Laptop", "Opis", 120000.0, "Elektronika", "url", 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(laptop));

        Product result = productService.getProductById(1L);

        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void trebaDaBaciExceptionKadaProizvodNePostoji() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
            () -> productService.getProductById(99L));
    }

    @Test
    void trebaDaOdbijeKreiranjeProizvodaSaNegativnomCenom() {
        Product invalid = new Product(null, "Test", "Opis", -100.0, "Kat", "url", 5);

        assertThrows(IllegalArgumentException.class,
            () -> productService.createProduct(invalid));
    }
}
```

##### Primer: `OrderServiceTest.java`
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void trebaDaSmanjiStockNakonUspesnePorudzbine() {
        Product product = new Product(1L, "Laptop", "Opis", 120000.0, "Elektronika", "url", 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        OrderItem item = new OrderItem(null, product, 2);
        Order order = new Order(null, "Petar", "petar@test.com", "Adresa", List.of(item), 240000.0);

        orderService.createOrder(order);

        assertEquals(8, product.getStock()); // 10 - 2 = 8
        verify(orderRepository).save(order);
    }

    @Test
    void trebaDaOdbijePorudzbinuAkoNemaDovoljonoNaStanju() {
        Product product = new Product(1L, "Laptop", "Opis", 120000.0, "Elektronika", "url", 1);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        OrderItem item = new OrderItem(null, product, 5); // Traži 5, ima samo 1
        Order order = new Order(null, "Petar", "petar@test.com", "Adresa", List.of(item), 600000.0);

        assertThrows(OutOfStockException.class,
            () -> orderService.createOrder(order));
    }
}
```

#### Frontend (Vitest + React Testing Library)

##### Instalacija
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

##### Primer: `CartContext.test.jsx`
```jsx
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

test('dodavanje proizvoda u korpu', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addToCart({ id: 1, name: 'Laptop', price: 120000 }, 2);
  });

  expect(result.current.cart).toHaveLength(1);
  expect(result.current.cart[0].quantity).toBe(2);
  expect(result.current.totalPrice).toBe(240000);
});

test('povećavanje količine postojećeg proizvoda', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addToCart({ id: 1, name: 'Laptop', price: 120000 }, 1);
    result.current.addToCart({ id: 1, name: 'Laptop', price: 120000 }, 3);
  });

  expect(result.current.cart).toHaveLength(1);
  expect(result.current.cart[0].quantity).toBe(4); // 1 + 3
});

test('uklanjanje proizvoda iz korpe', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => {
    result.current.addToCart({ id: 1, name: 'Laptop', price: 120000 });
    result.current.removeFromCart(1);
  });

  expect(result.current.cart).toHaveLength(0);
  expect(result.current.totalItems).toBe(0);
});
```

##### Primer: `ProductCard.test.jsx`
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductCard from './ProductCard';

const product = { id: 1, name: 'Test Laptop', price: 120000, category: 'Elektronika', imageUrl: 'test.jpg' };

test('prikazuje naziv i cenu proizvoda', () => {
  render(
    <BrowserRouter>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </BrowserRouter>
  );

  expect(screen.getByText('Test Laptop')).toBeInTheDocument();
  expect(screen.getByText(/120.*000/)).toBeInTheDocument();
});

test('dugme "Dodaj u korpu" poziva addToCart', () => {
  render(
    <BrowserRouter>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </BrowserRouter>
  );

  fireEvent.click(screen.getByText('Dodaj u korpu'));
  // Verifikacija da se korpa ažurirala
});
```

---

### B. Integracioni Testovi (Saradnja komponenti)

Testiraju **saradnju između slojeva** (npr. kontroler + servis + baza), ali bez pokretanja celokupne aplikacije.

#### Backend (Spring Boot Test + H2)

##### Primer: `ProductControllerIntegrationTest.java`
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        productRepository.save(new Product(null, "Test Laptop", "Opis", 120000.0, "Elektronika", "url", 10));
        productRepository.save(new Product(null, "Test Miš", "Opis", 3000.0, "Oprema", "url", 50));
    }

    @Test
    void trebaDaVratiSveProizvode() throws Exception {
        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].name").value("Test Laptop"));
    }

    @Test
    void trebaDaFiltriraPoKategoriji() throws Exception {
        mockMvc.perform(get("/api/products?category=Oprema"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].name").value("Test Miš"));
    }

    @Test
    void trebaDaPretraziPoImenu() throws Exception {
        mockMvc.perform(get("/api/products?search=Laptop"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void trebaDaVrati404ZaNepostojeciProizvod() throws Exception {
        mockMvc.perform(get("/api/products/999"))
            .andExpect(status().isNotFound());
    }
}
```

##### Primer: `OrderControllerIntegrationTest.java`
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void trebaDaKreiraPorudzbinu() throws Exception {
        Product saved = productRepository.save(
            new Product(null, "Laptop", "Opis", 120000.0, "Elektronika", "url", 10));

        String orderJson = """
            {
                "customerName": "Petar Petrović",
                "customerEmail": "petar@test.com",
                "customerAddress": "Bulevar 1, Beograd",
                "items": [{"product": {"id": %d}, "quantity": 2}],
                "totalPrice": 240000
            }
            """.formatted(saved.getId());

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.customerName").value("Petar Petrović"))
            .andExpect(jsonPath("$.id").exists());
    }
}
```

---

### C. E2E Testovi (Playwright - Ceo tok iz ugla korisnika)

Testiraju **kompletnu aplikaciju** kroz browser, simulirajući pravo korišćenje.

##### Primer: `tests/pretraga.spec.ts` — Pretraga i filtriranje
```typescript
import { test, expect } from '@playwright/test';

test.describe('Pretraga i filtriranje proizvoda', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('pretraga po ključnoj reči vraća relevantne rezultate', async ({ page }) => {
    await page.fill('input[placeholder="Pretraži proizvode..."]', 'Monitor');
    await page.click('button:has-text("Traži")');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('h3:has-text("Monitor 4K")')).toBeVisible();
  });

  test('filtriranje po kategoriji prikazuje samo tu kategoriju', async ({ page }) => {
    await page.click('a:has-text("Oprema")');
    const cards = page.locator('.product-category');
    await expect(cards.first()).toContainText('Oprema');
  });

  test('prazna pretraga prikazuje poruku', async ({ page }) => {
    await page.fill('input[placeholder="Pretraži proizvode..."]', 'xyznepostoji');
    await page.click('button:has-text("Traži")');
    await expect(page.locator('.no-products')).toBeVisible();
  });
});
```

##### Primer: `tests/korpa.spec.ts` — Upravljanje korpom
```typescript
import { test, expect } from '@playwright/test';

test.describe('Upravljanje korpom', () => {
  test('dodavanje više proizvoda i provera ukupne cene', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Dodaj prvi proizvod
    await page.locator('.product-card').first().locator('.add-to-cart-btn').click();

    // Idi u korpu
    await page.click('a:has-text("Korpa")');
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });

  test('promena količine u korpi ažurira ukupnu cenu', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.locator('.product-card').first().locator('.add-to-cart-btn').click();
    await page.click('a:has-text("Korpa")');

    // Povećaj količinu
    await page.locator('.item-quantity button:has-text("+")').click();
    await expect(page.locator('.item-quantity span')).toHaveText('2');
  });

  test('uklanjanje proizvoda iz korpe', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.locator('.product-card').first().locator('.add-to-cart-btn').click();
    await page.click('a:has-text("Korpa")');

    await page.click('.remove-btn');
    await expect(page.locator('h2:has-text("Vaša korpa je prazna")')).toBeVisible();
  });
});
```

##### Primer: `tests/checkout-validacija.spec.ts` — Validacija forme
```typescript
import { test, expect } from '@playwright/test';

test.describe('Checkout validacija', () => {
  test('ne dozvoljava slanje prazne forme', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.locator('.product-card').first().locator('.add-to-cart-btn').click();
    await page.click('a:has-text("Korpa")');
    await page.click('a:has-text("Nastavi na plaćanje")');

    // Klikni potvrdi bez popunjavanja
    await page.click('button:has-text("Potvrdi porudžbinu")');

    // Forma ne treba da prođe (HTML5 validacija)
    await expect(page).toHaveURL(/checkout/);
  });

  test('uspešna porudžbina sa validnim podacima', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.locator('.product-card').first().locator('.add-to-cart-btn').click();
    await page.click('a:has-text("Korpa")');
    await page.click('a:has-text("Nastavi na plaćanje")');

    await page.fill('input[name="customerName"]', 'Ana Anić');
    await page.fill('input[name="customerEmail"]', 'ana@test.com');
    await page.fill('textarea[name="customerAddress"]', 'Ulica 5, Novi Sad');
    await page.click('button:has-text("Potvrdi porudžbinu")');

    await expect(page.locator('h1:has-text("Porudžbina je uspešno poslata!")')).toBeVisible();
  });
});
```

---

### Pokretanje Testova — Komande

| Nivo | Komanda | Gde |
| :--- | :--- | :--- |
| Unit (Backend) | `./mvnw test` | `backend/` |
| Unit (Frontend) | `npx vitest run` | `frontend/` |
| Integracioni | `./mvnw test -Dtest=*IntegrationTest` | `backend/` |
| E2E | `npx playwright test` | root |
| E2E (sa UI) | `npx playwright test --ui` | root |
| Svi E2E (samo Chromium) | `npx playwright test --project=chromium` | root |

---

## Pregled Faza i Git Lekcija

| Faza | Funkcionalnost | Git Lekcija | Testiranje |
| :--- | :--- | :--- | :--- |
| 1 | Servisni sloj + Validacija | Feature branch, `--no-ff` merge | JUnit + Mockito unit testovi |
| 2 | Paginacija + Sortiranje | Interaktivni rebase | Backend integ. + Playwright |
| 3 | Autentifikacija (JWT) | Stash, cherry-pick, .env | Security unit + integ. testovi |
| 4 | Admin Panel (CRUD) | Pull Request workflow | Autorizacija + E2E testovi |
| 5 | UX poboljšanja | Bisect, blame | Vitest hook testovi + E2E |
| 6 | CI/CD | Hooks, Tags, Actions | Automatizovani pipeline sva 3 nivoa |

---

*Svaka faza je projektovana da traje 1-2 nedelje nastave. Studenti rade u parovima ili timovima od 3-4 člana, svaki tim radi na svojoj grani i pravi Pull Request.*
