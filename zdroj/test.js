// Testy logiky appky bez prehliadača (falošná stránka v Node). Spustenie: node zdroj/test.js
// Skontroluje témy, obrázky, prihlasovacie obrazovky, postavičku, odmeny, odznaky, hry, režim do auta a prehľad pre rodiča.
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const R = path.join(__dirname, '..'), html = fs.readFileSync(path.join(__dirname, 'appka.html'), 'utf8');
const skript = html.match(/^<script>\n([\s\S]*?)^<\/script>$/m)[1];
const modul = html.match(/^<script type="module">\n([\s\S]*?)^<\/script>$/m)[1];
const docasny = path.join(os.tmpdir(), 'svet3-modul.mjs');
fs.writeFileSync(docasny, modul); execFileSync(process.execPath, ['--check', docasny], { stdio: 'inherit' }); // modul s Firebase sa len skontroluje
const src = ['temy.js', 'obrazky.js', 'misie.js', 'tyzden.js', 'anglictina.js', 'rodic-brana.js', 'rodic-panel.js'].map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n') + '\n' + skript;
const ctx2d = new Proxy({}, { get: (o, k) => k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}, set: () => true });
const el = () => ({ hidden: false, innerHTML: '', textContent: '', value: '', dataset: { n: '2' }, children: [], style: { setProperty() {} },
  classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, removeAttribute() {}, addEventListener() {}, appendChild() {}, remove() {}, scrollIntoView() {}, insertAdjacentHTML() {}, replaceWith() {},
  querySelector: () => el(), querySelectorAll: () => [], getBoundingClientRect: () => ({ left: 0, top: 0, width: 10, height: 10 }), getContext: () => ctx2d, isConnected: false, offsetWidth: 0 });
