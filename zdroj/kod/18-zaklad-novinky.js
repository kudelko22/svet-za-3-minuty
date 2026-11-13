/* Okno „Čo je nové“: raz po veľkej aktualizácii; nový používateľ ho nedostane.
   Pri prechode na 5.0 (PREMENA_V v 23-premena.js) sa namiesto okna hrá úvodná premena a na jej konci sú novinky s v >= PREMENA_V. */
const NOVINKY = [
  // DOČASNÉ vety 5.0 (návrhy zo sekcií): záverečná session ich prepíše a nastaví VERZIA_APPKY = PREMENA_V
  { v: 67, docasne: true, obr: () => logoGlobus(), n: 'Appka sa volá Svetom', p: 'Každý deň objav niečo nové. Celá appka vyzerá ako papierový atlas a má nové písmo, ktoré sa číta ľahšie.' },
  { v: 67, docasne: true, obr: () => mudra('radost'), n: 'Múdra vyrástla', p: 'Má šatku objaviteľky a vie sa tešiť, čudovať aj premýšľať.' },
  { v: 67, docasne: true, obr: () => ikn('kompas'), n: 'Domov je krajina', p: 'Cesta každý deň vedie inam: k sopke, do hôr, k hradu, ku hvezdárni alebo k domčeku. Strom múdrosti rastie priamo pri ceste.' },
  { v: 67, docasne: true, obr: () => ikn('zalozka'), n: 'Téma ako kniha, kvíz ako javisko', p: 'Po správnej odpovedi vyjde slnko a Múdra sa teší s tebou.' },
  { v: 67, docasne: true, obr: () => ikn('hry'), n: 'Hry sú ihrisko', p: 'Každá hra má nový obrázok a karta Ďalšia hra ukáže, koľko chýba.' },
  { v: 67, docasne: true, obr: () => ikn('odznak'), n: 'Pas objaviteľa', p: 'Odznaky sú teraz pečiatky v Pase objaviteľa a karta Ja je preukaz s fotkou postavičky.' },
  { v: 67, docasne: true, obr: () => ikn('priatelia'), n: 'Priatelia a rodič', p: 'Správy v bublinách, rebríček so stupňami víťazov a pokojnejší panel pre rodiča.' },
  { v: 66, obr: () => IK.mozog, n: 'Verzia 4.8.2: opravy', p: 'Okruh týždňa sa dá znova zmeniť aj z okna so stromom. V niektorých nových témach chýbal obrázok pri odpovedi, často práve pri správnej. Teraz majú všetky odpovede jednej otázky obrázok, alebo všetky písmená A, B, C.' },
  { v: 65, obr: () => stromSvg({ stupen: 2, plody: 4, kos: 0, novy: -1 }), n: 'Verzia 4.8.1: oslava série a ožitie stromu', p: 'Keď dohráš tému dňa, číslo série sa prevalí a zväčší, zažiari plameň a zaznie fanfára. Ak strom zvädol, vietor ho rozkýve, listy sa zatočia a strom múdrosti zasa ožije.' },
  { v: 64, obr: () => IK.mesiac, n: 'Verzia 4.8: Mesačný režim', p: 'V profile Ja v karte Mesačný režim prepneš appku na nočnú oblohu s mesiacom a hviezdičkami. Môžeš si vybrať Svetlý, Mesačný alebo Podľa telefónu. Večer je to príjemnejšie pre oči.' },
  { v: 63, obr: () => IK_KAT.cas, n: 'Verzia 4.7: veľa nového obsahu', p: 'Pribudlo 69 nových tém, vyše sto misií dňa, 24 kvízových sád a stovky anglických slovíčok a viet. Séria a strom sa po dohraní témy dňa pekne rozžiaria, k hre Čo je iné? pribudli krajšie obrázky a na Domove je strom v lište.' },
  { v: 62, obr: () => stromSvg({ stupen: 2, plody: 4, kos: 0, novy: -1 }), n: 'Verzia 4.6: živšia séria a strom', p: 'Keď dohráš tému dňa a séria sa predĺži, číslo sa rozžiari a poskočí, strom zažiari a sovička zaskáče. Ak séria začína znova od jednotky, oslava je pokojnejšia, bez veľkého ohňostroja.' },
  { v: 61, obr: () => OBR_HRY.ine, n: 'Verzia 4.5.1: krajšie obrázky v hre Čo je iné?', p: 'Prekreslili sme sandál (teraz je to žabka), loptu, nôž, skrutkovač, jedľu, tuleňa, orla, husle a gitaru, aby sa dali ľahko rozoznať.' },
  { v: 60, obr: () => OBR_HRY.ine, n: 'Verzia 4.5: nová hra Čo je iné?', p: 'Na obrázku sú štyri veci. Tri patria k sebe a jedna je iná, napríklad pes, kôň, mačka a jablko. Ťukni na tú, ktorá nepatrí k ostatným. Po odpovedi sa dozvieš prečo. Hra má ľahšie sady pre menších a ťažšie pre starších.' },
  { v: 59, obr: () => stromSvg({ stupen: 2, plody: 3, kos: 0, novy: -1 }), n: 'Verzia 4.4: viditeľnejší strom', p: 'Strom múdrosti vyrastie na konci dnešnej témy dňa, ešte predtým ako ťa čaká misia. Stromček hore je teraz väčší polkruh s počtom dní série (1, 2, 3 a ďalej), keď strom schne, zožltne. Raz za deň ti Domov jemne pripomenie sériu alebo lekciu (zavrieš ju krížikom). Pri ťuknutí na strom sa okno týždňa zavrie.' },
  { v: 58, obr: () => IK_KAT.cas, n: 'Verzia 4.3: vynechané dni na precvičenie', p: 'Vynechaný deň si môžeš zahrať dodatočne. Ťukni v Týždni na minulý deň a otvorí sa jeho téma, v Prehľade týždňa aj jeho angličtina. Je to len na precvičenie: bez hviezdičiek, série a stromu múdrosti. Takýto deň ostáva vynechaný, ale tému si zopakuješ.' },
  { v: 57, obr: () => OBR_HRY.krtko, n: 'Verzia 4.2: kratší Domov a nová hra', p: 'Týždeň je schovaný v stromčeku hore: ťukni naň a rozvinie sa. Tmavý stromček znamená, že dnešná téma čaká, farebný, že je hotovo. Po téme je obrazovka kratšia, ostatné je zbalené. Nová hra Ťukaj krtkov nahradila Čo bude ďalej?.' },
  { v: 56, obr: () => OBR_HRY.pocitaj, n: 'Verzia 4.1: nové hry a prehľad týždňa', p: 'Päť nových hier: Ktorý je iný?, Nájdi tieň, Zoraď čísla, Čo bude ďalej? a Poskladaj slovo. Na karte Tento týždeň je tlačidlo Prehľad týždňa s dňami, súčtami a históriou. Dlhé mená sa už nepretekajú. Rodič môže v paneli zapnúť alebo vypnúť vibrácie.' },
  { v: 55, obr: () => IK_KAT.anglictina, n: 'Verzia 4.0.1: opravy', p: 'Karta Tento týždeň je na Domove znova úplne hore. Počas angličtiny nič nezavadzia hore ani dole a po dohraní je okno prehľadnejšie. Opravené sú aj drobné chyby v textoch.' },
  { v: 55, obr: () => owl('cheer'), n: 'Nový sprievodca', p: 'Sovička ukáže aj Tému dňa, týždeň s okruhom, kvízik z angličtiny, strom múdrosti, hry a priateľov. Krátku prehliadku noviniek si môžeš pustiť hneď, celého sprievodcu nájdeš v karte Ja.' },
  { v: 54, obr: () => IK.duha, n: 'Verzia 4.0: okruh týždňa', p: 'Téma dňa je zasa Téma dňa. Vyber si okruh týždňa alebo nechaj Zmiešaný, pozri si témy predošlých dní a nájdeš všetko na prehľadnejšom Domove s kartou Objavuj.' },
  { v: 53, obr: () => IK.mozog, n: 'Bez blikania', p: 'Appka je plynulejšia: bez blikania pri odpovediach, prechodoch, správach a načítaní.' },
  { v: 52, obr: () => IK.ziarovka, n: 'Opravy a bezpečnejšia appka', p: 'Rodičovský panel sa po odchode sám zamkne, voľné písanie je len keď ho zapne rodič a nevhodné slová sa zachytia. Účty a ukladanie sú spoľahlivejšie, hry a angličtina plynulejšie. Opravené sú aj drobnosti vo vzhľade.' },
  { v: 51, obr: () => IK.duha, n: 'Jednofarebné pozadie', p: 'V profile Ja v karte Pozadie si vyber Animované, Jednofarebné s ôsmimi jemnými farbami alebo Jemný vzor bez pohybu. Jednofarebné a vzor šetria telefón.' },
  { v: 50, obr: () => IK.ziarovka, n: 'Nápoveda hore', p: 'Keď odpovieš zle, hláška Skús inú možnosť sa ukáže hneď nad odpoveďami, netreba rolovať.' },
  { v: 49, obr: () => IK_KAT.anglictina, n: 'Ďalej bez rolovania', p: 'V angličtine ostane tlačidlo Ďalej po odpovedi stále na obrazovke, netreba rolovať dolu.' },
  { v: 48, obr: () => IK.ohen, n: 'Najprv téma, potom misia', p: 'Na Domove je téma dňa číslo 1 a zvýraznená. Misia je číslo 2 a odomkne sa, keď prebereš tému.' },
  { v: 47, obr: () => IK.mozog, n: 'Bez blikania', p: 'Misie a kvízy sa po odpovedi už neprekresľujú. Okno Čo je nové sa ukáže až po úvodnej obrazovke so sovičkou.' },
  { v: 46, obr: () => IK.duha, n: 'Plynulé pozadie', p: 'Pozadie sa pri výbere mení plynulo a obrazovka už neblikne.' },
  { v: 45, obr: () => IK.duha, n: 'Vlastné pozadie', p: 'V profile Ja si môžeš vybrať farbu pozadia appky: Nebo, Ružová, Lúka, Slnko, Fialová alebo More.' },
  { v: 44, obr: () => IK.ohen, n: 'Tvoj týždeň hore', p: 'Karta Tento týždeň so stromom múdrosti je teraz na Domove úplne hore.' },
  { v: 43, obr: () => IK_KAT.anglictina, n: 'Angličtina bez blikania', p: 'Kvíz v angličtine sa po odpovedi už neprekresľuje, všetko ide plynulo.' },
  { v: 43, obr: () => IK.rodina, n: 'Priateľov zapína rodič', p: 'Priateľov zapína a vypína len rodič, v paneli za PIN-om. Dieťa tu už nič neprepína.' },
  { v: 42, obr: () => IK.kniha, n: 'Prehľadnejší Domov', p: 'Hore je téma dňa a pod ňou angličtina. Kvízy sú menšie, oblasti tém sú v jednom riadku, ktorý sa dá posúvať.' },
  { v: 41, obr: () => IK_KAT.anglictina, n: 'Viac angličtiny a misií', p: 'Pribudlo 51 misií, 191 slovíčok a 61 viet. Angličtina má výraznejšiu kartu a kvízy sa rozklikávajú po skupinách.' },
  { v: 41, obr: () => IK.rodina, n: 'Čistejší profil', p: 'Karta Ja je prehľadnejšia. Hlas a rodičovské veci tu už nie sú, nájde ich rodič v paneli za PIN-om.' },
  { v: 40, obr: () => IK.rodina, n: 'Pozvánka na účet rodiča', p: 'Ak ešte nemáte účet rodiča, appka vám ho raz ponúkne. Dá sa to odložiť na neskôr.' },
  { v: 39, obr: () => IK.rodina, n: 'Update 3.5: účet rodiča', p: 'Rodič má vlastný účet s PIN-om. Za PIN je panel s kartami detí, prehľadmi a nastaveniami. Deti majú v profile len to, čo potrebujú.' },
  { v: 38, obr: () => IK.bublina, n: 'Správy bez prekrývania', p: 'Dlhšie správy sa v bublinách správne zalomia a bubliny sa už neprekrývajú.' },
  { v: 37, obr: () => IK.bublina, n: 'Písanie priateľom pre všetkých', p: 'Keď máš priateľa, môžeš mu písať aj vlastné slová, nič sa nezapína. Bubliny v správach sa už neprekrývajú.' },
  { v: 36, obr: () => IK_KAT.anglictina, n: 'Angličtina na každý deň', p: 'Angličtina má nové miesto na Domove. Každý deň nový krátky kvízik so slovíčkami a vetami, s vysvetlením odpovedí. Pôvodné anglické lekcie nájdeš tam tiež.' },
  { v: 36, obr: () => OBR_HRY.pocitaj, n: 'Nová hra Koľko ich je?', p: 'Ľahká hra pre malých: spočítaj 1 až 5 obrázkov a ťukni na číslo. Bez časovača. Bubliny s počtami sú v ťažšej úrovni.' },
  { v: 36, obr: () => svg(byId('raketa')), siroky: true, n: '24 nových tém a ďalšie misie', p: 'Ku každej kategórii pribudla nová téma s obrázkom a kvízom. V téme dňa je 75 misií, takže sa dlho neopakujú.' },
  { v: 36, obr: () => stromSvg({ stupen: 3, plody: 0, kos: 0, novy: -1, hn: 2 }), n: 'Strom vädne, keď sa nehrá', p: 'Keď dieťa vynechá niekoľko dní, strom pomaly vädne a najdrahšie hry si oddychujú. Po prvej téme strom ožije a nič sa nestratí. Rodič to môže vypnúť v prehľade.' },
  { v: 36, obr: () => IK.bublina, n: 'Voľné písanie v správach', p: 'Rodič môže priateľom zapnúť písanie vlastných slov. Bubliny v rozhovoroch sú teraz tesnejšie pri sebe.' },
  { v: 36, obr: () => ik('lupa'), n: 'Nová misia v téme dňa', p: 'Každý deň jedna krátka misia: záhada, rozhodovanie, dve pravdy a lož, príčiny a následky alebo výzva vonku. Nájdeš ju na Domove. Za splnenie sú body a odznaky.' },
  { v: 35, obr: () => stromSvg({ stupen: 4, plody: 6, kos: 0, novy: -1 }), n: 'Strom múdrosti rastie s vami', p: 'Strom má 6 stupňov, od semienka až po zlatý strom múdrosti. Ťuknite na kartu Tento týždeň a uvidíte, ako vyzerá. Oslava je teraz ešte veľkolepejšia.' },
  { v: 34, obr: () => owl('cheer'), n: 'Sprievodca pre nových rodičov', p: 'Nový účet rodiča dostane celú prehliadku: ako funguje účet a profil dieťaťa, téma dňa, body, kvízy, hry, priatelia aj nastavenia.' },
  { v: 33, obr: () => postavicka({ vlasy: 'kucery', farbaVlasov: '#B5713C', koza: '#F6C9A0', oci: 'velke', usta: 'smiech', okuliare: 'ziadne', tricko: '#4C7DFF', vzor: 'planeta', doplnok: 'roh', zvieratko: 'panda', kuzlo: 'srdcia', pozadie: '#FFE1E8' }, true),
    n: '8 nových vecí pre postavičku', p: 'Jednorožcový roh, kuchárska čiapka, čiapka na oslavu, karnevalová maska, sovička a planéta na tričko, panda a lietajúce srdiečka.' },
  { v: 33, obr: () => OBR_HRY.sova, n: 'Lietajúca sova ešte plynulejšia', p: 'Kopce, ceruzky aj tráva sa kreslia len raz a počas hry sa zastaví pohyblivé pozadie, takže telefón má oveľa menej práce.' },
  { v: 32, obr: () => IK.srdce, n: 'Životy vo všetkých kvízoch', p: 'Rýchly kvíz má 2 srdiečka, ťažký kvíz a výzva 3. Po každom kvíze je prestávka: rýchly 5 minút, ťažký 15 minút, výzva 30 minút.' },
  { v: 32, obr: () => IK.kocka, n: 'Najviac bodov za tému dňa', p: 'Za inú tému ako tému dňa sa dá získať najviac 10 bodov.' },
  { v: 31, obr: () => owl('oops'), n: 'Všetko zle? Nevadí!', p: 'Keď v téme nevyjde ani jedna odpoveď, strom múdrosti nenarastie. Stačí skúsiť otázky ešte raz.' },
  { v: 31, obr: () => plPlocha(), n: 'Appka na ploche ako naozajstná', p: 'Kreslený návod ukáže, ako si appku pridať na plochu iPhonu, iPadu, Macu aj Androidu. Pri spustení vás privíta Sovička.' },
  { v: 30, obr: () => owl('cheer'), n: 'Sovička ťa prevedie appkou', p: 'Nový sprievodca ukáže, čo kde je, a všetko si vyskúšaš ťuknutím. Spustíš ho kedykoľvek v karte Ja.' },
  { v: 29, obr: () => IK.srdce, n: 'Pochváľ sa témou a daj srdiečko', p: 'Po téme ju pošli priateľom, oni ju skúsia tiež. Dvojité ťuknutie na správu dá srdiečko a uvidíš, či je správa Videná.' },
  { v: 28, obr: () => IK.bublina, n: 'Správy ako v chate', p: 'V Priateľoch sú hneď rozhovory. Ťukni na kamaráta a nálepky posielaš jedným ťuknutím.' },
  { v: 27, obr: () => IK.rodina, n: 'Verzia 2.0: Priatelia', p: 'Pridaj si kamaráta kódom, posielajte si nálepky a súťažte v týždennom rebríčku. Rodič ich zapne v karte Priatelia.' },
  { v: 26, obr: () => IKS(SKUPINY.map((g, i) => `<rect x="${5 + (i % 2) * 21}" y="${5 + Math.floor(i / 2) * 21}" width="17" height="17" rx="5" fill="${g.c}"/>`).join('')), n: 'Témy v 4 oblastiach', p: 'Príroda a vesmír, Ľudia a život, Svet a dejiny, Veda a technika. Vnútri sú menšie kategórie.' },
  { v: 25, obr: () => svg(byId('farma')), siroky: true, n: 'Obrázky tém nakreslené nanovo', p: '79 tém má nové kreslené obrázky: zvieratká, autá, jedlo aj predmety s očkami a pohybom.' },
  { v: 24, obr: () => IK.ohen, n: 'Veľká oslava série', p: 'Prvá téma alebo kvíz dňa: vyrastie strom múdrosti a pribudne na ňom plod.' },
  { v: 22, obr: () => OBR_HRY.sova, n: 'Nová hra Lietajúca sova', p: 'Ťukaj a sovička letí pomedzi ceruzky. Odomkne sa za 300 bodov.' },
  { v: 23, obr: () => IK.iskra, n: 'Kreslené obrázky namiesto emoji', p: 'Ikony, odznaky aj odpovede v kvízoch vyzerajú na každom telefóne rovnako.' },
];
const Novinky = {
  // verzia sa zapíše až keď sa okno naozaj ukáže, takže ho dieťa nestratí, ak appku zavrie skôr
  skontroluj() {
    if (this.bolo || this.caka || st.faza !== 'appka' || !st.dietaId || st.flow || st.hra || st.auto || Sprievodca.el) return;
    // skúška premeny: adresa s ?premena (celá) alebo ?premena=tichy (len koniec); nič sa nezapisuje
    const skuska = typeof Premena !== 'undefined' ? Premena.skuska() : '';
    const videl = S.get('videl-verziu', 0);
    if (!skuska && videl >= VERZIA_APPKY) { this.bolo = true; return; }
    // nový používateľ (bez uloženej verzie a bez pokroku) novinky ani premenu nedostane: starú appku nepoznal
    const odkedy = videl || (st.done.length || st.body ? 21 : VERZIA_APPKY);
    const z = NOVINKY.filter(n => n.v > odkedy && n.v <= VERZIA_APPKY);
    // premena 5.0: kto naposledy videl verziu pred 5.0 (alebo skúška); na konci len novinky 5.0
    const premena = skuska || (typeof PREMENA_V !== 'undefined' && VERZIA_APPKY >= PREMENA_V && odkedy < PREMENA_V);
    const z5 = premena ? NOVINKY.filter(n => n.v >= PREMENA_V) : [];
    if (!z.length && !premena) { S.set('videl-verziu', VERZIA_APPKY); this.bolo = true; return; }
    this.caka = true;
    // okno sa ukáže až keď úplne zmizne úvodná obrazovka so sovičkou (najneskôr po 6 s ju zavrie samo)
    const t0 = Date.now();
    const skus = () => {
      const u = document.getElementById('uvod');
      if (u && u.isConnected && Date.now() - t0 < 6000) { if (Date.now() - t0 > 4500) Uvod.skry(); setTimeout(skus, 120); return; }
      setTimeout(() => {
        this.caka = false;
        if (this.bolo || document.querySelector('.novinky, .pm')) return;
        if (premena && Premena.spusti(z5, { tichy: skuska === 'tichy' })) { this.bolo = true; if (!skuska) S.set('videl-verziu', VERZIA_APPKY); return; }
        // premena zlyhala alebo nebola: obyčajné okno noviniek
        try { const zz = z.length ? z : z5; if (zz.length) this.ukaz(zz); this.bolo = true; if (!skuska) S.set('videl-verziu', VERZIA_APPKY); } catch (e) { console.error('Čo je nové:', e); }
      }, 350);
    };
    setTimeout(skus, 300);
  },
  ukaz(z) {
    const el = document.createElement('div');
    // 5.0: rovnaké okno v štýle papierového atlasu (.nov-50 v 58-premena.css)
    el.className = 'novinky nov-50'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Čo je nové');
    el.innerHTML = `<div class="nov-karta listok"><div class="nov-hlava">${mudra('radost')}<div><small>Verzia ${VERZIA_NAZOV}</small><h2>Čo je nové?</h2></div></div>
      <div class="nov-zoznam">${z.map((n, i) => `<div class="nov-polozka" style="--i:${i}"><span class="nov-obr${n.siroky ? ' siroky' : ''}">${n.obr()}</span><div><b>${n.n}</b><small>${n.p}</small></div></div>`).join('')}</div>
      <div class="perf"></div>
      <div class="nov-dole">${z.some(n => n.v >= 55 && n.v < 67) ? '<button class="btn wide dve" data-novinky-tour>Ukáž mi novinky</button>' : ''}
      <button class="btn wide" data-novinky-ok>Super, poďme na to!</button></div></div>`;
    document.body.appendChild(el);
    Zvuk.play('cink'); setTimeout(() => FX.burst(innerWidth / 2, innerHeight * .25, 24, ['star', 'dot']), 300);
    const b = el.querySelector('[data-novinky-ok]');
    if (b) b.addEventListener('click', e => { e.stopPropagation(); Zvuk.play('tap'); el.classList.add('pryc'); setTimeout(() => el.remove(), 300); });
    const t = el.querySelector('[data-novinky-tour]');
    if (t) t.addEventListener('click', e => { e.stopPropagation(); Zvuk.play('tap'); el.classList.add('pryc'); setTimeout(() => el.remove(), 300); setTimeout(() => Sprievodca.start(SPR_NOVE, { zavriet: 'Celého sprievodcu nájdeš v karte Ja.' }), 450); });
  },
};
// Okno „Vytvor si účet rodiča“ (3.5.1): pre účty bez rodiča, raz za spustenie appky, nikdy počas hry či kvízu; „Neskôr“ ho odloží na 3 dni
const RodicVyzva = {
  bolo: false, caka: false,
  volno() { return st.faza === 'appka' && st.dietaId && !st.flow && !st.hra && !st.auto && !Sprievodca.el && !Novinky.caka && !document.querySelector('.novinky, .oslava'); },
  skontroluj() {
    const C = window.Cloud;
    if (this.bolo || this.caka || !C || !C.rodic || !C.rodic.nacitane || C.rodic.profil || S.get('rodic-neskor-' + (C.pouzivatel ? C.pouzivatel.uid : ''), 0) > Date.now()) return;
    this.caka = true;
    const skus = n => setTimeout(() => {
      const C2 = window.Cloud;
      if (this.bolo || !C2 || !C2.rodic || C2.rodic.profil) { this.caka = false; return; }
      if (this.volno()) { this.caka = false; this.ukaz(); } else if (n < 40) skus(n + 1); else this.caka = false;
    }, 1500);
    skus(0);
  },
  ukaz() {
    this.bolo = true;
    const el = document.createElement('div');
    el.className = 'novinky rodic-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Vytvor si účet rodiča');
    el.innerHTML = `<div class="nov-karta"><div class="nov-hlava">${owl('hi')}<div><small>Pre rodiča</small><h2>Vytvor si účet rodiča</h2></div></div>
      <p class="muted" style="margin:6px 4px 14px">Za vlastným PIN-om (4 číslice) nájdete prehľad všetkých detí a nastavenia. Deti ostanú pri učení a nič sa im nezmení.</p>
      <button class="btn wide cta" data-rv="ano">Vytvoriť účet rodiča</button>
      <button class="btn ghost wide" data-rv="neskor" style="margin-top:8px">Neskôr</button></div>`;
    document.body.appendChild(el);
    Zvuk.play('pop');
    const zavri = () => { el.classList.add('pryc'); setTimeout(() => el.remove(), 300); };
    el.addEventListener('click', e => {
      e.stopPropagation();
      const b = e.target.closest('[data-rv]'); if (!b) return;
      Zvuk.play('tap'); zavri();
      if (b.dataset.rv === 'ano') Rodic.chod('rodicTvorba'); else S.set('rodic-neskor-' + ((window.Cloud.pouzivatel || {}).uid || ''), Date.now() + 3 * 864e5);
    });
  },
};
