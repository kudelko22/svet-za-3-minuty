/* Angličtina na každý deň: samostatný bonus. Denný kvízik (6 otázok, 2 až 3 minúty), nový každý deň z dát v anglictina.js.
   Bez tlaku: vynechaný deň nič nestojí, body sú raz za deň. */
const Ang = {
  kluc: () => 'ang-' + st.dietaId,
  data() { const d = S.get(this.kluc(), null); return d && d.dni ? d : { dni: {}, bodyDen: '', bezChyby: 0, skup: {} }; },
  sucet() { const d = this.data(); return { n: Object.keys(d.dni).length, bezChyby: d.bezChyby || 0 }; },
  splnenaDnes() { return !!this.data().dni[key(new Date())]; },
  rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; },
  mix(a, r) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  /* 6 otázok na daný deň; extra = ďalšie kolo navyše (bez bodov) */
  otazky(den, extra = 0, skup = '') {
    const mlad = st.vek !== 'starsi', W = ANG_SLOVA.filter(w => !mlad || w.u === 1), V = ANG_VETY.filter(v => !mlad || v.u === 1);
    let WG = W, VG = V;
    if (skup) {
      WG = W.filter(w => w.g === skup); if (WG.length < 4) WG = ANG_SLOVA.filter(w => w.g === skup); if (WG.length < 4) WG = W;
      VG = V.filter(v => v.g === skup); if (VG.length < 2) VG = ANG_VETY.filter(v => v.g === skup);
    }
    const sz = [...skup].reduce((a, c) => a * 7 + c.charCodeAt(0), 3) % 1000;
    const ws = this.mix(WG, this.rng(11 + sz)), vs = this.mix(VG, this.rng(23 + sz)), r = this.rng(den * 31 + extra * 977 + 5 + sz);
    const w = i => ws[(den * 4 + extra * 4 + i) % ws.length], v = i => vs[(den * 2 + extra * 2 + i) % vs.length];
    const vyber = (spravne, pool, f) => {
      const ine = this.mix(pool.filter(x => f(x) !== f(spravne)), r), dobre = [...ine.filter(x => x.g === spravne.g), ...ine.filter(x => x.g !== spravne.g)];
      const uniq = []; for (const x of dobre) if (!uniq.some(y => f(y) === f(x))) uniq.push(x);
      return this.mix([spravne, ...uniq.slice(0, 2)], r);
    };
    const slovo = (x, smer) => {
      const o = vyber(x, W, smer ? (y => y.sk) : (y => y.en)).map(y => smer ? y.sk : y.en);
      return smer ? { t: 'Čo znamená slovo', slovo: x.en, o, s: o.indexOf(x.sk), vys: `${x.en} znamená ${x.sk}. Čítaj ${x.cit}.` }
        : { t: 'Ako sa povie po anglicky', slovo: x.sk, o, s: o.indexOf(x.en), vys: `${x.sk} sa povie po anglicky ${x.en}. Čítaj ${x.cit}.` };
    };
    const veta = (x, medzera) => {
      const re = new RegExp('\\b' + x.v + '\\b', 'i');
      // farby, čísla, pocity a časové slová dávajú viac správnych odpovedí (I have a blue hat), tam sa medzera nepýta
      const viacOdpovedi = ['farby', 'cisla', 'pocity'].includes(x.g) || (x.g === 'cas' && !['week', 'wind', 'birthday'].includes(x.v));
      if (medzera && !viacOdpovedi && re.test(x.en)) {
        const sl = ANG_SLOVA.find(y => y.en === x.v && y.g === x.g) || { g: x.g, en: x.v }, zdroj = W.filter(y => y.g === x.g).length >= 3 ? W : ANG_SLOVA, o = vyber(sl, zdroj, y => y.en).map(y => y.en);
        return { t: 'Doplň chýbajúce slovo', slovo: x.en.replace(re, '_____'), o, s: o.indexOf(x.v), vys: `${x.en} znamená: ${x.sk}` };
      }
      const o = this.mix([x, ...this.mix(V.filter(y => y.sk !== x.sk), r).slice(0, 2)], r).map(y => y.sk);
      return { t: 'Čo znamená veta', slovo: x.en, o, s: o.indexOf(x.sk), vys: `${x.en} znamená: ${x.sk}` };
    };
    const vt = (i, m) => vs.length >= 2 ? veta(v(i), m) : slovo(w(4 + i), i === 0);
    return [slovo(w(0), true), slovo(w(1), false), vt(0, den % 2 === 0), slovo(w(2), (den + 1) % 2 === 0), vt(1, den % 2 === 1), slovo(w(3), false)];
  },
  nova(nahliad, extra = 0, skup = '', den = null, precvic = false) { return { skup, qs: this.otazky(den == null ? denCislo() : den, extra, skup), i: 0, zle: [], chyby: 0, spravne: false, koniec: null, nahliad: !!nahliad || !!precvic, precvic: !!precvic }; },
  body: ch => ch > 2 ? 5 : 8,
  dokonci() {
    const q = st.ang, dnes = key(new Date()), d = this.data(), pred = st.body;
    let zisk = 0;
    if (q.precvic) {
      q.koniec = Precvic.prazdne(); Zvuk.play('ok'); render(); scrollTo(0, 0); return;
    }
    if (q.skup) { d.skup = d.skup || {}; const z = d.skup[q.skup] || { n: 0 }; d.skup[q.skup] = { n: z.n + 1, ch: q.chyby }; S.set(this.kluc(), d); }
    if (!q.nahliad && d.bodyDen !== dnes) { zisk = this.body(q.chyby); d.bodyDen = dnes; pripisBody(zisk); }
    if (!q.nahliad) { d.dni[dnes] = { ch: q.chyby }; if (!q.chyby) d.bezChyby = (d.bezChyby || 0) + 1; S.set(this.kluc(), d); }
    const odznaky = noveOdznaky('anglictina');
    q.koniec = { zisk, noveOdznaky: odznaky, noveOdmeny: noveOdmeny(pred, st.body), noveHry: noveHry(pred, st.body) };
    Zvuk.play('win'); vibruj([40, 30, 40]); FX.burst(innerWidth / 2, innerHeight / 3, 30, ['star', 'dot']);
    paintHead(); render(); scrollTo(0, 0);
  },
  ikSkup: g => ({ zvierata: IK.labka, jedlo: IK_KAT.zivot, domov: IK_KAT.domacnost, skola: IK.kniha, telo: IK_KAT.telo, farby: IK.duha, cisla: IK_KAT.tvary, slovesa: IK.gamepad, priroda: IK_KAT.priroda, ludia: IK.rodina, mesto: IK_KAT.doprava, cas: IK_KAT.cas })[g] || IK_KAT.anglictina,
  farbaSkup: ['#FFE0EC', '#FFF1C9', '#D9F2FF', '#E7F9EC', '#EADCFF', '#FFE3BD'],
  karta() {
    const ok = this.splnenaDnes();
    // 5.0: nálepka na Domove vedľa Objavuj (trieda ang-karta ostáva, ukazuje na ňu sprievodca)
    return `<button class="nalepka ang-karta${ok ? ' hotova' : ''}" data-go="anglictina" style="--c:var(--sky-l)"><span class="ikb">${ikn('bublina')}</span><b>Angličtina</b><small>${ok ? 'Dnes hotovo, môžeš znova' : 'Dnešné slovíčka, 2 až 3 minúty'}</small>${ok ? `<span class="nal-ok" aria-label="Hotovo">${ikn('check')}</span>` : ''}</button>`;
  },
  kvizKarta(ik, nazov, pocet, hotovo, atr, i, farba) {
    return `<button class="ang-kv${hotovo ? ' hotova' : ''}" ${atr} style="--i:${i};--c:${farba}"><span class="ang-ik">${ik}</span>
      <span class="ang-kv-t"><b>${esc(nazov)}</b><small>${pocet} otázok</small></span>${hotovo ? `<span class="badge ok" aria-label="Hotovo">✓</span>` : '<span class="badge new">Nové</span>'}</button>`;
  },
  hub() {
    const ok = this.splnenaDnes(), s = this.sucet(), lek = ANGT(), d = this.data(), sk = d.skup || {};
    const sk1 = Object.keys(ANG_SKUPINY).filter(g => ANG_SLOVA.some(w => w.g === g));
    let n = 1;
    return `<div class="hra-top"><button class="ib" data-go="domov" aria-label="Späť domov">${IKO.zavriet}</button><h1 class="h1 hra-nazov">Angličtina</h1></div>
      <p class="muted">Vyber si kvíz. Keď ho nestihneš, nič sa nestane, zajtra príde nový denný kvízik.</p>
      <section class="sec"><h2 class="h2">Kvízy</h2><div class="ang-kvizy">
        ${this.kvizKarta(IK_KAT.anglictina, 'Kvízik dňa', 6, ok, 'data-ang-start', n++, '#FFE0EC')}
        ${sk1.map((g, j) => this.kvizKarta(this.ikSkup(g), ANG_SKUPINY[g], 6, !!sk[g], `data-ang-skup="${g}"`, n++, this.farbaSkup[j % this.farbaSkup.length])).join('')}
      </div></section>
      <section class="sec"><h2 class="h2">Môj postup</h2>
        <div class="ang-stats"><div class="card mini" style="--c:#FFE0EC"><b>${s.n}</b><small>${s.n === 1 ? 'kvízik' : s.n > 1 && s.n < 5 ? 'kvíziky' : 'kvízikov'}</small></div>
        <div class="card mini" style="--c:#E7F9EC"><b>${s.bezChyby}</b><small>bez chyby</small></div></div></section>
      <section class="sec"><h2 class="h2">Anglické lekcie</h2><p class="muted">Pôvodné anglické témy s kvízom, otvor si ktorúkoľvek.</p>
        <div class="ang-kvizy">${lek.map(t => this.kvizKarta(IK_KAT.anglictina, t.t, (t.z || []).length, st.done.includes(t.id), `data-start="${t.id}"`, n++, '#FFE0EC')).join('')}</div></section>`;
  },
  render() {
    const q = st.ang;
    if (!q) return this.hub();
    const o = q.qs[q.i], k = q.koniec;
    const pokrok = `<div class="ang-pokrok" aria-label="Otázka ${q.i + 1} z ${q.qs.length}">${q.qs.map((_, i) => `<i class="${i < q.i || (i === q.i && q.spravne) ? 'ok' : i === q.i ? 'ted' : ''}"></i>`).join('')}</div>`;
    const top = `<div class="hra-top"><button class="ib" data-ang-spat aria-label="Späť na angličtinu">${IKO.zavriet}</button><b class="hra-nazov">${q.skup ? esc(ANG_SKUPINY[q.skup]) : 'Kvízik z angličtiny'}</b></div>`;
    if (k) return `${top}<section class="card misia-pribeh ang-koniec" style="text-align:center">${q.precvic ? '<div>' + Precvic.stitok() + '</div>' : ''}<b class="misia-typ">${q.precvic ? 'Dobre si si to zopakoval' : 'Hotovo!'}</b><p>${q.chyby ? 'Chyby sú v poriadku, tak sa človek učí.' : 'Bez chyby, skvelé!'} ${q.precvic ? '' : q.skup ? 'Môžeš si ho zahrať znova, otázky sa menia.' : 'Zajtra príde nový kvízik.'}</p></section>
      ${q.precvic ? '<p class="muted">Len na precvičenie: hviezdičky ani séria sa nezmenili. Ten deň ti ostáva vynechaný.</p>' : k.zisk ? `<p class="misia-body">+${k.zisk} ${ii(STAR())}</p>` : '<p class="muted">Body za dnes už máš. Tu ide hlavne o učenie.</p>'}
      ${odmenyHtml(k)}<button class="btn wide cta" data-ang-spat>Späť na angličtinu</button>`;
    return `${top}${pokrok}${q.precvic ? Precvic.stitok() + Precvic.poznamka() : q.nahliad ? '<p class="muted">Tento kvízik sa počíta bez bodov.</p>' : ''}
      <section class="card ang-otazka"><span>${esc(o.t)}</span><span class="ang-slovo">${esc(o.slovo)}</span></section>
      <div class="ang-rea">${this.reakcia(q)}</div>
      <div class="ang-ans">${o.o.map((t, i) => `<button class="ans${q.spravne && i === o.s ? ' ok' : q.zle.includes(i) ? ' bad' : ''}" data-ang-vol="${i}" style="--e:#FFE0EC"${q.spravne || q.zle.includes(i) ? ' disabled' : ''}><span class="em pismeno">${'ABC'[i]}</span><span>${esc(t)}</span></button>`).join('')}</div>
      ${this.pata(q, o)}`;
  },
  reakcia(q) { return q.zle.length && !q.spravne ? `<div class="card misia-reakcia nova">${ii(IK.ziarovka)} Ešte nie. Skús inú možnosť.</div>` : ''; },
  pata(q, o) {
    return `${q.spravne ? `<div class="card ang-vys nova"><small class="lbl-mala">Vysvetlenie</small><p>${esc(o.vys)}</p></div><div class="ang-pad"></div><div class="ang-dalej-bar"><div class="gut"><button class="btn wide cta" data-ang-dalej>${q.i === q.qs.length - 1 ? 'Dokončiť' : 'Ďalej'}</button></div></div>` : ''}`;
  },
  /* Vyhodnotenie bez prekreslenia obrazovky: zmenia sa len odpovede, pokrok a pätička (reakcia, vysvetlenie, tlačidlo) */
  uprav() {
    const q = st.ang, o = q.qs[q.i], ans = main.querySelector('.ang-ans');
    if (!ans) { render(); return; }
    ans.querySelectorAll('[data-ang-vol]').forEach(b => {
      const i = +b.dataset.angVol, ok = q.spravne && i === o.s, bad = !ok && q.zle.includes(i);
      b.classList.toggle('ok', ok); b.classList.toggle('bad', bad);
      b.disabled = q.spravne || q.zle.includes(i);
    });
    main.querySelectorAll('.ang-pokrok i').forEach((el, i) => { el.className = i < q.i || (i === q.i && q.spravne) ? 'ok' : i === q.i ? 'ted' : ''; });
    main.querySelectorAll('.ang-vys, .ang-pad, .ang-dalej-bar').forEach(el => el.remove());
    const rea = main.querySelector('.ang-rea'); if (rea) rea.innerHTML = this.reakcia(q);
    ans.insertAdjacentHTML('afterend', this.pata(q, o));
  },
  /* Ďalšia otázka: krátke vyblednutie, potom nový obsah (pri obmedzenom pohybe hneď) */
  dalsia() {
    const q = st.ang, fn = () => {
      main.classList.remove('ang-mizne');
      if (st.ang !== q) return;
      if (q.i >= q.qs.length - 1) { this.dokonci(); return; }
      q.i++; q.zle = []; q.spravne = false; Zvuk.play('pop'); main.classList.remove('ang-mizne'); render(); scrollTo(0, 0);
    };
    if (tiche) { fn(); return; }
    if (q.cakaj) return;
    q.cakaj = true; main.classList.add('ang-mizne'); setTimeout(() => { q.cakaj = false; fn(); }, 160);
  },
  klik(b, d) {
    const q = st.ang;
    if (d.angStart !== undefined) { Zvuk.play('start'); Hlas.stop(); st.flow = null; st.view = 'anglictina'; const hot = this.splnenaDnes(); st.ang = this.nova(hot, hot ? (Math.floor(Date.now() / 6e4) % 50) + 1 : 0); render(); scrollTo(0, 0); return true; }
    if (d.angSkup !== undefined) { Zvuk.play('start'); Hlas.stop(); st.flow = null; st.view = 'anglictina'; const z = (this.data().skup || {})[d.angSkup]; st.ang = this.nova(true, z ? z.n : 0, d.angSkup); render(); scrollTo(0, 0); return true; }
    if (d.angPrec !== undefined) { const cislo = Tyzden._cislo(d.angPrec); if (!/^\d{4}-\d\d-\d\d$/.test(d.angPrec) || d.angPrec >= key(new Date())) return true; Zvuk.play('start'); Hlas.stop(); st.flow = null; st.view = 'anglictina'; st.ang = this.nova(true, 0, '', cislo, true); render(); scrollTo(0, 0); return true; }
    if (d.angSpat !== undefined) { Zvuk.play('whoosh'); st.ang = null; render(); scrollTo(0, 0); return true; }
    if (!q || q.koniec) return false;
    if (d.angVol !== undefined) {
      const i = +d.angVol, o = q.qs[q.i];
      if (i === o.s) { q.spravne = true; Zvuk.play('star'); Haptika.hraj('spravne'); } else { q.zle.push(i); q.chyby++; Zvuk.play('bad'); vibruj(30); }
      this.uprav(); return true;
    }
    if (d.angDalej !== undefined) { this.dalsia(); return true; }
    return false;
  },
};
