/* Brána pred appkou: prihlásenie rodiča, výber dieťaťa a tvorba postavičky */
const vekText = v => v === 'starsi' ? '9–12 rokov' : '5–8 rokov';
// krok: nové dieťa sa vytvára v dvoch krokoch (1 meno a vek, 2 postavička); úprava existujúceho je jedna stránka
function noveUpravovanie(prve) {
  const stary = prve && staryOk(), body = stary ? STARY.body || 0 : 0;
  return { id: null, meno: stary ? STARY.meno : '', vek: stary ? STARY.vek : 'mladsi', avatar: nahodnyAvatar(body), body, kat: 'vlasy', novy: true, prve, potvrd: false, krok: 1 };
}
// Účet rodiča (3.5): odomknutie PIN-om je len v pamäti, samo sa zamkne po 5 minútach nečinnosti, pri zmene dieťaťa a pri odhlásení
const Rodic = {
  odomknute: false, do: 0, MINUT: 5,
  odomkni() { this.odomknute = true; this.do = Date.now() + this.MINUT * 60000; },
  zamkni() { this.odomknute = false; this.do = 0; },
  // každé volanie počas odomknutia je „aktivita“ a predĺži čas
  jeOdomknute() {
    if (!this.odomknute) return false;
    if (Date.now() > this.do) { this.zamkni(); return false; }
    this.do = Date.now() + this.MINUT * 60000; return true;
  },
  // prechod na obrazovku rodiča: fázy rodicTvorba, rodicPin, rodic, rodicDieta (id dieťaťa), rodicNastavenia; aj 'vyber'
  chod(faza, id) {
    Hlas.stop();
    if (!String(faza).startsWith('rodic')) this.zamkni(); // odchod z rodičovskej zóny = zamknúť
    if (id !== undefined) st.rodicDieta = id;
    st.flow = null; st.faza = faza; render(); scrollTo(0, 0);
  },
  // jednorazový prenos lokálnych prepínačov vädnutia (hnitie-<dieťa>) do cloudu, ak tam ešte nie sú; lokálna kópia ostáva
  async prevezmiLokalne() {
    const C = window.Cloud, p = C && C.rodic.profil;
    if (!p) return false;
    const cloud = (p.nastavenia && p.nastavenia.hnitie) || {}, nove = {};
    for (const d of C.deti) { const v = S.get('hnitie-' + d.id, null); if (v !== null && !(d.id in cloud)) nove[d.id] = v !== false; }
    if (!Object.keys(nove).length) return false;
    await C.rodicUloz({ nastavenia: { hnitie: nove } });
    return true;
  },
};

/* 5.0 Vstup: všetky kroky drží pokope tá istá krajina s cestou. Hotová zastávka má fajku, práve otvorená je žltá s číslom.
   k = index otvorenej zastávky, n = počet zastávok (0 = krajina bez zastávok). Farby krajiny sú --sc-* (deň aj noc v 50-domov.css). */
