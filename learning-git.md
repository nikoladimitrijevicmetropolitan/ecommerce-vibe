# Git Edukacija - E-commerce Vibe

Ovaj dokument prati razvoj projekta kroz Git komande. Svaki korak u razvoju je propraćen odgovarajućim Git akcijama kako biste naučili kako se projekat vodi u realnom okruženju.

## 1. Inicijalizacija Projekta

Prvi korak u svakom projektu je inicijalizacija Git repozitorijuma.

```bash
# Inicijalizacija novog Git repozitorijuma
git init
```

## 2. Podešavanje Backend-a (Spring Boot)

Nakon što smo generisali osnovnu strukturu Spring Boot projekta, dodajemo fajlove u Git.

```bash
# Provera statusa (vidi se šta je novo)
git status

# Dodavanje svih fajlova u backend direktorijumu
git add backend/

# Prvi commit sa opisnom porukom
git commit -m "feat: Inicijalno podešavanje Spring Boot backenda"
```

## 3. Podešavanje Frontend-a (React + Vite)

Slično kao za backend, inicijalizujemo frontend i beležimo promene.

```bash
# Dodavanje frontend fajlova
git add frontend/

# Commit za frontend (koristeći Node v24)
git commit -m "feat: Inicijalno podešavanje React frontenda sa Vite (Node v24)"
```

---

## 4. Implementacija Backend Logike

Dodajemo modele, repozitorijume i kontrolere koji čine srž API-ja.

```bash
# Provera šta je sve izmenjeno/dodato u src folderu
git status

# Dodavanje svih Java klasa
git add backend/src/main/java/com/vibe/ecommerce_backend/

# Commit za backend logiku
git commit -m "feat: Implementacija modela, repozitorijuma i kontrolera"
```

---

## 5. Razvoj Frontend Komponenti

Kreiranje korisničkog interfejsa, upravljanje korpom i povezivanje sa API-jem.

```bash
# Provera izmenjenih fajlova na frontendu
git status

# Dodavanje svih komponenti i stilova
git add frontend/src/

# Commit za frontend funkcionalnosti
git commit -m "feat: Implementacija UI komponenti, korpe i checkout-a"
```

---

## 6. Podešavanje Testova (Playwright)

Dodavanje E2E testova kako bismo osigurali da aplikacija radi ispravno iz ugla korisnika.

```bash
# Inicijalizacija Playwright-a
npm init playwright@latest

# Dodavanje test fajlova u Git
git add tests/ playwright.config.ts

# Commit za testove
git commit -m "test: Dodat Playwright setup i E2E test"
```

---

## 7. Ispravka Grešaka (Bug Fix)

U toku razvoja je primećeno da nedostaje CSS fajl. Ovo je primer kako se dokumentuje ispravka.

```bash
# Provera statusa i uvid u novi fajl
git status

# Dodavanje konkretnog fajla koji je nedostajao
git add frontend/src/components/ProductList.css

# Commit sa 'fix' prefiksom
git commit -m "fix: Dodat nedostajući ProductList.css fajl"
```

---

## 8. Rad sa Granama (Branching & Merging)

U realnom radu, nove funkcionalnosti se razvijaju na posebnim granama kako bi `master` (glavna) grana uvek bila stabilna.

### Kreiranje i prelazak na novu granu
```bash
# Kreiranje 'feature' grane za upravljanje zalihama
git checkout -b feature/stock-management
```

### Rad na grani
Nakon izmena koda, promene beležimo samo na toj grani.
```bash
git add .
git commit -m "feat: Dodato polje za zalihe (stock)"
```

### Spajanje sa glavnom granom
Kada je funkcionalnost spremna, spajamo je sa `master` granom.
```bash
# Povratak na master granu
git checkout master

# Spajanje izmena sa feature grane
git merge feature/stock-management

# (Opciono) Brisanje grane koja nam više ne treba
git branch -d feature/stock-management
```

### Pregled istorije
```bash
# Vizuelni prikaz svih commit-ova i grana
git log --oneline --graph --all
```

---

## 9. Vraćanje Unazad (Undoing Changes)

Git nam omogućava da se vratimo na bilo koji trenutak u prošlosti projekta.

### Pregled prethodnih stanja (Checkout)
Ako želimo samo da pogledamo kod iz nekog prethodnog commit-a:
```bash
# Pronalaženje ID-ja (hash-a) commit-a
git log --oneline

# Prelazak na taj commit (npr. c5c3700)
git checkout c5c3700
```
*Sada ste u "detached HEAD" stanju. Da se vratite na najnoviji kod, kucajte `git checkout master`.*

### Trajno poništavanje (Reset)
Ako želite da obrišete poslednje izmene i vratite se na određeni trenutak:
```bash
# Vraćanje na commit pre 'stock' funkcionalnosti
git reset --hard c5c3700
```
**Oprez**: Sve promene napravljene nakon tog commit-a će biti obrisane iz istorije!

### Poništavanje commit-a novim commit-om (Revert)
Sigurniji način za timski rad, jer ne menja istoriju već dodaje novi commit koji "poništava" prethodni:
```bash
git revert 46a4c1a
```

---

## 10. Ignorisanje Fajlova (.gitignore)

Neki fajlovi ne treba nikada da završe u repozitorijumu (npr. lozinke, privremeni fajlovi, biblioteke).

### Kako radi .gitignore?
Kreiramo fajl pod nazivom `.gitignore` u korenu projekta i u njega upisujemo putanje koje Git treba da ignoriše.

### Primer vežbe
1. Kreirajte osetljiv fajl: `echo "SECRET_KEY=12345" > .env`
2. Proverite status: `git status` (videćete `.env` kao "untracked")
3. Dodajte `.env` u `.gitignore`
4. Ponovo proverite status: `git status` (fajl `.env` je "nestao" sa liste za Git!)

### Šta obično ignorišemo?
```text
node_modules/    # Biblioteke (npm install ih ponovo skida)
target/          # Build fajlovi Jave
.env             # Tajni podaci i ključevi
.vscode/         # Lična podešavanja editora
```

---
*Napomena: Ovaj dokument je kompletan za osnovni i napredni ciklus razvoja.*
