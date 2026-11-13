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
  ? `<svg class="${trieda}" viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#8A5A3A"/><circle cx="20" cy="18" r="13" fill="#E3B341"/><circle cx="14" cy="21" r="4" fill="#C9822B" stroke-width="1.8"/><circle cx="26" cy="15" r="3" fill="#A66A3F" stroke-width="1.8"/></g><path class="ts-list" d="M31 22 q4 2 3 6 q-4 -1 -3 -6Z" fill="#C9822B" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></svg>`
  : `<svg class="${trieda}" viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#A66A3F"/><circle cx="20" cy="18" r="13" fill="#5BC56B"/><circle cx="15" cy="16" r="3" fill="#FF6A4D" stroke-width="1.8"/><circle cx="25" cy="20" r="3" fill="#FFC533" stroke-width="1.8"/></g></svg>`;
const stromTlacidlo = (hot, hn = 0) => hn ? stromIkona('schne') : hot
  ?`<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#A66A3F"/><circle cx="20" cy="18" r="13" fill="#5BC56B"/><circle cx="15" cy="16" r="3" fill="#FF6A4D" stroke-width="1.8"/><circle cx="25" cy="20" r="3" fill="#FFC533" stroke-width="1.8"/></g><path class="ts-i ts-i1" d="${HVIEZDA}" fill="#FFC533" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" transform="translate(27 -1) scale(.6)"/><path class="ts-i ts-i2" d="${HVIEZDA}" fill="#FFC533" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" transform="translate(0 3) scale(.5)"/></svg>`
  : `<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 37 V25 H23 V37Z" fill="#7A6A63"/><circle cx="20" cy="18" r="13" fill="#9C95C4"/></g><path d="M13 19 q2.4 2.4 4.8 0 M22.4 19 q2.4 2.4 4.8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><text x="29" y="9" font-size="9" font-weight="800" font-family="Grandstander, sans-serif" fill="${INK}" class="ts-z">z</text></svg>`;
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
      if (e.target === el || e.target.closest('[data-tyzs-zavri]')) { Zvuk.play('zavri'); zavri(); }
    });
    Zvuk.play('okno'); Haptika.hraj('tuk');
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
      if (e.target === el || e.target.closest('[data-okruh-zavri]')) { Zvuk.play('zavri'); zavri(); }
    });
    Zvuk.play('okno'); const p = el.querySelector('.okruh-volba[aria-pressed="true"]') || el.querySelector('.okruh-volba'); if (p) p.focus({ preventScroll: true });
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
      if (e.target === el || e.target.closest('[data-tp-zavri]')) { Zvuk.play('zavri'); zavri(); }
    });
    Zvuk.play('okno');
  },
};
/* ===== Domov 5.0: kreslená krajina, odkaz Múdrej, týždeň na Domove, odmena =====
   Krajina je jedno SVG 1200 × 330 zarovnané na stred a dole (na telefóne vidno stred 360, na širokom displeji celú šírku).
   Cesta vedie k cieľu dnešnej témy: cieľ sa mení podľa oblasti (sopka, hory, hrad, hvezdáreň, domček).
   Pohyblivé kúsky (oblaky, dym, hviezdy v noci) sú samostatné HTML prvky nad SVG, takže sa hýbu bez prekresľovania krajiny. */
