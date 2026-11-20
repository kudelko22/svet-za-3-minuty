/* ===== 5.1: Úvod do dedinky (namiesto okna „Čo je nové“ pri prvom otvorení verzie 5.1) =====
   Krátke kreslené „video“ (~17 s): Múdra na Domove ukáže smerovník → obláčiky → kamera prejde dedinkou (strom múdrosti,
   budovy hier, zvieratká, dym z komínov) → ukážka stavania (domček dopadne, zmení farbu) → truhlička z Cesty mesiaca sa otvorí →
   lístok s novinkami 5.1 a tlačidlami „Ideme do dedinky“ a „Neskôr“.
   Rovnako ako premena 5.0 (23-premena.js): jedna časová os vo Web Animations (len transform a opacity), každý prvok má jednu
   animáciu dĺžky UD_KONIEC, takže Preskočiť = dokončiť všetky animácie. Konečný stav platí aj v CSS (63-uvod-dedinka.css),
   preto pri obmedzení pohybu alebo bez Web Animations sa ukáže rovno posledný obraz.
   Skladá sa len z hotových kresieb (Domov.krajina, Domov.smerovnik, DedScena, dedinkaVec, DedCesta.truhlaSvg, mudra);
   ich súbory sa tu nemenia. Spúšťa ho Novinky.skontroluj (18-zaklad-novinky.js), raz na zariadenie, keď VERZIA_NAZOV začína „5.1“.
   Skúška: adresa s ?uvod51 (celé) alebo ?uvod51=tichy (len koniec); pri skúške sa nič nezapisuje. Opis v uvod51.md. */
const UVOD51_OD = 69; // prvé číslo VERZIA_APPKY pre 5.1 (5.0.1 = 68): od neho sa berú NOVINKY na koniec úvodu
const UD_KONIEC = 17600;
// novinky na koniec, kým v NOVINKY nie sú vety pre 5.1 (v >= UVOD51_OD)
const UD_NOVINKY = [
  { obr: () => dedinkaKresby.svg('domov', { popis: '' }), n: 'Moja dedinka', p: 'Tvoja vlastná krajina. V strede rastie strom múdrosti.' },
  { obr: () => ikn('hry'), n: 'Každá budova je hra', p: 'Ťukni na budovu a hraj. Pribudli aj nové hry.' },
  { obr: () => dedinkaKresby.svg('chalupka', { popis: '' }), n: 'Stavaj a farbi', p: 'Za hviezdy si kúp domčeky, stromy a zvieratká.' },
  { obr: () => DedCesta.truhlaSvg('drevo'), n: 'Cesta mesiaca', p: 'Každá hviezda je krok. Na ceste čakajú truhličky.' },
];

