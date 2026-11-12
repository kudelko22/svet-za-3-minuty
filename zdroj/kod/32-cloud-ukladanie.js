// pre panel rodiča: dieťa sa stane aktívnym (kvôli verejnému profilu) a spustia sa jeho priatelia a správy; zavri ich zastaví
Cloud.rodicDietaOtvor = id => { const d = Cloud.dieta(id); if (!d) return false; if (st.dietaId !== id) { Cloud.ulozHned(); nastavAktivne(d); } socStart(id); return true; };
Cloud.rodicDietaZavri = () => socZastav();

function nastavAktivne(d) {
  Object.assign(st, {
    dietaId: d.id, meno: d.meno || '', vek: d.vek === 'starsi' ? 'starsi' : 'mladsi', avatar: { ...AV_ZAKLAD, ...(d.avatar || nahodnyAvatar()) },
    body: d.body || 0, done: [...(d.done || [])], fav: [...(d.fav || [])], dni: [...(d.dni || [])], odznaky: [...(d.odznaky || [])],
    kedy: { ...(d.kedy || {}) }, chyby: [...(d.chyby || [])], vybrate: [...(d.vybrate || [])],
  });
}
function zapis(id, d) {
  const z = setDoc(doc(db, 'rodiny', Cloud.pouzivatel.uid, 'deti', id), {
    meno: d.meno, vek: d.vek, avatar: d.avatar, body: d.body, done: d.done, fav: d.fav, dni: d.dni, odznaky: d.odznaky || [], kedy: d.kedy || {}, chyby: d.chyby || [], vybrate: d.vybrate || [],
    poradie: d.poradie, verzia: 5, upravene: serverTimestamp(),
  });
  if (!navigator.onLine) { Cloud.stavUlozenia = 'Uložené v telefóne, do cloudu sa pošle, keď bude internet.'; obnovStav(); }
  z.then(() => { Cloud.stavUlozenia = 'Všetko je uložené v cloude ✓'; obnovStav(); },
    e => { Cloud.stavUlozenia = 'Neuložené: ' + chybaText(e); obnovStav(); });
}
// Anonymné štatistiky pre vlastníka (admin.html): len počty a id tém, bez mena a obsahu; pravidlá `statistiky/{uid}`
let statOtlacok = '';
function zapisStat() {
  try {
    if (!Cloud.pouzivatel || !Cloud.deti.length) return;
    const dnes = key(new Date()), D = /^d{4}-dd-dd$/;
    const dni = [...new Set(Cloud.deti.flatMap(x => x.dni || []).concat(dnes))].filter(x => D.test(x)).sort();
    const hry = [...new Set([...(S.get('statHry', []) || []), ...HRY_VID().filter(h => S.get(rekordKluc(h.id), null) != null).map(h => h.id)])].slice(0, 60);
    S.set('statHry', hry);
    const ang = Math.max(S.get('statAng', 0) || 0, Object.keys(Ang.data().dni || {}).length); S.set('statAng', ang);
    const pri = Math.max(S.get('statPri', 0) || 0, Object.keys(Soc.priatelia || {}).length); S.set('statPri', pri);
    const d = {
      od: dni[0], posledne: dnes, verzia: VERZIA_APPKY, nazov: String(VERZIA_NAZOV).slice(0, 12),
      mladsi: Cloud.deti.filter(x => x.vek !== 'starsi').length, starsi: Cloud.deti.filter(x => x.vek === 'starsi').length,
      temy: Cloud.deti.reduce((a, x) => a + (x.done || []).length, 0),
      done: [...new Set(Cloud.deti.flatMap(x => x.done || []))].slice(0, 500), fav: [...new Set(Cloud.deti.flatMap(x => x.fav || []))].slice(0, 500),
      hry, ang, priatelia: pri, dni: dni.slice(-60), email: String(Cloud.pouzivatel.email || '').slice(0, 120),
    };
    const o = JSON.stringify(d); if (o === statOtlacok) return; statOtlacok = o;
    setDoc(doc(db, 'statistiky', Cloud.pouzivatel.uid), { ...d, upravene: serverTimestamp() }).catch(() => { statOtlacok = ''; });
  } catch (e) { /* štatistiky nikdy nesmú rozbiť ukladanie */ }
}
function ulozAktivne() {
  casovac = null;
  const d = Cloud.deti.find(x => x.id === st.dietaId);
  if (!d || !Cloud.pouzivatel) return;
  Object.assign(d, { meno: st.meno, vek: st.vek, avatar: st.avatar, body: Math.max(0, Math.round(st.body || 0)), done: st.done.slice(0, 500), fav: st.fav.slice(0, 500), dni: st.dni.slice(-400), odznaky: st.odznaky.slice(0, 100), kedy: st.kedy, chyby: st.chyby.slice(-60), vybrate: st.vybrate.slice(0, 100) });
  zapis(d.id, d);
  socUlozProfil();
  zapisStat();
}
function obnovStav() { const el = document.getElementById('cloud-stav'); if (el) el.textContent = Cloud.stavUlozenia; }
// prekreslí úvod a zachová rozpísané polia; pole s chybou dostane kurzor (okrem počas prihlasovania)
function obnovPrihlasenie(naPole) {
  const ids = ['email', 'heslo', 'heslo2'], v = ids.map(i => (document.getElementById(i) || {}).value);
  render(); main.classList.remove('anim');
  ids.forEach((i, k) => { const el = document.getElementById(i); if (el && v[k]) el.value = v[k]; });
  const f = naPole && document.getElementById(naPole); if (f) f.focus();
}
// kontrola polí pred odoslaním: { pole: text chyby }
function pokazenePolia(co, email, heslo, heslo2) {
  const z = {};
  if (!email) z.email = 'Napíšte e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) z.email = CHYBY['auth/invalid-email'];
  if (!heslo) z.heslo = 'Napíšte heslo.';
  else if (co === 'registruj' && heslo.length < 6) z.heslo = CHYBY['auth/weak-password'];
  else if (co === 'registruj' && heslo2 !== heslo) z.heslo2 = 'Heslá sa nezhodujú.';
  if (co === 'registruj' && !z.heslo && !heslo2) z.heslo2 = 'Napíšte heslo ešte raz.';
  return z;
}
// zmena aktívneho dieťaťa z iného telefónu
function prevezmi(a) {
  if (casovac || otlacok(a) === otlacok(st)) return; // vlastné neuložené zmeny majú prednosť
  nastavAktivne(a);
  if (st.flow || st.hra || st.auto || st.ang || st.misia) paintHead(); else { render(); main.classList.remove('anim'); }
}
function zobrazPoNacitani() {
  const a = Cloud.deti.find(x => x.id === S.get('aktivne', null));
  if (a) { nastavAktivne(a); noveOdznaky(); socStart(a.id); Object.assign(st, { faza: 'appka', view: 'domov' }); }
  else if (Cloud.deti.length) st.faza = 'vyber';
  else {
    // nový účet rodiča: sprievodca už pri tvorbe profilu dieťaťa a po uložení celá prehliadka appky
    st.faza = 'tvorba'; st.upravuje = noveUpravovanie(true); Cloud.novyUcet = true;
    setTimeout(() => Sprievodca.start(SPR_UCET, { brana: true, zavriet: 'Po uložení profilu vám ukážem celú appku.' }), 900);
  }
  render();
}
// pokrok z verzie 5 (dokument pokrok/<uid>) sa prenesie ako prvé dieťa
async function prevodStareho(u) {
  const ten = () => Cloud.pouzivatel && Cloud.pouzivatel.uid === u.uid;
  try {
    // ak už toto zariadenie malo deti tohto účtu (aj zmazané), starý dokument sa znova neprenáša; nič sa nemaže
    if (!S.get('pokrok-hotovo-' + u.uid, false)) {
    const s = await getDoc(doc(db, 'pokrok', u.uid));
    if (!ten()) return;
    if (s.exists() && !Cloud.deti.length) {
      const c = s.data(), id = noveId();
      const d = { meno: (c.meno || 'Dieťa').slice(0, 20), vek: c.vek === 'starsi' ? 'starsi' : 'mladsi', avatar: nahodnyAvatar(),
        body: c.body || 0, done: c.done || [], fav: c.fav || [], dni: (c.dni || []).slice(-400), odznaky: [], poradie: Date.now() };
      Cloud.deti = [{ id, ...d }]; zapis(id, d); S.set('aktivne', id); S.set('pokrok-hotovo-' + u.uid, true);
    }
    }
  } catch (e) { /* bez starého pokroku pokračujeme ďalej */ }
  if (!ten()) return;
  zobrazPoNacitani();
}

