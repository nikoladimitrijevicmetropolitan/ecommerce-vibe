# Napredni Git Vodič - E-commerce Vibe

Ovaj dokument pokriva komande koje se koriste u specifičnim i kompleksnijim situacijama tokom razvoja softvera.

---

## 1. Popravka poslednjeg commit-a (Amend)
**Scenario**: Upravo ste uradili commit, ali ste shvatili da ste zaboravili da dodate jedan fajl ili ste napravili tipfeler u poruci.

```bash
# Dodajte zaboravljeni fajl
git add zaboravljeni_fajl.java

# Izmenite poslednji commit bez pravljenja novog
git commit --amend --no-edit
```
*Napomena: Koristite ovo samo ako niste već uradili `push` na GitHub.*

---

## 2. Cherry-pick (Biranje trešanja)
**Scenario**: Kolega je na svojoj grani popravio kritičan bug u `ProductController`-u. Vama treba ta popravka odmah na vašoj grani, ali ne želite sve ostale njegove nedovršene izmene.

```bash
# 1. Pronađite hash commit-a koji vam treba (npr. a1b2c3d)
# 2. Primenite ga na svoju granu
git cherry-pick a1b2c3d
```

---

## 3. Interaktivni Rebase (Čišćenje istorije)
**Scenario**: Tokom rada ste napravili 10 sitnih commit-ova tipa "popravka", "test", "sitnica". Pre slanja na GitHub, želite da ih spojite u jedan pregledan commit "feat: Implementacija korpe".

```bash
# Pokrenite interaktivni rebase za poslednjih 5 commit-ova
git rebase -i HEAD~5
```
*U editoru koji se otvori, zamenite reč `pick` sa `squash` (ili samo `s`) za sve commit-ove koje želite da spojite sa prethodnim.*

---

## 4. Reflog (Git-ova "crna kutija")
**Scenario**: Slučajno ste uradili `git reset --hard` na pogrešan commit ili ste obrisali granu koju niste smeli. Mislite da je sve izgubljeno.

```bash
# Pogledajte kompletnu istoriju svih akcija (čak i onih obrisanih)
git reflog
```
*Pronađite trenutak pre nego što ste napravili grešku i vratite se na njega koristeći `git reset --hard <hash_iz_refloga>`.*

---

## 5. Git Blame (Ko je kriv?)
**Scenario**: Pronašli ste čudan bug u `OrderService.java`. Želite da vidite ko je poslednji menjao tu liniju koda i u kom commit-u.

```bash
# Prikaz fajla sa informacijama o autoru za svaku liniju
git blame backend/src/main/java/com/vibe/ecommerce_backend/model/Product.java
```

---

## 6. Git Bisect (Potraga za bug-om)
**Scenario**: Aplikacija je radila pre nedelju dana, a sada ne radi. Ima 50 commit-ova između. `bisect` vam pomaže da binarnom pretragom nađete tačan commit koji je uveo bug.

```bash
git bisect start
git bisect bad                 # Trenutna verzija je loša
git bisect good <hash_od_pre>  # Ova verzija od pre nedelju dana je bila dobra
```
*Git će vas šetati kroz commit-ove, vi testirate i kucate `git bisect good` ili `git bisect bad` dok vam on ne kaže: "Ovaj commit je krivac".*

---

## 7. Poređenje (Diff)
**Scenario**: Želite da vidite tačnu razliku između dve grane pre nego što uradite merge.

```bash
# Razlika između trenutne grane i mastera
git diff master

# Razlika između dva specifična commit-a
git diff hash1 hash2
```

---
*Napomena: Napredne komande koje menjaju istoriju (`amend`, `rebase`, `reset`) koristite pažljivo, naročito ako delite kod sa drugima.*
