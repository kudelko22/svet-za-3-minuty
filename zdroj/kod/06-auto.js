/* Režim do auta: appka prečíta tému, príklad, otázky na rozhovor aj kvíz; rodič za volantom nemusí nič ťukať */
const vetyZ = txt => txt.split(/(?<=[.!?…])\s+/).filter(Boolean);
let drzanie = null; // obrazovka počas jazdy nezhasne
async function drzObrazovku(zapni) {
  try {
    if (zapni && 'wakeLock' in navigator && !drzanie) { drzanie = await navigator.wakeLock.request('screen'); drzanie.addEventListener('release', () => { drzanie = null; }); }
    if (!zapni && drzanie) { const d = drzanie; drzanie = null; await d.release(); }
  } catch (e) { drzanie = null; }
}
// v pozadí telefón čítanie aj odpočet zastaví, preto pauza (inak by appka potichu preskakovala vety)
document.addEventListener('visibilitychange', () => {
  if (!st.auto) return;
  if (!document.hidden) drzObrazovku(true);
  else if (st.auto.stav === 'hovori' || st.auto.stav === 'caka') Auto.ovladaj('pauza');
});
document.addEventListener('change', e => {
  if (e.target.id === 'auto-dalsia' && st.auto) { st.auto.pokracovat = e.target.checked; S.set('auto-pokracovat', e.target.checked); }
});

// celá téma rozložená na vety, pauzy a zvuky; segment = jedna časť (vysvetlenie, otázka, kvíz…)
function autoPlan(t) {
  const segs = [], kroky = [];
  const pridaj = (e, label, vety, navyse = []) => {
    const i = segs.length; segs.push({ e, label, i });
    vety.forEach(text => kroky.push({ seg: i, typ: 'veta', text }));
    navyse.forEach(k => kroky.push({ seg: i, ...k }));
  };
  pridaj('auto', 'Téma', [['Téma:', ...vetyZ(t.t)]]);
  pridaj('kniha', 'Vysvetlenie', vetyZ(t.m));
  if (st.vek === 'starsi') pridaj('ciapka', 'Do hĺbky', vetyZ(t.s));
  pridaj('ziarovka', 'Príklad zo života', ['Príklad zo života.', ...vetyZ(t.p)]);
  t.o.forEach((o, i) => pridaj('bublina', `Porozprávajte sa · ${i + 1} z ${t.o.length}`, [vetyZ(o)], [{ typ: 'pauza', s: 12, co: 'Čas na rozhovor' }]));
  const qs = t.z.filter(pre).map(naVek);
  qs.forEach((q, i) => {
    const moznosti = mix(q.a.length).map(j => q.a[j][1]);
    pridaj('otaznik', `Kvíz · ${i + 1} z ${qs.length}`,
      [[`Otázka ${i + 1}.`, ...vetyZ(q.q)], ['Je to:', ...moznostiNahlas(moznosti)]],
      [{ typ: 'pauza', s: 8, co: 'Čas na odpoveď' }, { typ: 'veta', text: ['Správna odpoveď je:', q.a[0][1]] },
        ...(q.w ? [{ typ: 'veta', text: vetyZ(q.w) }] : []), { typ: 'zvuk', z: 'star' }]);
  });
  pridaj('vlajka', 'Hotovo', [], [{ typ: 'koniec' }]);
  return { segs, kroky };
}
function povedzAuto(text, hotovo) {
  const casti = Array.isArray(text) ? text : [text], veta = spojVety(casti);
  let hotove = false;
  const koniec = () => { if (hotove) return; hotove = true; clearTimeout(poistka); hotovo(); };
  const poistka = setTimeout(koniec, 3000 + veta.length * 110); // niektoré telefóny koniec vety neohlásia
  if (Nahravky.moze(casti)) { Nahravky.hraj(casti, koniec, () => povedzAuto(veta, hotovo)); return; }
  try {
    const u = new SpeechSynthesisUtterance(veta), v = hlasSk();
    u.lang = 'sk-SK'; u.rate = .95; if (v) u.voice = v;
    u.onend = koniec;
    u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') koniec(); };
    speechSynthesis.speak(u);
  } catch (e) { koniec(); }
}
function dokonciAuto(t) {
  if (Precvic.je(st.auto)) return Precvic.prazdne();
  const qn = t.z.filter(pre).length, bodyPred = st.body, dnes = key(new Date()), prvy = !st.done.includes(t.id);
  const zisk = Math.min(t.id === temaDna().id ? Infinity : 10, prvy ? qn * 10 + 10 : st.kedy[t.id] === dnes ? 0 : qn + 1); // zopakovaná téma: desatina, raz za deň
  if (prvy) { st.done.push(t.id); S.set('done', st.done); }
  zapisPrebrate(t.id);
  pripisBody(zisk);
  if (!st.dni.includes(dnes)) { st.dni.push(dnes); S.set('dni', st.dni.slice(-400)); }
  return { zisk, noveOdznaky: noveOdznaky('auto', { uci: true }), noveOdmeny: noveOdmeny(bodyPred, st.body), noveHry: noveHry(bodyPred, st.body) };
}
function dalsiaTemaAuto(tid) {
  const v = TV(), i = v.findIndex(t => t.id === tid);
  for (let n = 1; n <= v.length; n++) { const t = v[(i + n) % v.length]; if (!st.done.includes(t.id)) return t; }
  return v[(i + 1) % v.length];
}

