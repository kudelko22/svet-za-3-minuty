/* ===== 5.0: Úvodná premena (namiesto okna „Čo je nové“ pri prvom otvorení verzie 5.0) =====
   Stará appka 4.x so starou sovou → sova sa vyvinie v Múdru → od nej sa premení všetko okolo → záber sa oddiali na lístok
   a vypíšu sa novinky 5.0. Celé je to jedna časová os (Web Animations, len transform a opacity): každý prvok má jednu animáciu
   dĺžky PM_KONIEC, takže Preskočiť = dokončiť všetky animácie a hneď je koniec. Pri obmedzení pohybu sa ukáže rovno koniec.
   Spúšťa ju Novinky.skontroluj (18-zaklad-novinky.js). Na skúšku: adresa s ?premena (celá) alebo ?premena=tichy (len koniec);
   na skúšku sa nič nezapisuje. Opis v premena-50.md. */
const PREMENA_V = 67; // číslo verzie 5.0 (VERZIA_APPKY); premenu dostane ten, kto naposledy videl staršiu verziu
const PM_KONIEC = 10700;
/* Stará sova 4.x (kópia owl('hi') zo 4.8.2, aby sa dala premeniť; staré farby zámerne) */
function staraSova() {
  const W = '#7650E6', K = '#2B2240', bod = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}" stroke="none"/>`;
  return `<svg class="pm-ss" viewBox="0 0 120 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><g stroke="${K}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="46" cy="123" rx="10" ry="5" fill="#FFA62B"/><ellipse cx="74" cy="123" rx="10" ry="5" fill="#FFA62B"/>
    <path d="M30 36 L22 8 L52 26Z" fill="${W}"/><path d="M90 36 L98 8 L68 26Z" fill="${W}"/>
    <path d="M60 18 C94 18 106 46 106 78 C106 106 88 122 60 122 C32 122 14 106 14 78 C14 46 26 18 60 18Z" fill="#9B6BFF"/>
    <path d="M60 66 C80 66 90 84 90 98 C90 112 78 118 60 118 C42 118 30 112 30 98 C30 84 40 66 60 66Z" fill="#EDE5FF"/>
    <path d="M47 92 q4 5 8 0 q4 5 8 0 q4 5 8 0 M51 104 q4 5 8 0 q4 5 8 0" fill="none" stroke-width="3"/>
    <path d="M16 72 C4 86 8 104 24 110 C26 94 24 80 16 72Z" fill="${W}"/><path class="pm-ss-kr" d="M98 76 C116 68 120 44 112 32 C102 46 92 58 94 76Z" fill="${W}"/>
    <circle cx="44" cy="52" r="16" fill="#fff"/><circle cx="76" cy="52" r="16" fill="#fff"/>
    <g class="pm-ss-oci">${bod(47, 54, 7.5)}${bod(79, 54, 7.5)}<circle cx="50" cy="51" r="2.6" fill="#fff" stroke="none"/><circle cx="82" cy="51" r="2.6" fill="#fff" stroke="none"/></g>
    <path d="M53 66 H67 L60 77Z" fill="#FFA62B"/><circle cx="27" cy="72" r="5" fill="#FF8FB1" stroke="none"/><circle cx="93" cy="72" r="5" fill="#FF8FB1" stroke="none"/></g></svg>`;
}
// staré ikony menu 4.x (obrys, bez výplne)
const PM_STARE_MENU = [
  ['Domov', '<path d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1z"/>'],
  ['Témy', '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'],
  ['Hry', '<path d="M7 8h10a5 5 0 0 1 4.8 6.3l-1 3.8a2.6 2.6 0 0 1-4.4 1.1L14 17h-4l-2.4 2.2a2.6 2.6 0 0 1-4.4-1.1l-1-3.8A5 5 0 0 1 7 8z"/><path d="M7.5 11v4M5.5 13h4"/>'],
  ['Priatelia', '<circle cx="8.5" cy="8.5" r="3.2"/><circle cx="16" cy="9.5" r="2.6"/><path d="M2.8 19.5c.8-3.4 3-5 5.7-5s4.9 1.6 5.7 5M14 14.6c.6-.3 1.3-.4 2-.4 2.3 0 4.2 1.4 4.9 4.6"/>'],
  ['Ja', '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/>'],
];
const PM_NOVE_MENU = [['Domov', 'domov'], ['Témy', 'temy'], ['Hry', 'hry'], ['Priatelia', 'priatelia'], ['Ja', 'ja']];

