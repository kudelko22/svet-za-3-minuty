// Testy logiky appky bez prehliadača (falošná stránka v Node). Spustenie: node zdroj/test.js
// Skontroluje témy, obrázky, prihlasovacie obrazovky, postavičku, odmeny, odznaky, hry, režim do auta a prehľad pre rodiča.
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const R = path.join(__dirname, '..'), html = fs.readFileSync(path.join(__dirname, 'appka.html'), 'utf8');
const skript = html.match(/^<script>\n([\s\S]*?)^<\/script>$/m)[1];
const modul = html.match(/^<script type="module">\n([\s\S]*?)^<\/script>$/m)[1];
const docasny = path.join(os.tmpdir(), 'svet3-modul.mjs');
fs.writeFileSync(docasny, modul); execFileSync(process.execPath, ['--check', docasny], { stdio: 'inherit' }); // modul s Firebase sa len skontroluje
const src = ['temy.js', 'obrazky.js'].map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n') + '\n' + skript;
const ctx2d = new Proxy({}, { get: (o, k) => k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}, set: () => true });
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
for (const v of ['domov','temy','hry','odznaky','ja']) { st.view = v; render(); }
const chyby = [];
for (const t of T) {
  if (!ART[t.id]) chyby.push('obrazok ' + t.id);
  if (!KAT[t.k]) chyby.push('kategoria ' + t.id);
  for (const r of t.r) if (!byId(r)) chyby.push('suvisi ' + t.id + ' -> ' + r);
  for (const q of t.z) if (q.a.length !== (q.v === 's' || (t.vek || KAT[t.k].vek) === 'starsi' ? q.a.length : 3) || q.a.length < 3 || q.a.length > 4) chyby.push('odpovede ' + t.id); // ťažké otázky môžu mať 4 odpovede
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
Hra.start("hadaj"); { const h = st.hra; if (h.moznosti.length !== 3 || !h.moznosti.includes(h.kola[0]) || h.kola.length !== 8) chyby.push("hadaj moznosti"); Hra.hadaj(h.kola[0]); if (h.spravne !== 1) chyby.push("hadaj spravne"); }
for (const mal of [true, false]) for (let i = 0; i < 400; i++) { const [t, v] = priklad(mal), x = eval(t.replace("−", "-").replace("×", "*")); if (x !== v || v < 0 || (mal && v > 10)) chyby.push("priklad " + t + " = " + v); }
Hra.start("bubliny"); Hra.bublinyStart(); { const h = st.hra; if (!h.beh || !h.moznosti.includes(h.vysl) || new Set(h.moznosti).size !== h.moznosti.length) chyby.push("bubliny"); }
st.kedy = { ruky: key(new Date()) }; st.chyby = []; zapisChybu({ tid: "ruky", q: byId("ruky").z[1] }, false);
if (st.chyby[0] !== "ruky:1" || !prehladRodica().includes("Kedy si umývame ruky")) chyby.push("prehlad rodica");
zapisChybu({ tid: "ruky", q: byId("ruky").z[1] }, true); if (st.chyby.length) chyby.push("chyba sa nezmazala");
Hra.start("opakuj"); { const h = st.hra; h.seq = [2]; h.faza = "hra"; h.krok = 0; Hra.pad(2); if (h.faza !== "cakaj") chyby.push("opakuj dobre"); h.seq = [1, 3]; h.faza = "hra"; h.krok = 0; Hra.pad(0); if (h.faza !== "koniec") chyby.push("opakuj zle"); }
Hra.start("hviezdy"); Hra.zrus(); if (st.hra) chyby.push("hra zrus");
if (noveHry(100, 420).map(x => x.id).join() !== "pexeso,hadaj,sova,hviezdy") chyby.push("nove hry");
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
{ const f = { typ: "tema", id: "ruky", odp: { 3: { ok: true } } }, dniPred = st.dni; st.dni = []; S.set(Oslava.kluc(), ""); if (!Oslava.treba(f) || !Oslava.treba({ typ: "kviz", odp: { 0: { ok: true } } })) chyby.push("oslava prva tema dna"); Oslava.ukaz(() => {});
  if (Oslava.treba(f)) chyby.push("oslava druhykrat"); S.set(Oslava.kluc(), ""); st.dni = [key(new Date())]; if (Oslava.treba(f)) chyby.push("oslava ked uz dnes nieco"); st.dni = dniPred; }
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
  if (S.get("videl-verziu", 0) !== VERZIA_APPKY) chyby.push("novinky verzia"); }
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
{ for (const id of Object.keys(KAT)) { const n = SKUPINY.filter(g => g.kat.includes(id)).length; if (n !== 1) chyby.push("kategoria " + id + " v oblastiach " + n + "x"); }
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
  if (!prehladPriatelov().includes("SOVA-K7M2")) chyby.push("prehlad priatelov"); st.view = "ja"; render();
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
  if (!main.innerHTML.includes("data-plocha") || !main.innerHTML.includes("tyzden")) chyby.push("plocha karta");
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
  st.view = "domov"; render(); if (!main.innerHTML.includes("Znova o")) chyby.push("vyzva cas na domove");
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
  st.view = "domov"; render(); if ((main.innerHTML.match(/Znova o/g) || []).length !== 3) chyby.push("domov tri prestavky");
  odomkni(); const ina = TV().find(x => x.id !== temaDna().id && !st.done.includes(x.id)); startTema(ina.id); const fi = st.flow;
  fi.kroky.forEach((k, i) => { if (k.t === "q") fi.odp[i] = { v: 0, ok: true, p: "x" }; }); dokonci(fi); if (fi.zisk !== 10) chyby.push("ina tema body " + fi.zisk);
  const dna = temaDna(); st.done = st.done.filter(x => x !== dna.id); startTema(dna.id); const fd = st.flow;
  fd.kroky.forEach((k, i) => { if (k.t === "q") fd.odp[i] = { v: 0, ok: true, p: "x" }; }); dokonci(fd); if (fd.zisk <= 10) chyby.push("tema dna body " + fd.zisk);
  st.flow = null; render(); }
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
render();
if (chyby.length) { console.log('CHYBY', chyby); process.exit(1); }
console.log('OK', T.length, 'tem,', Object.keys(KAT).length, 'kategorii, body', st.body, 'hotove', st.done.length);
`)();
// úvodné obrázky pre iPhone a iPad: index.html na ne odkazuje a každý musí existovať
{ const idx = fs.readFileSync(path.join(R, 'index.html'), 'utf8'), linky = [...idx.matchAll(/rel="apple-touch-startup-image"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  const zle = linky.length < 20 ? ['malo uvodnych obrazkov: ' + linky.length] : linky.filter(h => !fs.existsSync(path.join(R, h)));
  if (!idx.includes('id="uvod"')) zle.push('chyba uvodna obrazovka');
  if (zle.length) { console.log('CHYBY uvod', zle); process.exit(1); } }
