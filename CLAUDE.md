# Svet za 3 minúty: pravidlá pre vývoj

Appka pre rodiča a dieťa: krátke témy o svete, kvízy, sovička Múdra, hry, postavička, priatelia. Autor Alex Kúdela.
Beží na https://svet-za-3-minuty.web.app (Firebase projekt `svet-za-3-minuty`, plán Spark). Repozitár je **verejný**.

**Toto nie je Metlina.** Pravidlá Metliny (`Documents\Metlina\CLAUDE.md`) tu neplatia a Metlina sa tu nerieši.

## Pevné pravidlá

- Rozhranie po slovensky. Deti čítajú samy, preto v appke nepísať „pre väčšie deti“ (odsek sa volá „Do hĺbky“).
- Na dizajne veľmi záleží: kreslený štýl, farby, animácie. V ovládaní a v obrázkoch tém žiadne emoji
  (kreslené ikony, vlastné kresby; OpenMoji len v odpovediach kvízov).
- Písmo Fredoka nemá č, ť, ľ, ď, ň, nepoužívať. Na svetlých štítkoch `.chip` tmavý text.
- Žiadne tajné údaje v gite. Kľúč k hlasu je mimo repozitára.
- Šetriť kreditmi: veci robiť naraz, krátke kontroly, žiadne zbytočné kolá.

## Postup pri zmene

1. Upravovať `zdroj/appka.html`, `temy.js`, `obrazky.js`. `index.html` neupravovať ručne.
2. `node zdroj/test.js`, potom `node zdroj/zostav.js` (vytvorí `index.html`).
3. Pri zmene `firestore.rules`: `node zdroj/pravidla-test.js` (beží emulátor, knižnice berie z `..\Metlina\node_modules`,
   maže dáta emulátora).
4. Zvýšiť `VERZIA_APPKY` a `VERZIA_NAZOV`, doplniť `NOVINKY`.
5. Skúšať na emulátore (`demo-svet-za-3-minuty`, porty 9199, 8180, 5050; otvárať `127.0.0.1:5050`), nie ostrými účtami.
6. Commit a push. Nasadenie: `firebase deploy --only hosting,firestore:rules,auth` (CLI z `..\Metlina\node_modules\.bin`).
   V `firebase.json` musí byť `.git/**` v ignore. Po práci záloha zip na plochu (`tar.exe -a`).

## Sessions

- Na tejto appke sa pracuje v session otvorenej v priečinku `Documents\svet-za-3-minuty`, nie v Metline.
- Každá nová funkcia, ktorá stojí sama o sebe, ide do novej session. V tej istej ostáva oprava, doladenie,
  skúšanie, commit a nasadenie práve urobenej veci.
- Pred novou session commit, aby začínala z čistého stavu. Naraz mení kód len jedna session.
