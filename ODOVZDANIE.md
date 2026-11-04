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
