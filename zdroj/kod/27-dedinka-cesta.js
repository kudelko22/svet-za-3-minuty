/* 5.1 Moja dedinka: Cesta mesiaca, úlohy týždňa a truhličky (vzhľad a ovládanie; pravidlá a dáta sú v 25-dedinka-data.js, objekt `Dedinka`).
   Vstup z dedinky: drevený smerovník pri ceste (nie odznak) a truhlička, ktorá v dedinke stojí, kým čaká. Štýly: 62-dedinka-cesta.css.
   Oslavy podľa troch veľkostí z 5.0: malá (úloha splnená = tichý štítok), stredná (zastávka cesty, truhlička), veľká (zlatá zastávka na konci cesty). */
const CT_MESIACE = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'];
const krokyText = n => n + (n === 1 ? ' krok' : n >= 2 && n <= 4 ? ' kroky' : ' krokov');
const TRUHLA_FARBY = { drevo: ['var(--dv-drevo)', 'var(--dv-drevo-d)', 'var(--sun)'], striebro: ['#D5DCEA', '#8E9BB8', '#7A86A6'], zlato: ['#FFD25A', '#D9990B', '#FFF0B3'], vitaj: ['var(--dv-drevo)', 'var(--dv-drevo-d)', 'var(--coral)'] };

