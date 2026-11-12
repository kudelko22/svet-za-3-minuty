/* Týždeň a okruh (verzia 4.0): dáta a logiku dodáva objekt Tyzden (tyzden.js). */
const TY = () => Tyzden;
const tD = () => temaDna();
const okruhIk = o => { const v = o && o.ikona; if (!v) return ''; if (typeof v === 'function') return v(); return /^\s*</.test(v) ? v : (IK[v] || IK_KAT[v] || ''); };
function kartaTyzden() {
  const Ty = TY(), dni7 = Ty.dni(), s = seria(), vyb = Ty.okruhy().find(o => o.id === Ty.vybrany());
  return `<section class="card tyzden tyzden-karta" aria-label="Tento týždeň">
    <div class="row-h"><h2 class="h2" style="--hc:#FF9F1C">Tento týždeň</h2>
      <button class="okruh-tl" data-okruh-otvor aria-haspopup="dialog"><span class="okruh-tl-ik">${okruhIk(vyb)}</span>Okruh${vyb ? ': ' + esc(vyb.nazov) : ''}</button></div>
    <div class="week">${dni7.map((x, i) => { const bud = x['jeBudúci'];
      return `<button class="day${x.hotovo ? ' done' : ''}${x.jeDnes ? ' today' : ''}${bud ? ' budúci' : ''}" style="--d:${PASTEL[i]}" ${bud ? 'disabled aria-disabled="true"' : `data-tyz-den="${esc(x.datum)}"`}${x.jeDnes ? ' aria-current="date"' : ''} aria-label="${esc(x.den)} ${+x.datum.slice(8)}. ${+x.datum.slice(5, 7)}.${bud ? ', ešte zamknuté' : ', ukáž tému dňa'}">${esc(x.den)}<i>${x.hotovo ? STAR() : bud ? ii(IK.zamok) : +x.datum.slice(8)}</i></button>`; }).join('')}</div>
    <p class="tyzden-tip">Ťukni na deň a otvoríš jeho tému.</p>
    <button class="tyz-viac" data-tyz-prehlad aria-haspopup="dialog"><span class="tyz-viac-ik">${ii(IK.kalendar || STAR())}</span>Prehľad týždňa<i>›</i></button>
    <span class="streak${s ? '' : ' zhasnuta'}">${ii(IK.ohen)} ${s ? `${s} ${dni(s)} po sebe` : 'Začni sériu dnes'}</span>
    <div class="tyzden-strom" data-strom role="button" tabindex="0" aria-label="Strom múdrosti">${MINI_STROM}<span>Môj strom múdrosti: <b>${hnStupen() ? HN_TEXT[hnStupen()].n : STROM_STUPNE[stromStupen()].n}</b></span><i>›</i></div>
  </section>`;
}
/* Stromček v hornej lište Domova (4.2): tmavý a spiaci, kým dnešná téma nie je hotová; farebný, s hviezdičkami, keď je hotovo.
   Po ťuknutí sa z neho rozvinie okno s týždňom (karta Tento týždeň, Prehľad týždňa aj strom múdrosti). */
/* 4.4: ikona stromu v troch stavoch: rastie (zelený s plodmi), schne (žltý, ovisnutý, padá list), spí (tmavý, len v lište) */
const stromIkona = (stav, trieda = '') => stav === 'schne'
  ? `<svg class="${trieda}" viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#8A5A2B"/><circle cx="20" cy="18" r="13" fill="#E3B341"/><circle cx="14" cy="21" r="4" fill="#C9822B" stroke-width="1.8"/><circle cx="26" cy="15" r="3" fill="#B5651D" stroke-width="1.8"/></g><path class="ts-list" d="M31 22 q4 2 3 6 q-4 -1 -3 -6Z" fill="#C9822B" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></svg>`
  : `<svg class="${trieda}" viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#B5651D"/><circle cx="20" cy="18" r="13" fill="#4CD07D"/><circle cx="15" cy="16" r="3" fill="#FF5A5F" stroke-width="1.8"/><circle cx="25" cy="20" r="3" fill="#FFD23F" stroke-width="1.8"/></g></svg>`;
