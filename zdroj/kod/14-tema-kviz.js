/* Téma a kvíz krok za krokom */
function startTema(id, precvic = false) {
  const t = byId(id);
  const qs = t.z.filter(pre).map(naVek).map(q => ({ t: 'q', q, poradie: mix(q.a.length), tid: id }));
  st.flow = { typ: 'tema', id, i: 0, odp: {}, precvic: !!precvic, from: st.view, kroky: [{ t: 'uvod' }, { t: 'priklad' }, { t: 'rozhovor' }, ...qs, { t: 'koniec' }] };
  Zvuk.play('start'); render(); window.scrollTo(0, 0);
}
// Kvízy (verzia 2.5): životy a prestávka po každom kvíze, aj keď je všetko správne (aby to nebolo príliš ľahké)
const KVIZY = {
  rychly: { zivoty: 2, min: 5, koho: 'Rýchly kvíz', dalsi: 'Ďalší rýchly kvíz', koniec: 'Kvíz sa skončil' },
  tazky: { zivoty: 3, min: 15, koho: 'Ťažký kvíz', dalsi: 'Ďalší ťažký kvíz', koniec: 'Kvíz sa skončil' },
  vyzva: { zivoty: 3, min: 30, koho: 'Výzvu', dalsi: 'Ďalšiu výzvu', koniec: 'Výzva sa skončila' },
};
const druhKvizu = f => f.vyzva ? 'vyzva' : f.tazky ? 'tazky' : 'rychly';
const kvizKluc = d => 'kviz-zamok-' + d + '-' + (st.dietaId || 'x');
const kvizMinuty = d => Math.max(0, Math.ceil((S.get(kvizKluc(d), 0) - Date.now()) / 60000));
const kvizZamkni = d => S.set(kvizKluc(d), Date.now() + KVIZY[d].min * 60000);
const kvizPopis = (d, text) => kvizMinuty(d) ? `Znova o ${kvizMinuty(d)} min. Medzitým skús niečo iné!` : text;
// téma bez jedinej správnej odpovede sa nezapíše a strom múdrosti nenarastie: treba skúsiť otázky ešte raz
const vsetkoZle = f => f.typ === 'tema' && f.kroky.some(k => k.t === 'q') && !Object.values(f.odp).some(o => o.ok);
// zapíše odpoveď; v kvíze zlá odpoveď zoberie život a po poslednom sa kvíz končí bez bodov
function odpovedz(f, v) {
  const ok = v === 0;
  f.odp[f.i] = { v, ok, p: pick(POCHVALA) };
  if (f.zivoty != null && !ok) { f.zivoty--; f.prave = true; if (f.zivoty <= 0) f.prehra = true; }
  return ok;
}
// rýchly kvíz: 5 otázok; ťažký kvíz (väčšie deti): 8 otázok len pre väčšie deti; výzva: 10 extra ťažkých otázok za dvojnásobné body
function startKviz(druh = '') {
  const tazky = druh === 'tazky', vyzva = druh === 'vyzva', d = vyzva ? 'vyzva' : tazky ? 'tazky' : 'rychly';
  if (kvizMinuty(d)) { Zvuk.play('boing'); toast(`${KVIZY[d].koho} môžeš znova hrať o ${kvizMinuty(d)} min.`); return; }
  // kvizy.js (4.6): sady navyše podľa náročnosti; 1 rýchly, 2 ťažký (v rýchlom len pre väčšie deti), 3 výzva
  const navyse = u => KVIZ_SADY.filter(s => u.includes(s.u) && TV().some(t => t.id === s.tid)).flatMap(s => s.z.map(q => ({ t: 'q', q, tid: s.tid })));
  const vsetky = vyzva ? [...VYZVA.filter(x => byId(x.tid)).map(q => ({ t: 'q', q, tid: q.tid })), ...navyse([3])]
    : [...TV().flatMap(t => t.z.filter(q => tazky ? q.v === 's' : pre(q)).map(naVek).map(q => ({ t: 'q', q, tid: t.id }))), ...navyse(tazky ? [2] : st.vek === 'starsi' ? [1, 2] : [1])];
  const qs = mix(vsetky.length).slice(0, vyzva ? 10 : tazky ? 8 : 5).map(i => ({ ...vsetky[i], poradie: mix(vsetky[i].q.a.length) }));
  st.flow = { typ: 'kviz', tazky, vyzva, zivoty: KVIZY[d].zivoty, maxZivoty: KVIZY[d].zivoty, i: 0, odp: {}, from: st.view, kroky: [...qs, { t: 'koniec' }] };
  Zvuk.play('start'); render(); window.scrollTo(0, 0);
}
const citaj = typ => `<button class="read" data-citaj="${typ}">${ii(IK.repro)} Prečítať nahlas</button>`;
function textKroku(f) {
  const k = f.kroky[f.i], t = f.id && byId(f.id);
  if (k.t === 'uvod') return [...vetyZ(t.t), ...vetyZ(t.m), ...(st.vek === 'starsi' ? vetyZ(t.s) : [])];
  if (k.t === 'priklad') return ['Príklad zo života.', ...vetyZ(t.p)];
  if (k.t === 'rozhovor') return ['Porozprávajte sa.', ...t.o.flatMap(vetyZ)];
  if (k.t === 'q') return [...vetyZ(k.q.q), ...moznostiNahlas(k.poradie.map(j => k.q.a[j][1]))];
  return [];
}