const DedCesta = {
  mes: null, // mesiac, ktorého cesta je práve na obrazovke (null = tento mesiac)
  // ---------- kresby ----------
  // truhlička okolo (0,0) = stred spodku; otv = veko odklopené (lúč svetla zvnútra)
  truhla(t, otv = false) {
    const [dr, tm, ok] = TRUHLA_FARBY[t] || TRUHLA_FARBY.drevo, zl = t === 'zlato' || t === 'striebro';
    return `<ellipse cx="3" cy="1" rx="44" ry="6" fill="var(--ink)" opacity=".16" stroke="none"/>
      <path d="M-36 -26h72v24a4 4 0 0 1-4 4h-64a4 4 0 0 1-4-4z" fill="${dr}"/>
      <path d="M-36 -26h72v7h-72z" fill="${tm}" opacity=".35" stroke="none"/><path d="M-20 -26v28M20 -26v28" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M-34 -8h68" stroke="${tm}" stroke-width="3.5" fill="none" opacity=".7"/>
      ${otv ? `<ellipse cx="0" cy="-28" rx="30" ry="8" fill="var(--sun-l)" stroke="none"/>` : ''}
      <g class="tr-veko"><path d="M-38 -26v-9a22 22 0 0 1 22-22h32a22 22 0 0 1 22 22v9z" fill="${dr}"/>
        <path d="M-36 -33a20 20 0 0 1 20-21h32" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/><path d="M-20 -26v-31M20 -26v-31" stroke-width="2" fill="none" opacity=".6"/>
        <path d="M-38 -30h76" stroke="${tm}" stroke-width="3.5" fill="none" opacity=".7"/></g>
      <rect x="-7" y="-33" width="14" height="14" rx="4" fill="${ok}"/><circle cx="0" cy="-27" r="2" fill="var(--ink)" stroke="none"/>
      ${t === 'vitaj' ? `<path d="M-6 -59c-7-6-16-3-14 4 6 2 12 0 14-4zM6 -59c7-6 16-3 14 4-6 2-12 0-14-4z" fill="var(--coral)"/>` : ''}
      ${zl ? `<path d="M-30 -48l2 4 4 .6-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.6z" fill="#fff" opacity=".7" stroke="none"/>` : ''}`;
  },
  truhlaSvg(t, otv = false) {
    return `<svg class="tr-svg${otv ? ' otv' : ''}" viewBox="-50 -66 100 76" aria-hidden="true"><g stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${this.truhla(t, otv)}</g></svg>`;
  },
  truhlaMeno: t => (DED_TRUHLY[t] || DED_TRUHLY.drevo).n,
  // kresba veci v rámčeku (medailón, karta výberu)
  vecSvg(id) { const k = dedKresba(id); return k ? dedinkaKresby.svg(k, { popis: '' }) : ''; },
  // ---------- scéna dedinky: smerovník a čakajúca truhlička ----------
  scena() {
    const v = [], d = typeof Dedinka !== 'undefined' ? Dedinka.ziskaj() : null; if (!d) return v;
    const s = Dedinka.cestaStav(), cak = Dedinka.cakajuTruhly(), t = cak.includes('zlato') ? 'zlato' : cak.includes('striebro') ? 'striebro' : cak.includes('drevo') ? 'drevo' : cak[0];
    const cakaOdmena = s ? s.dostupne : 0, X = DS_X;
    const smer = `<g transform="translate(${X + 84} 628) scale(.9)" stroke-width="2.4"><ellipse cx="6" cy="1" rx="30" ry="5" fill="var(--ink)" opacity=".16" stroke="none"/>
      <path d="M-3 0v-50h7v50z" fill="var(--dv-drevo-d)"/><path d="M-30 -62h70l12 11-12 11h-70a3 3 0 0 1-3-3v-16a3 3 0 0 1 3-3z" fill="var(--dv-drevo)"/>
      <path d="M-26 -57h60" stroke="var(--dv-biela)" stroke-width="2" opacity=".45"/>
      <text x="2" y="-46" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="13" fill="var(--dv-biela)" stroke="none">Cesta</text>
      <path d="M10 -33l3.200 6.500 7.100 1-5.200 5 1.300 7.100-6.400-3.400-6.400 3.400 1.300-7.100-5.200-5 7.100-1z" fill="var(--sun)" stroke-width="1.8" transform="translate(-4 -2)"/>
      ${cakaOdmena > 0 ? `<g transform="translate(46 -70)"><circle r="10" fill="var(--coral)" stroke-width="2.2"/><text y="4.2" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="12" fill="#fff" stroke="none">${cakaOdmena}</text></g>` : ''}</g>`;
    v.push({ y: 628, html: DedScena.tuk('cesta', `Cesta mesiaca${s ? ': ' + s.n : ''}${cakaOdmena ? ', čaká odmena' : ''}. Otvoriť`, smer) });
    if (t) v.push({ y: 618, html: DedScena.tuk('truhla', `${this.truhlaMeno(t)} čaká. Otvoriť`, `<g transform="translate(${X - 84} 618) scale(.78)"><g class="tr-v-dedinke">${this.truhla(t)}</g></g>`, ' ds-truhla') });
    return v;
  },
  klik(d) {
    if (d === 'cesta') { Zvuk.play('whoosh'); Prechod.spusti('Cesta mesiaca', () => { this.mes = null; st.view = 'cesta'; Render.nova = true; render(); scrollTo(0, 0); }); return true; }
    if (d === 'truhla') { const c = Dedinka.cakajuTruhly(); if (c.length) { Zvuk.play('pop'); this.otvor(c.includes('zlato') ? 'zlato' : c.includes('striebro') ? 'striebro' : c.includes('drevo') ? 'drevo' : c[0]); } return true; }
    return false;
  },
  // ---------- obrazovka Cesta mesiaca ----------
  nazovMesiaca(m) { return CT_MESIACE[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4); },
  odmenaInfo(o) { // { n: názov, ikona: html, truhla }
    if (o.typ === 'truhla') return { n: this.truhlaMeno(o.t), ikona: this.truhlaSvg(o.t), truhla: o.t };
    return { n: DED_VEC[o.id].n, ikona: this.vecSvg(o.id) };
  },
  html() {
    const d = Dedinka.ziskaj(), s = d && Dedinka.cestaStav(this.mes || undefined);
    const hore = `<button class="btn kruh dve ct-x" data-cesta-spat aria-label="Späť do dedinky">${ikn('zavriet')}</button>`;
    if (!s) return `<section class="ct" aria-label="Cesta mesiaca">${hore}<p class="ct-prazdno">Cesta sa pripravuje.</p></section>`;
    const dosl = Math.min(DED_ZASTAVOK, Math.floor(s.kroky / DED_KROKOV)), tento = s.mes === d.cesta.mes, proc = s.dalsia ? (DED_KROKOV - s.dalsia) / DED_KROKOV : 1;
    const ul = tento ? Dedinka.ulohy() : [], cak = Dedinka.cakajuTruhly(), staremesiace = tento ? Object.keys(d.cesta.min || {}).sort() : [];
    // stopy: medailóny na vlnovke zhora nadol; vyplnená časť cesty siaha po aktuálnu zastávku
    const R = 106, H = DED_ZASTAVOK * R + 56, px = i => 50 + [0, 22, 0, -22][i % 4], py = i => 52 + i * R;
    const body = Array.from({ length: DED_ZASTAVOK + 1 }, (_, i) => [i === 0 ? 50 : px(i - 1), i === 0 ? 14 : py(i - 1)]);
    const cesta = body.map((p, i) => { if (!i) return `M${p[0]} ${p[1]}`; const q = body[i - 1], m = (q[1] + p[1]) / 2; return `C${q[0]} ${m} ${p[0]} ${m} ${p[0]} ${p[1]}`; }).join('');
    const stopy = s.zastavky.map(z => {
      const o = this.odmenaInfo(z.odmena), stav = z.vzate ? 'vzate' : z.dost ? 'dost' : (z.i === dosl + 1 ? 'nasl' : 'caka');
      const popis = `Zastávka ${z.i}: ${o.n}. ${z.vzate ? 'Vyzdvihnuté' : z.dost ? 'Vyzdvihnúť' : 'Ešte ' + (z.i === dosl + 1 ? krokyText(s.dalsia) : 'nie')}`;
      return `<div class="ct-stop ${stav}${o.truhla ? ' ct-tr' : ''}" style="left:${px(z.i - 1)}%;top:${py(z.i - 1)}px">
        <button class="ct-med" data-cesta-stop="${z.i}" aria-label="${esc(popis)}"><span class="ct-ik">${o.ikona}</span>${z.vzate ? `<span class="ct-ok">${ikn('check')}</span>` : ''}</button>
        <span class="ct-n">${z.i}</span><span class="ct-nazov">${esc(o.n)}</span></div>`;
    }).join('');
    const uloha = u => `<li class="ct-ul${u.hotovo ? ' hotovo' : ''}"><span class="ct-ul-pip" aria-hidden="true">${u.hotovo ? ikn('check') : ''}</span><span class="ct-ul-n">${esc(u.n)}</span>
      <span class="ct-ul-p" aria-label="${u.postup} z ${u.ciel}">${Array.from({ length: u.ciel }, (_, i) => `<i class="${i < u.postup ? 'z' : ''}"></i>`).join('')}</span><span class="cena ct-ul-k">+${u.kroky}</span></li>`;
    return `<section class="ct${tento ? "" : " ct-stary"}" aria-label="Cesta mesiaca">
      <header class="ct-hlava">${hore}<h1 class="ct-nadpis">${esc(s.n)}</h1><p class="ct-mes">${this.nazovMesiaca(s.mes)}</p>
        <div class="ct-pas"><span class="ct-pas-v" style="width:${Math.round(proc * 100)}%"></span></div>
        <p class="ct-tx">${s.dalsia ? `Zastávka ${dosl} z ${DED_ZASTAVOK}. Ešte ${krokyText(s.dalsia)} do ďalšej.` : 'Cesta je prejdená.'}</p>
        <p class="ct-pozn">Každá získaná hviezda a každá splnená úloha je jeden krok. Nič nepadá, odmeny počkajú.</p>
        ${s.dostupne > 0 ? `<button class="btn wide ct-vezmi" data-cesta-vezmi>${s.dostupne === 1 ? 'Vyzdvihnúť odmenu' : 'Vyzdvihnúť odmenu (' + s.dostupne + ')'}${ikn('sipka', 'za')}</button>` : ''}
        ${cak.length && tento ? `<button class="btn wide dve ct-truhla" data-cesta-truhla><span class="ct-truhla-ik">${this.truhlaSvg(cak.includes('zlato') ? 'zlato' : cak.includes('striebro') ? 'striebro' : cak[0])}</span>Otvoriť truhličku${cak.length > 1 ? ' (' + cak.length + ')' : ''}</button>` : ''}
      </header>
      ${ul.length ? `<section class="ct-ulohy" aria-label="Úlohy týždňa"><h2 class="ct-h2">Úlohy týždňa</h2><ul>${ul.map(uloha).join('')}</ul></section>` : ''}
      ${staremesiace.length ? `<div class="ct-stare">${staremesiace.map(m => { const t = Dedinka.cestaStav(m); return t && t.dostupne > 0 ? `<button class="btn dve" data-cesta-mes="${m}">Z minulého mesiaca ti čakajú odmeny: ${esc(t.n)} (${t.dostupne})</button>` : ''; }).join('')}</div>` : ''}
      ${!tento ? `<div class="ct-stare"><button class="btn dve" data-cesta-mes="">Späť na tento mesiac</button></div>` : ''}
      <div class="ct-cesta" style="height:${H}px"><svg class="ct-vlnka" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true">
        <path d="${cesta}" class="ct-obrys"/><path d="${cesta}" pathLength="100" class="ct-zakl"/><path d="${cesta}" pathLength="100" class="ct-hotova" style="stroke-dasharray:${(Math.min(1, (dosl + proc) / DED_ZASTAVOK) * 100).toFixed(2)} 100"/></svg>${stopy}</div>
    </section>`;
  },
  po() {
    try {
      const e = document.querySelector('.ct-stop.dost, .ct-stop.nasl'); // posun na najbližšiu odmenu alebo zastávku
      if (e && e.getBoundingClientRect) setTimeout(() => { try { window.scrollTo(0, Math.max(0, e.getBoundingClientRect().top + window.pageYOffset - 300)); } catch (x) { /* test */ } }, 30);
    } catch (x) { /* test bez prehliadača */ }
  },
  spat() { Zvuk.play('whoosh'); Prechod.spusti('Moja dedinka', () => { st.view = 'dedinka'; Render.nova = true; render(); }); },
  // ---------- zastávka: vyzdvihnutie a oslava ----------
  vezmi(i) {
    const m = this.mes || undefined, r = Dedinka.cestaVezmi(i, m); if (!r.ok) return r;
    const o = r.odmena, zlata = o.typ === 'truhla' && o.t === 'zlato';
    render(); this.oslava({ i, o, r, zlata }); return r;
  },
  stop(i) {
    const s = Dedinka.cestaStav(this.mes || undefined), z = s && s.zastavky[i - 1]; if (!z) return;
    if (z.dost && !z.vzate) { this.vezmi(i); return; }
    Zvuk.play('tap'); const o = this.odmenaInfo(z.odmena);
    toast(z.vzate ? `${o.n}: už vyzdvihnuté.` : i === Math.floor(s.kroky / DED_KROKOV) + 1 ? `${o.n}: ešte ${krokyText(s.dalsia)}.` : `${o.n}: príde, keď sa dostaneš na zastávku ${i}.`);
  },
  vezmiVsetko() { const s = Dedinka.cestaStav(this.mes || undefined), z = s && s.zastavky.find(x => x.dost && !x.vzate); if (z) this.vezmi(z.i); },
  // stredná oslava (zlatá zastávka = veľká: viac lúčov a veľký zvuk); nič sa nehromadí, ďalšia počká v rade Oslavy
  oslava({ i, o, r, zlata }) {
    Oslavy.pridaj(() => {
      const el = document.createElement('div'), inf = this.odmenaInfo(o), truhla = o.typ === 'truhla', duplikat = !!r.hviezdy;
      el.className = 'os-stredna ct-oslava' + (zlata ? ' ct-velka' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Odmena zo zastávky ' + i + ': ' + inf.n);
      const luce = Array.from({ length: zlata ? 18 : 14 }, (_, k) => { const n = zlata ? 18 : 14, a = k * 360 / n * Math.PI / 180, b = (k * 360 / n + 12) * Math.PI / 180; return `<path d="M180 190L${(180 + 600 * Math.cos(a)).toFixed(0)} ${(190 + 600 * Math.sin(a)).toFixed(0)}L${(180 + 600 * Math.cos(b)).toFixed(0)} ${(190 + 600 * Math.sin(b)).toFixed(0)}z"/>`; }).join('');
      el.innerHTML = `<svg class="osr-luce" viewBox="0 0 360 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>${luce}</g></svg>
        <div class="osr-obsah"><div class="ct-os-vec" aria-hidden="true">${inf.ikona}</div>
        <section class="karta osr-karta"><span class="pec osr-stitok">Zastávka ${i}</span><h2 class="n0">${esc(inf.n)}!</h2>
          <p class="tx">${truhla ? (zlata ? 'Koniec cesty! Čaká ťa zlatá truhlička.' : 'Čaká ťa truhlička. Vyberieš si z troch vecí.') : duplikat ? 'Túto vec už máš, preto dostávaš 10 hviezd.' : 'Je v tvojom batohu.'}</p>
          ${duplikat ? `<span class="cena osr-cena">${ikn('hviezda')}+${r.hviezdy}</span>` : ''}
          ${truhla ? `<button class="btn wide" data-ct-os="otvor">Otvoriť${ikn('sipka', 'za')}</button><button class="btn wide dve" data-ct-os="zavri">Neskôr</button>` : `<button class="btn wide" data-ct-os="zavri">Zavrieť</button>`}</section></div>`;
      document.body.appendChild(el);
      Zvuk.play(zlata ? 'oslava-velka' : 'oslava-stredna'); vibruj(30); setTimeout(() => el.classList.add('dopadla'), 60);
      const kl = e => { if (e.key === 'Escape') zavri(); };
      const zavri = (potom) => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => { el.remove(); if (potom) potom(); else Oslavy.dalsia(); }, 300); };
      document.addEventListener('keydown', kl);
      el.addEventListener('click', e => {
        e.stopPropagation(); const b = e.target.closest('[data-ct-os]'); if (!b) return; Zvuk.play('tap');
        zavri(b.dataset.ctOs === 'otvor' ? () => { Oslavy.dalsia(); this.otvor(o.t); } : null);
      });
      const b = el.querySelector('[data-ct-os]'); if (b && b.focus) b.focus({ preventScroll: true });
    });
  },
  // malá oslava: úloha týždňa splnená, kroky pribudli (tichý štítok, žiadne okno)
  ulohaHotova(u) {
    try { Zvuk.play('oslava-mala'); toast(`Úloha splnená: ${u.n}. +${krokyText(u.kroky)} na ceste.`); } catch (e) { /* test bez prehliadača */ }
  },
  // ---------- truhlička: otvorenie a výber 1 z 3 (bez náhody) ----------
  // čaká a hojdá sa → ťuk: zatrasie sa, veko odskočí a lúče → 3 karty → výber potvrdí tlačidlo → vec skočí do batohu. Pri obmedzení pohybu len výber.
  otvor(t) {
    if (document.querySelector('.tr-okno')) return;
    const ponuka = Dedinka.truhlaNabidka(t); if (!ponuka.length || !Dedinka.cakajuTruhly().includes(t)) return;
    Oslavy.pridaj(() => {
      const el = document.createElement('div'); el.className = 'tr-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', this.truhlaMeno(t));
      const luce = Array.from({ length: 16 }, (_, k) => { const a = k * 22.5 * Math.PI / 180, b = (k * 22.5 + 10) * Math.PI / 180; return `<path d="M180 210L${(180 + 600 * Math.cos(a)).toFixed(0)} ${(210 + 600 * Math.sin(a)).toFixed(0)}L${(180 + 600 * Math.cos(b)).toFixed(0)} ${(210 + 600 * Math.sin(b)).toFixed(0)}z"/>`; }).join('');
      const hv = DED_TRUHLY[t].hviezdy;
      el.innerHTML = `<svg class="osr-luce tr-luce" viewBox="0 0 360 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>${luce}</g></svg>
        <button class="btn kruh dve tr-pozdejsie" data-tr="zavri" aria-label="Neskôr">${ikn('zavriet')}</button>
        <div class="tr-obsah"><h2 class="tr-n">${esc(this.truhlaMeno(t))}</h2><p class="tr-tx" id="tr-tx">Ťukni na truhličku.</p>
          <button class="tr-truhla" data-tr="otvor" aria-label="Otvoriť truhličku">${this.truhlaSvg(t)}${this.truhlaSvg(t, true).replace('tr-svg', 'tr-svg tr-otv')}</button>
          <div class="tr-karty" role="radiogroup" aria-label="Vyber si jednu vec">${ponuka.map((id, k) => `<button class="tr-karta" role="radio" aria-checked="false" data-tr-vec="${id}" style="--k:${k}">
            <span class="tr-karta-ik">${this.vecSvg(id)}</span><span class="tr-karta-n">${esc(DED_VEC[id].n)}</span></button>`).join('')}</div>
          <p class="tr-vysl" id="tr-vysl" aria-live="polite"></p>
          <div class="tr-akcie"><button class="btn wide" data-tr="vyber" disabled>Toto chcem${ikn('sipka', 'za')}</button></div>
          ${hv ? `<p class="tr-hv">${ikn('hviezda')}+${hv} hviezd navyše</p>` : ''}</div>`;
      document.body.appendChild(el); Zvuk.play('whoosh');
      let stav = 'caka', vyber = null;
      const zavri = () => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => { el.remove(); Oslavy.dalsia(); if (st.view === 'cesta' || st.view === 'dedinka') render(); }, 300); };
      const kl = e => { if (e.key === 'Escape' && stav !== 'hotovo') zavri(); };
      document.addEventListener('keydown', kl);
      const ukaz = () => { stav = 'vyber'; el.classList.add('vyber'); const x = el.querySelector('#tr-tx'); x.textContent = 'Vyber si jednu vec.'; };
      const otvorTruhlu = () => {
        if (stav !== 'caka') return; stav = 'otv';
        if (tiche) { el.classList.add('otvorena'); ukaz(); Zvuk.play('star'); return; }
        el.classList.add('tras'); Zvuk.play('tap');
        setTimeout(() => { el.classList.remove('tras'); el.classList.add('otvorena'); Zvuk.play('star'); vibruj(25); }, 520);
        setTimeout(ukaz, 1100);
      };
      el.addEventListener('click', e => {
        e.stopPropagation(); const k = e.target.closest('[data-tr-vec]'), b = e.target.closest('[data-tr]');
        if (k && stav === 'vyber') {
          vyber = k.dataset.trVec; Zvuk.play('pop');
          el.querySelectorAll('[data-tr-vec]').forEach(x => { const on = x === k; x.classList.toggle('vybrana', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
          const v = el.querySelector('[data-tr="vyber"]'); v.disabled = false; return;
        }
        if (!b) return; const a = b.dataset.tr;
        if (a === 'otvor') otvorTruhlu();
        else if (a === 'zavri') { if (stav !== 'hotovo') zavri(); else zavri(); }
        else if (a === 'vyber' && stav === 'vyber' && vyber) {
          const r = Dedinka.truhlaOtvor(t, vyber); if (!r.ok) { toast('Nepodarilo sa. Skús znova.'); return; }
          stav = 'hotovo'; Zvuk.play('dopad1'); vibruj(20);
          el.classList.add('hotovo'); el.querySelector('#tr-tx').textContent = 'Dobrý výber.';
          el.querySelector('#tr-vysl').textContent = `${DED_VEC[vyber].n} je v tvojom batohu.`;
          const v = el.querySelector('[data-tr="vyber"]'); v.disabled = false; v.innerHTML = 'Hotovo' + ikn('check'); v.setAttribute('data-tr', 'zavri');
          if (typeof Dedinka !== 'undefined' && Dedinka.cakajuTruhly().length) { const x = el.querySelector('.tr-hv'); if (x) x.textContent = 'Ďalšia truhlička ťa ešte čaká.'; }
        }
      });
      const b = el.querySelector('[data-tr="otvor"]'); if (b && b.focus) b.focus({ preventScroll: true });
    });
  },
};

document.addEventListener('click', e => {
  const t = e.target && e.target.closest && e.target.closest('[data-cesta-spat], [data-cesta-stop], [data-cesta-vezmi], [data-cesta-truhla], [data-cesta-mes]'); if (!t || Prechod.bezi) return;
  e.stopImmediatePropagation();
  if (t.hasAttribute('data-cesta-spat')) DedCesta.spat();
  else if (t.hasAttribute('data-cesta-stop')) DedCesta.stop(+t.dataset.cestaStop);
  else if (t.hasAttribute('data-cesta-vezmi')) DedCesta.vezmiVsetko();
  else if (t.hasAttribute('data-cesta-truhla')) { const c = Dedinka.cakajuTruhly(); if (c.length) DedCesta.otvor(c.includes('zlato') ? 'zlato' : c.includes('striebro') ? 'striebro' : c.includes('drevo') ? 'drevo' : c[0]); }
  else if (t.hasAttribute('data-cesta-mes')) { DedCesta.mes = t.dataset.cestaMes || null; Render.nova = true; render(); scrollTo(0, 0); }
}, true);
