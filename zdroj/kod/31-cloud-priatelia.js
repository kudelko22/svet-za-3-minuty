// ---- Priatelia (verzia 2.0): verejný profil profily/<id dieťaťa>, kód kody/<KÓD>, žiadosti a priatelia pod profilom,
// správy rozhovory/<id1_id2>/spravy. Čo kto smie, stráži firestore.rules (len nálepky a hotové vety, len medzi priateľmi).
const Soc = { pid: null, nacitane: false, zapnute: false, profil: null, ziadosti: [], priatelia: {}, profily: {}, spravy: {}, citane: {} };
const socCitanie = {}; // čo sme už zapísali ako prečítané
let socOdbery = [], socZozn = [], socPriatelia = {}, socZoznamy = false, socOtlacok = '';
const rozhovor = (a, b) => [a, b].sort().join('_');
const socObnov = () => { if (typeof socZmena === 'function') socZmena(); };
const KOD_SLOVA = ['SOVA', 'DUHA', 'VLAK', 'RYBA', 'KOLO', 'SLON', 'MRAK', 'KVET', 'LIST', 'ZAJO'], KOD_ZNAKY = 'ABCDEFGHJKMNPRSTUVXYZ23456789';
const novyKod = () => KOD_SLOVA[Math.floor(Math.random() * KOD_SLOVA.length)] + '-' + Array.from({ length: 4 }, () => KOD_ZNAKY[Math.floor(Math.random() * KOD_ZNAKY.length)]).join('');
function socZastav() {
  [...socOdbery, ...socZozn].forEach(f => f()); Object.values(socPriatelia).forEach(f => f());
  socOdbery = []; socZozn = []; socPriatelia = {}; socZoznamy = false; socOtlacok = '';
  Object.assign(Soc, { pid: null, nacitane: false, zapnute: false, profil: null, ziadosti: [], priatelia: {}, profily: {}, spravy: {}, citane: {} });
}
function socStart(pid) {
  if (Soc.pid === pid && socOdbery.length) return;
  socZastav();
  if (!pid || !Cloud.pouzivatel) return;
  Soc.pid = pid;
  socOdbery.push(onSnapshot(doc(db, 'profily', pid), { includeMetadataChanges: true }, sn => {
    if (Soc.pid !== pid) return;
    Soc.profil = sn.exists() ? sn.data() : null; Soc.zapnute = !!(Soc.profil && Soc.profil.zapnute); Soc.nacitane = true;
    // zoznamy až keď cloud profil naozaj má (inak ich pravidlá odmietnu)
    if (Soc.zapnute && !socZoznamy && !sn.metadata.hasPendingWrites) socZoznamyStart(pid);
    if (Soc.zapnute) socUlozProfil(); // pokrok mohol pribudnúť na inom telefóne alebo kým sa načítaval profil
    socObnov();
  }, () => { Soc.nacitane = true; socObnov(); }));
}
function socZoznamyStart(pid) {
  socZozn.forEach(f => f()); socZozn = []; socZoznamy = true;
  // pri chybe (napríklad profil sa ešte len ukladá) skúsime znova o chvíľu
  const znova = () => { if (Soc.pid !== pid || !socZoznamy) return; socZozn.forEach(f => f()); socZozn = []; socZoznamy = false; setTimeout(() => { if (Soc.pid === pid && Soc.zapnute && !socZoznamy) socZoznamyStart(pid); }, 3000); };
  socZozn.push(onSnapshot(collection(db, 'profily', pid, 'ziadosti'), sn => { Soc.ziadosti = sn.docs.map(x => ({ id: x.id, ...x.data() })); socObnov(); }, znova));
  socZozn.push(onSnapshot(collection(db, 'profily', pid, 'priatelia'), sn => {
    const ids = sn.docs.map(x => x.id);
    Soc.priatelia = Object.fromEntries(ids.map(f => [f, true]));
    ids.filter(f => !socPriatelia[f]).forEach(f => socSleduj(pid, f));
    Object.keys(socPriatelia).filter(f => !ids.includes(f)).forEach(f => { socPriatelia[f](); delete socPriatelia[f]; delete Soc.profily[f]; delete Soc.spravy[f]; });
    S.set('soc-caka-' + pid, S.get('soc-caka-' + pid, []).filter(x => !ids.includes(x.pid)));
    socObnov();
  }, znova));
}
function socSleduj(pid, f) {
  const a = onSnapshot(doc(db, 'profily', f), sn => { Soc.profily[f] = sn.exists() ? sn.data() : null; socObnov(); }, () => {});
  let prvy = true;
  const b = onSnapshot(query(collection(db, 'rozhovory', rozhovor(pid, f), 'spravy'), orderBy('kedy', 'desc'), limit(40)), sn => {
    const cas = m => m.kedy && m.kedy.toMillis ? m.kedy.toMillis() : Date.now();
    Soc.spravy[f] = sn.docs.map(x => { const m = x.data({ serverTimestamps: 'estimate' }); return { id: x.id, od: m.od, k: m.k, x: m.x, n: m.n, t: m.t, h: m.h, r: m.r, kedy: cas(m) }; }).reverse();
    // nová správa od priateľa, kým appka beží: upozornenie
    if (!prvy) sn.docChanges().filter(c => c.type === 'added' && c.doc.data().od === f).forEach(c => { if (typeof socNovaSprava === 'function') socNovaSprava(f); });
    prvy = false;
    socObnov();
  }, () => {});
  const c = onSnapshot(doc(db, 'rozhovory', rozhovor(pid, f), 'citane', f), sn => { const k = sn.exists() && sn.data({ serverTimestamps: 'estimate' }).kedy; Soc.citane[f] = k && k.toMillis ? k.toMillis() : 0; socObnov(); }, () => {});
  socPriatelia[f] = () => { a(); b(); c(); };
}
// verejný profil: len meno, postavička a pokrok z hry; body za týždeň = body - tyzStart (od pondelka)
function socData(kod, zapnute = true) {
  const p = Soc.profil, tk = tyzKluc(), body = Math.max(0, Math.round(st.body || 0));
  return {
    meno: (st.meno || 'Dieťa').slice(0, 20), avatar: { ...st.avatar }, body, seria: Math.min(5000, seria()), temy: Math.min(1000, st.done.filter(byId).length),
    odznaky: Math.min(500, st.odznaky.length), posledne: st.odznaky.slice(-5), tyzKey: tk,
    tyzStart: p && p.tyzKey === tk ? Math.min(p.tyzStart, body) : p ? Math.min(p.body, body) : body,
    kod, rodina: Cloud.pouzivatel.uid, zapnute, pisanie: !!(p && p.pisanie),
  };
}
function socUlozProfil() {
  if (!Soc.zapnute || !Soc.profil || Soc.pid !== st.dietaId || !Cloud.pouzivatel) return;
  const p = Soc.profil, d = socData(p.kod), o = JSON.stringify(d);
  if (o === socOtlacok) return;
  socOtlacok = o;
  const rovnake = ['meno', 'body', 'seria', 'temy', 'odznaky', 'tyzKey', 'tyzStart', 'pisanie'].every(k => p[k] === d[k]) && JSON.stringify(p.posledne) === JSON.stringify(d.posledne) && zoradene(p.avatar) === zoradene(d.avatar);
  if (rovnake) return; // bez zmeny nič nezapisujeme
  setDoc(doc(db, 'profily', Soc.pid), { ...d, upravene: serverTimestamp() }).catch(() => { socOtlacok = ''; });
}
function socZmaz(id) {
  getDoc(doc(db, 'profily', id)).then(async sn => {
    if (!sn.exists()) return;
    // najprv zmažeme priateľstvá na oboch stranách (kým profil ešte existuje a pravidlá to dovolia)
    try {
      const pr = await getDocs(collection(db, 'profily', id, 'priatelia'));
      await Promise.allSettled(pr.docs.map(x => { const b2 = writeBatch(db); b2.delete(doc(db, 'profily', id, 'priatelia', x.id)); b2.delete(doc(db, 'profily', x.id, 'priatelia', id)); return b2.commit(); }));
    } catch (e) { /* aj bez toho profil zmažeme */ }
    const b = writeBatch(db); b.delete(doc(db, 'profily', id)); if (sn.data().kod) b.delete(doc(db, 'kody', sn.data().kod));
    return b.commit();
  }).catch(() => {});
  if (Soc.pid === id) socZastav();
}
Object.assign(Soc, {
  async zapni() {
    const pid = st.dietaId;
    if (!pid || !Cloud.pouzivatel) throw 'Najprv sa prihláste.';
    for (let pokus = 0; pokus < 6; pokus++) {
      const kod = novyKod();
      if ((await getDoc(doc(db, 'kody', kod))).exists()) continue;
      const b = writeBatch(db);
      b.set(doc(db, 'profily', pid), { ...socData(kod), upravene: serverTimestamp() });
      b.set(doc(db, 'kody', kod), { pid, rodina: Cloud.pouzivatel.uid });
      try { await b.commit(); return true; } catch (e) { if ((e && e.code !== 'permission-denied') || pokus === 5) throw e; }
    }
    throw 'Kód sa nepodarilo vytvoriť, skúste znova.';
  },
  // rodič zapne alebo vypne voľné písanie (v správach naň musia mať povolenie obe deti)
  async pisanie(v) {
    const p = Soc.profil;
    if (!p) return;
    await setDoc(doc(db, 'profily', Soc.pid), { ...socData(p.kod), pisanie: !!v, upravene: serverTimestamp() });
  },
  async vypni() {
    const p = Soc.profil;
    if (!p) return;
    const b = writeBatch(db);
    b.set(doc(db, 'profily', Soc.pid), { ...socData('', false), upravene: serverTimestamp() });
    if (p.kod) b.delete(doc(db, 'kody', p.kod));
    await b.commit();
  },
  async ziadost(text) {
    const c = String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 8) throw 'Kód má 8 znakov, napríklad SOVA-K7M2.';
    const kod = c.slice(0, 4) + '-' + c.slice(4);
    if (Soc.profil && kod === Soc.profil.kod) throw 'To je tvoj vlastný kód.';
    const k = await getDoc(doc(db, 'kody', kod));
    if (!k.exists()) throw 'Taký kód neexistuje. Skontroluj ho.';
    const ciel = k.data().pid;
    if (ciel === Soc.pid) throw 'To je tvoj vlastný kód.';
    if (Soc.priatelia[ciel]) throw 'Už ste priatelia.';
    if (Soc.ziadosti.some(z => z.id === ciel)) { await Soc.prijmi(ciel); return 'priatelia'; } // kamarát už poslal žiadosť nám
    const cp = await getDoc(doc(db, 'profily', ciel));
    try {
      await setDoc(doc(db, 'profily', ciel, 'ziadosti', Soc.pid), { meno: (st.meno || 'Dieťa').slice(0, 20), avatar: { ...st.avatar }, rodina: Cloud.pouzivatel.uid, kedy: serverTimestamp() });
    } catch (e) { if (e && e.code === 'permission-denied') throw 'Žiadosť už čaká, alebo má kamarát priateľov vypnutých.'; throw e; }
    S.set('soc-caka-' + Soc.pid, [...S.get('soc-caka-' + Soc.pid, []).filter(x => x.pid !== ciel), { pid: ciel, meno: cp.exists() ? cp.data().meno : kod }]);
    return 'ziadost';
  },
  async prijmi(f) {
    const b = writeBatch(db);
    b.set(doc(db, 'profily', Soc.pid, 'priatelia', f), { kedy: serverTimestamp() });
    b.set(doc(db, 'profily', f, 'priatelia', Soc.pid), { kedy: serverTimestamp() });
    b.delete(doc(db, 'profily', Soc.pid, 'ziadosti', f));
    await b.commit();
  },
  odmietni: f => deleteDoc(doc(db, 'profily', Soc.pid, 'ziadosti', f)),
  async odober(f) {
    const b = writeBatch(db);
    b.delete(doc(db, 'profily', Soc.pid, 'priatelia', f));
    b.delete(doc(db, 'profily', f, 'priatelia', Soc.pid));
    await b.commit();
  },
  posli(f, m) {
    if (!Soc.priatelia[f]) return Promise.reject('Už nie ste priatelia.');
    return addDoc(collection(db, 'rozhovory', rozhovor(Soc.pid, f), 'spravy'), { od: Soc.pid, ...m, kedy: serverTimestamp() });
  },
  // pochvala témou všetkým priateľom naraz
  pochval(t, h) { return Promise.allSettled(Object.keys(Soc.priatelia).map(f => Soc.posli(f, { t, h }))).then(v => { if (v.length && !v.some(x => x.status === 'fulfilled')) throw 'Správa sa nikomu nedostala.'; return v; }); },
  // srdiečko na správu priateľa (druhé ťuknutie ho zruší)
  reaguj(f, id) {
    const m = (Soc.spravy[f] || []).find(x => x.id === id);
    if (!m || m.od === Soc.pid) return Promise.resolve();
    m.r = m.r ? undefined : 'srdce';
    return updateDoc(doc(db, 'rozhovory', rozhovor(Soc.pid, f), 'spravy', id), { r: m.r ? 'srdce' : deleteField() });
  },
  // „Videné“: zapíšeme, len keď pribudla nová správa od priateľa
  precitaj(f) {
    const m = (Soc.spravy[f] || []).filter(x => x.od === f).slice(-1)[0];
    if (!m || (socCitanie[Soc.pid + ':' + f] || 0) >= m.kedy) return;
    socCitanie[Soc.pid + ':' + f] = m.kedy;
    setDoc(doc(db, 'rozhovory', rozhovor(Soc.pid, f), 'citane', Soc.pid), { kedy: serverTimestamp() }).catch(() => { socCitanie[Soc.pid + ':' + f] = 0; });
  },
});
Cloud.soc = Soc;
