# Vodič za Implementaciju Autentifikacije (Faza 3)

Ovaj dokument opisuje tačan redosled koraka kojima smo uveli Spring Security i JWT u E-commerce Vibe projekat.

---

## Korak 1: Priprema i Zavisnosti
Prvo smo kreirali novu Git granu `feature/authentication` kako ne bismo ugrozili stabilnost `main` grane. U `pom.xml` smo dodali:
- `spring-boot-starter-security`: Osnova za svu bezbednost.
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson`: Biblioteke za generisanje i čitanje JSON Web Tokena.

## Korak 2: Modelovanje Korisnika
Kreirali smo `User` entitet i `UserRepository`.
- **User**: Sadrži username, email i kriptovanu lozinku.
- **Repository**: Sadrži metode poput `findByUsername` i `existsByEmail` koje su nam neophodne za proveru pri registraciji.

## Korak 3: Srce JWT Sistema (`JwtUtils`)
Kreirali smo pomoćnu klasu `JwtUtils` koja:
- Generiše token koristeći tajni ključ (**Secret Key**).
- Postavlja vreme isteka (**Expiration**).
- Validira tokene koji stižu sa frontenda.

## Korak 4: Integracija sa Spring Security
Ovo je bio najkompleksniji deo backenda:
1.  **`UserDetailsServiceImpl`**: Objasnili smo Springu kako da nađe našeg korisnika u bazi.
2.  **`AuthTokenFilter`**: Napravili smo "presretač" koji iz svakog HTTP zahteva vadi token i proverava ga.
3.  **`WebSecurityConfig`**: Glavna komandna tabla gde smo rekli: "Svi mogu da gledaju proizvode, ali samo ulogovani mogu da prave porudžbine". Ovde smo konfigurisali i **BCrypt** za kriptovanje lozinki.

## Korak 5: Autentifikacioni API (`AuthController`)
Napravili smo endpoint-e:
- `/api/auth/register`: Prima podatke, proverava da li korisnik postoji, kriptuje lozinku i čuva u bazu.
- `/api/auth/login`: Proverava kredencijale i vraća **JWT token** nazad frontendu.

## Korak 6: Frontend State Management (`AuthContext`)
U React-u smo uveli `AuthContext`:
- Čuva trenutno ulogovanog korisnika u memoriji.
- Čuva token u `localStorage`-u tako da korisnik ostane ulogovan i nakon osvežavanja stranice (F5).

## Korak 7: UI Komponente (Login & Register)
Kreirali smo stranice za interakciju:
- **`Login.jsx`**: Forma koja šalje zahtev backendu i, u slučaju uspeha, poziva `login()` funkciju iz konteksta.
- **`Register.jsx`**: Forma sa validacijom lozinki.
- **`Auth.css`**: Dodali smo premium stilove za ove forme.

## Korak 8: Povezivanje sa Navigacijom
Ažurirali smo `Navbar`:
- Ako korisnik nije ulogovan, vidi dugme **"Prijava"**.
- Ako je ulogovan, vidi svoje ime i dugme **"Odjavi se"**.

## Korak 9: Osiguravanje Kupovine (`CheckoutForm`)
Na kraju smo izmenili proces kupovine:
- Ako neulogovan korisnik pokuša da ode na checkout, React ga automatski preusmerava na Login.
- Prilikom slanja porudžbine, dodali smo `Authorization: Bearer <token>` u zaglavlje zahteva.

---
*Zaključak: Ovim tokom smo obezbedili da aplikacija bude sigurna (backend zaštita) i laka za korišćenje (frontend automatizacija).*
