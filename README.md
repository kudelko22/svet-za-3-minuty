# Svet za 3 minúty

Appka pre rodičov a deti. Každý deň jedna krátka téma o tom, ako funguje svet, vysvetlená tak, aby ju rodič
zvládol povedať za 2–3 minúty, napríklad cestou autom. Ku každej téme patrí obrázok, príklad zo života,
otázky na rozhovor a kvíz. Text vie appka aj prečítať nahlas.

**Appka:** https://kudelko22.github.io/svet-za-3-minuty/

## Ako si ju dať do mobilu

- **Android (Chrome):** otvor odkaz, ťukni na ⋮ vpravo hore a vyber **Inštalovať aplikáciu** alebo **Pridať na plochu**.
- **iPhone (Safari):** otvor odkaz, ťukni na tlačidlo **Zdieľať** a vyber **Pridať na plochu**.

Appka sa potom otvára cez celú obrazovku ako bežná aplikácia a po prvom otvorení funguje aj bez internetu.
Body, prebraté a uložené témy si pamätá telefón, nikam sa neposielajú.

## Čo v nej je

- 33 tém v 11 kategóriách (história, politika, ekonomika, každodenný život, technika, veda, príroda,
  ľudské telo, geografia, psychológia, kultúra), téma dňa a náhodná téma
- dva vekové stupne: 5–8 rokov a 9–12 rokov (odsek navyše a ťažšie otázky)
- kvíz s obrázkovými odpoveďami, rýchly kvíz z rôznych tém, body, hviezdy a séria dní
- maskot sovička Múdra, kreslené pohyblivé obrázky, zvuky (dajú sa vypnúť) a čítanie nahlas

## Súbory

| Súbor | Čo je v ňom |
| --- | --- |
| `index.html` | vzhľad a správanie appky |
| `temy.js` | kategórie a texty tém, otázky a kvízy |
| `obrazky.js` | kreslené obrázky k témam a sovička |
| `manifest.webmanifest`, `ikony/` | názov a ikona appky v mobile |
| `sw.js` | uloženie appky do telefónu, aby fungovala offline |

## Ako pridať novú tému

1. Do `temy.js` pridaj do zoznamu `T` nový záznam podľa vzoru ostatných: `id`, kategória `k`, nadpis `t`,
   vysvetlenie `m` (pre všetkých) a `s` (navyše pre staršie deti), príklad `p`, otázky `o` a kvíz `z`.
   V kvíze je správna vždy prvá odpoveď, appka ich poradie zamieša sama.
2. Do `obrazky.js` pridaj do `ART` obrázok s rovnakým `id`.
3. V `sw.js` zvýš `VERZIA` (napríklad `svet3-v2`), aby si telefóny stiahli novú verziu.

Fakty v témach treba pred pridaním skontrolovať.

Autor: Alex Kúdela
