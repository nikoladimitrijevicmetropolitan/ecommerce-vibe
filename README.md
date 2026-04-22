# E-commerce Vibe (Edukativni Projekat)

Ovo je primer full-stack e-commerce aplikacije razvijene za potrebe edukacije studenata o React-u, Spring Boot-u i Git workflow-u.

## Tehnologije

- **Frontend**: React + Vite (Vanilla CSS)
- **Backend**: Spring Boot 3 (REST API)
- **Baza podataka**: H2 (In-memory)
- **Testiranje**: Playwright (E2E)
- **Verzionisanje**: Git (pratite `learning-git.md`)

## Struktura Projekta

- `/frontend`: React aplikacija
- `/backend`: Spring Boot aplikacija
- `/tests`: Playwright E2E testovi
- `learning-git.md`: Vodič kroz Git komande korišćene tokom razvoja

## Kako pokrenuti

### 1. Backend
Potreban Java 17+.
```bash
cd backend
./mvnw spring-boot:run
```
API će biti dostupan na `http://localhost:8080`.

### 2. Frontend
Potreban Node.js (testirano sa v24).
```bash
cd frontend
npm install
npm run dev
```
Aplikacija će biti dostupna na `http://localhost:5173`.

### 3. Testovi
```bash
npm install
npx playwright test
```

## Git Edukacija
Svaki commit u ovom repozitorijumu je pažljivo osmišljen da pokaže inkrementalni razvoj. Pogledajte [learning-git.md](./learning-git.md) za detaljan opis komandi.