const els = {};
global.document = { getElementById: id => (els[id] ||= el()), addEventListener() {}, querySelectorAll: () => [], querySelector: () => el(), createElement: el, body: el() };
global.window = { scrollTo() {} }; global.location = { hostname: 'kudelko22.github.io' };
global.matchMedia = (q) => ({ matches: /reduced-motion/.test(String(q)) }); // bez pohybu: prechody bez časovača
global.addEventListener = () => {};
global.innerWidth = 390; global.innerHeight = 844;
global.requestAnimationFrame = () => {}; global.scrollTo = () => {};
global.localStorage = { d: {}, getItem(k) { return k in this.d ? this.d[k] : null; }, setItem(k, v) { this.d[k] = String(v); }, removeItem(k) { delete this.d[k]; } };
global.PRAVIDLA = fs.readFileSync(path.join(R, 'firestore.rules'), 'utf8'); // zoznam viet a nálepiek musí sedieť s pravidlami
global.Audio = class { play() { setTimeout(() => this.onended && this.onended(), 0); return Promise.resolve(); } pause() {} };
global.ULOZ_VETY = v => fs.writeFileSync(path.join(__dirname, 'vety.json'), JSON.stringify(v, null, 0)); // pre zdroj/hlas.js
global.EMO_SUBORY = new Set(fs.existsSync(path.join(R, 'e')) ? fs.readdirSync(path.join(R, 'e')) : []); // obrázky emoji pre test verzie 23
new Function(src + `
// kvízy majú po dohraní prestávku; testy ju pred každým kvízom zrušia
const odomkni = () => Object.keys(localStorage.d).filter(k => k.includes("kviz-zamok")).forEach(k => localStorage.removeItem(k));
/* BRANY */
for (const fz of ["nacitava", "bezNetu", "prihlasenie"]) { st.faza = fz; render(); }
window.Cloud = { deti: [{ id: "d1", meno: "Emka", vek: "mladsi", avatar: nahodnyAvatar(), body: 10 }, { id: "d2", meno: "Tomi <b>", vek: "starsi", avatar: nahodnyAvatar(), body: 0 }], pouzivatel: { email: "a@b.sk" }, chyba: "", stavUlozenia: "", naplanuj() {}, ulozHned() {}, ulozDieta(u) { this.ulozene = u; }, zmazDieta() {} };
st.faza = "vyber"; render();
st.upravuje = noveUpravovanie(true); st.faza = "tvorba"; render();
for (const [k] of AV_KAT) { tvorbaKlik(document.createElement("button"), { avkat: k }); tvorbaKlik(document.createElement("button"), { avvol: AV[k][1] }); }
tvorbaKlik(document.createElement("button"), { nahodne: "" }); tvorbaKlik(document.createElement("button"), { uvek: "starsi" });
st.upravuje.meno = "Ema"; tvorbaKlik(document.createElement("button"), { ulozitDieta: "" });
if (!window.Cloud.ulozene || window.Cloud.ulozene.vek !== "starsi") throw new Error("tvorba neulozila");
for (const a of [nahodnyAvatar(), nahodnyAvatar(), nahodnyAvatar()]) postavicka(a, true);
st.faza = "appka"; st.dietaId = "d1"; st.avatar = nahodnyAvatar(); st.meno = "Emka";
for (const v of ['domov','objavuj','temy','hry','odznaky','ja','misia','anglictina']) { st.view = v; render(); }
/* MISIA DNA */
{
  const kl = (d) => Misie.klik(document.createElement("button"), d);
  for (const typ of MISIA_PORADIE) for (const u of [1,2,3]) if (!MISIE.some(m => m.t === typ && m.u === u)) throw new Error("misie: chyba " + typ + u);
  if (new Set(MISIE.map(m => m.id)).size !== MISIE.length) throw new Error("misie: id");
  for (const m of MISIE) {
    if (!MISIA_TYPY[m.t] || ![1,2,3].includes(m.u) || !m.fakt || !m.rodic) throw new Error("misie: pole " + m.id);
    if (m.t === 'detektiv' && !(m.ind.length >= 3 && m.o[m.s] && m.vys)) throw new Error("misie: detektiv " + m.id);
    if (m.t === 'coak' && !(m.o[m.s] && m.vys)) throw new Error("misie: coak " + m.id);
    if (m.t === 'pravdy' && !(m.v.length === 3 && m.v.filter(x => !x.ok).length === 1)) throw new Error("misie: pravdy " + m.id);
    if (m.t === 'keby' && !(m.o.length >= 3 && m.o.every(o => o.r))) throw new Error("misie: keby " + m.id);
    if (m.t === 'vyzva' && !(m.ulohy.length && m.vysl.length)) throw new Error("misie: vyzva " + m.id);
  }
  localStorage.d = Object.fromEntries(Object.entries(localStorage.d).filter(([k]) => !k.includes("misie")));
  st.view = "misia"; st.misia = null; st.body = 0; render();
  const pred = st.body;
  kl({ miStart: "" }); render();
  const m = st.misia.m;
  if (m.t === 'detektiv') { kl({ miInd: "" }); kl({ miVol: String((m.s + 1) % m.o.length) }); if (st.misia.chyby !== 1) throw new Error("misie: zle"); }
  if (m.t === 'keby') kl({ miVol: "0" });
  if (m.t === 'coak') kl({ miVol: String((m.s + 1) % m.o.length) });
  if (m.t === 'pravdy') kl({ miVol: String(m.v.findIndex(x => x.ok)) });
  render();
  if (m.t === 'vyzva' || m.t === 'keby') kl({ miHotovo: "" }); else kl({ miVol: String(m.t === 'pravdy' ? m.v.findIndex(x => !x.ok) : m.s) });
  if (!st.misia.koniec) throw new Error("misie: koniec");
  if (st.body <= pred || !Misie.splnenaDnes() || !st.odznaky.includes("misia1")) throw new Error("misie: body/odznak " + st.body);
  render();
  const po = st.body; kl({ miStart: "" }); kl({ miHotovo: "" }); kl({ miVol: "0" });
  if (st.body !== po) throw new Error("misie: body dvakrat");
  for (const mm of MISIE) { st.misia = Misie.nova(mm, true); if (mm.t === 'keby') kl({ miVol: "1" }); render(); st.misia.koniec = { zisk: 0, noveOdznaky: [], noveOdmeny: [], noveHry: [] }; render(); }
  kl({ miSpat: "" }); kl({ miU: "3" }); render(); if (Misie.uroven() !== 3) throw new Error("misie: uroven");
  go("domov"); go("misia"); go("domov");
}
/* TYZDEN: okruh tyzdna a historia dni */
{
  const ok = Tyzden.okruhy(); if (ok[0].id !== 'zmiesany' || ok.length !== SKUPINY.length + 1) throw new Error('tyzden: okruhy');
  localStorage.d = Object.fromEntries(Object.entries(localStorage.d).filter(([k]) => !k.includes('tyzden')));
  if (Tyzden.vybrany() !== 'zmiesany') throw new Error('tyzden: predvolene');
  const v = TV(), dnes = key(new Date()), dni0 = Tyzden.dni();
  if (dni0.length !== 7 || dni0.filter(x => x.jeDnes).length !== 1 || dni0[0].den !== 'Po' || dni0[6].den !== 'Ne') throw new Error('tyzden: dni');
  for (const x of dni0) { if (x.jeBudúci !== (x.datum > dnes)) throw new Error('tyzden: buduci'); if (x.temaId !== v[Tyzden._cislo(x.datum) % v.length].id) throw new Error('tyzden: zmiesany vzorec ' + x.datum); }
  if (temaDna().id !== Tyzden.temaDna(dnes)) throw new Error('tyzden: temaDna');
  Tyzden.nastav('veda');
  if (Tyzden.vybrany() !== 'veda') throw new Error('tyzden: nastav');
  const g = SKUPINY.find(x => x.id === 'veda'), dni1 = Tyzden.dni();
  for (const x of dni1) { const t = byId(x.temaId); if (x.datum >= dnes ? !g.kat.includes(t.k) : x.temaId !== dni0.find(y => y.datum === x.datum).temaId) throw new Error('tyzden: okruh/minulost ' + x.datum); }
  if (Tyzden.dni()[0].temaId !== dni1[0].temaId) throw new Error('tyzden: stabilita');
  if (Tyzden.nastav('nic') !== false) throw new Error('tyzden: neplatny');
  Tyzden.nastav('zmiesany'); if (Tyzden.vybrany() !== 'zmiesany') throw new Error('tyzden: spat');
  const buduci = dni0.find(x => x.jeBudúci); if (buduci && Tyzden.otvor(buduci.datum)) throw new Error('tyzden: buduci otvoreny');
  if (!Tyzden.otvor(dnes) || !st.flow || st.flow.id !== temaDna().id) throw new Error('tyzden: otvor'); st.flow = null;
  /* prehľad týždňa (4.1 C) */
  const m1 = Tyzden.dni(undefined, -1), m0 = Tyzden.dni();
  if (m1.length !== 7 || m1[0].den !== 'Po' || m1[6].den !== 'Ne' || m1.some(x => x.jeBudúci || x.jeDnes)) throw new Error('prehlad: minuly tyzden');
  if (Tyzden._cislo(m0[0].datum) - Tyzden._cislo(m1[0].datum) !== 7) throw new Error('prehlad: posun o 7 dni');
  if (Tyzden.dni(undefined, 5)[0].datum !== m0[0].datum || Tyzden.dni(undefined, 'x')[0].datum !== m0[0].datum) throw new Error('prehlad: kladny posun');
  TyzPrehlad.posun = 0;
  const h0 = TyzPrehlad.html();
  if (h0.split('data-tp-den=').length - 1 !== m0.filter(x => !x.jeBudúci).length) throw new Error('prehlad: pocet tlacidiel dni');
  if (!h0.includes('Tento týždeň') || !h0.includes('Séria po sebe') || !h0.includes('data-tp-okruh')) throw new Error('prehlad: obsah');
  if (!/data-tp-krok="1" disabled/.test(h0)) throw new Error('prehlad: dopredu v tomto tyzdni');
  if (/emoji|pre väčšie/i.test(h0)) throw new Error('prehlad: zakazany text');
  const stav = TyzPrehlad.stav, ref = { hotovo: true, jeBudúci: false, jeDnes: true };
  if (stav(ref) !== 'hotovo' || stav({ ...ref, hotovo: false }) !== 'dnes' || stav({ hotovo: false, jeBudúci: false, jeDnes: false, datum: '2026-01-02' }, '2026-01-01') !== 'zmeskane' || stav({ hotovo: false, jeBudúci: false, jeDnes: false, datum: '2026-01-02' }, '2026-01-03') !== 'pred' || stav({ hotovo: false, jeBudúci: false, jeDnes: false, datum: '2026-01-02' }, null) !== 'pred' || stav({ hotovo: false, jeBudúci: true }) !== 'buduci') throw new Error('prehlad: stav');
  const z = TyzPrehlad.zhrn(m0, TyzPrehlad.najstarsi()); if (z.z > m0.filter(x => !x.jeBudúci).length || z.z < 1 || z.hotovo > z.z) throw new Error('prehlad: sucet');
  // história: bez záznamov nie je predošlý týždeň, so záznamom o minulom týždni áno
  const kedy0 = st.kedy; st.kedy = {};
  if (TyzPrehlad.maPredosly()) throw new Error('prehlad: historia bez zaznamu');
  st.kedy = { [m1[3].temaId]: m1[3].datum }; if (!TyzPrehlad.maPredosly()) throw new Error('prehlad: historia so zaznamom');
  TyzPrehlad.posun = -1; const h1 = TyzPrehlad.html(); if (!h1.includes('Minulý týždeň') || h1.includes('data-tp-okruh') || !/data-tp-krok="1" >|data-tp-krok="1"  *aria/.test(h1.replace(/s+/g, ' '))) throw new Error('prehlad: minuly html');
  if (TyzPrehlad.maPredosly()) throw new Error('prehlad: starsie nez zaznam');
  TyzPrehlad.posun = 0; st.kedy = kedy0;
}
/* PRECVICOVANIE (4.3): zmeskany den sa da zahrat, ale nic neudeli */
{
  const dnes = key(new Date()), iso = Tyzden.dni(undefined, -1)[3].datum, tid = Tyzden.temaDna(iso);
  const doneP = [...st.done], dniP = [...st.dni], kedyP = { ...st.kedy }, bodyP = st.body, hnP = hnStupen(), serP = seria(), odzP = [...st.odznaky];
  st.done = st.done.filter(x => x !== tid); S.set('done', st.done);
  if (!Tyzden.otvor(iso) || !st.flow || !st.flow.precvic || st.flow.id !== tid) throw new Error('precvic: otvor zmeskaneho dna');
  const f = st.flow; render();
  if (!main.innerHTML.includes('Len na precvičenie')) throw new Error('precvic: stitok pred zaciatkom');
  f.kroky.filter(k => k.t === 'q').forEach((k, i) => { f.i = f.kroky.indexOf(k); odpovedz(f, 0); });
  if (Oslava.treba(f)) throw new Error('precvic: oslava');
  dokonci(f); f.i = f.kroky.length - 1; render();
  if (f.zisk !== 0 || !main.innerHTML.includes('Len na precvičenie') || !main.innerHTML.includes('Dobre si si to zopakoval') || main.innerHTML.includes('stars3') || main.innerHTML.includes('odmena-karta')) throw new Error('precvic: zaver');
  if (st.body !== bodyP || st.done.includes(tid) || JSON.stringify(st.dni) !== JSON.stringify(dniP) || JSON.stringify(st.kedy) !== JSON.stringify(kedyP) || st.odznaky.length !== odzP.length) throw new Error('precvic: zmenil stav tema');
  if (hnStupen() !== hnP || seria() !== serP) throw new Error('precvic: strom/seria');
  if (Tyzden.dni(undefined, -1)[3].hotovo) throw new Error('precvic: den nie je zmeskany');
  pripisBody(50); if (st.body !== bodyP) throw new Error('precvic: pripisBody pri precvicovani');
  // auto (do auta) z precvicovacej temy
  st.auto = null; st.flow = { ...f, i: 0, precvic: true }; Auto.start(tid); const a = st.auto; Auto.zrus();
  if (!a || !a.precvic) throw new Error('precvic: auto nededi priznak');
  const va = dokonciAuto(byId(tid)); st.auto = null;
  if (va.zisk || st.body !== bodyP || st.done.includes(tid) || st.dni.length !== dniP.length) throw new Error('precvic: auto zmenil stav');
  st.flow = null;
  // anglictina zo zmeskaneho dna
  const angP = JSON.stringify(Ang.data()); st.ang = Ang.nova(true, 0, '', Tyzden._cislo(iso), true);
  if (!st.ang.precvic) throw new Error('precvic: ang priznak');
  st.view = 'anglictina'; render(); if (!main.innerHTML.includes('Len na precvičenie')) throw new Error('precvic: ang stitok');
  Ang.dokonci(); if (st.body !== bodyP || JSON.stringify(Ang.data()) !== angP || !st.ang.koniec) throw new Error('precvic: ang zmenila stav');
  render(); if (!main.innerHTML.includes('Dobre si si to zopakoval')) throw new Error('precvic: ang zaver');
  st.ang = null; st.view = 'domov';
  // prehlad: tlacidlo precvicovania len pre minuly den bez anglictiny
  TyzPrehlad.posun = -1; const hp = TyzPrehlad.html(); if (!hp.includes('data-tp-ang')) { /* bez zaznamu historie sa dni berú ako Pred zaciatkom */ } TyzPrehlad.posun = 0;
  if (TyzPrehlad.html().includes('data-tp-ang="' + dnes + '"')) throw new Error('precvic: dnes nema byt precvicovanie');
  // dnesny den sa spravuje ako doteraz
  st.done = st.done.filter(x => x !== temaDna().id);
  if (!Tyzden.otvor(dnes) || st.flow.precvic) throw new Error('precvic: dnes je bezny'); st.flow = null;
  // vrat stav
  st.done = doneP; S.set('done', st.done); st.dni = dniP; st.kedy = kedyP; st.body = bodyP;
}
/* ANGLICTINA: samostatny bonus */
{
  if (SKUPINY.some(g => g.kat.includes("anglictina")) || TV().some(x => x.k === "anglictina")) throw new Error("ang: v beznych temach");
  if (!ANGT().length) throw new Error("ang: lekcie");
  const slova = new Set(ANG_SLOVA.map(w => w.en));
  if (slova.size !== ANG_SLOVA.length) throw new Error("ang: duplicitne slovo");
  if (ANG_SLOVA.length < 100 || ANG_VETY.length < 40) throw new Error("ang: malo obsahu");
  for (const w of ANG_SLOVA) if (!ANG_SKUPINY[w.g] || !w.en || !w.sk || !w.cit || ![1,2].includes(w.u)) throw new Error("ang: slovo " + w.en);
  for (const v of ANG_VETY) if (!v.en || !v.sk || !ANG_SKUPINY[v.g] || ![1,2].includes(v.u)) throw new Error("ang: veta " + v.en);
  for (const vek of ["mladsi", "starsi"]) {
    st.vek = vek;
    for (let d = 20000; d < 20060; d++) for (const ex of [0, 1]) {
      const qs = Ang.otazky(d, ex);
      if (qs.length !== 6) throw new Error("ang: pocet otazok");
      for (const q of qs) { if (q.s < 0 || q.o.length !== 3 || new Set(q.o).size !== 3 || !q.vys) throw new Error("ang: otazka " + JSON.stringify(q)); }
    }
  }
  st.vek = "mladsi";
  const A = (d) => Ang.klik(document.createElement("button"), d);
  localStorage.d = Object.fromEntries(Object.entries(localStorage.d).filter(([k]) => !k.includes("ang-")));
  st.view = "anglictina"; st.ang = null; const pred = st.body; render();
  A({ angStart: "" }); render();
  A({ angVol: String((st.ang.qs[0].s + 1) % 3) }); if (st.ang.chyby !== 1) throw new Error("ang: zle");
  for (let i = 0; i < 6; i++) { A({ angVol: String(st.ang.qs[st.ang.i].s) }); render(); A({ angDalej: "" }); render(); }
  if (!st.ang.koniec || st.body <= pred || !Ang.splnenaDnes() || !st.odznaky.includes("ang1")) throw new Error("ang: koniec/body/odznak");
  const po = st.body; A({ angStart: "" }); for (let i = 0; i < 6; i++) { A({ angVol: String(st.ang.qs[st.ang.i].s) }); A({ angDalej: "" }); }
  if (st.body !== po) throw new Error("ang: body dvakrat");
  for (const vek of ["mladsi", "starsi"]) { st.vek = vek; for (const g of Object.keys(ANG_SKUPINY)) for (const ex of [0, 1, 2]) {
    const qs = Ang.otazky(20100, ex, g); if (qs.length !== 6) throw new Error("ang skupina: pocet " + g);
    for (const q of qs) if (q.s < 0 || q.o.length !== 3 || new Set(q.o).size !== 3) throw new Error("ang skupina: otazka " + g);
  } }
  st.vek = "mladsi";
  { const pred2 = st.body; st.view = "anglictina"; A({ angSkup: "zvierata" }); if (!st.ang || st.ang.skup !== "zvierata" || !st.ang.nahliad) throw new Error("ang skupina: start");
    for (let i = 0; i < 6; i++) { A({ angVol: String(st.ang.qs[st.ang.i].s) }); A({ angDalej: "" }); }
    if (st.body !== pred2 || !Ang.data().skup.zvierata) throw new Error("ang skupina: koniec"); st.ang = null; render(); }
  A({ angSpat: "" }); render(); go("domov"); go("anglictina"); go("domov");
}
const chyby = [];
for (const t of T) {
  if (!ART[t.id]) chyby.push('obrazok ' + t.id);
  if (!KAT[t.k]) chyby.push('kategoria ' + t.id);
  for (const r of t.r) if (!byId(r)) chyby.push('suvisi ' + t.id + ' -> ' + r);
  for (const q of t.z) if (q.a.length !== (q.v === 's' || (t.vek || KAT[t.k].vek) === 'starsi' ? q.a.length : 3) || q.a.length < 3 || q.a.length > 4) chyby.push('odpovede ' + t.id); // ťažké otázky môžu mať 4 odpovede
  if (t.z.filter(q => q.v !== 's').length < 3) chyby.push('malo otazok pre mladsich ' + t.id);
}
if (new Set(T.map(t => t.id)).size !== T.length) chyby.push('duplicitne id');
// Obsah 4.6: každá téma má vyplnené polia a vlastný vyfarbený obrázok (nie prázdny, nie len obrysy)
for (const t of T) {
  for (const f of ['t', 'm', 's', 'p']) if (f === 't' || f === 'm' || T.indexOf(t) >= 151) if (typeof t[f] !== 'string' || t[f].length < (f === 't' ? 6 : 20)) chyby.push('prazdne pole ' + f + ' ' + t.id);
  if (!Array.isArray(t.o) || t.o.length !== 3 || t.o.some(x => !x || x.length < 8)) chyby.push('rozhovor ' + t.id);
  if (!/^[a-z0-9-]+$/.test(t.id)) chyby.push('zle id ' + t.id);
  if (/pre väčšie deti/i.test(t.m + t.s)) chyby.push('pre vacsie deti ' + t.id);
  for (const q of t.z) if (!q.q || !q.w || new Set(q.a.map(a => a[1])).size !== q.a.length) chyby.push('otazka ' + t.id);
  const sv = svg(t), vyfarbene = (sv.match(/fill="#[0-9A-Fa-f]{3,6}"/g) || []).length;
  if (vyfarbene < 6 || /undefined|NaN|object Object/.test(sv) || sv.length < 900) chyby.push('prazdny obrazok ' + t.id);
}
if (T.length < 211) chyby.push('malo tem ' + T.length);
for (const vek of ['mladsi','starsi']) {
  st.vek = vek;
  for (const t of T) {
    startTema(t.id);
    while (true) {
      const k = st.flow.kroky[st.flow.i];
      textKroku(st.flow);
      if (k.t === 'q') { st.flow.odp[st.flow.i] = { v: 1, ok: false, p: 'x' }; renderFlow(false); }
      if (k.t === 'koniec') break;
      if (st.flow.kroky[st.flow.i + 1].t === 'koniec') dokonci(st.flow);
      st.flow.i++; renderFlow();
    }
  }
  startKviz(); st.flow.i = st.flow.kroky.length - 1; renderFlow();
}
/* ODMENY_TEST */
if (najdlhsiaSeria(["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-24", "2026-10-25"]) !== 3) chyby.push("seria");
Object.assign(st, { dietaId: "d1", vek: "mladsi", body: 20, done: [], fav: [], dni: [], odznaky: [], avatar: nahodnyAvatar(0), flow: null, faza: "appka" });
startTema(temaDna().id); { const fl = st.flow; /* téma dňa: plné body, iná téma najviac 10 */ fl.kroky.forEach((k, i) => { if (k.t === "q") fl.odp[i] = { v: 0, ok: true, p: "x" }; }); fl.i = fl.kroky.length - 2; dokonci(fl); fl.i++; renderFlow();
  const ids = fl.noveOdznaky.map(o => o.id); if (!ids.includes("prva") || !ids.includes("bezchyby")) chyby.push("odznaky po teme: " + ids);
  if (!fl.noveOdmeny.some(o => o.kluc === "zvieratko:macka")) chyby.push("odmena macka: " + st.body); }
startKviz(); { const fl = st.flow; fl.kroky.forEach((k, i) => { if (k.t === "q") fl.odp[i] = { v: 0, ok: true, p: "x" }; }); fl.i = fl.kroky.length - 2; dokonci(fl); fl.i++; renderFlow();
  if (!st.odznaky.includes("blesk")) chyby.push("blesk"); }
st.fav = ["dazd", "srdce", "hory"]; if (!noveOdznaky().some(o => o.id === "zberatel")) chyby.push("zberatel");
st.done = T.filter(t => t.k === "veda").map(t => t.id); if (!noveOdznaky().some(o => o.id === "kat-veda")) chyby.push("kat-veda");
st.view = "ja"; render(); st.view = "domov"; render();
st.upravuje = { id: "d1", meno: "Emka", vek: "mladsi", avatar: { ...AV_ZAKLAD, ...nahodnyAvatar(0), doplnok: "ziadny" }, body: 60, kat: "doplnok", novy: false };
st.faza = "tvorba"; render(); tvorbaKlik(document.createElement("button"), { avvol: "korunka" });
if (st.upravuje.avatar.doplnok !== "ziadny") chyby.push("zamok korunky nefunguje");
st.upravuje.kat = "zvieratko"; tvorbaKlik(document.createElement("button"), { avvol: "macka" });
if (st.upravuje.avatar.zvieratko !== "macka") chyby.push("macka pri 60 bodoch sa neda");
for (let i = 0; i < 50; i++) { const a = nahodnyAvatar(0); for (const [k, v] of Object.entries(a)) if (cenaDielu(k, v) > 0) chyby.push("nahodny zamknuty " + k + v); }
st.faza = "appka";
/* AV_VSETKY */
for (const [k, v] of Object.entries(AV)) for (const x of v) postavicka({ ...nahodnyAvatar(0), [k]: x }, true);
for (const o of ODMENY) { if (!NAZVY_ODMIEN[o.kluc]) chyby.push("nazov " + o.kluc); if (!(AV[o.k] || []).includes(o.v)) chyby.push("diel " + o.kluc); }
if (Math.max(...ODMENY.map(o => o.cena)) !== 5000) chyby.push("max 5000");
/* HRY_TEST */
Object.assign(st, { dietaId: "d1", vek: "mladsi", body: 10, done: [], fav: [], dni: [], odznaky: [], avatar: nahodnyAvatar(0), flow: null, auto: null, faza: "appka", view: "hry" });
render(); Hra.start("pexeso"); if (st.hra) chyby.push("zamknuta hra sa spustila");
st.body = 1000;
for (const id of ["pexeso", "hadaj", "hviezdy", "opakuj", "bubliny", "skladacka"]) { Hra.start(id); if (!st.hra || st.hra.id !== id) chyby.push("hra " + id); render(); }
Hra.start("pexeso"); { const h = st.hra; if (h.karty.length !== 12 || new Set(h.karty).size !== 6) chyby.push("pexeso karty"); }
Hra.start("skladacka"); { const h = st.hra;
  for (let i = 0; i < h.p.length; i++) if (h.p[i] !== i) { const j = h.p.indexOf(i); Hra.diel(i); Hra.diel(j); }
  if (!h.hotovo || h.hotovo.hodnota !== h.tahy) chyby.push("skladacka sa neposkladala");
  if (S.get(rekordKluc("skladacka"), null) !== h.tahy) chyby.push("rekord skladacky"); }
if (!st.odznaky.includes("skladacka") || !st.odznaky.includes("hra1")) chyby.push("odznaky za hru " + st.odznaky);
if (new Set(ODZNAKY.map(o => o.id)).size !== ODZNAKY.length || ODZNAKY.length > 100) chyby.push("odznaky id");
/* HRY_PRE_MALE */ { const v = st.vek; st.vek = "mladsi"; if (HRY_VID().some(x => x.id === "bubliny") || !HRY_VID().some(x => x.id === "pocitaj")) chyby.push("hry malych"); st.vek = "starsi"; if (!HRY_VID().some(x => x.id === "bubliny") || HRY_VID().some(x => x.id === "pocitaj")) chyby.push("hry starsich"); st.vek = "mladsi";
  st.body = 1000; Hra.start("pocitaj"); const h = st.hra; if (!h || h.kola.length !== 5 || h.moznosti.length !== 3 || !h.moznosti.includes(h.kola[0])) chyby.push("pocitaj start");
  const zla = h.moznosti.find(x => x !== h.kola[0]); Hra.pocitaj(zla); if (!h.chyba || h.spravne !== 0) chyby.push("pocitaj chyba"); Hra.pocitaj(h.kola[0]); if (h.spravne !== 0 || h.odp !== h.kola[0]) chyby.push("pocitaj po chybe"); render(); Hra.zrus(); st.vek = v; }
/* NOVE_HRY_41 */ for (const vek of ["mladsi", "starsi"]) { st.vek = vek; st.body = 2000;
  const ids = HRY_VID().map(x => x.id).filter(x => KV_HRY[x]);
  if (vek === "mladsi" ? ids.join() !== "iny,tien,poradie,ine" : ids.join() !== "poradie,ine,slovo") chyby.push("nove hry podla veku " + vek + " " + ids);
  for (const id of ids) { Hra.start(id); const h = st.hra; if (!h || !h.kv || h.kola.length !== KV_KOL) { chyby.push("kv start " + id); continue; } render();
    for (const k of h.kola) { if (!k.sprav.length || !k.moz.length || new Set(k.moz.map(m => m.z)).size < (id === "slovo" ? 1 : k.moz.length)) chyby.push("kv kolo " + id);
      if (!k.sprav.every(z => k.moz.some(m => m.z === z))) chyby.push("kv sprav " + id);
      if (id === "poradie") { const c = k.moz.map(m => +m.z), up = k.sprav[0] < k.sprav[1]; if (k.sprav.some((x, i) => i && (up ? x < k.sprav[i - 1] : x > k.sprav[i - 1]))) chyby.push("poradie usporiadanie"); }
      if (id === "slovo" && (k.sprav.join("") === k.moz.map(m => m.z).join("") )) chyby.push("slovo premiesane"); }
    const k0 = h.kola[0], zle = k0.sloty ? k0.moz.findIndex(m => m.z !== k0.sprav[0]) : k0.moz.findIndex(m => m.z !== k0.sprav[0]);
    if (zle >= 0) { Hra.kv(zle); if (!h.chyba) chyby.push("kv chyba " + id); }
    for (const z of k0.sprav) Hra.kv(k0.moz.findIndex((m, j) => m.z === z && !h.vzate.includes(j)));
    if (!h.odp || h.spravne !== 0) chyby.push("kv po chybe " + id);
    for (let i = 1; i < h.kola.length; i++) { clearTimeout(h.dalsia); h.i = i; h.odp = false; h.krok = 0; h.vzate = []; h.zle = []; h.chyba = false; const k = h.kola[i];
      for (const z of k.sprav) Hra.kv(k.moz.findIndex((m, j) => m.z === z && !h.vzate.includes(j))); }
    clearTimeout(h.dalsia);
    if (h.spravne !== KV_KOL - 1) chyby.push("kv spravne " + id + " " + h.spravne);
    Hra.zrus(); } }
/* KRTKO_42 */ for (const vek of ["mladsi", "starsi"]) { st.vek = vek; st.body = 2000; Hra.start("krtko"); const h = st.hra;
  if (!h || h.id !== "krtko" || h.beh || HRY.find(x => x.id === "krtko").cena !== 500) { chyby.push("krtko start " + vek); continue; } render();
  if ((main.innerHTML.match(/data-krt=/g) || []).length !== 9 || !main.innerHTML.includes("data-hv-start") || !main.innerHTML.includes("krt-z")) chyby.push("krtko pole " + vek);
  Hra.krtkoStart(); if (!h.beh) chyby.push("krtko beh");
  h.hore[3] = { zlaty: false, to: null }; h.hore[5] = { zlaty: true, to: null }; const b = document.createElement("button");
  Hra.krt(3, b); if (h.skore !== 1 || h.hore[3]) chyby.push("krtko tuk " + h.skore);
  Hra.krt(5, b); if (h.skore !== 4 || h.hore[5]) chyby.push("krtko zlaty " + h.skore);
  Hra.krt(3, b); if (h.skore !== 4) chyby.push("krtko prazdna diera");
  if (rekordText("krtko", 1) !== "1 krtko" || rekordText("krtko", 3) !== "3 krtky" || rekordText("krtko", 7) !== "7 krtkov") chyby.push("krtko rekordText");
  if (!OBR_HRY.krtko || OBR_HRY.rad || KV_HRY.rad || HRY.some(x => x.id === "rad")) chyby.push("krtko obrazok alebo stara hra rad");
  Hra.zrus(); }
st.vek = "mladsi";
{ /* KONIEC_TEMY_42: obrazovka po teme je kratka, misia a jedno tlacidlo */
  Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, view: "domov" }); startTema(temaDna().id); const fl = st.flow;
  fl.kroky.forEach((k, i) => { if (k.t === "q") fl.odp[i] = { v: 0, ok: true, p: "x" }; }); fl.i = fl.kroky.length - 2; dokonci(fl); fl.i++; renderFlow();
  const w = main.innerHTML, nb = (w.match(/<button/g) || []).length;
  if (!w.includes("win-krat") || !w.includes("data-mi-start") || !w.includes("data-zavriet") || w.includes("data-nahodna") !== Misie.splnenaDnes() || nb > 9) chyby.push("koniec temy " + nb);
  st.flow = null; st.view = "domov"; render(); }
Hra.start("hadaj"); { const h = st.hra; if (h.moznosti.length !== 3 || !h.moznosti.includes(h.kola[0]) || h.kola.length !== 8) chyby.push("hadaj moznosti"); Hra.hadaj(h.kola[0]); if (h.spravne !== 1) chyby.push("hadaj spravne"); }
for (const mal of [true, false]) for (let i = 0; i < 400; i++) { const [t, v] = priklad(mal), x = eval(t.replace("−", "-").replace("×", "*")); if (x !== v || v < 0 || (mal && v > 10)) chyby.push("priklad " + t + " = " + v); }
Hra.start("bubliny"); Hra.bublinyStart(); { const h = st.hra; if (!h.beh || !h.moznosti.includes(h.vysl) || new Set(h.moznosti).size !== h.moznosti.length) chyby.push("bubliny"); }
st.kedy = { ruky: key(new Date()) }; st.chyby = []; zapisChybu({ tid: "ruky", q: byId("ruky").z[1] }, false);
if (st.chyby[0] !== "ruky:1" || !prehladRodica().includes("Kedy si umývame ruky")) chyby.push("prehlad rodica");
zapisChybu({ tid: "ruky", q: byId("ruky").z[1] }, true); if (st.chyby.length) chyby.push("chyba sa nezmazala");
Hra.start("opakuj"); { const h = st.hra; h.seq = [2]; h.faza = "hra"; h.krok = 0; Hra.pad(2); if (h.faza !== "cakaj") chyby.push("opakuj dobre"); h.seq = [1, 3]; h.faza = "hra"; h.krok = 0; Hra.pad(0); if (h.faza !== "koniec") chyby.push("opakuj zle"); }
Hra.start("hviezdy"); Hra.zrus(); if (st.hra) chyby.push("hra zrus");
/* INE_45 */ { const vekPred = st.vek, bodyPred = st.body;
  const kluc = x => [...x.t].sort().join() + "|" + x.j, videne = new Set();
  if (INE_SADY.length < 40) chyby.push("ine: malo sad " + INE_SADY.length);
  for (const v of ["m", "s"]) if (INE_SADY.filter(x => x.v === v).length < 20) chyby.push("ine: malo sad pre " + v);
  for (const x of INE_SADY) { const vsetky = [...x.t, x.j];
    if (x.t.length !== 3 || new Set(vsetky).size !== 4) chyby.push("ine: sada nema 4 rozne " + kluc(x));
    if (x.t.includes(x.j) || !x.x || !["m", "s"].includes(x.v)) chyby.push("ine: sada " + kluc(x));
    for (const n of vsetky) { const sv = INE_OBR[n] && INE_OBR[n](); if (!sv || !/fill=.#/.test(sv) || /undefined|NaN/.test(sv)) chyby.push("ine: obrazok " + n); }
    if (videne.has(kluc(x))) chyby.push("ine: duplicitna sada " + kluc(x)); videne.add(kluc(x)); }
  for (const vek of ["mladsi", "starsi"]) { st.vek = vek; st.body = 2000; localStorage.d = {};
    const mal = vek === "mladsi", pouzite = new Set(); let bezOpakovania = true;
    for (let hra = 0; hra < 3; hra++) { Hra.start("ine"); const h = st.hra; if (!h || !h.kv || h.id !== "ine" || h.kola.length !== KV_KOL) { chyby.push("ine start " + vek); break; } render();
      const html = main.innerHTML; if ((html.match(/data-kv=/g) || []).length < 4) chyby.push("ine: 4 volby " + vek);
      for (const k of h.kola) { if (k.moz.length !== 4 || new Set(k.moz.map(m => m.z)).size !== 4 || k.sprav.length !== 1 || !k.x) chyby.push("ine kolo " + vek);
        const sada = INE_SADY.find(x => x.j === k.sprav[0] && x.x === k.x && x.v === (mal ? "m" : "s")); if (!sada) { chyby.push("ine: sada pre vek " + vek); continue; }
        if (hra === 0) { if (pouzite.has(sada)) bezOpakovania = false; pouzite.add(sada); } }
      const k0 = h.kola[0], dobre = k0.moz.findIndex(m => m.z === k0.sprav[0]), zle = (dobre + 1) % 4;
      Hra.kv(zle); if (!h.chyba || h.spravne !== 0 || h.odp) chyby.push("ine zla odpoved " + vek);
      Hra.kv(dobre); if (!h.odp || h.spravne !== 0) chyby.push("ine po chybe " + vek); render(); if (!main.innerHTML.includes(k0.x.slice(0, 12))) chyby.push("ine: vysvetlenie");
      Hra.zrus(); }
    if (!bezOpakovania) chyby.push("ine opakovanie v hre " + vek); }
  Hra.start("ine"); { const h = st.hra, k = h.kola[0]; Hra.kv(k.moz.findIndex(m => m.z === k.sprav[0])); if (h.spravne !== 1) chyby.push("ine spravne"); Hra.zrus(); }
  if (HRY.find(x => x.id === "ine").len) chyby.push("ine: ma byt pre oba vekove skupiny");
  st.vek = vekPred; st.body = bodyPred;
}
if (noveHry(100, 420).map(x => x.id).join() !== "pexeso,pocitaj,iny,hadaj,tien,sova,hviezdy") chyby.push("nove hry");
if (!odmenyHtml({ noveHry: noveHry(140, 160) }).includes("Pexeso")) chyby.push("odmena hra");
st.view = "ja"; render(); st.view = "domov"; render();
/* TAZKE_TEST */
for (const t of T.filter(t => !(t.vek || KAT[t.k].vek))) if (t.z.filter(q => q.v === 's').length < 2) chyby.push("tazke otazky " + t.id);
st.vek = "starsi"; odomkni(); startKviz("tazky"); if (!st.flow.tazky || st.flow.kroky.filter(k => k.t === "q").some(k => k.q.v !== "s") || st.flow.kroky.length !== 9) chyby.push("tazky kviz");
st.flow = null; st.vek = "mladsi"; odomkni(); startKviz(); if (st.flow.kroky.some(k => k.q && k.q.v === "s")) chyby.push("rychly kviz mladsi"); st.flow = null;
/* TAZSIE_TEST */
for (const t of T.filter(t => (t.vek || KAT[t.k].vek) !== "mladsi")) t.z.forEach((x, i) => { if (x.h && (x.h.length !== 3 || x.h.includes(x.a[0][1]) || new Set(x.h).size !== 3)) chyby.push("tazsie " + t.id + " " + i); if (!x.h && x.a.length < 4) chyby.push("chyba tazsia odpoved " + t.id + " " + i); });
st.vek = "starsi"; startTema("ruky"); if (st.flow.kroky.filter(k => k.t === "q").some(k => k.q.a.length !== 4)) chyby.push("starsi maju 4 odpovede"); renderFlow();
st.flow.i = st.flow.kroky.findIndex(k => k.t === "q"); renderFlow(); st.chyby = []; zapisChybu(st.flow.kroky[st.flow.i], false); if (st.chyby[0] !== "ruky:0") chyby.push("chyba starsi " + st.chyby);
st.flow = null; st.chyby = []; st.vek = "mladsi"; startTema("ruky"); if (st.flow.kroky.filter(k => k.t === "q").some(k => k.q.a.length !== 3)) chyby.push("mladsi maju 3 odpovede"); st.flow = null;
/* VEK_TEST */
st.vek = "mladsi"; if (TV().some(t => (t.vek || KAT[t.k].vek) === "starsi") || kats().some(k => k.vek === "starsi")) chyby.push("mladsi vidi temy starsich");
st.vek = "starsi"; if (TV().some(t => (t.vek || KAT[t.k].vek) === "mladsi")) chyby.push("starsi vidi temy mladsich");
odomkni(); startKviz("vyzva"); if (!st.flow.vyzva || st.flow.kroky.length !== 11 || st.flow.kroky.some(k => k.q && k.q.a.length !== 4)) chyby.push("vyzva"); zapisChybu(st.flow.kroky[0], false); st.flow = null;
for (const x of VYZVA) if (!byId(x.tid)) chyby.push("vyzva tema " + x.tid);
for (const v of ["mladsi", "starsi"]) { st.vek = v; for (const w of ["domov", "temy", "hry", "odznaky", "ja"]) { st.view = w; render(); } }
/* DENNY_LIMIT_TEST */
st.vek = "starsi"; st.dietaId = "limit"; for (const i of [0, 1]) { odomkni(); startKviz("vyzva"); const fl = st.flow; fl.kroky.forEach((k, j) => { if (k.t === "q") fl.odp[j] = { v: 0, ok: true, p: "x" }; }); fl.i = fl.kroky.length - 2; dokonci(fl);
  if (i === 0 && fl.zisk !== 200) chyby.push("vyzva body " + fl.zisk); if (i === 1 && (fl.zisk !== 0 || !fl.dnesUz)) chyby.push("vyzva druhykrat " + fl.zisk); fl.i++; renderFlow(); st.flow = null; }
st.dietaId = "d1";
/* VYBER_TEST */
Object.assign(st, { dietaId: "d1", vek: "mladsi", body: 10, odznaky: ["prva"], vybrate: [] }); vyberOdznak("prva", document.createElement("button"));
if (st.body !== 12 || !st.vybrate.includes("prva")) chyby.push("vyber odznaku " + st.body); vyberOdznak("prva", document.createElement("button")); if (st.body !== 12) chyby.push("vyber dvakrat");
st.view = "odznaky"; render(); st.view = "ja"; render();
st.done = ["ruky"]; st.kedy = {}; for (const ocak of [4, 0]) { startTema("ruky"); const fl = st.flow; fl.kroky.forEach((k, j) => { if (k.t === "q") fl.odp[j] = { v: 0, ok: true, p: "x" }; }); fl.i = fl.kroky.length - 2; dokonci(fl); if (fl.zisk !== ocak) chyby.push("opakovanie body " + fl.zisk + " cakal " + ocak); fl.i++; renderFlow(); st.flow = null; }
/* V22_TEST */
for (const o of ODZNAKY) { const v = ikOdznaku(o); if (!v || !v.startsWith('<svg')) chyby.push("ikona odznaku " + o.id); }
for (const k of Object.keys(KAT)) if (!IK_KAT[k]) chyby.push("ikona kategorie " + k);
const zalohaV22 = { body: st.body, odznaky: [...st.odznaky], vek: st.vek }; st.vek = "mladsi"; st.dietaId = "d1"; st.body = 9999; Hra.start("sova"); render();
{ const h = st.hra; if (!h || h.id !== "sova" || h.zivoty !== 3) chyby.push("sova start");
  Object.assign(h, sovaSvet(360, 480, true), { beh: true }); let konec = false;
  for (let i = 0; i < 2000 && !konec; i++) { const u = sovaKrok(h, 1 / 60); if (u.includes("koniec")) konec = true; }
  if (!konec || h.zivoty !== 0) chyby.push("sova bez mavania nepadla " + h.zivoty);
  Object.assign(h, sovaSvet(360, 480, true), { beh: true, zivoty: 3, skore: 0 });
  for (let i = 0; i < 600; i++) { if (h.y > 240) h.vy = h.skok; sovaKrok(h, 1 / 60); }
  if (!h.prekazky.length) chyby.push("sova bez ceruziek"); Hra.sovaKresli(h); Hra.koniec(false, 31);
  if (!st.odznaky.includes("sova30") || !st.odznaky.includes("sova10")) chyby.push("odznaky sova"); Hra.zrus(); }
/* PRIPOMIENKA_44: pas stromu a pripomienky na Domove */
{ const dp = st.dni, pv = st.flow; const dnes = key(new Date()), vcera = new Date(); vcera.setDate(vcera.getDate() - 1);
  S.set(Pripomienka.kluc(), "");
  st.dni = [key(vcera)]; if (!/séria 1 deň padne/.test(Pripomienka.text())) chyby.push("pripomienka seria: " + Pripomienka.text());
  st.dni = [key(vcera), dnes]; if (Pripomienka.text()) chyby.push("pripomienka ked je dnes hotovo");
  st.dni = [key(vcera)]; Pripomienka.zavri({}); if (Pripomienka.text()) chyby.push("pripomienka po zavreti");
  S.set(Pripomienka.kluc(), ""); st.dni = []; if (Pripomienka.text()) chyby.push("pripomienka bez historie");
  const html = (st.dni = [key(vcera)], Pripomienka.html()); if (!/data-strom/.test(html) || !/data-prip-zavri/.test(html) || /[\u{1F300}-\u{1FAFF}]/u.test(html)) chyby.push("pas stromu html");
  st.dni = dp; S.set(Pripomienka.kluc(), ""); }
/* STROM_44: animacia stromu len ako zaver dnesnej temy dna, raz za den, nikdy pri kvize, inej teme ani precvicovani */
{ const f = { typ: "tema", id: temaDna().id, odp: { 3: { ok: true } } }, dniPred = st.dni; st.dni = []; S.set(Oslava.kluc(), "");
  if (!Oslava.treba(f)) chyby.push("oslava tema dna");
  if (Oslava.treba({ typ: "kviz", odp: { 0: { ok: true } } })) chyby.push("oslava pri kvize");
  if (Oslava.treba({ typ: "tema", id: "__ina__", odp: { 3: { ok: true } } })) chyby.push("oslava pri inej teme");
  if (Oslava.treba({ ...f, precvic: true })) chyby.push("oslava pri precvicovani");
  if (Oslava.treba({ ...f, odp: { 3: { ok: false } } })) chyby.push("oslava bez spravnej odpovede");
  st.dni = [key(new Date())]; if (!Oslava.treba(f)) chyby.push("oslava po kvize uz dnes: tema dna ju ma dostat");
  Oslava.ukaz(() => {});
  if (Oslava.treba(f)) chyby.push("oslava druhykrat"); S.set(Oslava.kluc(), ""); st.dni = dniPred; }
/* SERIA_46: plán čísla série (stará a nová hodnota), raz za deň, precvičovanie bez oslavy */
{ const a = planSerie(5, 9); if (a.od !== 4 || a.do !== 5 || a.pokojne || !a.zmena) chyby.push("plan serie 4 na 5");
  const b = planSerie(1, 9); if (!b.pokojne || b.od !== 1 || b.do !== 1 || b.zmena) chyby.push("plan serie po prerusení: pokojne");
  const c = planSerie(1, 1); if (c.pokojne || c.od !== 0 || c.do !== 1) chyby.push("plan serie prvy den");
  const f = { typ: "tema", id: temaDna().id, odp: { 3: { ok: true } } }, dniPred = st.dni; st.dni = []; S.set(Oslava.kluc(), "");
  if (Oslava.treba({ ...f, precvic: true })) chyby.push("seria: oslava pri precvicovani");
  Oslava.ukaz(() => {}); if (Oslava.treba(f)) chyby.push("seria: oslava druhykrat v den");
  S.set(Oslava.kluc(), ""); st.dni = dniPred; }
Object.assign(st, { body: zalohaV22.body, odznaky: zalohaV22.odznaky, vek: zalohaV22.vek });
/* V23_TEST */
{ const RE = new RegExp(EMO_ODP.source, 'gu'), chybaSubor = new Set();
  for (const q of [...T.flatMap(t => t.z), ...VYZVA]) for (const a of q.a) for (const e of String(a[0]).match(RE) || []) if (!EMO_SUBORY.has(emoSubor(e).slice(2))) chybaSubor.add(e);
  for (const t of T) { const o = svg(t); for (const e of o.replace(/aria-label="[^"]*"/, '').match(RE) || []) chybaSubor.add(t.id + ' text ' + e);
    for (const m of o.matchAll(/href="(e\\/[^"]+)"/g)) if (!EMO_SUBORY.has(m[1].slice(2))) chybaSubor.add(t.id + ' ' + m[1]); }
  if (chybaSubor.size) chyby.push("emoji bez obrazka: " + [...chybaSubor].slice(0, 8).join(" "));
  if (emo("🦁") !== '<img class="emo" src="e/1f981.svg" alt="🦁" draggable="false" onerror="this.replaceWith(this.alt)">') chyby.push("emo " + emo("🦁"));
  if (!emo("1️⃣").includes("e/31-20e3.svg") || emo("a<b") !== "a&lt;b") chyby.push("emo klavesa"); }
/* V24_TEST */
{ const stare = T.filter(t => String(ART[t.id]).includes("ez(")); if (stare.length) chyby.push("temy len z emoji: " + stare.map(t => t.id).join(" "));
  Novinky.ukaz(NOVINKY); localStorage.removeItem("svet3:videl-verziu"); Novinky.bolo = false; st.faza = "appka"; st.flow = null; st.hra = null; Novinky.skontroluj();
  if (!Novinky.caka && S.get("videl-verziu", 0) !== VERZIA_APPKY) chyby.push("novinky verzia"); Novinky.caka = false; }
/* V25_TEST */
{ const vety = new Set(), pridaj = c => (Array.isArray(c) ? c : [c]).forEach(x => { const n = normVeta(x); if (n) vety.add(n); });
  const zaloha = { vek: st.vek, flow: st.flow };
  for (const vek of ["mladsi", "starsi"]) { st.vek = vek;
    for (const t of T) { startTema(t.id); const f = st.flow; f.kroky.forEach((k, i) => { f.i = i; pridaj(textKroku(f)); }); st.flow = null;
      autoPlan(t).kroky.forEach(k => { if (k.typ === "veta") pridaj(k.text); }); }
    for (const druh of ["", "tazky", "vyzva"]) { if (druh && vek !== "starsi") continue; odomkni(); startKviz(druh); const f = st.flow; f.kroky.forEach((k, i) => { f.i = i; pridaj(textKroku(f)); }); st.flow = null; } }
  // otázky a odpovede v inom poradí: každá možnosť zvlášť
  for (const q of [...T.flatMap(t => t.z), ...VYZVA]) { q.a.forEach(a => pridaj(a[1])); (q.h || []).forEach(pridaj); vetyZ(q.q).forEach(pridaj); }
  ["alebo", "Výborne! Téma je prebratá.", "O chvíľu pokračujeme ďalšou témou.", "Ahoj!", "Takto ti budem čítať témy o svete.", ...[...Array(10).keys()].map(i => "Otázka " + (i + 1) + ".")].forEach(pridaj);
  Object.assign(st, zaloha); ULOZ_VETY([...vety].sort());
  if (spojVety(["Čo dáva krava?", "Mlieko", "Vajíčka", "alebo", "Vlnu"]) !== "Čo dáva krava? Mlieko, Vajíčka alebo Vlnu?") chyby.push("spojVety " + spojVety(["Čo dáva krava?", "Mlieko", "Vajíčka", "alebo", "Vlnu"]));
  Nahravky.zoznam = new Set(["Ahoj!", "Takto ti budem čítať témy o svete."].map(klucVety)); Hlas.citaj(["Ahoj!", "Takto ti budem čítať témy o svete."]);
  if (!Nahravky.hra || !Hlas.hovori) chyby.push("hlas nahravky"); Hlas.stop(); if (Nahravky.hra) chyby.push("hlas stop"); Nahravky.zoznam = null; }
/* V25B_TEST */
{ const RE = new RegExp(EMO_RE.source, "u"), zle = T.filter(t => String(ART[t.id]).includes("P.") && RE.test(ART[t.id]())); if (zle.length) chyby.push("nove obrazky s emoji: " + zle.map(t => t.id).join(" ")); }
/* V26_TEST */
{ for (const id of Object.keys(KAT)) { const n = SKUPINY.filter(g => g.kat.includes(id)).length; if (n !== 1 && id !== "anglictina") chyby.push("kategoria " + id + " v oblastiach " + n + "x"); }
  for (const id of SKUPINY.flatMap(g => g.kat)) if (!KAT[id]) chyby.push("oblast ma neznamu kategoriu " + id);
  for (const vek of ["mladsi", "starsi"]) { st.vek = vek; for (const sk of ["", ...SKUPINY.map(g => g.id)]) { st.skupina = sk; st.kat = ""; st.q = ""; fillTemy(); } }
  st.kat = "fav"; fillTemy(); st.kat = ""; st.q = "srdce"; fillTemy(); st.q = ""; st.skupina = ""; st.view = "domov"; render(); }
/* V27_TEST */
{ for (const k of [...Object.keys(VETY), ...Object.keys(NALEPKY)]) if (!PRAVIDLA.includes("'" + k + "'")) chyby.push("v pravidlach chyba " + k);
  for (const k of Object.keys(NALEPKY)) if (!String(NALEPKY[k]()).startsWith("<svg")) chyby.push("nalepka " + k);
  const zal = { dietaId: st.dietaId, view: st.view, priatel: st.priatel }; st.dietaId = "d1";
  window.Cloud = { soc: { pid: "d1", nacitane: true, zapnute: false, profil: null, ziadosti: [], priatelia: {}, profily: {}, spravy: {} } };
  st.view = "priatelia"; render();
  const So = window.Cloud.soc, tk = tyzKluc();
  Object.assign(So, { zapnute: true, profil: { kod: "SOVA-K7M2", body: 10, tyzKey: tk, tyzStart: 5 }, ziadosti: [{ id: "f2", meno: "Tomáš", avatar: {} }], priatelia: { f1: true },
    profily: { f1: { meno: "Ema", avatar: {}, seria: 3, body: 120, tyzKey: tk, tyzStart: 100, temy: 5, odznaky: 4, posledne: ["prva"] } },
    spravy: { f1: [{ id: "m1", od: "f1", n: "sova", kedy: Date.now() + 5, r: "srdce" }, { id: "m3", od: "f1", t: "ruky", h: 2, kedy: Date.now() + 6 }, { id: "m2", od: "d1", k: "ahoj", kedy: Date.now() + 7 }] }, citane: { f1: Date.now() + 9 } });
  if (!chatHtml("f1").includes("Skúsiť tiež") || !chatHtml("f1").includes("msg-r") || !chatHtml("f1").includes("Videné")) chyby.push("chat 2.2");
  st.socTemy = true; st.done = ["ruky"]; st.priatel = "f1"; st.view = "priatel"; render(); st.socTemy = false; socNovaSprava("f1");
  localStorage.removeItem("svet3:soc-videl-d1-f1"); render(); if (socNove() !== 3) chyby.push("soc nove " + socNove());
  if (!rebricekHtml().includes("Ema") || tyzBody(So.profily.f1) !== 20 || tyzBody({ body: 50, tyzKey: "2000-01-03", tyzStart: 1 }) !== 0) chyby.push("rebricek");
  st.priatel = "f1"; st.view = "priatel"; render(); socZmena(); if (!chatHtml("f1").includes("msg moja") || !chatHtml("f1").includes("Ahoj!")) chyby.push("chat");
  for (const tab of ["spravy", "rebricek", "pridat"]) { st.socTab = tab; st.view = "priatelia"; render(); } st.view = "priatelProfil"; render();
  if (!nahladSpravy("f1").includes("Ty: Ahoj!") && !nahladSpravy("f1").includes("nálepka")) chyby.push("nahlad spravy " + nahladSpravy("f1"));
  if (!prehladPriatelov().includes("SOVA-K7M2")) chyby.push("prehlad priatelov");
  { const pH = prehladPriatelov(), rodicPred = window.Cloud.rodic;
    if (pH.includes("data-soc-vypni") || pH.includes("data-rp-socvypni") || !pH.includes("data-rodic-novy")) chyby.push("priatelia: bez rodica sa da vypnut");
    window.Cloud.rodic = { profil: { pin: 1 } };
    if (!prehladPriatelov().includes("data-rp-socvypni")) chyby.push("priatelia: rodic nema vypnutie");
    So.zapnute = false; st.view = "priatelia"; render();
    const vH = views.priatelia();
    if (vH.includes("data-soc-zapni") || vH.includes("data-rp-soczapni") || vH.includes("data-rodic-novy") || !vH.includes("zapína rodič")) chyby.push("priatelia: dieta s rodicom vidi zapnutie");
    if (!prehladPriatelov().includes("data-rp-soczapni")) chyby.push("priatelia: rodic nema zapnutie");
    window.Cloud.rodic = rodicPred || { profil: null };
    const bH = views.priatelia();
    if (bH.includes("data-soc-zapni") || !bH.includes("data-rodic-novy")) chyby.push("priatelia: bez rodica chyba ponuka ucta rodica");
    So.zapnute = true; }
  st.view = "ja"; render();
  Object.assign(st, zal); window.Cloud = undefined; }
/* V30_TEST */
{ Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, view: "ja" }); render();
  if (!main.innerHTML.includes("data-sprievodca")) chyby.push("sprievodca v profile");
  Sprievodca.start(); if (!Sprievodca.el || Sprievodca.i !== 0) chyby.push("sprievodca nezacal");
  for (let i = 0; i < 40 && Sprievodca.el; i++) {
    const k = SPR_KROKY[Sprievodca.i];
    if (k.v && st.view !== k.v) chyby.push("sprievodca krok " + Sprievodca.i + " na " + st.view);
    if (k.id === "koniec" && st.view !== "ja") chyby.push("sprievodca konci mimo profilu");
    if (k.tap) Sprievodca.tukni(); else Sprievodca.dalej();
  }
  if (Sprievodca.el) chyby.push("sprievodca neskoncil");
  for (const k of SPR_KROKY.filter(k => k.v && k.v !== "priatelia" && k.cil[0] === ".")) { st.view = k.v; if (!views[k.v]().includes(k.cil.slice(1))) chyby.push("sprievodca ciel " + k.cil); }
  if (!NOVINKY.some(n => n.v === VERZIA_APPKY)) chyby.push("novinky " + VERZIA_APPKY);
  st.view = "domov"; render(); }
/* V31_TEST */
{ for (const zar of Object.keys(PLOCHA)) { if (!PLOCHA[zar].length) chyby.push("plocha " + zar);
    for (const k of PLOCHA[zar]) if (!String(k.obr()).startsWith("<svg") || !k.n || !k.p) chyby.push("plocha krok " + zar); Plocha.navod(zar); }
  if (Plocha.zariadenie() !== "pocitac") chyby.push("plocha zariadenie " + Plocha.zariadenie());
  Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, view: "domov" }); render();
  if (main.innerHTML.includes("data-plocha")) chyby.push("plocha karta na pocitaci bez instalacie");
  Plocha.udalost = { prompt() {}, userChoice: Promise.resolve({ outcome: "dismissed" }) }; render();
  if (!main.innerHTML.includes("data-plocha") || !main.innerHTML.includes("plocha-karta")) chyby.push("plocha karta");
  Plocha.navod(); if (Plocha.udalost) chyby.push("plocha instalacia");
  st.view = "ja"; render(); if (!main.innerHTML.includes("data-plocha")) chyby.push("plocha v profile");
  st.faza = "prihlasenie"; render(); st.faza = "appka"; st.view = "domov"; render(); Uvod.skontroluj(); Uvod.skry();
  if (!NOVINKY.some(n => n.v === VERZIA_APPKY)) chyby.push("novinky " + VERZIA_APPKY); }
/* V31B_TEST */
{ Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, vek: "starsi" });
  odomkni();
  startTema("hory"); const f = st.flow; f.kroky.forEach((k, i) => { if (k.t === "q") f.odp[i] = { v: 1, ok: false, p: "x" }; });
  if (!vsetkoZle(f) || Oslava.treba(f)) chyby.push("tema vsetko zle");
  f.zle = true; f.i = f.kroky.length - 1; renderFlow(); if (!main.innerHTML.includes("data-znova")) chyby.push("tlacidlo skus znova");
  startKviz("vyzva"); const v = st.flow; if (!v || v.zivoty !== 3) chyby.push("vyzva zivoty");
  for (let i = 0; i < 3; i++) { v.i = i; odpovedz(v, 1); renderFlow(false); }
  if (!v.prehra || v.zivoty !== 0 || !main.innerHTML.includes("zivoty")) chyby.push("vyzva tri zle");
  v.i = v.kroky.length - 1; renderFlow(); if (!main.innerHTML.includes("Došli životy")) chyby.push("vyzva prehra");
  st.flow = null; kvizZamkni("vyzva"); startKviz("vyzva"); if (st.flow) chyby.push("vyzva zamok");
  st.view = "objavuj"; render(); if (!main.innerHTML.includes("Znova o")) chyby.push("vyzva cas na objavuj");
  odomkni();
  const dniPred = JSON.stringify(st.dni); startKviz(""); dokonci(st.flow); if (JSON.stringify(st.dni) !== dniPred) chyby.push("kviz bez spravnej pridal den");
  st.flow = null; st.body = 500; Hra.start("sova"); if (!st.hra) chyby.push("sova start"); Hra.sovaKresli(st.hra); Hra.zrus(); render(); }
/* V32_TEST */
{ Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, vek: "starsi" }); odomkni();
  startKviz(""); const rk = st.flow; if (!rk || rk.zivoty !== 2) chyby.push("rychly 2 zivoty");
  for (let i = 0; i < 2; i++) { rk.i = i; odpovedz(rk, 1); } if (!rk.prehra) chyby.push("rychly prehra po 2");
  rk.i = rk.kroky.length - 1; renderFlow(); if (!main.innerHTML.includes("5 min")) chyby.push("rychly prehra text");
  st.flow = null; startKviz("tazky"); const tz = st.flow; if (!tz || tz.zivoty !== 3) chyby.push("tazky 3 zivoty");
  tz.kroky.forEach((k, i) => { if (k.t === "q") tz.odp[i] = { v: 0, ok: true, p: "x" }; }); dokonci(tz);
  if (kvizMinuty("tazky") !== 15) chyby.push("tazky prestavka " + kvizMinuty("tazky"));
  tz.i = tz.kroky.length - 1; renderFlow(); if (!main.innerHTML.includes("Ďalší ťažký kvíz môžeš hrať o 15 min")) chyby.push("tazky koniec text");
  st.flow = null; startKviz("tazky"); if (st.flow) chyby.push("tazky zamok");
  kvizZamkni("vyzva"); kvizZamkni("rychly"); if (kvizMinuty("vyzva") !== 30 || kvizMinuty("rychly") !== 5) chyby.push("prestavky 30 a 5");
  st.view = "objavuj"; render(); if ((main.innerHTML.match(/Znova o/g) || []).length !== 3) chyby.push("objavuj tri prestavky");
  odomkni(); const ina = TV().find(x => x.id !== temaDna().id && !st.done.includes(x.id)); startTema(ina.id); const fi = st.flow;
  fi.kroky.forEach((k, i) => { if (k.t === "q") fi.odp[i] = { v: 0, ok: true, p: "x" }; }); dokonci(fi); if (fi.zisk !== 10) chyby.push("ina tema body " + fi.zisk);
  const dna = temaDna(); st.done = st.done.filter(x => x !== dna.id); startTema(dna.id); const fd = st.flow;
  fd.kroky.forEach((k, i) => { if (k.t === "q") fd.odp[i] = { v: 0, ok: true, p: "x" }; }); dokonci(fd); if (fd.zisk <= 10) chyby.push("tema dna body " + fd.zisk);
  st.flow = null; render(); }
/* V33_TEST */
{ const zaklad = { vlasy: "kratke", farbaVlasov: "#2B2240", koza: "#FFE0C7", oci: "bodky", usta: "usmev", okuliare: "ziadne", tricko: "#FF5A5F", vzor: "ziadny", doplnok: "ziadny", zvieratko: "ziadne", kuzlo: "ziadne", pozadie: "#D6E6FF" };
  for (const k of ["vlasy", "oci", "usta", "okuliare", "vzor", "doplnok", "zvieratko", "kuzlo"]) { if (new Set(AV[k].map(v => postavicka({ ...zaklad, [k]: v }))).size !== AV[k].length) chyby.push("kreslenie " + k); }
  for (const kl of ["doplnok:oslava", "doplnok:kuchar", "doplnok:roh", "okuliare:karneval", "vzor:sova", "vzor:planeta", "zvieratko:panda", "kuzlo:srdcia"]) if (!ODOMKNI[kl] || !NAZVY_ODMIEN[kl]) chyby.push("nova vec " + kl);
  Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, body: 500 }); Hra.start("sova"); const hs = st.hra; Hra.sovaStart();
  hs.prekazky.push({ x: 120, stred: 220, f: 0, f2: 3, presla: false }); hs.hviezdy.push({ x: 150, y: 200 });
  for (let i = 0; i < 120; i++) { sovaKrok(hs, .016); Hra.sovaKresli(hs); } if (!(hs.posun > 0)) chyby.push("sova sa nehybe");
  Hra.zrus(); render(); }
/* V34_TEST */
{ Object.assign(st, { faza: "tvorba", upravuje: noveUpravovanie(true), flow: null, hra: null, auto: null }); render();
  Sprievodca.start(SPR_UCET, { brana: true }); if (!Sprievodca.el || Sprievodca.kroky !== SPR_UCET) chyby.push("sprievodca ucet nezacal");
  for (let i = 0; i < 30 && Sprievodca.el; i++) Sprievodca.dalej(); if (Sprievodca.el) chyby.push("sprievodca ucet neskoncil");
  Object.assign(st, { faza: "appka", dietaId: "d1", view: "domov" }); render();
  Sprievodca.start(SPR_RODIC); if (Sprievodca.kroky !== SPR_RODIC) chyby.push("sprievodca rodic nezacal");
  for (let i = 0; i < 60 && Sprievodca.el; i++) { const k = SPR_RODIC[Sprievodca.i];
    if (k.v && st.view !== k.v) chyby.push("sprievodca rodic krok " + Sprievodca.i + " na " + st.view);
    if (k.id === "koniec" && st.view !== "ja") chyby.push("sprievodca rodic konci mimo profilu");
    Sprievodca.ciel(); if (k.tap) Sprievodca.tukni(); else Sprievodca.dalej(); }
  if (Sprievodca.el) chyby.push("sprievodca rodic neskoncil");
  for (const k of SPR_RODIC.filter(k => k.v && k.v !== "priatelia" && typeof k.cil === "string" && k.cil[0] === "." && !k.ak)) { st.view = k.v; if (!views[k.v]().includes(k.cil.slice(1))) chyby.push("sprievodca rodic ciel " + k.cil); }
  for (const k of SPR_UCET.filter(k => typeof k.cil === "string")) { const x = k.cil.replace(".tvorba ", "").replace("#", "").replace(".", "").replace("[", "").replace("]", ""); if (!brany.tvorba().includes(x)) chyby.push("sprievodca ucet ciel " + k.cil); }
  Sprievodca.start(SPR_NOVE); if (Sprievodca.kroky !== SPR_NOVE) chyby.push("sprievodca nove nezacal");
  for (let i = 0; i < 20 && Sprievodca.el; i++) { const k = SPR_NOVE[Sprievodca.i]; if (k.v && st.view !== k.v) chyby.push("sprievodca nove krok " + Sprievodca.i + " na " + st.view); Sprievodca.dalej(); }
  if (Sprievodca.el) chyby.push("sprievodca nove neskoncil");
  for (const k of SPR_NOVE.filter(k => k.v && k.cil[0] === ".")) { st.view = k.v; if (!views[k.v]().includes(k.cil.slice(1))) chyby.push("sprievodca nove ciel " + k.cil); }
  Sprievodca.start(); if (Sprievodca.kroky !== SPR_KROKY) chyby.push("sprievodca pre dieta"); Sprievodca.zavri(true);
  st.view = "domov"; render(); }
/* V35_TEST */
{ const ocak = [[0, 0], [1, 1], [2, 1], [3, 2], [6, 2], [7, 3], [13, 3], [14, 4], [29, 4], [30, 5], [60, 5]];
  for (const [n, i] of ocak) if (stromStupen(n) !== i) chyby.push("stupen stromu " + n + " -> " + stromStupen(n));
  for (let i = 0; i < STROM_STUPNE.length; i++) { const sv = stromSvg({ stupen: i, plody: STROM_STUPNE[i].plody, kos: 2, novy: 'kos', z: .8, sova: true }); if (!sv.startsWith("<svg") || (i && !sv.includes("os-koruna"))) chyby.push("strom svg " + i); }
  if (PLODY.length < Math.max(...STROM_STUPNE.map(x => x.plody))) chyby.push("malo miest na plody");
  Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, view: "domov" }); render();
  if (main.innerHTML.includes("tyzden-karta")) chyby.push("karta Tento tyzden ma byt schovana");
  { const sv = stromTlacidlo(true), sp = stromTlacidlo(false); if (!sv.includes("ts-i") || sp.includes("ts-i") || !sp.includes("ts-z") || !sv.startsWith("<svg") || !sp.startsWith("<svg")) chyby.push("strom v lište: stavy"); TyzStrom.maluj();
    const kd = st.kedy; st.kedy = {}; if (TyzStrom.jeHotovo()) chyby.push("strom: nema byt hotovo"); st.kedy = { [temaDna().id]: key(new Date()) }; if (!TyzStrom.jeHotovo()) chyby.push("strom: ma byt hotovo"); st.kedy = kd;
    const ok = TyzStrom.html(); if (!ok.includes("tyzden-strom") || !ok.includes("data-tyz-den") || !ok.includes("data-tyz-prehlad") || !ok.includes("data-okruh-otvor") || !ok.includes("data-tyzs-zavri")) chyby.push("okno tyzdna"); }
  const dniPred = st.dni; for (const n of [0, 1, 5, 20, 40]) { st.dni = Array.from({ length: n }, (_, i) => { const x = new Date(); x.setDate(x.getDate() - i); return key(x); }); Strom.ukaz(); Oslava.ukaz(() => {}); }
  if (!stromStavHtml(5, 2).includes("Ešte 2 dni")) chyby.push("strom stav text " + stromStavHtml(5, 2));
  st.dni = dniPred; render(); }
/* AUTO_TEST */
Object.assign(st, { dietaId: "d1", vek: "starsi", body: 0, done: [], fav: [], dni: [], odznaky: [], avatar: nahodnyAvatar(0), flow: null, faza: "appka", view: "domov" });
{ const plan = autoPlan(byId("hory")); const qn = byId("hory").z.length;
  if (plan.segs.filter(x => x.e === "otaznik").length !== qn) chyby.push("auto kviz segmenty");
  if (!plan.segs.some(x => x.label === "Do hĺbky")) chyby.push("auto starsie");
  if (plan.kroky.filter(k => k.typ === "pauza").length !== qn + byId("hory").o.length) chyby.push("auto pauzy"); }
Auto.start("hory");
if (st.auto.stav !== "rucne") chyby.push("auto bez hlasu ma byt rucne");
for (let i = 0; i < 40 && st.auto && st.auto.stav !== "koniec"; i++) Auto.ovladaj("dalej");
if (!st.done.includes("hory")) chyby.push("auto neoznacilo temu");
if (st.body !== (temaDna().id === "hory" ? byId("hory").z.length * 10 + 10 : 10)) chyby.push("auto body " + st.body);
Auto.ovladaj("stop"); if (st.auto) chyby.push("auto stop");
// RODIČ (3.5): detský pohľad sa mení podľa toho, či existuje profil rodiča
{ window.Cloud = window.Cloud || {}; const C = window.Cloud, staraD = C.deti, staraR = C.rodic, staraU = st.upravuje, staraV = st.view;
  C.deti = C.deti || []; C.rodic = { nacitane: true, profil: null, prepotvrdene: 0 }; st.view = "ja";
  let h = views.ja();
  if (!h.includes("Vytvoriť účet rodiča") || !h.includes("data-rodic-novy")) chyby.push("rodic: bez rodica chyba karta Vytvoriť účet rodiča");
  if (!h.includes(prehladRodica().slice(0, 60))) chyby.push("rodic: bez rodica chyba prehlad");
  C.rodic.profil = { meno: "Mama", ikona: "r1", pin: "x", nastavenia: {} };
  h = views.ja();
  if (h.includes("Vytvoriť účet rodiča")) chyby.push("rodic: s rodicom stale ponuka vytvorenia");
  if (!h.includes("data-deti") || h.includes('data-ucet="odhlas"')) chyby.push("rodic: karta Rodina nie je zmensena");
  if (h.includes("Pre rodiča</h2>")) chyby.push("rodic: prehlad ostal v detskom pohlade");
  Rodic.zamkni(); st.upravuje = { id: "x", meno: "A", vek: "mladsi", avatar: nahodnyAvatar(0), body: 0, kat: "vlasy", novy: false, potvrd: false };
  if (brany.tvorba().includes("data-zmazat")) chyby.push("rodic: zamknuty rodic, ale je Odstranit profil");
  Rodic.odomkni(); if (!brany.tvorba().includes("data-zmazat")) chyby.push("rodic: odomknuty rodic nevidi Odstranit profil");
  Rodic.zamkni(); C.rodic.profil = null;
  if (!brany.tvorba().includes("data-zmazat")) chyby.push("rodic: bez rodica chyba Odstranit profil");
  if (!SPR_RODIC.some(k => k.id === "rodicucet" && k.ak() === true)) chyby.push("rodic: sprievodca nema ponuku uctu rodica");
  if (typeof RodicVyzva.ukaz !== "function") chyby.push("rodic: chyba okno vyzvy"); { const f = st.flow; st.flow = {}; if (RodicVyzva.volno()) chyby.push("rodic: vyzva by sa ukazala pocas hry"); st.flow = f; }
  C.deti = staraD; C.rodic = staraR; st.upravuje = staraU; st.view = staraV; }
/* BEZPECNOST 3.8 */
{ const zly = postavicka({ vlasy: "kratke", farbaVlasov: '"/><img src=x onerror=alert(1)>', koza: 'red', tricko: '#12', pozadie: '"><b>' }, true);
  if (/onerror|<img|<b>/.test(zly)) chyby.push("xss: postavicka pusti nebezpecnu farbu");
  if (!postavicka({ farbaVlasov: "#2B2240" }).includes("#2B2240")) chyby.push("xss: platna farba sa stratila");
  for (const t of ["si kokot", "s.p.r.o.s.t.e debiil", "kuuurva", "j3b"]) if (socKontrola(t) !== "slova") chyby.push("filter nezachytil: " + t);
  for (const t of ["zavolaj 0911 222 333", "mail@a.sk", "www.x.sk"]) if (socKontrola(t) !== "udaje") chyby.push("filter nezachytil udaj: " + t);
  for (const t of ["Ahoj, ako sa mas?", "hovädzie mäso", "ahoj naživo", "To je sranda"]) if (socKontrola(t)) chyby.push("filter blokuje bezny text: " + t); }
/* DOMOV 4.0: Téma dňa, týždeň, okruh, Objavuj */
{ Object.assign(st, { faza: "appka", dietaId: "d1", flow: null, hra: null, auto: null, vek: "starsi", view: "domov" }); render();
  const h = main.innerHTML;
  if (h.includes("Misia dňa") || !h.includes("Téma dňa")) throw new Error("domov: nazov Tema dna");
  if (h.includes("data-tyz-den=") || h.includes("data-okruh-otvor") || !h.includes('data-go="objavuj"')) throw new Error("domov: tyzden ma byt schovany, objavuj ostava");
  { const ok = TyzStrom.html(); if (!ok.includes("data-tyz-den=") || !ok.includes("data-okruh-otvor")) throw new Error("okno tyzdna"); TyzStrom.maluj(); }
  if (h.includes("data-kviz") || h.includes("data-skupina")) throw new Error("domov: kvizy a oblasti maju byt v Objavuj");
  st.view = "objavuj"; render(); const o = main.innerHTML;
  if (!o.includes("data-kviz") || !o.includes("data-nahodna") || (o.match(/data-skupina=/g) || []).length !== SKUPINY.length) throw new Error("objavuj: chyba kvizy alebo oblasti");
  st.view = "domov"; render(); Okruh.ukaz(); if (!document.querySelector(".okruh-okno") || !document.querySelector("[data-okruh-id]")) throw new Error("okruh okno");
  Tyzden.nastav("priroda"); if (TY().vybrany() !== "priroda") throw new Error("okruh nastav"); Tyzden.nastav("zmiesany"); st.view = "domov"; render(); }
render();
if (chyby.length) { console.log('CHYBY', chyby); process.exit(1); }
console.log('OK', T.length, 'tem,', Object.keys(KAT).length, 'kategorii, body', st.body, 'hotove', st.done.length);
`)();
// úvodné obrázky pre iPhone a iPad: index.html na ne odkazuje a každý musí existovať
{ const idx = fs.readFileSync(path.join(R, 'index.html'), 'utf8'), linky = [...idx.matchAll(/rel="apple-touch-startup-image"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  const zle = linky.length < 20 ? ['malo uvodnych obrazkov: ' + linky.length] : linky.filter(h => !fs.existsSync(path.join(R, h)));
  if (!idx.includes('id="uvod"')) zle.push('chyba uvodna obrazovka');
  if (zle.length) { console.log('CHYBY uvod', zle); process.exit(1); } }
// 4.1 D: limit dĺžky mena a ochrana pred pretekaním
{ const src = fs.readFileSync(path.join(R, 'zdroj', 'appka.html'), 'utf8'), zle = [];
  const m = src.match(/id="meno-dietata"[^>]*maxlength="(\d+)"/);
  if (!m || +m[1] < 10 || +m[1] > 20) zle.push('meno dietata: maxlength 10 az 20');
  if (!/\.dieta b[^}]*line-clamp/.test(src)) zle.push('chyba orezanie mena v vybere dietata');
  if (!/\.prof-meno[^}]*min-width: 0/.test(src) || !/\.h1, \.h2[^}]*overflow-wrap: (anywhere|break-word)/.test(src)) zle.push('chyba zalamovanie nadpisov');
  if (zle.length) { console.log('CHYBY meno', zle); process.exit(1); } }

