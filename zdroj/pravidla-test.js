// Pravidlá prístupu pre priateľov (verzia 2.0) na emulátore Firestore (port 8180, projekt demo-svet-za-3-minuty).
// Spustenie: emulátor beží, potom node zdroj/pravidla-test.js. Knižnice berie z ../Metlina/node_modules (nič sa neinštaluje).
// Pozor: na začiatku vymaže dáta v emulátore (nie ostré dáta).
const fs = require('fs'), path = require('path');
const kniznica = m => require(require.resolve(m, { paths: [path.join(__dirname, '..', '..', 'Metlina')] }));
const { initializeTestEnvironment, assertSucceeds, assertFails } = kniznica('@firebase/rules-unit-testing');
const { doc, setDoc, getDoc, getDocs, collection, writeBatch, addDoc, serverTimestamp, query, orderBy, limit } = kniznica('firebase/firestore');

(async () => {
  const env = await initializeTestEnvironment({ projectId: 'demo-svet-za-3-minuty', firestore: { rules: fs.readFileSync(path.join(__dirname, '..', 'firestore.rules'), 'utf8'), host: '127.0.0.1', port: 8180 } });
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
  await t('C nečíta rozhovor A a B', getDocs(rozh(fc)), false);
  await t('C nepíše do rozhovoru A a B', addDoc(rozh(fc), { od: C, n: 'sova', kedy }), false);
  await t('C nepíše A, keď nie sú priatelia', addDoc(collection(fc, 'rozhovory', [A, C].sort().join('_'), 'spravy'), { od: C, n: 'sova', kedy }), false);
  await t('A zmení svoj profil', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), body: 50 }), true);
  await t('profil s e-mailom neprejde', setDoc(doc(fa, 'profily', A), { ...prof('ua', 'SOVA-AAAA'), email: 'x@y.sk' }), false);
  await t('B vypne priateľov', setDoc(doc(fb, 'profily', B), prof('ub', '', false)), true);
  await t('vypnutému sa nepíše', addDoc(rozh(fa), { od: A, n: 'sova', kedy }), false);
  { const b = writeBatch(fa); b.delete(doc(fa, 'profily', A, 'priatelia', B)); b.delete(doc(fa, 'profily', B, 'priatelia', A)); await t('A odstráni priateľa B', b.commit(), true); }
  await t('stará rodina sa nezmenila (deti nečíta cudzí)', getDocs(collection(fc, 'rodiny', 'ua', 'deti')), false);

  await env.clearFirestore(); await env.cleanup();
  console.log('Pravidlá: prešlo', ok.length, 'z', ok.length + zle.length);
  if (zle.length) { console.log('ZLYHALO:\n- ' + zle.join('\n- ')); process.exit(1); }
  process.exit(0);
})().catch(e => { console.error('CHYBA', e); process.exit(1); });