const Uvod51 = {
  el: null, anim: [], casy: [], koniec: false,
  plati(n = VERZIA_NAZOV) { return /^5\.1(\.|$)/.test(String(n)); },
  skuska() { try { const m = location.search.match(/[?&]uvod51(?:=(\w+))?/); return m ? (m[1] || 'cely') : ''; } catch (e) { return ''; } },
  // má sa ukázať? (verzia 5.1, na tomto zariadení ešte nebol, dieťa poznalo staršiu verziu)
  caka(odkedy) { return this.plati() && !S.get('videl-uvod51', 0) && odkedy < VERZIA_APPKY; },
  zapis() { if (this.plati()) S.set('videl-uvod51', 1); },
  pohyb() { try { return !matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return true; } },
  // z = novinky na koniec (prázdne = UD_NOVINKY); o.tichy = bez pohybu
  spusti(z, o = {}) {
    try {
      this.zrus();
      this.z = (z && z.length ? z : UD_NOVINKY).slice(0, 5); this.o = o;
      this.postav();
      if (!o.tichy && this.pohyb() && this.el.animate) this.hraj(); else this.naKoniec(true);
      return true;
    } catch (e) {
      console.error('Úvod 5.1:', e);
      this.zrus();
      return false;
    }
  },
  // rozmer dedinky: výška scény podľa obrazovky, na širokom displeji aspoň celá šírka
  miera() {
    const W = innerWidth, H = innerHeight, vh = DS_H - DS_Y0;
    let k = Math.min(H * .86, 760) / vh; if (DS_W * k < W) k = W / DS_W;
    return { W, H, k, sw: DS_W * k, sh: vh * k, top: H - vh * k };
  },
  // kamera: bod (x, y) scény v strede šírky, priblíženie z okolo neho (nikdy nevidno okraj scény)
  cam(x, y, z = 1) {
    const m = this.mera || this.miera(), px = x * m.k, py = m.top + (y - DS_Y0) * m.k;
    const tx = Math.max(m.W - m.sw * z, Math.min(0, m.W / 2 - px * z)), ty = py * (1 - z);
    return `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${z})`;
  },
  // miesto pre ukážku stavania: prvé voľné zo zoznamu (u dieťaťa s plnou dedinkou sa domček ukáže aj tak)
  volne(kl) { try { return !Dedinka.obsadene(kl); } catch (e) { return true; } },
  dedinka() {
    const bez = s => String(s).replace(/ tabindex="0"/g, '').replace(/ role="button"/g, '').replace(/ data-ded=/g, ' data-ud-x=');
    const spot = ['r2c5', 'r2c6', 'r1c5', 'r2c7'].find(k => this.volne(k)) || 'r2c5', m = dedMiesto(spot);
    this.spot = m;
    const zv = [['r2c6', 'ovca'], ['r1c5', 'sliepka'], ['r2c7', 'kvety'], ['r1c6', 'zajac']].filter(([k]) => k !== spot && this.volne(k)).slice(0, 3)
      .map(([k, id], i) => { const p = dedMiesto(k); return `<g class="ud-zv" style="--i:${i}">${dsZem(p.x, p.y, p.s, 22)}${dedinkaVec(id, { x: p.x, y: p.y, s: p.s, zrkadlo: i % 2 === 1 })}</g>`; }).join('');
    const prach = [-34, -14, 14, 34].map((dx, i) => `<circle cx="${(m.x + dx * m.s).toFixed(1)}" cy="${(m.y - 4 - (i % 2) * 6).toFixed(1)}" r="${(9 * m.s).toFixed(1)}" fill="var(--dv-oblak)" stroke-width="1.4"/>`).join('');
    const isk = [[-40, -86], [38, -96], [0, -122], [-52, -40], [50, -46]].map(([dx, dy]) => `<path class="ud-isk" d="M${m.x + dx * m.s} ${m.y + dy * m.s}m0-9l2.6 6.4 6.4 2.6-6.4 2.6-2.6 6.4-2.6-6.4-6.4-2.6 6.4-2.6z" fill="var(--sun)" stroke-width="1.4"/>`).join('');
    const demo = `<g class="ud-demo">${zv}
      <ellipse class="ud-krug" cx="${m.x}" cy="${m.y}" rx="${38 * m.s}" ry="${11 * m.s}" fill="var(--sun-l)" stroke="var(--sun-d)" stroke-width="3" stroke-dasharray="6 5"/>
      <g class="ud-pad ud-pad1">${dsZem(m.x, m.y, m.s, 38)}${dedinkaVec('chalupka', { x: m.x, y: m.y, s: m.s })}</g>
      <g class="ud-pad ud-pad2">${dsZem(m.x, m.y, m.s, 38)}${dedinkaVec('chalupka', { x: m.x, y: m.y, s: m.s, farby: { stena: 'coral-l', strecha: 'violet', dvere: 'teal' } })}</g>
      <g class="ud-prach">${prach}</g>${isk}</g>`;
    return `<svg class="ud-svg" viewBox="0 ${DS_Y0} ${DS_W} ${DS_H - DS_Y0}" preserveAspectRatio="xMidYMax slice"><g stroke-linejoin="round" stroke-linecap="round">
      ${bez(DedScena.krajina(DedScena.chodniky()))}<g stroke="var(--ink)" stroke-width="2.2">${bez(DedScena.veci())}${demo}</g></g></svg>`;
  },
  postav() {
    const t = tD(), meno = st.meno ? esc(st.meno) : '';
    let kraj = ''; try { kraj = Domov.krajina(t, false); } catch (e) { kraj = ''; }
    const smer = Domov.smerovnik().replace(/^<button[^>]*>/, '').replace(/<\/button>$/, '');
    const ob = (k, x, y, w) => `<i style="--x:${x}%;--y:${y}%;--w:${w}vmax">${dedinkaKresby.svg(k, { popis: '' })}</i>`;
    const tit = [['radost', 'Toto je tvoja dedinka. V strede rastie strom múdrosti.'], ['ahoj', 'Každá budova je hra. Ťukni a hraj!'],
      ['oslava', 'Za hviezdy si stavaj domčeky a vyfarbi si ich.'], ['radost', 'Na Ceste mesiaca čakajú truhličky s darčekmi.']]
      .map(([v, s], i) => `<div class="ud-tit" data-i="${i}"><span class="ud-tit-m">${mudra(v)}</span><p class="odkaz">${s}</p></div>`).join('');
    const veci = ['jablon', 'macka', 'vlajocky'].map(k => `<span class="ud-tr-v">${dedinkaKresby.RAMCEK[k] ? dedinkaKresby.svg(k, { popis: '' }) : ikn('hviezda')}</span>`).join('');
    const pol = this.z.map(n => `<li class="ud-pol"><span class="ud-obr">${(() => { try { return n.obr(); } catch (e) { return ikn('hviezda'); } })()}</span><div><b>${n.n}</b><small>${n.p}</small></div></li>`).join('');
    const el = document.createElement('div');
    el.className = 'ud';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Svetom 5.1: Moja dedinka');
    el.innerHTML = `
      <div class="ud-scena" aria-hidden="true">
        <div class="ud-ded"><div class="ud-kam">${this.dedinka()}</div></div>
        <div class="ud-dom">
          <div class="ud-dom-kraj">${kraj}</div>
          <div class="ud-dom-ob"><i class="ud-mrak" style="--x:18%;--y:34%;--w:96px">${dedinkaKresby.svg('oblak1', { popis: '' })}</i><i class="ud-mrak" style="--x:80%;--y:52%;--w:76px">${dedinkaKresby.svg('oblak2', { popis: '' })}</i></div>
          <div class="ud-dom-zn">${logo('ud-logo')}<span class="pec ud-pec">Novinka 5.1</span></div>
          <div class="ud-dom-st">
            <p class="odkaz ud-rec ud-rec1">${meno ? `Ahoj, ${meno}!` : 'Ahoj!'} Mám pre teba prekvapenie.</p>
            <p class="odkaz ud-rec ud-rec2">Pozri, nová cesta. Poď so mnou!</p>
            <span class="ud-dom-mud">${mudra('ahoj')}</span>
            <span class="ud-smer">${smer}</span>
          </div>
        </div>
        ${tit}
        <div class="ud-tr">
          <div class="ud-tma"></div>
          <svg class="ud-tr-cesta" viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet"><path d="M-10 100C60 40 120 120 180 70S260 20 310 40" fill="none" stroke="var(--dv-cesta)" stroke-width="16" stroke-linecap="round"/><path d="M-10 100C60 40 120 120 180 70S260 20 310 40" fill="none" stroke="var(--sun)" stroke-width="5" stroke-dasharray=".1 18" stroke-linecap="round"/></svg>
          <div class="ud-tr-t"><div class="ud-tr-luce"></div><span class="ud-tr-z">${DedCesta.truhlaSvg('zlato')}</span><span class="ud-tr-o">${DedCesta.truhlaSvg('zlato', true)}</span>${veci}</div>
        </div>
        <div class="ud-ob"><div class="ud-ob-l">${ob('oblak2', 30, 6, 46)}${ob('oblak1', 62, 30, 54)}${ob('oblak2', 34, 56, 50)}${ob('oblak1', 60, 82, 56)}</div>
          <div class="ud-ob-p">${ob('oblak1', 38, 16, 52)}${ob('oblak2', 66, 42, 48)}${ob('oblak1', 40, 68, 56)}${ob('oblak3', 64, 94, 42)}</div><b class="ud-ob-n">Moja dedinka</b></div>
      </div>
      <div class="ud-koniec">
        <article class="listok ud-listok">
          <div class="ud-l-hlava"><span class="ud-l-mud">${mudra('oslava')}</span><div><small>Svetom ${this.plati() ? esc(VERZIA_NAZOV) : '5.1'}</small><h2 class="n1">Moja dedinka</h2></div></div>
          <ul class="ud-zoznam">${pol}</ul>
          <div class="perf"></div>
          <div class="ud-dole"><button class="btn wide" data-ud-ide>Ideme do dedinky${ikn('sipka', 'za')}</button><button class="btn wide dve" data-ud-ok>Neskôr</button></div>
        </article>
      </div>
      <button class="btn maly dve ud-preskoc" data-ud-preskoc>Preskočiť${ikn('sipka', 'za')}</button>`;
    document.body.appendChild(el);
    this.el = el;
    if (document.documentElement) document.documentElement.classList.add('ud-bezi');
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.closest('[data-ud-preskoc]')) { this.zvuk('tap'); this.naKoniec(false); }
      else if (e.target.closest('[data-ud-ide]')) { this.zvuk('tap'); this.zavri(true); }
      else if (e.target.closest('[data-ud-ok]')) { this.zvuk('tap'); this.zavri(false); }
    });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); if (this.koniec) this.zavri(false); else this.naKoniec(false); } });
    this.naResize = () => { if (this.koniec) this.umiestni(); };
    addEventListener('resize', this.naResize);
    this.umiestni();
    try { el.querySelector('[data-ud-preskoc]').focus({ preventScroll: true }); } catch (e) { /* bez fokusu */ }
  },
  // veľkosť dedinky a kamera v konečnom stave (strom v strede)
  umiestni() {
    if (!this.el) return;
    this.mera = this.miera();
    const kam = this.el.querySelector('.ud-kam'), svg = this.el.querySelector('.ud-svg');
    kam.style.width = Math.round(this.mera.sw) + 'px'; svg.style.height = Math.round(this.mera.sh) + 'px';
    if (this.koniec) this.anim.filter(a => a.effect && a.effect.target === kam).forEach(a => a.cancel());
    kam.style.transform = this.cam(DS_STROM[0] + DS_X, DS_STROM[1]);
  },
  os(el, body) {
    if (!el) return;
    const kf = [];
    if (body[0][0] > 0) kf.push({ offset: 0, ...body[0][1] });
    let pred = 0;
    body.forEach(([t, v, e]) => { pred = Math.max(pred, Math.min(1, t / UD_KONIEC)); kf.push({ offset: pred, ...v, ...(e ? { easing: e } : {}) }); });
    const posl = body[body.length - 1];
    if (posl[0] < UD_KONIEC) kf.push({ offset: 1, ...posl[1] });
    const a = el.animate(kf, { duration: UD_KONIEC, fill: 'both' });
    this.anim.push(a);
    return a;
  },
  zvuk(n) { try { Zvuk.play(n); } catch (e) { /* bez zvuku */ } },
  hraj() {
    const E = this.el, q = s => E.querySelector(s), qa = s => [...E.querySelectorAll(s)];
    const SPR = 'cubic-bezier(.25,1.55,.5,1)', IO = 'cubic-bezier(.65,0,.35,1)', OUT = 'cubic-bezier(.2,.8,.3,1)', PAD = 'cubic-bezier(.55,0,1,.45)';
    const V = { opacity: 1 }, N = { opacity: 0 }, o = (op, tr) => ({ opacity: op, transform: tr });
    const SX = DS_X + DS_STROM[0], SY = DS_STROM[1], hry = (() => { try { return DedScena.miestaHier().slice(0, 2); } catch (e) { return []; } })();
    const xH = hry.length ? hry.reduce((a, m) => a + m.x, 0) / hry.length - 30 : SX - 140, sp = this.spot;
    this.os(E, [[0, N], [300, V]]);
    // 1. Domov: Múdra pozdraví a ukáže smerovník
    this.os(q('.ud-dom'), [[0, V], [4300, V], [4301, N]]);
    this.os(q('.ud-dom-mud'), [[0, o(0, 'translateY(40px) scale(.6)')], [300, o(0, 'translateY(40px) scale(.6)'), SPR], [800, o(1, 'translateY(0) scale(1)')], [1500, o(1, 'translateY(0) rotate(-4deg)')], [1800, o(1, 'translateY(0) rotate(3deg)')],
      [2100, o(1, 'translateY(0) rotate(0deg)')], [3200, o(1, 'translate(0, 0)'), 'ease-out'], [3450, o(1, 'translate(14px, -26px) rotate(8deg)'), 'ease-in'], [3700, o(1, 'translate(28px, 0) rotate(0deg)')]]);
    this.os(q('.ud-dom-zn'), [[0, o(0, 'translateY(-20px) scale(.8)')], [200, o(0, 'translateY(-20px) scale(.8)'), SPR], [700, o(1, 'translateY(0) scale(1)')]]);
    this.os(q('.ud-pec'), [[0, o(0, 'scale(1.8) rotate(-14deg)')], [850, o(0, 'scale(1.8) rotate(-14deg)'), 'cubic-bezier(.5,0,.75,0)'], [1100, o(1, 'scale(1) rotate(-4deg)')]]);
    qa('.ud-mrak').forEach((m, i) => this.os(m, [[0, { transform: 'translateX(0)' }], [4300, { transform: 'translateX(' + (i ? -36 : 44) + 'px)' }]]));
    this.os(q('.ud-rec1'), [[0, o(0, 'scale(.6)')], [700, o(0, 'scale(.6)'), SPR], [1100, o(1, 'scale(1)')], [2200, o(1, 'scale(1)'), 'ease-in'], [2400, o(0, 'scale(.85)')]]);
    this.os(q('.ud-smer'), [[0, o(0, 'scale(0) rotate(0deg)')], [2200, o(0, 'scale(0) rotate(0deg)'), SPR], [2700, o(1, 'scale(1) rotate(0deg)')], [2900, o(1, 'scale(1) rotate(-6deg)')], [3100, o(1, 'scale(1) rotate(5deg)')], [3300, o(1, 'scale(1) rotate(0deg)')]]);
    this.os(q('.ud-rec2'), [[0, o(0, 'scale(.6)')], [2500, o(0, 'scale(.6)'), SPR], [2900, o(1, 'scale(1)')], [3700, o(1, 'scale(1)'), 'ease-in'], [3900, o(0, 'scale(.85)')]]);
    // 2. obláčiky zatiahnu a roztiahnu, pod nimi sa objaví dedinka
    const OB = 'cubic-bezier(.3,0,.2,1)';
    this.os(q('.ud-ob'), [[0, N], [3650, N], [3700, V], [5300, V], [5350, N]]);
    this.os(q('.ud-ob-l'), [[0, { transform: 'translateX(-105%)' }], [3700, { transform: 'translateX(-105%)' }, OB], [4300, { transform: 'translateX(0)' }], [4600, { transform: 'translateX(0)' }, 'ease-in'], [5300, { transform: 'translateX(-105%)' }]]);
    this.os(q('.ud-ob-p'), [[0, { transform: 'translateX(105%)' }], [3700, { transform: 'translateX(105%)' }, OB], [4300, { transform: 'translateX(0)' }], [4600, { transform: 'translateX(0)' }, 'ease-in'], [5300, { transform: 'translateX(105%)' }]]);
    this.os(q('.ud-ob-n'), [[0, o(0, 'scale(.7)')], [3950, o(0, 'scale(.7)'), SPR], [4350, o(1, 'scale(1)')], [4700, o(1, 'scale(1)'), 'ease-in'], [5000, o(0, 'scale(1.1)')]]);
    this.os(q('.ud-ded'), [[0, N], [4300, N], [4301, V]]);
    // 3. kamera: strom zblízka → oddialenie → budovy hier → miesto stavania → späť na strom
    this.os(q('.ud-kam'), [[0, { transform: this.cam(SX, SY, 1.35) }], [4300, { transform: this.cam(SX, SY, 1.35) }, IO], [6400, { transform: this.cam(SX, SY, 1) }],
      [7000, { transform: this.cam(SX, SY, 1) }, IO], [8000, { transform: this.cam(xH, 470, 1) }], [9800, { transform: this.cam(xH, 470, 1) }, IO],
      [10800, { transform: this.cam(sp.x, sp.y, 1.15) }], [15000, { transform: this.cam(sp.x, sp.y, 1.15) }, IO], [16300, { transform: this.cam(SX, SY, 1) }]]);
    qa('.ud-svg .ds-hra').forEach((g, i) => { const t0 = 8100 + i * 260; this.os(g, [[0, { transform: 'translateY(0) scale(1)' }], [t0, { transform: 'translateY(0) scale(1)' }, 'ease-out'], [t0 + 180, { transform: 'translateY(-14px) scale(1.06)' }, 'ease-in'], [t0 + 380, { transform: 'translateY(0) scale(1)' }]]); });
    // titulky s Múdrou hore
    [[5000, 7000], [7600, 9900], [10400, 13100], [13700, 15900]].forEach(([a, b], i) => this.os(q(`.ud-tit[data-i="${i}"]`), [[0, o(0, 'translateY(-16px) scale(.9)')], [a, o(0, 'translateY(-16px) scale(.9)'), SPR], [a + 400, o(1, 'translateY(0) scale(1)')], [b - 250, o(1, 'translateY(0) scale(1)'), 'ease-in'], [b, o(0, 'translateY(-10px) scale(1)')]]));
    // 4. stavanie: krúžok, domček dopadne, prach, nová farba
    this.os(q('.ud-demo'), [[0, V], [15300, V], [15800, N]]);
    qa('.ud-zv').forEach((g, i) => { const t0 = 10900 + i * 500; this.os(g, [[0, { transform: 'translateY(0)' }], [t0, { transform: 'translateY(0)' }, 'ease-out'], [t0 + 160, { transform: 'translateY(-10px)' }, 'ease-in'], [t0 + 320, { transform: 'translateY(0)' }], [t0 + 1500, { transform: 'translateY(0)' }, 'ease-out'], [t0 + 1660, { transform: 'translateY(-10px)' }, 'ease-in'], [t0 + 1820, { transform: 'translateY(0)' }]]); });
    this.os(q('.ud-krug'), [[0, o(0, 'scale(.5)')], [10700, o(0, 'scale(.5)'), SPR], [11000, o(1, 'scale(1)')], [11150, o(.7, 'scale(1.15)')], [11300, o(1, 'scale(1)')], [11500, o(0, 'scale(1.2)')]]);
    this.os(q('.ud-pad1'), [[0, o(0, 'translateY(-300px)')], [11199, o(0, 'translateY(-300px)')], [11200, o(1, 'translateY(-300px)'), PAD], [11600, o(1, 'translateY(0) scale(1.08, .9)'), 'ease-out'], [11760, o(1, 'translateY(-10px) scale(.96, 1.05)'), 'ease-in'], [11900, o(1, 'translateY(0) scale(1)')], [12400, o(1, 'translateY(0) scale(1)')], [12550, o(0, 'translateY(0) scale(1)')]]);
    this.os(q('.ud-pad2'), [[0, o(0, 'scale(1)')], [12400, o(0, 'scale(1)'), 'ease-out'], [12550, o(1, 'scale(1.08)'), SPR], [12850, o(1, 'scale(1)')]]);
    qa('.ud-prach circle').forEach((c, i) => this.os(c, [[0, o(0, 'scale(.2)')], [11600, o(0, 'scale(.2)')], [11620, o(1, 'scale(.6)'), OUT], [12200 + i * 40, o(0, `translate(${(i - 1.5) * 14}px, -8px) scale(1.6)`)]]));
    qa('.ud-isk').forEach((c, i) => this.os(c, [[0, o(0, 'scale(0) rotate(0deg)')], [12450 + i * 50, o(0, 'scale(0) rotate(0deg)'), SPR], [12750 + i * 50, o(1, 'scale(1.2) rotate(40deg)')], [13300, o(0, 'scale(.6) rotate(90deg)')]]));
    // 5. Cesta mesiaca: truhlička sa zatrasie a otvorí
    this.os(q('.ud-tma'), [[0, N], [13100, N], [13500, { opacity: .6 }], [15800, { opacity: .6 }], [16300, { opacity: .35 }]]);
    this.os(q('.ud-tr-cesta'), [[0, o(0, 'translateY(30px)')], [13300, o(0, 'translateY(30px)'), OUT], [13800, o(1, 'translateY(0)')], [15800, o(1, 'translateY(0)')], [16200, o(0, 'translateY(20px)')]]);
    this.os(q('.ud-tr-t'), [[0, o(0, 'translateY(40px) scale(.2) rotate(0deg)')], [13500, o(0, 'translateY(40px) scale(.2) rotate(0deg)'), SPR], [14000, o(1, 'translateY(0) scale(1) rotate(0deg)')],
      [14150, o(1, 'translateY(0) scale(1) rotate(-6deg)')], [14300, o(1, 'translateY(0) scale(1) rotate(6deg)')], [14450, o(1, 'translateY(0) scale(1) rotate(-4deg)')], [14600, o(1, 'translateY(0) scale(1) rotate(0deg)'), SPR],
      [14800, o(1, 'translateY(0) scale(1.1) rotate(0deg)')], [15800, o(1, 'translateY(0) scale(1) rotate(0deg)'), 'ease-in'], [16200, o(0, 'translateY(0) scale(.7) rotate(0deg)')]]);
    this.os(q('.ud-tr-z'), [[0, V], [14700, V], [14701, N]]);
    this.os(q('.ud-tr-o'), [[0, N], [14700, N], [14701, V]]);
    this.os(q('.ud-tr-luce'), [[0, o(0, 'scale(.3) rotate(0deg)')], [14700, o(0, 'scale(.3) rotate(0deg)'), OUT], [15000, o(1, 'scale(1) rotate(30deg)')], [15800, o(1, 'scale(1.1) rotate(80deg)')], [16200, o(0, 'scale(1.2) rotate(100deg)')]]);
    qa('.ud-tr-v').forEach((v, i) => { const dx = (i - 1) * 92, dy = i === 1 ? -132 : -96, t0 = 14800 + i * 120;
      this.os(v, [[0, o(0, 'translate(0, 10px) scale(.3)')], [t0, o(0, 'translate(0, 10px) scale(.3)'), SPR], [t0 + 450, o(1, `translate(${dx}px, ${dy}px) scale(1)`)], [15800, o(1, `translate(${dx}px, ${dy}px) scale(1)`), 'ease-in'], [16200, o(0, `translate(${dx}px, ${dy - 20}px) scale(.8)`)]]); });
    // 6. koniec: lístok s novinkami
    this.os(q('.ud-koniec'), [[0, N], [16100, N], [16400, V]]);
    this.os(q('.ud-listok'), [[0, o(0, 'translateY(60px)')], [16100, o(0, 'translateY(60px)'), OUT], [16700, o(1, 'translateY(0)')]]);
    qa('.ud-pol').forEach((el, i) => this.os(el, [[0, o(0, 'translateX(-14px)')], [16450 + i * 110, o(0, 'translateX(-14px)'), OUT], [16800 + i * 110, o(1, 'translateX(0)')]]));
    this.os(q('.ud-dole'), [[0, o(0, 'scale(.85)')], [17000, o(0, 'scale(.85)'), SPR], [17450, o(1, 'scale(1)')]]);
    this.os(q('.ud-preskoc'), [[0, V], [16000, V], [16300, N]]);
    [[300, 'hoot'], [2300, 'pop'], [3700, 'whoosh'], [8100, 'tap'], [11600, 'boing'], [12450, 'star'], [14700, 'coin'], [16400, 'cink']].forEach(([ms, n]) => this.casy.push(setTimeout(() => this.zvuk(n), ms)));
    const a0 = this.anim[0];
    if (a0) a0.finished.then(() => this.hotovo(), () => {});
  },
  // koniec: buď po dohraní, alebo hneď (Preskočiť, obmedzenie pohybu)
  naKoniec(hned) {
    if (!this.el) return;
    this.casy.forEach(clearTimeout); this.casy = [];
    if (this.anim.length) { this.anim.forEach(a => { try { a.finish(); } catch (e) { /* nič */ } }); }
    else if (hned) this.el.classList.add('ud-tichy');
    this.hotovo();
  },
  hotovo() {
    if (!this.el || this.koniec) return;
    this.koniec = true;
    this.el.classList.add('ud-hotovo');
    const p = this.el.querySelector('[data-ud-preskoc]'); if (p) p.hidden = true;
    this.umiestni();
    try { this.el.querySelector('[data-ud-ide]').focus({ preventScroll: true }); } catch (e) { /* bez fokusu */ }
  },
  // ide = otvoriť dedinku (pod lístkom už je, takže stačí zmiznúť)
  zavri(ide) {
    const el = this.el; if (!el) return;
    el.classList.add('pryc');
    setTimeout(() => { this.zrus(); if (ide) try { go('dedinka'); } catch (e) { /* nič */ } }, 320);
  },
  zrus() {
    this.casy.forEach(clearTimeout); this.casy = [];
    this.anim.forEach(a => { try { a.cancel(); } catch (e) { /* nič */ } }); this.anim = [];
    try { if (this.naResize) removeEventListener('resize', this.naResize); } catch (e) { /* test bez prehliadača */ }
    if (this.el) this.el.remove();
    this.el = null; this.koniec = false; this.mera = null; this.naResize = null;
    if (document.documentElement) document.documentElement.classList.remove('ud-bezi');
  },
};
