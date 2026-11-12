/* Priatelia (verzia 2.0): deti si posielajú len nálepky a hotové vety (rovnaký zoznam je vo firestore.rules) */
const VETY = {'ahoj': 'Ahoj!', 'ako': 'Ako sa máš?', 'super': 'Mám sa super!', 'grat': 'Gratulujem!', 'sisuper': 'Si super!', 'tema': 'Dnes mám hotovú tému!', 'odznak': 'Mám nový odznak!', 'seria': 'Moja séria rastie!', 'sutaz': 'Súťažíme tento týždeň?', 'dobiehaj': 'Dobiehaj ma!', 'ucit': 'Poďme sa učiť!', 'dakujem': 'Ďakujem!', 'haha': 'Ha-ha!', 'noc': 'Dobrú noc!', 'ano': 'Áno!', 'nie': 'Nie.'};
Object.assign(IK, {
  palec: IKS(`<path d="M14 22 H8 V42 H14Z" fill="#4C7DFF"/><path d="M14 22 L22 8 C24 4 30 5 29 11 L27 20 H38 C42 20 44 24 42 28 L38 40 C37 42 35 43 33 43 H14Z" fill="#FFD2B0"/><path d="M29 27 H38 M28 34 H36" fill="none" stroke-width="2"/>`),
  smiech: IKS(`<circle cx="24" cy="24" r="20" fill="#FFD23F"/><path d="M14 20 Q17 16 20 20 M28 20 Q31 16 34 20" fill="none"/><path d="M13 27 H35 C35 36 13 36 13 27Z" fill="#fff"/><path d="M19 33 C22 30 26 30 29 33" fill="#FF8FB1" stroke-width="2"/>`),
});
const NALEPKY = { sova: () => owl('cheer'), ohen: () => IK.ohen, hviezda: () => IK.hviezda, srdce: () => IK.srdce, pohar: () => IK.pohar, raketa: () => IK_KAT.vesmir, duha: () => IK.duha, koruna: () => IK.koruna,
  konfety: () => IK.konfety, palec: () => IK.palec, smiech: () => IK.smiech, diamant: () => IK.diamant, blesk: () => IK.blesk, mozog: () => IK.mozog, jednorozec: () => IK.jednorozec, kniha: () => IK.kniha };