function kresbaVstup(k = 0, n = 0) {
  const X = n === 3 ? [70, 180, 290] : n === 2 ? [110, 250] : [], Y = x => x < 120 ? 112 - (x - 70) * .1 : x < 200 ? 98 + Math.abs(x - 180) * .12 : 104 + (x - 250) * .1;
  const t = (x, y, s, c, txt) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="${s}" fill="${c}">${txt}</text>`;
  const zn = X.map((x, i) => { const y = +Y(x).toFixed(1);
    return i < k ? `<circle cx="${x}" cy="${y}" r="13" fill="var(--teal)" stroke="var(--ink)" stroke-width="2.5"/><path d="M${x - 5.5} ${y}l4 4l7-8" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`
      : i === k ? `<g class="vs-zast"><circle cx="${x}" cy="${y}" r="17" fill="var(--sun)" stroke="var(--ink)" stroke-width="3"/>${t(x, y + 6, 17, 'var(--dk)', i + 1)}</g>`
      : `<circle cx="${x}" cy="${y}" r="13" fill="var(--sc-path)" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="4 4"/>${t(x, y + 4.5, 12.5, 'var(--muted)', i + 1)}`; }).join('');
  const cesta = 'M-10 120C20 114 40 114 70 112S140 98 180 98S250 110 290 108S340 100 372 92';
  return `<svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect width="360" height="150" fill="var(--sc-sky)"/>
    <circle cx="296" cy="50" r="15" fill="var(--sc-sun)"/><circle cx="296" cy="50" r="24" fill="none" stroke="var(--sc-sun)" stroke-width="4" stroke-dasharray=".1 9" stroke-linecap="round"/>
    <g fill="var(--sc-cloud)"><ellipse cx="206" cy="52" rx="22" ry="8"/><circle cx="198" cy="46" r="9"/><circle cx="212" cy="43" r="11"/></g>
    <g fill="var(--sc-cloud)" opacity=".8"><ellipse cx="74" cy="34" rx="16" ry="6"/><circle cx="70" cy="30" r="7"/></g>
    <path d="M0 92C50 68 110 74 160 88C210 70 300 66 360 84V150H0Z" fill="var(--sc-far)"/>
    <path d="M0 118C70 96 150 100 210 112C270 122 320 108 360 102V150H0Z" fill="var(--sc-mid)"/>
    <path d="${cesta}" fill="none" stroke="var(--sc-path)" stroke-width="17" stroke-linecap="round"/><path d="${cesta}" fill="none" stroke="var(--sc-pathdot)" stroke-width="3.5" stroke-dasharray=".1 9" stroke-linecap="round"/>
    ${zn}</svg>`;
}
// privítanie: vyššia krajina s horou, vlajkou na vrchole a cestou, ktorá k nej vedie
function kresbaVitaj() {
  const strom = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-4" width="6" height="16" rx="2" fill="#8A5A3B" stroke="var(--ink)" stroke-width="2.5"/><circle cx="0" cy="-14" r="14" fill="var(--sc-tree)" stroke="var(--ink)" stroke-width="2.5"/></g>`;
  return `<svg viewBox="0 0 360 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect width="360" height="260" fill="var(--sc-sky)"/>
    <circle cx="300" cy="64" r="26" fill="var(--sc-sun)"/><circle cx="300" cy="64" r="38" fill="none" stroke="var(--sc-sun)" stroke-width="5" stroke-dasharray=".1 11" stroke-linecap="round"/>
    <g fill="var(--sc-cloud)"><ellipse cx="226" cy="110" rx="26" ry="9"/><circle cx="216" cy="103" r="11"/><circle cx="233" cy="100" r="13"/></g>
    <path d="M118 196L196 92Q202 84 208 92L292 196Z" fill="var(--sc-far2)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M186 106L196 92Q202 84 208 92L218 106Q210 112 202 104Q194 112 186 106Z" fill="var(--sc-snih)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M202 86V62" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><path d="M203 62L222 68L203 75Z" fill="var(--coral)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M0 176C60 150 120 158 170 176C230 156 300 152 360 168V260H0Z" fill="var(--sc-far)"/>
    <path d="M0 214C80 186 170 190 230 206C290 220 330 204 360 198V260H0Z" fill="var(--sc-mid)"/>
    <path d="M170 262C176 240 196 230 214 214S226 186 206 168" fill="none" stroke="var(--sc-path)" stroke-width="15" stroke-linecap="round"/>
    <path d="M170 262C176 240 196 230 214 214S226 186 206 168" fill="none" stroke="var(--sc-pathdot)" stroke-width="3.5" stroke-dasharray=".1 9" stroke-linecap="round"/>
    ${strom(300, 214)}${strom(326, 206, .75)}${strom(268, 222, .6)}
    <path d="M0 240C90 226 210 232 360 238V260H0Z" fill="var(--sc-front)"/></svg>`;
}
const vstupHlava = (k, n, spat) => `<div class="vs-sc">${kresbaVstup(k, n)}${spat ? `<button type="button" class="btn kruh dve vs-spat" ${spat} aria-label="Späť">${ikn('spat')}</button>` : ''}</div>`;
const vstupNadpis = (dop, h, p) => `<div class="vs-nadp">${dop ? `<span class="dop">${dop}</span>` : ''}<h1 class="n0">${h}</h1>${p ? `<p class="tx">${p}</p>` : ''}</div>`;
const sipkaTl = text => `${text}${ikn('sipka', 'ikn-po')}`;

