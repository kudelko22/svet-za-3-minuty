// Účet rodiča (3.5), úloha B: obrazovky pred panelom (rodicTvorba, rodicPin, karta rodiča vo výbere).
// Používa len API z úlohy A: Cloud.rodic, Cloud.rodicVytvor/OverPin/PrepotvrdHeslom/ObnovPin, Rodic.odomkni/chod/jeOdomknute.
const RodicBrana = (() => {
  const IKONY = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'];
  const IKON_FARBA = { r1: '#FFE9A0', r2: '#CFD8FF', r3: '#C9F2D6', r4: '#FFD0DC', r5: '#FFE0B8', r6: '#D8F0FF' };
  const IKON_MENO = { r1: 'slnko', r2: 'mesiac', r3: 'strom', r4: 'srdce', r5: 'kľúč', r6: 'domček' };
  const POKUSOV = 5, PAUZA_MS = 30000;
  // kreslené ikony rodiča (bez emoji), rovnaký štýl ako IK
  const kresli = () => {
    if (typeof IK === 'undefined' || typeof IKS === 'undefined' || IK.rodic1) return;
    IK.rodic1 = IKS(`<g stroke="none" fill="#FF9F1C">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path transform="rotate(${a} 24 24)" d="M24 3 L28 11 L20 11Z"/>`).join('')}</g><circle cx="24" cy="24" r="12" fill="#FFD23F"/><path d="M19 25 Q24 30 29 25" fill="none"/><circle cx="20" cy="21" r="1.2" fill="#2B2B3A"/><circle cx="28" cy="21" r="1.2" fill="#2B2B3A"/>`);
    IK.rodic2 = IKS(`<path d="M30 5 C18 6 10 15 10 26 C10 37 19 44 29 43 C37 42 42 37 43 32 C34 36 22 30 22 19 C22 13 25 8 30 5Z" fill="#FFD23F"/><circle cx="38" cy="11" r="2" fill="#FFD23F"/><circle cx="42" cy="21" r="1.5" fill="#FFD23F"/>`);
    IK.rodic3 = IKS(`<rect x="21" y="30" width="7" height="14" rx="2" fill="#B5733A"/><circle cx="24" cy="20" r="14" fill="#2FBF71"/><circle cx="16" cy="25" r="8" fill="#38D07E"/><circle cx="32" cy="24" r="8" fill="#1E9A57"/><circle cx="21" cy="15" r="2" fill="#FF5A5F" stroke="none"/><circle cx="31" cy="27" r="2" fill="#FF5A5F" stroke="none"/>`);
    IK.rodic4 = IKS(`<path d="M24 42 C8 30 5 21 8 14 C12 6 21 7 24 14 C27 7 36 6 40 14 C43 21 40 30 24 42Z" fill="#FF5A5F"/><path d="M13 15 Q14 11 18 11" fill="none" stroke="#fff" stroke-width="2.5"/>`);
    IK.rodic5 = IKS(`<circle cx="15" cy="17" r="9" fill="#FFD23F"/><circle cx="15" cy="17" r="3.5" fill="#fff"/><path d="M22 24 L41 43 M33 35 L38 30 M38 40 L42 36" fill="none" stroke-width="4.5"/>`);
    IK.rodic6 = IKS(`<path d="M6 24 L24 7 L42 24Z" fill="#FF5A5F"/><rect x="11" y="24" width="26" height="19" rx="2" fill="#FFE9A0"/><rect x="20" y="30" width="9" height="13" rx="2" fill="#B5733A"/><rect x="31" y="9" width="5" height="9" fill="#B5733A"/>`);
    IK.pinZrus = IKS(`<path d="M16 10 H40 V38 H16 L5 24Z" fill="#fff"/><path d="M23 18 L33 30 M33 18 L23 30" fill="none"/>`);
  };
  const ikona = k => { kresli(); return (typeof IK !== 'undefined' && IK['rodic' + String(k || 'r1').slice(1)]) || ''; };
  const esc2 = s => (typeof esc === 'function' ? esc(s) : String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const kruh = k => `<span class="kruh-av rodic-kruh" style="--bg:${IKON_FARBA[k] || IKON_FARBA.r1}">${ikona(k)}</span>`;

  // stav v pamäti (nič sa neukladá)
  const S2 = { pin: '', chyb: 0, do: 0, zab: null, tv: null, pracuje: false, chyba: '', tik: 0 };
  const tvorba = () => S2.tv || (S2.tv = { meno: '', ikona: 'r1', krok: 'profil', pin1: '' });

  const stylInit = () => {
    if (document.getElementById('rodic-brana-css')) return;
    const s = document.createElement('style'); s.id = 'rodic-brana-css';
    s.textContent = `/* rodic-brana */
.dieta.rodic-novy { border-style: dashed; background: rgb(255 255 255 / .6); box-shadow: none; }
.rodic-kruh { display: grid; place-items: center; align-items: center; }
.rodic-kruh .ik { width: 62%; height: auto; }
.dieta .rodic-kruh { width: min(118px, 100%); aspect-ratio: 1; animation: tileBob 3s ease-in-out infinite; }
.rodic-ikony { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%; }
.rodic-ikony button { aspect-ratio: 1; border: 3px solid var(--ink); border-radius: 22px; background: var(--paper); display: grid; place-items: center; padding: 8px; box-shadow: var(--sh); transition: transform .1s; }
.rodic-ikony button[aria-pressed="true"] { background: var(--sun); transform: translateY(-3px) rotate(-3deg); }
.rodic-ikony button .ik { width: 100%; height: auto; }
.pin-bodky { display: flex; gap: 14px; justify-content: center; padding: 6px 0; }
.pin-bodky i { width: 22px; height: 22px; border-radius: 50%; border: 3px solid var(--ink); background: var(--paper); transition: transform .12s, background .12s; }
.pin-bodky i.plna { background: var(--blue); transform: scale(1.15); }
.pin-bodky.trasie { animation: shake .45s; }
.pin-bodky.trasie i { background: var(--bad-bg); border-color: var(--coral); }
.pin-klavesnica { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: min(300px, 100%); margin: 0 auto; }
.pin-klavesnica button { aspect-ratio: 1.25; border: 3px solid var(--ink); border-radius: 20px; background: var(--paper); box-shadow: var(--sh); font: 700 1.9rem/1 var(--f-display); color: var(--ink); display: grid; place-items: center; }
.pin-klavesnica button:active { transform: translateY(4px); box-shadow: 0 1px 0 var(--ink); background: var(--sun); }
.pin-klavesnica button:disabled { opacity: .45; }
.pin-klavesnica button .ik { width: 34px; height: 34px; }
.pin-klavesnica .prazdne { visibility: hidden; }
.rodic-pauza { margin: 0; color: #B4232A; font-weight: 800; }
.rodic-brana-kruh { width: 104px; }
.rodic-brana-kruh .rodic-kruh { width: 100%; aspect-ratio: 1; animation: tileBob 3s ease-in-out infinite; }
`;
    document.head.appendChild(s);
  };

  const bodky = () => `<div class="pin-bodky" id="pin-bodky" aria-label="Zadané číslice: ${S2.pin.length} z 4">${[0, 1, 2, 3].map(i => `<i class="${i < S2.pin.length ? 'plna' : ''}"></i>`).join('')}</div>`;
  const klavesnica = zam => {
    const dis = zam ? ' disabled' : '';
    return `<div class="pin-klavesnica" id="pin-klav">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button type="button" data-pin-cislo="${n}"${dis} aria-label="${n}">${n}</button>`).join('')}
    <button type="button" class="prazdne" tabindex="-1" aria-hidden="true"></button><button type="button" data-pin-cislo="0"${dis} aria-label="0">0</button>
    <button type="button" data-pin-zrus aria-label="Zmazať poslednú číslicu"${dis}>${(kresli(), IK.pinZrus)}</button></div>`;
  };
  const sovicka = poz => (typeof owl === 'function' ? `<div class="brana-owl">${owl(poz)}</div>` : '');
  const chybaP = () => `<p class="chyba" id="rodic-chyba"${S2.chyba ? '' : ' hidden'}>${esc2(S2.chyba)}</p>`;

  const chybaText = e => {
    const c = e && e.code;
    if (c === 'auth/wrong-password' || c === 'auth/invalid-credential' || c === 'auth/invalid-login-credentials') return 'Heslo nesedí. Skúste to znova.';
    if (c === 'auth/too-many-requests') return 'Príliš veľa pokusov. Počkajte chvíľu.';
    if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return 'Potvrdenie sa zrušilo.';
    if (c === 'auth/network-request-failed') return 'Chýba internet.';
    if (c === 'rodic/nepotvrdene') return 'Potvrdenie vypršalo, začnite znova.';
    return 'Niečo sa nepodarilo' + (c ? ' (' + c + ')' : '') + '.';
  };
  const zostava = () => Math.max(0, Math.ceil((S2.do - Date.now()) / 1000));

  // ---- obrazovky ----
  const rodicTvorba = () => {
    stylInit(); kresli();
    const t = tvorba();
    if (t.krok === 'profil') {
      return `<div class="brana">${sovicka('hi')}<h1 class="h1">Účet rodiča</h1>
        <p class="muted">Za PIN-om budú nastavenia a prehľad všetkých detí. Deti sa budú učiť ako doteraz.</p>
        <div class="card prof">
          <label class="lbl" for="rodic-meno">Meno (nepovinné)</label>
          <input id="rodic-meno" class="input" maxlength="20" placeholder="Rodič" autocomplete="off" value="${esc2(t.meno)}">
          <span class="lbl">Ikona</span>
          <div class="rodic-ikony">${IKONY.map(k => `<button type="button" data-rodic-ikona="${k}" aria-pressed="${t.ikona === k}" aria-label="${IKON_MENO[k]}">${ikona(k)}</button>`).join('')}</div>
        </div>
        <button class="btn wide cta" data-rodic-dalej>Ďalej: vymyslieť PIN</button>
        <button class="btn ghost wide" data-rodic-spat>Späť</button></div>`;
    }
    const druhy = t.krok === 'pin2';
    return `<div class="brana"><div class="rodic-brana-kruh">${kruh(t.ikona)}</div>
      <h1 class="h1">${druhy ? 'Ešte raz ten istý PIN' : 'Vymyslite si PIN'}</h1>
      <p class="muted">${druhy ? 'Zadajte ho znova, aby sme vedeli, že sedí.' : '4 číslice. Deti ho nesmú poznať.'}</p>
      ${bodky()}${chybaP()}${klavesnica(S2.pracuje)}
      <button class="btn ghost wide" data-rodic-spat>Späť</button></div>`;
  };

  const rodicPin = () => {
    stylInit(); kresli();
    const C = window.Cloud, p = C && C.rodic.profil;
    if (!p) return `<div class="brana">${sovicka('oops')}<h1 class="h1">Účet rodiča ešte nie je</h1><button class="btn wide" data-rodic-novy>Vytvoriť účet rodiča</button><button class="btn ghost wide" data-rodic-spat>Späť</button></div>`;
    const z = S2.zab;
    if (z) {
      const google = !!(C.pouzivatel && C.pouzivatel.providerData && C.pouzivatel.providerData.some(x => x.providerId === 'google.com'));
      if (z.krok === 'heslo') {
        return `<div class="brana">${sovicka('think')}<h1 class="h1">Zabudnutý PIN</h1>
          <p class="muted">${google ? 'Potvrďte cez Google, že ste to vy. Potom si vymyslíte nový PIN.' : 'Potvrďte heslom účtu <b>' + esc2(C.pouzivatel ? C.pouzivatel.email || '' : '') + '</b>. Potom si vymyslíte nový PIN.'}</p>
          <div class="card prof">${google ? '' : '<input id="rodic-heslo" class="input" type="password" placeholder="Heslo účtu" autocomplete="current-password" enterkeyhint="go">'}
            ${chybaP()}
            <button class="btn blue" data-rodic-over${S2.pracuje ? ' disabled' : ''}>${S2.pracuje ? '<span class="koliesko"></span>Chvíľku…' : google ? 'Potvrdiť cez Google' : 'Potvrdiť heslom'}</button></div>
          <button class="btn ghost wide" data-rodic-spat>Späť</button></div>`;
      }
      return `<div class="brana"><div class="rodic-brana-kruh">${kruh(p.ikona)}</div>
        <h1 class="h1">${z.krok === 'novy2' ? 'Ešte raz ten istý PIN' : 'Nový PIN'}</h1>
        <p class="muted">${z.krok === 'novy2' ? 'Zadajte ho znova.' : '4 číslice, ktoré si zapamätáte.'}</p>
        ${bodky()}${chybaP()}${klavesnica(S2.pracuje)}
        <button class="btn ghost wide" data-rodic-spat>Zrušiť</button></div>`;
    }
    const rem = zostava(), zam = rem > 0;
    return `<div class="brana"><div class="rodic-brana-kruh">${kruh(p.ikona)}</div>
      <h1 class="h1">${esc2(p.meno || 'Rodič')}</h1>
      <p class="muted" id="pin-pop">${zam ? '' : 'Zadajte PIN'}</p>
      <p class="rodic-pauza" id="pin-pauza"${zam ? '' : ' hidden'}>Príliš veľa omylov. Skúste to o ${rem} s.</p>
      ${bodky()}${chybaP()}${klavesnica(zam)}
      <button class="link center" data-rodic-zabudol>Zabudol som PIN</button>
      <button class="btn ghost wide" data-rodic-spat>Späť na výber</button></div>`;
  };

  // ---- výber dieťaťa ----
  const vyber = povodny => {
    const html = povodny();
    const C = window.Cloud;
    if (!C || !C.rodic || !C.rodic.nacitane) return html;
    stylInit(); kresli();
    const p = C.rodic.profil;
    const karta = p
      ? `<button class="dieta rodic-karta" data-rodic-vstup>${kruh(p.ikona)}<b>${esc2(p.meno || 'Rodič')}</b><small>PIN a prehľad</small></button>`
      : `<button class="dieta nove rodic-novy" data-rodic-novy><span class="plus">+</span><b>Vytvoriť účet rodiča</b><small>PIN a prehľad detí</small></button>`;
    let r = html.replace(/(<\/div>)(\s*<p class="muted">Účet rodiča)/, karta + '$1$2');
    if (r === html) r = html.replace('</h1>', '</h1>' + karta);
    if (p) r = r.replace(/\s*<button class="btn ghost wide" data-ucet="odhlas">Odhlásiť sa<\/button>/, ''); // odhlásenie je v rodičovskej zóne
    return r;
  };

  // ---- logika klávesnice ----
  const obnovBodky = () => {
    const b = document.getElementById('pin-bodky'); if (!b) return;
    [...b.children].forEach((e, i) => e.classList.toggle('plna', i < S2.pin.length));
  };
  const dolu = zap => { document.querySelectorAll('#pin-klav button').forEach(b => { if (!b.classList.contains('prazdne')) b.disabled = zap; }); };
  const zle = text => {
    S2.pin = ''; S2.chyba = text || '';
    const b = document.getElementById('pin-bodky'), c = document.getElementById('rodic-chyba');
    if (c) { c.textContent = S2.chyba; c.hidden = !S2.chyba; }
    if (b) {
      b.classList.remove('trasie'); void b.offsetWidth; b.classList.add('trasie');
      setTimeout(() => { b.classList.remove('trasie'); obnovBodky(); }, 450);
    }
    Zvuk.play('bad');
    if (navigator.vibrate) navigator.vibrate(60);
  };
  const tikPauza = () => {
    clearInterval(S2.tik);
    if (st.faza !== 'rodicPin' || S2.zab || zostava() <= 0) return;
    S2.tik = setInterval(() => {
      const rem = zostava(), p = document.getElementById('pin-pauza'), pop = document.getElementById('pin-pop');
      if (!p) { clearInterval(S2.tik); return; }
      if (rem > 0) p.textContent = `Príliš veľa omylov. Skúste to o ${rem} s.`;
      else { p.hidden = true; if (pop) pop.textContent = 'Zadajte PIN'; dolu(false); clearInterval(S2.tik); }
    }, 500);
  };

  async function pinHotovy() {
    const C = window.Cloud, pin = S2.pin;
    if (st.faza === 'rodicTvorba') {
      const t = tvorba();
      if (t.krok === 'pin1') { t.pin1 = pin; t.krok = 'pin2'; S2.pin = ''; S2.chyba = ''; render(); return; }
      if (pin !== t.pin1) { t.krok = 'pin1'; t.pin1 = ''; S2.pin = ''; S2.chyba = 'PIN-y sa nezhodujú. Skúste od začiatku.'; render(); return; }
      S2.pracuje = true; dolu(true);
      try {
        await C.rodicVytvor({ meno: t.meno.trim() || 'Rodič', ikona: t.ikona, pin });
        S2.tv = null; S2.pin = ''; S2.chyba = ''; S2.pracuje = false;
        Rodic.odomkni(); Rodic.chod('rodic');
      } catch (e) { S2.pracuje = false; dolu(false); zle(chybaText(e)); }
      return;
    }
    if (S2.zab) {
      const z = S2.zab;
      if (z.krok === 'novy1') { z.pin1 = pin; z.krok = 'novy2'; S2.pin = ''; S2.chyba = ''; render(); return; }
      if (pin !== z.pin1) { z.krok = 'novy1'; z.pin1 = ''; S2.pin = ''; S2.chyba = 'PIN-y sa nezhodujú. Skúste znova.'; render(); return; }
      S2.pracuje = true; dolu(true);
      try {
        await C.rodicObnovPin(pin);
        S2.zab = null; S2.pin = ''; S2.chyba = ''; S2.chyb = 0; S2.do = 0; S2.pracuje = false;
        Rodic.odomkni(); Rodic.chod('rodic');
      } catch (e) {
        S2.pracuje = false; S2.pin = ''; S2.chyba = chybaText(e);
        if (e && e.code === 'rodic/nepotvrdene') S2.zab = { krok: 'heslo' };
        render();
      }
      return;
    }
    // bežný vstup
    S2.pracuje = true; dolu(true);
    let ok = false;
    try { ok = await C.rodicOverPin(pin); } catch (e) { ok = false; }
    S2.pracuje = false;
    if (ok) { S2.chyb = 0; S2.do = 0; S2.pin = ''; S2.chyba = ''; Rodic.odomkni(); Rodic.chod('rodic'); return; }
    S2.chyb++;
    if (S2.chyb >= POKUSOV) { S2.chyb = 0; S2.do = Date.now() + PAUZA_MS; S2.pin = ''; S2.chyba = ''; Zvuk.play('bad'); render(); return; }
    dolu(false); zle('Zlý PIN. Zostáva pokusov: ' + (POKUSOV - S2.chyb));
  }

  function klik(b, d) {
    const C = window.Cloud;
    if (d.rodicVstup !== undefined) { S2.pin = ''; S2.chyba = ''; S2.zab = null; Zvuk.play('start'); Rodic.chod(Rodic.jeOdomknute() ? 'rodic' : 'rodicPin'); return true; }
    if (d.rodicNovy !== undefined) { S2.pin = ''; S2.chyba = ''; S2.tv = null; Zvuk.play('start'); Rodic.chod('rodicTvorba'); return true; }
    if (d.rodicSpat !== undefined) {
      Zvuk.play('whoosh'); S2.pin = ''; S2.chyba = '';
      if (st.faza === 'rodicTvorba' && S2.tv && S2.tv.krok !== 'profil') { S2.tv.krok = S2.tv.krok === 'pin2' ? 'pin1' : 'profil'; render(); return true; }
      S2.tv = null; S2.zab = null; S2.pracuje = false; Rodic.chod('vyber'); return true;
    }
    if (d.rodicIkona) {
      tvorba().ikona = d.rodicIkona; Zvuk.play('pop');
      document.querySelectorAll('.rodic-ikony button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      return true;
    }
    if (d.rodicDalej !== undefined) {
      const t = tvorba(), i = document.getElementById('rodic-meno'); if (i) t.meno = i.value;
      t.krok = 'pin1'; S2.pin = ''; S2.chyba = ''; Zvuk.play('pop'); render(); return true;
    }
    if (d.rodicZabudol !== undefined) { S2.zab = { krok: 'heslo' }; S2.pin = ''; S2.chyba = ''; render(); return true; }
    if (d.rodicOver !== undefined) {
      if (S2.pracuje) return true;
      const i = document.getElementById('rodic-heslo'), heslo = i ? i.value : '';
      S2.pracuje = true; S2.chyba = ''; render();
      C.rodicPrepotvrdHeslom(heslo)
        .then(() => { S2.pracuje = false; S2.zab = { krok: 'novy1' }; S2.pin = ''; render(); })
        .catch(e => { S2.pracuje = false; S2.chyba = chybaText(e); render(); });
      return true;
    }
    if (d.pinZrus !== undefined) { if (S2.pracuje) return true; S2.pin = S2.pin.slice(0, -1); Zvuk.play('tap'); obnovBodky(); return true; }
    if (d.pinCislo !== undefined) {
      if (S2.pracuje || S2.pin.length >= 4) return true;
      if (st.faza === 'rodicPin' && !S2.zab && zostava() > 0) return true;
      S2.pin += d.pinCislo; S2.chyba = '';
      const c = document.getElementById('rodic-chyba'); if (c) c.hidden = true;
      Zvuk.play('tap'); obnovBodky();
      if (S2.pin.length === 4) setTimeout(pinHotovy, 160);
      return true;
    }
    return false;
  }

  function po() {
    if (st.faza === 'rodicPin') tikPauza();
    const m = document.getElementById('rodic-heslo');
    if (m) m.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const b = document.querySelector('[data-rodic-over]'); if (b) b.click(); } });
    const n = document.getElementById('rodic-meno');
    if (n) n.addEventListener('input', () => { tvorba().meno = n.value; });
  }

  return { brany: { rodicTvorba, rodicPin }, vyber, klik, po };
})();
