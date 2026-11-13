/* Sprievodca appkou (verzia 2.3): Sovička prevedie dieťa skutočnou appkou, svieti na tlačidlá a dieťa na ne ťuká.
   Sám sa spustí pri novom dieťati, znova sa dá spustiť v profile (karta Ja). */
const SPR_RUKA = `<svg viewBox="0 0 64 72" aria-hidden="true"><g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
  <path d="M20 40 V9 C20 2 30 2 30 9 V28 C31 23 39 23 39 29 C40 24 48 24 48 31 C49 27 56 28 56 34 V48 C56 61 48 69 37 69 H33 C25 69 20 65 16 58 L8 44 C5 38 12 34 16 39 L20 44Z" fill="#fff"/>
  <path d="M30 28 V37 M39 29 V37 M48 31 V38" fill="none" stroke-width="3"/></g></svg>`;
const SPR_KROKY = [
  { id: 'vitaj', nalada: 'hi', tl: [['dalej', 'Ukáž mi to!', 1], ['zavri', 'Teraz nie']], p: 'Ja som Sovička Múdra. Ukážem ti, čo všetko v appke nájdeš. Bude to rýchle, sľubujem!' },
  { n: 'Sovička Múdra', nalada: 'happy', p: 'Pri každom kroku môžeš ťuknúť na reproduktor a ja ti ho prečítam nahlas. Keď chceš skončiť, ťukni na krížik.' },
  { v: 'domov', cil: '.hero', n: 'Téma dňa', nalada: 'happy', p: 'Každý deň ťa tu čaká nová téma. S rodičom si ju prečítate za 3 minúty a potom odpovieš na pár otázok.' },
  { v: 'domov', cil: '.ang-karta', n: 'Kvízik z angličtiny', nalada: 'happy', p: 'Každý deň jeden krátky kvízik z angličtiny. Ťukneš na anglické slovo a vyberieš správny preklad.' },
  { v: 'domov', cil: '#tyz-strom', n: 'Stromček hore', nalada: 'cheer', p: 'Ťukni na stromček a ukáže sa tvoj týždeň so stromom múdrosti. Keď je stromček tmavý, dnešná téma ešte čaká. Po prvej téme sa rozsvieti. Keď sa niekoľko dní neučíš, strom vädne.' },
  { v: 'domov', cil: '#stars', n: 'Tvoje body', nalada: 'cheer', p: 'Za správne odpovede zbieraš body. Za body sa odomykajú hry a nové veci pre tvoju postavičku.' },
  { v: 'domov', cil: '.auto-mala', n: 'Režim do auta', p: 'Keď ide rodina autom, appka prečíta tému aj otázky nahlas. Učiť sa dá aj cestou.' },
  { v: 'domov', cil: '.objavuj-karta', n: 'Objavuj', nalada: 'happy', p: 'Tu sú kvízy, Iná téma, ktorá ťa prekvapí, a všetky oblasti tém: príroda, ľudia, svet a veda.' },
  { tap: 'temy', cil: '#nav-temy', n: 'Ťukni na Témy', p: 'Teraz si to vyskúšaj: ťukni na Témy dole.' },
  { v: 'temy', cil: '#filtre', n: 'Všetky témy', p: 'Témy sú v 4 oblastiach: príroda, ľudia, svet a veda. Ťukni na oblasť alebo hore napíš, čo hľadáš.' },
  { tap: 'hry', cil: '#nav-hry', n: 'Ťukni na Hry', nalada: 'happy', p: 'Výborne! Teraz ťukni na Hry.' },
  { v: 'hry', cil: '.hra-karta', n: 'Hry', nalada: 'cheer', p: 'Za body sa odomykajú hry. Vidíš len tie, ktoré sú pre tvoj vek. Hraním sa body neminú.' },
  { tap: 'priatelia', cil: '#nav-priatelia', n: 'Ťukni na Priatelia', p: 'Ešte dve zastávky. Ťukni na Priatelia.', pred: () => { st.socTab = 'spravy'; } },
  { v: 'priatelia', cil: '.soc-intro, .pribehy, main > .muted', n: 'Priatelia', p: () => socC() && socC().zapnute ? 'Tu sú tvoji kamaráti. Posielate si nálepky a súťažíte v týždennom rebríčku.' : 'Tu si pridáš kamarátov. Posielate si nálepky a súťažíte v týždennom rebríčku. Zapína to rodič.' },
  { tap: 'ja', cil: '#nav-ja', n: 'Ťukni na Ja', nalada: 'happy', p: 'Posledná zastávka. Ťukni na Ja.' },
  { v: 'ja', cil: '.prof-top', n: 'Tvoj profil', nalada: 'happy', p: 'Tu je tvoja postavička. Ťukni na ňu a môžeš ju prezliecť.' },
  { v: 'ja', cil: '.odznaky-karta', n: 'Odznaky', nalada: 'cheer', p: 'Za úspechy dostávaš odznaky. Koľko ich nazbieraš?' },
  { v: 'ja', cil: '.spr-karta', n: 'Kedykoľvek znova', p: 'Keď budeš chcieť, ukážem ti všetko znova. Stačí ťuknúť sem.' },
  { id: 'koniec', nalada: 'cheer', oslava: true, tl: [['tema', 'Poďme na tému dňa!', 1], ['domov', 'Zavrieť']], p: 'Teraz už vieš, kde je čo. Poďme spolu na tému dňa?' },
];
// Nový účet rodiča (verzia 2.7): najprv pri tvorbe profilu dieťaťa (SPR_UCET), po uložení celá appka (SPR_RODIC).
// Ďalšie deti a karta Ja už spúšťajú len sprievodcu pre dieťa (SPR_KROKY).
const SPR_UCET = [
  { id: 'vitaj', n: 'Vitajte!', nalada: 'hi', tl: [['dalej', 'Ukážte mi to', 1], ['zavri', 'Teraz nie']], p: 'Účet rodiča je vytvorený. Som Sovička Múdra a ukážem vám krok za krokom, ako appka funguje. Najprv spolu pripravíme profil dieťaťa.' },
  { id: 'ucet', n: 'Ako funguje účet', nalada: 'happy', p: 'Pod jedným účtom rodiča môžu byť profily viacerých detí. Každé dieťa má vlastnú postavičku, body a pokrok. Všetko sa ukladá do cloudu, takže sa nič nestratí ani pri výmene telefónu a prihlásiť sa dá aj na ďalšom zariadení.' },
  { cil: '#meno-dietata', n: 'Meno dieťaťa', p: 'Sem napíšte meno alebo prezývku. Appka ním dieťa oslovuje a uvidia ho aj priatelia, ak ich neskôr zapnete.' },
  { cil: '.tvorba .seg2', n: 'Vek', p: '5 – 8 rokov: jednoduchšie otázky s obrázkami. 9 – 12 rokov: ťažšie otázky, časť Do hĺbky a navyše ťažký kvíz a výzva. Vek sa dá kedykoľvek zmeniť.' },
  { cil: '[data-tvorba-dalej]', n: 'Potom postavička', nalada: 'cheer', p: 'V ďalšom kroku si dieťa vyberie postavičku: účes, oči, tričko aj doplnky. Kto sa nechce hrať, ťukne na kocku. Veci so zámkom sa odomknú za body z tém.' },
  { id: 'koniec', n: 'Teraz vy!', nalada: 'cheer', tl: [['hotovo', 'Idem vyplniť profil', 1]], p: 'Napíšte meno, vyberte vek a ťuknite na Ďalej. Postavičku si potom vyberiete spolu s dieťaťom. Hneď po nej pokračujeme prehliadkou appky.' },
];
const SPR_RODIC = [
  { id: 'vitaj', n: 'Profil je hotový!', nalada: 'cheer', tl: [['dalej', 'Ukážte mi všetko', 1], ['zavri', 'Teraz nie']], p: 'Teraz vám ukážem celú appku: čo robiť každý deň, za čo sú body, kvízy, hry, priateľov aj nastavenia pre rodiča.' },
  { v: 'domov', cil: '.hero', n: 'Téma dňa', nalada: 'happy', p: 'Každý deň jedna krátka téma na 3 minúty. Prečítate ju dieťaťu (alebo ju appka prečíta nahlas), porozprávate sa a dieťa odpovie na otázky. Za tému dňa je najviac bodov.' },
  { v: 'domov', cil: '.ang-karta', n: 'Kvízik z angličtiny', nalada: 'happy', p: 'Denný kvízik z angličtiny má 6 otázok. Dieťa vyberá preklad slova a dostane krátke vysvetlenie. Ďalšie kvízy sú v Objavuj.' },
  { v: 'domov', cil: '#tyz-strom', n: 'Séria a strom múdrosti', p: 'Každý deň s témou pribudne hviezdička a rastie séria. Prvá téma dňa spustí oslavu a na strome múdrosti pribudne plod. Keď sú všetky odpovede zlé, treba otázky skúsiť ešte raz. Stromček hore ukáže týždeň: ťuknutím na minulý deň otvoríte jeho tému, tlačidlom Okruh vyberiete, o čom budú témy týždňa, a ťuknutím na strom uvidíte jeho stupeň.' },
  { v: 'domov', cil: '#stars', n: 'Body', nalada: 'cheer', p: 'Body sú za správne odpovede a odomykajú hry aj nové veci pre postavičku. Za inú tému ako tému dňa je najviac 10 bodov.' },
  { v: 'domov', cil: '.auto-mala', n: 'Režim do auta', p: 'Jedno ťuknutie a appka prečíta tému aj otázky nahlas, s prestávkou na odpoveď. Hodí sa na cestu, keď šoférujete.' },
  { v: 'domov', cil: '.plocha-karta', ak: () => !!document.querySelector('.plocha-karta'), n: 'Appka na ploche', p: 'Pridajte si appku na plochu telefónu. Bude sa otvárať ako naozajstná aplikácia, s ikonkou a cez celú obrazovku.' },
  { v: 'domov', cil: '.objavuj-karta', n: 'Objavuj', p: 'Kvízy, iná téma a všetky oblasti tém sú schované tu. Ťuknite na kartu.' },
  { v: 'objavuj', cil: '.obj-akty', n: 'Kvízy', p: 'Rýchly kvíz má 5 otázok a 2 životy. Pre 9 – 12 rokov je aj ťažký kvíz a výzva s 3 životmi. Po kvíze je prestávka (5, 15 a 30 minút) a body sú raz za deň.' },
  { tap: 'temy', cil: '#nav-temy', n: 'Ťuknite na Témy', p: 'Teraz si to vyskúšajte: ťuknite dole na Témy.' },
  { v: 'temy', cil: '#filtre', n: 'Všetky témy', p: () => `${TV().length} tém v 4 oblastiach: príroda, ľudia, svet a veda. Dajú sa hľadať a srdiečkom v téme si ich uložíte medzi obľúbené.` },
  { tap: 'hry', cil: '#nav-hry', n: 'Ťuknite na Hry', nalada: 'happy', p: 'Výborne! Teraz ťuknite na Hry.' },
  { v: 'hry', cil: '.hra-karta', n: 'Hry', nalada: 'cheer', p: 'Hry sa odomykajú za body. Dieťa vidí hry podľa svojho veku, malé deti majú ľahšie. Hraním sa body neminú. Keď sa niekoľko dní neučí, strom vädne a najdrahšie hry si oddýchnu, po prvej téme sa všetko vráti.' },
  { tap: 'priatelia', cil: '#nav-priatelia', n: 'Ťuknite na Priatelia', p: 'Ťuknite na Priatelia.', pred: () => { st.socTab = 'spravy'; } },
  { v: 'priatelia', cil: '.soc-intro, .pribehy, main > .muted', n: 'Priatelia zapína rodič', p: 'Deti si posielajú kreslené nálepky, hotové vety aj vlastné krátke slová. Priateľa pridajú len jeho kódom a druhá strana musí súhlasiť. Zapnúť aj vypnúť to môžete len vy.' },
  { tap: 'ja', cil: '#nav-ja', n: 'Ťuknite na Ja', nalada: 'happy', p: 'Posledná časť je profil. Ťuknite na Ja.' },
  { v: 'ja', cil: '.prof-top', n: 'Profil dieťaťa', nalada: 'happy', p: 'Postavička, meno a vek. Ťuknutím na postavičku ju dieťa prezlečie.' },
  { v: 'ja', cil: '.odznaky-karta', n: 'Odznaky a odmeny', p: 'Za úspechy prichádzajú odznaky a za body nové veci pre postavičku.' },
  { v: 'ja', ak: () => !maRodica(), cil: () => (x => x && x.closest ? x.closest('section') : null)([...document.querySelectorAll('main .h2')].find(x => x.textContent.trim() === 'Pre rodiča')), n: 'Pre rodiča', p: 'Tu vidíte, čo dieťa tento týždeň prebralo a v ktorých otázkach sa pomýlilo, aby ste sa o nich mohli porozprávať.' },
  { v: 'ja', cil: () => (x => x && x.closest ? x.closest('.card') : x)(document.querySelector('main [data-deti]')), n: 'Rodina a ďalšie deti', p: 'Cez Zmeniť dieťa pridáte ďalšie dieťa alebo prepnete medzi deťmi, prepnúť sa dá aj ťuknutím na postavičku hore.' },
  { v: 'ja', cil: '.spr-karta', n: 'Sprievodca pre dieťa', p: 'Keď bude chcieť, Sovička ukáže appku aj dieťaťu, jeho slovami. Spustíte ho tu.' },
  { id: 'rodicucet', ak: () => !maRodica(), n: 'Účet rodiča', nalada: 'happy', tl: [['rodicucet', 'Vytvoriť účet rodiča', 1], ['dalej', 'Neskôr']], p: 'Nastavenia, prehľady a mazanie profilov nemajú byť deťom na dosah. Vytvorte si účet rodiča s vlastným PIN-om (4 číslice), zaberie to chvíľku.' },
  { id: 'koniec', n: 'Všetko pripravené!', nalada: 'cheer', oslava: true, tl: [['dieta', 'Ukázať sprievodcu dieťaťu', 1], ['tema', 'Poďme na tému dňa →']], p: 'Teraz už viete všetko. Ukážte appku aj dieťaťu, alebo rovno začnite tému dňa.' },
];
// Krátka prehliadka noviniek pre tých, čo už starého sprievodcu videli (ponúka ju okno Čo je nové)
const SPR_NOVE = [
  { id: 'vitaj', n: 'Pozri, čo je nové', nalada: 'hi', tl: [['dalej', 'Ukáž mi to!', 1], ['zavri', 'Teraz nie']], p: 'V appke pribudlo pár vecí. Ukážem ti ich za chvíľku.' },
  { v: 'domov', cil: '.hero', n: 'Téma dňa', nalada: 'happy', p: 'Hore je zasa Téma dňa. Každý deň nová, na 3 minúty.' },
  { v: 'domov', cil: '.ang-karta', n: 'Kvízik z angličtiny', p: 'Denný kvízik z angličtiny: vyberieš správny preklad slova.' },
  { v: 'domov', cil: '#tyz-strom', n: 'Stromček hore', nalada: 'cheer', p: 'Týždeň je teraz schovaný v stromčeku. Ťukni naň a uvidíš dni, okruh, prehľad aj strom múdrosti. Tmavý stromček znamená, že dnešná téma ešte čaká.' },
  { v: 'domov', cil: '.objavuj-karta', n: 'Objavuj', nalada: 'happy', p: 'Kvízy, Iná téma a všetky oblasti tém nájdeš tu.' },
  { id: 'koniec', n: 'Hotovo!', nalada: 'cheer', tl: [['tema', 'Poďme na tému dňa!', 1], ['domov', 'Zavrieť']], p: 'Celého sprievodcu nájdeš kedykoľvek v karte Ja.' },
];
const Sprievodca = {
  el: null, i: 0, kroky: SPR_KROKY, o: {},
  ciel() { const k = this.kroky[this.i]; return !k || !k.cil ? null : typeof k.cil === 'function' ? k.cil() : document.querySelector(k.cil); },
  nadpis: k => k.n || (k.id === 'vitaj' ? (st.meno ? `Ahoj, ${st.meno}!` : 'Ahoj!') : 'Hotovo!'),
  veta: k => typeof k.p === 'function' ? k.p() : k.p,
  // o.brana: kroky na obrazovke tvorby profilu; o.zavriet: čo povedať, keď ho niekto zavrie
  start(kroky = SPR_KROKY, o = {}) {
    if (o.brana ? st.faza !== 'tvorba' : st.faza !== 'appka' || !st.dietaId || st.flow || st.hra || st.auto) return;
    const ine = document.querySelector('.novinky, .oslava');
    if (ine && ine.isConnected) { setTimeout(() => this.start(kroky, o), 700); return; } // počká, kým sa zavrie iné okno
    this.kroky = kroky; this.o = o;
    if (this.el) this.el.remove();
    const el = document.createElement('div');
    el.className = 'spr'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Sprievodca appkou');
    el.innerHTML = `<div class="spr-diera"></div><div class="spr-ruka">${SPR_RUKA}</div><div class="spr-bublina" aria-live="polite"><div class="spr-obsah"></div><div class="spr-pruh"><i></i></div></div>`;
    el.addEventListener('click', e => this.klik(e));
    document.body.appendChild(el);
    this.el = el; this.i = 0; this.ukaz();
    const tik = () => { if (this.el !== el) return; this.poloha(); requestAnimationFrame(tik); };
    requestAnimationFrame(tik);
  },
  ukaz() {
    const k = this.kroky[this.i], el = this.el, velka = !k.cil, n = this.kroky.length - 2, nadpis = this.nadpis(k);
    Hlas.stop();
    if (k.v && st.view !== k.v) go(k.v);
    el.classList.toggle('velka', velka); el.classList.toggle('tap', !!k.tap);
    const tl = k.tl ? k.tl.map(([a, text, hlavne]) => `<button class="btn wide ${hlavne ? 'cta' : 'dve'}" data-spr="${a}">${text}${hlavne ? ikn('sipka', 'za') : ''}</button>`).join('')
      : k.tap ? '' : `<button class="btn cta" data-spr="dalej">${this.i === n ? 'Hotovo' : 'Ďalej'}${ikn('sipka', 'za')}</button>`;
    el.querySelector('.spr-obsah').innerHTML = `${velka ? `<div class="spr-hviezdy">${[[6, 30], [86, 22], [90, 58], [4, 66], [72, 84], [18, 88]].map(([x, y], i) => `<i style="left:${x}%;top:${y}%;--k:${i}">${STAR()}</i>`).join('')}</div>` : ''}
      <div class="spr-hlava"><button class="spr-sova" data-spr="sova" aria-label="Sovička Múdra">${owl(k.nalada || 'hi')}</button>
        <div class="spr-nadpis">${velka ? '' : `<small>${this.i} z ${n}</small>`}<b>${velka ? [...nadpis].map((ch, i) => `<span style="--k:${i}">${esc(ch)}</span>`).join('') : esc(nadpis)}</b></div>
        <button class="btn kruh dve spr-citaj" data-spr="citaj" aria-label="Prečítať nahlas">${ikn('zvuk')}</button>
        ${k.id === 'koniec' ? '' : `<button class="btn kruh dve spr-x" data-spr="zavri" aria-label="Zavrieť sprievodcu">${ikn('zavriet')}</button>`}</div>
      <p class="spr-text">${this.veta(k).split(' ').map((w, i) => `<span style="--k:${i}">${esc(w)}</span>`).join(' ')}</p>
      ${k.tap ? `<p class="spr-tip"><i class="spr-tip-ruka">${SPR_RUKA}</i>${this.kroky === SPR_KROKY ? 'Ťukni' : 'Ťuknite'} na svietiace tlačidlo</p>` : ''}
      ${tl ? `<div class="spr-tlacidla">${tl}</div>` : ''}`;
    const b = el.querySelector('.spr-bublina'); b.classList.remove('nova', 'tras'); void b.offsetWidth; b.classList.add('nova');
    el.querySelector('.spr-pruh i').style.width = Math.round(this.i / (n + 1) * 100) + '%';
    if (k.id === 'vitaj') { Zvuk.play('hoot'); setTimeout(() => FX.burst(innerWidth / 2, innerHeight * .3, 24, ['star', 'dot']), 250); }
    else if (k.oslava) { Zvuk.play('win'); FX.ohnostroj(3); setTimeout(() => FX.rain(70), 500); }
    else Zvuk.play('pop');
    const f = el.querySelector('.spr-tlacidla .cta');
    if (f && f.focus) setTimeout(() => f.focus({ preventScroll: true }), 60);
    if (k.cil) setTimeout(() => this.posun(), 80);
  },
  // posunie stránku tak, aby bolo vidno svietiace miesto aj bublinu pod ním
  posun() {
    const c = this.ciel(), b = this.el && this.el.querySelector('.spr-bublina');
    if (!c || !b || !c.closest || c.closest('.nav')) return;
    const r = c.getBoundingClientRect(), cel = r.height + b.offsetHeight + 40, hore = cel < innerHeight ? (innerHeight - cel) / 2 + 12 : 12;
    scrollTo({ top: Math.max(0, scrollY + r.top - hore), behavior: 'smooth' });
  },
  // každý snímok: kruh, bublina a ruka idú za tlačidlom (aj keď sa stránka posúva)
  poloha() {
    const el = this.el, k = this.kroky[this.i], c = this.ciel(), D = el.querySelector('.spr-diera'), B = el.querySelector('.spr-bublina'), H = innerHeight, bh = B.offsetHeight;
    if (!c) { Object.assign(D.style, { left: innerWidth / 2 + 'px', top: H / 2 + 'px', width: '0px', height: '0px' }); B.style.top = Math.max(12, (H - bh) / 2) + 'px'; return; }
    const r = c.getBoundingClientRect(), x = r.left - 8, y = r.top - 8, w = r.width + 16, h = r.height + 16;
    Object.assign(D.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: Math.min(h / 2, 26) + 'px' });
    B.style.top = (y + h + 14 + bh < H - 8 ? y + h + 14 : y - 14 - bh > 8 ? y - 14 - bh : H - bh - 12) + 'px';
    if (k.tap) Object.assign(el.querySelector('.spr-ruka').style, { left: r.left + r.width / 2 - 20 + 'px', top: r.top + r.height * .35 - 2 + 'px' });
  },
  klik(e) {
    e.stopPropagation();
    const k = this.kroky[this.i], b = e.target.closest('[data-spr]');
    if (b) {
      const a = b.dataset.spr;
      if (a === 'dalej') this.dalej();
      else if (a === 'zavri') { Zvuk.play('tap'); this.zavri(); }
      else if (a === 'citaj') Hlas.citaj(this.nadpis(k) + ' ' + this.veta(k), b);
      else if (a === 'sova') {
        Zvuk.play('hoot'); vibruj(30);
        const o = b.querySelector('.owl'); if (o) { o.classList.remove('jump'); void o.getBoundingClientRect(); o.classList.add('jump'); }
        const [x, y] = stred(b); FX.burst(x, y, 14, ['star', 'dot'], 6);
      } else if (a === 'tema') { this.zavri(true); startTema(temaDna().id); }
      else if (a === 'hotovo') { Zvuk.play('tap'); this.zavri(true); }
      else if (a === 'dieta') { this.zavri(true); setTimeout(() => this.start(SPR_KROKY), 400); }
      else if (a === 'rodicucet') { this.zavri(true); Zvuk.play('whoosh'); Rodic.chod('rodicTvorba'); }
      else if (a === 'domov') { this.zavri(true); Zvuk.play('whoosh'); go('domov'); }
      return;
    }
    if (e.target.closest('.spr-bublina') || !k.cil) return;
    const c = this.ciel();
    if (c) {
      const r = c.getBoundingClientRect();
      if (e.clientX > r.left - 10 && e.clientX < r.right + 10 && e.clientY > r.top - 10 && e.clientY < r.bottom + 10) { if (k.tap) this.tukni(); else this.dalej(); return; }
    }
    // ťuknutie vedľa: bublina sa zatrasie
    Zvuk.play('boing'); vibruj(20);
    const B = this.el.querySelector('.spr-bublina'); B.classList.remove('tras'); void B.offsetWidth; B.classList.add('tras');
  },
  tukni() {
    const k = this.kroky[this.i], c = this.ciel();
    if (c) { const [x, y] = stred(c); FX.burst(x, y, 16, ['star', 'dot'], 6); }
    if (k.pred) k.pred();
    vibruj(20); go(k.tap); this.dalej();
  },
  dalej() {
    if (this.i >= this.kroky.length - 1) { this.zavri(true); return; }
    let i = this.i + 1;
    while (i < this.kroky.length - 1 && this.kroky[i].ak && !this.kroky[i].ak()) i++; // krok, ktorý sa netýka (napr. appka už je na ploche)
    this.i = i; this.ukaz();
  },
  zavri(hotovo) {
    const el = this.el; if (!el) return;
    this.el = null; Hlas.stop();
    el.classList.add('pryc'); setTimeout(() => el.remove(), 350);
    if (!hotovo) toast(this.o.zavriet || (this.kroky === SPR_KROKY ? 'Sprievodcu spustíš znova v karte Ja.' : 'Sprievodcu pre dieťa nájdete v karte Ja.'));
  },
};
document.addEventListener('submit', e => {
  const f = e.target.closest && e.target.closest('[data-soc-text-form]'); if (!f) return;
  e.preventDefault();
  const inp = f.querySelector('input'), txt = inp.value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200), C = window.Cloud;
  if (!txt || !C || !C.soc || Date.now() - socPosledna < 350) return;
  // písanie musí mať zapnuté rodič oboch detí (pravidlá to kontrolujú aj na serveri)
  const So = socC(), pf = So && So.profily[st.priatel];
  if (!So || !So.profil || !So.profil.pisanie || !pf || !pf.pisanie) { toast('Voľné písanie zapína rodič.'); return; }
  const kont = socKontrola(txt);
  if (kont) {
    Zvuk.play('bad'); vibruj(30); inp.value = '';
    if (kont === 'slova') socZablokovane(So.pid, txt);
    toast(kont === 'slova' ? 'Takú správu poslať nemôžeš. Rodič ju uvidí. Skús iné slová.' : 'Telefónne čísla, e-maily a odkazy posielať nemôžeš.');
    return;
  }
  socPosledna = Date.now(); inp.value = ''; Zvuk.play('tap'); vibruj(15);
  const ch = document.getElementById('chat');
  if (ch) { const pr = ch.querySelector('.dm-prazdny'); if (pr) pr.remove(); ch.insertAdjacentHTML('beforeend', `<div class="msg moja posl odosiela">${spravaObsah({ x: txt })}</div>`); ch.scrollTop = ch.scrollHeight; }
  socAkcia(C.soc.posli(st.priatel, { x: txt }), null, () => socZmena());
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && Sprievodca.el) Sprievodca.zavri(); });
// karta Tento týždeň sa dá otvoriť aj klávesnicou
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-strom]')) { e.preventDefault(); Strom.ukaz(); } });
