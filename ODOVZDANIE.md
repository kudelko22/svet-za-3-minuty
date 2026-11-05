# Odovzdanie medzi sessions

Dlhé sessions sa vyraďujú a nahrádzajú novými (pravidlo v CLAUDE.md, časť Sessions). Tu je to, čo nová session potrebuje.
Čítaj len svoju časť (`Grep "^## "`). História je v `git log` a v pamäti projektu (`svet-za-3-minuty.md`). Starý rozhovor
sa dá prehľadať: `search_session_transcripts` s `include_archived: true`.

Repozitár je verejný: sem nepatria osobné údaje, e-maily, počty účtov ani kľúče.

## AKTUÁLNY STAV APLIKÁCIE (hlavná session)

Úloha: prehľad nad celou appkou. Vlastník sa tu pýta na stav a rozhoduje, odtiaľto sa spúšťajú nové sessions.
Kód sa tu nemení: práca ide do session Vývoj alebo do session svojej témy.

Na otázku „aký je stav“ vypísať krátko a jednoducho: appka a verzia, postup, optimalizácia, otvorené veci, ktoré sessions
existujú a koľko je minutého limitu (`list_sessions`, `get_usage`). Čítať len to, čo treba, a nič nespúšťať.

Stav 4. 11. 2026:

- **Na webe:** verzia 2.8 (`VERZIA_APPKY` 35), nasadená 30. 10. Má 127 tém, 24 kategórií a 47 skúšok pravidiel. Vlastník
  všetko vyskúšal sám, aj na viacerých účtoch.
- **Postup:** 1.26 témy v 4 oblastiach; 2.0 Priatelia; 2.1 správy; 2.2 pochvala témou, srdiečko, Videné; 2.3 sprievodca appkou;
  2.4 úvodná obrazovka a návod na plochu; 2.5 životy a prestávky v kvízoch; 2.6 plynulejšia sova a 8 vecí pre postavičku;
  2.7 sprievodca pre nový účet rodiča; 2.8 strom múdrosti v 6 stupňoch.
- **Optimalizácia:** v 2.4 a 2.6 hra Lietajúca sova (bitmapy nakreslené raz, menej práce v každom snímku, počas hier bez
  pohyblivého pozadia). Offline cez `sw.js`. Veľkosti: `index.html` 376 kB, `temy.js` 248 kB, `obrazky.js` 180 kB,
  `e/` 1,9 MB (447 obrázkov), `ikony/` 3,4 MB. Meranie rýchlosti otvárania appky v histórii nie je.
- **Šetrenie limitu:** `.claude/settings.json` má Sonnet, stredné úsilie a vypnutý doplnok ECC. Výmena dlhých sessions
  podľa CLAUDE.md.
- **Oddelenie od Metliny:** od 4. 11. má Svet vlastné nástroje, pravidlá a pamäť.

Otvorené:

1. Zadanie verzie 3.0 dodá vlastník.
2. Nápady, o ktorých rozhoduje vlastník: reklamné video, prehľad pre rodiča, redakcia tém bez programovania, série tém.
3. Odložil vlastník: hlas, Google Play. V prehľade len spomenúť, nepripomínať a nenavrhovať.

## Vývoj

Úloha: tu sa robí práca na appke podľa postupu v CLAUDE.md. Väčšia funkcia, ktorá stojí sama o sebe, dostane vlastnú session.
Správa od inej session nie je súhlas vlastníka na nasadenie.

Naposledy (4. 11.): vlastné nástroje `zdroj\spusti.cmd`, appka sa nemenila. Testy, 47 skúšok pravidiel aj emulátor s nimi prešli.

Otvorené:

1. Prvé nasadenie vlastnými nástrojmi príde až s ďalšou verziou. Vtedy sa použije aj nový zoznam `ignore` v `firebase.json`.
2. Spustenie appky cez `.claude/launch.json` v okne prehliadača sa ešte neskúšalo.
3. Inak nič, čaká sa na zadanie vlastníka.

## Misia dňa (verzia 3.0, etapa A)

