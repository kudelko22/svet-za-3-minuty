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
  if (kvizMinuty(d)) { Zvuk.play('zamok'); toast(`${KVIZY[d].koho} môžeš znova hrať o ${kvizMinuty(d)} min.`); return; }
  // kvizy.js (4.6): sady navyše podľa náročnosti; 1 rýchly, 2 ťažký (v rýchlom len pre väčšie deti), 3 výzva
  const navyse = u => KVIZ_SADY.filter(s => u.includes(s.u) && TV().some(t => t.id === s.tid)).flatMap(s => s.z.map(q => ({ t: 'q', q, tid: s.tid })));
  const vsetky = vyzva ? [...VYZVA.filter(x => byId(x.tid)).map(q => ({ t: 'q', q, tid: q.tid })), ...navyse([3])]
    : [...TV().flatMap(t => t.z.filter(q => tazky ? q.v === 's' : pre(q)).map(naVek).map(q => ({ t: 'q', q, tid: t.id }))), ...navyse(tazky ? [2] : st.vek === 'starsi' ? [1, 2] : [1])];
  const qs = mix(vsetky.length).slice(0, vyzva ? 10 : tazky ? 8 : 5).map(i => ({ ...vsetky[i], poradie: mix(vsetky[i].q.a.length) }));
  st.flow = { typ: 'kviz', tazky, vyzva, zivoty: KVIZY[d].zivoty, maxZivoty: KVIZY[d].zivoty, i: 0, odp: {}, from: st.view, kroky: [...qs, { t: 'koniec' }] };
  Zvuk.play('start'); render(); window.scrollTo(0, 0);
}
// 5.0: tlačidlo čítania nahlas (Hlas mu počas čítania pridá triedu .on)
const citaj = (typ, kruh) => kruh ? `<button class="btn kruh dve citaj" data-citaj="${typ}" aria-label="Prečítať nahlas">${ikn('zvuk')}</button>`
  : `<button class="btn maly mud citaj" data-citaj="${typ}">${ikn('zvuk')}Prečítaj mi</button>`;
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
  // 5.0: téma je stránka z ilustrovanej encyklopédie (papier, jeden stĺpec, veľké riadkovanie)
  if (k.t === 'uvod') {
    return `<article class="step kniha">
      <figure class="tabula" style="--c:${KAT[t.k].c}">${svg(t)}</figure>
      ${f.precvic ? `<div>${Precvic.stitok()}</div>${Precvic.poznamka()}` : ''}
      <div class="nadp"><h1 class="n0">${t.t}</h1>${citaj('uvod')}</div>
      <p class="lead">${t.m}</p>
      ${st.vek === 'starsi' ? `<div class="karta hlb${f.hlbka ? ' otvor' : ''}"><span class="zal">Do hĺbky</span><p id="hlb-t">${t.s}</p>
        <button class="viac" data-hlbka aria-expanded="${!!f.hlbka}" aria-controls="hlb-t">${f.hlbka ? 'Zbaliť' : 'Čítať ďalej'}${ikn('dole')}</button></div>` : ''}
      <button class="btn dve maly do-auta" data-auto-start="${t.id}">${ikn('auto')}Celú tému nahlas (do auta)</button></article>`;
  }
  if (k.t === 'priklad') {
    return `<article class="step kniha">
      <div class="nadp"><h1 class="n0">Príklad zo života</h1>${citaj('priklad')}</div>
      <aside class="vies"><button class="vies-m" data-sova aria-label="Sovička Múdra">${mudra('zvedava')}</button>
        <div class="odkaz"><b>Ako to poznáš</b>${t.p}</div></aside></article>`;
  }
  if (k.t === 'rozhovor') {
    return `<article class="step kniha">
      <div class="nadp"><h1 class="n0">Porozprávajte sa</h1>${citaj('rozhovor')}</div>
      <p class="lead bez">Nie je tu správna ani nesprávna odpoveď. Stačí sa pýtať a počúvať.</p>
      <ol class="otazky">${t.o.map((x, i) => `<li class="karta"><span class="cislo cis">${i + 1}</span><p>${x}</p></li>`).join('')}</ol></article>`;
  }
  if (k.t === 'q') {
    // 5.0: kvíz je javisko; po odpovedi sa zmení len to, čo sa líši (morph), nič sa neprekreslí celé
    const qn = f.kroky.filter(x => x.t === 'q'), odp = f.odp[f.i], q = k.q, pism = pismenaOdpovedi(q), zdroj = f.typ === 'kviz' ? byId(k.tid) : null;
    return `<div class="step kviz-ko">
      <div class="karta otazka"><span class="zal">Otázka ${qn.indexOf(k) + 1} z ${qn.length}</span>${citaj('q', true)}
        <h1 class="qt">${q.q}</h1>${zdroj ? `<span class="st zdroj" style="--c:${KAT[zdroj.k].c}">${ii(ikKat(zdroj.k))} ${zdroj.t}</span>` : ''}</div>
      <div class="odpovede">${k.poradie.map((j, pos) => {
        const cls = odp ? (j === 0 ? ' spravna' : j === odp.v ? ' zla' : ' ine') : '';
        return `<button class="od${cls}" data-ans="${j}"${odp ? ' disabled' : ''}><span class="pis${pism ? '' : ' obr'}">${pism ? 'ABCD'[pos] : emo(q.a[j][0])}</span><span class="od-t">${q.a[j][1]}</span>${odp && j === 0 ? `<span class="znak ok">${ikn('check')}</span>` : odp && j === odp.v ? `<span class="znak zle">${ikn('zavriet')}</span>` : ''}</button>`;
      }).join('')}</div>
      ${odp ? reakcia(f, odp, q) : ''}</div>`;
  }
  // koniec
  const qn = f.kroky.filter(x => x.t === 'q').length, c = Object.values(f.odp).filter(o => o.ok).length;
  if (f.zle) return `<div class="win"><div class="win-hero"><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl('oops')}</button></div>
      ${f.precvic ? Precvic.stitok() : ''}<h1 class="h1">Nevadí${st.meno ? ', ' + esc(st.meno) : ''}!</h1>
      <p class="muted">${f.precvic ? 'Tentoraz nevyšla ani jedna odpoveď. Je to len na precvičenie, skús otázky ešte raz.' : 'Tentoraz nevyšla ani jedna odpoveď. Strom múdrosti narastie, keď otázky skúsiš ešte raz.'}</p>
      <div class="win-acts"><button class="btn wide cta" data-znova>${ikn('znova')}Nevadí, skús to ešte raz</button>
        <button class="btn mud wide" data-znova="tema">Prečítať tému ešte raz</button><button class="btn dve wide" data-zavriet>Späť domov</button></div></div>`;
  if (f.prehra) return `<div class="win"><div class="win-hero"><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl('oops')}</button></div>
      <h1 class="h1">Došli životy!</h1>
      <div class="zivoty velke">${[...Array(f.maxZivoty).keys()].map(() => `<i class="strata">${ikn('srdce')}</i>`).join('')}</div>
      <p class="muted">${KVIZY[druhKvizu(f)].koniec}, tentoraz bez bodov. Správne odpovede: <b>${c} z ${Object.keys(f.odp).length}</b>.<br>${KVIZY[druhKvizu(f)].dalsi} môžeš hrať o ${KVIZY[druhKvizu(f)].min} min.</p>
      <div class="win-acts"><button class="btn dve wide" data-zavriet>Späť domov</button></div></div>`;
  if (f.precvic) return `<div class="win"><div class="win-hero"><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl('happy')}</button></div>
      ${Precvic.stitok()}
      <h1 class="h1">Dobre si si to zopakoval${st.meno ? ', ' + esc(st.meno) : ''}.</h1>
      <p class="muted">Správne odpovede: <b>${c} z ${qn}</b></p>
      <div class="earn plain">Tento deň ti ostáva vynechaný, ale tému už poznáš. Hviezdičky, séria a strom sa nezmenili.</div>
      <div class="win-acts"><button class="btn dve wide" data-zavriet>Späť domov</button></div></div>`;
  const hv = c === qn ? 3 : c * 2 >= qn ? 2 : c ? 1 : 0;
  const rel = t ? t.r.map(byId).filter(Boolean) : [];
  // 4.2: po téme len to najdôležitejšie (misia a jedno tlačidlo ďalej), ostatné je zbalené v rozbaľovacích riadkoch
  const dnesTema = f.typ === 'tema' && !!t && t.id === temaDna().id, misiaCaka = dnesTema && !Misie.splnenaDnes();
  const nOdm = (f.noveOdznaky || []).length + (f.noveOdmeny || []).length + (f.noveHry || []).length;
  const pochval = (So => So && So.zapnute && f.typ === 'tema' && Object.keys(So.priatelia).length && !S.get('soc-pochvala-' + So.pid + '-' + f.id, false) ? `<button class="btn wide cta soc-pochval" data-soc-pochval="${f.id}:${hv}">${ikn('priatelia')} Pochváliť sa priateľom</button>` : '')(socC());
  const viac = [dnesTema && !misiaCaka ? kartaMisiePoTeme(t) : '', pochval, rel.length ? `<div class="sec"><h2 class="h2">Na túto tému nadväzuje</h2><div class="list">${rel.map(row).join('')}</div></div>` : ''].filter(Boolean).join('');
  return `<div class="win win-krat">
      <div class="win-hero"><div class="burst"></div><button class="win-owl" data-sova aria-label="Sovička Múdra">${owl(c ? 'cheer' : 'hi')}</button></div>
      <h1 class="h1">${c === qn ? 'Skvelá práca' : c ? 'Výborne' : 'Dobrý pokus'}${st.meno ? ', ' + esc(st.meno) : ''}!</h1>
      <div class="stars3" data-n="${hv}" aria-label="${hv} z 3 hviezd">${[0, 1, 2].map(i => STAR(i < hv ? 'var(--sun)' : 'var(--sand)')).join('')}</div>
      <p class="muted">Správne odpovede: <b>${c} z ${qn}</b></p>
      ${f.zisk ? `<div class="earn">${STAR()} <b>+0</b> bodov${f.opakovanie ? ' za zopakovanie' : ''}</div>${f.ina && !f.opakovanie ? '<p class="muted">Za inú tému je najviac 10 bodov. Najviac bodov dáva téma dňa!</p>' : ''}` : f.dnesUz ? `<div class="earn plain">${f.typ === 'kviz' ? 'Body za tento kvíz už dnes máš. Zajtra môžeš získať ďalšie!' : 'Túto tému ste dnes už opakovali. Ďalšie body za ňu budú zajtra.'}</div>` : ''}
      ${nOdm ? `<details class="win-zbal win-odm"${nOdm === 1 ? ' open' : ''}><summary>${ikn('hviezda')} ${nOdm === 1 ? 'Máš novú odmenu' : 'Máš nové odmeny: ' + nOdm}</summary>${odmenyHtml(f)}</details>` : ''}
      ${misiaCaka ? kartaMisiePoTeme(t) : ''}
      <div class="win-acts">
        ${f.typ === 'kviz' ? `<div class="earn plain">${KVIZY[druhKvizu(f)].dalsi} môžeš hrať o ${KVIZY[druhKvizu(f)].min} min.</div>` : misiaCaka ? '' : `<button class="btn cta wide" data-nahodna>${ikn('kocka')} Ďalšia téma</button>`}
        <button class="btn dve wide" data-zavriet>Späť domov</button>
      </div>
      ${viac ? `<details class="win-zbal"><summary>Viac</summary><div class="win-viac">${viac}</div></details>` : ''}</div>`;
}

