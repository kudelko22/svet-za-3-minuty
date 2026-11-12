// Prihlásenie rodiča a profily detí vo Firebase (projekt svet-za-3-minuty).
// Každé dieťa má vlastný dokument rodiny/<uid>/deti/<id>: meno, vek, postavička a pokrok.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, connectAuthEmulator, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
  EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  initializeFirestore, getFirestore, connectFirestoreEmulator, persistentLocalCache,
  collection, doc, onSnapshot, getDoc, getDocFromServer, getDocs, setDoc, deleteDoc, serverTimestamp, query, orderBy, limit, writeBatch, addDoc, updateDoc, deleteField,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const lokalne = ['localhost', '127.0.0.1'].includes(location.hostname); // skúšanie na emulátore, nie ostré dáta
const naFirebase = location.hostname.endsWith('.web.app') || location.hostname.endsWith('.firebaseapp.com');
const app = initializeApp({
  apiKey: 'AIzaSyA3pvk0D072FJq0-i3Bwz-fo8Cyw7dHzfk',
  // na adrese z Firebase ide prihlásenie cez tú istú doménu, inak ho Safari na iPhone zablokuje
  authDomain: naFirebase ? location.hostname : 'svet-za-3-minuty.firebaseapp.com',
  projectId: lokalne ? 'demo-svet-za-3-minuty' : 'svet-za-3-minuty',
  storageBucket: 'svet-za-3-minuty.firebasestorage.app',
  messagingSenderId: '37427452834',
  appId: '1:37427452834:web:9ce1a6941d3e1396d570fb',
});
const auth = getAuth(app);
auth.languageCode = 'sk';
let db;
try { db = initializeFirestore(app, { localCache: persistentLocalCache() }); } catch (e) { db = getFirestore(app); }
if (lokalne) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9199', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8180);
}

const CHYBY = {
  'auth/invalid-credential': 'Nesprávny e-mail alebo heslo.',
  'auth/invalid-login-credentials': 'Nesprávny e-mail alebo heslo.',
  'auth/wrong-password': 'Nesprávne heslo.',
  'auth/user-not-found': 'Účet s týmto e-mailom neexistuje. Vráťte sa a ťuknite na Som tu nový.',
  'auth/invalid-email': 'E-mail nie je napísaný správne.',
  'auth/missing-email': 'Najprv napíšte e-mail.',
  'auth/missing-password': 'Napíšte heslo.',
  'auth/email-already-in-use': 'Tento e-mail už účet má. Vráťte sa a ťuknite na Mám účet.',
  'auth/weak-password': 'Heslo musí mať aspoň 6 znakov.',
  'auth/too-many-requests': 'Priveľa pokusov. Skúste to o chvíľu.',
  'auth/network-request-failed': 'Chýba internet. Skúste to, keď bude signál.',
  'auth/popup-closed-by-user': 'Okno s prihlásením sa zavrelo skôr, ako ste sa prihlásili.',
  'auth/cancelled-popup-request': 'Prihlásenie sa prerušilo, skúste znova.',
  'auth/unauthorized-domain': 'Na tejto adrese prihlásenie cez Google nejde. Otvorte svet-za-3-minuty.web.app.',
  'auth/operation-not-allowed': 'Tento spôsob prihlásenia ešte nie je zapnutý.',
  'rodic/nepotvrdene': 'Najprv potvrďte heslo účtu.',
  'rodic/zly-pin': 'PIN má mať 4 číslice.',
  'rodic/zly-udaj': 'Údaje rodiča nie sú správne.',
  'rodic/nie-je': 'Účet rodiča ešte nie je vytvorený.',
  'rodic/stary-pin': 'Starý PIN nesedí.',
  'auth/requires-recent-login': 'Najprv potvrďte heslo účtu.',
  'permission-denied': 'Cloud uloženie odmietol.',
  'unavailable': 'Cloud je teraz nedostupný, uloží sa neskôr.',
};
// ktorému poľu úvodu chyba patrí (ostatné idú pod formulár)
const POLE_CHYBY = {
  'auth/invalid-email': 'email', 'auth/missing-email': 'email', 'auth/user-not-found': 'email', 'auth/email-already-in-use': 'email',
  'auth/invalid-credential': 'heslo', 'auth/invalid-login-credentials': 'heslo', 'auth/wrong-password': 'heslo',
  'auth/missing-password': 'heslo', 'auth/weak-password': 'heslo',
};
const chybaText = e => CHYBY[e && e.code] || 'Niečo sa nepodarilo' + (e && e.code ? ' (' + e.code + ')' : '') + '.';
const noveId = () => 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const zoradene = o => o ? Object.keys(o).sort().map(k => k + '=' + o[k]).join(',') : '';
const otlacok = d => JSON.stringify([d.meno, d.vek, zoradene({ ...AV_ZAKLAD, ...d.avatar }), d.body || 0, d.done || [], d.fav || [], d.dni || [], d.odznaky || [], zoradene(d.kedy), d.chyby || [], d.vybrate || []]);
let odber = null, odberRodic = null, casovac = null;
// prihlásenie cez Google v appke na ploche odchádza na stránku Googlu a vracia sa späť (do 3 minút)
let dokoncujeGoogle = Date.now() - (S.get('presmerovanie', 0) || 0) < 180000;