function krok(f, k) {
  const t = f.id && byId(f.id);
  if (k.t === 'uvod') {
    const kat = KAT[t.k];
    return `<div class="step"><div class="frame">${svg(t)}</div>
      <div><span class="chip" style="--c:${kat.c}">${ii(ikKat(t.k))} ${kat.nazov}</span>${f.precvic ? ' ' + Precvic.stitok() : ''}</div>
      ${f.precvic ? Precvic.poznamka() : ''}<h1 class="h1">${t.t}</h1>
      <div class="say"><div class="say-head"><button class="say-owl" data-sova aria-label="Sovička Múdra">${owl('hi')}</button><span>Povedzte dieťaťu</span>${citaj('uvod')}</div>
        <div class="bubble"><p>${t.m}</p></div></div>
      <button class="btn auto-mini" data-auto-start="${t.id}">${IKO.auto}Celú tému nahlas (do auta)</button>
      ${st.vek === 'starsi' ? `<div class="more"><b>${ii(IK.ciapka)} Do hĺbky</b><p>${t.s}</p></div>` : ''}</div>`;
  }
  if (k.t === 'priklad') {
    return `<div class="step"><div class="st-head"><div class="big-st" style="--c:#FFD23F">${IK.ziarovka}</div><h1 class="h1">Príklad zo života</h1></div>${citaj('priklad')}<div class="note-card"><p>${t.p}</p></div></div>`;
  }
  if (k.t === 'rozhovor') {
    return `<div class="step"><div class="st-head"><div class="big-st" style="--c:#8FD3FF">${IK.bublina}</div><h1 class="h1">Porozprávajte sa</h1></div>
      <p class="muted">Nie je tu správna ani nesprávna odpoveď. Stačí sa pýtať a počúvať.</p>${citaj('rozhovor')}
      <div class="talk">${t.o.map((x, i) => `<div class="tb${i % 2 ? ' r' : ''}" style="--c:${TBG[i % 3]}"><span class="tb-q">?</span><p>${x}</p></div>`).join('')}</div></div>`;
  }
  if (k.t === 'q') {
    const qn = f.kroky.filter(x => x.t === 'q'), odp = f.odp[f.i], q = k.q, pism = pismenaOdpovedi(q), zdroj = f.typ === 'kviz' ? byId(k.tid) : null;
    return `<div class="step"><div class="qhead"><div class="qhead-r"><span class="sticker sm">Otázka ${qn.indexOf(k) + 1} z ${qn.length}</span>${f.zivoty != null ? `<span class="zivoty" aria-label="Životy: ${f.zivoty} z ${f.maxZivoty}">${[...Array(f.maxZivoty).keys()].map(i => `<i class="${i < f.zivoty ? 'ma' : 'strata'}${i === f.zivoty && f.prave ? ' prave' : ''}">${i < f.zivoty ? IK.srdce : IK.srdcePrazdne}</i>`).join('')}</span>` : ''}${citaj('q')}</div>
        ${zdroj ? `<span class="chip" style="--c:${KAT[zdroj.k].c}">${ii(ikKat(zdroj.k))} ${zdroj.t}</span>` : ''}
        <h1 class="qt">${q.q}</h1></div>
      <div class="answers">${k.poradie.map((j, pos) => {
        const cls = odp ? (j === 0 ? ' ok' : j === odp.v ? ' bad' : '') : '';
        return `<button class="ans${cls}" data-ans="${j}"${odp ? ' disabled' : ''}><span class="em${pism ? ' pismeno' : ''}" style="--e:${EMBG[pos % 3]}">${pism ? 'ABCD'[pos] : emo(q.a[j][0])}</span><span>${q.a[j][1]}</span></button>`;
      }).join('')}</div>
      ${odp ? `<div class="fbk ${odp.ok ? 'ok' : 'bad'}" aria-live="polite"><span class="fbk-owl">${owl(odp.ok ? 'happy' : 'oops')}</span><div><b>${odp.ok ? odp.p : 'Nevadí, nabudúce!'}</b><p>${odp.ok ? '' : 'Správne je: ' + q.a[0][1] + '. '}${q.w || ''}</p></div></div>` : ''}</div>`;
  }
  // koniec
  const qn = f.kroky.filter(x => x.t === 'q').length, c = Object.values(f.odp).filter(o => o.ok).length;
  if (f.zle) return `<div class="win"><div class="win-hero"><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl('oops')}</button></div>
      ${f.precvic ? Precvic.stitok() : ''}<h1 class="h1">Nevadí${st.meno ? ', ' + esc(st.meno) : ''}!</h1>
      <p class="muted">${f.precvic ? 'Tentoraz nevyšla ani jedna odpoveď. Je to len na precvičenie, skús otázky ešte raz.' : 'Tentoraz nevyšla ani jedna odpoveď. Strom múdrosti narastie, keď otázky skúsiš ešte raz.'}</p>
      <div class="win-acts"><button class="btn wide cta" data-znova>↻ Nevadí, ale skús to ešte raz</button>
        <button class="btn blue wide" data-znova="tema">Prečítať tému ešte raz</button><button class="btn ghost wide" data-zavriet>Späť domov</button></div></div>`;
  if (f.prehra) return `<div class="win"><div class="win-hero"><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl('oops')}</button></div>
      <h1 class="h1">Došli životy!</h1>
      <div class="zivoty velke">${[...Array(f.maxZivoty).keys()].map(() => `<i class="strata">${IK.srdcePrazdne}</i>`).join('')}</div>
      <p class="muted">${KVIZY[druhKvizu(f)].koniec}, tentoraz bez bodov. Správne odpovede: <b>${c} z ${Object.keys(f.odp).length}</b>.<br>${KVIZY[druhKvizu(f)].dalsi} môžeš hrať o ${KVIZY[druhKvizu(f)].min} min.</p>
      <div class="win-acts"><button class="btn ghost wide" data-zavriet>Späť domov</button></div></div>`;
  if (f.precvic) return `<div class="win"><div class="win-hero"><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl('happy')}</button></div>
      ${Precvic.stitok()}
      <h1 class="h1">Dobre si si to zopakoval${st.meno ? ', ' + esc(st.meno) : ''}.</h1>
      <p class="muted">Správne odpovede: <b>${c} z ${qn}</b></p>
      <div class="earn plain">Tento deň ti ostáva vynechaný, ale tému už poznáš. Hviezdičky, séria a strom sa nezmenili.</div>
      <div class="win-acts"><button class="btn ghost wide" data-zavriet>Späť domov</button></div></div>`;
  const hv = c === qn ? 3 : c * 2 >= qn ? 2 : c ? 1 : 0;
  const rel = t ? t.r.map(byId).filter(Boolean) : [];
  // 4.2: po téme len to najdôležitejšie (misia a jedno tlačidlo ďalej), ostatné je zbalené v rozbaľovacích riadkoch
  const dnesTema = f.typ === 'tema' && !!t && t.id === temaDna().id, misiaCaka = dnesTema && !Misie.splnenaDnes();
  const nOdm = (f.noveOdznaky || []).length + (f.noveOdmeny || []).length + (f.noveHry || []).length;
  const pochval = (So => So && So.zapnute && f.typ === 'tema' && Object.keys(So.priatelia).length && !S.get('soc-pochvala-' + So.pid + '-' + f.id, false) ? `<button class="btn wide cta soc-pochval" data-soc-pochval="${f.id}:${hv}">${ii(IK.rodina)} Pochváliť sa priateľom</button>` : '')(socC());
  const viac = [dnesTema && !misiaCaka ? kartaMisiePoTeme(t) : '', pochval, rel.length ? `<div class="sec"><h2 class="h2" style="--hc:#4C7DFF">Na túto tému nadväzuje</h2><div class="list">${rel.map(row).join('')}</div></div>` : ''].filter(Boolean).join('');
  return `<div class="win win-krat">
      <div class="win-hero"><div class="burst"></div><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl(c ? 'cheer' : 'hi')}</button></div>
      <h1 class="h1">${c === qn ? 'Skvelá práca' : c ? 'Výborne' : 'Dobrý pokus'}${st.meno ? ', ' + esc(st.meno) : ''}!</h1>
      <div class="stars3" data-n="${hv}" aria-label="${hv} z 3 hviezd">${[0, 1, 2].map(i => STAR(i < hv ? '#FFD23F' : '#E4E0EE')).join('')}</div>
      <p class="muted">Správne odpovede: <b>${c} z ${qn}</b></p>
      ${f.zisk ? `<div class="earn">${STAR()} <b>+0</b> bodov${f.opakovanie ? ' za zopakovanie' : ''}</div>${f.ina && !f.opakovanie ? '<p class="muted">Za inú tému je najviac 10 bodov. Najviac bodov dáva téma dňa!</p>' : ''}` : f.dnesUz ? `<div class="earn plain">${f.typ === 'kviz' ? 'Body za tento kvíz už dnes máš. Zajtra môžeš získať ďalšie!' : 'Túto tému ste dnes už opakovali. Ďalšie body za ňu budú zajtra.'}</div>` : ''}
      ${nOdm ? `<details class="win-zbal win-odm"${nOdm === 1 ? ' open' : ''}><summary>${ii(IK.iskra)} ${nOdm === 1 ? 'Máš novú odmenu' : 'Máš nové odmeny: ' + nOdm}</summary>${odmenyHtml(f)}</details>` : ''}
      ${misiaCaka ? kartaMisiePoTeme(t) : ''}
      <div class="win-acts">
        ${f.typ === 'kviz' ? `<div class="earn plain">${KVIZY[druhKvizu(f)].dalsi} môžeš hrať o ${KVIZY[druhKvizu(f)].min} min.</div>` : misiaCaka ? '' : `<button class="btn cta wide" data-nahodna>${ii(IK.kocka)} Ďalšia téma</button>`}
        <button class="btn ghost wide" data-zavriet>Späť domov</button>
      </div>
      ${viac ? `<details class="win-zbal"><summary>Viac</summary><div class="win-viac">${viac}</div></details>` : ''}</div>`;
}