// reakcia po odpovedi: pri správnej vyjde slnko s Múdrou a zospodu hárok s vysvetlením; pri zlej len povzbudenie
function reakcia(f, odp, q) {
  const n = f.kroky[f.i + 1], dalej = f.prehra ? 'Pokračovať' : n.t === 'q' ? 'Ďalšia otázka' : 'Pozrieť výsledok';
  const plus = odp.ok ? bodyZaOdpoved(f, f.i) : 0, meno = st.meno ? ', ' + esc(st.meno) : '';
  return `<div class="reakcia ${odp.ok ? 'ok' : 'zle'}">
    ${odp.ok ? `<div class="slnko" aria-hidden="true">${slnkoKviz()}</div>` : ''}
    <button class="rk-mud" data-sova aria-label="Sovička Múdra">${mudra(odp.ok ? 'oslava' : 'povzbudenie', { extra: odp.ok })}</button>
    ${plus ? `<span class="plus cis" aria-hidden="true">+${plus}${ikn('hviezda')}</span>` : ''}
    <div class="harok" aria-live="polite"><h2 class="n1">${odp.ok ? odp.p.replace(/!$/, meno + '!') : 'Nevadí, nabudúce!'}</h2>
      <p>${odp.ok ? '' : 'Správne je: <b>' + q.a[0][1] + '</b>. '}${q.w || ''}</p>
      <button class="btn wide" data-dalej>${dalej}${ikn('sipka', 'za')}</button></div></div>`;
}
// slnko za Múdrou (polkruh s lúčmi), kreslí sa raz
const SLNKO_LUCE = (() => { let t = ''; const n = 13, k = 180 / n; for (let i = 0; i < n; i++) { const a = (180 + i * k) * Math.PI / 180, b = (180 + (i + 1) * k) * Math.PI / 180; t += `<path d="M180 250L${(180 + 260 * Math.cos(a)).toFixed(1)} ${(250 + 260 * Math.sin(a)).toFixed(1)}L${(180 + 260 * Math.cos(b)).toFixed(1)} ${(250 + 260 * Math.sin(b)).toFixed(1)}Z" fill="${i % 2 ? '#FFC533' : '#FFDB70'}"/>`; } return t; })();
const slnkoKviz = () => `<svg viewBox="0 0 360 250" preserveAspectRatio="xMidYMax meet"><clipPath id="slnko-k"><circle cx="180" cy="250" r="178"/></clipPath><circle cx="180" cy="250" r="204" fill="none" stroke="#FFC533" stroke-width="7" stroke-dasharray=".1 16" stroke-linecap="round"/><g clip-path="url(#slnko-k)"><g class="luce">${SLNKO_LUCE}</g></g><circle cx="180" cy="250" r="178" fill="none" style="stroke:var(--ink)" stroke-width="3"/></svg>`;
// Odhad bodov počas kvízu, aby dieťa videlo nové body hneď. Počíta rovnako ako dokonci(), nič nezapisuje; body pripíše až dokonci().
function odhadZisku(f, c) {
  if (f.precvic || c < 0) return 0;
  const dnes = key(new Date());
  if (f.typ === 'tema') {
    const prvy = !st.done.includes(f.id); if (!prvy && st.kedy[f.id] === dnes) return 0;
    const z = prvy ? c * 10 + 10 : c + 1; return f.id !== temaDna().id ? Math.min(10, z) : z;
  }
  if (S.get('kviz-' + (st.dietaId || 'x') + '-' + druhKvizu(f), '') === dnes) return 0;
  return c * (f.vyzva ? 20 : f.tazky ? 15 : 10);
}
const spravnychDo = (f, i) => Object.keys(f.odp).filter(j => +j <= i && f.odp[j].ok).length;
const bodyZaOdpoved = (f, i) => Math.max(0, odhadZisku(f, spravnychDo(f, i)) - odhadZisku(f, spravnychDo(f, i) - 1));
const bodyTeraz = f => st.body + Math.max(0, odhadZisku(f, spravnychDo(f, f.i)) - odhadZisku(f, 0));

