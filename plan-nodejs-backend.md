# Plan: Reimplementacija Backend-a u Node.js + Express

Cilj je kreirati identičan backend u Node.js/Express koji će biti **drop-in zamena** za postojeći Spring Boot backend. Frontend neće morati da se menja — svi API endpoint-i, struktura JSON odgovora i JWT mehanizam ostaju isti.

---

## Analiza Postojećeg Spring Boot Backend-a

### Modeli (4)
| Model | Polja | Relacije |
|---|---|---|
| `Product` | id, name, description, price, category, imageUrl, stock | — |
| `Order` | id, customerName, customerEmail, customerAddress, items, totalPrice | OneToMany → OrderItem |
| `OrderItem` | id, product, quantity | ManyToOne → Product |
| `User` | id, username, password, email, role (default: ROLE_USER) | — |

### API Endpoint-i (8)
| Metod | Ruta | Zaštita | Opis |
|---|---|---|---|
| `GET` | `/api/products` | Javno | Lista proizvoda (paginacija, filtriranje, pretraga) |
| `GET` | `/api/products/:id` | Javno | Detalji jednog proizvoda |
| `POST` | `/api/products` | ADMIN | Kreiranje novog proizvoda |
| `PUT` | `/api/products/:id` | ADMIN | Izmena postojećeg proizvoda |
| `DELETE` | `/api/products/:id` | ADMIN | Brisanje proizvoda |
| `POST` | `/api/orders` | Authenticated | Kreiranje porudžbine (smanjuje stock) |
| `POST` | `/api/auth/login` | Javno | Prijava → vraća JWT + username + role |
| `POST` | `/api/auth/register` | Javno | Registracija novog korisnika |

### Bezbednost
- JWT tokeni (HMAC SHA384)
- Stateless sesije — nema čuvanja stanja na serveru
- `AuthTokenFilter` izvlači token iz `Authorization: Bearer ...` zaglavlja
- `@PreAuthorize("hasRole('ADMIN')")` za CRUD operacije nad proizvodima

### Poslovna logika
- **OrderService**: Validira email, proverava zalihe, smanjuje stock, čuva porudžbinu — sve u jednoj transakciji
- **ProductService**: Paginacija (page/size/sort), filtriranje po kategoriji, pretraga po imenu (case-insensitive)

---

## Predloženi Node.js Tehnološki Stack

| Komponenta | Spring Boot | Node.js ekvivalent |
|---|---|---|
| Web framework | Spring MVC | **Express.js** |
| ORM | JPA/Hibernate + H2 | **Sequelize** + **SQLite** (in-memory za dev) |
| Autentifikacija | Spring Security + JJWT | **jsonwebtoken** + custom middleware |
| Heširanje lozinki | BCryptPasswordEncoder | **bcryptjs** |
| Validacija | Bean Validation | **express-validator** |
| CORS | @CrossOrigin | **cors** middleware |
| Env varijable | application.properties | **dotenv** |

> **Napomena**: Koristimo SQLite umesto H2 jer je to najbliži ekvivalent za Node.js — lagana, ugrađena baza podataka bez eksternog servera. Za produkciju se lako zameni sa PostgreSQL promenom jedne linije konfiguracije.

---

## Struktura Foldera

```
backend-node/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize konfiguracija + SQLite
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── User.js
│   ├── routes/
│   │   ├── productRoutes.js     # GET/POST/PUT/DELETE /api/products
│   │   ├── orderRoutes.js       # POST /api/orders
│   │   └── authRoutes.js        # POST /api/auth/login, /register
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verifikacija (= AuthTokenFilter)
│   │   ├── adminMiddleware.js   # Provera ROLE_ADMIN (= @PreAuthorize)
│   │   └── errorHandler.js      # Centralni error handler (= GlobalExceptionHandler)
│   ├── services/
│   │   ├── productService.js
│   │   └── orderService.js
│   ├── utils/
│   │   └── jwtUtils.js          # Generisanje i validacija JWT-a
│   ├── seeders/
│   │   └── dataInitializer.js   # 20 proizvoda + admin korisnik
│   └── app.js                   # Ulazna tačka (Express setup)
├── package.json
├── .env
└── README.md
```