const brany = {
  nacitava: () => `<div class="brana vs vs-stred"><div class="brana-owl">${owl('hi')}</div>${logo()}<p class="podtitul">${PODTITUL}</p><p class="tx vs-muted"><span class="koliesko"></span>${st.sprava || 'Načítava sa…'}</p></div>`,
  bezNetu: () => `<div class="brana vs vs-stred"><div class="brana-owl">${owl('oops')}</div><h1 class="n0">Treba internet</h1>
      <p class="tx vs-muted">Na prvé prihlásenie potrebuje appka internet. Potom už pôjde aj bez neho.</p><button class="btn wide" data-reload>${ikn('znova')}Skúsiť znova</button></div>`,
  chybaNacitania: () => `<div class="brana vs vs-stred"><div class="brana-owl">${owl('oops')}</div><h1 class="n0">Nepodarilo sa načítať</h1>
      <p class="tx vs-muted">${esc((window.Cloud && window.Cloud.chybaNacitania) || 'Chýba internet alebo je spojenie pomalé.')}</p>
      <button class="btn wide" data-reload>${ikn('znova')}Skúsiť znova</button><button class="btn dve wide" data-ucet="odhlas">Odhlásiť sa</button></div>`,
  prihlasenie: () => {
    // počas prihlasovania sa na tlačidle točí koliesko a tlačidlá sú zablokované (žiadne dvojité ťuknutie)
    // úvod má tri kroky: voľba (Mám účet / Som tu nový), potom vlastná obrazovka pre každú cestu
    const C = window.Cloud || {}, p = C.pracuje || '', zam = p ? ' disabled' : '', krok = st.uvodKrok || 'volba', ch = C.chyby || {};
    const napis = (co, text, cakaj = 'Chvíľku…') => p === co ? `<span class="koliesko"></span>${cakaj}` : text;
    const oko = id => `<button type="button" class="vs-oko" data-ukaz-heslo="${id}" aria-label="Ukázať heslo" aria-pressed="false">${ikn('oko')}</button>`;
    const pole = (id, typ, nazov, ph, ac, enter, kl) => `<div class="pole${ch[kl] ? ' zle' : ''}"><label class="vs-lbl" for="${id}">${nazov}</label>
      <span class="vs-vstup"><input id="${id}" class="input${ch[kl] ? ' zle' : ''}" type="${typ}" placeholder="${ph}" autocomplete="${ac}" autocapitalize="none" spellcheck="false" enterkeyhint="${enter}" aria-invalid="${ch[kl] ? 'true' : 'false'}"${ch[kl] ? ` aria-describedby="${id}-chyba"` : ''}>${typ === 'password' ? oko(id) : ''}</span>
      ${ch[kl] ? `<p class="chyba" id="${id}-chyba" role="alert">${esc(ch[kl])}</p>` : ''}</div>`;
    const vseobecna = C.chyba ? `<p class="chyba vs-chyba" role="alert">${esc(C.chyba)}</p>` : '';
    const spat = `data-uvod="volba"${zam}`;
    const google = text => `<div class="vs-alebo"><span>alebo</span></div>
        <button type="button" class="btn dve wide google" data-ucet="google"${zam}>${napis('google', `<span class="g">G</span>${text}`, 'Otvára sa Google…')}</button>`;
    if (krok === 'mam') return `<div class="brana vs">${vstupHlava(-1, 0, spat)}<div class="vs-telo">
      ${vstupNadpis('Prihlásenie', 'Vitajte späť', 'Prihláste sa a nájdete svoje deti aj ich body.')}
      <form id="prihlas-form" class="vs-form" data-forma="prihlas" novalidate>
        ${pole('email', 'email', 'E-mail', 'rodic@example.sk', 'email', 'next', 'email')}
        ${pole('heslo', 'password', 'Heslo', '', 'current-password', 'go', 'heslo')}
        <button type="button" class="link" data-ucet="zabudol"${zam}>Zabudli ste heslo?</button>
        <button type="submit" class="btn wide"${zam}>${napis('prihlas', sipkaTl('Prihlásiť sa'), 'Prihlasujem…')}</button>
      </form>
      ${google('Prihlásiť sa cez Google')}
      ${vseobecna}</div></div>`;
    if (krok === 'novy') return `<div class="brana vs">${vstupHlava(0, 3, spat)}<div class="vs-telo">
      ${vstupNadpis('Krok 1 z 3 · pre rodiča', 'Vytvoríme váš účet', 'Účet je pre rodiča. Deti pridáte v ďalšom kroku a každé má svoje body.')}
      <form id="prihlas-form" class="vs-form" data-forma="registruj" novalidate>
        ${pole('email', 'email', 'E-mail', 'rodic@example.sk', 'email', 'next', 'email')}
        ${pole('heslo', 'password', 'Heslo (aspoň 6 znakov)', '', 'new-password', 'next', 'heslo')}
        ${pole('heslo2', 'password', 'Heslo ešte raz', '', 'new-password', 'go', 'heslo2')}
        <button type="submit" class="btn wide"${zam}>${napis('registruj', sipkaTl('Vytvoriť účet'), 'Vytváram…')}</button>
      </form>
      ${google('Pokračovať cez Google')}
      ${vseobecna}</div></div>`;
    return `<div class="brana vs vs-vitaj"><div class="vs-sc vs-sc-vitaj">${kresbaVitaj()}<div class="vs-mudra">${mudra('ahoj', { tien: false })}</div><p class="odkaz vs-rec">Ahoj! Poďme spolu objavovať svet.</p></div>
      <div class="vs-telo vs-stred">${logo()}<p class="podtitul">${PODTITUL}</p>
      <p class="tx vs-muted">Krátke témy o svete na rozhovor s deťmi. Pokrok každého dieťaťa sa ukladá do účtu.</p>
      <button type="button" class="btn wide" data-uvod="novy">${sipkaTl('Som tu nový')}</button>
      <button type="button" class="btn dve wide" data-uvod="mam">Mám účet</button>
      <p class="vs-mala">Predtým Svet za 3 minúty</p>
      ${Plocha.tip()}</div></div>`;
  },
  vyber: () => RodicBrana.vyber(brany.vyberPovodny),
  // <!--rodic--> nahradí RodicBrana.vyber kartou pre rodiča (PIN a prehľad)
  vyberPovodny: () => {
    const C = window.Cloud, deti = C ? C.deti : [];
    return `<div class="brana vs vs-vyber">${vstupHlava(-1, 0, '')}<div class="vs-telo">
      ${vstupNadpis('', 'Kto sa dnes učí?', 'Ťukni na svoju postavičku.')}
      <div class="deti">${deti.map(d => `<button class="dieta" data-dieta="${d.id}"><span class="kruh-av" style="--bg:${d.avatar.pozadie}">${postavicka(d.avatar)}</span>
          <b>${esc(d.meno)}</b><small>${vekText(d.vek)}</small><span class="st cis">${ikn('hviezda')}${d.body || 0}</span></button>`).join('')}
        ${deti.length < 4 ? `<button class="dieta nove" data-nove-dieta><span class="plus">${ikn('plus')}</span><b>Pridať dieťa</b><small>najviac 4 deti</small></button>` : ''}</div>
      <!--rodic-->
      <div class="vs-ucet"><p class="tx vs-muted">Účet rodiča: <b>${esc(C && C.pouzivatel ? C.pouzivatel.email || '' : '')}</b></p>
      <button class="btn dve maly" data-ucet="odhlas">${ikn('odhlas')}Odhlásiť sa</button></div></div></div>`;
  },
  tvorba: () => {
    const u = st.upravuje, maDeti = window.Cloud && window.Cloud.deti.length;
    const n = u.novy ? (u.prve ? 3 : 2) : 0, z = n === 3 ? 1 : 0, krok = u.novy ? (u.krok || 1) : 0;
    const zmaz = u.novy || (maRodica() && !Rodic.jeOdomknute()) ? '' : u.potvrd
      ? `<div class="up-potvrd" role="alert"><b>Naozaj odstrániť profil ${esc(u.meno)}?</b><p class="tx">Body a prebraté témy tohto dieťaťa sa stratia.</p>
          <div class="tests"><button class="btn zle" data-zmazat-ano>Áno, odstrániť</button><button class="btn dve" data-zmazat-nie>Nie</button></div></div>`
      : '<button class="link center" data-zmazat>Odstrániť tento profil</button>';
    const odhlas = maDeti ? '' : '<button type="button" class="link center" data-ucet="odhlas">Odhlásiť sa</button>';
    const vek = `<div class="seg2" role="group" aria-label="Vek"><button data-uvek="mladsi" aria-pressed="${u.vek === 'mladsi'}">5–8 rokov</button><button data-uvek="starsi" aria-pressed="${u.vek === 'starsi'}">9–12 rokov</button></div>`;
    const meno = `<input id="meno-dietata" class="input" maxlength="20" placeholder="Napríklad Emka" autocomplete="off" enterkeyhint="done">`;
    if (krok === 1) return `<div class="brana vs tvorba">${vstupHlava(z, n, maDeti ? 'data-spat' : '')}<div class="vs-telo">
      ${vstupNadpis(`Krok ${z + 1} z ${n}`, u.prve ? 'Kto sa bude učiť?' : 'Nové dieťa', 'Podľa veku vyberieme témy a hry. Ďalšie deti pridáte neskôr, najviac štyri.')}
      <div class="pole"><label class="vs-lbl" for="meno-dietata">Meno dieťaťa</label>${meno}</div>
      <div class="pole"><span class="vs-lbl">Vek</span>${vek}</div>
      <div class="vs-info">${ikn('stit')}<p>Meno uvidia len priatelia, a to iba vtedy, keď ich neskôr zapnete. E-mail nevidí nikto.</p></div>
      <button class="btn wide" data-tvorba-dalej>${sipkaTl('Ďalej: postavička')}</button>
      ${odhlas}</div></div>`;
    if (krok === 2) return `<div class="brana vs tvorba up">${vstupHlava(z + 1, n, 'data-tvorba-spat')}<div class="vs-telo">
      ${vstupNadpis(`Krok ${z + 2} z ${n} · ${esc(u.meno)}`, 'Postavička', 'Vyberte spolu účes, oči a farby. Kto sa nechce hrať, ťukne na kocku.')}
      ${satnik()}
      <button class="btn wide" data-ulozit-dieta>${ikn('check')}Hotovo, poďme na to!</button>
      ${odhlas}</div></div>`;
    // úprava postavičky dieťaťa, ktoré už existuje: šatník
    return `<div class="brana tvorba up up-uprava">
      <div class="up-hl"><button class="btn kruh dve" data-spat aria-label="Späť">${ikn('spat')}</button><h1 class="n1">Moja postavička</h1><span class="st cis">${ikn('hviezda')}${u.body || 0}</span></div>
      ${satnik(true)}
      <div class="up-zakl"><div class="pole"><label class="vs-lbl" for="meno-dietata">Meno</label>${meno}</div><div class="pole"><span class="vs-lbl">Vek</span>${vek}</div></div>
      <div class="up-spodok"><button class="btn wide" data-ulozit-dieta>${ikn('check')}Uložiť</button>${zmaz}</div>
      ${maDeti ? '' : odhlas}</div>`;
  },
};
// šatník: busta v kruhu na žltom javisku, kategórie, veci s rovnako vysokým pásikom dole (cena, Mám, Na sebe), najbližšia odmena
function satnik(uprava) {
  const u = st.upravuje;
  return `<div class="up-javisko"><svg class="up-luce" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<path d="M100 100L${(100 + 160 * Math.cos((i * 30 - 6) * Math.PI / 180)).toFixed(1)} ${(100 + 160 * Math.sin((i * 30 - 6) * Math.PI / 180)).toFixed(1)}L${(100 + 160 * Math.cos((i * 30 + 6) * Math.PI / 180)).toFixed(1)} ${(100 + 160 * Math.sin((i * 30 + 6) * Math.PI / 180)).toFixed(1)}Z"/>`).join('')}</svg>
      <div class="av-nahlad kruh-av" id="av-nahlad" style="--bg:${u.avatar.pozadie}"><div id="av-velky">${postavicka(u.avatar)}</div></div>
      <button class="btn kruh dve kocka" data-nahodne aria-label="Náhodná postavička">${ikn('kocka')}</button></div>
    <div class="up-taby" id="av-tabs">${avTaby()}</div>
    <div class="veci" id="av-moznosti">${avMoznosti()}</div>
    ${uprava ? `<div id="up-najblizsia">${najblizsiaVec()}</div>` : ''}`;
}
function najblizsiaVec() {
  const u = st.upravuje, b = u.body || 0, o = ODMENY.find(x => x.cena > b);
  if (!o) return '';
  const pred = ODMENY.filter(x => x.cena <= b).pop(), od = pred ? pred.cena : 0;
  return `<div class="up-najblizsia"><p class="tx">Najbližšie odomkneš <b>${esc(NAZVY_ODMIEN[o.kluc] || 'novú vec')}</b>. Chýba ešte <b class="cis">${o.cena - b}</b> bodov.</p>
    <div class="pruh" aria-hidden="true"><i style="width:${Math.max(4, Math.round((b - od) / (o.cena - od) * 100))}%"></i></div></div>`;
}
function avTaby() { return AV_KAT.map(([k, n]) => `<button class="up-tab" data-avkat="${k}" aria-pressed="${st.upravuje.kat === k}">${n}</button>`).join(''); }
// zamknutý diel: dieťa ešte nemá dosť bodov (diel, ktorý už má na sebe, ostáva voľný)
const zamok = (k, v) => cenaDielu(k, v) > (st.upravuje.body || 0) && st.upravuje.avatar[k] !== v ? ' zamknute' : '';
function avMoznosti() {
  const u = st.upravuje, k = u.kat, farba = AV_FARBY.includes(k);
  const veci = AV[k].map(v => {
    const c = cenaDielu(k, v), na = u.avatar[k] === v, zam = !!zamok(k, v), meno = NAZVY_ODMIEN[k + ':' + v] || (farba ? 'farba' : v);
    const dolu = na ? 'Na sebe' : zam ? `<span class="cena">${ikn('hviezda')}${c}</span>` : c ? `${ikn('check')}Mám` : 'Zadarmo';
    // pri účese bez čiapky, inak by pod ňou všetky účesy vyzerali rovnako
    const obr = farba ? `<i class="vec-farba" style="--f:${v}"></i>`
      : `<span class="kruh-av" style="--bg:${u.avatar.pozadie}">${postavicka({ ...u.avatar, [k]: v, ...(k === 'vlasy' ? { doplnok: 'ziadny' } : {}) })}</span>`;
    return `<button class="vec av-opt${farba ? ' farba' : ''}${na ? ' na' : ''}${zam ? ' zam zamknute' : ''}" data-cena="${c}" data-avvol="${v}" aria-pressed="${na}" aria-label="${esc(meno)}${zam ? `, odomkne sa pri ${c} bodoch` : ''}">
      ${zam ? `<span class="zmk">${ikn('zamok')}</span>` : ''}<span class="vec-obr">${obr}</span><span class="dolu">${dolu}</span></button>`;
  }).join('');
  const viac = u.novy && !(u.body > 0) ? `<div class="vec viac">${ikn('hviezda')}<span>Veci s cenou ${u.meno ? esc(u.meno) + ' ' : ''}odomkne za body z tém.</span></div>` : '';
  return veci + viac;
}
Object.assign(brany, RodicBrana.brany, RodicPanel.views); // obrazky rodiča z rodic-brana.js a rodic-panel.js
function renderBrana() {
  document.body.classList.remove('tinted');
  main.classList.add('anim');
  main.innerHTML = brany[st.faza]();
  main.dataset.faza = st.faza;
  ocisluj();
  if (st.faza === 'prihlasenie' && document.getElementById('prihlas-form')) {
    // Enter na klávesnici skočí na ďalšie pole, z posledného odošle formulár
    const form = document.getElementById('prihlas-form'), polia = ['email', 'heslo', 'heslo2'].map(i => document.getElementById(i)).filter(Boolean);
    polia.forEach((el, i) => el.addEventListener('keydown', e => { if (e.key === 'Enter' && polia[i + 1]) { e.preventDefault(); polia[i + 1].focus(); } }));
    form.addEventListener('submit', e => {
      e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      const v = id => (document.getElementById(id) || {}).value || '';
      if (window.Cloud) window.Cloud.akcia(form.dataset.forma, v('email').trim(), v('heslo'), v('heslo2')); else toast('Prihlásenie sa ešte načítava, skúste o chvíľu.');
    });
    // oko pri hesle: ukáže alebo skryje napísané heslo (len vzhľad poľa, nič sa neodosiela)
    form.querySelectorAll('[data-ukaz-heslo]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const i = document.getElementById(b.dataset.ukazHeslo), ukaz = i.type === 'password';
      i.type = ukaz ? 'text' : 'password'; b.setAttribute('aria-pressed', ukaz); b.setAttribute('aria-label', ukaz ? 'Skryť heslo' : 'Ukázať heslo');
    }));
  }
  if (st.faza === 'tvorba') {
    const inp = document.getElementById('meno-dietata');
    if (inp) {
      inp.value = st.upravuje.meno;
      inp.addEventListener('input', () => { st.upravuje.meno = inp.value; });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
    }
    const t = document.querySelector('#av-tabs [aria-pressed="true"]');
    if (t && t.scrollIntoView) t.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  RodicBrana.po();
}
// Tiché prekreslenie brány v tej istej fáze (PIN, panel rodiča, výber detí): zmení len to, čo sa líši, bez animácie vstupu,
// takže nič nebliká, nevynuluje sa scroll ani rozpísané polia. Pri inej fáze sa vykreslí obvyklým spôsobom.
function renderTicho() {
  const top = document.getElementById('top');
  if (st.faza === 'appka' || !main.firstElementChild || main.dataset.faza !== st.faza || !top || !top.hidden || !brany[st.faza]) { render(); return; }
  const t = document.createElement('div'); t.innerHTML = brany[st.faza]();
  main.classList.remove('anim'); morph(main, t, true); ocisluj(); RodicBrana.po();
}
// po zmene dielu prekreslíme len náhľad a možnosti, stránka neskáče
function obnovTvorbu() {
  const u = st.upravuje, n = document.getElementById('av-nahlad');
  if (!n) return;
  document.getElementById('av-velky').innerHTML = postavicka(u.avatar);
  n.style.setProperty('--bg', u.avatar.pozadie);
  document.getElementById('av-moznosti').innerHTML = avMoznosti();
  document.getElementById('av-tabs').innerHTML = avTaby();
  const nb = document.getElementById('up-najblizsia'); if (nb) nb.innerHTML = najblizsiaVec();
  n.classList.remove('hopni'); void n.offsetWidth; n.classList.add('hopni');
}
function tvorbaKlik(b, d) {
  const u = st.upravuje;
  if (d.avkat) { u.kat = d.avkat; Zvuk.play('tap'); obnovTvorbu(); b = document.querySelector(`#av-tabs [data-avkat="${d.avkat}"]`); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); return true; }
  if (d.avvol) {
    const cena = cenaDielu(u.kat, d.avvol);
    if (cena > (u.body || 0) && u.avatar[u.kat] !== d.avvol) {
      Zvuk.play('tap'); toast(`Odomkne sa pri ${cena} bodoch. Chýba ešte ${cena - (u.body || 0)} bodov.`);
      b.classList.remove('trasie'); void b.offsetWidth; b.classList.add('trasie'); return true;
    }
    u.avatar[u.kat] = d.avvol; Zvuk.play('pop'); obnovTvorbu(); return true;
  }
  if (d.nahodne !== undefined) { u.avatar = nahodnyAvatar(u.body); Zvuk.play('boing'); obnovTvorbu(); const [x, y] = stred(b); FX.burst(x, y, 16, ['star', 'dot'], 6); return true; }
  if (d.uvek) {
    if (window.Cloud && maRodica() && !u.novy && d.uvek !== u.vek && !Rodic.jeOdomknute()) { Zvuk.play('bad'); toast('Vek dieťaťa mení rodič v paneli rodiča.'); return true; }
    u.vek = d.uvek; Zvuk.play('pop'); document.querySelectorAll('[data-uvek]').forEach(x => x.setAttribute('aria-pressed', x.dataset.uvek === u.vek)); return true; }
  // nové dieťa: z mena a veku na postavičku a späť
  if (d.tvorbaDalej !== undefined) {
    u.meno = u.meno.trim();
    if (!u.meno) { Zvuk.play('bad'); toast('Napíšte meno dieťaťa.'); const i = document.getElementById('meno-dietata'); if (i) { i.classList.add('zle'); i.focus(); } return true; }
    u.krok = 2; Zvuk.play('whoosh'); render(); scrollTo(0, 0); return true;
  }
  if (d.tvorbaSpat !== undefined) { u.krok = 1; Zvuk.play('whoosh'); render(); scrollTo(0, 0); return true; }
  if (d.ulozitDieta !== undefined) {
    u.meno = u.meno.trim();
    if (!u.meno) {
      Zvuk.play('bad'); toast('Napíšte meno dieťaťa.');
      const i = document.getElementById('meno-dietata'); if (i) i.focus(); else { u.krok = 1; render(); scrollTo(0, 0); }
      return true;
    }
    if (!window.Cloud) { toast('Ešte sa pripája, skúste o chvíľu.'); return true; }
    const [x, y] = stred(document.getElementById('av-nahlad'));
    Zvuk.play('win'); FX.burst(x, y, 30); FX.rain(60);
    window.Cloud.ulozDieta(u);
    return true;
  }
  if (d.zmazat !== undefined) { if (maRodica() && !Rodic.jeOdomknute()) return true; u.potvrd = true; render(); return true; }
  if (d.zmazatNie !== undefined) { u.potvrd = false; render(); return true; }
  if (d.zmazatAno !== undefined) { if (maRodica() && !Rodic.jeOdomknute()) return true; Zvuk.play('bad'); window.Cloud.zmazDieta(u.id); return true; }
  if (d.spat !== undefined) {
    Zvuk.play('whoosh'); Rodic.zamkni(); // tvorba otvorená z panela rodiča sa zatvorením zamkne
    if (!u.novy && st.dietaId) { st.faza = 'appka'; st.view = 'ja'; } else st.faza = 'vyber';
    render(); scrollTo(0, 0); return true;
  }
  return false;
}