function renderFlow(anim = true) {
  const f = st.flow, k = f.kroky[f.i], n = f.kroky.length - 1, t = f.id && byId(f.id);
  const fav = t && st.fav.includes(t.id), odp = f.odp[f.i];
  document.body.style.setProperty('--kc', t ? KAT[t.k].c : '#FF9F1C');
  document.body.classList.add('tinted');
  let dalej = '';
  if (k.t !== 'koniec') {
    const caka = k.t === 'q' && !odp;
    dalej = `<div class="flow-pad"></div><div class="fnext"><div class="gut"><button class="btn ${k.t === 'q' ? '' : 'blue'} wide${caka ? '' : ' cta'}" data-dalej${caka ? ' disabled' : ''}>${caka ? 'Vyberte odpoveď' : 'Pokračovať →'}</button></div></div>`;
  }
  main.classList.toggle('anim', anim);
  const html = `<div class="ftop"><button class="ib" data-zavriet aria-label="Zavrieť">${IKO.zavriet}</button>
      <div class="fbar"><i style="width:${Math.max(6, Math.round(f.i / n * 100))}%"></i></div>
      <span class="fnum">${Math.min(f.i + 1, n)}/${n}</span>
      ${t ? `<button class="ib heart" data-fav aria-pressed="${fav}" aria-label="Uložiť tému">${fav ? IK.srdce : IK.srdcePrazdne}</button>` : ''}</div>
    ${krok(f, k)}${dalej}`;
  // vyhodnotenie odpovede (anim = false): zmení sa len to, čo sa líši, aby obrázok ani otázka neblikli
  const hore = main.firstElementChild;
  if (!anim && hore && typeof document.createElement === 'function') { const t = document.createElement('div'); t.innerHTML = html; morph(main, t, true); }
  else if (anim && hore && hore.classList.contains('ftop') && typeof document.createElement === 'function') {
    // ďalší krok v tom istom toku: horná lišta ostane (pruh pokroku sa plynulo posunie), mení sa len obsah pod ňou
    const t = document.createElement('div'); t.innerHTML = html;
    morph(hore, t.firstElementChild);
    while (hore.nextSibling) hore.nextSibling.remove();
    [...t.children].slice(1).forEach(n => main.appendChild(n));
    main.classList.add('flow-dalej');
  } else { main.classList.remove('flow-dalej'); main.innerHTML = html; }
  ocisluj();
  if (k.t === 'koniec' && anim && !f.prehra && !f.zle && !f.precvic) oslava(f);
}