const stromTlacidlo = (hot, hn = 0) => hn ? stromIkona('schne') : hot
  ?`<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#B5651D"/><circle cx="20" cy="18" r="13" fill="#4CD07D"/><circle cx="15" cy="16" r="3" fill="#FF5A5F" stroke-width="1.8"/><circle cx="25" cy="20" r="3" fill="#FFD23F" stroke-width="1.8"/></g><path class="ts-i ts-i1" d="${HVIEZDA}" fill="#FFD23F" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" transform="translate(27 -1) scale(.6)"/><path class="ts-i ts-i2" d="${HVIEZDA}" fill="#FFD23F" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" transform="translate(0 3) scale(.5)"/></svg>`
  : `<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#7A6A63"/><circle cx="20" cy="18" r="13" fill="#6B7390"/></g><path d="M13 19 q2.4 2.4 4.8 0 M22.4 19 q2.4 2.4 4.8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><text x="29" y="9" font-size="9" font-weight="800" font-family="Baloo 2, Nunito, sans-serif" fill="${INK}" class="ts-z">z</text></svg>`;
const TyzStrom = {
  jeHotovo() { try { return st.kedy[tD().id] === key(new Date()); } catch (e) { return false; } },
  // tlačidlo v hornej lište: viditeľné len na Domove, mení sa podľa dnešnej témy
  maluj() {
    const b = document.getElementById('tyz-strom'); if (!b) return;
    const zap = st.faza === 'appka' && st.view === 'domov', hot = zap && this.jeHotovo();
    b.hidden = !zap; if (!zap) return;
    const hn = hnStupen() ? 1 : 0, s = seria(), k = (hot ? 'h' : 's') + hn + '-' + s;
    if (b.dataset.k !== k) {
      b.dataset.k = k; b.innerHTML = stromTlacidlo(hot, hn) + `<b class="ts-pocet">${s}</b>`; b.classList.toggle('hotovo', hot && !hn); b.classList.toggle('spi', !hot && !hn); b.classList.toggle('schne', !!hn);
      b.setAttribute('aria-label', (hn ? 'Strom schne. ' : '') + `Séria ${s} ${dni(s)}. ` + (hot ? 'Tento týždeň. Dnešná téma je hotová.' : 'Tento týždeň. Dnešná téma ešte čaká.'));
    }
  },
  obnov() { const k = document.querySelector('.tyzs-karta'); if (k) k.innerHTML = this.html(); },
  html() { return `${kartaTyzden()}<button class="btn wide ghost" data-tyzs-zavri>Zavrieť</button>`; },
  ukaz(od) {
    if (document.querySelector('.tyzs-okno')) return;
    const el = document.createElement('div');
    el.className = 'okruh-okno tyzs-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Tento týždeň');
    el.innerHTML = `<div class="okruh-karta tyzs-karta">${this.html()}</div>`;
    // karta vyrastie zo stromčeka: začne na jeho mieste a zmenšená
    const kar = el.firstElementChild;
    if (od && od.getBoundingClientRect) { const r = od.getBoundingClientRect(); kar.style.setProperty('--dx', (r.left + r.width / 2 - innerWidth / 2) + 'px'); kar.style.setProperty('--dy', (r.top + r.height / 2 - innerHeight / 2) + 'px'); }
    document.body.appendChild(el);
    const kl = e => { if (e.key === 'Escape' && !document.querySelector('.okruh-vyber, .tyz-okno')) zavri(); };
    const zavri = () => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => el.remove(), 300); };
    document.addEventListener('keydown', kl);
    el.addEventListener('click', e => {
      if (e.target.closest('[data-tyz-den]')) { zavri(); return; } // ďalej sa postará bežné ťuknutie na deň
      if (e.target === el || e.target.closest('[data-tyzs-zavri]')) { Zvuk.play('tap'); zavri(); }
    });
    Zvuk.play('whoosh'); Haptika.hraj('tuk');
    const p = el.querySelector('.day.today') || el.querySelector('.day:not([disabled])'); if (p) p.focus({ preventScroll: true });
  },
};
/* Pás stromu na Domove (4.4): vždy ukazuje stav stromu (rastie / schne) a len keď je čo povedať, aj jemnú pripomienku.
   Pripomienka: raz za deň, zavrie sa krížikom, nie pri precvičovaní a nie keď je dnešok hotový. */
