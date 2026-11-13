/* Misia dňa: jedna krátka misia na deň (5 typov), body raz za deň, história splnených. Bez tlaku: vynechaný deň nič nestojí. */
const MISIA_TYPY = {
  detektiv: { n: 'Detektívna misia', c: '#7C6CFF', ik: 'lupa', p: 'Prečítaj indície a odhaľ záhadu.', von: 'Vymyslite doma vlastnú záhadu a nechajte ostatných hádať.' },
  keby: { n: 'Keby som bol…', c: '#FF9F1C', ik: 'bublina', p: 'Predstav si situáciu a rozhodni sa.', von: 'Porozprávajte sa, čo by urobil každý z vás.' },
  pravdy: { n: 'Dve pravdy a jedna lož', c: '#2FBF71', ik: 'otaznik', p: 'Ktoré tvrdenie je vymyslené?', von: 'Vymyslite dve pravdy a jednu lož o svojom dni.' },
  coak: { n: 'Čo sa stane, keď…?', c: '#4C7DFF', ik: 'ziarovka', p: 'Hádaj, čo bude potom, a zisti prečo.', von: 'Skúste nájsť vo svete okolo príčinu a následok.' },
  vyzva: { n: 'Výzva skutočného sveta', c: '#E0533F', ik: 'vlajka', p: 'Úloha mimo appky: ulica, príroda, ľudia.', von: 'Choď von a splň úlohu.' },
};
const MISIA_PORADIE = ['detektiv', 'keby', 'pravdy', 'coak', 'vyzva'];
const MISIA_UROVNE = ['Jednoduchá', 'Stredná', 'Zapeklitá'];
const Misie = {
  kluc: () => 'misie-' + st.dietaId,
  data() { const d = S.get(this.kluc(), null); return d && d.hotove ? d : { hotove: {}, bodyDen: '' }; },
  uroven() { return S.get('misie-uroven-' + st.dietaId, st.vek === 'starsi' ? 2 : 1); },
  dnesna(u = this.uroven()) {
    const dm = this.data();
    if (u === this.uroven() && dm.bodyDen === key(new Date()) && dm.dnesMisia) { const x = MISIE.find(y => y.id === dm.dnesMisia); if (x) return x; } // splnená dnes: ostáva tá istá misia
    const d = denCislo(), typ = MISIA_PORADIE[d % 5], zoz = MISIE.filter(m => m.t === typ && m.u === u);
    if (!zoz.length) return MISIE[0];
    const hotove = this.data().hotove, z = Math.floor(d / 5);
    for (let i = 0; i < zoz.length; i++) { const m = zoz[(z + i) % zoz.length]; if (!hotove[m.id]) return m; }
    return zoz[z % zoz.length];
  },
  splnenaDnes() { return this.data().bodyDen === key(new Date()); },
  sucet() {
    const h = Object.entries(this.data().hotove);
    return { n: h.length, typy: new Set(h.map(([, v]) => v.t)).size, vyzvy: h.filter(([, v]) => v.t === 'vyzva').length };
  },
  tyzden() { const od = key((() => { const x = new Date(); x.setDate(x.getDate() - 6); return x; })()); return Object.values(this.data().hotove).filter(v => v.kedy >= od).length; },
  body: (m, chyby) => { const z = m.t === 'vyzva' ? 20 + 5 * (m.u - 1) : 8 + 2 * m.u; return chyby ? Math.max(5, Math.round(z * .6)) : z; },
  nova(m, nahliad) { return { m, ind: 1, chyby: 0, zle: [], videl: [], vysl: null, koniec: null, nahliad: !!nahliad, anim: '' }; },
  dokonci() {
    const q = st.misia, m = q.m, dnes = key(new Date()), d = this.data(), pred = st.body;
    let zisk = 0;
    const bez = q.nahliad || q.precvic;
    if (!bez && d.bodyDen !== dnes) { zisk = this.body(m, q.chyby); d.bodyDen = dnes; d.dnesMisia = m.id; pripisBody(zisk); }
    if (!bez) { d.hotove[m.id] = { kedy: dnes, t: m.t }; S.set(this.kluc(), d); }
    const odznaky = bez ? [] : noveOdznaky('misia');
    q.koniec = { zisk, noveOdznaky: odznaky, noveOdmeny: noveOdmeny(pred, st.body), noveHry: noveHry(pred, st.body) };
    Zvuk.play('win'); vibruj([40, 30, 40]); FX.burst(innerWidth / 2, innerHeight / 3, 30, ['star', 'dot']);
    paintHead(); render(); scrollTo(0, 0);
  },
  chipy(m, u) {
    const T = MISIA_TYPY[m.t];
    return `<div class="chips misia-chipy"><span class="chip" style="--c:${T.c}">${ii(ik(T.ik))} ${T.n}</span><span class="chip tmavy" style="--c:#FFD23F">${MISIA_UROVNE[(u || m.u) - 1]}</span><span class="chip tmavy" style="--c:#B6F0C8">2 až 5 minút</span></div>`;
  },
  hub() {
    const m = this.dnesna(), T = MISIA_TYPY[m.t], ok = this.splnenaDnes(), u = this.uroven(), h = this.data().hotove;
    const hist = Object.entries(h).sort((a, b) => b[1].kedy.localeCompare(a[1].kedy)).slice(0, 12).map(([id, v]) => [MISIE.find(x => x.id === id), v]).filter(([x]) => x);
    const datum = k => new Date(k + 'T12:00:00').toLocaleDateString('sk-SK', { day: 'numeric', month: 'numeric' });
    return `<div class="hra-top"><button class="ib" data-go="domov" aria-label="Späť domov">${IKO.zavriet}</button><h1 class="h1 hra-nazov">Téma dňa: misia</h1></div>
      <p class="muted">Jedna krátka misia na deň. Keď ju nestihneš, nič sa nestane, zajtra príde nová.</p>
      <section class="card misia-dnes" style="--c:${T.c}"><div class="frame misia-banner">${svg(temaDna())}<span class="sticker">${ii(ik(T.ik))} Téma dňa</span></div>
        <div><small class="lbl-mala">${ok ? 'Dnes splnené' : 'Časť 2 témy dňa'}</small><b class="misia-typ">${T.n}</b><span class="muted">${T.p}</span></div>
        ${this.chipy(m, u)}
        ${ok ? `<p class="misia-hotovo">${ii(IK.fajka)} Dnešnú misiu máš splnenú. ${esc(T.von)}</p>` : ''}
        <button class="btn wide ${ok ? 'ghost' : 'cta'}" data-mi-start>${ok ? 'Zahrať si ešte raz (bez bodov)' : 'Začať misiu'}</button></section>
      <section class="sec"><h2 class="h2">Náročnosť</h2>
        <div class="chips">${MISIA_UROVNE.map((n, i) => `<button class="chip" data-mi-u="${i + 1}" aria-pressed="${u === i + 1}" style="--c:#7C6CFF">${n}</button>`).join('')}</div></section>
      <section class="sec"><h2 class="h2">Moje misie</h2><p class="muted">Tento týždeň: ${this.tyzden()}</p>
        <div class="misia-typy">${MISIA_PORADIE.map(t => { const n = Object.values(h).filter(v => v.t === t).length, X = MISIA_TYPY[t];
          return `<div class="misia-typ-bunka${n ? ' ma' : ''}" style="--c:${X.c}"><span class="misia-ikona">${ik(X.ik)}</span><b>${n}×</b><small>${X.n}</small></div>`; }).join('')}</div>
        ${hist.length ? `<div class="list">${hist.map(([x, v]) => `<button class="row misia-riadok" data-mi-hist="${x.id}"><span class="misia-mini" style="--c:${MISIA_TYPY[x.t].c}">${ik(MISIA_TYPY[x.t].ik)}</span><span class="misia-riadok-t"><b>${esc(x.n)}</b><small>${datum(v.kedy)} · ${MISIA_TYPY[x.t].n}</small></span></button>`).join('')}</div>`
          : '<p class="muted">Tu sa ukážu tvoje splnené misie.</p>'}</section>`;
  },
  moznosti(q, spravne) {
    const m = q.m, k = q.koniec;
    return `<div class="misia-ans">${m.o.map((o, i) => {
      const t = typeof o === 'string' ? o : o.t, cls = k && i === spravne ? ' ok' : q.zle.includes(i) ? ' bad' : q.videl.includes(i) ? ' vyb' : '';
      return `<button class="ans${cls}" data-mi-vol="${i}" style="--e:#F3EFFF"${k || q.zle.includes(i) ? ' disabled' : ''}><span class="em pismeno">${'ABCD'[i]}</span><span>${esc(t)}</span></button>`;
    }).join('')}</div>`;
  },
  chyba(q) {
    return `<div class="misia-rea">${this.chybaText(q)}</div>`;
  },
  chybaText(q) {
    return q.zle.length && !q.koniec ? `<div class="card misia-reakcia nova">${ii(IK.ziarovka)} ${q.m.t === 'detektiv' && q.ind < q.m.ind.length ? 'Ešte nie. Odhaľ ďalšiu indíciu alebo skús inú možnosť.' : 'Ešte nie. Skús inú možnosť.'}</div>` : '';
  },
  telo(q) {
    const m = q.m, a = q.anim; q.anim = '';
    if (m.t === 'detektiv') return `<section class="card misia-pribeh">${esc(m.pribeh)}</section>
      <section class="sec"><h2 class="h2">Indície</h2>${m.ind.slice(0, q.ind).map((x, i) => `<div class="card misia-ind${a === 'ind' && i === q.ind - 1 ? ' nova' : ''}"><span class="misia-cislo">${i + 1}</span><span>${esc(x)}</span></div>`).join('')}
        ${!q.koniec && q.ind < m.ind.length ? `<button class="btn wide blue" data-mi-ind>${ii(IK.lupa)} Ďalšia indícia</button>` : ''}</section>
      <section class="sec"><h2 class="h2">${esc(m.q)}</h2>${this.chyba(q)}${this.moznosti(q, m.s)}</section>`;
    if (m.t === 'coak') return `<section class="card misia-pribeh">${esc(m.pribeh)}</section>
      <section class="sec"><h2 class="h2">${esc(m.q)}</h2>${this.chyba(q)}${this.moznosti(q, m.s)}</section>`;
    if (m.t === 'keby') {
      const r = q.videl.map(i => `<div class="card misia-reakcia">${esc(m.o[i].r)}</div>`).join('');
      return `<section class="card misia-pribeh">${esc(m.pribeh)}</section>
      <section class="sec"><h2 class="h2">Čo urobíš?</h2><p class="muted">Tu nie je zlá odpoveď. Ťukni na možnosť a uvidíš, čo sa môže stať. Môžeš skúsiť viac možností.</p>${this.moznosti(q, -1)}${r}
        ${q.videl.length && !q.koniec ? '<button class="btn wide cta" data-mi-hotovo>Hotovo</button>' : ''}</section>`;
    }
    if (m.t === 'pravdy') {
      const k = q.koniec;
      return `<p class="muted">Dve tvrdenia sú pravdivé a jedno je vymyslené. Ťukni na to, ktoré je lož.</p>${this.chyba(q)}<div class="misia-ans">${m.v.map((x, i) => {
        const hotovo = k || q.zle.includes(i), cls = k ? (x.ok ? ' pravda' : ' ok') : q.zle.includes(i) ? ' bad' : '';
        return `<button class="ans${cls}" data-mi-vol="${i}" style="--e:#F3EFFF"${hotovo ? ' disabled' : ''}><span class="em pismeno">${i + 1}</span><span>${esc(x.t)}</span></button>${hotovo ? `<div class="card misia-reakcia nova"><b>${x.ok ? 'Pravda' : 'Lož'}.</b> ${esc(x.e)}</div>` : ''}`;
      }).join('')}</div>`;
    }
    return `<section class="card misia-pribeh">${esc(m.pribeh)}</section>
      <section class="sec"><h2 class="h2">Tvoja úloha</h2>
        <ol class="misia-kroky">${m.ulohy.map(x => `<li>${esc(x)}</li>`).join('')}</ol><p class="muted">${ii(IK.ziarovka)} ${esc(m.tip)}</p></section>
      ${q.koniec ? '' : `<section class="sec"><h2 class="h2">Ako to dopadlo?</h2><div class="chips">${m.vysl.map((x, i) => `<button class="chip" data-mi-vysl="${i}" aria-pressed="${q.vysl === i}" style="--c:#E0533F">${esc(x)}</button>`).join('')}</div>
        <p class="muted">Najprv choď von a úlohu splň. Potom sa vráť a ťukni na Splnené.</p>
        <button class="btn wide cta" data-mi-hotovo>Splnené!</button>
        <button class="btn wide ghost" data-mi-spat>Idem na to, vrátim sa neskôr</button></section>`}`;
  },
  koniec(q) {
    const m = q.m, k = q.koniec, T = MISIA_TYPY[m.t];
    return `${m.vys ? `<div class="card misia-vys"><small class="lbl-mala">Vysvetlenie</small><p>${esc(m.vys)}</p></div>` : ''}
      <div class="card misia-fakt"><small class="lbl-mala">Zaujímavosť</small><p>${ii(IK.iskra)} ${esc(m.fakt)}</p></div>
      <div class="card misia-rodic"><span class="misia-rodic-ik">${IK.rodina}</span><div><small class="lbl-mala">Pre rodiča</small><p>${esc(m.rodic)}</p></div></div>
      ${k.zisk ? `<p class="misia-body">+${k.zisk} ${ii(STAR())}</p>` : '<p class="muted">Body za dnes už máš. Tu ide hlavne o objavovanie.</p>'}
      ${odmenyHtml(k)}
      <div class="card misia-von"><small class="lbl-mala">Mimo appky</small><p>${esc(m.von || T.von)}</p></div>
      <button class="btn wide cta" data-go="domov">Hotovo, idem objavovať</button>`;
  },
  render() {
    const q = st.misia;
    if (!q) return this.hub();
    const T = MISIA_TYPY[q.m.t];
    return `<div class="hra-top"><button class="ib" data-mi-spat aria-label="Späť na misie">${IKO.zavriet}</button><b class="hra-nazov">${esc(q.m.n)}</b></div>
      <div class="frame misia-banner" style="--c:${T.c}">${svg(temaDna())}<span class="sticker">${ii(ik(T.ik))} ${T.n}</span></div>
      ${this.chipy(q.m)}
      ${q.nahliad ? '<p class="muted">Táto misia sa počíta bez bodov.</p>' : ''}
      ${this.telo(q)}${q.koniec ? this.koniec(q) : ''}`;
  },
  klik(b, d) {
    const q = st.misia;
    if (d.miStart !== undefined) { Zvuk.play('start'); Hlas.stop(); st.flow = null; st.view = 'misia'; const hotDnes = this.splnenaDnes(); st.misia = this.nova((hotDnes && MISIE.find(x => x.id === this.data().dnesMisia)) || this.dnesna(), hotDnes); render(); scrollTo(0, 0); return true; }
    if (d.miHist) { const m = MISIE.find(x => x.id === d.miHist); if (m) { Zvuk.play('pop'); st.misia = this.nova(m, true); render(); scrollTo(0, 0); } return true; }
    if (d.miU) { S.set('misie-uroven-' + st.dietaId, +d.miU); Zvuk.play('tap'); render(true); return true; }
    if (d.miSpat !== undefined) { Zvuk.play('whoosh'); st.misia = null; render(); scrollTo(0, 0); return true; }
    if (!q || q.koniec) return false;
    if (d.miInd !== undefined) { q.ind++; q.anim = 'ind'; Zvuk.play('pop'); render(true); return true; }
    if (d.miVysl !== undefined) { q.vysl = q.vysl === +d.miVysl ? null : +d.miVysl; Zvuk.play('tap'); render(true); return true; }
    if (d.miHotovo !== undefined) { this.dokonci(); return true; }
    if (d.miVol !== undefined) {
      const i = +d.miVol, m = q.m;
      if (m.t === 'keby') { if (!q.videl.includes(i)) q.videl.push(i); Zvuk.play('pop'); render(true); return true; }
      const spravne = m.t === 'pravdy' ? m.v.findIndex(x => !x.ok) : m.s;
      if (i === spravne) this.dokonci(); else { q.zle.push(i); q.chyby++; Zvuk.play('bad'); vibruj(30); render(true); }
      return true;
    }
    return false;
  },
};
// misia dňa na lístku témy dňa (5.0): jeden riadok pod tlačidlom. Odomkne sa až po téme dňa (poradie: 1 téma, 2 misia).
function kartaMisie(temaHotova) {
  const m = Misie.dnesna(), T = MISIA_TYPY[m.t], ok = Misie.splnenaDnes();
  if (!temaHotova) return `<p class="dom-misia zamk">${ikn('kompas')}<span>Po téme ťa čaká misia: <b>${T.n}</b></span>${ikn('zamok')}</p>`;
  return `<button class="dom-misia${ok ? ' hotova' : ''}" data-go="misia">${ikn('kompas')}<span>${ok ? 'Misia splnená' : 'Teraz misia'}: <b>${T.n}</b></span>${ikn(ok ? 'check' : 'sipka')}</button>`;
}
// veľká karta na konci témy dňa: misia viazaná na tému s jej obrázkom
function kartaMisiePoTeme(t) {
  const m = Misie.dnesna(), T = MISIA_TYPY[m.t], ok = Misie.splnenaDnes();
  return `<section class="card misia-po-teme" style="--c:${T.c}"><div class="frame">${svg(t)}<span class="sticker">${ii(ik(T.ik))} Téma dňa</span></div>
    <div><small class="lbl-mala">${ok ? 'Téma dňa splnená' : 'Časť 2 témy dňa: skús to'}</small><b class="misia-typ">${T.n}</b><span class="muted">${T.p} Potom choď von a skús to vo svete.</span></div>
    <button class="btn wide ${ok ? 'ghost' : 'cta'}" data-mi-start>${ok ? 'Zahrať si ešte raz (bez bodov)' : 'Pokračovať misiou!'}</button></section>`;
}
