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

## Update 3.6: zlúčenie troch vetiev (NENASADENÉ, čaká na súhlas vlastníka priamo v session)

- Zlúčené do `main`: misie a angličtina (`goofy-elbakyan`), karta Angličtiny a skupinové kvízy (`nifty-bhaskara`), čistejší profil Ja (`friendly-payne`). Konflikty len v `ODOVZDANIE.md`.
- `VERZIA_APPKY` 41, `VERZIA_NAZOV` 3.6, `NOVINKY` (viac angličtiny a misií, čistejší profil), cache `svet3-v5`. Okno pre rodiča z 3.5.1 je v tomto vydaní tiež (3.5.1 nebolo nasadené samostatne).
- Overené: `test`, `test:rules` 75/75, `build`; 126 misií, žiadne duplicitné `id` ani názvy; emulátor: karta Angličtina na Domove, obrazovka s 14 kartami, skupinový kvíz až do konca (zaškrtnutie), profil Ja bez rodiča (ostáva „Vytvoriť účet rodiča“) aj s rodičom (len „Zmeniť dieťa“, bez hlasu a prehľadu), konzola bez chýb.
- Neoverené: vzhľad na telefóne, samotné hranie jednotlivých nových misií, animácia kariet (videné len staticky), hlas na čítanie je teraz len v paneli rodiča.
- **3.6 NASADENÉ** (pravidlá, potom hosting; obsahuje aj 3.5.1). Web ukazuje 3.6, cache `svet3-v5`, záloha `Desktop\svet-za-3-minuty-3.6.zip`.

## 3.6.1 – prehľadnejší Domov (NENASADENÉ, čaká na súhlas vlastníka priamo v session)

Zmena len v `views.domov` a CSS (`.skupiny.rad`, `.acts.kompakt`) v `zdroj/appka.html`. `VERZIA_APPKY` 42, `VERZIA_NAZOV` 3.6.1, `NOVINKY` doplnené.
- Nové poradie: 1. Misia dňa (téma + misia), 2. Angličtina, (karta „Appka na ploche“, ak sa ukazuje), 3. Kvízy ako menšie tlačidlá (2x2 pre staršie deti, popis len keď je prestávka), 4. Tento týždeň a strom, 5. Režim do auta (kratší text), 6. Ďalšia odmena, 7. Oblasti tém v jednom posúvacom riadku, 8. Objavujte ďalej.
- Zmizla len bublina so sovičkou dole na Domove (text duplikoval Režim do auta; sovička ostáva v témach a v oknách).
- Nič sa nezmazalo: oblasti a kategórie sú aj v Témach, kvízy ostali, hry a odznaky nezmenené. Kroky sprievodcu majú cieľ `.hero`, `.tyzden`, `.auto-karta`, `.acts` (stále existujú), len ich poradie na obrazovke je iné než poradie krokov.
- Overené: `test`, `build`, emulátor na šírke 390 px (poradie, výšky, bez vodorovného posunu). Neoverené: tablet, šírka 360, ťažký kvíz a výzva vizuálne (starší vek), tmavý stav „Dnes hotovo“; snímky obrazovky v paneli boli nespoľahlivé. V konzole len 404 na nejaký zdroj (emulátor), nie z tejto zmeny.
- **3.6.1 NASADENÉ** (pravidlá + hosting), záloha `Desktop\svet-za-3-minuty-3.6.1.zip`.

## Oprava: plynulé vyhodnotenie v kvíze angličtiny (NENASADENÉ, verzia nezmenená)

- Príčina: po kliknutí na odpoveď sa volal `render()`, ktorý celý `main` prekreslil a `.anim > *` znova spustil vstupnú animáciu všetkých kariet, preto to blikalo.
- Oprava v `Ang` (`zdroj/appka.html`): `Ang.uprav()` len prepne triedy `ok`/`bad` a `disabled` na tlačidlách, pokrok a vymení pätičku (`Ang.pata()`: reakcia, vysvetlenie, Ďalej). Farby sa menia cez CSS `transition` na `.ans`. `Ang.dalsia()` pred ďalšou otázkou krátko (160 ms) vyblednie `main.ang-mizne`, potom `render()`. Pri `prefers-reduced-motion` ide hneď.
- Body, hviezdičky a postup nezmenené. V `test.js` je `matchMedia` pre reduced-motion `true`, aby test (synchrónny) nečakal na časovač.
- Overené: `test`, `build`, v prehliadači: po zlej aj správnej odpovedi ostal ten istý uzol otázky (bez prekreslenia), objavila sa reakcia/vysvetlenie/Ďalej, Ďalej prešiel na 2. otázku. Neoverené: pohľad očami na živej animácii, telefón.

## Priateľov zapína a vypína len rodič (NENASADENÉ, bez zvýšenia verzie)

- `zdroj/appka.html`: v karte Priatelia už nie je tlačidlo „Zapnúť priateľov“, len vysvetlenie „Priateľov zapína rodič“ (bez rodiča s ponukou „Vytvoriť účet rodiča“). Zmazané obslužné vetvy `socZapni` a `socVypni`. `prehladPriatelov`: s rodičom tlačidlá len v paneli rodiča (nové `data-rp-soczapni` v `rodic-panel.js`), bez rodiča len text a „Vytvoriť účet rodiča“. Existujúci zapnutí priatelia ostali, nič sa nemazalo.
- Test v `zdroj/test.js` (blok „priatelia: …“). Overené `test`, `build`; emulátor neskúšaný.
- Obchádzka: `firestore.rules` nerozlíšia dieťa od rodiča (obaja sú prihlásení účtom rodiny), preto je to len v rozhraní. Dieťa technicky vie zmeniť `profily/{id}.zapnute` cez konzolu prehliadača alebo ak rodič zámok panelu nechá odomknutý. Pravidlá sa nemenili.

## 3.6.2 – zlúčené opravy (NENASADENÉ, čaká na súhlas vlastníka priamo v session)
- Zlúčené do `main`: angličtina bez prekresľovania po odpovedi (`1f32fb5`) a priateľov zapína len rodič (`b99cf49`). Konflikty len v `ODOVZDANIE.md`. `VERZIA_APPKY` 43, `3.6.2`, cache `svet3-v6`, `NOVINKY` doplnené, `index.html` zostavený.
- Overené: `test`, `build`; emulátor 1280 px: v angličtine zlá aj správna odpoveď bez výmeny prvkov na stránke; profil dieťaťa bez rodiča nemá prepínač (text „najprv si vytvorte účet rodiča“); panel rodiča: prehľad dieťaťa má Zapnúť/Vypnúť priateľov a funguje.
- Neoverené: profil dieťaťa s rodičom očami, tablet, 360 px, staršie dieťa, vizuálne „bez poskoku“ (len kontrola DOM), `test:rules` (výstup nejasný, pravidlá sa nemenili). Konzola: len chyby spojenia z emulátora.
- **3.6.2 NASADENÉ** (hosting, pravidlá, auth), push na GitHub, záloha `Desktop\svet-za-3-minuty-3.6.2.zip`. Živý web ukazuje 3.6.2, cache `svet3-v6`; v konzole jedna 404 na nejaký zdroj (rovnaká sa objavovala aj na emulátore).

## 3.6.3 – Tento týždeň úplne hore (NENASADENÉ)
- `views.domov`: karta „Tento týždeň“ so stromom je teraz prvá, nad Misiou dňa. Verzia 44 / 3.6.3, cache `svet3-v7`, `NOVINKY`. Overené: `test`, `build`, poradie v kóde; na emulátore nevidené.
- **3.6.3 NASADENÉ**, push, záloha `Desktop\svet-za-3-minuty-3.6.3.zip`.

## 3.7 – pozadie appky v profile (NENASADENÉ)
- `POZADIA` + `Pozadie` v `zdroj/appka.html`: 6 farebných pozadí (Nebo, Ružová, Lúka, Slnko, Fialová, More), karta „Pozadie appky“ v profile Ja pod odznakmi. Mení `--fon` a `--b1..b4` (škvrny). Ukladá sa v `localStorage` kľúčom `pozadie-<id dieťaťa>`, teda len na tomto zariadení a zvlášť pre každé dieťa (do cloudu sa nesynchronizuje). Verzia 45 / 3.7, cache `svet3-v8`.
- Overené: `test`, `build`, emulátor: ťuknutie zmení premenné, škvrny a uloženie, kontrola šírky. Neoverené: farba samotného podkladu na snímke (prechod sa v skrytom paneli nedokončil), telefón/tablet, chod po výmene dieťaťa, vzhľad kariet pri jednotlivých pozadiach.
- **3.7 NASADENÉ**, push, záloha `Desktop\svet-za-3-minuty-3.7.zip`.