function oslava(f) {
  const box = main.querySelector('.stars3'); if (!box) return;
  Zvuk.play('win'); vibruj([60, 40, 60]);
  const n = +box.dataset.n;
  box.querySelectorAll('svg').forEach((s, i) => setTimeout(() => {
    if (i >= n || !s.isConnected) return;
    Zvuk.play('star'); const [x, y] = stred(s); FX.burst(x, y, 18, ['star', 'dot'], 7);
  }, 550 + i * 300));
  if (n) setTimeout(() => FX.rain(n * 60), 250);
  if (n === 3) setTimeout(() => FX.ohnostroj(5), 1500);
  main.querySelectorAll('.odmena-karta').forEach((k, i) => setTimeout(() => {
    if (!k.isConnected) return;
    Zvuk.play('star'); vibruj(30); const [x, y] = stred(k); FX.burst(x, y, 24, ['star', 'dot', 'rect'], 7);
  }, 1900 + i * 250));
  const el = main.querySelector('.earn b');
  if (el && f.zisk) setTimeout(() => {
    let v = 0; const krok = Math.max(1, Math.ceil(f.zisk / 20));
    const iv = setInterval(() => { v = Math.min(f.zisk, v + krok); el.textContent = '+' + v; Zvuk.play('tick'); if (v >= f.zisk || !el.isConnected) { clearInterval(iv); Zvuk.play('coin'); } }, 45);
  }, 1500);
}

