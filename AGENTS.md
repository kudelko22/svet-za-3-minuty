# Svet za 3 minúty: pravidlá pre vývoj

Appka pre rodiča a dieťa: krátke témy o svete, kvízy, sovička Múdra, hry, postavička, priatelia. Autor Alex Kúdela.
Beží na https://svet-za-3-minuty.web.app (Firebase projekt `svet-za-3-minuty`, plán Spark). Repozitár je **verejný**.

**Toto nie je Metlina.** Pravidlá Metliny (`Documents\Metlina\AGENTS.md`) tu neplatia a Metlina sa tu nerieši.

## Pevné pravidlá

- Rozhranie po slovensky. Deti čítajú samy, preto v appke nepísať „pre väčšie deti“ (odsek sa volá „Do hĺbky“).
- Na dizajne veľmi záleží: kreslený štýl, farby, animácie. V ovládaní a v obrázkoch tém žiadne emoji
  (kreslené ikony, vlastné kresby; OpenMoji len v odpovediach kvízov).
- Písmo Fredoka nemá č, ť, ľ, ď, ň, nepoužívať. Na svetlých štítkoch `.chip` tmavý text.
- Žiadne tajné údaje v gite. Kľúč k hlasu je mimo repozitára.
- Šetriť kreditmi: veci robiť naraz, krátke kontroly, žiadne zbytočné kolá.

## Postup pri zmene

1. Upravovať `zdroj/appka.html`, `temy.js`, `obrazky.js`. `index.html` neupravovať ručne.
2. `zdroj\spusti.cmd test`, potom `zdroj\spusti.cmd build` (vytvorí `index.html`).
3. Pri zmene `firestore.rules`: `zdroj\spusti.cmd test:rules` (sám spustí emulátor, maže len jeho dáta).
4. Zvýšiť `VERZIA_APPKY` a `VERZIA_NAZOV`, doplniť `NOVINKY`.
5. Skúšať na emulátore: `zdroj\spusti.cmd emulator` (`demo-svet-za-3-minuty`, porty 9199, 8180, 5050; otvárať
   `127.0.0.1:5050`), nie ostrými účtami.
6. Commit a push. Nasadenie: `zdroj\spusti.cmd deploy`. Na web ide celý priečinok, preto nový súbor, ktorý tam nepatrí,
   treba dopísať do `ignore` v `firebase.json`. Po práci záloha zip na plochu (`tar.exe -a`).

## Nástroje

Všetko je vo vlastnom `node_modules` tohto priečinka (`package.json`, vytvorí `npm install`), nič sa neberie z Metliny.
Node a Java nie sú v PATH, `zdroj\spusti.cmd` si ich nastaví sám. PowerShell skripty sú zablokované, používajú sa `.cmd`.
Windows má zapnutý Smart App Control: blokuje nepodpísané natívne súbory, nastavenie nemeniť.

## Sessions

- Na tejto appke sa pracuje v session otvorenej v priečinku `Documents\svet-za-3-minuty`, nie v Metline.
- Každá nová funkcia, ktorá stojí sama o sebe, ide do novej session. V tej istej ostáva oprava, doladenie,
  skúšanie, commit a nasadenie práve urobenej veci.
- Pred novou session commit, aby začínala z čistého stavu. Na konci session doplniť svoju časť v `ODOVZDANIE.md`,
  aby ďalšia vedela, kde sme. Naraz mení kód len jedna session.
- Hlavná session je **AKTUÁLNY STAV APLIKÁCIE**: prehľad o stave, postupe a optimalizácii, vlastník tu rozhoduje a odtiaľto sa
  spúšťajú nové sessions. Kód sa v nej nemení. Práca ide do session **Vývoj** alebo do session svojej témy.
- Šetriť limit je trvalá priorita. Session nad 200 tisíc tokenov kontextu (`get_usage`) sa na konci úlohy vymení: commit, svoja časť
  v `ODOVZDANIE.md`, nová session s tým istým názvom, ktorá číta len tú časť, a archivovať starú. Dlhé sessions nebudiť pre maličkosti.
  Novú session na tému spúšťať, až keď je pre ňu práca. Bežná práca Sonnet a stredné úsilie, Opus len na ťažké rozhodnutia.
