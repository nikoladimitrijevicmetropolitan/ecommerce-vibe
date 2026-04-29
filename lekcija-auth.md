# Lekcija 02.05. - Autentifikacija (JWT + Spring Security)

Danas smo uveli najbitniji deo bezbednosti modernih web aplikacija. Više nismo samo prodavnica, već sistem sa korisnicima.

---

## 1. Kako funkcioniše JWT (JSON Web Token)?

Zamislite da uđete u hotel:
1.  Dođete na recepciju (**Login**) i pokažete ličnu kartu (**Korisničko ime i lozinka**).
2.  Recepcija vam da karticu od sobe (**JWT Token**).
3.  Svaki put kada idete u bazen ili restoran, samo pokažete karticu. Ne morate ponovo da pokazujete ličnu kartu.

**U našem kodu:**
- Kada se ulogujete, backend pravi "potpisan" token.
- Frontend taj token šalje u svakom zahtevu u `Authorization` zaglavlju: `Bearer <TOKEN>`.
- Backend samo proveri "potpis" i zna ko ste, a da ne mora da pita bazu podataka svaki put.

---

## 2. Spring Security Filteri

Uveli smo `AuthTokenFilter`. On radi kao izbacivač na ulazu u klub:
- Svaki zahtev koji stigne na `/api/orders` mora da prođe kroz njega.
- On traži token. Ako ga nema ili je nevalidan, vraća **401 Unauthorized**.
- Ako je token dobar, on kaže sistemu: "Ovaj korisnik je OK, pusti ga dalje".

---

## 3. Bezbednost Lozinki

Nikada ne čuvamo lozinke u čistom tekstu! Koristili smo `BCryptPasswordEncoder`. 
Čak i ako neko ukrade našu bazu podataka, videće samo nasumične nizove karaktera (npr. `$2a$10$X5v...`).

---

## 4. Frontend Zaštita

U `CheckoutForm.jsx` smo dodali proveru:
```javascript
if (!user) navigate('/login');
```
Ovo sprečava korisnika da uopšte vidi formu za plaćanje ako nije ulogovan. To je prvi nivo zaštite, dok je backend (Spring Security) drugi i najbitniji nivo.

---
*Zadatak za studente: Pokušajte da napravite porudžbinu dok ste odjavljeni koristeći Postman. Videćete da će backend vratiti 403 Forbidden.*