// PIN rodiča: PBKDF2-SHA256 cez WebCrypto, v cloude je len soľ a hash (nikdy čistý PIN)
const b64 = u8 => btoa(String.fromCharCode(...u8)), z64 = t => Uint8Array.from(atob(t), c => c.charCodeAt(0));
async function hashPin(pin, sol, iter = 300000) {
  const s = sol ? z64(sol) : crypto.getRandomValues(new Uint8Array(16));
  const kluc = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bity = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: s, iterations: iter }, kluc, 256);
  return { sol: b64(s), hash: b64(new Uint8Array(bity)), iter };
}
// zápis celého profilu rodiča: zmeny sa spoja s existujúcim (meno, ikona, pin, nastavenia.hnitie)
async function zapisRodica(zmeny) {
  const C = Cloud, stare = C.rodic.profil;
  if (!C.pouzivatel) throw { code: 'auth/user-not-found' };
  if (!stare && !(zmeny.pin && zmeny.ikona)) throw { code: 'rodic/nie-je' };
  const sn = (stare && stare.nastavenia) || {}, zn = zmeny.nastavenia || {}, n = { ...sn, ...zn };
  if (sn.hnitie || zn.hnitie) {
    const h = { ...(sn.hnitie || {}), ...(zn.hnitie || {}) }, ids = C.deti.map(x => x.id); // zmazané deti sa z prepínačov vyradia (najviac 8 kľúčov)
    n.hnitie = Object.fromEntries(Object.entries(h).filter(([k]) => !ids.length || ids.includes(k)));
  }
  const p = { meno: zmeny.meno !== undefined ? String(zmeny.meno).trim().slice(0, 20) || 'Rodič' : stare.meno, ikona: zmeny.ikona || stare.ikona, pin: zmeny.pin || stare.pin, nastavenia: n, verzia: 1 };
  const z = setDoc(doc(db, 'rodiny', C.pouzivatel.uid, 'rodic', 'profil'), { ...p, upravene: serverTimestamp() });
  z.catch(() => {});
  // bez spojenia sa zápis nevyrieši: po 8 s to vzdáme (zápis ostane vo fronte a odíde, keď bude internet)
  await Promise.race([z, new Promise((_, no) => setTimeout(() => no({ code: 'unavailable' }), 8000))]);
  C.rodic.profil = p; C.rodic.nacitane = true;
  return true;
}

