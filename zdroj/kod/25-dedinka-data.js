/* Moja dedinka (5.1): dáta a výpočty bez vzhľadu. Obrazovky, stavanie, cesta a truhličky na ne nadväzujú cez objekt `Dedinka`.
   Dokument dieťaťa: rodiny/{uid}/deti/{id}/hra/dedinka (samostatný, aby ho stará appka pri uložení dieťaťa nezmazala).
   Lokálne je kópia v S ('dedinka-<id>', offline), do cloudu ide s oneskorením cez Cloud.naplanujDedinku (32-cloud-ukladanie.js).
   Mena je jediná: hviezdy. mešec = (body - start) + dar - minute; `body` sa nikdy neznižuje a odomykanie hier sa nemení. */

// skupiny vecí; pre každú vec: [id, názov, skupina, cena, zdroj kresby, kľúč kresby (ak je iný ako id), príznaky]
// kresba = K51[zdroj][kľúč] z koncept-51-zdroj/kresby.js; príznaky: 2 = zaberá dva stĺpce, 'v' = dá sa kúpiť viackrát, 'n' = nekúpiteľná (z cesty), 'z' = chýba kresba
const DED_SKUPINY = [
  { id: 'domcek', n: 'Domčeky' }, { id: 'strom', n: 'Stromy' }, { id: 'kvety', n: 'Kvety' }, { id: 'plot', n: 'Ploty' },
  { id: 'zviera', n: 'Zvieratká' }, { id: 'ozdoba', n: 'Ozdoby' }, { id: 'nabytok', n: 'Nábytok' },
];
const DED_VECI = [
  ['stan', 'Stan', 'domcek', 60, 'DOM'], ['chalupka', 'Chalúpka', 'domcek', 150, 'DOM'], ['hrib', 'Hríbik', 'domcek', 180, 'DOM'],
  ['stodola', 'Stodola', 'domcek', 200, 'DOM', 0, 2], ['vezicka', 'Vežička', 'domcek', 240, 'DOM'], ['mlyn', 'Mlyn', 'domcek', 400, 'DOM', 0, 2],
  ['zamocek', 'Zámoček', 'domcek', 1500, 'DOM', 0, [2, 'z']], ['iglu', 'Iglu', 'domcek', 0, 'DOM', 0, 'n'],
  ['ker', 'Krík', 'strom', 15, 'STROM', 0, 'v'], ['gulaty', 'Guľatý strom', 'strom', 30, 'STROM', 0, 'v'], ['smrek', 'Smrek', 'strom', 35, 'STROM', 0, 'v'],
  ['breza', 'Breza', 'strom', 40, 'STROM', 0, 'v'], ['jablon', 'Jabloň', 'strom', 45, 'STROM', 0, 'v'], ['jesen', 'Jesenný strom', 'strom', 50, 'STROM', 0, 'v'],
  ['ceresna', 'Čerešňa', 'strom', 60, 'STROM', 0, 'v'], ['palma', 'Palma', 'strom', 120, 'STROM', 0, 'v'],
  ['kvety', 'Kvietky', 'kvety', 10, 'MALE', 0, 'v'], ['huby', 'Huby', 'kvety', 12, 'MALE', 0, 'v'], ['tulipany', 'Tulipány', 'kvety', 15, 'MALE', 0, 'v'], ['slnecnica', 'Slnečnica', 'kvety', 20, 'MALE', 0, 'v'],
  ['kamen_cesta', 'Kamienky', 'plot', 10, 'MALE', 0, 'v'], ['plot', 'Plot', 'plot', 12, 'MALE', 0, 'v'], ['zivyplot', 'Živý plot', 'plot', 18, 'MALE', 0, 'v'], ['mostik', 'Mostík', 'plot', 90, 'MALE', 0, 2],
  ['sliepka', 'Sliepka', 'zviera', 60, 'ZVER'], ['kacka', 'Kačka', 'zviera', 70, 'ZVER'], ['zajac', 'Zajko', 'zviera', 80, 'ZVER'], ['jez', 'Ježko', 'zviera', 90, 'ZVER'],
  ['macka', 'Mačka', 'zviera', 100, 'ZVER'], ['ovca', 'Ovečka', 'zviera', 110, 'ZVER'], ['pes', 'Psík', 'zviera', 130, 'ZVER'],
  ['schranka', 'Schránka', 'ozdoba', 20, 'MALE'], ['sud', 'Sud', 'ozdoba', 15, 'MALE'], ['kamene', 'Kamene', 'ozdoba', 15, 'MALE'], ['seno', 'Kopa sena', 'ozdoba', 20, 'MALE'],
  ['vlajocky', 'Vlajočky', 'ozdoba', 25, 'MALE'], ['lampa', 'Lampa', 'ozdoba', 30, 'MALE'], ['lavicka', 'Lavička', 'ozdoba', 35, 'MALE'], ['lucerny', 'Lampióny', 'ozdoba', 40, 'MALE'],
  ['strasiak', 'Strašiak', 'ozdoba', 45, 'MALE'], ['hojdacka', 'Hojdačka', 'ozdoba', 90, 'MALE'], ['studna', 'Studňa', 'ozdoba', 110, 'MALE'], ['jazierko', 'Jazierko', 'ozdoba', 140, 'MALE', 0, 2],
  ['fontana', 'Fontána', 'ozdoba', 250, 'MALE'], ['socha', 'Socha hviezdy', 'ozdoba', 300, 'MALE'], ['snehuliak', 'Snehuliak', 'ozdoba', 0, 'MALE', 0, 'n'],
  ['kvetinac', 'Kvetináč', 'nabytok', 15, 'NAB'], ['stolicka', 'Stolička', 'nabytok', 20, 'NAB'], ['obraz', 'Obraz', 'nabytok', 25, 'NAB'], ['koberec', 'Koberec', 'nabytok', 30, 'NAB'],
  ['lampa_izba', 'Lampa do izby', 'nabytok', 30, 'NAB', 'lampa'], ['stol', 'Stôl', 'nabytok', 40, 'NAB'], ['globus', 'Glóbus', 'nabytok', 50, 'NAB'], ['kreslo', 'Kreslo', 'nabytok', 60, 'NAB'],
  ['postel', 'Posteľ', 'nabytok', 70, 'NAB'], ['polica', 'Polica', 'nabytok', 80, 'NAB'], ['akvarium', 'Akvárium', 'nabytok', 150, 'NAB'], ['dalekohlad', 'Ďalekohľad', 'nabytok', 250, 'NAB'],
].map(([id, n, sk, cena, z, k, p]) => { const f = [].concat(p || []); return { id, n, sk, cena, kresba: f.includes('z') ? null : [z, k || id], sirka: f.includes(2) ? 2 : 1, viac: f.includes('v'), nekupne: f.includes('n') }; });
const DED_VEC = Object.fromEntries(DED_VECI.map(v => [v.id, v]));
const DED_RADY = 5, DED_STLPCE = 8, DED_IZBA = 8, DED_ZEM_START = 2, DED_MAX_MIEST = 120, DED_MAX_BATOH = 200;
// voľby vecí (strecha, steny, dvere, materiál, farba, variant...) nesie položená vec ako krátky reťazec [0-9a-z]: jeden znak = jedna voľba, poradie určuje kresba; zmena je zadarmo
const DED_VOLBY = 16;
const DED_KLUC = /^r([1-5])c([1-8])$/, DED_SLOT = /^s([1-8])$/;
const DED_UPRAVENE_POLE = ['v', 'start', 'dar', 'minute', 'zem', 'miesta', 'batoh', 'dary', 'izba', 'cesta', 'truhly', 'hryDen', 'hryHv'];
// Cesta mesiaca: 30 zastávok po 40 krokoch (krok = získaná hviezda alebo splnená úloha týždňa); každá 5. strieborná truhlička, 30. zlatá
const DED_KROKOV = 40, DED_ZASTAVOK = 30, DED_HRY_DEN = 20;
const DED_CESTY = {
  // kľúč = zastávka, hodnota = id veci; zastávky 5, 10, … sú strieborné truhličky, 30. zlatá; chýbajúce dopočíta cestaOdmena
  '2026-12': { n: 'Zimná cesta', odmeny: { 1: 'smrek', 2: 'lucerny', 3: 'lavicka', 4: 'vlajocky', 6: 'smrek', 7: 'lampa', 8: 'kamene', 9: 'kamen_cesta', 11: 'seno', 12: 'snehuliak', 13: 'ker',
    14: 'sud', 16: 'plot', 17: 'zajac', 18: 'smrek', 19: 'strasiak', 21: 'zivyplot', 22: 'ovca', 23: 'smrek', 24: 'iglu', 26: 'hojdacka', 27: 'smrek', 28: 'ker', 29: 'studna' } },
  '2027-01': { n: 'Ľadové kráľovstvo', odmeny: {} }, '2027-02': { n: 'Karneval', odmeny: {} },
};
const DED_ULOHY = [
  { id: 'temy3', n: 'Prečítaj 3 témy dňa', ciel: 3, kroky: 15 }, { id: 'hry2', n: 'Zahraj 2 rôzne hry', ciel: 2, kroky: 10 }, { id: 'strom4', n: 'Polej strom 4 dni', ciel: 4, kroky: 15 },
];
const DED_TRUHLY = { vitaj: { n: 'Uvítacia truhlička', hviezdy: 0 }, drevo: { n: 'Drevená truhlička', hviezdy: 10 }, striebro: { n: 'Strieborná truhlička', hviezdy: 20 }, zlato: { n: 'Zlatá truhlička', hviezdy: 50 } };

