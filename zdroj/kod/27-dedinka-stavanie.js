/* 5.1 Moja dedinka: režim stavania na pevných miestach, obchod, batoh, prispôsobenie (farby a tvary) a nábytok v izbe hlavného domu.
   Dáta a pravidlá: 25-dedinka-data.js (Dedinka), scéna a izba: 26-dedinka-scena.js (volá háčiky DedStav.*), štýly: 62-dedinka-stavanie.css.
   Tok: Stavať → dole šuflík (Batoh, Obchod) → vybrať vec → ťuk na svietiaci krúžok → vec dopadne. Ťuk na položenú vec: Posunúť, Otočiť,
   Uschovať, Predať a voľby farieb a tvarov (zadarmo). Späť vráti posledný krok, nákup do 10 s aj s hviezdami. Hotovo zavrie stavanie. */

// skupiny obchodu (stromy a kvety spolu, aby záložky nevyšli z obrazovky)
const DST_SKUPINY = [
  { id: 'domcek', n: 'Domčeky', sk: ['domcek'] }, { id: 'strom', n: 'Stromy a kvety', sk: ['strom', 'kvety'] }, { id: 'plot', n: 'Ploty a cesty', sk: ['plot'] },
  { id: 'zviera', n: 'Zvieratká', sk: ['zviera'] }, { id: 'ozdoba', n: 'Ozdoby', sk: ['ozdoba'] }, { id: 'nabytok', n: 'Nábytok', sk: ['nabytok'] },
];
// stupeň stromu múdrosti, od ktorého sa vec dá kúpiť (drahšie veci prídu, keď strom rastie; nič sa neminie ani nestratí)
const dstStupen = v => v.cena <= 60 ? 0 : v.cena <= 150 ? 1 : v.cena <= 300 ? 2 : v.cena <= 500 ? 3 : 4;
// miesta v izbe (súradnice izby 800 × 480): [x, päta y, mierka, 'p' podlaha alebo 's' stena]; na stenu ide len obraz
const DST_IZBA = { s1: [180, 352, 1.7, 'p'], s2: [292, 352, 1.7, 'p'], s3: [404, 352, 1.7, 'p'], s4: [516, 352, 1.7, 'p'],
  s5: [245, 452, 2.1, 'p'], s6: [500, 456, 2.1, 'p'], s7: [222, 196, 2.2, 's'], s8: [557, 198, 2.2, 's'] };
// mená volieb a ich hodnôt pre šuflík (farby sa ukazujú ako krúžky)
const DST_VOLBA_N = { 'farby.stena': 'Stena', 'farby.strecha': 'Strecha', 'farby.dvere': 'Dvere', okna: 'Okná', komin: 'Komín', sezona: 'Ročné obdobie', plod: 'Plody', farba: 'Farba', material: 'Materiál' };
const DST_HODNOTA_N = { stvorec: 'Štvorcové', okruhle: 'Okrúhle', oblukove: 'Oblúkové', maly: 'Malý', siroky: 'Široký', ziadny: 'Žiadny', jar: 'Jar', leto: 'Leto', jesen: 'Jeseň', zima: 'Zima',
  biely: 'Biely', drevo: 'Drevo', kamen: 'Kameň', zelezo: 'Železo', tehla: 'Tehla' };
const DST_FARBA_VAR = { drevo: '--dv-drevo', 'drevo-d': '--dv-drevo-d', ruzova: '--dv-ruzova', kamen: '--dv-kamen', biela: '--dv-biela', krem: '--dv-krem', sneh: '--dv-sneh' };
const dstFarba = h => /^(coral|sun|teal|sky|violet|leaf)(-[ld])?$/.test(h) || h === 'card' ? `var(--${h})` : DST_FARBA_VAR[h] && h !== 'kamen' && h !== 'drevo' ? `var(${DST_FARBA_VAR[h]})` : null;