## 3.7.1 – plynulé pozadie (NENASADENÉ)
- Výber pozadia už neprekresľuje obrazovku (mení len premenné a `aria-pressed`). Farby `--fon`, `--b1..b4` sú registrované cez `@property` a `:root` má prechod 0,7 s, takže sa zmena plynulo prelína. Verzia 46 / 3.7.1, cache `svet3-v9`.
- Overené: `test`, `build`, emulátor: karta sa pri výbere nevymení (ten istý prvok), farba sa zmení. Neoverené: samotná plynulosť okom (pane je skrytý, medzihodnota sa nezachytila), telefón.

## 3.7.2 – bez blikania v misiách a kvízoch, Čo je nové po sovičke (NASADENÉ spolu s 3.7.1)
- Nová funkcia `morph(a, b, koren)` a `render(true)`: tiché prekreslenie porovná nový HTML s obrazovkou a zmení len rozdiely (nezmenené prvky ostanú, neprehrajú sa animácie). Používa ho Misia (zlá odpoveď, Keby, indície, výber výsledku, náročnosť) a `renderFlow(false)` (vyhodnotenie odpovede v kvíze témy). Ostatné `render()` sa nemenili.
- Okno „Čo je nové“ čaká, kým úplne zmizne `#uvod` (úvodná obrazovka so sovičkou), potom +350 ms.
- Overené: `test`, `build`, emulátor: zlá odpoveď v misii zachová banner aj tlačidlá (rovnaké prvky), pribudne `bad` a reakcia; v kvíze témy sa po odpovedi zachoval horný pás aj odpovede; Čo je nové sa objavilo bez úvodnej obrazovky. Neoverené: samotné splynutie úvodnej obrazovky a okna naživo (zachytené len stavy), iné typy misií (indície, pravda/lož), telefón.
- **3.7.1 a 3.7.2 NASADENÉ naraz**, push, záloha `Desktop\svet-za-3-minuty-3.7.2.zip`.

## 3.7.3 – téma dňa 1, misia 2 (NENASADENÉ)
- `kartaMisie` v `zdroj/appka.html`: číslo 1 = Téma dňa (tlačidlo, zvýraznená žltým a prerušovaným rámom, kým nie je prebratá; po téme zelená s ✓), číslo 2 = Misia (zamknutá a šedá „po téme dňa“, nedá sa ťuknúť, kým téma nie je hotová; potom zvýraznená a klikateľná). Čísla ostávajú vždy. Verzia 48 / 3.7.3, cache `svet3-v11`.
- Dôsledok: kým dieťa neprebralo tému dňa, nedostane sa do misie z Domova. Misia je dostupná ešte z karty na konci témy.
- Overené: `test`, `build`, emulátor (stavy pred a po téme, zamknutá karta nie je tlačidlo). Neoverené: vzhľad na snímke (panel bol skrytý), telefón.

## 3.7.3 NASADENÉ (záloha `Desktop\svet-za-3-minuty-3.7.3.zip`) a 3.7.4 – angličtina: Ďalej bez rolovania (NENASADENÉ)
- 3.7.4: po správnej odpovedi v angličtine je tlačidlo Ďalej v pevnom páse (`.ang-dalej-bar`, fixed) hneď nad dolným menu; odsadenie `.ang-pad`, výška menu sa berie z `--nav-v` (nastavuje `render()`). Pás nemá animáciu `rise` (inak by sa posunul). Verzia 49 / 3.7.4, cache `svet3-v12`.
- Overené: `test`, `build`, emulátor 390x700: tlačidlo je viditeľné bez rolovania nad menu (566 až 621, menu od 631). Neoverené: tablet, veľmi nízke obrazovky, dlhé vysvetlenie.
- **3.7.4 NASADENÉ**, push, záloha `Desktop\svet-za-3-minuty-3.7.4.zip`.

## 3.7.5 – hláška „Skús inú možnosť“ hore, Čo je nové spoľahlivejšie (NASADENÉ)
- Angličtina (`.ang-rea`) a misie (`.misia-rea`): hláška po zlej odpovedi je teraz nad odpoveďami, v stálom prázdnom mieste (prázdne sa skryje), takže nič neskáče a netreba rolovať. Odpovede ostávajú tie isté prvky (bez blikania).
- `Novinky.skontroluj`: verzia `videl-verziu` sa zapíše až keď sa okno naozaj ukáže (nie hneď), okno čaká na zmiznutie `#uvod` (po 4,5 s ho zavrie samo, po 6 s ukáže tak či tak), chyba pri zobrazení sa zaloguje. `RodicVyzva` počká na Novinky (`Novinky.caka`). `test.js` riadok 233 prispôsobený (kontroluje `Novinky.caka`).
- Príčinu, prečo okno u vlastníka „vôbec nevyskočilo“, som nenašiel istotou: v emulátore sa ukázalo (po 0,8 s s 10 položkami). Možné príčiny sú čakanie na úvodnú obrazovku alebo skoré zapísanie verzie. Ak sa ani teraz neukáže, treba zistiť, aký stav (účet, dieťa, rodič) appka má pri otvorení.
- Verzia 50 / 3.7.5, cache `svet3-v13`. Overené: `test`, `build`, emulátor (angličtina, misia, Čo je nové). Neoverené: telefón, PWA po aktualizácii.
- **3.7.5 NASADENÉ**, push, záloha `Desktop\svet-za-3-minuty-3.7.5.zip`.