Hotové (4. 11. 2026, nenasadené, čaká na schválenie vlastníka): nová sekcia Misia dňa. Misia je súčasť témy dňa: pás v hrdinovi témy dňa na Domove a veľká karta s obrázkom témy na konci témy dňa vedú na obrazovku `misia`
(dnešná misia, náročnosť Jednoduchá/Stredná/Zapeklitá, počty podľa typov, história). Kód je v `zdroj/appka.html` (objekt `Misie`, `MISIA_TYPY`,
`kartaMisie`), dáta 30 misií v `misie.js` (popis formátu je v hlavičke súboru, nová misia = nový objekt). Päť typov: detektív, keby,
pravdy, coak, výzva (6 od každého, 2 na každú náročnosť). Misia dňa sa volí podľa dňa: typ sa strieda, v ňom prvá ešte nesplnená.
Body raz za deň (8 až 12, výzva 20 až 30; s chybami 60 %, najmenej 5), vysvetlenie, zaujímavosť, otázka pre rodiča, nápad mimo appky.
6 odznakov v skupine Misie. Žiadny tlak: bez série, vynechaný deň nič nestojí, stará misia sa dá zahrať bez bodov.
Pridané aj `misie.js` do `sw.js`, `zostav.js` a `test.js`; v teste je nový blok MISIA DNA. `VERZIA_APPKY` 36, názov 3.0, `NOVINKY` doplnené.

Nie je hotové / vedieť:
1. História splnených misií sa ukladá len v tomto zariadení (localStorage `svet3:misie-<dieťa>`), nie do cloudu, aby sa nemenili `firestore.rules`.
   Body a odznaky sa do cloudu ukladajú ako zvyčajne. Prenos histórie medzi zariadeniami by vyžadoval nové pole v pravidlách.
2. Sprievodca appkou (Sprievodca) o Misii dňa nehovorí.
3. Obrazovku nebolo možné poriadne prezrieť očami (okno prehliadača bolo skryté); logika a vykreslenie prešli testom, základné
   zobrazenie som videl. Treba vyskúšať na telefóne.
4. 30 misií vydrží cca 2 týždne na jednu náročnosť, potom sa opakujú. Ďalšie sa dopíšu do `misie.js`.

## Etapa B: Angličtina ako samostatný bonus (verzia 3.0, nenasadené)

Hotové (4. 11. 2026):
- Angličtina už nie je medzi bežnými témami a oblasťami. `TV()` ju vynecháva, `ANGT()` vracia anglické lekcie (13 pôvodných tém, rovnaké id, takže `st.done`, hviezdičky a odznaky ostávajú).
- Vlastné miesto: karta „Angličtina na každý deň“ na Domove, pohľad `anglictina` (kvízik dňa, môj postup, zoznam pôvodných anglických lekcií).
- Denný kvízik: 6 otázok, vysvetlenie pri každej. Dáta v `anglictina.js` (100+ slov so spôsobom čítania, 40+ viet, skupiny); otázky sa skladajú podľa čísla dňa, takže každý deň sú iné (mladší len ľahšie položky). Body 8 raz za deň, ďalší kvízik bez bodov.
- Uložený stav `ang-<dieťa>` (dni, body, počet bez chyby); odznaky ang1, ang7, ang20, ang50, angBezChyby. Nič sa neresetuje, migrácia netreba.
- Žiadny tlak: vynechaný deň nič nestojí. Novinka v `NOVINKY` pod verziou 36 (číslo verzie ostalo 36 do vydania 3.0).
- Súbory: `anglictina.js` (nový, pridaný do `sw.js` a `zostav.js`), `appka.html`, `test.js` (nové skúšky). `zdroj\spusti.cmd test` OK, build OK, vyskúšané na emulátore.

Nezvládnuté / na rozhodnutie: ikony odznakov pre angličtinu sú existujúce (bublina, čiapka, koruna, terč), vlastné kresby nie sú. Obsahu je zhruba na 4 týždne bez opakovania slov, viac slov sa dá pridať riadkom do `ANG_SLOVA`.