const Auto = {
  start(tid) {
    const t = byId(tid);
    if (!t) return;
    const spat = st.auto ? st.auto.spat : st.view, precvic = !!(st.flow && st.flow.precvic);
    const zrusene = this.zrus();
    const { segs, kroky } = autoPlan(t);
    st.flow = null;
    st.auto = { tid, segs, kroky, k: 0, stav: 'hovori', gen: 0, pokracovat: S.get('auto-pokracovat', true), vysledok: null, odpocet: null, spat, precvic };
    if (!('speechSynthesis' in window)) { st.auto.stav = 'rucne'; toast('Tento telefón nevie čítať nahlas. Text si prečítajte a ťuknite na Ďalej.'); }
    else if (!hlasSk() && speechSynthesis.getVoices().length) toast('Slovenský hlas v telefóne chýba, číta sa iným hlasom.');
    drzObrazovku(true);
    render(); scrollTo(0, 0);
    const a = st.auto; // prvé speak() musí ísť hneď z ťuknutia (iPhone), po zrušenej reči až o chvíľku
    if (zrusene) setTimeout(() => { if (st.auto === a) this.hraj(); }, 150); else this.hraj();
  },
  zrus() { // zastaví reč aj odpočítavanie
    const a = st.auto;
    if (!a) return;
    a.gen++; clearInterval(a.odpocet); a.odpocet = null; clearTimeout(a.neskor);
    const hral = Nahravky.stop();
    try { if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending)) { speechSynthesis.cancel(); return true; } } catch (e) {}
    return hral;
  },
  hraj() {
    const a = st.auto;
    if (!a || a.stav === 'pauza' || a.stav === 'koniec') return;
    const krok = a.kroky[a.k];
    if (!krok) return;
    const gen = ++a.gen;
    const dalej = () => { if (st.auto !== a || a.gen !== gen) return; a.k++; this.hraj(); };
    if (krok.typ === 'koniec') { this.koniec(); return; }
    if (a.stav === 'rucne') { obnovAuto(); return; } // bez hlasu: celý text na obrazovke, ďalej ťuknutím
    if (krok.typ === 'veta') { a.stav = 'hovori'; obnovAuto(); povedzAuto(krok.text, dalej); }
    else if (krok.typ === 'pauza') {
      a.stav = 'caka'; a.zostava = krok.s; obnovAuto();
      a.odpocet = setInterval(() => {
        if (st.auto !== a || a.gen !== gen) return;
        a.zostava--;
        const el = document.getElementById('auto-sek'); if (el) el.textContent = a.zostava;
        if (a.zostava <= 0) { clearInterval(a.odpocet); a.odpocet = null; a.stav = 'hovori'; dalej(); }
      }, 1000);
    } else if (krok.typ === 'zvuk') { Zvuk.play(krok.z); setTimeout(dalej, 700); }
  },
  koniec() {
    const a = st.auto, t = byId(a.tid);
    if (!a.vysledok) { a.vysledok = dokonciAuto(t); const d = dalsiaTemaAuto(t.id); a.dalsia = d && d.id; }
    const bezHlasu = a.stav === 'rucne', v = a.vysledok, gen = ++a.gen;
    a.stav = 'koniec'; a.zostava = null; renderAuto();
    Zvuk.play('win'); FX.rain(80);
    const veta = a.precvic ? `Dobre si si to zopakoval${st.meno ? ', ' + st.meno : ''}. Bolo to len na precvičenie.` : `Výborne${st.meno ? ', ' + st.meno : ''}! Téma je prebratá.` + (v.zisk ? ` Získavaš ${v.zisk} hviezd.` : '')
      + v.noveOdznaky.map(o => ` Nový odznak: ${o.n}.`).join('') + v.noveOdmeny.map(r => ` Pre postavičku máš ${NAZVY_ODMIEN[r.kluc]}.`).join('') + (v.noveHry || []).map(x => ` Odomkla sa nová hra ${x.n}.`).join('')
      + (a.pokracovat && a.dalsia && !a.precvic ? ' O chvíľu pokračujeme ďalšou témou.' : '');
    const pokracuj = () => {
      if (st.auto !== a || a.gen !== gen || !a.pokracovat || !a.dalsia || a.precvic) return;
      a.zostava = 10; obnovKoniecAuto();
      a.odpocet = setInterval(() => {
        if (st.auto !== a || a.gen !== gen) { clearInterval(a.odpocet); return; }
        a.zostava--; obnovKoniecAuto();
        if (a.zostava <= 0) { clearInterval(a.odpocet); a.odpocet = null; Auto.start(a.dalsia); }
      }, 1000);
    };
    setTimeout(() => {
      if (st.auto !== a || a.gen !== gen) return;
      const kratko = a.precvic ? ['Dobre si si to zopakoval.'] : ['Výborne! Téma je prebratá.', ...(a.pokracovat && a.dalsia && !a.precvic ? ['O chvíľu pokračujeme ďalšou témou.'] : [])];
      if (bezHlasu) pokracuj(); else povedzAuto(Nahravky.moze(kratko) ? kratko : veta, pokracuj);
    }, 1500);
  },
  ovladaj(co) {
    const a = st.auto;
    if (!a) return;
    if (co === 'stop') { this.stop(true); return; }
    if (co === 'dalsia') { if (a.dalsia) this.start(a.dalsia); return; }
    if (a.stav === 'koniec') return;
    if (co === 'pauza') {
      if (a.stav === 'pauza') { a.stav = 'hovori'; this.hraj(); }
      else if (a.stav !== 'rucne') { this.zrus(); a.stav = 'pauza'; obnovAuto(); }
      return;
    }
    const seg = (a.kroky[a.k] || a.kroky[a.kroky.length - 1]).seg, zaciatok = i => a.kroky.findIndex(k => k.seg === i);
    this.zrus();
    if (co === 'znova') a.k = zaciatok(seg);
    if (co === 'dalej') a.k = seg + 1 < a.segs.length ? zaciatok(seg + 1) : a.kroky.length - 1;
    if (a.stav !== 'rucne') { a.stav = 'hovori'; obnovAuto(); a.neskor = setTimeout(() => this.hraj(), 150); } // Safari po zrušení reči potrebuje chvíľku
    else this.hraj();
  },
  stop(naspat) {
    this.zrus(); drzObrazovku(false);
    const spat = st.auto && st.auto.spat;
    st.auto = null; document.body.classList.remove('auto-rezim');
    if (naspat) { st.view = spat || 'domov'; render(); scrollTo(0, 0); }
  },
};

