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

- **64 odznakov** za témy, sériu dní, body, hry, obľúbené témy a „Majster“ za každú kategóriu (podrobne nižšie).
- **Diely postavičky za body:** veselé farby vlasov, okuliare, obrázky na tričko, klobúky a zvieratko na pleci
  (od 60 do 1350 bodov, cenník je `ODOMKNI` v `obrazky.js`). Od verzie 13 aj 6 nových účesov, nové farby,
  motýlik, kravata, šál, náhrdelník, zvieratká zajko, tučniak a líška a ďalšie okuliare a čiapky.
- **Mýtické veci** od 1600 do 5000 bodov: čarovné iskry, motýlie, anjelské a dračie krídla, zlatá a dúhová žiara
  (diel „Kúzlo“), svätožiara, dráčik, fénix a cisárska koruna. Domovská obrazovka ukazuje ďalšiu odmenu
  a na konci témy sa oslavujú nové odznaky aj odomknuté veci.

## Režim do auta

- Na domovskej obrazovke je veľká modrá karta **Režim do auta** a v úvode každej témy tlačidlo
  **Celú tému nahlas**. Jedno ťuknutie a appka prečíta tému, odsek pre väčšie deti, príklad,
  otázky na rozhovor (po každej 12 sekúnd na odpoveď) aj kvíz (otázka, možnosti, 8 sekúnd, správna odpoveď).
- Na tmavej obrazovke svieti práve čítaná veta. Veľké tlačidlá: ⏮ znova, ⏸ pauza, ⏭ ďalšia časť, ✕ koniec.
- Na konci appka pripíše body, oznámi nové odznaky a o 10 sekúnd sama spustí ďalšiu neprebratú tému
  (dá sa vypnúť prepínačom).
- Obrazovka počas čítania nezhasne. Keď sa appka schová (iná aplikácia, zamknutý telefón), čítanie sa pozastaví.
- Hlas: appka vyberie najkrajší slovenský hlas v telefóne. V profile (Ja → Hlas na čítanie) sa dá vybrať iný
  a appka poradí, ako si stiahnuť krajší hlas zadarmo (iPhone: Laura vylepšený).

## Hry

Za body z tém sa odomykajú hry (karta **Hry** v spodnom menu). Hraním sa body neminú, rekordy sa pamätajú
v telefóne pre každé dieťa zvlášť.

- **Pexeso** (od 150 bodov): dvojice obrázkov z tém, 12 kariet pre menšie deti, 16 pre väčšie.
- **Hádaj tému** (od 250 bodov): 8 obrázkov, ku každému sa vyberá správny názov témy.
- **Lietajúca sova** (od 300 bodov): ťukaním sovička mávne krídlami a letí pomedzi ceruzky; bod za každú prekážku
  aj chytenú hviezdu. Menšie deti majú 3 srdiečka, väčšiu medzeru a pomalší let, väčšie 2 srdiečka.
- **Chytaj hviezdičky** (od 400 bodov): 30 sekúnd, hviezda +1, oranžová +3, búrka −2.
- **Opakuj po mne** (od 550 bodov): farby zasvietia a zahrajú tón, dieťa ich zopakuje; každé kolo o jednu viac.
- **Bubliny s počtami** (od 700 bodov): minúta príkladov, menšie deti do 10, väčšie do 50 a malá násobilka.
  Zlá bublina zoberie jeden bod hry.
- **Skladačka** (od 900 bodov): poprehadzovaný obrázok z témy, ťuknutím sa vymenia dva dieliky.

## Odznaky

64 odznakov v skupinách Témy, Dni a séria, Body, Hry, Rôzne a Majster kategórie (zoznam `ODZNAKY` v index.html).
Za hry sa dávajú po dohraní hry (prvá hra, 10 a 50 hier, výsledky v jednotlivých hrách). V profile je len karta
„Moje odznaky“ s poslednými odznakmi, celá zbierka sa otvorí ťuknutím. Za každý získaný odznak si dieťa
ťuknutím naň vyzdvihne 2 hviezdičky (body), ktoré priletia do hlavičky (pole `vybrate` u dieťaťa).
Kým čakajú nevyzdvihnuté hviezdičky, bliká v menu Ja s nápisom „Nové!“ a v profile karta odznakov s nálepkou „Novinka!“.