const Dedinka = {
  d: null, id: null,
  // ---------- prázdny a štartový dokument, čistenie ----------
  prazdny(start = 0, dar = 100) {
    return { v: 1, start, dar, minute: 0, zem: DED_ZEM_START, miesta: {}, batoh: {}, dary: {}, izba: {}, cesta: { mes: '', kroky: 0, vzate: [] }, truhly: { temy: 0, cakaju: [], otv: 0, stupen: 0 }, hryDen: '', hryHv: 0 };
  },
  // dokument z cloudu alebo z pamäte zariadenia: doplní chýbajúce, orezá nezmysly (nikdy nehádže chybu)
  cisti(raw) {
    const r = raw && typeof raw === 'object' ? raw : {}, ci = (x, lo, hi, def) => Number.isFinite(+x) ? Math.min(hi, Math.max(lo, Math.round(+x))) : def;
    const d = Dedinka.prazdny(ci(r.start, 0, 1e6, 0), ci(r.dar, 0, 1e5, 100));
    d.minute = ci(r.minute, 0, 1e6, 0); d.zem = ci(r.zem, DED_ZEM_START, DED_RADY, DED_ZEM_START);
    const mapa = (m, ok) => { const o = {}; if (m && typeof m === 'object') for (const k of Object.keys(m)) if (ok(k, m[k])) o[k] = m[k]; return o; };
    d.miesta = mapa(r.miesta, (k, v) => DED_KLUC.test(k) && Array.isArray(v) && DED_VEC[v[0]] && DED_VEC[v[0]].sk !== 'nabytok');
    for (const k of Object.keys(d.miesta)) { const v = d.miesta[k]; d.miesta[k] = [v[0], v[1] ? 1 : 0, typeof v[2] === 'string' ? v[2].replace(/[^0-9a-z]/g, '').slice(0, DED_VOLBY) : '']; }
    const kolko = (m) => mapa(m, (k, v) => DED_VEC[k] && Number.isFinite(+v) && +v > 0);
    d.batoh = kolko(r.batoh); d.dary = kolko(r.dary); for (const k of Object.keys(d.batoh)) d.batoh[k] = ci(d.batoh[k], 1, 99, 1); for (const k of Object.keys(d.dary)) d.dary[k] = ci(d.dary[k], 1, 99, 1);
    // izba: { s3: [typ, zrkadlo, voľby] } ako miesta vonku (starší zápis { s3: typ } sa prevedie)
    d.izba = mapa(r.izba, (k, v) => { const id = Array.isArray(v) ? v[0] : v; return DED_SLOT.test(k) && DED_VEC[id] && DED_VEC[id].sk === 'nabytok'; });
    for (const k of Object.keys(d.izba)) { const v = [].concat(d.izba[k]); d.izba[k] = [v[0], v[1] ? 1 : 0, typeof v[2] === 'string' ? v[2].replace(/[^0-9a-z]/g, '').slice(0, DED_VOLBY) : '']; }
    const c = r.cesta && typeof r.cesta === 'object' ? r.cesta : {};
    d.cesta = { mes: /^\d{4}-\d\d$/.test(c.mes) ? c.mes : '', kroky: ci(c.kroky, 0, 1e5, 0), vzate: (Array.isArray(c.vzate) ? c.vzate : []).map(Number).filter(x => x >= 1 && x <= DED_ZASTAVOK).slice(0, DED_ZASTAVOK) };
    if (c.min && typeof c.min === 'object') d.cesta.min = mapa(c.min, (k, v) => /^\d{4}-\d\d$/.test(k) && v && Number.isFinite(+v.s)); // staršie mesiace s nevyzdvihnutými zastávkami: { 'rrrr-mm': { s: kroky, v: [vzaté] } }
    if (c.ul && typeof c.ul === 'object') d.cesta.ul = { t: String(c.ul.t || '').slice(0, 10), p: mapa(c.ul.p, (k, v) => DED_ULOHY.some(u => u.id === k) && Number.isFinite(+v)), h: (c.ul.h || []).filter(x => DED_ULOHY.some(u => u.id === x)), hry: (c.ul.hry || []).filter(x => typeof x === 'string').slice(0, 20) };
    const t = r.truhly && typeof r.truhly === 'object' ? r.truhly : {};
    d.truhly = { temy: ci(t.temy, 0, 1e5, 0), cakaju: (Array.isArray(t.cakaju) ? t.cakaju : []).filter(x => DED_TRUHLY[x]).slice(0, 50), otv: ci(t.otv, 0, 1e5, 0), stupen: ci(t.stupen, 0, 9, 0) };
    if (typeof t.den === 'string') d.truhly.den = t.den.slice(0, 10);
    d.hryDen = typeof r.hryDen === 'string' ? r.hryDen.slice(0, 10) : ''; d.hryHv = ci(r.hryHv, 0, 1000, 0);
    return d;
  },
  // štartová dedinka: chalúpka a schránka, uvítací dar a uvítacia truhlička. Starý účet (body > 0) dostane dar 100 + desatinu bodov, najviac 300.
  zalozNovy(body = st.body) {
    const b = Math.max(0, Math.round(body || 0)), d = Dedinka.prazdny(b, Math.min(100 + Math.floor(b / 10), 300));
    d.miesta.r2c2 = ['chalupka', 0, '']; d.miesta.r2c3 = ['schranka', 0, '']; d.dary.chalupka = 1; d.dary.schranka = 1;
    d.truhly.cakaju.push('vitaj'); d.cesta.mes = Dedinka.mesiac(); d.truhly.stupen = typeof stromStupen === 'function' ? stromStupen() : 0; // starý stupeň stromu zlatú truhličku nedáva
    return d;
  },
  // ---------- ukladanie ----------
  kluc: id => 'dedinka-' + id,
  // načíta dedinku aktívneho dieťaťa z pamäte zariadenia; ak tam nie je a nie je cloud, vznikne štartová (profil bez účtu je len lokálny)
  ziskaj() {
    const id = st.dietaId; if (!id) return null;
    if (this.id !== id) { this.id = id; this.d = null; }
    if (this.d) return this.d;
    const raw = S.get(this.kluc(id), null);
    if (raw) this.d = this.cisti(raw);
    else if (!(window.Cloud && window.Cloud.pouzivatel)) { this.d = this.zalozNovy(); this.uloz(true); }
    if (this.d) this.obnov(true);
    return this.d;
  },
  // cloud: dokument ešte neexistuje (server to povedal) = migrácia starého účtu; nikdy neprepíše existujúci
  zaloz(id) {
    if (id !== st.dietaId) return null;
    this.id = id; this.d = this.cisti(S.get(this.kluc(id), null)); // lokálna kópia, ak už bola, ostáva
    if (!S.get(this.kluc(id), null)) this.d = this.zalozNovy();
    this.obnov(true); this.uloz();
    return this.d;
  },
  // zmena z cloudu (iný telefón alebo prvé načítanie)
  prevezmi(id, data) {
    if (id !== st.dietaId) return;
    this.id = id; this.d = this.cisti(data); this.obnov(true);
    try { localStorage.setItem('svet3:' + this.kluc(id), JSON.stringify(this.d)); } catch (e) {}
  },
  uloz(len_lokalne) {
    if (!this.d || !this.id) return;
    S.set(this.kluc(this.id), this.d);
    if (!len_lokalne && window.Cloud && window.Cloud.naplanujDedinku) window.Cloud.naplanujDedinku(this.id, this.d);
  },
  // telo na zápis do cloudu (len povolené kľúče)
  telo() { const o = {}; for (const k of DED_UPRAVENE_POLE) o[k] = this.d[k]; return o; },
  // ---------- mešec ----------
  mesiac: (dt = new Date()) => key(dt).slice(0, 7),
  mesec() { const d = this.ziskaj(); return d ? Math.max(0, Math.round(st.body - d.start + d.dar - d.minute)) : 0; },
  vlastni(id) { const d = this.ziskaj(); if (!d) return 0; return (d.batoh[id] || 0) + Object.values(d.miesta).filter(v => v[0] === id).length + Object.values(d.izba).filter(v => v[0] === id).length; },
  predajne(id) { const d = this.ziskaj(); return d ? Math.max(0, this.vlastni(id) - (d.dary[id] || 0)) : 0; }, // koľko kusov je kúpených (darované sa len uschovávajú)
  // ---------- kúpa a predaj ----------
  kup(id) {
    const d = this.ziskaj(), v = DED_VEC[id];
    if (!d || !v) return { ok: false, chyba: 'nezname' };
    if (v.nekupne) return { ok: false, chyba: 'nekupne' };
    if (!v.viac && this.vlastni(id)) return { ok: false, chyba: 'uz-mam' };
    if (Object.values(d.batoh).reduce((a, n) => a + n, 0) >= DED_MAX_BATOH) return { ok: false, chyba: 'plny-batoh' };
    if (this.mesec() < v.cena) return { ok: false, chyba: 'malo-hviezd', chyba_hviezd: v.cena - this.mesec() };
    d.minute += v.cena; d.batoh[id] = (d.batoh[id] || 0) + 1; this.uloz();
    return { ok: true, cena: v.cena, mesec: this.mesec() };
  },
  // predá kus z batohu, alebo (s miestom: 'r2c5' alebo 's3') položený kus; vráti polovicu ceny; darované veci sa predať nedajú
  predaj(id, miesto) {
    const d = this.ziskaj(), v = DED_VEC[id];
    if (!d || !v || v.nekupne) return { ok: false, chyba: 'nepredajne' };
    if (!this.predajne(id)) return { ok: false, chyba: 'darovane' };
    if (miesto) { if (d.miesta[miesto] && d.miesta[miesto][0] === id) delete d.miesta[miesto]; else if (d.izba[miesto] && d.izba[miesto][0] === id) delete d.izba[miesto]; else return { ok: false, chyba: 'tam-nie-je' }; }
    else if (d.batoh[id]) { if (!--d.batoh[id]) delete d.batoh[id]; }
    else return { ok: false, chyba: 'nie-je-v-batohu' };
    const vrat = Math.floor(v.cena / 2); d.minute = Math.max(0, d.minute - vrat); this.uloz();
    return { ok: true, vrat, mesec: this.mesec() };
  },
  // ---------- miesta ----------
  // mriežka 5 radov x 8 stĺpcov, kľúč r{rad}c{stĺpec} (od 1; rad 1 je vzadu); široké veci zaberú aj stĺpec vpravo
  kluceMiest: () => { const a = []; for (let r = 1; r <= DED_RADY; r++) for (let c = 1; c <= DED_STLPCE; c++) a.push('r' + r + 'c' + c); return a; },
  rady() { const d = this.ziskaj(); return d ? d.zem : DED_ZEM_START; }, // odomknuté rady 1..rady
  obsadene(kluc) { // kto zaberá miesto: { kluc, typ } alebo null (aj sused široké veci vľavo)
    const d = this.ziskaj(), m = DED_KLUC.exec(kluc); if (!d || !m) return null;
    if (d.miesta[kluc]) return { kluc, typ: d.miesta[kluc][0] };
    const l = 'r' + m[1] + 'c' + (+m[2] - 1);
    if (+m[2] > 1 && d.miesta[l] && DED_VEC[d.miesta[l][0]].sirka === 2) return { kluc: l, typ: d.miesta[l][0] };
    return null;
  },
  mozeNa(id, kluc, okrem) { // je možné položiť vec na miesto? (okrem = miesto, z ktorého sa vec presúva)
    const d = this.ziskaj(), v = DED_VEC[id], m = DED_KLUC.exec(kluc);
    if (!d || !v || !m || v.sk === 'nabytok') return false;
    if (+m[1] > d.zem) return false;
    const cs = v.sirka === 2 ? [+m[2], +m[2] + 1] : [+m[2]];
    if (cs[cs.length - 1] > DED_STLPCE) return false;
    return cs.every(c => { const o = this.obsadene('r' + m[1] + 'c' + c); return !o || o.kluc === okrem; });
  },
  poloz(id, kluc, o = {}) { // z batohu na miesto
    const d = this.ziskaj(); if (!d) return { ok: false, chyba: 'nezname' };
    if (!d.batoh[id]) return { ok: false, chyba: 'nie-je-v-batohu' };
    if (!this.mozeNa(id, kluc)) return { ok: false, chyba: 'obsadene' };
    if (Object.keys(d.miesta).length >= DED_MAX_MIEST) return { ok: false, chyba: 'plno' };
    if (!--d.batoh[id]) delete d.batoh[id];
    d.miesta[kluc] = [id, o.zrk ? 1 : 0, String(o.farby || '').replace(/[^0-9a-z]/g, '').slice(0, DED_VOLBY)]; this.uloz();
    return { ok: true };
  },
  odober(kluc) { // späť do batohu (zadarmo)
    const d = this.ziskaj(); if (!d || !d.miesta[kluc]) return { ok: false, chyba: 'tam-nie-je' };
    const id = d.miesta[kluc][0]; delete d.miesta[kluc]; d.batoh[id] = (d.batoh[id] || 0) + 1; this.uloz();
    return { ok: true, id };
  },
  presun(z, na) {
    const d = this.ziskaj(); if (!d || !d.miesta[z]) return { ok: false, chyba: 'tam-nie-je' };
    if (z === na) return { ok: true };
    if (!this.mozeNa(d.miesta[z][0], na, z)) return { ok: false, chyba: 'obsadene' };
    d.miesta[na] = d.miesta[z]; delete d.miesta[z]; this.uloz(); return { ok: true };
  },
  vec(kluc) { const d = this.ziskaj(); return !d ? null : DED_SLOT.test(kluc) ? d.izba[kluc] || null : d.miesta[kluc] || null; }, // položená vec vonku alebo v izbe: [typ, zrkadlo, voľby]
  otoc(kluc) { const v = this.vec(kluc); if (!v) return false; v[1] = v[1] ? 0 : 1; this.uloz(); return true; },
  farby(kluc, f) { const v = this.vec(kluc); if (!v) return false; v[2] = String(f || '').replace(/[^0-9a-z]/g, '').slice(0, DED_VOLBY); this.uloz(); return true; },
  // Späť pri stavaní: nákup do 10 s sa vráti celý (vec zmizne, hviezdy sú späť); predaj sa vráti (vec na miesto alebo do batohu, hviezdy späť)
  vratKupu(id, kluc) {
    const d = this.ziskaj(), v = DED_VEC[id]; if (!d || !v) return { ok: false, chyba: 'nezname' };
    if (kluc) { const x = this.vec(kluc); if (!x || x[0] !== id) return { ok: false, chyba: 'tam-nie-je' }; delete (DED_SLOT.test(kluc) ? d.izba : d.miesta)[kluc]; }
    else if (d.batoh[id]) { if (!--d.batoh[id]) delete d.batoh[id]; } else return { ok: false, chyba: 'nie-je-v-batohu' };
    d.minute = Math.max(0, d.minute - v.cena); this.uloz(); return { ok: true, vrat: v.cena };
  },
  vratPredaj(id, vrat, kluc, vec) {
    const d = this.ziskaj(); if (!d || !DED_VEC[id] || this.mesec() < vrat) return { ok: false, chyba: 'malo-hviezd' };
    if (kluc) { if (this.vec(kluc) || (!DED_SLOT.test(kluc) && !this.mozeNa(id, kluc))) return { ok: false, chyba: 'obsadene' }; (DED_SLOT.test(kluc) ? d.izba : d.miesta)[kluc] = vec ? [...vec] : [id, 0, '']; }
    else d.batoh[id] = (d.batoh[id] || 0) + 1;
    d.minute += vrat; this.uloz(); return { ok: true };
  },
  // izba prvého domčeka: nábytok na pevných miestach s1..s8
  polozIzba(id, slot, o = {}) {
    const d = this.ziskaj(), v = DED_VEC[id]; if (!d || !v || v.sk !== 'nabytok' || !DED_SLOT.test(slot)) return { ok: false, chyba: 'nezname' };
    if (!d.batoh[id]) return { ok: false, chyba: 'nie-je-v-batohu' }; if (d.izba[slot]) return { ok: false, chyba: 'obsadene' };
    if (!--d.batoh[id]) delete d.batoh[id]; d.izba[slot] = [id, o.zrk ? 1 : 0, String(o.farby || '').replace(/[^0-9a-z]/g, '').slice(0, DED_VOLBY)]; this.uloz(); return { ok: true };
  },
  presunIzba(z, na) {
    const d = this.ziskaj(); if (!d || !d.izba[z] || !DED_SLOT.test(na)) return { ok: false, chyba: 'tam-nie-je' };
    if (z === na) return { ok: true }; if (d.izba[na]) return { ok: false, chyba: 'obsadene' };
    d.izba[na] = d.izba[z]; delete d.izba[z]; this.uloz(); return { ok: true };
  },
  odoberIzba(slot) { const d = this.ziskaj(); if (!d || !d.izba[slot]) return { ok: false, chyba: 'tam-nie-je' }; const id = d.izba[slot][0]; delete d.izba[slot]; d.batoh[id] = (d.batoh[id] || 0) + 1; this.uloz(); return { ok: true, id }; },
  batoh() { const d = this.ziskaj(); return d ? { ...d.batoh } : {}; },
  // ---------- zem podľa stupňa stromu ----------
  zemPodlaStupna: i => Math.min(DED_RADY, Math.max(DED_ZEM_START, i + 1)), // stupne 0 a 1: 2 rady, potom po jednom (stupeň 4: všetkých 5)
  // zem nikdy neubúda (vädnutie ju neberie); nový stupeň stromu prvý raz = nový rad a zlatá truhlička. Vráti true, ak niečo pribudlo.
  obnov(ticho) {
    const d = this.d; if (!d) return false;
    let zmena = false;
    const i = typeof stromStupen === 'function' ? stromStupen() : 0, z = this.zemPodlaStupna(i);
    if (z > d.zem) { d.zem = z; zmena = true; }
    if (i > d.truhly.stupen) { if (i >= 2) d.truhly.cakaju.push('zlato'); d.truhly.stupen = i; zmena = true; } // zlatá za nový stupeň stromu od tretieho (index 2)
    const m = this.mesiac();
    if (d.cesta.mes !== m) { // nový mesiac: staré nevyzdvihnuté zastávky ostávajú v cesta.min
      if (d.cesta.mes && Math.floor(d.cesta.kroky / DED_KROKOV) > d.cesta.vzate.length) { d.cesta.min = d.cesta.min || {}; d.cesta.min[d.cesta.mes] = { s: d.cesta.kroky, v: d.cesta.vzate }; const k = Object.keys(d.cesta.min).sort(); while (k.length > 6) delete d.cesta.min[k.shift()]; }
      d.cesta.mes = m; d.cesta.kroky = 0; d.cesta.vzate = []; zmena = true;
    }
    if (zmena && !ticho) this.uloz(); else if (zmena) this.uloz(true);
    return zmena;
  },
  // ---------- Cesta mesiaca ----------
  cestaOdmena(mes, i) { // odmena zastávky i (1..30): { typ: 'vec', id } | { typ: 'truhla', t }
    const c = DED_CESTY[mes], v = c && c.odmeny && c.odmeny[i];
    if (v) return { typ: 'vec', id: v };
    if (i === DED_ZASTAVOK) return { typ: 'truhla', t: 'zlato' };
    if (i % 5 === 0) return { typ: 'truhla', t: 'striebro' };
    const zoz = DED_VECI.filter(x => !x.nekupne && x.cena <= 60 && x.sk !== 'nabytok'), h = +mes.slice(5, 7) || 0;
    return { typ: 'vec', id: zoz[(i * 7 + h * 3) % zoz.length].id };
  },
  cestaStav(mes) { // { mes, n (názov), kroky, zastavky: [{ i, odmena, dost, vzate }], dalsia: krokov do ďalšej zastávky }
    const d = this.ziskaj(); if (!d) return null;
    const m = mes || d.cesta.mes, tento = m === d.cesta.mes, o = tento ? d.cesta : (d.cesta.min || {})[m]; if (!o) return null;
    const kroky = tento ? o.kroky : o.s, vz = tento ? o.vzate : o.v, dost = Math.min(DED_ZASTAVOK, Math.floor(kroky / DED_KROKOV));
    return { mes: m, n: (DED_CESTY[m] || {}).n || 'Cesta mesiaca', kroky, dostupne: dost - vz.length,
      zastavky: Array.from({ length: DED_ZASTAVOK }, (_, k) => ({ i: k + 1, odmena: this.cestaOdmena(m, k + 1), dost: k + 1 <= dost, vzate: vz.includes(k + 1) })), dalsia: dost >= DED_ZASTAVOK ? 0 : DED_KROKOV - kroky % DED_KROKOV };
  },
  krok(n) { // každá získaná hviezda je krok (aj keď ju dieťa minie)
    const d = this.ziskaj(); if (!d || !(n > 0)) return; this.obnov(true); d.cesta.kroky = Math.min(1e5, d.cesta.kroky + Math.round(n)); this.uloz();
  },
  cestaVezmi(i, mes) { // vyzdvihne zastávku; vráti { ok, odmena, vec: dostal sa duplikát -> hviezdy }
    const d = this.ziskaj(), s = d && this.cestaStav(mes); if (!s) return { ok: false, chyba: 'nezname' };
    const z = s.zastavky[i - 1]; if (!z || !z.dost || z.vzate) return { ok: false, chyba: z && z.vzate ? 'uz-vzate' : 'este-nie' };
    (s.mes === d.cesta.mes ? d.cesta.vzate : d.cesta.min[s.mes].v).push(i);
    const r = this.dajOdmenu(z.odmena);
    if (s.mes !== d.cesta.mes && d.cesta.min[s.mes].v.length >= Math.floor(d.cesta.min[s.mes].s / DED_KROKOV)) delete d.cesta.min[s.mes];
    this.uloz(); return { ok: true, odmena: z.odmena, ...r };
  },
  dajOdmenu(o) { // vec ide do batohu ako dar (nedá sa predať); ak ju dieťa už má (a nie je viackrát kupovateľná), dostane 10 hviezd
    const d = this.d;
    if (o.typ === 'truhla') { d.truhly.cakaju.push(o.t); return {}; }
    const v = DED_VEC[o.id];
    if (!v.viac && this.vlastni(o.id)) { d.dar += 10; return { hviezdy: 10 }; }
    d.batoh[o.id] = (d.batoh[o.id] || 0) + 1; d.dary[o.id] = (d.dary[o.id] || 0) + 1; return { id: o.id };
  },
  // úlohy týždňa (3, ľahké): postup sa počíta od pondelka
  tyzden(dt = new Date()) { const x = new Date(dt); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return key(x); },
  ulohy() { const d = this.ziskaj(); if (!d) return []; const u = this.ulohaStav(d); return DED_ULOHY.map(x => ({ ...x, postup: Math.min(x.ciel, u.p[x.id] || 0), hotovo: u.h.includes(x.id) })); },
  ulohaStav(d) { const t = this.tyzden(); if (!d.cesta.ul || d.cesta.ul.t !== t) d.cesta.ul = { t, p: {}, h: [], hry: [] }; return d.cesta.ul; },
  ulohaPostup(id, n = 1) {
    const d = this.ziskaj(), x = DED_ULOHY.find(u => u.id === id); if (!d || !x) return false;
    const u = this.ulohaStav(d); if (u.h.includes(id)) return false;
    u.p[id] = (u.p[id] || 0) + n;
    if (u.p[id] >= x.ciel) { u.h.push(id); d.cesta.kroky = Math.min(1e5, d.cesta.kroky + x.kroky); this.uloz(); if (typeof DedCesta !== 'undefined') DedCesta.ulohaHotova(x); return true; }
    this.uloz(); return false;
  },
  // ---------- truhličky ----------
  cakajuTruhly() { const d = this.ziskaj(); return d ? [...d.truhly.cakaju] : []; },
  temaDna() { // téma dňa hotová (raz za deň): každé 3 = drevená truhlička
    const d = this.ziskaj(), dnes = key(new Date()); if (!d || d.truhly.den === dnes) return false;
    d.truhly.den = dnes; d.truhly.temy++; if (d.truhly.temy % 3 === 0) d.truhly.cakaju.push('drevo'); this.ulohaPostup('temy3'); this.uloz(); return true;
  },
  denPribudol() { this.ulohaPostup('strom4'); }, // nový deň učenia = polievanie stromu
  // 3 veci na výber bez náhody: z toho, čo dieťa ešte nemá; z cenového pásma truhličky, ak je málo, z vyššieho a nakoniec z kupovateľných viackrát
  truhlaNabidka(t) {
    const d = this.ziskaj(); if (!d || !DED_TRUHLY[t]) return [];
    if (t === 'vitaj') return ['gulaty', 'kvety', 'lavicka'];
    const volne = DED_VECI.filter(v => !v.nekupne && v.cena > 0 && !(v.sk === 'nabytok' && t === 'drevo') && (v.viac || !this.vlastni(v.id))).sort((a, b) => a.cena - b.cena || (a.id < b.id ? -1 : 1));
    const pasmo = t === 'drevo' ? v => v.cena <= 60 : t === 'zlato' ? v => v.cena >= 150 : () => true;
    let z = volne.filter(pasmo); if (z.length < 3) z = t === 'drevo' ? volne : volne.concat(DED_VECI.filter(v => v.viac)).filter((v, i, a) => a.indexOf(v) === i);
    const jedinecne = z.filter(v => !v.viac).concat(z.filter(v => v.viac)); // nové veci prvé
    const n = jedinecne.length, o = d.truhly.otv, v = [];
    for (let k = 0; v.length < 3 && k < n * 3; k++) { const x = jedinecne[(o * 3 + k * Math.max(1, Math.floor(n / 3))) % n]; if (x && !v.includes(x.id)) v.push(x.id); }
    for (const x of jedinecne) { if (v.length >= 3) break; if (!v.includes(x.id)) v.push(x.id); }
    return v.slice(0, 3);
  },
  truhlaOtvor(t, vyber) { // dieťa vybralo 1 z 3; vec ide do batohu (dar), hviezdy do daru
    const d = this.ziskaj(); if (!d || !d.truhly.cakaju.includes(t)) return { ok: false, chyba: 'nemam' };
    if (!this.truhlaNabidka(t).includes(vyber)) return { ok: false, chyba: 'nie-z-ponuky' };
    d.truhly.cakaju.splice(d.truhly.cakaju.indexOf(t), 1); d.truhly.otv++;
    d.dar += DED_TRUHLY[t].hviezdy; d.batoh[vyber] = (d.batoh[vyber] || 0) + 1; d.dary[vyber] = (d.dary[vyber] || 0) + 1; this.uloz();
    return { ok: true, id: vyber, hviezdy: DED_TRUHLY[t].hviezdy };
  },
  // ---------- hviezdy za hry ----------
  // 1 až 5 podľa výsledku: o.z = z koľko (kvízové hry), o.zaklad = veľkosť úlohy pri hrách, kde menej ťahov je lepšie, inak podľa cieľa hry
  HRY_CIEL: { sova: 15, hviezdy: 25, krtko: 20, opakuj: 8, bubliny: 12, poradie: 10 },
  hviezdyZaHru(id, hodnota, o = {}) {
    if (!(hodnota > 0)) return 0;
    let r;
    if (o.mene) r = Math.max(0, 1 - (hodnota / Math.max(1, o.zaklad || 8) - 1) / 2); // pexeso: tahy / páry = 1 je dokonalé, 3 už slabé
    else if (o.z) r = hodnota / o.z;
    else r = hodnota / (this.HRY_CIEL[id] || 10);
    return Math.min(5, Math.max(1, 1 + Math.round(Math.min(1, r) * 4)));
  },
  // volá sa po dohratí hry: pripíše hviezdy so stropom 20 za deň (cez pripisBody, Precvic platí) a posunie úlohu týždňa
  hraKoniec(id, hodnota, o = {}) {
    const d = this.ziskaj(); if (!d) return 0;
    const dnes = key(new Date()); if (d.hryDen !== dnes) { d.hryDen = dnes; d.hryHv = 0; }
    const u = this.ulohaStav(d); if (!u.hry.includes(id)) { u.hry.push(id); this.ulohaPostup('hry2'); }
    const dalej = Math.min(this.hviezdyZaHru(id, hodnota, o), Math.max(0, DED_HRY_DEN - d.hryHv));
    const dostal = dalej > 0 ? pripisBody(dalej) : 0; // Precvic: 0
    d.hryHv += dostal; this.uloz();
    return dostal;
  },
};
