// Pravidlá prístupu pre priateľov (verzia 2.0) na emulátore Firestore (port 8180, projekt demo-svet-za-3-minuty).
// Spustenie: zdroj\spusti.cmd test:rules (sám spustí emulátor).
// Pozor: na začiatku vymaže dáta v emulátore (nie ostré dáta).
const fs = require('fs'), path = require('path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, setDoc, getDoc, getDocs, collection, writeBatch, addDoc, deleteDoc, updateDoc, deleteField, serverTimestamp, query, orderBy, limit } = require('firebase/firestore');

(async () => {
  const env = await initializeTestEnvironment({ projectId: 'demo-svet-za-3-minuty', firestore: { rules: fs.readFileSync(path.join(__dirname, '..', 'firestore.rules'), 'utf8'), host: '127.0.0.1', port: +(process.env.FIRESTORE_EMULATOR_HOST || ':8180').split(':').pop() } });
  await env.clearFirestore();
  const A = 'aaaa11', B = 'bbbb22', C = 'cccc33';
  await env.withSecurityRulesDisabled(async c => { for (const [u, id] of [['ua', A], ['ub', B], ['uc', C]]) await setDoc(doc(c.firestore(), 'rodiny', u, 'deti', id), { meno: 'X' }); });
  const fa = env.authenticatedContext('ua').firestore(), fb = env.authenticatedContext('ub').firestore(), fc = env.authenticatedContext('uc').firestore();
  const nik = env.unauthenticatedContext().firestore();
  const prof = (u, kod, zap = true) => ({ meno: 'Ema', avatar: { vlasy: 'kratke' }, body: 10, seria: 2, temy: 3, odznaky: 1, posledne: ['prva'], tyzKey: '2026-10-26', tyzStart: 5, kod, rodina: u, zapnute: zap, upravene: serverTimestamp() });
  const zapni = (f, u, id, kod) => { const b = writeBatch(f); b.set(doc(f, 'profily', id), prof(u, kod)); b.set(doc(f, 'kody', kod), { pid: id, rodina: u }); return b.commit(); };
  const ziadost = (f, u, od, komu) => setDoc(doc(f, 'profily', komu, 'ziadosti', od), { meno: 'Tomáš', avatar: {}, rodina: u, kedy: serverTimestamp() });
  const kedy = serverTimestamp(), rid = [A, B].sort().join('_'), rozh = f => collection(f, 'rozhovory', rid, 'spravy');
  const ok = [], zle = [];
  const t = async (nazov, sl, prejde) => { try { await (prejde ? assertSucceeds(sl) : assertFails(sl)); ok.push(nazov); } catch (e) { zle.push(nazov + ': ' + String(e.message).slice(0, 140)); } };

  await t('A zapne priateľov (profil + kód)', zapni(fa, 'ua', A, 'SOVA-AAAA'), true);
  await t('C nezapne priateľov za cudzie dieťa', zapni(fc, 'uc', B, 'DUHA-CCCC'), false);
  await t('C nezmení profil A', setDoc(doc(fc, 'profily', A), prof('uc', 'SOVA-AAAA')), false);
  await t('neprihlásený nečíta profil', getDoc(doc(nik, 'profily', A)), false);
  await t('C prečíta kód podľa presného kódu', getDoc(doc(fc, 'kody', 'SOVA-AAAA')), true);
  await t('C nevypíše všetky kódy', getDocs(collection(fc, 'kody')), false);
  await t('C nevypíše všetky profily', getDocs(collection(fc, 'profily')), false);
  await t('B zapne priateľov', zapni(fb, 'ub', B, 'DUHA-BBBB'), true);
  await t('C zapne priateľov', zapni(fc, 'uc', C, 'VLAK-CCCC'), true);
  await t('B pošle žiadosť A', ziadost(fb, 'ub', B, A), true);
  await t('B nepošle žiadosť druhýkrát', ziadost(fb, 'ub', B, A), false);
  await t('C nepošle žiadosť za B', ziadost(fc, 'uc', B, A), false);
  await t('A číta svoje žiadosti', getDocs(collection(fa, 'profily', A, 'ziadosti')), true);
  await t('C nečíta žiadosti A', getDocs(collection(fc, 'profily', A, 'ziadosti')), false);
  await t('C sa nepridá A za priateľa', setDoc(doc(fc, 'profily', A, 'priatelia', C), { kedy }), false);
  await t('B sa nepridá A za priateľa sám', setDoc(doc(fb, 'profily', B, 'priatelia', A), { kedy }), false);
  await t('B sa nezapíše do priateľov A sám', setDoc(doc(fb, 'profily', A, 'priatelia', B), { kedy }), false);
  { const b = writeBatch(fa); b.set(doc(fa, 'profily', A, 'priatelia', B), { kedy }); b.set(doc(fa, 'profily', B, 'priatelia', A), { kedy }); b.delete(doc(fa, 'profily', A, 'ziadosti', B));
    await t('A prijme žiadosť B (oboma smermi)', b.commit(), true); }
  await t('C nečíta priateľov A', getDocs(collection(fc, 'profily', A, 'priatelia')), false);
  await t('B pošle nálepku', addDoc(rozh(fb), { od: B, n: 'sova', kedy }), true);
  await t('A pošle hotovú vetu', addDoc(rozh(fa), { od: A, k: 'ahoj', kedy }), true);
  await t('neznáma veta neprejde', addDoc(rozh(fa), { od: A, k: 'nadavka', kedy }), false);
  await t('vlastný text neprejde', addDoc(rozh(fa), { od: A, k: 'ahoj', text: 'hocičo', kedy }), false);
  await t('nálepka aj veta naraz neprejde', addDoc(rozh(fa), { od: A, k: 'ahoj', n: 'sova', kedy }), false);
  await t('A nepíše za B', addDoc(rozh(fa), { od: B, n: 'sova', kedy }), false);
  await t('A číta rozhovor', getDocs(query(rozh(fa), orderBy('kedy', 'desc'), limit(40))), true);
  await t('B pošle tému s hviezdami', addDoc(rozh(fb), { od: B, t: 'farma', h: 3, kedy }), true);
  await t('téma so zlým id neprejde', addDoc(rozh(fb), { od: B, t: 'Zlé ID!', h: 3, kedy }), false);
  await t('téma so 7 hviezdami neprejde', addDoc(rozh(fb), { od: B, t: 'farma', h: 7, kedy }), false);
  { const m = await addDoc(rozh(fb), { od: B, n: 'srdce', kedy });
    await t('A dá srdiečko na správu B', updateDoc(doc(fa, 'rozhovory', rid, 'spravy', m.id), { r: 'srdce' }), true);
    await t('B nedá srdiečko na vlastnú správu', updateDoc(doc(fb, 'rozhovory', rid, 'spravy', m.id), { r: 'srdce' }), false);
    await t('A nezmení obsah správy B', updateDoc(doc(fa, 'rozhovory', rid, 'spravy', m.id), { n: 'sova' }), false);
    await t('C nedá srdiečko', updateDoc(doc(fc, 'rozhovory', rid, 'spravy', m.id), { r: 'srdce' }), false);
    await t('A zruší srdiečko', updateDoc(doc(fa, 'rozhovory', rid, 'spravy', m.id), { r: deleteField() }), true); }
  await t('A zapíše Videné', setDoc(doc(fa, 'rozhovory', rid, 'citane', A), { kedy }), true);
  await t('A nezapíše Videné za B', setDoc(doc(fa, 'rozhovory', rid, 'citane', B), { kedy }), false);
  await t('B číta Videné od A', getDoc(doc(fb, 'rozhovory', rid, 'citane', A)), true);
  await t('C nečíta Videné', getDoc(doc(fc, 'rozhovory', rid, 'citane', A)), false);
  await t('C nečíta rozhovor A a B', getDocs(rozh(fc)), false);
  await t('C nepíše do rozhovoru A a B', addDoc(rozh(fc), { od: C, n: 'sova', kedy }), false);
  await t('C nepíše A, keď nie sú priatelia', addDoc(collection(fc, 'rozhovory', [A, C].sort().join('_'), 'spravy'), { od: C, n: 'sova', kedy }), false);
  // postavička z cudzieho dokumentu sa vykresľuje do SVG: žiadne znaky mimo písmen, číslic a #
  const zlyAv = { vlasy: 'kratke', koza: '"/><img src=x onerror=alert(1)>' };
  await t('profil so škodlivou farbou postavičky neprejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), avatar: zlyAv }), false);
  await t('profil s textom namiesto farby neprejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), avatar: { koza: 'red' } }), false);
  await t('profil s číslom v postavičke neprejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), avatar: { vlasy: 5 } }), false);
  await t('profil s dlhou hodnotou postavičky neprejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), avatar: { vlasy: 'a'.repeat(40) } }), false);
  await t('profil s platnou postavičkou prejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), avatar: { vlasy: 'kratke', farbaVlasov: '#2B2240', koza: '#FFE0C7', pozadie: '#D6E6FF' } }), true);
  await t('žiadosť so škodlivou postavičkou neprejde', setDoc(doc(fb, 'profily', A, 'ziadosti', B), { meno: 'Tomáš', avatar: zlyAv, rodina: 'ub', kedy: serverTimestamp() }), false);
  await t('A zmení svoj profil', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), body: 50 }), true);
  await t('profil s e-mailom neprejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), email: 'x@y.sk' }), false);
  await t('vlastný text neprejde, kým ho rodič nezapol', addDoc(rozh(fa), { od: A, x: 'Ahoj kamarát', kedy }), false);
  await t('A zapne vlastný text', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), pisanie: true }), true);
  await t('vlastný text neprejde, keď ho zapol len jeden', addDoc(rozh(fa), { od: A, x: 'Ahoj kamarát', kedy }), false);
  await t('profil s pisanie nie bool neprejde', setDoc(doc(fb, 'profily', B), { ...prof('ub', 'DUHA-BBBB'), pisanie: 'ano' }), false);
  await t('B zapne vlastný text', setDoc(doc(fb, 'profily', B), { ...prof('ub', 'DUHA-BBBB'), pisanie: true }), true);
  await t('vlastný text prejde, keď je zapnutý obom', addDoc(rozh(fa), { od: A, x: 'Ahoj kamarát, ako sa máš?', kedy }), true);
  await t('prázdny text neprejde', addDoc(rozh(fa), { od: A, x: '', kedy }), false);
  await t('text nad 200 znakov neprejde', addDoc(rozh(fa), { od: A, x: 'a'.repeat(201), kedy }), false);
  await t('text s vetou naraz neprejde', addDoc(rozh(fa), { od: A, x: 'hm', k: 'ahoj', kedy }), false);
  await t('text nie je reťazec neprejde', addDoc(rozh(fa), { od: A, x: 5, kedy }), false);
  await t('A vypne vlastný text', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), pisanie: false }), true);
  await t('vlastný text neprejde po vypnutí', addDoc(rozh(fa), { od: A, x: 'Ahoj', kedy }), false);
  await t('hotová veta prejde aj bez písania', addDoc(rozh(fa), { od: A, k: 'ahoj', kedy }), true);
  await t('B vypne priateľov', setDoc(doc(fb, 'profily', B), prof('ub', '', false)), true);
  await t('vypnutému sa nepíše', addDoc(rozh(fa), { od: A, n: 'sova', kedy }), false);
  { const b = writeBatch(fa); b.delete(doc(fa, 'profily', A, 'priatelia', B)); b.delete(doc(fa, 'profily', B, 'priatelia', A)); await t('A odstráni priateľa B', b.commit(), true); }
  await t('stará rodina sa nezmenila (deti nečíta cudzí)', getDocs(collection(fc, 'rodiny', 'ua', 'deti')), false);
  { const av = { vlasy: 'kucery', farbaVlasov: '#B5713C', koza: '#FFE0C7', oci: 'mrk', usta: 'jazyk', okuliare: 'ziadne', tricko: '#FFD23F', vzor: 'pruhy', doplnok: 'ziadny', zvieratko: 'ziadne', kuzlo: 'ziadne', pozadie: '#FFE1E8' };
    const dt = { meno: 'Ema', vek: 'mladsi', avatar: av, body: 0, done: [], fav: [], dni: [], odznaky: [], kedy: {}, chyby: [], vybrate: [], poradie: Date.now(), verzia: 5, upravene: serverTimestamp() };
    await t('rodič uloží dieťa tak, ako ho posiela appka (poradie = Date.now)', setDoc(doc(fa, 'rodiny', 'ua', 'deti', 'dabc123xyz'), dt), true); }

  // ---- profil rodiča (3.5) ----
  const rp = (o = {}) => ({ meno: 'Mama', ikona: 'r2', pin: { sol: 'c29sc29sc29sc29s', hash: 'aGFzaGhhc2hoYXNoaGFzaGhhc2g=', iter: 100000 }, nastavenia: { hnitie: { aaaa11: false } }, verzia: 1, upravene: serverTimestamp(), ...o });
  const rd = (f, u, id = 'profil') => doc(f, 'rodiny', u, 'rodic', id);
  await t('rodič A vytvorí svoj profil', setDoc(rd(fa, 'ua'), rp()), true);
  await t('rodič A prečíta svoj profil', getDoc(rd(fa, 'ua')), true);
  await t('rodič A zmení profil', setDoc(rd(fa, 'ua'), rp({ meno: 'Otec', nastavenia: {} })), true);
  await t('cudzí C nečíta profil rodiča A', getDoc(rd(fc, 'ua')), false);
  await t('cudzí C nezapíše profil rodiča A', setDoc(rd(fc, 'ua'), rp()), false);
  await t('cudzí C nezmaže profil rodiča A', deleteDoc(rd(fc, 'ua')), false);
  await t('neprihlásený nečíta profil rodiča', getDoc(rd(nik, 'ua')), false);
  await t('neprihlásený nezapíše profil rodiča', setDoc(rd(nik, 'ua'), rp()), false);
  await t('iný dokument než profil neprejde', setDoc(rd(fa, 'ua', 'iny'), rp()), false);
  await t('profil rodiča s e-mailom neprejde', setDoc(rd(fb, 'ub'), rp({ email: 'x@y.sk' })), false);
  await t('zlá ikona neprejde', setDoc(rd(fb, 'ub'), rp({ ikona: 'r9' })), false);
  await t('prázdne meno neprejde', setDoc(rd(fb, 'ub'), rp({ meno: '' })), false);
  await t('meno nad 20 znakov neprejde', setDoc(rd(fb, 'ub'), rp({ meno: 'a'.repeat(21) })), false);
  await t('čistý PIN namiesto hashu neprejde', setDoc(rd(fb, 'ub'), rp({ pin: { sol: 'c29sc29sc29sc29s', hash: '1234', iter: 100000 } })), false);
  await t('PIN s cudzím poľom neprejde', setDoc(rd(fb, 'ub'), rp({ pin: { sol: 'c29sc29sc29sc29s', hash: 'aGFzaGhhc2hoYXNoaGFzaGhhc2g=', iter: 100000, pin: '1234' } })), false);
  await t('viac než 8 prepínačov neprejde', setDoc(rd(fb, 'ub'), rp({ nastavenia: { hnitie: Object.fromEntries(Array.from({ length: 9 }, (_, i) => ['d' + i, true])) } })), false);
  await t('nastavenia s cudzím poľom neprejdú', setDoc(rd(fb, 'ub'), rp({ nastavenia: { iny: 1 } })), false);
  await t('profil bez času servera neprejde', setDoc(rd(fb, 'ub'), rp({ upravene: new Date() })), false);
  await t('rodič A zmaže svoj profil', deleteDoc(rd(fa, 'ua')), true);

  // ---- Štatistiky pre vlastníka (4.5) ----
  const st = (o = {}) => ({ od: '2026-11-01', posledne: '2026-11-07', verzia: 60, nazov: '4.5', mladsi: 1, starsi: 0, email: 'rodic@example.com', temy: 3, done: ['farma'], fav: [], hry: ['pexeso'], ang: 2, priatelia: 0, dni: ['2026-11-07'], upravene: serverTimestamp(), ...o });
  const vl = env.authenticatedContext('uvlastnik', { email: 'kudela.alexo@gmail.com', email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
  const vlHeslo = env.authenticatedContext('ufalosny', { email: 'kudela.alexo@gmail.com', email_verified: true, firebase: { sign_in_provider: 'password' } }).firestore();
  const vlNeoverený = env.authenticatedContext('ufalosny2', { email: 'kudela.alexo@gmail.com', email_verified: false, firebase: { sign_in_provider: 'google.com' } }).firestore();
  const inyGoogle = env.authenticatedContext('uiny', { email: 'iny@gmail.com', email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
  const sd = (f, u) => doc(f, 'statistiky', u);
  await t('rodina A zapíše svoje štatistiky', setDoc(sd(fa, 'ua'), st()), true);
  await t('rodina B zapíše svoje štatistiky', setDoc(sd(fb, 'ub'), st({ mladsi: 0, starsi: 2 })), true);
  await t('rodina A zmení svoje štatistiky', setDoc(sd(fa, 'ua'), st({ temy: 4 })), true);
  await t('rodina B nezapíše štatistiky A', setDoc(sd(fb, 'ua'), st()), false);
  await t('neprihlásený nezapíše štatistiky', setDoc(sd(nik, 'ux'), st()), false);
  await t('štatistiky so zlým e-mailom neprejdú', setDoc(sd(fa, 'ua'), st({ email: 'nie e-mail' })), false);
  await t('vlastník zablokuje účet', setDoc(doc(vl, 'blokovani', 'ub'), { email: 'x@y.sk', kedy: serverTimestamp() }), true);
  await t('vlastník číta zoznam blokovaných', getDocs(collection(vl, 'blokovani')), true);
  await t('cudzí nezablokuje účet', setDoc(doc(inyGoogle, 'blokovani', 'ua'), { email: 'x@y.sk', kedy: serverTimestamp() }), false);
  await t('rodina nečíta zoznam blokovaných', getDocs(collection(fb, 'blokovani')), false);
  await t('zablokovaná rodina nezapíše štatistiky', setDoc(sd(fb, 'ub'), st()), false);
  await t('zablokovaná rodina nezapíše dieťa', setDoc(doc(fb, 'rodiny', 'ub', 'deti', B), { meno: 'X' }), false);
  await t('zablokovaná rodina nevytvorí kód', setDoc(doc(fb, 'kody', 'QQQQ-BBBB'), { pid: B, rodina: 'ub' }), false);
  await t('zablokovaná rodina nepošle správu', addDoc(rozh(fb), { od: B, n: 'sova', kedy }), false);
  await t('zablokovaná rodina stále číta svoje dáta', getDocs(collection(fb, 'rodiny', 'ub', 'deti')), true);
  await t('vlastník odblokuje účet', deleteDoc(doc(vl, 'blokovani', 'ub')), true);
  await t('odblokovaná rodina zapíše štatistiky', setDoc(sd(fb, 'ub'), st()), true);
  await t('štatistiky s menom neprejdú', setDoc(sd(fa, 'ua'), st({ meno: 'Ema' })), false);
  await t('štatistiky s cudzím poľom (telefón) neprejdú', setDoc(sd(fa, 'ua'), st({ telefon: '0900' })), false);
  await t('štatistiky so zlým dňom neprejdú', setDoc(sd(fa, 'ua'), st({ od: 'včera' })), false);
  await t('štatistiky bez času servera neprejdú', setDoc(sd(fa, 'ua'), st({ upravene: new Date() })), false);
  await t('rodina A nečíta svoje štatistiky', getDoc(sd(fa, 'ua')), false);
  await t('rodina B nevypíše štatistiky', getDocs(collection(fb, 'statistiky')), false);
  await t('neprihlásený nevypíše štatistiky', getDocs(collection(nik, 'statistiky')), false);
  await t('iný Google účet nevypíše štatistiky', getDocs(collection(inyGoogle, 'statistiky')), false);
  await t('účet s heslom a e-mailom vlastníka nevypíše štatistiky', getDocs(collection(vlHeslo, 'statistiky')), false);
  await t('neoverený e-mail vlastníka nevypíše štatistiky', getDocs(collection(vlNeoverený, 'statistiky')), false);
  await t('vlastník vypíše štatistiky', getDocs(collection(vl, 'statistiky')), true);
  await t('vlastník nezapíše cudzie štatistiky', setDoc(sd(vl, 'ua'), st()), false);
  await t('vlastník nečíta deti rodiny A', getDocs(collection(vl, 'rodiny', 'ua', 'deti')), false);
  await t('vlastník nečíta profil rodiča A', getDoc(rd(vl, 'ua')), false);
  await t('vlastník nečíta profily detí', getDocs(collection(vl, 'profily')), false);
  await t('vlastník nečíta správy', getDocs(rozh(vl)), false);
  await t('rodina A zmaže svoje štatistiky', deleteDoc(sd(fa, 'ua')), true);
  await t('rodina B nezmaže cudzie štatistiky', deleteDoc(sd(fb, 'ub2')), false);

  await env.clearFirestore(); await env.cleanup();
  console.log('Pravidlá: prešlo', ok.length, 'z', ok.length + zle.length);
  if (zle.length) { console.log('ZLYHALO:\n- ' + zle.join('\n- ')); process.exit(1); }
  process.exit(0);
})().catch(e => { console.error('CHYBA', e); process.exit(1); });