## Etapa C verzie 3.0 (worktree festive-hodgkin-735aea, vetva claude/festive-hodgkin-735aea, nenasadené)

Hotové, v samostatných commitoch:
1. Medzery medzi bublinkami v správach (.dm-chat): gap 0, medzi správami 2 px, koniec skupiny 4 px, so srdiečkom 9 px.
2. Voľné písanie v správach: rodič ho zapne v profile dieťaťa v prehľade (časť Priatelia, tlačidlo Zapnúť voľné písanie). Správa má pole `x` (1 až 200 znakov);
   v `firestore.rules` ho povolí len ak majú v profile `pisanie: true` oba profily (odosielateľ aj príjemca). Obsah sa v appke neradí, rodič vidí správy v Posledných správach.
   `zdroj/pravidla-test.js` má 10 nových skúšok (57 z 57), port emulátora si berie z FIRESTORE_EMULATOR_HOST.
3. Vädnutie stromu (jemné): po dvoch vynechaných dňoch strom vädne (3 stupne: smädný, vädne, hnedý s hubami), hviezdičky na odomykanie hier ubúdajú
   (2 % denne, najviac 40 %) a drahé hry sa zamknú postupne. Prvý vynechaný deň sa nič nedeje. Nič sa nemení v `st.body`: je to len výpočet
   (`hnStupen`, `bodyHry`), po prvej téme sa všetko hneď vráti a ukáže sa oslava „Strom ožil“. Rodič to vypne v prehľade (nastavenie je len na tomto zariadení, `hnitie-<dieťa>`).
4. 24 nových tém (po jednej ku každej kategórii) v `temy.js` a `obrazky.js`.
5. 45 nových misií v `misie.js`: spolu 75, 5 na každý typ a úroveň, bez opakovania asi 25 dní.
`NOVINKY` doplnené (v 36). `VERZIA_APPKY` som nemenil, `index.html` som necommitoval (po zlúčení treba `build`).

Vedieť: voľné písanie nemá filter slov (pravidlá nevedia kontrolovať obsah), preto je za súhlasom rodiča pre oboch. Nastavenie vädnutia sa neprenáša medzi zariadeniami.
Pri zlúčení s etapou B bude konflikt hlavne v `zdroj/appka.html` (NOVINKY, okolie stromu) a v `temy.js`/`obrazky.js` (vložené tesne pred tému `farma`).

Doplnok etapy C: hry podľa veku. Appka vek pozná (`st.vek`, nastavuje sa pri tvorbe dieťaťa), nová voľba nebola treba. `HRY` má pole `len`: Bubliny s počtami len pre staršie dieťa, nová hra Koľko ich je? (`pocitaj`, cena 200 bodov, 5 kôl po 1 až 5 obrázkov, bez časovača, chybu sa dá opraviť) len pre malé. Zoznam hier, odznak Majster hier a nové hry používajú `HRY_VID()`. Rekordy ani postup sa nemenia.

## Vývoj: zlúčenie 3.0 (4. 11. 2026)

Etapa C (vetva claude/festive-hodgkin-735aea) zlúčená do `main` s etapami A a B. Konflikty len v `appka.html` (štatistika odznakov: `Ang.sucet()` aj `HRY_VID()`; `NOVINKY` v 36 spolu) a v tomto súbore. Verzia ostala 36 / 3.0.
`test` OK, `test:rules` 57 z 57 (na vlastnom porte 8290, lebo 8180 držal iný emulátor), `build` OK. Na emulátore: Domov, Misia dňa, Angličtina, Hry (Koľko ich je?), Priatelia, Ja bez chýb v konzole (len 404 na nejaký súbor, asi favicon).
NASADENÉ 4. 11. 2026 po súhlase vlastníka (push 20c360b, deploy hosting + pravidlá). Záloha zip na ploche. Neskúšané: odosielanie voľného písania a hnitie stromu naživo.

## Vývoj: 3.0.1 (4. 11. 2026, NASADENÉ po súhlase vlastníka)

