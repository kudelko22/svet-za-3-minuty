# Angličtina 5.1: úprava obsahu

Vetva: `claude/v51-anglictina-6c583e`. Dáta sú v `anglictina.js` (slová `ANG_SLOVA`, vety `ANG_VETY`), test v `zdroj/test.js`.

## Štandard
Britská angličtina (colour, grey, neighbour, theatre, maths, pyjamas, mum, football, autumn, plane, yoghurt). Test stráži najčastejšie americké tvary.

## Čo je hotové
Pôvodne 778 slov a 325 viet (po prechode celého súboru: väčšina bola v poriadku).
- Opravené (14 zásahov): čítanie `mouth` (mauth, kvôli zhode s `mouse`), `window` (windou), `river` (rivr, aj v lekcii V prírode), `potato` (potejtou); `airplane` na `plane` (britsky, aj veta); `goodnight` na dve slová `good night`; `journey` ako „dlhá cesta“; veta „Opica je banán“ (dalo sa čítať ako „je“ = „is“) na „Opica papá banán“; „Odbočte vľavo“ na „Odboč vľavo“ (oslovenie dieťaťa).
- Pridané: 51 slov (pozdravy, zámená, rodina a domov, čísla 17 až 80 a milión, ročné obdobia, počasie, škola, telo, slovesá like/have/meet/share, predložky with/from/to/at) a 71 viet (pozdravy, rodina, škola, jedlo, zvieratá, farby, čísla, počasie, telo, domov, predložky, pocity). Spolu teraz 829 slov a 396 viet.
- Test (`zdroj/test.js`, blok ANGLICTINA): žiadne prázdne ani ošetrené medzery, povolené znaky v en, sk a čítaní, vety začínajú veľkým písmenom a končia interpunkciou, žiadne americké tvary, žiadny rovnaký slovenský preklad vety. Pôvodné kontroly (duplicitné slová a vety, veta obsahuje svoje slovo, skupiny, obtiažnosť) ostávajú.

## Príklady pred a po
- `mouth` čítaj `maus` -> `mauth`; `potato` `poteitou` -> `potejtou`
- `airplane` -> `plane`; `goodnight` -> `good night`
- „Opica je banán.“ -> „Opica papá banán.“

## Uloženie postupu
Postup sa ukladá len ako dni a počty skupín (`ang-<dieta>`), nie podľa textu slova, takže zmeny ničomu neuškodia. Kľúče a id lekcií sa nemenili.

## Čo ostalo
- Slovo `orange` je len ako jedlo (farba oranžová sa nedá pridať, test vyžaduje jedinečné anglické slovo).
- `mum`/`dad` samostatne nie sú (slovenský preklad `mama`/`otec` by sa zdvojil).
- Priradenie skupín som nechal (napr. `ice` a `air` vo Vesmíre a svete), je zrozumiteľné.
- Obsah sa nečítal nahlas po jednom: čítanie je zjednodušená slovenská výslovnosť. Živá kontrola na 360 px sa nerobila (zmena je len v dátach, kvízový kód sa nemenil).

## Návrh vety do NOVINKY
„Angličtina má viac slov a viet (pozdravy, rodina, škola, jedlo, počasie) a pár opravených čítaní.“