// horná lišta: pri čítaní späť, kategória a strana, uloženie; na javisku zavrieť, postup, životy a body
function hornaLista(f, k) {
  const t = f.id && byId(f.id), qs = f.kroky.filter(x => x.t === 'q');
  if (k.t === 'q') {
    const ziv = f.zivoty != null ? `<span class="zivoty" role="img" aria-label="Životy: ${f.zivoty} z ${f.maxZivoty}">${[...Array(f.maxZivoty).keys()].map(i => `<i class="${i < f.zivoty ? 'ma' : 'strata'}${i === f.zivoty && f.prave ? ' prave' : ''}">${ikn('srdce')}</i>`).join('')}</span>` : '';
    const b = bodyTeraz(f);
    return `<div class="ftop jav-top"><button class="btn kruh dve" data-zavriet aria-label="Zavrieť">${ikn('zavriet')}</button>
      <div class="postup" role="img" aria-label="Otázka ${qs.indexOf(k) + 1} z ${qs.length}">${qs.map(x => { const o = f.odp[f.kroky.indexOf(x)]; return `<i class="${o ? (o.ok ? 'h' : 'z') : x === k ? 'ted' : ''}"></i>`; }).join('')}</div>
      ${ziv}<span class="st cis skore" role="img" aria-label="Body: ${b}">${ikn('hviezda')}<b>${b}</b></span></div>`;
  }
  const citanie = f.kroky.filter(x => x.t !== 'q' && x.t !== 'koniec'), s = citanie.indexOf(k);
  const nazov = t ? KAT[t.k].nazov.replace(/­/g, '') : f.vyzva ? 'Výzva' : f.tazky ? 'Ťažký kvíz' : 'Rýchly kvíz';
  const seg = t ? citanie.length + (qs.length ? 1 : 0) : qs.length, on = k.t === 'koniec' ? seg : s + 1;
  return `<div class="ftop kniha-top"><button class="btn kruh dve" data-zavriet aria-label="${k.t === 'koniec' ? 'Zavrieť' : 'Späť'}">${ikn(k.t === 'koniec' ? 'zavriet' : 'spat')}</button>
    <span class="dop beh">${nazov} · ${k.t === 'koniec' ? 'hotovo' : `strana ${s + 1} z ${citanie.length}`}</span>
    ${t ? `<button class="btn kruh dve fav" data-fav aria-pressed="${st.fav.includes(t.id)}" aria-label="Uložiť tému">${ikn('srdce')}</button>` : '<i class="fav-miesto"></i>'}
    <div class="kroky" aria-hidden="true">${[...Array(seg).keys()].map(i => `<i${i < on ? ' class="on"' : ''}></i>`).join('')}</div></div>`;
}
const NAZOV_DALEJ = { priklad: 'Príklad zo života', rozhovor: 'Porozprávajte sa', q: 'Ideme na kvíz', koniec: 'Dokončiť' };