## 3.7.6 – výber štýlu pozadia (NENASADENÉ)
- Karta Pozadie v profile `ja`: hore tri štýly (Animované, Jednofarebné, Jemný vzor, kreslené SVG ikony), pod nimi farby. Animované a Jemný vzor používajú pôvodných 6 tém (Nebo…More), Jednofarebné 8 pastelov (`FARBY`: Mäta, Obloha, Broskyňa, Citrón, Levanduľa, Ružová, Mrak, Večer – najhlbšia).
- Ukladanie len v localStorage na zariadení, zvlášť pre dieťa: `svet3:pozadie-styl-<id>` a `svet3:pozadie-farba-<id>` (téma ostáva `pozadie-<id>`). `firestore.rules` sa nemenili. Predvolené Animované; pri `prefers-reduced-motion` predvolene Jemný vzor.
- CSS cez `html[data-fon-styl]`: farba = `.blobs` skryté (žiadna animácia ani škvrny), vzor = škvrny skryté a čmáranice stoja. Hry: `body.hra-rezim .blobs` ostáva ako predtým.
- Pravý tmavý režim nie je: appka je zámerne svetlá (tmavý text na kartách). „Tmavý variant“ je preto Večer, hlbšia levanduľová (#DCD9F6).
- Verzia 51 / 3.7.6, cache `svet3-v14`. Overené: `test`, `build`, emulátor 390 px (výber štýlu a farby, ukladanie, kontrast textu mimo kariet na Domov/Témy/Hry/Priatelia/Ja pri Večer ≥ 4,4). Neoverené: kvízy, misia, strom, správy pri každej farbe očami, telefón, PWA po aktualizácii.

## 3.8 – oprava A: bezpečnosť a rodič (NENASADENÉ, verziu zvýši zlúčenie)
- Postavička priateľa (XSS, bugy-ucty 1): `postavicka()` v `obrazky.js` prepustí farby len ako `#RRGGBB`. `firestore.rules` má `platnyAvatar` (kľúče, typy, dĺžka, znaky) pre deti, profily aj žiadosti. Staré dokumenty s inými hodnotami by sa už nedali uložiť; ak niektoré dieťa uložilo nejakú inú hodnotu postavičky, treba to overiť na ostrej databáze.
- Pravidlá: kontrola veľkosti `poradie`/`verzia`, formát `kod`; voľné písanie (`x`) sa pošle len keď majú `pisanie` oba profily (bugy-vzhlad 1). Mŕtvy kód `pisanie()` sa teraz používa. Test: `zdroj/pravidla-test.js` (85 prípadov, prešlo).
- Formulár písania v rozhovore je len keď majú písanie zapnuté obe deti. Filter `socKontrola` (`appka.html`): nadávky aj s bodkami/číslami/opakovaním, telefón, e-mail, odkaz. Zablokovaný text sa neodošle a uloží sa na zariadení (`soc-zablok-<id>`), rodič ho vidí v prehľade dieťaťa („Zablokované správy“). Prijatá správa s nadávkou sa skryje. Filter je jednoduchý, nie dokonalý.
- Rodič: zámok sa zruší pri každom odchode z `rodic*` fáz (`Rodic.chod`), pri Späť z tvorby, pri vymazaní dieťaťa; po 5 min sa odomknutý panel sám zakryje (interval 15 s); „Odhlásiť sa“ v Nastaveniach ide cez `data-rp-odhlas` (kontrola zámku).
- PIN: počet omylov a pauza sú v `localStorage` (`rodic-pin-<uid>`), každá ďalšia séria zdvojnásobí pauzu (30 s až 1 h); nové PIN-y majú 300 000 kôl PBKDF2 (staré si nesú svoje `iter`). Vytvorenie účtu rodiča najprv overí na serveri (`getDocFromServer`), že profil neexistuje; prázdna snímka z pamäte sa ignoruje.
- Zabudnutý PIN: Google okno s `prompt: 'login'` (musí sa prihlásiť znova), pole hesla bez automatického dopĺňania. OBMEDZENIE: ak je zariadenie prihlásené účtom rodiny a dieťa pozná heslo (alebo ho dopĺňa správca hesiel), PIN sa vyresetovať dá. Úplná ochrana by si vyžadovala samostatný účet rodiča; nerieši sa.
- Nové dieťa z výberu a zmena veku existujúceho dieťaťa vyžadujú odomknutého rodiča; v Nastaveniach rodiča je pri každom dieťati „Upraviť“ (meno, vek, postavička). Mazanie dieťaťa v tvorbe tiež kontroluje zámok.
- `firebase.json`: `AGENTS.md` v `ignore`.
- Nezmenené, len obmedzenie: pravidlá nerozlišujú rodiča a dieťa (rovnaký účet), kód priateľa je uhádnuteľný (≈23 bitov). Netýka sa tejto opravy.
- Neoverené v prehliadači: celý tok v emulátore (port 5050 používal niekto iný), Google okno `prompt: login`, telefón.

## 3.8 oprava B – údaje a účty (NENASADENÉ, bez zvýšenia verzie)
- Opravené (`bugy-ucty` č. 7, 8, 9, 12, 13, 14, 16, 17, 18; `bugy-jadro` č. 4): zmazané dieťa sa nevráti zo starého `pokrok/<uid>` (príznak `pokrok-hotovo-<uid>` v localStorage, nič sa nemaže z cloudu); starý lokálny pokrok (`STARY`) dostane len prvý účet na zariadení (`stary-hotovo`); chybová obrazovka `chybaNacitania` po 12 s alebo pri chybe čítania, s „Skúsiť znova“ a „Odhlásiť sa“; „Pochváliť sa“ cez `allSettled`; `socZmaz` najprv zmaže priateľstvá na oboch stranách; zápis profilu rodiča má limit 8 s a `S2.pracuje` sa nuluje; vädnutie sa zrkadlí do localStorage (aj pri `rodicZmaz`); „videné“ podľa dieťaťa; po odhlásení sa vynuluje `st`, `rodic-neskor` je podľa uid; `prevodStareho` kontroluje, že používateľ sa nezmenil; `visibilitychange`/`pagehide` volajú `Cloud.ulozHned()`.
- Nerobené: čistenie IndexedDB po odhlásení (`terminate`/`clearIndexedDbPersistence`) – hrozí strata neodoslaných zápisov a appka by potrebovala reload. Medzizariadeniový príznak prenosu `pokrok` (pravidlá nemeniť): príznak je len lokálny.
- Neoverené v emulátore ani offline. Overené: `test`, `build`, syntax skriptov.

## 3.8 oprava C – hry a angličtina (NENASADENÉ, verzia nezvýšená)
- Nálezy z `bugy-hry.md`: opravené č. 1, 2, 3, 5, 6, 7, 8, 9, 10. Č. 4 neopravené.
- Č. 1 Sova: `mav`/`sovaStart` nereštartujú pri `zivoty <= 0`, `Hra.koniec` nastaví `beh = false`.
- Č. 2: `ang-mizne` sa zloží vždy na začiatku časovača v `Ang.dalsia` a aj v `go()`.
- Č. 3 a 5: v `Ang.otazka/veta` sa medzera nepýta pri skupinách farby, čísla, pocity a pri časových slovách okrem week, wind, birthday. Zdroj zlých možností je `W` (podľa veku), `ANG_SLOVA` len keď `W` v skupine nemá aspoň 3. Do čísel pribudli 2 ľahké vety.
- Č. 6 `manth`. Č. 7: veta o rukách má slovo `wash`, veta o prstoch `ten`.
- Č. 8: `zostav.js` robí reload po novej verzii až keď nebeží hra, kvíz ani flow (kontrola každých 5 s). Č. 9: `sw.js` v zálohe použije aj `pamat` (inú verziu súboru).
- Č. 10: Chytaj hviezdičky a Bubliny nepočítajú čas pri skrytej karte; Sova pri zmene rozmerov plátna prepočíta ihrisko.
- Č. 4 (body za angličtinu raz za deň na viacerých zariadeniach): `ang-<id>` nie je v `SYNC`; oprava chce zmenu synchronizácie (a pravdepodobne `firestore.rules`), preto nechané.
- Overené: `test`, `build`. Neoverené: emulátor, telefón, otočenie displeja, skrytá karta.
- Cache `sw.js` ostáva `svet3-v14` (verziu zvýši zlúčenie).

## 3.8 oprava D – jadro a vzhľad (bez zvýšenia verzie, nenasadené)
- Jadro (`bugy-jadro.md`): č. 1 oslava len pri víťazstve (+ ochrana `if (!box) return`), č. 2 „téma dňa prebratá“ podľa `st.kedy[t.id] === dnes`, č. 3 história dní sa ukladá do 400 (pravidlá povoľujú 400), č. 5 odznaky počítajú len témy vlastného veku bez angličtiny, č. 6 „Zahrať si ešte raz“ hrá dnešnú misiu (`dnesMisia`) a pri náhľade nič nezapisuje do `hotove`, č. 8 `dokonciAuto` nenastavuje `hnPredDnes`, č. 9 pauza kvízu sa zamkne hneď pri prehre, č. 10 skloňovanie hviezdičiek, č. 11 plávajúci text „Správne!“ namiesto „+10“, č. 12 týždeň cez `setDate`. Nerobil som č. 4 a 7.
- Vzhľad (`bugy-vzhlad.md`): č. 3 a 4 `min-width:0` (rebríček, žiadosť), č. 5 pri písaní/nízkom okne sa schovajú nálepky a vety, č. 6 `chipKontrast()` + MutationObserver pridá `.tmavy` svetlým štítkom, č. 7 `.search.bez-lupy`, č. 8 `min-height:44px` pre vety a filtre, č. 9 od 600 px sa rady zalamujú, č. 10 kreslené ikony v `obrazky.js` (odpad, obdobia), č. 11 text „sú v ťažšej úrovni“, č. 12 kód priateľa bez `maxlength` 9, č. 14 `oznacVidene` ukladá čas poslednej správy (čas servera).
- Overené: `node zdroj/test.js`, `node zdroj/zostav.js`. Neoverené: vzhľad v prehliadači (emulátor používal niekto iný), snímky 360/390 px, reálna klávesnica. Odkazy „Skúsiť tiež“ a OpenMoji (č. 8) som nemenil. `index.html` je prebuildovaný, pri zlúčení s inými vetvami ho treba zostaviť znova.

## 3.8 – zlúčenie A, B, C, D a vydanie (NASADENÉ: pravidlá aj hosting, web ukazuje 3.8; záloha zip na ploche)
- `main` = verzia 52 / 3.8 (cache `svet3-v15`), zlúčené po poradí A, B, C, D; konflikty v `appka.html` a `ODOVZDANIE.md` vyriešené ručne (importy `getDocs`+`getDocFromServer`, príznak `pokrok-hotovo`, kontrola cache pri profile rodiča, `bez-lupy`, limit 400 dní).
- NÁJDENÁ CHYBA pri skúške na emulátore: pravidlo z vetvy A `d.poradie <= 100` zamietlo každé uloženie dieťaťa (appka posiela `poradie: Date.now()`), dieťa sa neuložilo a appka sa vrátila na tvorbu. Opravené na `<= 10000000000000`, pridaný test v `pravidla-test.js` (86 z 86). BEZ TEJTO OPRAVY NENASADZOVAŤ PRAVIDLÁ.
- Overené: `test`, `build`, `test:rules` (86/86), emulátor 390 px: nový účet, vytvorenie dieťaťa, Domov, Témy, Hry, Priatelia, Ja, vytvorenie rodiča a PIN, zámok panela po odchode.
- NEOVERENÉ: existujúci účet bez rodiča, voľné písanie s filtrom, správy a priatelia (treba dva účty), angličtina bez priesvitnosti, hra Sova, pozadia, snímky, Google okno. Text na Priateľoch stále hovorí „môžu písať aj vlastné slová“, hoci písanie zapína až rodič.
- Neopravené z auditu: `bugy-ucty` 6 a 10, `bugy-hry` 4 (podľa zadania), čistenie IndexedDB po odhlásení, rodič a dieťa sú v pravidlách ten istý účet.

## Bez blikania 1 – jadro (render, spúšťače, animácie; nenasadené, verzia nezvýšená)
- Príčina: `render()` pri každom volaní zahodilo celý `main.innerHTML` (160 uzlov na domove), znova sa spustili vstupné animácie `.anim`, zmizol fokus a rozpísaný text a scroll sa orezal. Volalo ho ~58 miest (Firestore `onSnapshot` cez `prevezmi`/`socZmena`, vek, zvuky, nastavenia).
- Oprava: `render()` si značí obrazovku (`main.firstElementChild._rk` = pohľad + priateľ). Tá istá obrazovka sa prekreslí potichu cez `morph` (bez animácií, scroll, fokus aj výber ostanú). Nová obrazovka alebo `go()` (nastaví `Render.nova`) sa vykreslí celá s animáciou. Iné renderery (`renderBrana/Auto/Hra/Flow`) prepíšu `main`, takže značka zmizne sama a nič v nich sa nemenilo.
- Témy: vyhľadávací input má jeden poslucháč (`_hl`), `fillTemy` neprepisuje nezmenený zoznam, `morph` zoznam nevyprázdňuje. Chat priateľa sa pri tichom prekreslení nescrolluje nadol, ak je dieťa hore.
- Pozadie: štýl (animované/jednofarebné/vzor) sa prepína stmavením (`opacity`), nie `display:none`. Zmena farby už mala prechod (`@property`).
- `zostav.js`: nová verzia z `sw.js` obnoví stránku až keď dieťa odíde z karty (alebo 30 s nič nerobí) a nie je v hre/kvíze/písaní/bráne; predtým obnova nastala priamo pred očami.
- Počítadlo prekreslení: `Render.pocet` v konzole. Meranie (emulátor, domov, 10x `render()`): pred 160 odstránených a 160 pridaných uzlov, po 0 a 0; Témy s fokusom a scrollom: 50 -> 0 odstránených, fokus aj výber ostali.
- Neoverené: plynulosť prechodov očami (karta prehliadača bola skrytá, prechody sa nehýbali), telefón, priatelia/chat s reálnymi dátami z Firestore, reálne obnovenie po novom `sw.js`. Brány, hry, kvízy a rodič sa nemenili.

## Bez blikania 2 – kvízy, hry, Misia, angličtina (bez zvýšenia verzie, nenasadené)
- Kvíz/téma, angličtina a Misia dňa už mali plynulé vyhodnotenie (`morph`, `Ang.uprav`, `render(true)`); príčiny blikania ostali inde:
  - Hry „Koľko ich je?“ a „Hádaj tému“: po každej odpovedi sa celý obsah kola vymenil cez `innerHTML` (obrázky znova vyskočili). Teraz `obnovKolo()` v tom istom kole zmení len farbu tlačidla (`morph`), nové kolo sa vymení s jemným vyblednutím (`.kolo-nove`).
  - `render(true)` (Misia, tichá obnova) nechával na `main` triedu `anim`, takže vymenené prvky prehrali vstupnú animáciu; teraz sa trieda pred `morph` odoberie.
  - Ďalšia otázka/krok toku: horná lišta sa už nevymieňa (pruh pokroku sa plynulo posunie), `.fnext`, `.flow-pad` sa nehýbu (trieda `flow-dalej`), mení sa len obsah pod lištou.
- Overené: `test`, `build`, v prehliadači (statický server, bez prihlásenia): odpoveď v kvíze pridá len `.fbk`, `.step` ostane, lišta ostane; hra „Koľko ich je?“ nevymení pole pri zlej ani správnej odpovedi, nové kolo ho vymení.
- Neoverené: snímky v rýchlom slede, Lietajúca sova a Bubliny s počtami (nemenil som, nové bubliny sa objavia bez animácie), telefón. Emulátor na 5050 obsluhoval niekto iný, preto skúšané na vlastnom statickom serveri.

## Bez blikania 3: brány, rodič, správy (vetva claude/gifted-hellman-02b678, nad 3.8)
- Príčina: nová správa, snímka z cloudu aj klik v paneli rodiča vymieňali celý `innerHTML` (znovu sa prehrali animácie `rise` a `pop`, vynuloval sa scroll a polia).
- Nová funkcia `renderTicho()` (appka.html pri `renderBrana`): v tej istej fáze brány urobí `morph` namiesto výmeny. Použitá v PIN kroch, v paneli rodiča (potvrdenie odstránenia, zapnutie priateľov, zmena PIN), pri snímkach `rodiny/.../deti` a `rodic/profil`. Výber detí sa neprekreslí, ak sa snímka líši len metadátami (`Cloud.podpisVyberu`).
- Rozhovor: `socZmena` robí `morph` cez `#chat`, pribudne len nová bublina. Zoznam priateľov: `render(true)`. Zmena veku v profile: `render(true)`. Zmena pozadia: `morph` na rade tlačidiel.
- `RodicBrana.po()` je idempotentné (WeakSet), lebo sa volá aj po tichom prekreslení.
- Neoverené v prehliadači (na 5050 bežal cudzí emulátor). Nerobené: náhrada písma (Google Fonts `display=swap`), úvodná obrazovka, okná Novinky a Vytvor si účet rodiča (už sa plynulo objavujú cez `osIn`).

## 3.9 – zlúčenie vetiev bez blikania (NASADENÉ: hosting, pravidlá nezmenené, web ukazuje 3.9, cache svet3-v16; záloha zip na ploche)
- Zlúčené po poradí: 1 centrálne prekresľovanie (`c04d14a`), 2 kvízy/hry/angličtina (`b0c498d`), 3 brány/rodič/správy (`08e0a2c`). Konflikt v `appka.html` pri `render()` vyriešený: platí tiché prekreslenie vetvy 1, z vetvy 2 ostalo len `classList.remove('flow-dalej')`. Vetva 3 sa zlúčila bez konfliktu v kóde (`renderTicho` pre brány, `render(true)` v `socZmena`).
- `VERZIA_APPKY` 53 / `3.9`, `NOVINKY` v:53, cache `sw.js` `svet3-v16`. Pravidlá sa nemenili (`test:rules` netreba). `index.html` zostavený cez `build`.
- Overené: `test` OK; emulátor 1024 px (nový účet, dieťa): prechody Domov/Témy/Hry/Ja a prechod do účtu rodiča bez prázdnej obrazovky; opakované `render()` na tej istej obrazovke = 0 odstránených uzlov a scroll ostal; odpoveď v kvíze téme a v angličtine bez prekreslenia (po odpovedi 0 uzlov), zmena pozadia bez blikania. Konzola: len 404 `a/zoznam.json` (emulátor) a „unknown error fetching script“, nie nové.
- NEOVERENÉ: reálne snímky očami, telefón, priatelia/chat s dvoma účtami, PIN a panel rodiča s existujúcim rodičom, voľné písanie a hry podľa veku, obnova po novom `sw.js`. Skripty `spusti.cmd test` sa v tejto session zasekli na stdin, test sa spustil priamo cez `node zdroj/test.js`.
- Nasadenie až na pokyn vlastníka „nasaď 3.9“: pravidlá nie, hosting, push, záloha zip, kontrola webu.

## 4.0 A – okruh týždňa a história dní (vetva claude/verzia-4-0-a-1ce431, nenasadené, verzia nezvýšená)
- Nový súbor `tyzden.js` (zaradený do `sw.js`, `zostav.js`, `test.js`, `appka.html` za `misie.js`). Globálny objekt `Tyzden`: `okruhy()` -> `[{id,nazov,ikona}]` (prvý `zmiesany`, potom 4 `SKUPINY`: priroda, ludia, svet, veda; `ikona` je SVG reťazec), `vybrany(dieta?)`, `nastav(id,dieta?)`, `dni(dieta?)` -> 7 x `{datum,den,jeDnes,jeBudúci(aj jeBudici),temaId,hotovo}` (Po až Ne aktuálneho týždňa), `temaDna(datumISO,dieta?)` -> id, `otvor(datumISO)` (spustí `startTema`; budúci deň nepustí, vráti false).
- Téma dňa je vzorec: Zmiešaný = `TV()[číslo dňa % počet]` (rovnako ako doteraz, nič sa nemení existujúcim účtom); okruh = to isté nad témami danej oblasti. Preto je stabilná aj pre dni bez spustenia appky. `temaDna()` v appka.html teraz volá `Tyzden`.
- Ukladanie: len localStorage `svet3:tyzden-okruhy-<id dieťaťa>` (zoznam zmien `{od,id}`), bez cloudu, `firestore.rules` nezmenené. Zmena platí od dnes do nedele; minulé dni ostávajú, ako boli; od pondelka je znova Zmiešaný. Rodič to v prehľade zatiaľ nevidí (nerobené).
- Texty „Téma dňa“ do Domova dopíše session B; stará „Misia dňa“ v appka.html ostala (nesiahal som na vzhľad).
- Overené: `node zdroj/test.js` OK (nový blok TYZDEN), `zostav.js`. Neoverené: v prehliadači, telefón, zmena veku dieťaťa v strede týždňa môže zmeniť pool (témy dní sa vtedy prepočítajú). Pozn.: proces testu sa po „OK“ ešte ~100 s neukončí (pôvodný stav?).

## Verzia 4.0, časť B: nový Domov (session v40-vzhlad)

Hotové vo vetve `claude/verzia-4-0-b-e5fffa`, nenasadené, verzia sa nezvyšovala (to urobí zlučovanie 4.0).
- „Misia dňa“ sa všade volá **Téma dňa** (karta, nálepky, Novinky, odznak, sprievodca). Typy hier ostali.
- Domov: Téma dňa (hero s misiou ako časť 2) a Angličtina v spoločnom žltom bloku, potom karta **Tento týždeň** (7 dní ako tlačidlá, minulé a dnešok otvoria tému dňa, budúce sú jemne zamknuté, tlačidlo **Okruh**, séria, strom), Ďalšia odmena, Appka na ploche, karta **Objavuj** a malé odkazy Režim do auta a Odznaky.
- Nový pohľad `objavuj` (`views.objavuj`): kvízy, Iná téma, Oblasti tém a Objavujte ďalej presne ako predtým. Spodná lišta sa tvári, že je to Domov. `test.js` kontroly „Znova o“ idú na `objavuj`.
- Okno Okruh: `Okruh.ukaz()`, voľby z `Tyzden.okruhy()`, výber cez `Tyzden.nastav(id)` a jedno tiché `render(true)`.
- Rozhranie k session A: `TY()` = `window.Tyzden` alebo záložná `TyzdenZaloha` (v `appka.html` pred `views`); Domov berie dnešnú tému z `tD()` = `TY().temaDna(dnes)`. Pri zlučovaní: ak A nezmení globálne `temaDna()`, tlačidlá „Strom, Poďme na tému dňa“ a `Auto`/`Sprievodca` stále používajú staré `temaDna()`; treba ho nechať ukazovať na `Tyzden.temaDna(dnes)` (pozor na rekurziu, ak `Tyzden` volá `temaDna()`). Ikona okruhu: reťazec názvu v `IK`/`IK_KAT`, markup `<svg…` alebo funkcia.
- Neoverené: s reálnym `tyzden.js`, tablet, tmavé pozadia 3.7.x jedno po druhom, snímka „pred“ sa nerobila.

## 4.0 zlúčenie A + B (session zlúčenie 4.0, `main` `3237176`, nenasadené)
- Zlúčené A potom B. Konflikt len v `ODOVZDANIE.md` (ponechané obe časti); `index.html` znova zostavený cez `zostav.js`.
- Integrácia: záložná vrstva `TyzdenZaloha` odstránená; `TY()` = `Tyzden` (pozor: `const Tyzden` nie je `window.Tyzden`, pôvodné `window.Tyzden || Zaloha` by vždy použilo zálohu). `tD()` = `temaDna()` (objekt témy cez `Tyzden.temaDna`). `test.js` používa `Tyzden.nastav`.
- `VERZIA_APPKY` 54 / `4.0`, jedno `NOVINKY` v:54, cache `sw.js` `svet3-v17`. Pravidlá sa nemenili.
- Overené: `node zdroj/test.js` OK. Emulátor (nový účet, dieťa 5–8, 390 a 360 px): pás Tento týždeň z reálneho `Tyzden`, zmena okruhu na Príroda zmenila dnešnú aj nedeľnú tému, minulé dni ostali, Zmiešaný vrátil pôvodné; klik na pondelok otvoril jeho tému, budúci deň je zamknutý a `otvor` ho nepustí; karta Objavuj (kvíz, 4 oblasti, Objavujte ďalej); „Misia dňa“ sa v texte nikde neukazuje, Novinka sa volá „Verzia 4.0: okruh týždňa“; hotové dni sa v páse označia. Zmena okruhu = jedno tiché prekreslenie Domova. Konzola len známe 404 `a/zoznam.json` a „unknown error fetching script“.
- NEOVERENÉ: hry podľa veku a angličtina očami, pozadia, séria rýchlych snímok pri blikaní (len počet prekreslení), účet rodiča s históriou, tablet, update z živého 3.9 cez starý service worker (v emulátore pri teste s ručne podstrčeným starým `sw.js` cache zlyhala a navigácia skončila chybou, vyzerá to ako vlastnosť panela/emulátora, ale na ostrej verzii po nasadení skontrolovať, že prvé načítanie 4.0 s inštalovaným 3.9 nespadne).

## 4.0.1 opravy (session opravná, nenasadené, čaká na „nasaď 4.0.1“)
- Karta Tento týždeň je na Domove úplne prvá (nad aj nad odkazom na novú adresu). `VERZIA_APPKY` 55 / `4.0.1`, `NOVINKY` v:55, cache `svet3-v18`.
- Kvíz z angličtiny (denný, skupiny): `render()` skrýva `#top` aj `#nav` pri `st.view==='anglictina' && st.ang`, trieda `body.ang-rezim` (tlačidlo Ďalej na spodku obrazovky). Lekcie idú cez flow, tam už boli skryté. Obrazovka po dohraní: bez pruhu pokroku, tlačidlo „Späť na angličtinu“ namiesto druhého „Hotovo“.
- Texty: „Začnite sériu“ -> „Začni sériu“, oprava vety v Novinkách v41. Zvyšky „Misia dňa“ sú len v komentároch. Plný prehľad všetkých textov sa nerobil riadok po riadku.

## 4.0.2 Upgrade sprievodcu (vetva `claude/goofy-wozniak-7c880b`, nenasadené, nepushnuté)
- Dieťa (`SPR_KROKY`): nový krok Sovička Múdra, kvízik z angličtiny (`.ang-karta`), samostatný krok Strom múdrosti (`.tyzden-strom`, hviezdičky ubúdajú), texty Objavuj a Hry (podľa veku). Rodič (`SPR_RODIC`): krok angličtiny, hry s vädnutím stromu. Účet rodiča a priatelia tam už boli.
- Nové `SPR_NOVE` (krátka „Čo je nové“ prehliadka, 5 krokov) sa ponúka tlačidlom „Ukáž mi novinky“ v okne Čo je nové (len keď je v ňom NOVINKY v:55), nové účty ju nevidia. Celý sprievodca ostáva v karte Ja, dá sa zavrieť krížikom.
- `VERZIA_APPKY` 55 / `4.0.2`, NOVINKY v:55. Ak 4.0.1 tiež zvýši verziu, pri zlúčení treba prečíslovať.
- Overené: `node zdroj/test.js` OK (nový test prejde SPR_NOVE), build OK. NEOVERENÉ: emulátor a vzhľad v prehliadači, ilustrácie sú stále sovička v rôznych náladách (nové kresby sa nerobili).

## 4.1 C – Prehľad týždňa (vetva claude/nostalgic-tesla-30ff51, nenasadené, verzia nezvýšená)
- Na karte Tento týždeň nové tlačidlo **Prehľad týždňa** (`data-tyz-prehlad`) otvorí okno `TyzPrehlad` (v `appka.html` pred `views`): prechod ‹ › po týždňoch, tri súčty (Témy dňa hotové x z y, Angličtina x z y, Séria), riadok Okruh so Zmeniť (len tento týždeň; otvorí existujúce okno Okruh a po zmene sa prehľad aj Domov tiho obnovia), zoznam 7 dní: dátum, ikona témy, názov, štítok stavu (Hotovo s hviezdičkou / Dnes / Zmeškané / Čoskoro zamknuté / Pred začiatkom) a štítok Angličtina hotová/nebola. Ťuknutie na deň zavrie okno a otvorí tému (`Tyzden.otvor`).
- `Tyzden.dni(dieta, posun)` má nový voliteľný druhý parameter (0 = tento týždeň, záporné = staršie týždne); inak sa `tyzden.js` nezmenil.
- História: predošlý týždeň je dostupný, len ak existuje záznam (najstarší dátum z `st.kedy` alebo angličtiny), najviac 12 týždňov. Dni pred prvým záznamom sú „Pred začiatkom“, nie „Zmeškané“. Okruh minulých týždňov je vždy Zmiešaný (staré zmeny sa nepamätajú). „Hotovo“ = téma je v `st.done` (rovnako ako pás na Domove), takže u veľmi starej témy, čo sa neskôr zopakuje, môže byť nepresné.
- Technické: okno používa triedy `okruh-okno`/`okruh-karta` (+ `tyz-okno`/`tyz-karta`); `Okruh.ukaz` preto kontroluje `.okruh-okno:not(.tyz-okno)`. Styly `.tyz-viac`, `.tp-*` pri `.okruh-karta`.
- Testy: nový blok „prehľad týždňa“ v `zdroj/test.js` (posun týždňov, počet tlačidiel dní, stavy, súčty, história s/bez záznamu, minulý týždeň bez Zmeniť). `node zdroj/test.js` OK.
- Overené na emulátore (nový účet): 360 px a 820 px, dni so stavmi Hotovo/Zmeškané/Dnes/Čoskoro, minulý týždeň (len keď bol záznam), zmena okruhu z okna (prehľad aj Domov ukázali Prírodu), ťuknutie na deň otvorilo tému. Údaje o histórii sa nastavili ručne cez konzolu (`st.done`, `st.kedy`).
- NEOVERENÉ: skutočná história po dňoch používania, séria v súčte po skutočnom dokončení, čítačka obrazovky, ťuknutie cez telefón, zlúčenie s ostatnými úlohami 4.1 (A, B, D) – možné konflikty v `appka.html` pri `kartaTyzden` a v `ODOVZDANIE.md`.

## 4.1 D – textové pretekanie (vetva claude/determined-herschel-276252, nenasadené, verzia nezmenená)
- Jeden CSS blok „4.1 D“ na konci `<style>` v `appka.html` (bez zmien v JS): `overflow-wrap:anywhere` pre nadpisy, `.btn`, `.chip`, odpovede kvízu, správy; `.deti` na `minmax(0,1fr)` + meno dieťaťa vo výbere orezané na 2 riadky (`line-clamp`); `.prof-meno` (profil Ja) s `min-width:0`; hlavička rozhovoru, `.dm-kto`, `.konv-t b` s tromi bodkami; `.chip` max 100 %. Už existovalo: orezanie v hlavičke Domova (`.hi b`), rebríčku, príbehoch, žiadostiach.
- Limit mena: vstup dieťaťa `maxlength=20` už bol, cloud/profil/rodič rezú na 20 (`slice(0,20)`); existujúce dlhšie mená sa len zalomia/orežú vizuálne. `test.js`: nový blok kontroluje maxlength 10–20 a prítomnosť pravidiel.
- Overené: `node zdroj/test.js` OK, `zostav.js` (index.html zostavený). NEOVERENÉ v prehliadači: navigácia vstavaného prehliadača na lokálny server bola zamietnutá, takže extrémne mená (40 znakov, bez medzier, diakritika) na 360 px a tablete nikto očami neskúšal. Nepreverené: okno rodiča, okno Týždeň, výsledky hier, dlhé anglické slová.

## 4.1 A vibrácie (vetva claude/wonderful-shtern-593446, nenasadené, verzia nezmenená)
- `Haptika` v `appka.html` (pred čítaním nahlas): vzory tuk/spravne/nespravne/hotovo/hviezdicka, `Haptika.hraj(vzor|pole)`, kontrola `navigator.vibrate`, prepínač `S.get('vibracie', true)` a `prefers-reduced-motion`. Staré `vibruj(...)` volania idú cez Haptiku (bzučanie skrátené na max. 60 ms).
- Prepínač „Vibrácie“ je v paneli rodiča (`rodic-panel.js`, karta pod hlasom), tlačidlo `data-vibracie`, uložené v zariadení.
- Doplnené správne odpovede v hrách a kvíze; test v `zdroj/test.js` (bez vibrate, vypnuté, reduced-motion).
- NEOVERENÉ: skutočný telefón (Android), vzhľad prepínača v paneli rodiča.

## 4.1 B: nové hry pre každý vek (session v41-hry, vetva `claude/loving-hypatia-cb1134`, nenasadené, verzia sa nemenila)
- Päť nových hier na spoločnom „kvízovom motore“ (`KV_HRY`, `kvHtml`, `Hra.kv`, `obnovKv` v `appka.html`; kolo = prompt, možnosti, poradie správnych ťuknutí; po ťuknutí sa mení len kolo cez `obnovKolo`/morph, bez prekreslenia obrazovky).
- Mladšie deti (bez čítania, bez časovača): **Ktorý je iný?** (180 b.), **Nájdi tieň** (350 b.). Obe vekové skupiny: **Zoraď čísla** (450, mladší 1–10, starší do 99, aj zostupne), **Čo bude ďalej?** (500, vzory farieb a tvarov, ľahké pre mladších, ťažšie pre starších). Starší: **Poskladaj slovo** (650, slová z `KV_SLOVA` podľa obrázka témy).
- Zaregistrované v `HRY` (zoznam, výber podľa veku cez `len`), `OBR_HRY`, `rekordText`, `stavHry`, `vysledokHry`, klik `data-kv`. Body = „hneď správne z 6“ ako pri Koľko ich je?. Odznak „Majster hier“ počíta nové hry automaticky.
- Test: nový blok `NOVE_HRY_41` v `test.js`, upravený riadok `nove hry`. Celý `node zdroj/test.js` trvá ~100 s.
- Doplniť pri zlučovaní: `NOVINKY`, verzia, cache `sw.js`. Neoverené na telefóne.

## 4.1 zlúčenie (session wonderful-haslett, nenasadené, nepushnuté, čaká na „nasaď 4.1“)
- Zlúčených šesť vetiev v poradí 4.0.1, 4.0.2, 4.1 C, D, A, B (merge commity). Konflikty: `VERZIA_APPKY`/NOVINKY (4.0.1 vs 4.0.2), text „Začni/Začnite sériu“ vedľa tlačidla Prehľad týždňa (zostalo tlačidlo z C a „Začni“), `test.js` (D a A pridali bloky, ostali oba), `ODOVZDANIE.md` a `index.html` (vždy znovu `build`). Hry, Haptika a pás Týždeň sa v kóde nehádajú (každé má vlastné miesto, test prešiel).
- Verzia: `VERZIA_APPKY` 56 / `4.1`, nová novinka v:56, 4.0.1 a 4.0.2 ostali ako v:55, tlačidlo „Ukáž mi novinky“ sa ukáže od v:55, cache `svet3-v19`.
- Oprava navyše: `.hi > div { min-width: 0 }`, dlhé meno v hlavičke sa orezáva trojbodkou (predtým pretekalo).
- Overené: `zdroj\spusti.cmd test` OK, emulátor (Domov s Týždňom hore, Prehľad týždňa, sprievodca, nové hry iný/tieň/poradie/rad pre 5–8 a slovo/poradie/rad pre 9–12, angličtina bez hornej lišty, meno max. 20 znakov, 360 px a tablet bez horizontálneho posuvu).
- NEOVERENÉ: vibrácie len na skutočnom telefóne, hranie hier celé dokola, panel rodiča s prepínačom vibrácií (PIN), vizuálne blikanie len cez chybové hlásenia, nie očami.
- Pozor: prehliadač v paneli držal starý cache (svet3-v17), pred skúškou zmazať service worker a `caches`.

## 4.3 Vynechané dni na precvičenie (vetva `claude/peaceful-germain-9a639d`, nenasadené, nepushnuté, čaká na „nasaď 4.3“)
- Jeden príznak `precvic` na aktivite (`st.flow`, `st.auto`, `st.ang`, `st.misia`) a objekt `Precvic` v `appka.html` (pri `denCislo`): `je`, `teraz()`, `stitok()` („Len na precvičenie“, `.chip.tmavy`), `prazdne()`, `poznamka()`. Body idú cez `pripisBody(n)`, ktoré pri precvičovaní nič nepripíše. Nastavuje ho `Tyzden.otvor(iso)` (`tyzden.js`): minulý deň, ktorého téma nie je v `st.done`. Dnešok a už hotová téma sa správajú ako doteraz (opakovanie s menej bodmi).
- Precvičovanie nemení `st.body`, `st.done`, `st.kedy`, `st.dni` (séria, strom, hnitie), odznaky ani odmeny, ani oslavu stromu, ani konfety výsledku. `dokonci(f)` a `dokonciAuto` skončia hneď s prázdnym výsledkom. Auto (do auta) dedí príznak z témy, nepokračuje automaticky ďalšou témou.
- Obrazovky: štítok a veta „Len na precvičenie: nedostaneš hviezdičky…“ v úvode témy, záver „Dobre si si to zopakoval“ (téma, auto, angličtina); Haptika pri správnej odpovedi ostáva len ‚spravne‘, nie ‚hotovo‘.
- Angličtina zo zmeškaného dňa: v Prehľade týždňa pod zmeškaným dňom bez angličtiny tlačidlo „Angličtina z D. M.: len na precvičenie“ (`data-tp-ang`, `Ang.klik({angPrec})`, otázky podľa dňa cez `Ang.nova(…, den, true)`). Nezapíše sa do `Ang.data()`.
- Misie: z minulého dňa sa neotvárajú; `Misie.dokonci` už rešpektuje aj `precvic` (spolu s `nahliad`). Hry a kvízy sa podľa dňa neotvárajú, preto sa nemenili (žiadne body za hry).
- Verzia: `VERZIA_APPKY` 57 / `4.3`, `NOVINKY` v:57, cache `svet3-v20`. Test: nový blok „PRECVICOVANIE“ v `test.js` (tému, auto, angličtinu, pripisBody, dnešok, Oslava.treba). `zdroj\spusti.cmd test` OK (trvá ~6 min), build OK.
- Pri zlúčení s 4.2 (`claude/busy-varahamihira-cd48c6`) skontrolovať: číslo verzie a `NOVINKY` (4.2 asi tiež zvyšuje, treba prečíslovať), cache `sw.js`; `startTema(id, precvic)` (nový druhý parameter) a `dokonci(f)`/`koniec` krok v `krok()` ak 4.2 mení záver témy; `Ang.nova` má nové parametre `den`, `precvic`; ak 4.2 pridáva nové miesta, kde sa pripisujú body alebo zapisuje séria/strom, musia ísť cez `pripisBody` a pri `Precvic.teraz()` sa vynechať. Nová hra Strom v lístí sa nemá odmieňať pri precvičovaní, ak by sa dala otvoriť zo dňa.
- Overené na lokálnom serveri (statický, port 5051; emulátor 5050 bol obsadený iným procesom, preto auth/firestore nepoužité a stav nastavený cez konzolu): 360 px a tablet, ťuknutie na minulý deň, celá téma, záver bez konfet a bez zmeny stavu, Prehľad s tlačidlom angličtiny, angličtina do konca bez zápisu.
- NEOVERENÉ: skutočný účet (prihlásenie, cloud), auto režim hlasom očami, telefón, tmavé pozadia, séria rýchlych snímok pri blikaní (len očami nie, bez merania `Render.pocet`).

## 4.2 (session „busy-varahamihira“, vetva `claude/busy-varahamihira-cd48c6`, nenasadené, nepushnuté, čaká na „nasaď“)
- **Hra:** „Čo bude ďalej?“ (`rad`, `KV_HRY.rad`) zmazaná, namiesto nej **Ťukaj krtkov** (id `krtko`, cena 500, obe vekové skupiny): 9 dier, 30 s, krtko +1, zlatý +3, bez trestov; starší ich majú rýchlejšie a občas dvaja naraz. Vlastné kresby `KRT_OBR`, `KRT_ZLATY`, `OBR_HRY.krtko`; vibrácie cez `Haptika` (`tuk`, `hviezdicka`). Kód `Hra.krtkoStart/krtkoVysun/krt`, CSS „ťukaj krtkov“.
- **Týždeň:** karta Tento týždeň už nie je na Domove. V hornej lište je tlačidlo-stromček `#tyz-strom` (`TyzStrom`, pred `Okruh`): tmavý a spiaci (`.spi`, „z“), kým dnešná téma nie je hotová; farebný s plodmi, iskrami a zelenou bodkovanou obrúčkou (`.hotovo`), keď je hotová. Len na Domove (v angličtine je lišta skrytá, dlhé meno je orezané, 360 px overené). Ťuknutie otvorí okno `.tyzs-okno`: karta `kartaTyzden()` vyrastie zo stromčeka (`--dx/--dy`, `tyzsIn`), obsahuje dni, Okruh, Prehľad týždňa, sériu a strom múdrosti; ťuknutie na deň okno zavrie a otvorí tému. Sprievodca (`SPR_KROKY`, `SPR_RODIC`, `SPR_NOVE`) ukazuje na `#tyz-strom`.
- **Po téme:** `.win-krat`: menšia sovička a hviezdy, jedno hlavné tlačidlo (kým misia čaká: karta misie s „Pokračovať misiou!“, inak „Ďalšia téma“) a „Späť domov“. Odmeny sú v rozbaľovacom riadku `.win-odm` (otvorený len pri jednej), misia po splnení, Pochváliť sa a súvisiace témy v riadku „Viac“. Výška obrazovky na 360 px ~1,5 obrazovky.
- `VERZIA_APPKY` 57 / `4.2`, NOVINKY v:57, cache `svet3-v20`. `test.js`: bloky `KRTKO_42`, `KONIEC_TEMY_42`, upravené testy domova, sprievodcu a nových hier.
- Overené: `node zdroj/test.js` vypíše OK (proces potom visí aj na pôvodnej 4.1, preto spúšťať s `timeout`), build OK, prehliadač (vlastný statický server na 5051 + bežiace auth/firestore emulátory): 360 px a tablet, tmavý aj farebný stromček, okno týždňa, dlhé meno, hra Ťukaj krtkov aj výsledok, obrazovka po téme.
- NEOVERENÉ: vibrácie a plynulosť animácií na skutočnom telefóne, sprievodca očami (nové ciele), hra v hĺbke (dlhé hranie), update z 4.1 cez starý service worker.

## 4.2.1 doladenie (tá istá vetva, commit po 4.2)
- Stromček v lište väčší (54 px, žiarivý keď je hotovo). Meno v hlavičke sa nikdy neorezáva (zalamuje sa aj na 3 riadky, podnadpis „Svet za 3 minúty“ skrytý). Tlačidlo zvuku je na Domove skryté (inde ostalo).
- Ťažšie hry pre 9–12: Zoraď čísla 5–6 čísel do 999, Poskladaj slovo len dlhšie slová (6+ písmen), Ťukaj krtkov oveľa rýchlejší (2–3 naraz, kratší čas, menej zlatých). Cache `svet3-v21`, názov verzie 4.2.1.

## 4.3 + 4.2.1 zlúčené (verzia 58 / 4.3, cache svet3-v22)
- Zlúčená vetva 4.2 (`claude/busy-varahamihira-cd48c6`) do 4.3. Konflikty len vo verzii, NOVINKY (4.2 ostáva v:57, 4.3 je v:58), `sw.js`, `ODOVZDANIE.md`; `index.html` znova zostavený.

## 4.4 Strom po téme dňa (verzia 59 / 4.4, cache svet3-v23; vetva `claude/hopeful-kirch-4078e9`, nenasadené, nepushnuté, čaká na „nasaď 4.4“)
- Animácia stromu je jediná: `Oslava` (veľká oslava pred záverom témy, volaná v `data-dalej` pri kroku `koniec`, výsledok a karta misie sa ukážu až po „Pokračovať“). Okno stromu (`Strom.ukaz`) a stromček v lište (`TyzStrom`) sa animujú len po ťuknutí dieťaťa, nie pri odmenách.
- Zmena: `Oslava.treba(f)` platí len pre `typ === 'tema'`, `f.id === temaDna().id`, nie precvičovanie, aspoň jedna správna odpoveď a ešte neukázané dnes (príznak `oslava-<dieťa>`). Predtým sa ukázala aj po kvíze alebo inej téme a po kvíze pred témou dňa sa už nikdy neukázala.
- Test: blok `STROM_44` v `test.js` (téma dňa áno; kvíz, iná téma, precvičovanie, samé zlé odpovede nie; po kvíze dnes ešte áno; druhýkrát nie). `zdroj\spusti.cmd test` OK, build OK.
- NEOVERENÉ: emulátor (worktree nemá `node_modules`, preto nespustený), poradie téma → strom → misia očami, 360 px a tablet, plynulosť. Okrajový prípad: ak dieťa najprv dohrá kvíz, strom o stupeň vyrastie potichu už tam a oslava po téme dňa to ukáže len ako novú sériu.

### 4.4 rozšírenie (tá istá vetva a verzia 59 / 4.4)
- Okno stromu: `Strom.ukaz()` zavrie všetky `.okruh-okno` (pás týždňa `.tyzs-okno`, Prehľad týždňa, okruh), aby sa neprekrývali.
- Pás stromu na Domove (`Pripomienka.html()`, `.strom-pas`, hneď nad „Dnes“): vždy ukáže stav stromu (Strom rastie / Strom schne) a stupeň; ťuknutím sa otvorí strom. Keď je čo povedať, v ňom je aj pripomienka s krížikom: „Tvoja séria N dní padne, ak dnes nezahráš“ (séria > 0), „Strom schne…“ (hnitie), „Strom začne schnúť, ak dnes nezahráš“ (pri 2 vynechaných dňoch a zapnutom vädnutí), inak „Dnes ešte nebola žiadna lekcia“ (len ak dieťa už niekedy hralo). Nie pri precvičovaní, nie keď je dnešok alebo téma dňa hotová. Zavretie sa pamätá na deň (`pripomienka-<dieťa>` cez `S`), tlačidlo `data-prip-zavri`.
- Ikona `stromIkona('rastie'|'schne')`; stromček v lište je väčší (58 px, 52 px na 360) a pri vädnutí žltý s padajúcim listom (`.tyz-strom.schne`).
- Test: blok `PRIPOMIENKA_44`. Overené na statickom serveri (port 5052, emulátor mal obsadené porty iná session): 360 px a tablet bez horizontálneho posuvu, okno týždňa sa pri strome zavrie, schnutie, zavretie pripomienky, hotový deň bez pripomienky.
- NEOVERENÉ: celý emulátor s účtom, poradie téma → strom → misia na živej téme, očami animácie (kývanie, padajúci list), tmavé pozadia.
- Oprava po pokyne vlastníka: stromček v lište je polkruh (pílulka, `.tyz-strom` min. 84 px, 76 px na 360) s ikonou stromu a počtom dní série `.ts-pocet` (hodnota `seria()`); stav hotovo/spí/schne ostáva farbou. Veľký pás stromu na Domove sa ukazuje len keď je pripomienka (inak `Pripomienka.html()` vráti prázdno). Overené na 360 px s dlhým menom (bez posuvu).
- Typografia (4.4): pozdrav v hlavičke je dva riadky („Ahoj,“ a pod ním meno). Príčina rozdeleného mena: písmená boli samostatné `inline-block`, medzi ktorými sa dá zalomiť; teraz je každé slovo v `.pz-s` (nedeliteľné) a `fitPozdrav()` meno zmenší (min. 12 px), pri viacerých slovách zalomí len medzi slovami. Globálne: `overflow-wrap: anywhere` → `break-word` pri nadpisoch, tlačidlách, štítkoch; `text-wrap: balance` pri nadpisoch/tlačidlách, `pretty` pri odsekoch. Test `meno` upravený (akceptuje break-word). Overené 360 px (Alex, Maximiliánovič, štyri mená v jednom). NEOVERENÉ: tablet po tejto zmene, všetky obrazovky očami (len kontrola posuvu v Domov/Hry/Priatelia/Odznaky).

## 4.5 Nová hra „Čo je iné?“ (verzia 60 / 4.5, cache svet3-v24; vetva `claude/amazing-carson-adaf15`, vychádza zo 4.4, nenasadené, nepushnuté, čaká na „nasaď 4.5“)
- Hra `ine` (`HRY`, cena 600, obe vekové skupiny, `KV_HRY.ine`): 6 kôl, 4 obrázky s menovkou, tri patria k sebe, ťukne sa na iný. Po správnej odpovedi sa pod voľbami ukáže vysvetľujúca veta (`.kv-vysv`, miesto je rezervované, nič neskáče); pauza 2,4 s (3,2 s pre starších). Zlé ťuknutie len zčervená, bod za kolo sa stratí. Haptika pri správnom kole je teraz pre všetky `KV_HRY`.
- Dáta a kresby v `obrazky.js` (na konci): `INE_OBR` (116 vyfarbených kresieb 48 × 48, kľúč = slovo na menovke), `INE_SADY` (49 sád: 22 `m` pre menších s jasnými rozdielmi, 27 `s` pre starších s jemnejšími kategóriami: cicavec/vták/ryba, ovocie/zelenina, planéta/hviezda/Mesiac, nástroj/hudobný nástroj, rastlina/živočích/huba, hmyz/pavúk, plazy/žaba, ihličnaté/listnaté…). Nová sada = riadok v `INE_SADY` (+ kresba v `INE_OBR`, ak chýba).
- Sady sa miešajú, pozície premiešané, posledné použité sady si appka pamätá (`ine-bolo-m|s` cez `S`), takže sa neopakujú, kým sú nové. Režim precvičovania sa hier netýka (hry nedávajú body ani hviezdičky).
- Test: blok `INE_45` v `test.js` (aspoň 40 sád, 4 rôzne voľby, 1 správna, bez duplicít, všetky kresby existujú a sú vyfarbené, výber podľa veku, bez opakovania v hre, zlá a správna odpoveď, vysvetlenie). Upravený test `NOVE_HRY_41` (zoznam hier podľa veku). `test` OK, build OK.
- Overené: kontaktný list všetkých kresieb (Edge headless), hra pre mladšie aj starších s chybnou aj správnou odpoveďou (snímka, okno 500 px). Niektoré kresby som po prvom pohľade prekreslil (jašterica, škorpión, ťava, sandál).
- NEOVERENÉ: emulátor a skutočný účet (worktree nemá `node_modules`, vstavaný prehliadač sa nedal otvoriť), 360 px a tablet očami v reálnom prehliadači, telefón (vibrácie, plynulosť), dostupnosť pre čítačky. Sandál a škorpión sú najslabšie kresby, prípadne prekresliť.