Object.assign(IKN, {
  vratit: '<path d="M9 6.5 4.5 11 9 15.5" stroke-width="2.6"/><path d="M5 11h9a5 5 0 0 1 0 10h-2.5" stroke-width="2.6"/>',
  stavat: '<path d="M13.5 10.5 5 19a1.8 1.8 0 0 0 2.5 2.5l8.5-8.5z" fill="var(--sun-d)"/><path d="M10.5 6.2 14.6 3l6.4 6.4-3.2 4.1z" fill="var(--sky)"/>',
  batoh: '<path d="M6 10a6 6 0 0 1 12 0v8.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" fill="var(--coral)"/><path d="M9.5 6.2V5a2.5 2.5 0 0 1 5 0v1.2"/><path d="M9 14h6v3.2H9z" fill="var(--sun)"/>',
  obchod: '<path d="M4.5 11v9h15v-9" fill="#fff"/><path d="M3 11 5 4h14l2 7z" fill="var(--coral)"/><path d="M9 4 8 11M15 4l1 7"/><path d="M9.5 20v-5h5v5" fill="var(--sky-l)"/>',
  posun: '<path d="M12 3.5v17M3.5 12h17M9.3 6.2 12 3.5l2.7 2.7M9.3 17.8l2.7 2.7 2.7-2.7M6.2 9.3 3.5 12l2.7 2.7M17.8 9.3l2.7 2.7-2.7 2.7" stroke-width="2.3"/>',
  otoc: '<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9.5 6.5v12h-6z" fill="var(--sky)"/><path d="M14.5 6.5v12h6z" fill="#fff"/>',
  uschovat: '<path d="M4.5 10h15v8.5A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5z" fill="var(--teal)"/><path d="M3.5 5.5h17V10h-17z" fill="var(--teal-l)"/><path d="M10 13.5h4"/>',
  predat: '<circle cx="12" cy="12" r="8.5" fill="var(--sun)"/><path d="M12 7.3l1.4 2.9 3.1.4-2.3 2.1.6 3.1-2.8-1.6-2.8 1.6.6-3.1-2.3-2.1 3.1-.4z" fill="#fff" stroke-width="1.4"/>',
});