// 5.0: postup témy je cesta so štyrmi úsekmi (téma, príklad, otázky, kvíz), autíčko ide po nej plynulo
const AUTO_USEKY = ['Téma', 'Príklad', 'Otázky', 'Kvíz'];
const autoUsek = s => ({ ziarovka: 1, bublina: 2, otaznik: 3, vlajka: 4 })[s.e] ?? 0;
function autoPostup(a) {
  const krok = a.kroky[a.k] || {}, seg = a.segs[krok.seg ?? a.segs.length - 1], u = autoUsek(seg);
  if (u >= 4 || a.stav === 'koniec') return { u: 4, p: 1 };
  const vUseku = a.segs.filter(s => autoUsek(s) === u), j = vUseku.indexOf(seg);
  const vSeg = a.kroky.map((k, i) => ({ ...k, i })).filter(k => k.seg === seg.i), f = vSeg.length ? Math.max(0, vSeg.findIndex(k => k.i === a.k)) / vSeg.length : 0;
  return { u, p: Math.min(1, (u + (j + f) / vUseku.length) / 4) };
}
function textAuto(a) {
  const krok = a.kroky[a.k] || {}, seg = krok.seg ?? a.segs.length - 1;
  const vety = a.kroky.map((k, i) => ({ ...k, i })).filter(k => k.seg === seg && k.typ === 'veta');
  const ukaz = a.stav === 'rucne' ? vety : vety.filter(k => k.i <= a.k);
  return ukaz.map(k => `<span class="${k.i === a.k && a.stav === 'hovori' ? 'teraz' : 'minula'}">${esc(Array.isArray(k.text) ? spojVety(k.text) : k.text)}</span>`).join(' ');
}
function obnovAuto() {
  const a = st.auto, el = id => document.getElementById(id);
  if (!a || a.stav === 'koniec' || !el('auto-text')) return;
  const krok = a.kroky[a.k] || {}, seg = a.segs[krok.seg ?? a.segs.length - 1];
  el('auto-stitok').textContent = seg.label;
  el('auto-text').innerHTML = textAuto(a);
  const teraz = el('auto-text').querySelector('.teraz'); // dlhý text: aktuálna veta ostane nad tlačidlami
  if (teraz) teraz.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  el('auto-cas').innerHTML = a.stav === 'caka'
    ? `<span class="odpocet-kruh"><svg viewBox="0 0 64 64" style="--s:${krok.s}s"><circle cx="32" cy="32" r="27"/><circle class="ostava" cx="32" cy="32" r="27"/></svg><b id="auto-sek" class="cis">${a.zostava}</b></span><span>${krok.co}</span>`
    : a.stav === 'pauza' ? '<span>Pozastavené. Ťuknite na Pokračovať.</span>' : '';
  const { u, p } = autoPostup(a), cesta = el('auto-cesta');
  cesta.style.setProperty('--p', p.toFixed(3));
  cesta.setAttribute('aria-valuenow', Math.round(p * 100)); cesta.setAttribute('aria-valuetext', AUTO_USEKY[Math.min(u, 3)]);
  el('auto-useky').querySelectorAll('span').forEach((s, i) => { s.classList.toggle('h', i < u); s.classList.toggle('tu', i === u); });
  const pz = el('auto-pauza'), stoji = a.stav === 'pauza';
  if (pz.dataset.stoji !== String(stoji)) { pz.dataset.stoji = stoji; pz.innerHTML = stoji ? ikn('hraj') + '<span>Pokračovať</span>' : ikn('pauza') + '<span>Pauza</span>'; }
}
function obnovKoniecAuto() {
  const a = st.auto, el = document.getElementById('auto-dalsia-sek'), r = document.getElementById('auto-odpocet');
  if (r) r.hidden = !(a && a.zostava != null);
  if (el && a) el.textContent = a.zostava;
}
function renderAuto() {
  const a = st.auto, t = byId(a.tid);
  const hore = `<div class="au-hl"><span class="st au-st">${ikn('auto')}Režim do auta</span>${a.precvic ? Precvic.stitok() : ''}<button class="btn kruh dve au-x" data-auto="stop" aria-label="Ukončiť Režim do auta">${ikn('zavriet')}</button></div>`;
  main.classList.add('anim');
  if (a.stav === 'koniec') {
    const v = a.vysledok, d = a.dalsia && byId(a.dalsia);
    main.innerHTML = `<div class="auto auto-koniec">${hore}
      <div class="au-vyhra"><svg class="au-luce" viewBox="0 0 200 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${Array.from({ length: 14 }, (_, i) => { const u1 = (180 + i * 13) * Math.PI / 180, u2 = u1 + 6.5 * Math.PI / 180; return `<path d="M100 130L${(100 + 260 * Math.cos(u1)).toFixed(1)} ${(130 + 260 * Math.sin(u1)).toFixed(1)}L${(100 + 260 * Math.cos(u2)).toFixed(1)} ${(130 + 260 * Math.sin(u2)).toFixed(1)}Z"/>`; }).join('')}</svg>
        <div class="au-mudra">${mudra('oslava', { extra: true, tien: false })}</div></div>
      <h1 class="au-t">${a.precvic ? 'Dobre si si to zopakoval' : 'Výborne'}${st.meno ? ', ' + esc(st.meno) : ''}${a.precvic ? '.' : '!'}</h1>
      <p class="au-pod">${a.precvic ? `Tému „${esc(t.t)}“ si si zopakoval len na precvičenie.` : `Téma „${esc(t.t)}“ je prebratá.`}</p>
      ${v.zisk ? `<div class="au-zisk">${ikn('hviezda')}<span class="cis">+${v.zisk}</span> hviezd</div>` : ''}
      ${odmenyHtml(v)}
      ${d && !a.precvic ? `<button class="au-btn au-dalsia" data-auto="dalsia"><span class="dop">Ďalšia téma</span><b>${esc(d.t)}</b>
        <small id="auto-odpocet" hidden>Spustí sa sama o <b id="auto-dalsia-sek" class="cis">10</b> s</small></button>` : ''}
      <button class="au-btn au-nizke" data-auto="stop">${ikn('domov')}Domov</button></div>`;
    ocisluj(); return;
  }
  main.innerHTML = `<div class="auto">${hore}
    <div class="au-obr">${svg(t)}</div>
    <h1 class="au-t">${t.t}</h1>
    <div class="au-veta"><span class="dop" id="auto-stitok"></span><p class="auto-text" id="auto-text" aria-live="polite"></p><div class="auto-cas" id="auto-cas"></div></div>
    <div class="au-cesta-a"><div class="au-cesta" id="auto-cesta" role="progressbar" aria-label="Postup témy" aria-valuemin="0" aria-valuemax="100" style="--p:0"><i class="au-za"></i><span class="au-auto">${ikn('auto')}</span></div>
      <div class="au-useky" id="auto-useky">${AUTO_USEKY.map(x => `<span>${x}</span>`).join('')}</div></div>
    <div class="auto-ovl"><button class="au-btn" data-auto="znova">${ikn('znova')}<span>Znova</span></button><button class="au-btn au-vel" id="auto-pauza" data-auto="pauza"></button><button class="au-btn" data-auto="dalej">${ikn('preskoc')}<span>Ďalej</span></button></div>
    <label class="au-prepinac"><span>Potom automaticky ďalšia téma</span><input type="checkbox" role="switch" id="auto-dalsia"${a.pokracovat ? ' checked' : ''}></label>
  </div>`;
  ocisluj(); obnovAuto();
}