const Cloud = {
  pouzivatel: null, deti: [], nacitane: false, chyba: '', chybaNacitania: '', stavUlozenia: '', ticho: false, pracuje: '',
  // profil rodiča (rodiny/<uid>/rodic/profil), null kým ho rodič nevytvorí; prepotvrdene = čas posledného potvrdenia heslom účtu
  rodic: { nacitane: false, profil: null, prepotvrdene: 0 },
  dieta(id) { return this.deti.find(x => x.id === id) || null; },
  async rodicVytvor({ meno, ikona, pin }) {
    if (!/^\d{4}$/.test(String(pin))) throw { code: 'rodic/zly-pin' };
    const m = String(meno || '').trim().slice(0, 20) || 'Rodič';
    if (!/^r[1-6]$/.test(ikona)) throw { code: 'rodic/zly-udaj' };
    // profil sa nikdy neprepíše podľa lokálnej kópie: overí sa na serveri (jeden PIN nesmie prepísať druhý)
    if (!this.pouzivatel) throw { code: 'auth/user-not-found' };
    let uz;
    try { uz = (await getDocFromServer(doc(db, 'rodiny', this.pouzivatel.uid, 'rodic', 'profil'))).exists(); } catch (e) { throw { code: 'auth/network-request-failed' }; }
    if (uz) throw { code: 'rodic/uz-je' };
    return zapisRodica({ meno: m, ikona, pin: await hashPin(String(pin)), nastavenia: {} });
  },
  async rodicOverPin(pin) {
    const p = this.rodic.profil;
    if (!p || !p.pin || !/^\d{4}$/.test(String(pin))) return false;
    return (await hashPin(String(pin), p.pin.sol, p.pin.iter)).hash === p.pin.hash;
  },
  async rodicZmenPin(stary, novy) {
    if (!/^\d{4}$/.test(String(novy))) throw { code: 'rodic/zly-pin' };
    if (!await this.rodicOverPin(stary)) throw { code: 'rodic/stary-pin' };
    return zapisRodica({ pin: await hashPin(String(novy)) });
  },
  // potvrdenie heslom účtu (e-mailový účet: heslo; Google účet: okno Googlu, heslo netreba); platí 5 minút pre rodicObnovPin
  async rodicPrepotvrdHeslom(heslo) {
    const u = auth.currentUser;
    if (!u) throw { code: 'auth/user-not-found' };
    if (u.providerData.some(x => x.providerId === 'google.com')) { const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: 'login' }); await reauthenticateWithPopup(u, p); }
    else await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, String(heslo || '')));
    this.rodic.prepotvrdene = Date.now();
    return true;
  },
  // zabudnutý PIN: nový PIN bez starého, ale len krátko po rodicPrepotvrdHeslom
  async rodicObnovPin(novy) {
    if (!/^\d{4}$/.test(String(novy))) throw { code: 'rodic/zly-pin' };
    if (Date.now() - this.rodic.prepotvrdene > 300000) throw { code: 'rodic/nepotvrdene' };
    const r = await zapisRodica({ pin: await hashPin(String(novy)) });
    this.rodic.prepotvrdene = 0;
    return r;
  },
  // zmena mena, ikony alebo nastavení (nastavenia.hnitie sa spája s existujúcimi: { nastavenia: { hnitie: { <idDieťaťa>: false } } })
  async rodicUloz(zmeny) { return zapisRodica(zmeny || {}); },
  async rodicZmaz() {
    if (!this.pouzivatel) return false;
    // prepínače vädnutia z cloudu si necháme v telefóne, aby sa po zmazaní profilu nevrátili na predvolené
    const h = (this.rodic.profil && this.rodic.profil.nastavenia && this.rodic.profil.nastavenia.hnitie) || {};
    for (const k of Object.keys(h)) S.set('hnitie-' + k, h[k] !== false);
    await deleteDoc(doc(db, 'rodiny', this.pouzivatel.uid, 'rodic', 'profil'));
    this.rodic.profil = null; Rodic.zamkni();
    return true;
  },
  // zmena pokroku aktívneho dieťaťa: uložíme o chvíľu (viac zmien naraz = jeden zápis)
  naplanuj() {
    if (!this.pouzivatel || !st.dietaId) return;
    clearTimeout(casovac);
    this.stavUlozenia = 'Ukladá sa…'; obnovStav();
    casovac = setTimeout(ulozAktivne, 800);
  },
  ulozHned() { if (casovac) { clearTimeout(casovac); ulozAktivne(); } },
  async akcia(co, email, heslo, heslo2) {
    const prihlasuje = ['google', 'prihlas', 'registruj'].includes(co);
    if (this.pracuje) return; // už sa prihlasuje, ďalšie ťuknutie ignorujeme
    this.chyba = ''; this.chyby = {};
    // pred odoslaním skontrolujeme polia a chybu ukážeme pri tom poli, ktorého sa týka
    if (co === 'prihlas' || co === 'registruj') {
      const z = pokazenePolia(co, email, heslo, heslo2);
      if (Object.keys(z).length) { this.chyby = z; Zvuk.play('bad'); obnovPrihlasenie(Object.keys(z)[0]); return; }
    }
    if (prihlasuje) { this.pracuje = co; if (st.faza === 'prihlasenie') obnovPrihlasenie(''); }
    try {
      if (co === 'google') {
        const p = new GoogleAuthProvider();
        p.setCustomParameters({ prompt: 'select_account' });
        const naPloche = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
        const presmeruj = () => { S.set('presmerovanie', Date.now()); return signInWithRedirect(auth, p); };
        if (naPloche) await presmeruj();
        else {
          try { await signInWithPopup(auth, p); }
          catch (e) { if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) await presmeruj(); else throw e; }
        }
      } else if (co === 'prihlas') {
        await signInWithEmailAndPassword(auth, email, heslo);
      } else if (co === 'registruj') {
        await createUserWithEmailAndPassword(auth, email, heslo);
      } else if (co === 'zabudol') {
        if (!email) throw { code: 'auth/missing-email' };
        await sendPasswordResetEmail(auth, email);
        toast('Poslali sme vám e-mail na zmenu hesla.');
        return;
      } else if (co === 'odhlas') {
        this.ulozHned();
        Rodic.zamkni();
        await signOut(auth);
        toast('Odhlásené.');
        return;
      }
      Zvuk.play('ok');
    } catch (e) {
      const pole = POLE_CHYBY[e && e.code];
      if (pole && st.faza === 'prihlasenie') this.chyby = { [pole]: chybaText(e) }; else this.chyba = chybaText(e);
      Zvuk.play('bad');
    } finally {
      if (prihlasuje) this.pracuje = '';
      if (st.faza === 'prihlasenie') obnovPrihlasenie(Object.keys(this.chyby)[0]); // aj chyba zo „Zabudli ste heslo“ sa hneď ukáže
    }
  },
  vyber(id, pohlad = 'domov') {
    this.ulozHned();
    const d = this.deti.find(x => x.id === id);
    if (!d) return;
    Rodic.zamkni();
    nastavAktivne(d); noveOdznaky(); S.set('aktivne', id); socStart(id);
    zrusAktivity();
    Object.assign(st, { flow: null, faza: 'appka', view: pohlad });
    render(); scrollTo(0, 0);
  },
  // uloženie z tvorby postavičky (nové dieťa alebo úprava existujúceho)
  ulozDieta(u) {
    const id = u.id || noveId(), stare = this.deti.find(x => x.id === id);
    if (stare && maRodica() && !Rodic.jeOdomknute()) u.vek = stare.vek; // vek mení len odomknutý rodič
    const prazdne = { body: 0, done: [], fav: [], dni: [] };
    const zaklad = id === st.dietaId ? st : stare || (u.prve && staryOk() && (STARY.body || STARY.done.length) ? STARY : prazdne);
    if (u.prve) S.set('stary-hotovo', true);
    S.set('pokrok-hotovo-' + this.pouzivatel.uid, true);
    const d = {
      meno: u.meno.slice(0, 20), vek: u.vek, avatar: { ...u.avatar },
      body: Math.max(0, Math.round(zaklad.body || 0)), done: [...(zaklad.done || [])], fav: [...(zaklad.fav || [])], dni: (zaklad.dni || []).slice(-400), odznaky: [...(zaklad.odznaky || [])], kedy: { ...(zaklad.kedy || {}) }, chyby: [...(zaklad.chyby || [])], vybrate: [...(zaklad.vybrate || [])],
      poradie: stare ? stare.poradie : Date.now(),
    };
    if (stare) Object.assign(stare, d); else this.deti.push({ id, ...d });
    zapis(id, d); zapisStat();
    this.vyber(id, stare ? 'ja' : 'domov');
    // nové dieťa: Sovička ukáže appku; pri úplne novom účte rodičovi celú prehliadku
    if (!stare) { const rodic = this.novyUcet; this.novyUcet = false; setTimeout(() => Sprievodca.start(rodic ? SPR_RODIC : SPR_KROKY), 1500); }
  },
  zmazDieta(id) {
    Rodic.zamkni();
    S.set('pokrok-hotovo-' + this.pouzivatel.uid, true);
    this.deti = this.deti.filter(x => x.id !== id);
    deleteDoc(doc(db, 'rodiny', this.pouzivatel.uid, 'deti', id)).catch(e => toast('Nepodarilo sa odstrániť: ' + chybaText(e)));
    socZmaz(id);
    if (st.dietaId === id) { st.dietaId = null; S.set('aktivne', null); }
    st.faza = this.deti.length ? 'vyber' : 'tvorba';
    if (st.faza === 'tvorba') st.upravuje = noveUpravovanie(false);
    render(); toast('Profil je odstránený.');
  },
};
window.Cloud = Cloud;
// pokrok sa uloží hneď, keď appka ide do pozadia alebo sa zatvára (inak by sa zmena z posledných 0,8 s stratila)
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Cloud.ulozHned(); });
addEventListener('pagehide', () => Cloud.ulozHned());

