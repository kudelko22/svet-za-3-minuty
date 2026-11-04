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

Hotové (4. 11. 2026, nenasadené, čaká na schválenie vlastníka): nová sekcia Misia dňa. Karta na Domove vedie na obrazovku `misia`
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