// vibrácie: Haptika je bezpečná bez navigator.vibrate, rešpektuje prepínač a "menej pohybu"
{ const zle = [], src2 = html;
  if (!/const Haptika = \{/.test(src2) || !/data-vibracie/.test(src2)) zle.push('chyba Haptika alebo prepinac');
  if (!/navigator\.vibrate/.test(src2) || !/prefers-reduced-motion: reduce\)'\)\.matches/.test(src2) && !/prefers-reduced-motion/.test(src2.slice(src2.indexOf('const Haptika'), src2.indexOf('const Haptika') + 900))) zle.push('Haptika nerespektuje reduced-motion');
  const blok = src2.slice(src2.indexOf('const Haptika'), src2.indexOf('const vibraciePrepinac'));
  const H = new Function('S', 'matchMedia', 'navigator', blok + '; return Haptika;');
  const volane = [], mk = (v, m) => H({ get: () => v }, () => ({ matches: m }), global.navigator && 0 ? 0 : { vibrate: p => (volane.push(p), true) });
  if (H({ get: () => true }, () => ({ matches: false }), {}).hraj('tuk') !== false) zle.push('bez vibrate ma vratit false');
  if (!mk(true, false).hraj('spravne') || volane.length !== 1) zle.push('zapnute nevibruje');
  if (mk(false, false).hraj('tuk') || volane.length !== 1) zle.push('vypnute vibruje');
  if (mk(true, true).hraj('tuk') || volane.length !== 1) zle.push('reduced-motion vibruje');
  if (zle.length) { console.log('CHYBY vibracie', zle); process.exit(1); } }