const Premena = {
  el: null, anim: [], casy: [], koniec: false,
  pohyb() { try { return !matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return true; } },
  skuska() { try { const m = location.search.match(/[?&]premena(?:=(\w+))?/); return m ? (m[1] || 'cela') : ''; } catch (e) { return ''; } },
  // z = novinky na koniec; o.tichy = bez pohybu; o.hotovo = zavolá sa po zatvorení
  spusti(z, o = {}) {
    try {
      this.zrus();
      this.z = z; this.o = o;
      this.postav();
      if (!o.tichy && this.pohyb() && this.el.animate) this.hraj(); else this.naKoniec(true);
      return true;
    } catch (e) {
      console.error('Premena:', e);
      this.zrus();
      return false;
    }
  },
  postav() {
    const t = tD(), k = KAT[t.k] || { nazov: '', c: 'var(--sun)' };
    const meno = st.meno ? esc(st.meno) : '', av = st.avatar ? postavicka(st.avatar) : '';
    const body = typeof st.body === 'number' ? st.body : 0, dni = (st.dni || []).length;
    const datum = new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' });
    let strom = '';
    try { strom = stromSvg({ stupen: Math.max(1, Math.min(5, stromStupen(dni))), plody: 3, kos: 0, novy: -1, zem: false }); } catch (e) { strom = ''; }
    let kraj = '';
    try { kraj = Domov.krajina(t, false); } catch (e) { kraj = ''; }
    const plusy = [[8, 12], [82, 8], [18, 46], [90, 38], [6, 78], [70, 66], [44, 92], [94, 88], [30, 24]].map(([x, y]) => `<i style="left:${x}%;top:${y}%"></i>`).join('');
    const iskry = Array.from({ length: 12 }, (_, i) => `<i style="--a:${i * 30}deg"></i>`).join('');
    const pol = this.z.map(n => `<li class="pm-pol"><span class="pm-obr">${(() => { try { return n.obr(); } catch (e) { return ikn('hviezda'); } })()}</span><div><b>${n.n}</b><small>${n.p}</small></div></li>`).join('');
    const el = document.createElement('div');
    el.className = 'pm';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Svetom 5.0: čo je nové');
    el.innerHTML = `
      <div class="pm-bg-stare" aria-hidden="true">${plusy}</div>
      <div class="pm-bg-nove" aria-hidden="true">${this.mapa()}</div>
      <div class="pm-koniec">
        <div class="pm-slot" aria-hidden="true"><i></i></div>
        <div class="pm-znacka">${logo('pm-logo')}<p class="podtitul">${PODTITUL}</p><span class="pec pm-pec">Verzia 5.0</span></div>
        <article class="listok pm-listok">
          <div class="pm-l-hlava"><span class="pm-l-ik">${ikn('kompas')}</span><h2 class="n1">Čo je nové</h2></div>
          <ul class="pm-zoznam">${pol}</ul>
          <div class="perf"></div>
          <div class="pm-l-dole"><button class="btn wide" data-pm-ok>Poďme objavovať!${ikn('sipka', 'za')}</button></div>
        </article>
      </div>
      <div class="pm-scena" aria-hidden="true">
        <div class="pm-stara">
          <div class="pm-st-pozadie">${plusy}</div>
          <div class="pm-st-hlava">
            <span class="pm-st-av" data-pm-a>${av || staraSova()}</span>
            <span class="pm-st-poz" data-pm-a><small>Ahoj,</small><b>${meno || 'kamarát'}!</b></span>
            <span class="pm-st-chip" data-pm-a><i class="pm-st-zarovka"></i><b>${dni}</b></span>
            <span class="pm-st-chip" data-pm-a>${STAR('#FFD23F')}<b>${body}</b></span>
          </div>
          <div class="pm-st-karta pm-st-hero" data-pm-a>
            <span class="pm-st-tag">${STAR('#FFD23F')}Téma dňa</span>
            <div class="pm-st-obr">${scene(t, 'sm')}</div>
            <b class="pm-st-nadpis">${t.t}</b>
            <span class="pm-st-btn">Poďme na to!</span>
            <span class="pm-st-sova-miesto"></span>
          </div>
          <div class="pm-st-karta pm-st-ang" data-pm-a><small>Dnes ešte nie</small><b>Angličtina na každý deň</b></div>
          <div class="pm-st-nav">${PM_STARE_MENU.map(([n, d], i) => `<span class="${i ? '' : 'on'}" data-pm-na><svg viewBox="0 0 24 24">${d}</svg>${n}</span>`).join('')}</div>
        </div>
        <div class="pm-nova">
          <div class="pm-nv-papier"></div>
          <div class="pm-nv-kraj">${kraj}</div>
          <div class="pm-nv-hlava">
            <span class="pm-nv-av" data-pm-b>${av || mudra('stoji')}</span><b class="pm-nv-meno" data-pm-b>${meno || 'Objaviteľ'}</b>
            <span class="pm-nv-chip" data-pm-b>${ikn('strom')}<b>${dni}</b></span><span class="pm-nv-chip" data-pm-b>${ikn('hviezda')}<b>${body}</b></span>
          </div>
          <div class="pm-nv-hore">
            <p class="odkaz pm-nv-rec">${meno ? `Ahoj, ${meno}!` : 'Ahoj!'} Som nová Múdra. Poď objavovať!</p>
            <span class="pm-nv-mud">${mudra('ahoj')}</span>
            <span class="pm-nv-strom">${strom}</span>
          </div>
          <article class="listok pm-nv-listok" data-pm-b>
            <div class="dl-hore">
              <div class="dl-rad"><span class="pec">Téma dňa</span><span class="dop">${datum}</span></div>
              <div class="dl-obr">${scene(t, 'sm')}</div>
              <span class="st dl-kat" style="--k:${k.c}">${k.nazov}</span>
              <b class="n1">${t.t}</b>
            </div>
            <div class="perf"></div>
            <div class="dl-dole"><span class="btn wide">Poďme na to!${ikn('sipka', 'za')}</span></div>
          </article>
          <div class="pm-nv-nav">${PM_NOVE_MENU.map(([n, ik], i) => `<span class="${i ? '' : 'on'}" data-pm-nb><span class="ni">${ikn(ik)}</span>${n}</span>`).join('')}</div>
        </div>
        <div class="pm-ram"></div>
        <div class="pm-zavoj"></div>
        <div class="pm-svetlo"><div class="pm-luce"></div><div class="pm-ziara"></div></div>
        <div class="pm-iskry">${iskry}</div>
        <div class="pm-sova">
          <div class="pm-s pm-s-stara">${staraSova()}</div>
          <div class="pm-s pm-s-sil pm-s-sil-stara">${staraSova()}</div>
          <div class="pm-s pm-s-nova">${mudra('oslava')}</div>
          <div class="pm-s pm-s-nova2">${mudra('ahoj')}</div>
          <div class="pm-s pm-s-sil pm-s-sil-nova">${mudra('ahoj')}</div>
        </div>
        <div class="pm-blesk"></div>
        <div class="pm-vlna"></div><div class="pm-vlna"></div>
      </div>
      <button class="btn maly dve pm-preskoc" data-pm-preskoc>Preskočiť${ikn('sipka', 'za')}</button>`;
    document.body.appendChild(el);
    this.el = el;
    document.documentElement.classList.add('pm-bezi');
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.closest('[data-pm-preskoc]')) { this.zvuk('tap'); this.naKoniec(false); }
      else if (e.target.closest('[data-pm-ok]')) { this.zvuk('tap'); this.zavri(); }
    });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); if (this.koniec) this.zavri(); else this.naKoniec(false); } });
    this.naResize = () => { if (this.koniec) this.umiestni(); };
    addEventListener('resize', this.naResize);
    this.rozmer();
    try { el.querySelector('[data-pm-preskoc]').focus({ preventScroll: true }); } catch (e) { /* bez fokusu */ }
  },
  // papierová mapa okolo lístka na konci: bodkované cesty, ružica, kopčeky (jedno SVG, kúsky sa objavia postupne)
  mapa() {
    const c = 'stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
    const kus = (x, y, s) => `<i class="pm-mk" style="--x:${x}%;--y:${y}%">${s}</i>`;
    const kopec = `<svg viewBox="-24 -20 48 26"><path d="M-22 4L-6-14L4-2L10-8L22 4Z" fill="var(--leaf-l)" ${c}/></svg>`;
    const ruzica = `<svg viewBox="-24 -24 48 48"><circle r="16" fill="var(--card)" ${c}/><path d="M0-22L4-4L0 0L-4-4Z" fill="var(--coral)" ${c}/><path d="M0 22L4 4L0 0L-4 4Z" fill="var(--card)" ${c}/><path d="M-22 0L-4-3L0 0L-4 3ZM22 0L4-3L0 0L4 3Z" fill="var(--sand)" ${c}/></svg>`;
    const hviezda = `<svg viewBox="-12 -12 24 24"><path d="M0-10L3-3L10 0L3 3L0 10L-3 3L-10 0L-3-3Z" fill="var(--sun)" ${c}/></svg>`;
    const vlajka = `<svg viewBox="-4 -26 24 28"><path d="M0 0V-24" ${c} fill="none"/><path d="M0-24l16 6-16 6z" fill="var(--coral)" ${c}/></svg>`;
    return `<svg class="pm-cesty" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M-5 20C20 30 30 8 52 14S80 34 105 22M-5 84C18 70 40 96 60 84S88 66 105 76M12 -5C6 20 22 40 8 60S14 92 6 105" fill="none" stroke="var(--sun-d)" stroke-width="3" stroke-dasharray=".1 9" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
      ${kus(9, 14, ruzica)}${kus(90, 10, kopec)}${kus(94, 52, vlajka)}${kus(5, 56, kopec)}${kus(88, 90, hviezda)}${kus(14, 92, hviezda)}${kus(52, 4, hviezda)}`;
  },
  // veľkosť miesta pre lístok na konci podľa pomeru strán scény
  rozmer() {
    const sc = this.el.querySelector('.pm-scena').getBoundingClientRect(), W = innerWidth, H = innerHeight;
    const pomer = sc.height / Math.max(1, sc.width), siroky = W >= 720;
    const w = siroky ? Math.min(300, H * .82 / pomer) : Math.max(96, Math.min(W * .38, 200, H * .4 / pomer));
    const slot = this.el.querySelector('.pm-slot');
    slot.style.width = Math.round(w) + 'px'; slot.style.height = Math.round(w * pomer) + 'px';
  },
  // kam sa scéna oddiali (transform voči jej pôvodnej polohe)
  cielZoom() {
    const sc = this.el.querySelector('.pm-scena'), slot = this.el.querySelector('.pm-slot');
    const a = sc.getBoundingClientRect(), b = slot.getBoundingClientRect(), s = b.width / Math.max(1, a.width);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(-2.5deg) scale(${s.toFixed(4)})`;
  },
  umiestni() {
    if (!this.el) return;
    this.rozmer();
    const sc = this.el.querySelector('.pm-scena');
    this.anim.filter(a => a.effect && a.effect.target === sc).forEach(a => a.cancel());
    sc.style.transform = 'none';
    sc.style.transform = this.cielZoom();
  },
  // jedna animácia na prvok cez celú časovú os: body [čas ms, {transform, opacity}, easing pre ďalší úsek]
  os(el, body) {
    if (!el) return;
    const kf = [];
    if (body[0][0] > 0) kf.push({ offset: 0, ...body[0][1] });
    let pred = 0;
    body.forEach(([t, v, e]) => { pred = Math.max(pred, Math.min(1, t / PM_KONIEC)); kf.push({ offset: pred, ...v, ...(e ? { easing: e } : {}) }); });
    const posl = body[body.length - 1];
    if (posl[0] < PM_KONIEC) kf.push({ offset: 1, ...posl[1] });
    const a = el.animate(kf, { duration: PM_KONIEC, fill: 'both' });
    this.anim.push(a);
    return a;
  },
  zvuk(n) { try { Zvuk.play(n); } catch (e) { /* bez zvuku */ } },
  hraj() {
    const E = this.el, q = s => E.querySelector(s), qa = s => [...E.querySelectorAll(s)];
    const sc = q('.pm-scena'), R = sc.getBoundingClientRect();
    const rel = el => { const r = el.getBoundingClientRect(); return { x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height, cx: r.left - R.left + r.width / 2, cy: r.top - R.top + r.height / 2 }; };
    const SPR = 'cubic-bezier(.25,1.55,.5,1)', IO = 'cubic-bezier(.65,0,.35,1)', OUT = 'cubic-bezier(.2,.8,.3,1)', T = (x, y, s = 1, r = 0) => `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
    const V = { opacity: 1 }, N = { opacity: 0 };
    // sova: začne na mieste starej sovy, premení sa v strede, doletí na miesto Múdrej v novej appke
    const sova = q('.pm-sova'), m0 = rel(q('.pm-st-sova-miesto')), m1 = rel(q('.pm-nv-mud'));
    sova.style.left = m0.x + 'px'; sova.style.top = m0.y + 'px'; sova.style.width = m0.w + 'px'; sova.style.height = m0.h + 'px';
    const stred = { x: R.width / 2, y: Math.min(R.height * .42, 330) };
    const k = Math.min(2.3, R.width * .5 / m0.w), dS = [stred.x - m0.cx, stred.y - m0.cy], k1 = m1.w / m0.w, d1 = [m1.cx - m0.cx, m1.cy - m0.cy];
    this.os(E, [[0, N], [280, V]]);
    this.os(sova, [[0, { transform: T(0, 0) }], [380, { transform: T(0, 0) }, 'ease-out'], [560, { transform: T(0, -12, 1.03) }, 'ease-in'], [740, { transform: T(0, 0) }],
      [980, { transform: T(0, 0, 1, -6) }], [1160, { transform: T(0, -4, 1, 5) }], [1300, { transform: T(0, 0) }, IO],
      [2000, { transform: T(dS[0], dS[1], k) }], [2600, { transform: T(dS[0], dS[1] - 6, k * 1.04) }], [3200, { transform: T(dS[0], dS[1], k * .98) }], [3800, { transform: T(dS[0], dS[1] - 8, k * 1.06) }],
      [4250, { transform: T(dS[0], dS[1], k * .92) }, SPR], [4750, { transform: T(dS[0], dS[1], k * 1.12) }], [5050, { transform: T(dS[0], dS[1], k * 1.12) }, 'ease-in-out'],
      [5420, { transform: T((dS[0] + d1[0]) / 2, Math.min(dS[1], d1[1]) - 50, (k + k1) / 2, -8) }, 'ease-in'], [5700, { transform: T(d1[0], d1[1], k1) }, SPR],
      [6000, { transform: T(d1[0], d1[1], k1) }], [7300, { transform: T(d1[0], d1[1], k1) }, 'ease-out'], [7480, { transform: T(d1[0], d1[1] - 10, k1) }, 'ease-in'], [7660, { transform: T(d1[0], d1[1], k1) }]]);
    // starý krídlo zamáva, oči sa pozrú hore
    try { this.os(q('.pm-s-stara .pm-ss-kr'), [[0, { transform: 'rotate(0deg)' }], [420, { transform: 'rotate(0deg)' }], [560, { transform: 'rotate(-16deg)' }], [700, { transform: 'rotate(8deg)' }], [840, { transform: 'rotate(-16deg)' }], [980, { transform: 'rotate(0deg)' }]]); } catch (e) { /* bez mávania */ }
    try { this.os(q('.pm-s-stara .pm-ss-oci'), [[0, { transform: 'translate(0,0)' }], [950, { transform: 'translate(0,0)' }], [1100, { transform: 'translate(2px,-4px)' }], [1900, { transform: 'translate(2px,-4px)' }]]); } catch (e) { /* bez pohľadu */ }
    // vývin: biela silueta starej sovy, potom striedanie siluet, čoraz rýchlejšie, až zostane nová
    this.os(q('.pm-s-stara'), [[0, V], [2050, V], [2300, N]]);
    const krok = [380, 300, 240, 195, 160, 130, 105, 85, 70, 58, 48, 42, 38, 36], body0 = [[0, N], [2000, N], [2300, V]], body1 = [[0, N], [2300, N]];
    let t = 2300, nova = false;
    krok.forEach(d => { t += d; nova = !nova; body0.push([t - 1, nova ? V : N], [t, nova ? N : V]); body1.push([t - 1, nova ? N : V], [t, nova ? V : N]); });
    body0.push([t + 1, N]); body1.push([4300, V], [4700, N]);
    this.os(q('.pm-s-sil-stara'), body0);
    this.os(q('.pm-s-sil-nova'), body1);
    this.os(q('.pm-s-nova'), [[0, N], [4290, N], [4300, V], [5380, V], [5400, N]]);
    this.os(q('.pm-s-nova2'), [[0, N], [5380, N], [5400, V]]);
    // svetlo, lúče a iskry počas vývinu
    const sv = q('.pm-svetlo'); sv.style.left = stred.x + 'px'; sv.style.top = stred.y + 'px';
    this.os(q('.pm-zavoj'), [[0, N], [1300, N], [1900, { opacity: .62 }], [4700, { opacity: .62 }], [5300, N]]);
    this.os(sv, [[0, { opacity: 0, transform: 'scale(.3)' }], [1700, { opacity: 0, transform: 'scale(.3)' }, OUT], [2300, { opacity: 1, transform: 'scale(1)' }], [4200, { opacity: 1, transform: 'scale(1.25)' }], [4500, { opacity: 1, transform: 'scale(1.6)' }], [5200, { opacity: 0, transform: 'scale(1.9)' }]]);
    this.os(q('.pm-luce'), [[0, { transform: 'rotate(0deg)' }], [5200, { transform: 'rotate(200deg)' }]]);
    this.os(q('.pm-ziara'), [[0, { transform: 'scale(.8)' }], [2600, { transform: 'scale(1.1)' }], [3000, { transform: 'scale(.9)' }], [3400, { transform: 'scale(1.15)' }], [3800, { transform: 'scale(.95)' }], [4200, { transform: 'scale(1.3)' }]]);
    const isk = q('.pm-iskry'); isk.style.left = stred.x + 'px'; isk.style.top = stred.y + 'px';
    qa('.pm-iskry i').forEach((el, i) => {
      const a = i * 30 * Math.PI / 180, r = R.width * .55 + (i % 3) * 30, x = Math.cos(a) * r, y = Math.sin(a) * r, t0 = 1900 + (i % 6) * 220;
      this.os(el, [[0, { opacity: 0, transform: T(x, y, 1, 0) }], [t0, { opacity: 0, transform: T(x, y, 1, 0) }, 'ease-in'], [t0 + 120, { opacity: 1, transform: T(x * .8, y * .8, 1, 40) }, 'ease-in'], [t0 + 900, { opacity: 0, transform: T(0, 0, .2, 180) }]]);
    });
    const bl = q('.pm-blesk'); bl.style.left = stred.x + 'px'; bl.style.top = stred.y + 'px';
    this.os(bl, [[0, { opacity: 0, transform: 'scale(.2)' }], [4220, { opacity: 0, transform: 'scale(.2)' }], [4300, { opacity: 1, transform: 'scale(1)' }, OUT], [4900, { opacity: 0, transform: `scale(${(Math.hypot(R.width, R.height) / 60).toFixed(1)})` }]]);
    // vlny od Múdrej po pristátí a premena všetkého podľa vzdialenosti od nej
    const W0 = 5700;
    qa('.pm-vlna').forEach((el, i) => {
      el.style.left = m1.cx + 'px'; el.style.top = m1.cy + 'px';
      const t0 = W0 + i * 220, s = Math.hypot(R.width, R.height) / 50;
      this.os(el, [[0, { opacity: 0, transform: 'scale(.1)' }], [t0, { opacity: .9, transform: 'scale(.1)' }, 'ease-out'], [t0 + 1000, { opacity: 0, transform: `scale(${s.toFixed(1)})` }]]);
    });
    const kedy = el => { const r = rel(el); return W0 + 60 + Math.hypot(r.cx - m1.cx, r.cy - m1.cy) * 1.15; };
    const pryc = (el, t0) => this.os(el, [[0, { opacity: 1, transform: 'perspective(700px) rotateY(0deg) scale(1)' }], [t0, { opacity: 1, transform: 'perspective(700px) rotateY(0deg) scale(1)' }, 'ease-in'], [t0 + 190, { opacity: 0, transform: 'perspective(700px) rotateY(90deg) scale(.9)' }]]);
    const prid = (el, t0) => this.os(el, [[0, { opacity: 0, transform: 'perspective(700px) rotateY(-90deg) scale(.9)' }], [t0 + 190, { opacity: 0, transform: 'perspective(700px) rotateY(-90deg) scale(.9)' }, SPR], [t0 + 620, { opacity: 1, transform: 'perspective(700px) rotateY(0deg) scale(1)' }]]);
    const stare = qa('[data-pm-a]'), nove = qa('[data-pm-b]');
    stare.forEach(el => pryc(el, kedy(el)));
    nove.forEach(el => prid(el, Math.max(W0 + 60, kedy(el) - 160))); // nové o chvíľu skôr, aby medzi starým a novým neostalo prázdno
    // menu: vlastný rytmus zľava doprava
    const na = qa('[data-pm-na]'), nb = qa('[data-pm-nb]');
    na.forEach((el, i) => pryc(el, 6450 + i * 110));
    nb.forEach((el, i) => prid(el, 6450 + i * 110));
    this.os(q('.pm-st-nav'), [[0, V], [6900, V], [7100, N]]);
    this.os(q('.pm-nv-nav'), [[0, { opacity: 0, transform: 'translateY(30px)' }], [6300, { opacity: 0, transform: 'translateY(30px)' }, OUT], [6600, { opacity: 1, transform: 'translateY(0)' }]]);
    // pozadie: staré zbledne, papier a krajina sa zdvihnú
    this.os(q('.pm-st-pozadie'), [[0, V], [W0, V], [W0 + 900, N]]);
    this.os(q('.pm-bg-stare'), [[0, V], [W0, V], [W0 + 900, N]]);
    this.os(q('.pm-nv-papier'), [[0, N], [W0, N], [W0 + 700, V]]);
    this.os(q('.pm-bg-nove'), [[0, N], [W0 + 200, N], [W0 + 900, V]]);
    this.os(q('.pm-nv-kraj'), [[0, { opacity: 0 }], [W0 + 80, { opacity: 0 }], [W0 + 500, { opacity: 1 }]]);
    qa('.pm-nv-kraj .kr-vz').forEach((g, i) => { try { this.os(g, [[0, { transform: 'translateY(120px)' }], [W0 + 100 + i * 140, { transform: 'translateY(120px)' }, SPR], [W0 + 700 + i * 140, { transform: 'translateY(0)' }]]); } catch (e) { /* bez zdvihnutia */ } });
    this.os(q('.pm-nv-strom'), [[0, { opacity: 0, transform: 'scale(0)' }], [6500, { opacity: 0, transform: 'scale(0)' }, SPR], [6560, { opacity: 1, transform: 'scale(.1)' }, SPR], [7100, { opacity: 1, transform: 'scale(1)' }]]);
    this.os(q('.pm-nv-rec'), [[0, { opacity: 0, transform: 'scale(.6)' }], [7150, { opacity: 0, transform: 'scale(.6)' }, SPR], [7550, { opacity: 1, transform: 'scale(1)' }]]);
    // oddialenie na lístok, potom mapa, značka a novinky
    const ciel = this.cielZoom();
    this.os(sc, [[0, { transform: 'none' }], [8200, { transform: 'none' }, IO], [9300, { transform: ciel }]]);
    this.os(q('.pm-ram'), [[0, N], [8250, N], [8800, V]]);
    this.os(q('.pm-slot i'), [[0, N], [8800, N], [9300, V]]);
    qa('.pm-mk').forEach((el, i) => this.os(el, [[0, { opacity: 0, transform: 'scale(.3)' }], [8700 + i * 120, { opacity: 0, transform: 'scale(.3)' }, SPR], [9150 + i * 120, { opacity: 1, transform: 'scale(1)' }]]));
    this.os(q('.pm-znacka'), [[0, { opacity: 0, transform: 'scale(.7) rotate(-4deg)' }], [9050, { opacity: 0, transform: 'scale(.7) rotate(-4deg)' }, SPR], [9550, { opacity: 1, transform: 'scale(1) rotate(0deg)' }]]);
    this.os(q('.pm-pec'), [[0, { opacity: 0, transform: 'scale(1.8) rotate(-14deg)' }], [9450, { opacity: 0, transform: 'scale(1.8) rotate(-14deg)' }, 'cubic-bezier(.5,0,.75,0)'], [9700, { opacity: 1, transform: 'scale(1) rotate(-4deg)' }]]);
    this.os(q('.pm-listok'), [[0, { opacity: 0, transform: 'translateY(40px)' }], [9300, { opacity: 0, transform: 'translateY(40px)' }, OUT], [9800, { opacity: 1, transform: 'translateY(0)' }]]);
    qa('.pm-pol').forEach((el, i) => this.os(el, [[0, { opacity: 0, transform: 'translateX(-14px)' }], [9550 + i * 110, { opacity: 0, transform: 'translateX(-14px)' }, OUT], [9900 + i * 110, { opacity: 1, transform: 'translateX(0)' }]]));
    this.os(q('.pm-l-dole'), [[0, { opacity: 0, transform: 'scale(.85)' }], [10150, { opacity: 0, transform: 'scale(.85)' }, SPR], [10550, { opacity: 1, transform: 'scale(1)' }]]);
    this.os(q('.pm-preskoc'), [[0, V], [10000, V], [10300, N]]);
    // zvuky
    [[150, 'hoot'], [1350, 'whoosh'], [4300, 'star'], [5650, 'boing'], [8250, 'whoosh'], [9750, 'cink']].forEach(([ms, n]) => this.casy.push(setTimeout(() => this.zvuk(n), ms)));
    const a0 = this.anim[0];
    if (a0) a0.finished.then(() => this.hotovo(), () => {});
  },
  // koniec: buď po dohraní, alebo hneď (Preskočiť, obmedzenie pohybu)
  naKoniec(hned) {
    if (!this.el) return;
    this.casy.forEach(clearTimeout); this.casy = [];
    if (this.anim.length) { this.anim.forEach(a => { try { a.finish(); } catch (e) { /* nič */ } }); }
    else if (hned) { this.el.classList.add('pm-tichy'); this.umiestni(); }
    this.hotovo();
  },
  hotovo() {
    if (!this.el || this.koniec) return;
    this.koniec = true;
    this.el.classList.add('pm-hotovo');
    const p = this.el.querySelector('[data-pm-preskoc]'); if (p) p.hidden = true;
    // po konci už scéna nepotrebuje animácie: drží sa na mieste cez štýl (aby sa dala posunúť pri zmene veľkosti okna)
    this.umiestni();
    try { this.el.querySelector('[data-pm-ok]').focus({ preventScroll: true }); } catch (e) { /* bez fokusu */ }
  },
  zavri() {
    const el = this.el; if (!el) return;
    const hotovo = this.o && this.o.hotovo;
    el.classList.add('pryc');
    setTimeout(() => { this.zrus(); if (hotovo) try { hotovo(); } catch (e) { /* nič */ } }, 320);
  },
  zrus() {
    this.casy.forEach(clearTimeout); this.casy = [];
    this.anim.forEach(a => { try { a.cancel(); } catch (e) { /* nič */ } }); this.anim = [];
    if (this.naResize) removeEventListener('resize', this.naResize);
    if (this.el) this.el.remove();
    this.el = null; this.koniec = false;
    document.documentElement.classList.remove('pm-bezi');
  },
};