var DedStav = { // var: render() sa volá aj skôr, než sa tento súbor načíta
  zap: false, karta: 'batoh', sk: 'domcek', vyber: null, oznac: null, posun: false, istota: null, spat: [], novy: null, otocene: null, kde: '',
  izba: () => st.view === 'izba',
  reset() { this.vyber = null; this.oznac = null; this.posun = false; this.istota = null; },
  zacni() { this.zap = true; this.reset(); this.spat = []; this.karta = Object.keys(Dedinka.batoh()).some(id => this.patriSem(id)) ? 'batoh' : 'obchod'; Zvuk.hraj('karta'); Render.nova = true; render(); },
  hotovo() { this.zap = false; this.reset(); this.spat = []; Zvuk.hraj('ok'); Render.nova = true; render(); },
  // vec patrí do práve otvoreného miesta: nábytok do izby, ostatné von
  patriSem(id) { const v = DED_VEC[id]; return !!v && (v.sk === 'nabytok') === this.izba(); },
  odomknute(v) { return stromStupen() >= dstStupen(v); },
  // vybraná vec (z batohu, z obchodu, alebo položená vec, ktorá sa práve presúva)
  aktivId() { if (this.vyber) return this.vyber.id; const v = this.posun && this.oznac && Dedinka.vec(this.oznac); return v ? v[0] : null; },
  mozeNa(id, kl, okrem) {
    const v = DED_VEC[id], d = Dedinka.ziskaj(); if (!v || !d) return false;
    if (DED_SLOT.test(kl)) return v.sk === 'nabytok' && !!DST_IZBA[kl] && (id === 'obraz') === (DST_IZBA[kl][3] === 's') && (!d.izba[kl] || kl === okrem);
    if (v.sirka === 2 && /c4$/.test(kl)) return false; // široká vec by preskočila cestu
    return Dedinka.mozeNa(id, kl, okrem);
  },
  krok(k) { this.spat.push(k); if (this.spat.length > 40) this.spat.shift(); },

  // ---------- ťuknutia v scéne (vráti true, ak ich spracovalo stavanie) ----------
  klik(el) {
    const d = el.dataset.ded || '';
    if (!this.zap) { if (d.startsWith('vec:')) { Zvuk.hraj('pop'); DedScena.tras(el); return true; } return false; }
    if (d.startsWith('miesto:')) { this.naMiesto(d.slice(7), el); return true; }
    if (d.startsWith('vec:')) { this.naVec(d.slice(4), el); return true; }
    if (d.startsWith('zam:')) { Zvuk.hraj('zamok'); DedScena.tras(el); toast('Tento kúsok zeme sa odomkne, keď strom múdrosti vyrastie.'); return true; }
    if (d === 'dom') return false; // do izby sa dá ísť aj pri stavaní (stavanie ostane zapnuté)
    if (this.vyber || this.oznac) { Zvuk.hraj('tap'); this.reset(); render(); }
    return true; // hry a strom sa pri stavaní nespúšťajú
  },
  naMiesto(kl, el) {
    const id = this.aktivId(), izba = DED_SLOT.test(kl);
    if (!id) { Zvuk.hraj('tap'); DedScena.tras(el); toast(izba ? 'Najprv vyber dole nábytok.' : 'Najprv vyber dole vec z batohu alebo z obchodu.'); return; }
    if (!this.mozeNa(id, kl, this.posun ? this.oznac : null)) {
      Zvuk.hraj('bad'); DedScena.tras(el);
      toast(izba ? (id === 'obraz' ? 'Obraz patrí na stenu.' : 'Sem sa zmestí len obraz na stenu.') : DED_VEC[id].sirka === 2 ? 'Táto vec je široká, potrebuje dve voľné miesta vedľa seba.' : 'Sem sa to nezmestí.');
      return;
    }
    if (this.posun) {
      const z = this.oznac, r = izba ? Dedinka.presunIzba(z, kl) : Dedinka.presun(z, kl); if (!r.ok) return;
      this.krok({ t: 'presun', z, na: kl }); this.posun = false; this.oznac = kl; this.novy = kl; Zvuk.hraj('pop'); render(); return;
    }
    const { z } = this.vyber;
    if (z === 'obchod') {
      const k = Dedinka.kup(id); if (!k.ok) { this.chyba(k); return; }
      const p = izba ? Dedinka.polozIzba(id, kl) : Dedinka.poloz(id, kl); if (!p.ok) { Dedinka.vratKupu(id); this.chyba(p); return; }
      this.krok({ t: 'kup', id, kl, cas: Date.now() }); Zvuk.hraj('coin');
    } else {
      const p = izba ? Dedinka.polozIzba(id, kl) : Dedinka.poloz(id, kl); if (!p.ok) { this.chyba(p); return; }
      this.krok({ t: 'poloz', id, kl });
    }
    setTimeout(() => Zvuk.hraj('pop'), 260);
    this.vyber = null; this.oznac = kl; this.novy = kl; render();
  },
  naVec(kl, el) {
    if (this.posun) { if (kl === this.oznac) { this.posun = false; Zvuk.hraj('tap'); render(); } else { Zvuk.hraj('bad'); DedScena.tras(el); toast('Toto miesto je obsadené. Vyber svietiaci krúžok.'); } return; }
    if (this.vyber) { Zvuk.hraj('bad'); DedScena.tras(el); toast('Toto miesto je obsadené. Vyber svietiaci krúžok.'); return; }
    Zvuk.hraj('tap'); this.oznac = this.oznac === kl ? null : kl; this.istota = null; render();
  },
  chyba(r) {
    Zvuk.hraj('bad');
    toast({ 'malo-hviezd': `Ešte ti chýba ${r.chyba_hviezd || ''} hviezd. Získaš ich za tému dňa.`.replace('  ', ' '), 'uz-mam': 'Túto vec už máš.', 'plny-batoh': 'Batoh je plný.', plno: 'Dedinka je plná.',
      darovane: 'Darček sa nepredáva, dá sa uschovať do batohu.', obsadene: 'Toto miesto je obsadené.' }[r.chyba] || 'Teraz to nejde.');
  },

  // ---------- tlačidlá šuflíka a hornej lišty ----------
  akcia(el) {
    const a = el.dataset.dst, kl = this.oznac, vec = kl && Dedinka.vec(kl);
    if (a === 'zacni') return this.zacni();
    if (a === 'hotovo') return this.hotovo();
    if (a === 'spat') return this.spatKrok();
    if (a === 'karta') { this.karta = el.dataset.k; this.vyber = null; Zvuk.hraj('tap'); return render(); }
    if (a === 'sk') { this.sk = el.dataset.k; this.vyber = null; Zvuk.hraj('tap'); render(); const p = document.getElementById('dst-pas'); if (p) p.scrollLeft = 0; return; }
    if (a === 'vec') return this.vyberVec(el.dataset.id, el.dataset.z, el);
    if (a === 'predajB') return this.predajZBatohu();
    if (a === 'zrus') { this.reset(); Zvuk.hraj('tap'); return render(); }
    if (!vec) return;
    if (a === 'posun') { this.posun = !this.posun; this.istota = null; Zvuk.hraj('tap'); return render(); }
    if (a === 'otoc') { Dedinka.otoc(kl); this.krok({ t: 'otoc', kl }); this.otocene = kl; Zvuk.hraj('karta'); return render(); }
    if (a === 'uschovaj') {
      const v = [...vec], r = DED_SLOT.test(kl) ? Dedinka.odoberIzba(kl) : Dedinka.odober(kl); if (!r.ok) return;
      this.krok({ t: 'uschovaj', kl, v }); this.reset(); Zvuk.hraj('zavri'); toast(`${DED_VEC[v[0]].n} je v batohu.`); return render();
    }
    if (a === 'predaj') {
      if (this.istota !== kl) { this.istota = kl; Zvuk.hraj('tap'); return render(); } // raz sa opýta
      const v = [...vec], r = Dedinka.predaj(v[0], kl); if (!r.ok) { this.istota = null; this.chyba(r); return render(); }
      this.krok({ t: 'predaj', id: v[0], kl, v, vrat: r.vrat }); this.reset(); Zvuk.hraj('coin'); toast(`Predané, +${r.vrat} hviezd.`); return render();
    }
    if (a === 'volba') {
      const i = +el.dataset.i, n = +el.dataset.h, pred = vec[2] || '', s = pred.padEnd(i + 1, '0').split('');
      s[i] = n.toString(36); const nove = s.join('').replace(/0+$/, '');
      if (nove === pred) return;
      Dedinka.farby(kl, nove); const t = this.spat[this.spat.length - 1];
      if (!(t && t.t === 'farby' && t.kl === kl)) this.krok({ t: 'farby', kl, pred }); // viac zmien za sebou = jeden krok Späť
      Zvuk.hraj('pop'); return render();
    }
  },
  vyberVec(id, z, el) {
    const v = DED_VEC[id]; if (!v) return;
    if (this.vyber && this.vyber.id === id && this.vyber.z === z) { this.vyber = null; Zvuk.hraj('tap'); return render(); }
    if (z === 'obchod') {
      if (!this.odomknute(v)) { Zvuk.hraj('zamok'); DedScena.tras(el); return toast(`Odomkne sa, keď bude strom múdrosti ${STROM_STUPNE[dstStupen(v)].n.toLowerCase()}.`); }
      if (!v.viac && Dedinka.vlastni(id)) { Zvuk.hraj('tap'); DedScena.tras(el); return toast(Dedinka.batoh()[id] ? 'Túto vec už máš v batohu.' : 'Túto vec už máš postavenú.'); }
      if (Dedinka.mesec() < v.cena) { Zvuk.hraj('bad'); DedScena.tras(el); return toast(`Ešte ti chýba ${v.cena - Dedinka.mesec()} hviezd. Získaš ich za tému dňa.`); }
    }
    if (!this.patriSem(id)) { Zvuk.hraj('tap'); DedScena.tras(el); return toast(this.izba() ? 'Táto vec patrí von do dedinky.' : 'Nábytok patrí do domčeka. Ťukni na svoj domček.'); }
    this.vyber = { id, z }; this.oznac = null; this.posun = false; this.istota = null; Zvuk.hraj('tap'); render();
  },
  predajZBatohu() {
    const id = this.vyber && this.vyber.id; if (!id) return;
    if (this.istota !== 'b:' + id) { this.istota = 'b:' + id; Zvuk.hraj('tap'); return render(); }
    const r = Dedinka.predaj(id); this.istota = null; if (!r.ok) { this.chyba(r); return render(); }
    this.krok({ t: 'predaj', id, vrat: r.vrat }); if (!Dedinka.batoh()[id]) this.vyber = null; Zvuk.hraj('coin'); toast(`Predané, +${r.vrat} hviezd.`); render();
  },
  // Späť: vráti posledný krok (nákup do 10 s aj s hviezdami)
  spatKrok() {
    const k = this.spat.pop(); if (!k) return;
    const iz = DED_SLOT.test(k.kl || k.z || ''), odober = kl => iz ? Dedinka.odoberIzba(kl) : Dedinka.odober(kl);
    let tx = '';
    if (k.t === 'kup') { if (Date.now() - k.cas < 10000) { Dedinka.vratKupu(k.id, k.kl); tx = 'Nákup je vrátený, hviezdy sú späť.'; } else { odober(k.kl); tx = 'Vec je späť v batohu.'; } }
    else if (k.t === 'poloz') odober(k.kl);
    else if (k.t === 'presun') { iz ? Dedinka.presunIzba(k.na, k.z) : Dedinka.presun(k.na, k.z); this.novy = k.z; }
    else if (k.t === 'otoc') Dedinka.otoc(k.kl);
    else if (k.t === 'farby') Dedinka.farby(k.kl, k.pred);
    else if (k.t === 'uschovaj') { iz ? Dedinka.polozIzba(k.v[0], k.kl, { zrk: k.v[1], farby: k.v[2] }) : Dedinka.poloz(k.v[0], k.kl, { zrk: k.v[1], farby: k.v[2] }); this.novy = k.kl; }
    else if (k.t === 'predaj') { Dedinka.vratPredaj(k.id, k.vrat, k.kl, k.v); if (k.kl) this.novy = k.kl; }
    this.reset(); Zvuk.hraj('whoosh'); if (tx) toast(tx); render();
  },

  // ---------- kreslenie do scény ----------
  // položená vec: pri stavaní sa dá ťuknúť, vybraná má rámik, nová dopadne s prachom, otočená sa preklopí
  obal(kl, html, m, typ, zrk) {
    if (!this.zap) return this.izba() ? `<g class="ds-tuk dst-vec" data-ded="vec:${kl}" aria-label="${esc(DED_VEC[typ].n)}">${html}</g>` : html;
    const sel = this.oznac === kl, kres = dedKresba(typ), r = dedinkaKresby.RAMCEK[kres] || [-25, -50, 50, 52];
    const x0 = zrk ? m.x - (r[0] + r[2]) * m.s : m.x + r[0] * m.s, ram = sel ? `<rect class="dst-ram" x="${(x0 - 7).toFixed(1)}" y="${(m.y + r[1] * m.s - 7).toFixed(1)}" width="${(r[2] * m.s + 14).toFixed(1)}" height="${(r[3] * m.s + 12).toFixed(1)}" rx="10"/>` : '';
    const tr = (sel ? ' dst-oznac' : '') + (sel && this.posun ? ' dst-zdvih' : '') + (this.novy === kl ? ' dst-dopad' : '') + (this.otocene === kl ? ' dst-otoc' : '');
    const prach = this.novy === kl ? `<g class="dst-prach">${[-1, 1].map(z => [0, 1].map(i => `<circle cx="${(m.x + z * (14 + i * 10) * m.s).toFixed(1)}" cy="${(m.y - 3 - i * 4).toFixed(1)}" r="${(5 - i) * m.s}" style="--dx:${z * (8 + i * 6)}px"/>`).join('')).join('')}</g>` : '';
    return `<g class="ds-tuk dst-vec${tr}" data-ded="vec:${kl}" role="button" tabindex="0" aria-label="${esc(DED_VEC[typ].n)}${sel ? ', vybraná' : ''}">${ram}<g class="dst-pad">${html}</g>${prach}</g>`;
  },
  // krúžok miesta: voľné (biele), môže sem (žlté s plusom), nemôže (bledé), zamknutý rad (sivé so zámkom)
  kruzok(kl, x, y, s, stav, w = 26, hit = 46) {
    const popis = { volne: 'Voľné miesto', ok: 'Položiť sem', nie: 'Sem sa nezmestí', zam: 'Zamknutá zem' }[stav];
    const plus = stav === 'ok' ? `<path d="M${x - 6 * s} ${y - 4 * s}h${12 * s}M${x} ${y - 10 * s}v${12 * s}" class="dst-plus"/>` : stav === 'zam' ? `<g transform="translate(${x - 7 * s} ${y - 15 * s}) scale(${.58 * s})">${IKN.zamok}</g>` : '';
    return `<g class="ds-tuk dst-m dst-${stav}" data-ded="${stav === 'zam' ? 'zam' : 'miesto'}:${kl}" role="button" tabindex="0" aria-label="${popis}">
      <rect x="${x - hit / 2}" y="${y - 52 * s}" width="${hit}" height="${62 * s}" fill="transparent" stroke="none"/>
      <ellipse cx="${x}" cy="${y - 3 * s}" rx="${w * s}" ry="${w * s * .34}" class="dst-el"/>${plus}</g>`;
  },
  // vrstva miest pre scénu vonku: [{y, html}]
  miesta() {
    if (!this.zap || this.izba() || typeof Dedinka === 'undefined') return [];
    const rady = Dedinka.rady(), id = this.aktivId(), v = id && DED_VEC[id], okrem = this.posun ? this.oznac : null, out = [];
    Dedinka.kluceMiest().forEach(kl => {
      const r = +kl[1], [, , , k] = DS_RADY[r]; if (r > rady + 1) return;
      if (r === rady + 1) { const m = dedMiesto(kl); out.push({ y: m.y - .2, html: this.kruzok(kl, m.x, m.y, m.s, 'zam', 22, k - 6) }); return; }
      if (v && v.sirka === 2) { // široká vec: len miesta, kde sa zmestí, krúžok medzi dvoma stĺpcami
        if (this.mozeNa(id, kl, okrem)) { const m = dedMiesto(kl, 2); out.push({ y: m.y - .2, html: this.kruzok(kl, m.x, m.y, m.s, 'ok', 46, k * 2 - 8) }); }
        return;
      }
      const o = Dedinka.obsadene(kl); if (o && o.kluc !== okrem) return;
      if (o && o.kluc === okrem) return; // presúvaná vec stojí na svojom mieste
      const m = dedMiesto(kl); out.push({ y: m.y - .2, html: this.kruzok(kl, m.x, m.y, m.s, !id ? 'volne' : this.mozeNa(id, kl, okrem) ? 'ok' : 'nie', 26, k - 4) });
    });
    return out;
  },
  // nábytok v izbe a pri stavaní jej miesta
  izbaVeci() {
    const d = typeof Dedinka !== 'undefined' && Dedinka.ziskaj(); if (!d) return '';
    const id = this.aktivId(), okrem = this.posun ? this.oznac : null, v = [];
    Object.keys(DST_IZBA).forEach(kl => {
      const [x, y, s, typ] = DST_IZBA[kl], vec = d.izba[kl];
      if (vec) { const kres = dedKresba(vec[0]); if (kres) v.push({ y, html: this.obal(kl, dedinkaVec(kres, { x, y, s, zrkadlo: !!vec[1], ...dedVolby(kres, vec[2]) }), { x, y, s }, vec[0], !!vec[1]) }); return; }
      if (!this.zap) return;
      const stav = !id ? 'volne' : this.mozeNa(id, kl, okrem) ? 'ok' : 'nie';
      if (typ === 's') v.push({ y: 0, html: `<g class="ds-tuk dst-m dst-${stav} dst-st" data-ded="miesto:${kl}" role="button" tabindex="0" aria-label="${stav === 'ok' ? 'Zavesiť sem' : 'Miesto na stene'}"><rect x="${x - 40}" y="${y - 34}" width="80" height="62" rx="12" class="dst-el"/>${stav === 'ok' ? `<path d="M${x - 10} ${y - 3}h20M${x} ${y - 13}v20" class="dst-plus"/>` : ''}</g>` });
      else v.push({ y: y - .2, html: this.kruzok(kl, x, y, s, stav, 30, 120) });
    });
    return v.sort((a, b) => a.y - b.y).map(x => x.html).join('');
  },

  // ---------- šuflík a horná lišta ----------
  tlacidlo() { return this.zap ? '' : `<button class="btn dst-stavat" data-dst="zacni">${ikn('stavat')}Stavať</button>`; },
  hore(nazov) {
    const m = Dedinka.mesec();
    return `<div class="ds-hore dst-hore">
      <button class="btn kruh dve" data-dst="spat" aria-label="Späť o krok"${this.spat.length ? '' : ' disabled'}>${ikn('vratit')}</button>
      <h1 class="ds-n dst-n">${nazov}</h1>
      <span class="dst-mesec" role="status" aria-label="V mešci ${m} hviezd">${ikn('hviezda')}<b>${m}</b></span>
      <button class="btn maly dst-hotovo" data-dst="hotovo">${ikn('check')}Hotovo</button></div>`;
  },
  nahlad(id, trieda = '') { const k = dedKresba(id); return `<span class="dst-obr${trieda}">${k ? dedinkaKresby.svg(k, { popis: '' }) : ''}</span>`; },
  kartaVeci(v, z) {
    const vyb = this.vyber && this.vyber.id === v.id && this.vyber.z === z, b = Dedinka.batoh()[v.id] || 0;
    let dole, tr = '';
    if (z === 'batoh') dole = `<span class="dst-cena dst-pocet">${ikn('batoh')}<b>×${b}</b></span>`;
    else if (!this.odomknute(v)) { tr = ' zam'; dole = `<span class="dst-cena dst-zam">${ikn('zamok')}${esc(STROM_STUPNE[dstStupen(v)].n)}</span>`; }
    else if (!v.viac && Dedinka.vlastni(v.id)) { tr = ' mam'; dole = `<span class="dst-cena dst-ma">${ikn('check')}máš</span>`; }
    else { if (Dedinka.mesec() < v.cena) tr = ' malo'; dole = `<span class="dst-cena">${ikn('hviezda')}<b>${v.cena}</b></span>`; }
    return `<button class="dst-k${tr}${vyb ? ' vyb' : ''}" data-dst="vec" data-id="${v.id}" data-z="${z}" aria-pressed="${vyb}">${this.nahlad(v.id)}<b class="dst-kn">${esc(v.n)}</b>${dole}</button>`;
  },
  suflik() {
    const izba = this.izba(), kl = this.oznac, vec = kl && Dedinka.vec(kl);
    if (vec) return `<div class="dst-suflik" id="dst-suflik" role="region" aria-label="Upraviť vec">${this.panelVeci(kl, vec)}</div>`;
    const b = Dedinka.batoh(), vBatohu = Object.keys(b).filter(id => this.patriSem(id)).map(id => DED_VEC[id]).sort((a, c) => a.cena - c.cena);
    const pocet = vBatohu.reduce((a, v) => a + b[v.id], 0);
    const tabs = `<div class="dst-karty" role="tablist">${[['batoh', 'Batoh', pocet], ['obchod', 'Obchod']].map(([k, n, p]) => `<button role="tab" data-dst="karta" data-k="${k}" aria-selected="${this.karta === k}">${ikn(k)}${n}${p ? ` <i class="dst-poc">${p}</i>` : ''}</button>`).join('')}</div>`;
    let obsah, rada, chips = '';
    if (this.karta === 'batoh') {
      obsah = vBatohu.length ? vBatohu.map(v => this.kartaVeci(v, 'batoh')).join('') : `<p class="dst-prazdny">${izba ? 'Nábytok si kúpiš v obchode.' : 'Batoh je prázdny. Vec si vyber v obchode.'}</p>`;
      const id = this.vyber && this.vyber.id, v = id && DED_VEC[id];
      rada = v ? `Ťukni na svietiaci krúžok. ${Dedinka.predajne(id) ? `<button class="dst-odkaz" data-dst="predajB">${this.istota === 'b:' + id ? `Naozaj predať? +${Math.floor(v.cena / 2)}` : `Predať za ${Math.floor(v.cena / 2)}`}</button>` : ''}` : vBatohu.length ? 'Vyber vec a ťukni na voľný krúžok.' : '';
    } else {
      const sk = izba ? DST_SKUPINY[5] : DST_SKUPINY.find(s => s.id === this.sk) || DST_SKUPINY[0];
      chips = izba ? '' : `<div class="dst-sk" role="group" aria-label="Skupiny">${DST_SKUPINY.map(s => `<button data-dst="sk" data-k="${s.id}" aria-pressed="${s.id === sk.id}">${s.n}</button>`).join('')}</div>`;
      obsah = DED_VECI.filter(v => sk.sk.includes(v.sk) && !v.nekupne).sort((a, c) => a.cena - c.cena).map(v => this.kartaVeci(v, 'obchod')).join('');
      rada = this.vyber ? 'Ťukni na svietiaci krúžok. Späť vráti nákup do 10 sekúnd.' : sk.id === 'nabytok' && !izba ? 'Nábytok sa stavia v domčeku. Ťukni na svoj domček.' : 'Vyber vec. Cena je v hviezdach.';
    }
    return `<div class="dst-suflik" id="dst-suflik" role="region" aria-label="Stavanie">${tabs}${chips}<p class="dst-rada">${rada}</p><div class="dst-pas" id="dst-pas">${obsah}</div></div>`;
  },
  panelVeci(kl, vec) {
    const [id, , retazec] = vec, v = DED_VEC[id], kres = dedKresba(id), V = DEDINKA_VOLBY[kres] || {}, predajne = Dedinka.predajne(id) > 0, vrat = Math.floor(v.cena / 2);
    const akc = [['posun', 'Posunúť', this.posun], ['otoc', 'Otočiť'], ['uschovaj', 'Uschovať']].map(([a, n, p]) => `<button class="dst-a" data-dst="${a}"${p ? ' aria-pressed="true"' : ''}>${ikn(a === 'uschovaj' ? 'uschovat' : a)}<span>${n}</span></button>`).join('')
      + (predajne ? `<button class="dst-a${this.istota === kl ? ' istota' : ''}" data-dst="predaj">${ikn('predat')}<span>${this.istota === kl ? 'Naozaj?' : 'Predať'} <i>+${vrat}</i></span></button>`
        : `<button class="dst-a" data-dst="predaj" aria-disabled="true">${ikn('darcek')}<span>Darček</span></button>`);
    const volby = Object.keys(V).map((dim, i) => {
      const cur = parseInt((retazec || '')[i] || '0', 36);
      const btns = [`<button class="dst-v dst-vz" data-dst="volba" data-i="${i}" data-h="0" aria-pressed="${cur === 0}" aria-label="Pôvodná">${this.nahlad(id, ' mini')}</button>`]
        .concat(V[dim].map((h, j) => { const f = dstFarba(h), n = DST_HODNOTA_N[h] || h;
          return `<button class="dst-v${f ? '' : ' tx'}" data-dst="volba" data-i="${i}" data-h="${j + 1}" aria-pressed="${cur === j + 1}" aria-label="${esc(n)}"${f ? ` style="--f:${f}"` : ''}>${f ? '' : esc(n)}</button>`; }));
      return `<div class="dst-riadok"><span>${DST_VOLBA_N[dim] || dim}</span><div class="dst-volby">${btns.join('')}</div></div>`;
    }).join('');
    const rada = this.posun ? 'Ťukni na svietiaci krúžok, kam ju presunieš.' : Object.keys(V).length ? 'Farby a tvary sú zadarmo.' : '';
    return `<div class="dst-vh">${this.nahlad(id)}<div><b>${esc(v.n)}</b><small>${rada}</small></div><button class="btn kruh dve" data-dst="zrus" aria-label="Zavrieť">${ikn('zavriet')}</button></div>
      <div class="dst-akcie">${akc}</div>${this.posun ? '' : volby}`;
  },
  // po vykreslení: zapamätaný posun šuflíka, jednorazové animácie sa už neopakujú
  po() {
    if (this.kde !== st.view) { if (this.kde) { this.spat = []; this.reset(); } this.kde = st.view; }
    // keď sa vyberie vec alebo nová vec do ruky, scéna sa posunie, aby bolo vidieť ju alebo svietiace miesta
    const cil = this.oznac && this.oznac !== this._o ? this.oznac : this.vyber && this.vyber.id !== this._v ? '*' : null;
    this._o = this.oznac; this._v = this.vyber && this.vyber.id; this.novy = null; this.otocene = null;
    if (cil && this.zap) setTimeout(() => this.ukaz(cil), 40);
  },
  ukaz(cil) {
    try {
      const sc = document.getElementById('ds-scena'); if (!sc) return;
      const s = sc.getBoundingClientRect(), vid = r => r.left >= s.left + 10 && r.right <= s.right - 10;
      const els = cil === '*' ? [...sc.querySelectorAll('.dst-ok')] : [sc.querySelector('[data-ded="vec:' + cil + '"]')].filter(Boolean);
      if (!els.length || els.some(e => vid(e.getBoundingClientRect()))) return;
      const r = els.map(e => e.getBoundingClientRect()).sort((a, b) => Math.abs(a.left - s.left - s.width / 2) - Math.abs(b.left - s.left - s.width / 2))[0];
      sc.scrollTo({ left: sc.scrollLeft + r.left + r.width / 2 - s.left - sc.clientWidth / 2, behavior: tiche ? 'auto' : 'smooth' });
    } catch (e) { /* test bez prehliadača */ }
  },
};

document.addEventListener('click', e => {
  const t = e.target && e.target.closest && e.target.closest('[data-dst]'); if (!t || Prechod.bezi || t.disabled) return;
  e.stopPropagation(); DedStav.akcia(t);
});
