# Lekcija 29.04. - Strategije i Nivoi Testiranja Softvera

Danas učimo kako da izgradimo poverenje u naš kod. Testiranje nije samo "provera da li radi", već proces osiguravanja da izmene koje uvedemo danas ne polome ono što je radilo juče.

---

## 1. Piramida Testiranja (Testing Pyramid)

U modernom razvoju softvera koristimo koncept **piramide testiranja**. Ona nam govori da treba da imamo mnogo malih, brzih testova u dnu, a manje kompleksnih testova pri vrhu.

```
       /  E2E  \          <-- Najskuplji, najsporiji, ali najbliži korisniku
      / Integr. \         <-- Proveravaju saradnju delova sistema
     /   UNIT    \        <-- Najbrži, najbrojniji, testiraju izolovanu logiku
    /_____________\
```

---

## 2. Unit Testiranje (Jedinično testiranje)

**Definicija**: Testiranje najmanjeg mogućeg dela koda (npr. jedne funkcije ili metode) u potpunoj izolaciji.

- **Cilj**: Potvrditi da logika u toj funkciji radi ispravno za sve ulazne parametre.
- **Izolacija**: Ako funkcija zavisi od baze ili drugog servisa, te zavisnosti se "lažiraju" (tzv. **Mock-ovanje**).
- **Primer**: Testiramo funkciju `calculateTotal()` u korpi. Ne zanima nas baza podataka, samo da li `2 + 2` daje `4`.

---

## 3. Integraciono Testiranje

**Definicija**: Testiranje saradnje između dve ili više komponenti sistema.

- **Cilj**: Osigurati da podaci ispravno "teku" kroz sistem.
- **Fokus**: Interakcija sa bazom podataka, pozivi eksternih API-ja, komunikacija između frontenda i backenda.
- **Primer**: Proveravamo da li `OrderController` ispravno šalje podatke u bazu i da li se ti podaci tamo stvarno čuvaju.

---

## 4. Zašto ponovo pokrećemo E2E testove?

Možda se pitate: *"Ako imamo Unit testove za svaki deo i Integracione za spojeve, zašto nam treba Playwright (E2E)?"*

**Razlog**: Unit i integracioni testovi testiraju "delove mosta". E2E test proverava da li se ceo most sruši kada preko njega pređe kamion (pravi korisnik).

- **E2E (End-to-End)** simulira stvarno ponašanje: otvaranje browsera, kliktanje mišem, čekanje na mrežu.
- On može otkriti greške koje ni jedan mali test ne vidi (npr. dugme je sakriveno iza drugog elementa, ili JavaScript greška blokira ceo UI).

---

## Plan rada za danas (29.04.)

1.  **Grana**: Kreiramo `feature/testing-setup`.
2.  **Frontend Setup**: Instalacija `Vitest` i `React Testing Library`.
3.  **Pisanje Unit testa**: Testiramo logiku `CartContext`-a.
4.  **Backend Integration**: Pisanje testa za `ProductController` koristeći `MockMvc`.
5.  **Verifikacija**: Pokretanje svih testova (Unit + Integr. + E2E) kako bismo potvrdili 100% stabilnost.

---

*Zapamtite: Testovi su dokumentacija koja nikada ne zastareva.*
