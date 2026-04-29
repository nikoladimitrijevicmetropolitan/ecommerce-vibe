# Lekcija 30.04. - Paginacija i Sortiranje Podataka

Danas smo naučili kako da upravljamo velikim količinama podataka. Zamislite prodavnicu sa 10.000 proizvoda - učitavanje svega odjednom bi "ubilo" i browser i bazu podataka.

---

## 1. Paginacija na Backend-u (Spring Data JPA)

Spring Boot nam nudi moćan alat pod nazivom **Pageable**.

### Kako funkcioniše:
1.  **Frontend** šalje parametre: `?page=1&size=8&sort=price,asc`
2.  **Spring** te parametre pretvara u `Pageable` objekat.
3.  **Hibernate** (JPA) na osnovu toga generiše SQL upit:
    ```sql
    SELECT * FROM product LIMIT 8 OFFSET 8 ORDER BY price ASC;
    ```
4.  **Backend** vraća `Page<Product>` objekat koji sadrži:
    - `content`: Lista proizvoda za tu stranu.
    - `totalElements`: Ukupan broj proizvoda u bazi (npr. 20).
    - `totalPages`: Koliko ukupno strana ima.
    - `number`: Trenutni broj strane.

### Zašto je ovo važno?
Ovim štedimo memoriju (RAM) i mrežni saobraćaj. Prenosimo samo 8 proizvoda umesto svih 20 ili 2000.

---

## 2. Paginacija na Frontend-u (React)

Na frontendu smo implementirali "Stateful" listu koja prati URL.

### Ključni koraci:
1.  **URL kao jedini izvor istine**: Umesto da čuvamo `currentPage` samo u state-u, mi ga čuvamo u URL-u (`?page=1`). Ovo omogućava korisniku da osveži stranu ili pošalje link drugome, a da ostane na istoj strani.
2.  **useEffect**: Svaki put kada se URL promeni, `useEffect` se okida i šalje novi zahtev backendu sa novim parametrima.

---

## 3. Sortiranje: Baza vs. Browser

**Pravilo**: Sortiranje se UVEK radi na bazi podataka.

**Zašto?**
Ako sortirate u browseru (JavaScript `array.sort()`), vi sortirate samo onih 8 proizvoda koje trenutno vidite. Korisnik očekuje da vidi najjeftiniji proizvod u **celoj prodavnici**, a ne samo na prvoj strani. Baza podataka ima pristup svim podacima i može ih efikasno sortirati pre nego što nam pošalje prvu stranu.

---

## Plan rada koji smo ispunili:
- [x] Proširena baza testnih podataka (20 proizvoda).
- [x] Ažuriran `ProductRepository` da podržava `Page`.
- [x] Implementiran `Pagination.jsx` reusable komponenta.
- [x] Integrisano sortiranje po ceni i nazivu.

---
*Zadatak za studente: Pokušajte da promenite `size` parametar u ProductController-u na 4 i posmatrajte kako se paginacija automatski ažurira na frontendu.*