function renderFlow(anim = true) {
  const f = st.flow, k = f.kroky[f.i], t = f.id && byId(f.id);
  document.body.style.setProperty('--kc', t ? KAT[t.k].c : 'var(--sun)');
  document.body.classList.add('tinted');
  document.body.classList.toggle('javisko', k.t === 'q');
  let dalej = '';
  if (k.t !== 'koniec' && k.t !== 'q') {
    const citanie = f.kroky.filter(x => x.t !== 'q' && x.t !== 'koniec');
    dalej = `<div class="flow-pad"></div><div class="fnext"><div class="gut"><span class="strana cis">${citanie.indexOf(k) + 1} / ${citanie.length}</span><button class="btn wide" data-dalej>${NAZOV_DALEJ[f.kroky[f.i + 1].t]}${ikn('sipka', 'za')}</button></div></div>`;
  }
  main.classList.toggle('anim', anim);
  const html = `${hornaLista(f, k)}${krok(f, k)}${dalej}`;
  // vyhodnotenie odpovede (anim = false): zmení sa len to, čo sa líši, aby obrázok ani otázka neblikli
  const hore = main.firstElementChild;
  if (!anim && hore && typeof document.createElement === 'function') { const t = document.createElement('div'); t.innerHTML = html; morph(main, t, true); }
  else if (anim && hore && hore.classList.contains('ftop') && typeof document.createElement === 'function') {
    // ďalší krok v tom istom toku: horná lišta ostane, mení sa len obsah pod ňou (strana sa otočí)
    const t = document.createElement('div'); t.innerHTML = html;
    if (!morph(hore, t.firstElementChild)) { hore.replaceWith(t.firstElementChild.cloneNode(true)); }
    const h = main.firstElementChild;
    while (h.nextSibling) h.nextSibling.remove();
    [...t.children].slice(1).forEach(n => main.appendChild(n));
    main.classList.add('flow-dalej');
  } else { main.classList.remove('flow-dalej'); main.innerHTML = html; }
  ocisluj();
  if (k.t === 'koniec' && anim && !f.prehra && !f.zle && !f.precvic) oslava(f);
}

