/* Brána pred appkou: prihlásenie rodiča, výber dieťaťa a tvorba postavičky */
const vekText = v => v === 'starsi' ? '9–12 rokov' : '5–8 rokov';
function noveUpravovanie(prve) {
  const stary = prve && staryOk(), body = stary ? STARY.body || 0 : 0;
  return { id: null, meno: stary ? STARY.meno : '', vek: stary ? STARY.vek : 'mladsi', avatar: nahodnyAvatar(body), body, kat: 'vlasy', novy: true, prve, potvrd: false };
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
const brany = {
  nacitava: () => `<div class="brana"><div class="brana-owl">${owl('hi')}</div><h1 class="h1 logo" aria-label="Svetom">${logo().replace(/^<span class="logo" role="img" aria-label="Svetom">|<\/span>$/g, '')}</h1><p class="podtitul">${PODTITUL}</p><p class="muted"><span class="koliesko"></span>${st.sprava || 'Načítava sa…'}</p></div>`,
  bezNetu: () => `<div class="brana"><div class="brana-owl">${owl('oops')}</div><h1 class="h1">Treba internet</h1>
      <p class="muted">Na prvé prihlásenie potrebuje appka internet. Potom už pôjde aj bez neho.</p><button class="btn wide" data-reload>Skúsiť znova</button></div>`,
  chybaNacitania: () => `<div class="brana"><div class="brana-owl">${owl('oops')}</div><h1 class="h1">Nepodarilo sa načítať</h1>
      <p class="muted">${esc((window.Cloud && window.Cloud.chybaNacitania) || 'Chýba internet alebo je spojenie pomalé.')}</p>
      <button class="btn wide" data-reload>Skúsiť znova</button><button class="btn ghost wide" data-ucet="odhlas">Odhlásiť sa</button></div>`,
  prihlasenie: () => {
    // počas prihlasovania sa na tlačidle točí koliesko a tlačidlá sú zablokované (žiadne dvojité ťuknutie)
    // úvod má tri kroky: voľba (Mám účet / Som tu nový), potom vlastná obrazovka pre každú cestu
    const C = window.Cloud || {}, p = C.pracuje || '', zam = p ? ' disabled' : '', krok = st.uvodKrok || 'volba', ch = C.chyby || {};
    const napis = (co, text, cakaj = 'Chvíľku…') => p === co ? `<span class="koliesko"></span>${cakaj}` : text;
    const pole = (id, typ, ph, ac, enter, kl) => `<div class="pole"><input id="${id}" class="input${ch[kl] ? ' zle' : ''}" type="${typ}" placeholder="${ph}" autocomplete="${ac}" autocapitalize="none" spellcheck="false" enterkeyhint="${enter}" aria-invalid="${ch[kl] ? 'true' : 'false'}"${ch[kl] ? ` aria-describedby="${id}-chyba"` : ''}>${ch[kl] ? `<p class="chyba" id="${id}-chyba" role="alert">${esc(ch[kl])}</p>` : ''}</div>`;
    const vseobecna = C.chyba ? `<p class="chyba" role="alert">${esc(C.chyba)}</p>` : '';
    const spat = `<button type="button" class="btn ghost" data-uvod="volba"${zam}>Späť</button>`;
    const sova = `<div class="brana-owl">${owl('hi')}</div>`;
    if (krok === 'mam') return `<div class="brana">${sova}<h1 class="h1">Vitajte späť</h1>
      <p class="muted">Prihláste sa a nájdete svoje deti aj ich body.</p>
      <div class="card prof">
        <form id="prihlas-form" class="prof" data-forma="prihlas" novalidate>
          ${pole('email', 'email', 'E-mail', 'email', 'next', 'email')}
          ${pole('heslo', 'password', 'Heslo', 'current-password', 'go', 'heslo')}
          <button type="submit" class="btn blue"${zam}>${napis('prihlas', 'Prihlásiť sa', 'Prihlasujem…')}</button>
        </form>
        <button type="button" class="link" data-ucet="zabudol"${zam}>Zabudli ste heslo?</button>
        <div class="alebo"><span>alebo</span></div>
        <button type="button" class="btn google" data-ucet="google"${zam}>${napis('google', '<span class="g">G</span>Prihlásiť sa cez Google', 'Otvára sa Google…')}</button>
        ${vseobecna}
      </div>${spat}</div>`;
    if (krok === 'novy') return `<div class="brana">${sova}<h1 class="h1">Vytvoríme váš účet</h1>
      <p class="muted">Účet je pre rodiča. Deti si pridáte potom a každé má svoje body.</p>
      <div class="card prof">
        <form id="prihlas-form" class="prof" data-forma="registruj" novalidate>
          ${pole('email', 'email', 'E-mail', 'email', 'next', 'email')}
          ${pole('heslo', 'password', 'Heslo (aspoň 6 znakov)', 'new-password', 'next', 'heslo')}
          ${pole('heslo2', 'password', 'Heslo ešte raz', 'new-password', 'go', 'heslo2')}
          <button type="submit" class="btn blue"${zam}>${napis('registruj', 'Vytvoriť účet', 'Vytváram…')}</button>
        </form>
        <div class="alebo"><span>alebo</span></div>
        <button type="button" class="btn google" data-ucet="google"${zam}>${napis('google', '<span class="g">G</span>Pokračovať cez Google', 'Otvára sa Google…')}</button>
        ${vseobecna}
      </div>${spat}</div>`;
    return `<div class="brana">${sova}<h1 class="h1 logo" aria-label="Svetom">${logo().replace(/^<span class="logo" role="img" aria-label="Svetom">|<\/span>$/g, '')}</h1><p class="podtitul">${PODTITUL}</p>
      <p class="muted">Krátke témy o svete na rozhovor s deťmi. Pokrok každého dieťaťa sa ukladá do účtu.</p>
      <button type="button" class="btn blue wide" data-uvod="mam">Mám účet</button>
      <button type="button" class="btn wide" data-uvod="novy">Som tu nový</button>
      ${Plocha.tip()}</div>`;
  },
  vyber: () => RodicBrana.vyber(brany.vyberPovodny),
  vyberPovodny: () => {
    const C = window.Cloud, deti = C ? C.deti : [];
    return `<div class="brana"><h1 class="h1">Kto sa dnes učí?</h1>
      <div class="deti">${deti.map(d => `<button class="dieta" data-dieta="${d.id}"><span class="kruh-av" style="--bg:${d.avatar.pozadie}">${postavicka(d.avatar)}</span>
          <b>${esc(d.meno)}</b><small>${vekText(d.vek)} · ${ii(STAR())} ${d.body || 0}</small></button>`).join('')}
        ${deti.length < 4 ? '<button class="dieta nove" data-nove-dieta><span class="plus">+</span><b>Pridať dieťa</b><small>najviac 4 deti</small></button>' : ''}</div>
      <p class="muted">Účet rodiča: <b>${esc(C && C.pouzivatel ? C.pouzivatel.email || '' : '')}</b></p>
      <button class="btn ghost wide" data-ucet="odhlas">Odhlásiť sa</button></div>`;
  },
  tvorba: () => {
    const u = st.upravuje, maDeti = window.Cloud && window.Cloud.deti.length;
    return `<div class="brana tvorba"><h1 class="h1">${u.novy ? 'Nové dieťa' : 'Moja postavička'}</h1>
      <div class="av-wrap"><div class="av-nahlad kruh-av" id="av-nahlad" style="--bg:${u.avatar.pozadie}"><div id="av-velky">${postavicka(u.avatar)}</div></div>
        <button class="kocka" data-nahodne aria-label="Náhodná postavička">${IK.kocka}</button></div>
      <div class="card prof">
        <label class="lbl" for="meno-dietata">Meno</label>
        <input id="meno-dietata" class="input" maxlength="20" placeholder="Napríklad Emka" autocomplete="off">
        <span class="lbl">Vek</span>
        <div class="seg2"><button data-uvek="mladsi" aria-pressed="${u.vek === 'mladsi'}">5–8 rokov</button><button data-uvek="starsi" aria-pressed="${u.vek === 'starsi'}">9–12 rokov</button></div>
      </div>
      <div class="chips av-tabs" id="av-tabs">${avTaby()}</div>
      <div class="av-moznosti" id="av-moznosti">${avMoznosti()}</div>
      <button class="btn wide cta" data-ulozit-dieta>Uložiť ✓</button>
      ${u.novy || (maRodica() && !Rodic.jeOdomknute()) ? '' : u.potvrd
        ? `<div class="card prof potvrd"><b>Naozaj odstrániť profil ${esc(u.meno)}?</b><p class="muted">Body a prebraté témy tohto dieťaťa sa stratia.</p>
            <div class="tests"><button class="btn red" data-zmazat-ano>Áno, odstrániť</button><button class="btn ghost" data-zmazat-nie>Nie</button></div></div>`
        : '<button class="link center" data-zmazat>Odstrániť tento profil</button>'}
      ${maDeti ? '<button class="btn ghost wide" data-spat>Späť</button>' : '<button type="button" class="link center" data-ucet="odhlas">Odhlásiť sa</button>'}</div>`;
  },
};
function avTaby() { return AV_KAT.map(([k, n]) => `<button class="chip" data-avkat="${k}" aria-pressed="${st.upravuje.kat === k}" style="--c:#4C7DFF">${n}</button>`).join(''); }
// zamknutý diel: dieťa ešte nemá dosť bodov (diel, ktorý už má na sebe, ostáva voľný)
const zamok = (k, v) => cenaDielu(k, v) > (st.upravuje.body || 0) && st.upravuje.avatar[k] !== v ? ' zamknute' : '';
function avMoznosti() {
  const u = st.upravuje, k = u.kat, farba = AV_FARBY.includes(k);
  return AV[k].map(v => farba
    ? `<button class="av-opt farba${zamok(k, v)}" data-cena="${cenaDielu(k, v)}" data-avvol="${v}" aria-pressed="${u.avatar[k] === v}" style="--f:${v}" aria-label="farba"></button>`
    // pri účese bez čiapky, inak by pod ňou všetky účesy vyzerali rovnako
    : `<button class="av-opt kruh-av${zamok(k, v)}" data-cena="${cenaDielu(k, v)}" data-avvol="${v}" aria-pressed="${u.avatar[k] === v}" style="--bg:${u.avatar.pozadie}" aria-label="${v}">${postavicka({ ...u.avatar, [k]: v, ...(k === 'vlasy' ? { doplnok: 'ziadny' } : {}) })}</button>`).join('');
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
  }
  if (st.faza === 'tvorba') {
    const inp = document.getElementById('meno-dietata');
    inp.value = st.upravuje.meno;
    inp.addEventListener('input', () => { st.upravuje.meno = inp.value; });
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
  document.getElementById('av-velky').innerHTML = postavicka(u.avatar);
  n.style.setProperty('--bg', u.avatar.pozadie);
  document.getElementById('av-moznosti').innerHTML = avMoznosti();
  document.getElementById('av-tabs').innerHTML = avTaby();
  n.classList.remove('hopni'); void n.offsetWidth; n.classList.add('hopni');
}
function tvorbaKlik(b, d) {
  const u = st.upravuje;
  if (d.avkat) { u.kat = d.avkat; Zvuk.play('tap'); obnovTvorbu(); return true; }
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
  if (d.ulozitDieta !== undefined) {
    u.meno = u.meno.trim();
    if (!u.meno) { Zvuk.play('bad'); toast('Napíšte meno dieťaťa.'); document.getElementById('meno-dietata').focus(); return true; }
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