Voľné písanie je automatické pre všetkých spárovaných priateľov (pravidlá už nepýtajú `pisanie`, pole ostáva v profile, ale nič nerieši; tlačidlo zapnúť/vypnúť v prehľade rodiča zmizlo, rodič môže vypnúť priateľov). Medzery v chate: srdiečko na bublinke prekrývalo ďalšiu bublinku, margin zväčšený (4/9/18 px), `flex: none`. `test` OK, `test:rules` 56 z 56, `build` OK. Nasadené (hosting aj pravidlá), záloha zip svet-za-3-minuty-3.0.1.zip na ploche.

## Vývoj: 3.0.2 (4. 11. 2026, NASADENÉ po súhlase vlastníka)

Skutočná príčina prekrývania bubliniek: text správy `.msg-t` bol inline `span` s paddingom, takže pri viacriadkovom texte sa pozadia riadkov prekrývali. Opravené `display: block`. Overené na rozlome dlhých správ. Nasadené, záloha svet-za-3-minuty-3.0.2.zip na ploche.

## Update 3.5, úloha A: dátový model, pravidlá, Cloud API, háčiky (nenasadené, verzia ostáva 38 / 3.0.2)

Plán: `side-session-notes\...\plan-3-5.md`. Hotové a zaradené, žiadna obrazovka ani vizuál (to B a C).
**Pozor, odchýlka od plánu:** kostry sú v koreni, nie v `zdroj/`: **`rodic-brana.js`** (B) a **`rodic-panel.js`** (C), tak ako `misie.js`, lebo `zdroj/**` je v `ignore` a na web by sa nedostali. Sú v `sw.js`, `zostav.js` (číslo verzie v URL), `test.js` a v `appka.html` ako `<script src>` pred hlavným skriptom.

Pravidlá: `rodiny/{uid}/rodic/profil`, `platnyRodic()`; `nastavenia` smie mať len kľúč `hnitie` (mapa ≤ 8), `pin.hash` 16 až 128, `ikona` r1..r6. `test:rules` 75 z 75 (19 nových). Pred hostingom najprv nasadiť pravidlá (`firestore:rules`).

Rozhranie (záväzné):
- Dáta: `Cloud.rodic = { nacitane, profil: null | {meno, ikona, pin:{sol,hash,iter}, nastavenia:{hnitie:{<idDieťaťa>:bool}}, verzia}, prepotvrdene }` (onSnapshot; resetuje sa pri zmene prihlásenia). `Cloud.dieta(id)`.
- Async API (pri chybe vyhodia `{code}`, text cez `chybaText`, ale ten je v module; v UI stačí `e.code`/vlastný text, alebo `try/catch` + toast): `Cloud.rodicVytvor({meno, ikona, pin})`, `Cloud.rodicOverPin(pin) -> bool`, `Cloud.rodicZmenPin(stary, novy)`, `Cloud.rodicPrepotvrdHeslom(heslo)` (Google účet: okno Googlu, heslo netreba), `Cloud.rodicObnovPin(novy)` (len do 5 min po potvrdení), `Cloud.rodicUloz({meno?, ikona?, nastavenia?})` (hnitie sa spája s existujúcim), `Cloud.rodicZmaz()`. PIN musí byť `^\d{4}$`. Obmedzenie pokusov (5 chýb = 30 s) nie je v API, robí ho B.
- `Rodic` (classic skript): `odomkni()`, `zamkni()`, `jeOdomknute()` (5 min nečinnosti; každé volanie predĺži), `chod(faza, id?)` (nastaví `st.faza`, `st.rodicDieta`, `render()`), `prevezmiLokalne()` (jednorazovo `hnitie-<id>` z localStorage do cloudu). Samo sa zamkne pri `Cloud.vyber`, odhlásení, zmene prihlásenia.
- Háčiky: `brany` dostane `RodicBrana.brany` aj `RodicPanel.views` (rodic*: fázy sa kreslia cez `renderBrana`, preto aj do `brany`; do `views` ide `RodicPanel.views` tiež). `brany.vyber` volá `RodicBrana.vyber(povodny)` (`povodny()` = pôvodný výber, premenovaný na `brany.vyberPovodny`; kostra vracia `povodny()`). Po `renderBrana` beží `RodicBrana.po()`. Klik: `if (RodicBrana.klik(b, d) || RodicPanel.klik(b, d)) return;` (len `button`, tesne pred `Misie.klik`).
- Fázy `st.faza`: `rodicTvorba`, `rodicPin`, `rodic`, `rodicDieta`, `rodicNastavenia`. Keď profil zmizne na inom telefóne, appka zo `rodic*` prejde na `vyber`.
- `hnitieZapnute()` nezmenené (to robí C).