const socC = () => window.Cloud && window.Cloud.soc;
const tyzKluc = () => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return key(d); };
const tyzBody = p => p && p.tyzKey === tyzKluc() ? Math.max(0, (p.body || 0) - (p.tyzStart || 0)) : 0;
const avatarMaly = a => postavicka({ ...AV_ZAKLAD, ...(a || {}) });
const videlKluc = fid => 'soc-videl-' + st.dietaId + '-' + fid;
// „videné“ = čas poslednej správy od kamaráta (čas servera), nie hodiny zariadenia, ktoré môžu ísť zle
const oznacVidene = fid => { const So = socC(), m = So ? (So.spravy[fid] || []).filter(x => x.od === fid).map(x => x.kedy || 0) : []; const v = Math.max(S.get(videlKluc(fid), 0), ...m); S.set(videlKluc(fid), v); };
const neprecitane = fid => { const So = socC(), v = S.get(videlKluc(fid), 0); return So ? (So.spravy[fid] || []).filter(m => m.od === fid && m.kedy > v).length : 0; };
function socNove() { const So = socC(); if (!So || !So.zapnute) return 0; return So.ziadosti.length + Object.keys(So.priatelia).reduce((a, f) => a + neprecitane(f), 0); }
function socZnacka() { const b = document.getElementById('nav-priatelia'); if (b) b.classList.toggle('novinka', socNove() > 0); }
// strom múdrosti priateľa (bez animácie): plod za každý deň série
const stromMaly = n => `<svg class="strom-mini" viewBox="56 20 208 222" aria-hidden="true"><g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
  <path d="M40 240 V228 C110 206 210 206 280 228 V240Z" fill="#7ED957"/><path d="M148 232 C150 198 146 178 132 160 L146 154 C154 166 158 176 160 186 C164 172 172 162 186 154 L194 162 C178 174 172 194 174 232Z" fill="#B5651D"/>
  ${KORUNA.map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr + 4}" fill="${INK}" stroke="none"/>`).join('')}${KORUNA.map(([x, y, rr, c]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${c}" stroke="none"/>`).join('')}
  ${PLODY.slice(0, Math.min(n, PLODY.length)).map(([x, y], i) => `<g transform="translate(${x} ${y})">${plod(i)}</g>`).join('')}</g></svg>`;
const casSpravy = t => { const d = new Date(t), dnes = key(new Date()) === key(d); return (dnes ? '' : d.getDate() + '. ' + (d.getMonth() + 1) + '. ') + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); };
const SIPKA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* Filter pre voľné písanie (slovenčina, čeština): jednoduchý zoznam zjavných nadávok, aj keď sú písané s bodkami, číslami alebo opakovanými písmenami,
   a údaje, ktoré deti nemajú posielať (telefón, e-mail, odkaz). Nie je dokonalý: hlavná poistka je, že písanie zapína rodič a vidí všetky správy. */
const NEVH_PREDPONY = ['kokot', 'kurv', 'jeb', 'pojeb', 'chuj', 'buzer', 'buzik', 'hovn', 'hovado', 'srack', 'debil', 'idiot', 'kreten', 'blbec', 'blbc', 'zmrd', 'dopic', 'zasran', 'cigan', 'hitl', 'zdochn', 'zomri', 'sprost', 'nigg'];
const NEVH_PRESNE = ['pica', 'pici', 'picu', 'pice', 'picovina', 'picoviny', 'kys', 'negr', 'negri', 'nazi', 'nazisti', 'nazista', 'curak', 'curaci', 'mrdat', 'mrdam', 'sex', 'sexy', 'porno'];
const NEVH_SLITE = ['kokot', 'kurva', 'jebat', 'jebem', 'pojeban', 'chuj', 'buzera', 'hovno', 'srack', 'debil', 'idiot', 'zmrd', 'dopic', 'zasran', 'nigger'];
function socKontrola(txt) {
  const t = String(txt || '').toLowerCase();
  if (/@|https?:|www\.|\.(sk|cz|com|net|org)\b/.test(t) || /\d{6,}/.test(t.replace(/[\s.\-/()]/g, ''))) return 'udaje';
  const n = t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5|\$/g, 's').replace(/7/g, 't').replace(/(.)\1+/g, '$1');
  const slova = n.split(/[^a-z]+/).filter(Boolean);
  if (slova.some(w => NEVH_PRESNE.includes(w) || NEVH_PREDPONY.some(p => w.startsWith(p)))) return 'slova';
  const slite = n.replace(/[^a-z]/g, '');
  return NEVH_SLITE.some(p => slite.includes(p)) ? 'slova' : '';
}
const socZablokovane = (pid, txt) => { const k = 'soc-zablok-' + pid, v = S.get(k, []); v.push({ k: Date.now(), t: String(txt).slice(0, 200) }); S.set(k, v.slice(-10)); };
const spravaObsah = (x, moja) => x.t ? (t => t ? `<span class="msg-tema"><span class="msg-tema-obr">${svg(t)}</span><small>${moja ? 'Poslal si tému' : 'Mám hotovú tému'}</small><b>${esc(t.t)}</b><span class="msg-hv">${[0, 1, 2].map(i => STAR(i < (x.h || 0) ? '#FFD23F' : '#E4E0EE')).join('')}</span>${moja ? '' : `<button class="btn blue" data-start="${t.id}">Skúsiť tiež</button>`}</span>` : '')(byId(x.t))
  : x.n ? `<span class="msg-nal">${NALEPKY[x.n] ? NALEPKY[x.n]() : ''}</span>` : (x.x ? (!moja && socKontrola(x.x) === 'slova' ? '<span class="msg-t msg-x"><i>Správa je skrytá, lebo obsahuje nevhodné slová.</i></span>' : `<span class="msg-t msg-x">${esc(x.x)}</span>`) : `<span class="msg-t">${esc(VETY[x.k] || '')}</span>`);
function chatHtml(fid) {
  const So = socC(), m = (So && So.spravy[fid]) || [], p = So && So.profily[fid];
  if (!m.length) return `<div class="dm-prazdny"><span class="soc-av velky">${avatarMaly(p && p.avatar)}</span><b>${esc(p ? p.meno : '')}</b><small class="muted">Pošli prvú nálepku alebo vetu dole!</small></div>`;
  return m.map((x, i) => {
    const moja = x.od === So.pid, dalsia = m[i + 1], posledna = !dalsia || dalsia.od !== x.od, cas = i === 0 || x.kedy - m[i - 1].kedy > 30 * 60000;
    return `${cas ? `<div class="dm-cas">${casSpravy(x.kedy)}</div>` : ''}<div class="msg${moja ? ' moja' : ''}${x.n || x.t ? ' nalepka' : ''}${posledna ? ' posl' : ''}${x.r ? ' srdce' : ''}"${moja ? '' : ` data-soc-msg="${x.id}"`}>
      ${!moja ? `<span class="msg-av">${posledna ? avatarMaly(p && p.avatar) : ''}</span>` : ''}<span class="msg-obal">${spravaObsah(x, moja)}${x.r ? `<i class="msg-r">${IK.srdce}</i>` : ''}</span></div>`;
  }).join('') + (vid => vid ? '<div class="dm-videne">Videné</div>' : '')((ja => ja && (So.citane[fid] || 0) >= ja.kedy && m[m.length - 1] === ja)(m.filter(x => x.od === So.pid).slice(-1)[0]));
}
// náhľad poslednej správy v zozname rozhovorov
function nahladSpravy(f) {
  const So = socC(), m = (So.spravy[f] || []).slice(-1)[0];
  if (!m) return '<small class="muted">Napíš prvú správu</small>';
  return `<small>${m.od === So.pid ? 'Ty: ' : ''}${m.t ? `${ii(IK.kniha)} téma: ${esc((byId(m.t) || {}).t || '')}` : m.n ? `${NALEPKY[m.n] ? ii(NALEPKY[m.n]()) : ''} nálepka` : m.x ? esc(m.x.slice(0, 40)) : esc(VETY[m.k] || '')} · ${casSpravy(m.kedy)}</small>`;
}
function rebricekHtml() {
  const So = socC(), ja = { pid: So.pid, meno: 'Ty', avatar: st.avatar, b: tyzBody(So.profil && { ...So.profil, body: st.body }), s: seria(), ja: true };
  const z = [ja, ...Object.keys(So.priatelia).map(f => So.profily[f] && { pid: f, meno: So.profily[f].meno, avatar: So.profily[f].avatar, b: tyzBody(So.profily[f]), s: So.profily[f].seria || 0 }).filter(Boolean)]
    .sort((a, b) => b.b - a.b || b.s - a.s);
  return `<div class="card rebricek">${z.map((x, i) => `<div class="reb${x.ja ? ' ja' : ''}"><span class="reb-m m${Math.min(i + 1, 4)}">${i + 1}</span><span class="soc-av">${avatarMaly(x.avatar)}</span><b>${esc(x.meno)}</b>
    <span class="reb-s">${ii(IK.ohen)} ${x.s}</span><span class="reb-b">${ii(STAR())} ${x.b}</span></div>`).join('')}</div>${z.length < 2 ? '<p class="muted">Pridaj si priateľov a súťažte, kto získa za týždeň viac bodov.</p>' : '<p class="muted">Body za tento týždeň, v pondelok sa začína odznova.</p>'}`;
}
Object.assign(views, {
  priatelia() {
    const So = socC();
    if (!So || !So.nacitane) return `<h1 class="h1">Priatelia</h1><p class="muted">Načítava sa…</p>`;
    if (!So.zapnute) return `<h1 class="h1">Priatelia</h1>
      <section class="card soc-intro">${owl('hi')}<div><span class="lbl">${ii(IK.rodina)} Pre rodiča</span>
        <p>Priatelia si posielajú kreslené nálepky a hotové vety. Priatelia si môžu písať aj vlastné slová. Vidia navzájom postavičku, meno, sériu, body, témy a odznaky. Nikdy e-mail, vek ani fotku.</p>
        <p>Priateľa si dieťa pridá len jeho kódom a druhá strana musí žiadosť prijať. Deti sa nedajú vyhľadať. Priateľov aj správy uvidí rodič v paneli rodiča a dá sa to kedykoľvek vypnúť.</p>
        <p><b>Priateľov zapína rodič.</b> ${maRodica() ? 'Poproste rodiča, nech ich zapne vo svojom paneli.' : 'Rodič si najprv vytvorí účet rodiča a v ňom ich zapne.'}</p>
        <p class="muted">Profil dieťaťa: ${esc(st.meno || 'dieťa')}</p>${maRodica() ? '' : '<button class="btn wide cta" data-rodic-novy>Vytvoriť účet rodiča</button>'}</div></section>`;
    const tab = st.socTab || 'spravy', caka = S.get('soc-caka-' + So.pid, []);
    const posl = f => ((So.spravy[f] || []).slice(-1)[0] || {}).kedy || 0;
    const priatelia = Object.keys(So.priatelia).filter(f => So.profily[f]).sort((a, b) => posl(b) - posl(a) || So.profily[a].meno.localeCompare(So.profily[b].meno));
    const taby = [['spravy', 'Správy', socNove()], ['rebricek', 'Rebríček', 0], ['pridat', 'Pridať', 0]];
    let telo = '';
    if (tab === 'spravy') telo = `${So.ziadosti.length ? `<section class="sec"><h2 class="h2" style="--hc:#FF6FA8">Chcú byť tvoji priatelia</h2>${So.ziadosti.map(z => `<div class="card soc-ziadost"><span class="soc-av">${avatarMaly(z.avatar)}</span><b>${esc(z.meno)}</b>
        <button class="btn blue" data-soc-prijmi="${z.id}">Prijať</button><button class="btn ghost" data-soc-odmietni="${z.id}">Nie</button></div>`).join('')}</section>` : ''}
      <div class="pribehy"><button class="pribeh plus" data-soc-tab="pridat"><span class="soc-av">${IK.plus}</span><small>Pridať</small></button>${priatelia.map(f => `<button class="pribeh${(So.profily[f].seria || 0) > 0 ? ' hori' : ''}" data-soc-otvor="${f}"><span class="soc-av">${avatarMaly(So.profily[f].avatar)}</span><small>${esc(So.profily[f].meno)}</small>${(So.profily[f].seria || 0) > 0 ? `<i class="pribeh-ohen">${IK.ohen}</i>` : ''}</button>`).join('')}</div>
      ${priatelia.length ? `<div class="konverzacie">${priatelia.map(f => { const n = neprecitane(f); return `<button class="konv${n ? ' nova' : ''}" data-soc-otvor="${f}"><span class="soc-av">${avatarMaly(So.profily[f].avatar)}</span>
        <span class="konv-t"><b>${esc(So.profily[f].meno)}</b>${nahladSpravy(f)}</span>${n ? '<i class="bodka"></i>' : ''}</button>`; }).join('')}</div>`
        : `<div class="empty">${owl('happy')}<span>Zatiaľ nemáš priateľov. Ťukni na Pridať a pošli kamarátovi svoj kód!</span></div>`}`;
    else if (tab === 'rebricek') telo = `<section class="sec"><h2 class="h2" style="--hc:#FFC233">Tento týždeň</h2>${rebricekHtml()}</section>`;
    else telo = `<section class="card soc-kod"><span class="lbl">Môj kód priateľa</span><b class="kod">${esc(So.profil.kod)}</b><small class="muted">Povedz ho kamarátovi alebo mu ho pošli. S kódom ti pošle žiadosť.</small>
        <button class="btn ghost" data-soc-zdielaj>Poslať môj kód</button></section>
      <section class="card soc-pridaj"><span class="lbl">Pridať priateľa</span><div class="soc-riadok"><input id="soc-kod" class="search bez-lupy kod-vstup" placeholder="SOVA-K7M2" maxlength="24" autocapitalize="characters" autocomplete="off" spellcheck="false" aria-label="Kód priateľa"><button class="btn blue" data-soc-pridaj>Pridať</button></div>
        ${caka.length ? `<small class="muted">Čaká sa, kým prijme: ${caka.map(x => esc(x.meno)).join(', ')}</small>` : ''}</section>`;
    return `<h1 class="h1">Priatelia</h1><div class="soc-taby">${taby.map(([id, n, poc]) => `<button data-soc-tab="${id}" aria-pressed="${tab === id}">${n}${poc ? ` <i>${poc}</i>` : ''}</button>`).join('')}</div>${telo}`;
  },
  priatel() {
    const So = socC(), f = st.priatel, p = So && So.profily[f];
    return `<div class="dm"><header class="dm-hlava"><button class="dm-spat" data-go="priatelia" aria-label="Späť na správy">${SIPKA}</button>
      ${p ? `<button class="dm-kto" data-soc-profil="${f}"><span class="soc-av">${avatarMaly(p.avatar)}</span><span><b>${esc(p.meno)}</b><small>${ii(IK.ohen)} ${p.seria || 0} · ${ii(STAR())} ${p.body || 0} · pozrieť profil</small></span></button>` : '<b>Načítava sa…</b>'}</header>
      <div class="dm-chat" id="chat">${p ? chatHtml(f) : ''}</div>
      <footer class="dm-pisanie">${st.socTemy ? `<div class="dm-temy">${st.done.slice(-12).reverse().map(byId).filter(Boolean).map(t => `<button class="dm-tema" data-soc-tema="${t.id}"><span>${svg(t)}</span><small>${esc(t.t)}</small></button>`).join('') || '<small class="muted">Najprv preber nejakú tému.</small>'}</div>` : ''}
        <div class="dm-nalepky"><button class="nal dm-temy-btn${st.socTemy ? ' on' : ''}" data-soc-temy aria-label="Poslať tému">${IK.kniha}</button>${Object.keys(NALEPKY).map(k => `<button class="nal" data-soc-nal="${k}" aria-label="Poslať nálepku">${NALEPKY[k]()}</button>`).join('')}</div>
        ${p && So.profil && So.profil.pisanie && p.pisanie ? `<form class="dm-text" data-soc-text-form><input id="soc-text" class="search bez-lupy" maxlength="200" placeholder="Napíš správu…" autocomplete="off" aria-label="Správa"><button class="btn blue" type="submit">Poslať</button></form>` : ''}
        <div class="dm-vety">${Object.entries(VETY).map(([k, t]) => `<button class="chip" data-soc-veta="${k}">${esc(t)}</button>`).join('')}</div></footer></div>`;
  },
  priatelProfil() {
    const So = socC(), f = st.priatel, p = So && So.profily[f];
    if (!p) return `<div class="soc-hlava"><button class="ib" data-go="priatelia" aria-label="Späť">${SIPKA}</button><b>Priateľ</b></div><p class="muted">Načítava sa…</p>`;
    const odz = (p.posledne || []).map(id => ODZNAKY.find(o => o.id === id)).filter(Boolean);
    return `<div class="soc-hlava"><button class="ib" data-soc-otvor="${f}" aria-label="Späť na rozhovor">${SIPKA}</button><b>${esc(p.meno)}</b></div>
      <section class="card soc-profil"><span class="soc-av velky">${avatarMaly(p.avatar)}</span>
        <div class="soc-staty"><span class="chip tmavy" style="--c:#FFE7C2">${ii(IK.ohen)} ${p.seria || 0} ${dni(p.seria || 0)} po sebe</span><span class="chip tmavy" style="--c:#FFF0B3">${ii(STAR())} ${p.body || 0} bodov</span>
          <span class="chip tmavy" style="--c:#D6E6FF">${ii(IK.kniha)} ${p.temy || 0} tém</span><span class="chip tmavy" style="--c:#EBDDFF">${ii(IK.medaila)} ${p.odznaky || 0} odznakov</span></div>
        <div class="soc-strom">${stromMaly(p.seria || 0)}<small class="muted">Strom múdrosti: plod za každý deň série</small></div>
        ${odz.length ? `<div class="posledne">${odz.map(o => `<span class="medaila mala" title="${esc(o.n)}">${ikOdznaku(o)}</span>`).join('')}</div>` : ''}
        <button class="btn wide cta" data-soc-otvor="${f}">Napísať správu</button></section>
      <button class="btn ghost wide soc-odober" data-soc-odober="${f}">Odstrániť ${esc(p.meno)} z priateľov</button>`;
  },
});
// zmena z cloudu (nová správa, žiadosť, pokrok priateľa): prekresliť bez straty rozpísaného kódu
function socZmena() {
  socZnacka();
  if (st.faza === 'rodicDieta') { renderTicho(); return; } // detail dieťaťa v paneli rodiča
  if (st.faza !== 'appka' || st.flow || st.hra || st.auto) return;
  if (st.view === 'priatel') {
    const ch = document.getElementById('chat'), So = socC();
    if (ch && So && So.profily[st.priatel] && document.querySelector('.dm-kto')) {
      const dole = ch.scrollHeight - ch.scrollTop - ch.clientHeight < 80;
      const t = document.createElement('div'); t.innerHTML = chatHtml(st.priatel); morph(ch, t, true); // pribudne len nová bublina, ostatné ostanú a neprehrajú animáciu
      if (dole) ch.scrollTop = ch.scrollHeight;
      oznacVidene(st.priatel); socZnacka(); if (So.precitaj) So.precitaj(st.priatel);
    } else { render(); main.classList.remove('anim'); }
  } else if (st.view === 'priatelia' || st.view === 'priatelProfil') {
    render(true); // tiché prekreslenie: pole s kódom, scroll aj fokus ostanú, nezmenené karty sa nehýbu
  }
}
let socPosledna = 0, socTap = {}, socOznCas = 0;
// nová správa, kým je dieťa inde v appke: bublina hore (ťuknutím otvorí rozhovor)
function socNovaSprava(f) {
  if (st.faza !== 'appka' || st.flow || st.hra || st.auto || Sprievodca.el || (st.view === 'priatel' && st.priatel === f)) return;
  const So = socC(), p = So && So.profily[f];
  if (!p) return;
  if (Date.now() - socOznCas > 1500) { Zvuk.play('heart'); vibruj([30, 40, 30]); } // viac správ naraz = jeden zvuk
  socOznCas = Date.now();
  document.querySelectorAll('.soc-ozn').forEach(x => x.remove());
  const el = document.createElement('button');
  el.className = 'soc-ozn'; el.dataset.socOtvor = f;
  el.innerHTML = `<span class="soc-av">${avatarMaly(p.avatar)}</span><span><b>${esc(p.meno)}</b>${nahladSpravy(f)}</span>`;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.add('pryc'); setTimeout(() => el.remove(), 400); }, 4500);
}
function socAkcia(sl, ok, zle) { sl.then(x => { if (ok) ok(x); }, e => { Zvuk.play('bad'); toast(typeof e === 'string' ? e : 'Nepodarilo sa. Skúste to, keď bude internet.'); if (zle) zle(e); }); }

function fillTemy() {
  const f = document.getElementById('filtre'), z = document.getElementById('zoznam');
  const kk = kats(), q = bez(st.q.trim()), g = q || st.kat === 'fav' ? null : SKUPINY.find(x => x.id === st.skupina);
  const chip = k => `<button class="chip" data-kat="${k.id}" aria-pressed="${st.kat === k.id}" style="--c:${k.c}">${ii(k.ikona || ikKat(k.id))} ${k.nazov}</button>`;
  const hf = `<div class="skupiny${g ? ' vybrana' : ''}">${SKUPINY.map((x, i) => skupinaKarta(x, kk, i)).join('')}</div>
    <div class="chips">${g ? [{ id: '', nazov: 'Celá oblasť', ikona: g.ikona(), c: g.c }, ...g.kat.map(id => kk.find(k => k.id === id)).filter(Boolean)].map(chip).join('') : ''}${chip({ id: 'fav', nazov: 'Uložené', ikona: IK.srdce, c: '#FF5A5F' })}</div>`;
  if (f._h !== hf) { f.innerHTML = hf; f._h = hf; } // nezmenený zoznam sa neprekreslí (nebliká, ostane scroll)
  const poradie = SKUPINY.flatMap(x => x.kat);
  const list = TV().sort((a, b) => poradie.indexOf(a.k) - poradie.indexOf(b.k))
    .filter(t => q ? bez(t.t + ' ' + t.m).includes(q) : st.kat === 'fav' ? st.fav.includes(t.id) : st.kat ? t.k === st.kat : !g || g.kat.includes(t.k));
  const html = q || !g ? (st.kat === 'fav' && !q ? list.map(row).join('')
    : SKUPINY.map(x => (tt => tt.length ? `<h2 class="h2 skup-h" style="--hc:${x.c}">${ii(x.ikona())} ${x.nazov}</h2>${tt.map(row).join('')}` : '')(list.filter(t => x.kat.includes(t.k)))).join(''))
    : list.map(row).join('');
  const hz = html || `<div class="empty">${owl('oops')}<span>${st.kat === 'fav' ? 'Zatiaľ nič uložené.' : 'Takú tému zatiaľ nemáme.'}</span></div>`;
  if (z._h !== hz) { z.innerHTML = hz; z._h = hz; }
}

