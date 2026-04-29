# Lekcija 4: Admin Panel i Autorizacija po Ulogama (RBAC)

Dobrodošli u fazu gde pretvaramo našu prodavnicu u sistem kojim se može upravljati! U ovoj lekciji učimo kako da ograničimo pristup određenim delovima aplikacije samo za administratore.

## 1. Šta je RBAC?
**Role-Based Access Control (RBAC)** je metod ograničavanja pristupa sistemu na osnovu uloga koje korisnici imaju (npr. `ROLE_USER`, `ROLE_ADMIN`).

U našem sistemu:
- **Korisnik (ROLE_USER)**: Može da pregleda proizvode i kupuje.
- **Admin (ROLE_ADMIN)**: Može sve što i korisnik, plus CRUD (Create, Read, Update, Delete) operacije nad proizvodima.

## 2. Backend Zaštita (@PreAuthorize)
Spring Security nam omogućava da lako zaštitimo metode u kontroleru koristeći anotaciju `@PreAuthorize`.

```java
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public Product createProduct(@RequestBody Product product) {
    return productService.saveProduct(product);
}
```
Ovo osigurava da čak i ako neko pokuša da pošalje direktan API poziv (npr. preko Postman-a), server će ga odbiti sa statusom **403 Forbidden** ako nema ispravan JWT token sa admin ulogom.

## 3. Frontend Zaštita (Protected Routes)
Na frontendu ne želimo da korisnik uopšte vidi Admin stranicu ako nije admin. Napravili smo `ProtectedRoute` komponentu koja "čuva stražu".

```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```
Ako neulogovan korisnik pokuša da pristupi `/admin`, biće preusmeren na `/login`. Ako je ulogovan ali nije admin, biće vraćen na početnu stranu.

## 4. CRUD Operacije
Naučili smo kako da koristimo istu formu za **dodavanje** i **izmenu** proizvoda:
- Ako URL sadrži `id`, učitavamo podatke i šaljemo `PUT` zahtev.
- Ako nema `id`-a, forma je prazna i šaljemo `POST` zahtev.

## 5. Git workflow: Pull Request
U ovoj fazi smo simulirali timski rad:
1. Napravili smo granu `feature/admin-panel`.
2. Završili rad.
3. Push-ovali granu na server.
4. U realnom svetu, ovde bi se otvorio **Pull Request (PR)**, kolege bi pregledale kod, i tek onda bi bio spojen u `main`.

## 6. Rešavanje Problema: Prikaz Uloga na Frontendu (Troubleshooting)
Tokom razvoja testirali smo logovanje i primetili da se link "Admin" ne prikazuje u navigaciji čak ni kada se ulogujemo kao administrator!

**Zašto se ovo desilo?**
Frontend oslanja na uslov `user && user.role === 'ROLE_ADMIN'`. Međutim, naš `AuthController` je nakon uspele prijave vraćao samo `token` i `username`. Pošto je `role` nedostajao, uslov je uvek bio `false`.

**Rešenje:**
Ažurirali smo `AuthController.java` da izvlači ulogu iz Spring Security konteksta i uključuje je u JSON odgovor:
```java
// Izvlačenje uloge
String role = authentication.getAuthorities().stream()
        .findFirst()
        .map(item -> item.getAuthority())
        .orElse("ROLE_USER");

// Dodavanje uloge u odgovor
response.put("role", role);
```
Ovo je važna lekcija o tome kako **Frontend i Backend moraju da dele istu "strukturu" informacija** da bi sistem ispravno funkcionisao.

---
**Zadatak za studente**:
1. Ulogujte se kao admin (`admin` / `admin123`).
2. Dodajte novi proizvod i proverite da li se pojavljuje na početnoj strani.
3. Pokušajte da pristupite `/admin` ruti dok ste ulogovani kao običan korisnik i posmatrajte šta se dešava.