const DOM_CIELE = { sopka: 'k sopke', hora: 'do hôr', hrad: 'k hradu', hvezdaren: 'ku hvezdárni', dom: 'k domčeku' };
const Domov = {
  ciel(t) {
    if (/sopk/i.test(t.id + ' ' + t.t)) return 'sopka';
    const k = t.k;
    if (['priroda', 'planeta', 'geografia', 'zvieratka', 'biologia', 'cas'].includes(k)) return 'hora';
    if (['historia', 'politika', 'dejiny', 'kultura', 'ekonomika'].includes(k)) return 'hrad';
    if (['veda', 'technika', 'vesmir', 'vynalezy'].includes(k)) return 'hvezdaren';
    return 'dom';
  },
  // cieľ cesty: stojí na zadných kopcoch okolo x 656, spodok schovajú stredné kopce
  cielSvg(c) {
    const ink = 'stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
    if (c === 'sopka') return `<path d="M588 268L645 164C649 157 663 157 667 164L724 268Z" fill="var(--sc-far2)"/><path d="M645 164C649 157 663 157 667 164L673 175C667 171 663 178 657 173C651 178 647 171 641 175Z" fill="var(--sc-lava)"/>`;
    if (c === 'hora') return `<path d="M664 268L694 190L740 268Z" fill="var(--sc-far2)" opacity=".75"/><path d="M579 268L652 150L740 268Z" fill="var(--sc-far2)"/><path d="M640 170L652 150L665 171L658 167L652 174L646 167Z" fill="var(--sc-snih)"/>`;
    if (c === 'hrad') return `<g ${ink}><rect x="644" y="168" width="24" height="36" fill="var(--sc-stavba)"/><path d="M639 170L656 145L673 170Z" fill="var(--sc-strecha)"/><path d="M656 145V134l10 4-10 4" fill="var(--sc-strecha)"/><rect x="652" y="178" width="8" height="11" rx="4" fill="var(--sc-okno)"/><path d="M626 230V200h60v30Z" fill="var(--sc-stavba)"/><path d="M626 200v-7h9v7M644 200v-7h9v7M659 200v-7h9v7M677 200v-7h9v7" fill="var(--sc-stavba)"/><path d="M650 230v-12a6 6 0 0 1 12 0v12Z" fill="var(--ink)"/></g>`;
    if (c === 'hvezdaren') return `<g ${ink}><path d="M654 182L680 160" stroke-width="7"/><path d="M630 202a26 26 0 0 1 52 0Z" fill="var(--violet-l)"/><path d="M650 202v-24M662 202v-24"/><rect x="632" y="202" width="48" height="28" fill="var(--sc-stavba)"/><path d="M650 230v-11a6 6 0 0 1 12 0v11Z" fill="var(--sc-okno)"/></g>`;
    return `<g ${ink}><rect x="668" y="174" width="9" height="16" fill="var(--sc-stavba)"/><path d="M627 200L656 172L685 200Z" fill="var(--sc-strecha)"/><rect x="634" y="198" width="44" height="32" fill="var(--sc-stavba)"/><path d="M642 230v-16h11v16Z" fill="var(--ink)"/><rect x="659" y="207" width="12" height="10" rx="2" fill="var(--sc-okno)"/></g>`;
  },
  krajina(t, hot) {
    const c = this.ciel(t), hora = c === 'sopka' || c === 'hora', [fx, fy] = hora ? [670, 216] : [694, 236];
    const strom = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3.5 2v-14h7v14z" fill="#A66A3F"/><circle cy="-25" r="16" fill="var(--sc-tree)"/><path d="M-8 -30q3-6 9-7" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/></g>`;
    const hv5 = (cx, cy, R) => { let d = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? R * .45 : R, a = -Math.PI / 2 + i * Math.PI / 5; d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); } return d + 'Z'; };
    const koniec = hora ? 'C652 230 660 224 657 214' : 'C651 236 656 234 657 232';
    const z = (tr, x, y, s2 = '') => `<i class="kr-z ${tr}" style="--x:${x}px;--y:${y}px;${s2}"></i>`;
    const mrak = (x, y, w, s) => `<i class="kr-z kr-mrak" style="--x:${x}px;--y:${y}px;--w:${w}px;--t:${s}s"><svg viewBox="-30 -22 60 34" aria-hidden="true"><ellipse cx="0" cy="4" rx="28" ry="10"/><circle cx="-10" cy="-3" r="11"/><circle cx="7" cy="-7" r="14"/></svg></i>`;
    const dym = c === 'sopka' ? [0, -2, -4].map(d => z('kr-d', -4, 150, `--d:${d}s`)).join('') : c === 'dom' ? [0, -3].map(d => z('kr-d mala', 72, 168, `--d:${d}s`)).join('') : '';
    const hviezdy = [[-140, 108], [-62, 172], [-30, 128], [34, 150], [78, 92], [150, 60], [-110, 60], [-480, 60], [-350, 140], [-270, 80], [280, 70], [380, 150], [500, 90], [550, 40]]
      .map(([x, y], i) => z('kr-hv', x, y, `--d:${(i % 8) * 1.5}s`)).join('');
    return `<div class="dom-krajina ciel-${c}${hot ? ' dosiahnuty' : ''}" aria-hidden="true">
      <svg viewBox="0 0 1200 330" preserveAspectRatio="xMidYMax slice">
        <circle cx="722" cy="128" r="27" fill="var(--sc-sun)"/>
        <circle class="len-noc" cx="711" cy="120" r="23" fill="var(--sc-sky)"/>
        <circle class="len-den" cx="722" cy="128" r="40" fill="none" stroke="var(--sc-sun)" stroke-width="5" stroke-dasharray=".1 12.5" stroke-linecap="round"/>
        <g class="kr-vz" style="--v:0"><path d="M0 236C90 214 180 210 270 226S420 216 470 228C520 208 570 206 620 220C650 212 680 210 720 216C760 204 800 206 840 222S980 210 1060 224S1160 220 1200 230V330H0Z" fill="var(--sc-far)"/>${this.cielSvg(c)}</g>
        <g class="kr-vz" style="--v:1"><path d="M0 250C140 228 300 236 420 262C480 232 550 238 610 256C670 274 730 246 780 240C900 226 1060 236 1200 252V330H0Z" fill="var(--sc-mid)"/>
          <g fill="none" stroke="var(--sc-path)" stroke-linecap="round"><path d="M596 334C606 300 690 300 696 280" stroke-width="26"/><path d="M696 280C702 262 646 258 650 242" stroke-width="17"/><path d="M650 242${koniec}" stroke-width="9"/></g>
          <path d="M596 334C606 300 690 300 696 280C702 262 646 258 650 242${koniec}" fill="none" stroke="var(--sc-pathdot)" stroke-width="3.5" stroke-dasharray=".1 9" stroke-linecap="round"/>
          <g stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M${fx} ${fy}V${fy - 26}"/><path d="M${fx} ${fy - 26}l17 6.5-17 6.5z" fill="var(--coral)"/></g>
          ${hot ? `<path class="kr-ciel-hv" d="${hv5(fx + 26, fy - 36, 11)}" fill="var(--sun)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>` : ''}</g>
        <g class="kr-vz" style="--v:2" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M-6 290C150 268 300 276 414 298C460 268 530 272 590 290C650 306 720 280 786 272C900 258 1060 264 1206 280V336H-6Z" fill="var(--sc-front)"/>${strom(300, 278, .9)}${strom(150, 282, .7)}${strom(1010, 266, .8)}${strom(1040, 270, .6)}</g>
      </svg>
      ${mrak(-30, 190, 58, 22)}${mrak(158, 186, 48, 27)}${mrak(-340, 110, 60, 31)}${mrak(360, 96, 52, 25)}${mrak(500, 170, 44, 29)}${mrak(-510, 180, 50, 24)}${dym}<span class="len-noc">${hviezdy}</span>
    </div>`;
  },
  vyraz(hot) { return hot ? (Misie.splnenaDnes() ? 'oslava' : 'radost') : hnStupen() ? 'povzbudenie' : 'ahoj'; },
  odkaz(t, hot) {
    const m = st.meno ? esc(st.meno) : '', ahoj = m ? `Ahoj, ${m}!` : 'Ahoj!';
    if (hot) return Misie.splnenaDnes() ? `Dnes je všetko hotové${m ? ', ' + m : ''}! Zajtra ideme ďalej.` : 'Výborne! Téma je hotová. Skúsiš aj misiu?';
    if (!st.dni.length) return `${ahoj} Som Múdra. Poď so mnou na prvú výpravu.`;
    if (hnStupen()) return `${ahoj} Poď, jedna téma strom hneď oživí.`;
    return `${ahoj} Dnes ideme ${DOM_CIELE[this.ciel(t)]}.`;
  },
  tyzden() {
    const Ty = TY(), dni7 = Ty.dni(), vyb = Ty.okruhy().find(o => o.id === Ty.vybrany()), hn = hnStupen();
    return `<section class="dom-tyz" aria-label="Tvoj týždeň">
      <div class="dom-nh"><h2 class="n2">Tvoj týždeň</h2><span class="btn maly dve dom-strom${hn ? ' schne' : ''}" data-strom role="button" tabindex="0">${ikn('strom')}${hn ? 'Strom schne' : 'Strom múdrosti'}</span></div>
      <div class="dom-dni">${dni7.map(x => {
        const bud = x['jeBudúci'], tr = x.hotovo ? 'hot' : x.jeDnes ? 'tu' : bud ? 'bud' : 'zme', dm = `${+x.datum.slice(8)}. ${+x.datum.slice(5, 7)}.`;
        const stav = x.hotovo ? 'hotovo' : x.jeDnes ? 'dnes' : bud ? 'ešte zamknuté' : 'ukáž tému dňa';
        return `<button class="dom-den ${tr}${x.jeDnes ? ' dnes' : ''}" ${bud ? 'disabled' : `data-tyz-den="${esc(x.datum)}"`}${x.jeDnes ? ' aria-current="date"' : ''} aria-label="${esc(x.den)} ${dm}, ${stav}"><i>${x.hotovo ? ikn('check') : x.jeDnes ? ikn('hviezda') : ''}</i>${x.jeDnes ? 'Dnes' : esc(x.den)}</button>`;
      }).join('')}</div>
      <div class="dom-okr"><button class="dom-okruh" data-okruh-otvor aria-haspopup="dialog"><span class="okruh-tl-ik">${okruhIk(vyb)}</span><span>Okruh týždňa: <b>${vyb ? esc(vyb.nazov) : 'Zmiešaný'}</b></span>${ikn('ceruzka')}</button>
        <button class="dom-preh" data-tyz-prehlad aria-haspopup="dialog">${ikn('kalendar')}Prehľad</button></div>
    </section>`;
  },
  odmena() {
    const o = dalsiaOdmena(), av = st.avatar;
    const obr = av ? `<span class="kruh-av dom-odm-av" style="--bg:${av.pozadie}">${postavicka(o ? { ...av, [o.k]: o.v } : av)}</span>` : `<span class="ikb dom-odm-av">${ikn('darcek')}</span>`;
    if (!o) return `<section class="karta dom-odmena"><span class="zal" style="--c:var(--teal)">Odmeny</span>${obr}<div><b>Všetko odomknuté!</b><small>Máš všetky odmeny pre postavičku.</small></div></section>`;
    const pred = ODMENY.filter(x => x.cena <= st.body).pop(), od = pred ? pred.cena : 0, pct = Math.max(4, Math.round((st.body - od) / (o.cena - od) * 100));
    return `<section class="karta dom-odmena"><span class="zal" style="--c:var(--teal)">Ďalšia odmena</span>${obr}<div><b>Ešte ${o.cena - st.body} ${ii(ikn('hviezda'))} a máš ${NAZVY_ODMIEN[o.kluc]}!</b><div class="pruh"><i style="width:${pct}%"></i></div><small class="cis">${st.body} z ${o.cena} ${ii(ikn('hviezda'))}</small></div></section>`;
  },
};