// efekty po odpovedi (zvuk, konfety z Múdrej, štítok s bodmi letí do počítadla); stav už vykreslil renderFlow(false)
function reakciaOdpovede(f, ok, v) {
  const h = main.querySelector('.harok');
  Mudra.reaguj(main.querySelector('.rk-mud'), ok ? 'oslava' : 'povzbudenie', { oneskorenie: ok ? 750 : 450 });
  if (h && h.scrollIntoView) setTimeout(() => h.isConnected && h.scrollIntoView({ block: 'nearest', behavior: tiche ? 'auto' : 'smooth' }), 150);
  if (ok) {
    Zvuk.play('ok'); setTimeout(() => Zvuk.play('coin'), 260); Haptika.hraj(f.precvic ? 'spravne' : 'hotovo');
    const m = main.querySelector('.rk-mud');
    if (m && !tiche) setTimeout(() => { if (!m.isConnected) return; const [x, y] = stred(m); FX.burst(x, y - 20, 34, ['rect', 'dot', 'star'], 8); }, 300);
    const plus = main.querySelector('.reakcia .plus'), sk = main.querySelector('.skore b');
    if (plus && sk) {
      const nove = sk.textContent, n = parseInt(plus.textContent, 10) || 0; sk.textContent = String(+nove - n);
      setTimeout(() => {
        if (!plus.isConnected || !sk.isConnected) return;
        let dopadlo = false; const dopad = () => { if (dopadlo) return; dopadlo = true; sk.textContent = nove; const s = sk.parentNode; s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); Zvuk.play('tick'); };
        if (tiche || typeof plus.animate !== 'function') { dopad(); return; }
        const a = plus.getBoundingClientRect(), b = sk.getBoundingClientRect(), l = plus.cloneNode(true);
        l.classList.add('plus-let'); Object.assign(l.style, { left: a.left + 'px', top: a.top + 'px' }); document.body.appendChild(l);
        plus.style.visibility = 'hidden';
        l.animate([{ transform: 'rotate(8deg)' }, { transform: `translate(${b.left - a.left - 10}px, ${b.top - a.top - 6}px) scale(.5)`, opacity: .4 }], { duration: 600, easing: 'cubic-bezier(.5, 0, .75, 0)' }).onfinish = () => { l.remove(); dopad(); };
        setTimeout(() => { l.remove(); dopad(); }, 900); // aj keď animácia nedobehne (skrytá stránka)
      }, 1000);
    }
  } else {
    Zvuk.play('bad'); vibruj([80, 50, 80]);
    const b = main.querySelector(`.od[data-ans="${v}"]`); if (b) b.classList.add('trasie');
    if (f.prehra) setTimeout(() => { Zvuk.play('bum'); vibruj([60, 40, 60]); }, 450);
  }
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

