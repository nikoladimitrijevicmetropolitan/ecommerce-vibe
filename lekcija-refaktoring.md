# Lekcija 01.05. - Refaktoring: Servisni Sloj i Mockito

Danas smo uradili "generalku" na našem backendu. Naučili smo kako da kod učinimo održivim i kako da testiramo logiku bez pokretanja cele baze podataka.

---

## 1. Zašto Servisni Sloj (Service Layer)?

Ranije je naš `Controller` radio sve: primao HTTP zahteve, pričao sa bazom, proveravao zalihe... To je tzv. **Fat Controller** antipattern.

**Danas smo uveli Separation of Concerns (Razdvajanje odgovornosti):**
- **Controller**: Samo saobraćajac. Prima zahtev, proverava da li je JSON ispravan i prosleđuje ga servisu.
- **Service**: Mozak aplikacije. Ovde živi biznis logika (npr. "Da li smem da prodam ovaj laptop ako imam samo jedan na stanju?").
- **Repository**: Samo arhiva. Zna samo kako da spasi ili učita podatke.

---

## 2. Biznis Logika i Validacija

Uveli smo kritičnu proveru u `OrderService`:
```java
if (product.getStock() < item.getQuantity()) {
    throw new RuntimeException("Nedovoljno proizvoda na stanju");
}
```
Ovo osigurava da prodavnica ne može da proda ono što nema. Takođe smo uveli `@Transactional` - ako kupac kupuje 3 različita proizvoda i jedan nije na stanju, ceo proces se poništava (rollback).

---

## 3. Šta je Mockito?

Kada testiramo `Service`, ne želimo da koristimo pravu bazu podataka (H2), jer je to sporo i komplikovano za postavljanje različitih scenarija.

**Mockito nam omogućava da "lažiramo" (Mock-ujemo) zavisnosti:**
- Kažemo: "Kada neko pita repozitorijum za proizvod ID 1, vrati mu ovaj moj testni objekat sa cenom 1000 i zalihama 5".
- Na taj način možemo lako da testiramo šta se dešava kada zaliha nestane, a da ne moramo stvarno da brišemo podatke iz baze.

---

## 4. GlobalExceptionHandler

Uveli smo `@ControllerAdvice`. Ovo je centralni sistem za obradu grešaka. Umesto da frontend dobije generičku grešku 500 sa tonom teksta, on sada dobija čist JSON:
```json
{
  "message": "Nedovoljno proizvoda na stanju",
  "status": "400"
}
```

---
*Status projekta: Arhitektura je sada "Clean Architecture" spremna za produkciju.*