---

## Mapiranje Spring Boot → Express Koncepta

Ova tabela je ključna za studente koji prelaze sa jednog na drugi framework:

| Spring Boot | Express.js | Objašnjenje |
|---|---|---|
| `@RestController` | `express.Router()` | Definisanje API ruta |
| `@RequestMapping("/api/products")` | `router.use("/api/products", ...)` | Bazna putanja |
| `@GetMapping` / `@PostMapping` | `router.get()` / `router.post()` | HTTP metode |
| `@RequestBody` | `req.body` (uz `express.json()`) | Parsiranje JSON tela |
| `@PathVariable` | `req.params.id` | URL parametri |
| `@RequestParam` | `req.query.category` | Query parametri |
| `@Autowired` | `require()` / `import` | Dependency injection |
| `JpaRepository` | Sequelize Model | ORM operacije |
| `@Transactional` | `sequelize.transaction()` | Atomične operacije |
| `SecurityFilterChain` | Express middleware chain | Lanac obrade zahteva |
| `@PreAuthorize` | Custom middleware | Provera uloga |
| `@ControllerAdvice` | Error-handling middleware | Centralno rukovanje greškama |
| `CommandLineRunner` | `sequelize.sync().then(seed)` | Inicijalizacija podataka |

---

## Detalji Implementacije po Komponentama

### 1. Inicijalizacija
- `package.json` sa svim zavisnostima
- `.env` sa `PORT=8080`, `JWT_SECRET`, `JWT_EXPIRATION=86400000`
- `app.js` — Express instance, CORS, JSON parser, rute, error handler, Sequelize sync + seed

### 2. Modeli (Sequelize)
Svaki model ima isti set polja kao u Spring Boot-u. Relacije:
- `Order.hasMany(OrderItem)` — ekvivalent `@OneToMany(cascade = ALL)`
- `OrderItem.belongsTo(Product)` — ekvivalent `@ManyToOne`

### 3. Autentifikacija
- `jwtUtils.js` — `jwt.sign()` za generisanje, `jwt.verify()` za validaciju
- `authMiddleware.js` — izvlači Bearer token, verifikuje, postavlja `req.user`
- `adminMiddleware.js` — proverava `req.user.role === 'ROLE_ADMIN'`
- `authRoutes.js` — login vraća `{ token, username, role }`, register kreira korisnika

### 4. Product CRUD
- Paginacija koristi Sequelize `findAndCountAll` sa `limit`, `offset`, `order`
- JSON odgovor **mora** da prati Spring Boot format:
```json
{
  "content": [...],
  "totalElements": 20,
  "totalPages": 3,
  "number": 0,
  "size": 8
}
```

### 5. Order Servis
- Transakcija (`sequelize.transaction()`):
  1. Validira email format
  2. Za svaki OrderItem: pronađi proizvod, proveri stock, smanji zalihe
  3. Sačuvaj porudžbinu sa svim stavkama
- Ako bilo koji korak padne, cela transakcija se poništava (rollback)

### 6. Error Handling
- Centralni middleware koji hvata sve greške
- Vraća `{ message, status }` — isti format kao Spring Boot `GlobalExceptionHandler`

### 7. Seed Data
- Istih 20 proizvoda iz Spring Boot `DataInitializer`-a
- Admin korisnik: `admin` / `admin123` sa `ROLE_ADMIN`

---

## Verifikacioni Plan

1. **API kompatibilnost** — uporediti curl odgovore oba servera:
   - `GET /api/products` → ista struktura paginacije
   - `POST /api/auth/login` → isti JSON format
   - `POST /api/orders` sa validnim/nevalidnim podacima
2. **Playwright E2E testovi** — pokrenuti postojeće testove sa Node.js backend-om
3. **Ručna provera** — pokrenuti frontend sa Node.js backend-om i proveriti sve tokove

---

*Verzija dokumenta: 1.0 | Datum: 29.04.2026*
