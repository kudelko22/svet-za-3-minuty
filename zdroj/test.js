// Testy logiky appky bez prehliadača (falošná stránka v Node). Spustenie: node zdroj/test.js
// Skontroluje témy, obrázky, prihlasovacie obrazovky, postavičku, odmeny, odznaky, hry, režim do auta a prehľad pre rodiča.
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const R = path.join(__dirname, '..'), html = fs.readFileSync(path.join(__dirname, 'appka.html'), 'utf8');
const skript = html.match(/^<script>\n([\s\S]*?)^<\/script>$/m)[1];
const modul = html.match(/^<script type="module">\n([\s\S]*?)^<\/script>$/m)[1];
const docasny = path.join(os.tmpdir(), 'svet3-modul.mjs');
fs.writeFileSync(docasny, modul); execFileSync(process.execPath, ['--check', docasny], { stdio: 'inherit' }); // modul s Firebase sa len skontroluje
const src = ['temy.js', 'obrazky.js'].map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n') + '\n' + skript;
const ctx2d = new Proxy({}, { get: () => () => {}, set: () => true });
const el = () => ({ hidden: false, innerHTML: '', textContent: '', value: '', dataset: { n: '2' }, children: [], style: { setProperty() {} },
  classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, removeAttribute() {}, addEventListener() {}, appendChild() {}, remove() {}, scrollIntoView() {}, insertAdjacentHTML() {}, replaceWith() {},
  querySelector: () => el(), querySelectorAll: () => [], getBoundingClientRect: () => ({ left: 0, top: 0, width: 10, height: 10 }), getContext: () => ctx2d, isConnected: false, offsetWidth: 0 });
const els = {};
global.document = { getElementById: id => (els[id] ||= el()), addEventListener() {}, querySelectorAll: () => [], querySelector: () => el(), createElement: el, body: el() };
global.window = { scrollTo() {} }; global.location = { hostname: 'kudelko22.github.io' };
global.matchMedia = () => ({ matches: false });
global.addEventListener = () => {};
global.innerWidth = 390; global.innerHeight = 844;
global.requestAnimationFrame = () => {}; global.scrollTo = () => {};
global.localStorage = { d: {}, getItem(k) { return k in this.d ? this.d[k] : null; }, setItem(k, v) { this.d[k] = String(v); }, removeItem(k) { delete this.d[k]; } };
new Function(src + `
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
for (const v of ['domov','temy','hry','odznaky','ja']) { st.view = v; render(); }
const chyby = [];
for (const t of T) {
  if (!ART[t.id]) chyby.push('obrazok ' + t.id);
  if (!KAT[t.k]) chyby.push('kategoria ' + t.id);
  for (const r of t.r) if (!byId(r)) chyby.push('suvisi ' + t.id + ' -> ' + r);
  for (const q of t.z) if (q.a.length !== (q.v === 's' ? q.a.length : 3) || q.a.length < 3 || q.a.length > 4) chyby.push('odpovede ' + t.id); // ťažké otázky môžu mať 4 odpovede
  if (t.z.filter(q => q.v !== 's').length < 3) chyby.push('malo otazok pre mladsich ' + t.id);
}
if (new Set(T.map(t => t.id)).size !== T.length) chyby.push('duplicitne id');
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
startTema("dazd"); { const fl = st.flow; fl.kroky.forEach((k, i) => { if (k.t === "q") fl.odp[i] = { v: 0, ok: true, p: "x" }; }); fl.i = fl.kroky.length - 2; dokonci(fl); fl.i++; renderFlow();
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
Hra.start("hadaj"); { const h = st.hra; if (h.moznosti.length !== 3 || !h.moznosti.includes(h.kola[0]) || h.kola.length !== 8) chyby.push("hadaj moznosti"); Hra.hadaj(h.kola[0]); if (h.spravne !== 1) chyby.push("hadaj spravne"); }
for (const mal of [true, false]) for (let i = 0; i < 400; i++) { const [t, v] = priklad(mal), x = eval(t.replace("−", "-").replace("×", "*")); if (x !== v || v < 0 || (mal && v > 10)) chyby.push("priklad " + t + " = " + v); }
Hra.start("bubliny"); Hra.bublinyStart(); { const h = st.hra; if (!h.beh || !h.moznosti.includes(h.vysl) || new Set(h.moznosti).size !== h.moznosti.length) chyby.push("bubliny"); }
st.kedy = { ruky: key(new Date()) }; st.chyby = []; zapisChybu({ tid: "ruky", q: byId("ruky").z[1] }, false);
if (st.chyby[0] !== "ruky:1" || !prehladRodica().includes("Kedy si umývame ruky")) chyby.push("prehlad rodica");
zapisChybu({ tid: "ruky", q: byId("ruky").z[1] }, true); if (st.chyby.length) chyby.push("chyba sa nezmazala");
Hra.start("opakuj"); { const h = st.hra; h.seq = [2]; h.faza = "hra"; h.krok = 0; Hra.pad(2); if (h.faza !== "cakaj") chyby.push("opakuj dobre"); h.seq = [1, 3]; h.faza = "hra"; h.krok = 0; Hra.pad(0); if (h.faza !== "koniec") chyby.push("opakuj zle"); }
Hra.start("hviezdy"); Hra.zrus(); if (st.hra) chyby.push("hra zrus");
if (noveHry(100, 420).map(x => x.id).join() !== "pexeso,hadaj,hviezdy") chyby.push("nove hry");
if (!odmenyHtml({ noveHry: noveHry(140, 160) }).includes("Pexeso")) chyby.push("odmena hra");
st.view = "ja"; render(); st.view = "domov"; render();
/* TAZKE_TEST */
for (const t of T) if (t.z.filter(q => q.v === 's').length < 2) chyby.push("tazke otazky " + t.id);
st.vek = "starsi"; startKviz(true); if (!st.flow.tazky || st.flow.kroky.filter(k => k.t === "q").some(k => k.q.v !== "s") || st.flow.kroky.length !== 9) chyby.push("tazky kviz");
st.flow = null; st.vek = "mladsi"; startKviz(); if (st.flow.kroky.some(k => k.q && k.q.v === "s")) chyby.push("rychly kviz mladsi"); st.flow = null;
/* AUTO_TEST */
Object.assign(st, { dietaId: "d1", vek: "starsi", body: 0, done: [], fav: [], dni: [], odznaky: [], avatar: nahodnyAvatar(0), flow: null, faza: "appka", view: "domov" });
{ const plan = autoPlan(byId("hory")); const qn = byId("hory").z.length;
  if (plan.segs.filter(x => x.e === "❓").length !== qn) chyby.push("auto kviz segmenty");
  if (!plan.segs.some(x => x.label === "Pre väčšie deti")) chyby.push("auto starsie");
  if (plan.kroky.filter(k => k.typ === "pauza").length !== qn + byId("hory").o.length) chyby.push("auto pauzy"); }
Auto.start("hory");
if (st.auto.stav !== "rucne") chyby.push("auto bez hlasu ma byt rucne");
for (let i = 0; i < 40 && st.auto && st.auto.stav !== "koniec"; i++) Auto.ovladaj("dalej");
if (!st.done.includes("hory")) chyby.push("auto neoznacilo temu");
if (st.body !== byId("hory").z.length * 10 + 10) chyby.push("auto body " + st.body);
Auto.ovladaj("stop"); if (st.auto) chyby.push("auto stop");
render();
if (chyby.length) { console.log('CHYBY', chyby); process.exit(1); }
console.log('OK', T.length, 'tem,', Object.keys(KAT).length, 'kategorii, body', st.body, 'hotove', st.done.length);
`)();