## Pre rodiča

V profile (Ja → Pre rodiča) je zoznam tém prebratých tento týždeň a otázky z kvízov, v ktorých dieťa
chybovalo, aj so správnou odpoveďou. Keď dieťa otázku neskôr zodpovie správne, zo zoznamu zmizne.
Ukladá sa k dieťaťu do cloudu (polia `kedy` a `chyby`).

## Firebase

Projekt `svet-za-3-minuty` (plán Spark, zadarmo): prihlásenie, databáza Firestore a hosting.

- Profily detí sú v `rodiny/<uid>/deti/<id>`; podľa `firestore.rules` vidí a mení každý rodič len svoju rodinu.
  Starý dokument `pokrok/<uid>` z verzie 5 appka pri prvom prihlásení prevedie na prvé dieťa.
- Nasadenie (Firebase CLI): `firebase deploy --only hosting,firestore:rules,auth`
- Skúšanie bez ostrých účtov: `firebase emulators:start --only auth,firestore,hosting --project demo-svet-za-3-minuty`
  a otvoriť http://127.0.0.1:5050 (appka sa na localhoste sama pripojí na emulátor).

## Čo v nej je

- **Verzia 2.7:** nový účet rodiča (bez detí) dostane celého sprievodcu: `SPR_UCET` na obrazovke tvorby profilu (účet,
  meno, vek, postavička, uloženie) a po uložení prvého dieťaťa `SPR_RODIC` (celá appka pre rodiča, 19 krokov). Ďalšie deti
  a karta Ja spúšťajú len pôvodného sprievodcu pre dieťa `SPR_KROKY`. `Sprievodca.start(kroky, o)`, kroky môžu mať `tl`, `ak`, `oslava`.
- **Verzia 2.6:** Lietajúca sova kreslí kopce, ceruzky (`sovaCeruzka`), trávu, oblaky, hviezdy aj sovu z bitmáp
  (`sovaSprite`), počas hier je skryté pohyblivé pozadie (`body.hra-rezim`), šum krídel sa vyrába raz. Nové veci pre
  postavičku: čiapka na oslavu, kuchárska čiapka, jednorožcový roh, karnevalová maska, sovička a planéta na tričko, panda,
  lietajúce srdiečka (obrazky.js, `ODOMKNI`, `NAZVY_ODMIEN`).
- **Verzia 2.5:** všetky kvízy majú životy a prestávku po dohraní aj po prehre (`KVIZY`): rýchly 2 životy a 5 minút,
  ťažký 3 životy a 15 minút, výzva 3 životy a 30 minút. Iná téma ako téma dňa dá najviac 10 bodov (aj v režime do auta).
- **Verzia 2.4:** úvodná obrazovka so Sovičkou (`#uvod`; iPhone a iPad ju ukážu ešte pred načítaním z `ikony/start`,
  obrázky kreslí `node zdroj/uvod-obrazky.js` podľa `STARTY` v zostav.js). Kreslený návod Pridať na plochu (`Plocha`, `PLOCHA`)
  pre iPhone, iPad, Mac, Android a prehliadač v inej appke, karta na Domove, tip pri prihlásení, tlačidlo v profile.
  Téma bez jedinej správnej odpovede sa nezapíše a strom nenarastie (tlačidlo „Nevadí, ale skús to ešte raz“); deň sa
  počíta len s aspoň jednou správnou odpoveďou. Výzva má 3 životy (`odpovedz`), po dohraní alebo prehre znova o hodinu.
  Lietajúca sova kreslí predkreslené bitmapy (`sovaSprite`), aby na telefóne nesekala.