Overené: `test`, `test:rules`, `build` OK. Neskúšané naživo: samotné PBKDF2/Firestore volania Cloud API v prehliadači a znovuprihlásenie (nie je na to obrazovka, skúsi D/B).

## Update 3.5, úloha B: obrazovky pred panelom (nenasadené, verzia ostáva 38)

Hotové v **`rodic-brana.js`** (v koreni, nie v `zdroj/`, tak ako to nechala A); `appka.html` sa nemenilo, žiadny nový háčik netreba. Štýly sa vkladajú z JS (`/* rodic-brana */`), ikony `IK.rodic1..6` (slnko, mesiac, strom, srdce, kľúč, domček) a `IK.pinZrus` sa dopĺňajú do `IK` pri prvom vykreslení. Ikona v `Cloud.rodic.profil.ikona` je `r1..r6`.
- `rodicTvorba`: meno (nepovinné, predvolene „Rodič“), 6 ikon, PIN 2x (kreslená klávesnica), potom `Cloud.rodicVytvor` -> `Rodic.odomkni(); Rodic.chod('rodic')`.
- `rodicPin`: klávesnica, trasenie pri chybe, po 5 zlých PIN-och pauza 30 s (len v pamäti, odpočet), „Zabudol som PIN“ -> heslo účtu (Google: okno Googlu) -> nový PIN 2x -> odomknutie.
- `vyber`: karta rodiča s jeho ikonou (`data-rodic-vstup`) alebo karta „Vytvoriť účet rodiča“ s prerušovaným okrajom (`data-rodic-novy`); keď rodič existuje, tlačidlo „Odhlásiť sa“ z výberu zmizne (odhlásenie patrí do nastavení rodiča, úloha C).
- Ostatné klik handlery: `data-rodic-ikona`, `data-rodic-dalej`, `data-rodic-spat`, `data-rodic-over`, `data-pin-cislo`, `data-pin-zrus`, `data-rodic-zabudol`.
Overené na emulátore: vytvorenie rodiča, zlé PIN-y, pauza, zabudnutý PIN so zlým aj správnym heslom, nový PIN, vstup. `test` a `build` OK. Neskúšané: Google variant obnovy PIN-u (popup), telefón/úzka obrazovka okrem krátkeho pohľadu.
Poznámka pre D: ak chce `tvorba`/`ja` posielať na vytvorenie rodiča, stačí `Rodic.chod('rodicTvorba')`.

## Update 3.5, úloha C: panel rodiča (nenasadené, verzia ostáva)