onAuthStateChanged(auth, u => {
  Cloud.pouzivatel = u; Cloud.deti = []; Cloud.nacitane = false; Cloud.chyba = ''; socZastav();
  Sprievodca.zavri(true); // sprievodca nového účtu nesmie ostať visieť nad úvodom po odhlásení
  if (odber) { odber(); odber = null; }
  if (odberRodic) { odberRodic(); odberRodic = null; }
  Cloud.rodic = { nacitane: false, profil: null, prepotvrdene: 0 }; Rodic.zamkni();
  clearTimeout(casovac); casovac = null; zrusAktivity();
  if (!u) {
    Object.assign(st, { meno: '', vek: 'mladsi', fav: [], done: [], dni: [], body: 0, odznaky: [], kedy: {}, chyby: [], vybrate: [] }); // nič z predošlého účtu v pamäti
    // po návrate z Googlu sa prihlásenie ešte dokončuje: neukazujeme prihlasovaciu obrazovku, aby sa neťukalo znova
    st.uvodKrok = 'volba'; st.uvodEmail = ''; Cloud.chyby = {};
    Object.assign(st, { dietaId: null, avatar: null, flow: null, faza: dokoncujeGoogle ? 'nacitava' : 'prihlasenie', sprava: dokoncujeGoogle ? 'Dokončuje sa prihlásenie cez Google…' : '' });
    render(); return;
  }
  Object.assign(st, { faza: 'nacitava', sprava: 'Prihlásené, načítavajú sa deti…' }); render();
  Cloud.chybaNacitania = '';
  setTimeout(() => { if (Cloud.pouzivatel === u && st.faza === 'nacitava' && !Cloud.nacitane) { st.faza = 'chybaNacitania'; render(); } }, 12000); // časový limit: ak sa nič nenačíta, ukážeme východ
  odberRodic = onSnapshot(doc(db, 'rodiny', u.uid, 'rodic', 'profil'), { includeMetadataChanges: true }, snap => {
    if (!snap.exists() && snap.metadata.fromCache) return; // prázdna kópia z pamäte nie je odpoveď servera: počkáme, aby sa existujúci PIN nedal prepísať
    const bolo = !!Cloud.rodic.profil;
    Cloud.rodic.profil = snap.exists() ? snap.data() : null; Cloud.rodic.nacitane = true;
    if (bolo && !Cloud.rodic.profil) { Rodic.zamkni(); if (st.faza.startsWith('rodic')) st.faza = 'vyber'; } // zmazaný na inom telefóne
    if (st.faza === 'vyber' || st.faza.startsWith('rodic')) renderTicho();
  }, e => { if (e && e.code === 'permission-denied') Cloud.rodic.nacitane = true; }); // pravidlá ešte nenasadené: berieme, že rodič nie je; pri inej chybe (bez siete) sa neponúka vytvorenie
  odber = onSnapshot(collection(db, 'rodiny', u.uid, 'deti'), { includeMetadataChanges: true }, snap => {
    const deti = snap.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => (a.poradie || 0) - (b.poradie || 0));
    if (!Cloud.nacitane) {
      if (snap.empty && snap.metadata.fromCache) return; // prvé spustenie: počkáme na odpoveď z cloudu
      Cloud.nacitane = true; Cloud.deti = deti;
      if (deti.length) { S.set('pokrok-hotovo-' + u.uid, true); zobrazPoNacitani(); } else prevodStareho(u);
      return;
    }
    Cloud.deti = deti;
    const a = deti.find(x => x.id === st.dietaId);
    if (st.faza === 'appka' && st.dietaId && !a && !snap.metadata.hasPendingWrites) {
      // dieťa odstránené na inom telefóne
      Object.assign(st, { dietaId: null, flow: null, faza: deti.length ? 'vyber' : 'tvorba' });
      if (!deti.length) st.upravuje = noveUpravovanie(false);
      render(); return;
    }
    if (a && st.faza === 'appka' && !snap.metadata.hasPendingWrites && !snap.metadata.fromCache) prevezmi(a);
    const podpis = JSON.stringify(deti.map(x => [x.id, x.meno, x.vek, x.body, x.poradie, x.avatar]));
    if (st.faza === 'vyber' && podpis !== Cloud.podpisVyberu) renderTicho(); // snímka bez zmeny (len metadáta) neprekresľuje
    Cloud.podpisVyberu = podpis;
  }, e => {
    Cloud.stavUlozenia = 'Cloud sa nedá načítať: ' + chybaText(e); obnovStav();
    if (!Cloud.nacitane && st.faza === 'nacitava') { Cloud.chybaNacitania = chybaText(e); st.faza = 'chybaNacitania'; render(); }
  });
});
getRedirectResult(auth).catch(e => { Cloud.chyba = chybaText(e); }).finally(() => {
  const bolo = dokoncujeGoogle;
  dokoncujeGoogle = false; S.set('presmerovanie', 0);
  if (!Cloud.pouzivatel && (bolo || Cloud.chyba)) { Object.assign(st, { faza: 'prihlasenie', sprava: '' }); render(); }
});