- **Sprievodca appkou (verzia 2.3):** pri novom dieťati sa sám spustí, Sovička svietiacim kruhom ukazuje skutočné
  časti appky (téma dňa, týždeň, body, režim do auta, kvízy, Témy, Hry, Priatelia, profil) a dieťa samo ťuká na tlačidlá
  v menu. Znova sa spustí v karte Ja (Sprievodca appkou). Kroky sú v `SPR_KROKY`, ovládanie v `Sprievodca` (zdroj/appka.html).
- **Priatelia (verzia 2.0):** rodič ich zapne v karte Priatelia. Dieťa má kód (napr. SOVA-K7M2), priateľa pridá jeho kódom
  a ten musí žiadosť prijať (deti sa nedajú vyhľadať). Priatelia vidia postavičku, meno, sériu, body, témy, odznaky a strom
  múdrosti, posielajú si len kreslené nálepky a hotové vety (`VETY`, `NALEPKY`; rovnaký zoznam je vo firestore.rules),
  majú týždenný rebríček. Od verzie 2.1 sú správy ako na Instagrame: v Priateľoch zoznam rozhovorov (karty Správy,
  Rebríček, Pridať), ťuknutím na kamaráta chat na celú obrazovku s nálepkami dole. Od 2.2: po téme „Pochváliť sa priateľom“
  (karta témy s tlačidlom Skúsiť tiež, aj tlačidlo s knihou v chate), srdiečko dvojitým ťuknutím, „Videné“
  (rozhovory/<a_b>/citane/<id>), upozornenie hore pri novej správe. Rodič vidí priateľov a správy v časti Pre rodiča. Údaje: `profily/<id dieťaťa>` (verejný profil,
  žiadosti, priatelia), `kody/<KÓD>`, `rozhovory/<id1_id2>/spravy`. Pravidlá overuje `node zdroj/pravidla-test.js` na emulátore.
- Témy sú v 4 oblastiach (`SKUPINY` v zdroj/appka.html): Príroda a vesmír, Ľudia a život, Svet a dejiny, Veda a technika;
  v každej sú menšie kategórie. Každá kategória musí patriť práve do jednej oblasti (test to stráži).
- Verzia sa v profile ukazuje ako `VERZIA_NAZOV` (napr. 1.26); `VERZIA_APPKY` je poradové číslo pre telefón a novinky.
- 127 tém v 24 kategóriách. Spoločné pre všetkých: história, politika, ekonomika, každodenný život, technika, veda,
  príroda, ľudské telo, geografia, psychológia, kultúra a angličtina. Len pre menšie deti (5–8 rokov) ľahké kategórie
  Zvieratká, Farby a tvary, Doma a v rodine, Čas a počasie, Bezpečne a Doprava; len pre väčšie (9–12) náročné kategórie Vesmír,
  Vynálezy, Planéta a klíma, Svetové dejiny, Biológia a Digitálny svet. Angličtina má pre menšie deti slovíčka (jedlo, oblečenie, doma),
  pre väčšie praktické vety (v obchode, na ceste, v reštaurácii, o sebe). Téma dňa a náhodná téma sú vždy pre vek dieťaťa.
- Väčšie deti majú aj **Výzvu**: 10 extra ťažkých otázok, za každú správnu 20 bodov (dvojnásobok).
- Body za kvízy (rýchly, ťažký aj Výzvu) sa dajú získať len raz za deň, za každý druh zvlášť, aby sa nezbierali opakovaním.
  Zopakovaná téma dá desatinu bodov (počet správnych odpovedí + 1), za tú istú tému najviac raz za deň.
