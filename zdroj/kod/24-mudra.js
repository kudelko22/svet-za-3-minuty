// ============ Múdra 5.0: živé pohyby (štýly v styly/59-mudra.css, kresba mudra() v obrazky.js) ============
// Rozhranie pre sekcie:
//   Mudra.reaguj(prvok, vyraz, { oneskorenie })  plynule zmení výraz (ak treba) a zahrá k nemu pohyb
//   Mudra.zmen(prvok, vyraz)                      len plynulá zmena výrazu (oči sa otvoria do nového, krídla dorovnajú uhol)
//   Mudra.tukni(prvok)                            ťuknutie: zahúka a poskočí, zakaždým trochu inak
// prvok je <svg class="mudra"> alebo prvok, v ktorom je. Každá nová Múdra na obrazovke dostane sama pokoj (dýcha, žmurká,
// obzerá sa) a krátky nástup podľa výrazu; mimo obrazovky a pri skrytom okne stojí, pri obmedzení pohybu sa nehýbe vôbec.
const Mudra = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mm = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const ticho = () => mm.matches;
  const dom = () => typeof document === 'object' && typeof document.createElementNS === 'function'; // test beží bez skutočného DOM
  // pohyb, ktorý patrí k výrazu, a dĺžky pohybov (ms), po ktorých sa trieda zoberie
  const POHYB = { ahoj: 'mav', stoji: 'usad', radost: 'hop', oslava: 'oslava', povzbudenie: 'pohlad', zvedava: 'zved', premysla: 'mysli' };
  const DLZKA = { mav: 1100, usad: 500, hop: 720, hop2: 1000, oslava: 1300, pohlad: 1500, zved: 1200, mysli: 1400, tocka: 850, tras: 750, skrc: 800 };
  const TUK = ['hop', 'tocka', 'tras', 'skrc', 'hop2'];
  const SPANOK_MS = 30000;
  const sledovane = new Set(), nastupy = new Map();
  let io = null, naplanovane = false, tukPosl = -1, spi = false, casSpanku = 0;

  const svgZ = el => !el ? null : el.matches && el.matches('svg.mudra') ? el : el.querySelector ? el.querySelector('svg.mudra') : null;
  const vyrazy = () => (typeof VYRAZY === 'object' ? VYRAZY : {});

  // zapne pokoj a sledovanie, či je Múdra na obrazovke
  function priprav(s, nastup) {
    if (s.dataset.mz) return;
    s.dataset.mz = '1';
    if (!s.style.getPropertyValue('--mzd')) s.style.setProperty('--mzd', (-Math.random() * 9).toFixed(2) + 's');
    if (ticho()) return;
    s.classList.add('mz-zije');
    if (io) { io.observe(s); sledovane.add(s); }
    if (spi) uspi(s);
    else if (nastup) {
      // ten istý nástup na tom istom mieste najviac raz za 6 s (render sa opakuje)
      const k = (s.parentNode && s.parentNode.getAttribute && s.parentNode.getAttribute('class') || '') + '|' + s.dataset.v, t = Date.now();
      if (t - (nastupy.get(k) || 0) > 6000) { nastupy.set(k, t); pohyb(s, POHYB[s.dataset.v]); }
    }
  }

  function pohyb(s, typ) {
    if (!s || !typ || ticho()) return;
    for (const c of [...s.classList]) if (c.startsWith('mz-p-')) s.classList.remove(c);
    void s.getBoundingClientRect();
    const c = 'mz-p-' + typ; s.classList.add(c);
    clearTimeout(s._mzt); s._mzt = setTimeout(() => s.classList.remove(c), (DLZKA[typ] || 900) + 50);
  }

  // nová kresba s rovnakými doplnkami a rozmermi, s plynulým prechodom
  function zmen(el, v) {
    const s = svgZ(el), V = vyrazy();
    if (!s || !V[v] || typeof mudra !== 'function') return s;
    if (!s.dataset || s.dataset.v === v) return s;
    if (!dom()) { if (el !== s) el.innerHTML = mudra(v); return s; } // bez skutočného DOM (test)
    const t = document.createElementNS(NS, 'svg');
    t.innerHTML = mudra(v, { extra: s.dataset.x === '1', tien: s.dataset.t === '1' });
    const n = t.firstElementChild; if (!n) return s;
    for (const a of ['x', 'y', 'width', 'height', 'style']) if (s.hasAttribute(a)) n.setAttribute(a, s.getAttribute(a));
    for (const c of s.classList) if (!/^(owl|mudra|jump|mz-p-.*|mz-huk)$/.test(c)) n.classList.add(c);
    if (s.dataset.mzPred) n.dataset.mzPred = s.dataset.mzPred;
    n.dataset.mz = '1'; n.dataset.mzr = '1';
    const stary = V[s.dataset.v] || V.ahoj, novy = V[v];
    clearTimeout(s._mzt);
    s.replaceWith(n);
    if (io) { io.unobserve(s); sledovane.delete(s); if (n.classList.contains('mz-zije')) { io.observe(n); sledovane.add(n); } }
    if (ticho() || typeof n.animate !== 'function') return n;
    // oči sa otvoria už do nového výrazu (výmena je schovaná v žmurknutí), krídla a zrenice idú z pôvodnej polohy
    const pruz = 'cubic-bezier(.3, 1.45, .5, 1)';
    n.querySelectorAll('.mz-oko').forEach(o => o.animate([{ transform: 'scaleY(.12)' }, { transform: 'none' }], { duration: 200, easing: pruz }));
    n.querySelectorAll('.mz-zob').forEach(o => o.animate([{ transform: 'scale(.8)' }, { transform: 'none' }], { duration: 220, easing: pruz }));
    for (const [tr, k] of [['.ow-wl', 'wl'], ['.ow-wr', 'wr']]) {
      const w = n.querySelector(tr), d = Math.max(-150, Math.min(150, (stary[k] || 0) - (novy[k] || 0)));
      if (w && Math.abs(d) > 2) w.animate([{ transform: `rotate(${d}deg)` }, { transform: 'none' }], { duration: 380, easing: pruz });
    }
    if (stary.oci === 'otv' && novy.oci === 'otv') {
      const l0 = stary.look || [1, 1], l1 = novy.look || [1, 1], dx = l0[0] - l1[0], dy = l0[1] - l1[1];
      if (dx || dy) n.querySelectorAll('.ow-blink').forEach(p => p.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'ease-out' }));
    }
    const h = n.querySelector('.mz-hlava'), dt = (stary.tilt || 0) - (novy.tilt || 0);
    if (h && dt) h.animate([{ transform: `rotate(${dt}deg)` }, { transform: 'none' }], { duration: 360, easing: pruz });
    const x = n.querySelector('.mz-extra');
    if (x) x.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, delay: 90, easing: pruz, fill: 'backwards' });
    n.animate([{ scale: '1.06 .92' }, { scale: '.98 1.03', offset: .6 }, { scale: '1 1' }], { duration: 300, easing: 'ease-out' });
    return n;
  }

  function reaguj(el, v, o = {}) {
    if (!dom()) { if (v && el) zmen(el, v); return null; }
    let s = svgZ(el); if (!s) return null;
    if (v && s.dataset.v !== v) s = zmen(s, v);
    s.dataset.mzr = '1'; priprav(s, false);
    const typ = POHYB[s.dataset.v];
    if (o.oneskorenie) setTimeout(() => { if (s.isConnected) pohyb(s, typ); }, o.oneskorenie); else pohyb(s, typ);
    return s;
  }

  function tukni(el) {
    if (!dom()) return;
    let s = svgZ(el); if (!s) return;
    if (spi || s.classList.contains('mz-spi')) { zobud(); return; }
    budik();
    if (ticho()) return;
    let i; do i = Math.floor(Math.random() * TUK.length); while (i === tukPosl);
    tukPosl = i;
    pohyb(s, TUK[i]);
    s.classList.remove('mz-huk'); void s.getBoundingClientRect(); s.classList.add('mz-huk');
    clearTimeout(s._mzh); s._mzh = setTimeout(() => s.classList.remove('mz-huk'), 750);
    if (typeof s.animate === 'function') s.querySelectorAll('.mz-otv').forEach(o => o.animate([{ transform: 'none' }, { transform: 'scaleY(.12)', offset: .4 }, { transform: 'none' }], { duration: 220, delay: 380 }));
  }

  // ---------- spánok: v Mesačnom režime alebo večer, keď sa dlho nik nedotkne ----------
  const noc = () => { const h = new Date().getHours(); return document.documentElement.dataset.rezim === 'mesacny' || h >= 20 || h < 6; };
  const ZZZ = [[150, 10, .8], [166, -8, 1], [184, -28, 1.2]].map(([x, y, k]) => `<path d="M${x} ${y}h${9 * k}l${-9 * k} ${11 * k}h${9 * k}"/>`).join('');
  function uspi(s) {
    if (ticho() || s.classList.contains('mz-spi')) return;
    if (!['ahoj', 'stoji'].includes(s.dataset.v)) return;
    if (s.dataset.v !== 'stoji') { const p = s.dataset.v; s = zmen(s, 'stoji'); s.dataset.mzPred = p; }
    const g = s.querySelector('.mz-cele');
    if (g && !s.querySelector('.mz-zzz')) {
      const z = document.createElementNS(NS, 'g'); z.setAttribute('class', 'mz-zzz'); z.setAttribute('fill', 'none');
      z.innerHTML = `<g stroke="#fff" stroke-width="9">${ZZZ}</g><g stroke-width="4">${ZZZ}</g>`;
      // Z sú dve vrstvy (biely lem a obrys) s rovnakým pohybom, aby boli vidieť cez deň aj v noci
      g.parentNode.appendChild(z);
    }
    s.classList.add('mz-spi');
  }
  function zaspi() {
    if (spi || document.hidden || ticho() || !noc()) { budik(); return; }
    spi = true;
    document.querySelectorAll('svg.mudra.mz-zije').forEach(uspi);
  }
  function zobud() {
    if (spi) { spi = false; document.querySelectorAll('svg.mudra.mz-spi').forEach(s => {
      s.classList.remove('mz-spi');
      const z = s.querySelector('.mz-zzz'); if (z) z.remove();
      const p = s.dataset.mzPred; delete s.dataset.mzPred;
      if (p) s = zmen(s, p);
      pohyb(s, 'skrc');
    }); }
    budik();
  }
  function budik() { clearTimeout(casSpanku); casSpanku = setTimeout(zaspi, SPANOK_MS); }

  // ---------- sledovanie: nové Múdry, obrazovka, skryté okno ----------
  function skenuj() {
    naplanovane = false;
    for (const s of sledovane) if (!s.isConnected) { sledovane.delete(s); if (io) io.unobserve(s); }
    document.querySelectorAll('svg.mudra:not([data-mz])').forEach(s => priprav(s, !s.dataset.mzr));
  }
  function start() {
    if (typeof IntersectionObserver === 'function') io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('mz-mimo', !e.isIntersecting)));
    if (typeof MutationObserver === 'function') new MutationObserver(() => { if (!naplanovane) { naplanovane = true; requestAnimationFrame(skenuj); } }).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('mz-pauza', document.hidden));
    for (const t of ['pointerdown', 'keydown']) document.addEventListener(t, () => { if (spi) zobud(); else budik(); }, { passive: true, capture: true });
    if (mm.addEventListener) mm.addEventListener('change', () => { if (ticho()) { zobud(); document.querySelectorAll('svg.mudra').forEach(s => s.classList.remove('mz-zije')); } });
    skenuj(); budik();
  }
  if (typeof document !== 'undefined') { if (document.body) start(); else document.addEventListener('DOMContentLoaded', start); }
  return { reaguj, zmen, tukni, zobud };
})();