Súbor `rodic-panel.js` (v koreni) + malý refaktor v `zdroj/appka.html`.
- `RodicPanel.views.rodic` (karty detí: avatar, body, témy tento týždeň, séria, chyby; klik -> detail), `.rodicDieta` (`prehladRodica(d)`), `.rodicNastavenia` (zmena PIN-u, e-mail, odhlásiť, pridať/odstrániť dieťa, vädnutie stromu pre každé dieťa, odkaz na priateľov dieťaťa, hlas, plocha, zmazať profil rodiča, verzia). Tlačidlá Zamknúť (zamkne a ide na `rodicPin`) a Späť na výber (zamkne a ide na `vyber`). Zamknuté alebo bez profilu = presmerovanie (view aj klik). Klik handlery `data-rp-*`.
- `prehladHnitia(d)`, `prehladPriatelov(d)`, `prehladRodica(d)` berú dieťa (predvolene `st`). Ak je profil rodiča, tlačidlá v nich majú `data-rp-hnitie` / `data-rp-socvypni`, inak staré `data-hnitie-prepni` / `data-soc-vypni`.
- `hnitieZapnute(id = st.dietaId)` čítá `Cloud.rodic.profil.nastavenia.hnitie[id]` (ak kľúč existuje), inak localStorage. `Rodic.prevezmiLokalne()` sa volá raz pri prvom otvorení panela.
- Dotyky mimo môjho rozsahu (malé): `Cloud.rodicDietaOtvor(id)` / `Cloud.rodicDietaZavri()` za `Cloud.soc = Soc` (`socStart`/`nastavAktivne` sú v module, z `rodic-panel.js` nedostupné; otvor nastaví dieťa ako aktívne `st`, lebo `socData`/`socUlozProfil` píšu verejný profil podľa `st`), a riadok v `socZmena()` (v detaile dieťaťa prekreslí pohľad).
- Overené: `test`, `build` OK a dočasný test (zmazaný) s kartami, detailom, nastaveniami, prepínačom vädnutia a zamknutím. **Neskúšané vizuálne**: vstavaný prehliadač odmietol adresu 127.0.0.1, emulátor 5050 už bežal v inej session. Chýba kontrola vzhľadu (štýly `rp-*` sú v `rodic-panel.js`), PBKDF2 zmeny PIN-u naživo a pridanie/odstránenie dieťaťa naživo.
- Nie je: samostatné „vypnúť priateľov“ v nastaveniach (je v prehľade dieťaťa), blok RODIČ v `test.js` (D).

## Update 3.5, úloha D: zlúčenie a vydanie (3.5 NASADENÉ 2026-11-05)

- `main` obsahuje A + B + C (zlúčené, vetvy ostali). Konflikt bol len v `ODOVZDANIE.md`.
- Detský pohľad (`ja`): keď `Cloud.rodic.profil` existuje (`maRodica()`), zmizne `prehladRodica()` a karta Rodina je len „Zmeniť dieťa“ (+ plocha); bez rodiča karta „Vytvoriť účet rodiča“ (`data-rodic-novy` -> `Rodic.chod('rodicTvorba')`). V tvorbe postavičky sa „Odstrániť tento profil“ skryje, ak rodič existuje a nie je odomknutý.
- Sprievodca `SPR_RODIC`: nový krok `rodicucet` (len keď rodič neexistuje) s tlačidlom na tvorbu účtu rodiča; krok „Pre rodiča“ sa preskočí, ak rodič existuje.
- `VERZIA_APPKY` 39 (v repozitári už bola 38, nie 36/37), `VERZIA_NAZOV` 3.5, `NOVINKY`, cache `svet3-v3` v `sw.js`, blok RODIČ v `test.js`.
- Overené: `test`, `test:rules` (75/75), `build`; emulátor: nový účet -> sprievodca -> tvorba rodiča, PIN, panel s dieťaťom, detail, nastavenia, zlý PIN, obnova PIN-u heslom, nový PIN, detský pohľad s rodičom aj bez, zmazanie rodiča. Konzola bez chýb.
- Neoverené: Google obnova PIN-u (popup v tomto prehliadači nejde), vzhľad na telefóne, existujúci reálny účet s dátami.
- Nasadenie (po súhlase): `firebase deploy --only firestore:rules`, potom hosting (`zdroj\spusti.cmd deploy`), záloha zip na plochu, overenie na webe.
- NASADENÉ: najprv `firestore:rules`, potom hosting; web ukazuje verziu 3.5 a cache `svet3-v3`; záloha `Desktop\svet-za-3-minuty-3.5.zip` (tar.exe treba volať z `C:\Windows\System32`, z Git Bash sa použije GNU tar a zlyhá na `C:`). Neoverené naživo: prihlásenie na reálnom účte, Google obnova PIN-u.

## Update 3.5.1: pozvánka na účet rodiča (NENASADENÉ, čaká na súhlas vlastníka priamo v session)