- Obrázky k novším témam (79) sú vlastné kresby: prostredia (`PROSTR`) a zvieratá, jedlo, autá a predmety (`K`) na konci
  obrazky.js, bez emoji (test to stráži). Prostredia: lúka, izba, kuchyňa, mesto, vesmír,
  more, les, hrad, obchod…) s postavičkami a predmetmi. Emoji v obrázkoch tém aj v odpovediach kvízov
  sa kreslia obrázkami **OpenMoji** z priečinka `e/` (licencia CC BY-SA 4.0, pozri `e/LICENCIA.txt`), aby vyzerali na každom
  telefóne rovnako. Pri nových témach s novými emoji: stiahnuť balík `openmoji` (npm), spustiť
  `node zdroj/emoji.js <cesta k rozbalenému package>` a potom testy (hlásia emoji bez obrázka).
- dva vekové stupne: 5–8 rokov a 9–12 rokov. Väčšie deti majú odsek navyše, dve otázky navyše v každej téme,
  ťažšie nesprávne odpovede pri všetkých otázkach (odpovede A–D bez obrázkov) a Ťažký kvíz s 8 otázkami za 15 bodov
- kvíz s obrázkovými odpoveďami, rýchly kvíz z rôznych tém, body, hviezdy a séria dní
- maskot sovička Múdra, kreslené pohyblivé obrázky, zvuky (dajú sa vypnúť) a čítanie nahlas
- ovládanie, kategórie a odznaky majú vlastné kreslené ikony (`IK`, `IK_KAT` v zdroj/appka.html), aby vyzerali na každom
  telefóne rovnako
- pri prvej téme alebo kvíze dňa (séria sa predĺži) veľká oslava „Strom múdrosti“: strom vyrastie, za každý deň série
  pribudne plod, priletí sovička
- po veľkej aktualizácii okno „Čo je nové“ s obrázkami (`NOVINKY` v zdroj/appka.html; pri novej verzii doplniť položky
  s `v: <verzia>`); nový používateľ ho nedostane

## Súbory

| Súbor | Čo je v ňom |
| --- | --- |
| `zdroj/appka.html` | zdroj appky (vzhľad a správanie); upravuje sa tento súbor, nie `index.html` |
| `zdroj/zostav.js` | zo zdroja zostaví `index.html` (hlava, manifest, offline) |
| `zdroj/test.js` | testy logiky bez prehliadača |
| `index.html` | zostavená appka, ktorú hosting posiela do telefónov |
| `temy.js` | kategórie a texty tém, otázky a kvízy |
| `obrazky.js` | kreslené obrázky k témam a sovička |
| `manifest.webmanifest`, `ikony/` | názov a ikona appky v mobile |
| `sw.js` | uloženie appky do telefónu, aby fungovala offline |

## Ako pridať novú tému

1. Do `temy.js` pridaj do zoznamu `T` nový záznam podľa vzoru ostatných: `id`, kategória `k`, nadpis `t`,
   vysvetlenie `m` (pre všetkých) a `s` (navyše pre staršie deti), príklad `p`, otázky `o` a kvíz `z`.
   V kvíze je správna vždy prvá odpoveď, appka ich poradie zamieša sama. Pole `h` sú tri ťažšie nesprávne
   odpovede pre väčšie deti (dostanú ich namiesto ľahkých).
2. Do `obrazky.js` pridaj do `ART` obrázok s rovnakým `id`.
3. V `zdroj/appka.html` zvýš `VERZIA_APPKY` (vidno ju v profile), spusti testy a zostavenie a nasaď.
   Telefóny si novú verziu stiahnu pri ďalšom otvorení.

## Úpravy appky

1. Upraviť `zdroj/appka.html` (prípadne `temy.js` a `obrazky.js`).
2. `node zdroj/test.js` – testy musia skončiť riadkom `OK …`.
3. `node zdroj/zostav.js` – vytvorí nový `index.html`; `temy.js` a `obrazky.js` v ňom dostanú číslo verzie (`?v=22`),
   aby telefón nespojil novú appku so starým súborom z pamäte. Pri každom nasadení zvýšiť `VERZIA_APPKY`.
4. Vyskúšať na emulátore a nasadiť (pozri Firebase vyššie).

Fakty v témach treba pred pridaním skontrolovať.

Autor: Alex Kúdela
