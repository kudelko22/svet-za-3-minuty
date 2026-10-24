# Svet za 3 minúty

Appka pre rodičov a deti. Každý deň jedna krátka téma o tom, ako funguje svet, vysvetlená tak, aby ju rodič
zvládol povedať za 2–3 minúty, napríklad cestou autom. Ku každej téme patrí obrázok, príklad zo života,
otázky na rozhovor a kvíz. Text vie appka aj prečítať nahlas.

**Appka:** https://svet-za-3-minuty.web.app/ (Firebase Hosting). Stará adresa na GitHub Pages ukazuje odkaz na novú.

## Ako si ju dať do mobilu

- **Android (Chrome):** otvor odkaz, ťukni na ⋮ vpravo hore a vyber **Inštalovať aplikáciu** alebo **Pridať na plochu**.
- **iPhone (Safari):** otvor odkaz, ťukni na tlačidlo **Zdieľať** a vyber **Pridať na plochu**.

Appka sa potom otvára cez celú obrazovku ako bežná aplikácia a po prvom prihlásení funguje aj bez internetu.

## Rodina a deti

- Na začiatku sa prihlási rodič (Google účtom alebo e-mailom a heslom). Bez prihlásenia sa appka nedá použiť.
- Na jednom účte môžu byť až 4 deti. Každé má vlastný vek (5–8 alebo 9–12 rokov), body, prebraté a uložené témy a sériu dní.
- Každé dieťa si poskladá kreslenú postavičku: účes, farbu vlasov, pleť, oči, úsmev, okuliare, tričko s obrázkom,
  doplnok a pozadie. Postavička je v hlavičke appky a v profile; ťuknutím na ňu sa mení dieťa.
- Pokrok sa ukladá do cloudu (Firebase, databáza v Európe), takže je rovnaký na každom mobile rodiča.

## Odmeny

- **24 odznakov** za úspechy: počet tém, séria dní, body, téma bez chyby, rýchly kvíz 5 z 5, obľúbené témy
  a „Majster“ za každú kategóriu. Zbierka je v profile.
- **Diely postavičky za body:** veselé farby vlasov, okuliare, obrázky na tričko, klobúky a zvieratko na pleci
  (od 40 do 900 bodov, cenník je `ODOMKNI` v `obrazky.js`). Domovská obrazovka ukazuje ďalšiu odmenu
  a na konci témy sa oslavujú nové odznaky aj odomknuté veci.

## Firebase

Projekt `svet-za-3-minuty` (plán Spark, zadarmo): prihlásenie, databáza Firestore a hosting.

- Profily detí sú v `rodiny/<uid>/deti/<id>`; podľa `firestore.rules` vidí a mení každý rodič len svoju rodinu.
  Starý dokument `pokrok/<uid>` z verzie 5 appka pri prvom prihlásení prevedie na prvé dieťa.
- Nasadenie (Firebase CLI): `firebase deploy --only hosting,firestore:rules,auth`
- Skúšanie bez ostrých účtov: `firebase emulators:start --only auth,firestore,hosting --project demo-svet-za-3-minuty`
  a otvoriť http://127.0.0.1:5050 (appka sa na localhoste sama pripojí na emulátor).

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
3. V `index.html` zvýš `VERZIA_APPKY` (vidno ju v profile) a nasaď. Telefóny si novú verziu stiahnu pri ďalšom otvorení.

Fakty v témach treba pred pridaním skontrolovať.

Autor: Alex Kúdela