const Pripomienka = {
  kluc: () => 'pripomienka-' + (st.dietaId || 'x'),
  text() {
    if (Precvic.teraz() || st.dni.includes(key(new Date())) || TyzStrom.jeHotovo() || S.get(this.kluc(), '') === key(new Date())) return '';
    const s = seria(), gap = dniOdPoslednej();
    if (s > 0) return `Tvoja séria ${s} ${dni(s)} padne, ak dnes nezahráš.`;
    if (hnStupen()) return 'Strom schne. Jedna téma ho hneď oživí.';
    if (hnitieZapnute() && st.dni.length && gap === 2) return 'Strom začne schnúť, ak dnes nezahráš.';
    return st.dni.length ? 'Dnes ešte nebola žiadna lekcia. Téma dňa čaká.' : '';
  },
  html() {
    const hn = hnStupen(), s = seria(), tx = this.text(); if (!tx) return ''; // pás je len pripomienka; stav stromu a počet dní ukazuje polkruh v lište
    const stav = hn ? 'Strom schne' : 'Strom rastie';
    const pod = tx || (hn ? HN_TEXT[hn].p : `${STROM_STUPNE[stromStupen()].n}${s ? `, séria ${s} ${dni(s)}` : ''}`);
    return `<div class="strom-pas${hn ? ' schne' : ''}${tx ? ' pripomienka' : ''}" data-strom role="button" tabindex="0" aria-label="Strom múdrosti. ${esc(stav)}. ${esc(pod)}">
      <span class="sp-ik">${stromIkona(hn ? 'schne' : 'rastie', 'sp-k')}</span><span class="sp-t"><b>${esc(stav)}</b><small>${esc(pod)}</small></span>
      ${tx ? `<button class="ib sp-x" data-prip-zavri aria-label="Zavrieť pripomienku">${IKO.zavriet}</button>` : '<i class="sp-sip">›</i>'}</div>`;
  },
  zavri(b) { S.set(this.kluc(), key(new Date())); Zvuk.play('tap'); const p = b.closest && b.closest('.strom-pas'); if (p) p.outerHTML = this.html(); },
};
const Okruh = {
  ukaz() {
    if (document.querySelector('.okruh-vyber')) return;
    const Ty = TY(), vyb = Ty.vybrany(), el = document.createElement('div');
    el.className = 'okruh-okno okruh-vyber'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Okruh týždňa');
    el.innerHTML = `<div class="okruh-karta"><div class="row-h"><h2 class="h2" style="--hc:#FF9F1C">Okruh týždňa</h2><button class="ib" data-okruh-zavri aria-label="Zavrieť">${IKO.zavriet}</button></div>
      <p class="muted">Vyber, o čom budú témy tento týždeň. Zmiešaný je od všetkého trochu.</p>
      <div class="okruh-mriezka">${Ty.okruhy().map(o => `<button class="okruh-volba" data-okruh-id="${esc(o.id)}" aria-pressed="${o.id === vyb}"><span class="okruh-ik">${okruhIk(o)}</span><b>${esc(o.nazov)}</b></button>`).join('')}</div>
      <button class="btn wide ghost" data-okruh-zavri>Zavrieť</button></div>`;
    document.body.appendChild(el);
    const kl = e => { if (e.key === 'Escape') zavri(); };
    const zavri = () => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => el.remove(), 250); };
    document.addEventListener('keydown', kl);
    el.addEventListener('click', e => {
      e.stopPropagation();
      const v = e.target.closest('[data-okruh-id]');
      if (v) { Zvuk.play('pop'); Ty.nastav(v.dataset.okruhId); zavri(); if (st.view === 'domov') render(true); TyzPrehlad.obnov(); TyzStrom.obnov(); return; }
      if (e.target === el || e.target.closest('[data-okruh-zavri]')) { Zvuk.play('tap'); zavri(); }
    });
    Zvuk.play('whoosh'); const p = el.querySelector('.okruh-volba[aria-pressed="true"]') || el.querySelector('.okruh-volba'); if (p) p.focus({ preventScroll: true });
  },
};
/* Prehľad týždňa (verzia 4.1 C): okno s dňami, stavmi, súčtami a prechodom na minulé týždne. */
const TyzPrehlad = {
  posun: 0, MAX: 12,
  /* najstarší deň, o ktorom vieme (dokončená téma alebo angličtina); bez neho história neexistuje */
  najstarsi() {
    const d = [...Object.values(st.kedy || {}), ...Object.keys(Ang.data().dni || {})].filter(x => typeof x === 'string' && /^\d{4}-\d\d-\d\d$/.test(x)).sort();
    return d[0] || null;
  },
  maPredosly() {
    const n = this.najstarsi(); if (!n || this.posun <= -this.MAX) return false;
    return Tyzden.dni(undefined, this.posun - 1)[6].datum >= n;
  },
  stav(x, n) { return x.hotovo ? 'hotovo' : x['jeBudúci'] ? 'buduci' : x.jeDnes ? 'dnes' : !n || x.datum < n ? 'pred' : 'zmeskane'; },
  zhrn(dni7, n) {
    const prebehlo = dni7.filter(x => this.stav(x, n) !== 'buduci' && this.stav(x, n) !== 'pred'), a = Ang.data().dni || {};
    return { hotovo: dni7.filter(x => x.hotovo).length, z: prebehlo.length, ang: dni7.filter(x => a[x.datum]).length };
  },
  html() {
    const Ty = TY(), p = this.posun, dni7 = Ty.dni(undefined, p), a = Ang.data().dni || {}, s = seria(), nej = this.najstarsi(), z = this.zhrn(dni7, nej);
    const okr = Ty.okruhy().find(o => o.id === (p === 0 ? Ty.vybrany() : Ty.okruhNa(dni7[0].datum))), d0 = dni7[0].datum, d6 = dni7[6].datum;
    const rozsah = `${+d0.slice(8)}. ${d0.slice(5, 7) !== d6.slice(5, 7) ? `${+d0.slice(5, 7)}. ` : ''}– ${+d6.slice(8)}. ${+d6.slice(5, 7)}.`;
    const nazovT = p === 0 ? 'Tento týždeň' : p === -1 ? 'Minulý týždeň' : `Pred ${-p} týždňami`;
    const riadky = dni7.map((x, i) => {
      const bud = x['jeBudúci'], t = byId(x.temaId), k = KAT[t.k], sv = this.stav(x, nej), aN = a[x.datum];
      const popis = { hotovo: 'Hotovo', dnes: 'Dnes', zmeskane: 'Zmeškané', pred: 'Pred začiatkom', buduci: 'Čoskoro' }[sv];
      const ikS = { hotovo: STAR(), dnes: IK.ohen, zmeskane: '', pred: '', buduci: IK.zamok }[sv];
      const vnut = `<span class="tp-datum"><b>${esc(x.den)}</b><small>${+x.datum.slice(8)}. ${+x.datum.slice(5, 7)}.</small></span>
        <span class="tp-ik" style="--c:${k.c}">${ikKat(t.k)}</span>
        <span class="tp-telo"><b class="tp-tema">${bud ? 'Téma dňa sa ukáže v ten deň' : esc(t.t)}</b>
          <span class="tp-stitky"><span class="tp-stitok s-${sv}">${ikS ? ii(ikS) : ''}${popis}</span>${bud || sv === 'pred' ? '' : `<span class="tp-stitok ${aN ? 's-hotovo' : 's-ang'}">${aN ? ii(IK.fajka) + ' Angličtina hotová' : 'Angličtina nebola'}</span>`}</span></span>
        <span class="tp-sip">${bud ? '' : '›'}</span>`;
      const angTl = !bud && !x.jeDnes && sv !== 'pred' && !aN ? `<button class="btn ghost tp-prec" data-tp-ang="${esc(x.datum)}">Angličtina z ${+x.datum.slice(8)}. ${+x.datum.slice(5, 7)}.: len na precvičenie</button>` : '';
      return bud ? `<div class="tp-den buduci" style="--i:${i}">${vnut}</div>`
        : `<button class="tp-den ${sv}" style="--i:${i}" data-tp-den="${esc(x.datum)}" aria-label="${esc(x.den)} ${+x.datum.slice(8)}. ${+x.datum.slice(5, 7)}., ${esc(t.t)}, ${popis}${x.jeDnes || x.hotovo ? '' : ', len na precvičenie'}">${vnut}</button>${angTl}`;
    }).join('');
    return `<div class="row-h"><h2 class="h2" style="--hc:#FF9F1C">Prehľad týždňa</h2><button class="ib" data-tp-zavri aria-label="Zavrieť">${IKO.zavriet}</button></div>
      <div class="tp-nav"><button class="tp-krok" data-tp-krok="-1" ${this.maPredosly() ? '' : 'disabled'} aria-label="Predošlý týždeň">‹</button>
        <div class="tp-nav-st"><b>${nazovT}</b><small>${rozsah}</small></div>
        <button class="tp-krok" data-tp-krok="1" ${p < 0 ? '' : 'disabled'} aria-label="Nasledujúci týždeň">›</button></div>
      <div class="tp-suctu" role="group" aria-label="Súčet týždňa">
        <div class="tp-sucet"><span class="tp-cis">${z.hotovo}<small> z ${z.z}</small></span><span>Témy dňa hotové</span></div>
        <div class="tp-sucet"><span class="tp-cis">${z.ang}<small> z ${z.z}</small></span><span>Angličtina</span></div>
        <div class="tp-sucet ${s ? '' : 'zhas'}"><span class="tp-cis">${s}<small> ${dni(s)}</small></span><span>Séria po sebe</span></div></div>
      <div class="tp-okruh"><span class="okruh-tl-ik">${okruhIk(okr)}</span><span>Okruh: <b>${okr ? esc(okr.nazov) : 'Zmiešaný'}</b></span>${p === 0 ? '<button class="btn ghost tp-zmen" data-tp-okruh>Zmeniť</button>' : ''}</div>
      <div class="tp-dni">${riadky}</div>
      ${nej || p ? '' : '<p class="muted tp-prazdno">Zatiaľ tu nie sú staršie týždne. Objavia sa, keď dokončíš prvé témy.</p>'}
      <button class="btn wide ghost" data-tp-zavri>Zavrieť</button>`;
  },
  obnov() { const k = document.querySelector('.tyz-karta'); if (k) k.innerHTML = this.html(); },
  ukaz() {
    if (document.querySelector('.tyz-okno')) return;
    this.posun = 0;
    const el = document.createElement('div');
    el.className = 'okruh-okno tyz-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Prehľad týždňa');
    el.innerHTML = `<div class="okruh-karta tyz-karta">${this.html()}</div>`;
    document.body.appendChild(el);
    const kl = e => { if (e.key === 'Escape' && !document.querySelector('.okruh-vyber')) zavri(); };
    const zavri = () => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => el.remove(), 250); };
    document.addEventListener('keydown', kl);
    el.addEventListener('click', e => {
      e.stopPropagation();
      const kr = e.target.closest('[data-tp-krok]'), den = e.target.closest('[data-tp-den]');
      if (kr && !kr.disabled) { Zvuk.play('tap'); this.posun = Math.min(0, this.posun + +kr.dataset.tpKrok); this.obnov(); return; }
      const an = e.target.closest('[data-tp-ang]');
      if (an) { zavri(); Ang.klik(an, { angPrec: an.dataset.tpAng }); return; }
      if (den) { Zvuk.play('pop'); zavri(); Tyzden.otvor(den.dataset.tpDen); return; }
      if (e.target.closest('[data-tp-okruh]')) { Zvuk.play('tap'); Okruh.ukaz(); return; }
      if (e.target === el || e.target.closest('[data-tp-zavri]')) { Zvuk.play('tap'); zavri(); }
    });
    Zvuk.play('whoosh');
  },
};