- `RodicVyzva` v `zdroj/appka.html`: pri účte bez rodiča (`Cloud.rodic.nacitane`, bez profilu) sa na Domove raz za spustenie ukáže okno „Vytvor si účet rodiča“ (po Novinkách, nikdy počas hry, kvízu, sprievodcu). „Vytvoriť účet rodiča“ -> `rodicTvorba`, „Neskôr“ -> `S` kľúč `rodic-neskor` na 3 dni.
- `VERZIA_APPKY` 40, `VERZIA_NAZOV` 3.5.1, `NOVINKY`, cache `svet3-v4`, malé testy v bloku RODIČ.
- Overené: `test`, `build`, emulátor (okno sa ukáže, obe tlačidlá fungujú, odloženie drží).

## 3.6 úloha: obsah misií a angličtiny (len `misie.js`, `anglictina.js`; bez zmeny verzie, nenasadené)

- Misie: +51 nových (d16 až d25, p16 až p26, k16 až k25, c16 až c25, v16 až v25), spolu 126; na každý typ a náročnosť 3 až 4 nové. Pridané na koniec zoznamu.
- Duplicity: `p8` premenované „Tajomstvá tela“ (a prvé tvrdenie o kostiach nahradené mrkaním), `k12` „Susedovo okno“, `k11` prepracované na „Kamarát chce odpísať“ (pôvodné bolo to isté ako `k4`).
- Angličtina: +191 slov (spolu 344), nové skupiny `pocity` (Pocity) a `sport` (Šport a hry) v `ANG_SKUPINY`, +61 viet (spolu 121). Každé slovo vo vete je v `ANG_SLOVA` v tej istej skupine (skontrolované skriptom).
- Overené: `test`, `build`. Neoverené: vzhľad nových skupín v appke na emulátore (kód sa nemenil, test prešiel).

## 3.6 – úloha Angličtina (karta a rozklikávacie kvízy)
- Domov: karta „Angličtina na každý deň“ je väčšia, farebná, hojdá sa, má tlačidlo a stav „Dnes hotovo / Dnes ešte nie“.
- Pohľad Angličtina: mriežka kariet s postupným nábehom (denný kvízik, 12 skupín slov z `ANG_SKUPINY`, pôvodné lekcie). Skupinový kvíz = `Ang.otazky(den, extra, skupina)`, vždy bez bodov, hotovosť sa ukladá do `ang-<dieťa>.skup`. Test pokrýva všetky skupiny a oba vekové stupne.
- Súbor `anglictina.js` nezmenený. Verzia nezvýšená, nenasadené. Nevyskúšané očami na emulátore (len `test` a `build`).

## Update 3.6, čistenie profilu `ja` (NENASADENÉ, verzia ostáva 3.5.1)

Zmeny len v `views.ja` v `zdroj/appka.html` (+ krok sprievodcu, README):
- Odstránená karta „Hlas na čítanie“ z profilu (hlas ostáva v paneli rodiča, funkcie `hlasyHtml`, `data-hlas` a `Hlas` ostali, používa ich panel a čítanie tém).
- Karta „Zvuky“ sa ukazuje len na iPhone/iPad (tam je potrebná voľba Test 1/Test 2); inde zmizla (bola to len technická skúška a diagnostika).
- S rodičom: karta Rodina je len „Zmeniť dieťa“, zmizlo „Pridať appku na plochu“ a riadok s verziou a cloudom (to má panel rodiča). Licencia OpenMoji ostala.
- Bez rodiča: ostáva účet, stav uloženia, Zmeniť dieťa, Odhlásiť sa, Vytvoriť účet rodiča, Pridať na plochu, verzia, prehľad „Pre rodiča“.
- Vymazaný krok sprievodcu „Čítanie nahlas“; krok o rodine bez zmienky o odhlásení a ploche.
- Otvorené: bez rodiča sa už nedá zmeniť hlas (zmena len v paneli rodiča); skúška zvuku mimo iOS zmizla; vizuálne na emulátore neskúšané (`test` a `build` OK).
