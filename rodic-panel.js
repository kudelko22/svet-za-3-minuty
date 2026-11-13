// Účet rodiča (3.5), úloha C: panel rodiča (rodic, rodicDieta, rodicNastavenia).
// views: { rodic, rodicDieta, rodicNastavenia } sa dopĺňajú do `brany` aj `views` (st.faza).
// Ak !Rodic.jeOdomknute(), každé vykreslenie aj každý klik presmeruje na Rodic.chod('rodicPin').
// klik(b, d): spracuje tlačidlá data-rp-*; vráti true, ak klik spracoval.
const RodicPanel = (() => {
  const cloud = () => window.Cloud;
  const chyba = e => (e && e.code === 'rodic/stary-pin') ? 'Starý PIN nesedí.' : (e && e.code === 'rodic/zly-pin') ? 'PIN má mať 4 číslice.' : 'Nepodarilo sa. Skúste to znova, keď bude internet.';
  let prevzate = false; // jednorazový prenos lokálnych prepínačov do cloudu
  const stav = () => st.rp || (st.rp = { potvrd: null });

  // presmerovanie, ak je zamknuté alebo profil rodiča neexistuje; vráti true, keď treba prestať kresliť
  function brana() {
    const C = cloud();
    if (!C || !C.rodic.profil) { setTimeout(() => Rodic.chod('vyber')); return true; }
    if (!Rodic.jeOdomknute()) { if (C.rodicDietaZavri) C.rodicDietaZavri(); setTimeout(() => Rodic.chod('rodicPin')); return true; }
    return false;
  }
  const serieDni = dni => {
    let n = 0; const d = new Date();
    if (!dni.includes(key(d))) d.setDate(d.getDate() - 1);
    while (dni.includes(key(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  const tyzdenTem = d => {
    const pon = new Date(); pon.setDate(pon.getDate() - (pon.getDay() + 6) % 7);
    const od = key(pon);
    return Object.entries(d.kedy || {}).filter(([id, k]) => k >= od && byId(id)).length;
  };
  const slovoTem = n => n === 1 ? 'téma' : n >= 2 && n <= 4 ? 'témy' : 'tém';
  const avatar = d => `<span class="kruh-av" style="--bg:${d.avatar.pozadie}">${postavicka(d.avatar)}</span>`;
  const sip = () => ikn('sipka', 'rd-sip');
  // prepínač: vyzerá ako prepínač, správa sa ako tlačidlo (atribút data-* nesie akciu)
  const prep = (zap, attr, popis) => `<button type="button" class="rd-prep" aria-pressed="${zap}" aria-label="${popis}" ${attr}><i></i></button>`;
  // dni tohto týždňa (Po až Ne): hotový deň je plný, dnes má žltý krúžok
  const tyzdenBodky = d => {
    const pon = new Date(); pon.setDate(pon.getDate() - (pon.getDay() + 6) % 7);
    const dnes = key(new Date()), dni = d.dni || [];
    return Array.from({ length: 7 }, (_, i) => { const x = new Date(pon); x.setDate(pon.getDate() + i); const k = key(x);
      return `<i class="${dni.includes(k) ? 'h' : ''}${k === dnes ? ' dn' : ''}" title="${DNI[i]}"></i>`; }).join('');
  };

  const views = {
    rodic() {
      if (brana()) return '';
      const C = cloud(), p = C.rodic.profil, dnes = key(new Date());
      if (!prevzate) { prevzate = true; Rodic.prevezmiLokalne().catch(() => {}); }
      stav().potvrd = null;
      return `<div class="brana rd">${rodicHlava('', 'Pre rodiča', true)}<div class="rd-telo">
        <div><h1 class="rd-n">Dobrý deň${p.meno && p.meno !== 'Rodič' ? ', ' + esc(p.meno) : ''}</h1><p class="rd-p">Tu vidíte, ako sa darí vašim deťom.</p></div>
        ${C.deti.map(d => {
          const t = tyzdenTem(d), s = serieDni(d.dni || []), ch = (d.chyby || []).length, hot = (d.dni || []).includes(dnes);
          return `<button class="rd-blok rd-dieta" data-rp-dieta="${esc(d.id)}">
            <span class="rd-dieta-h">${avatar(d)}<span class="rd-t"><b>${esc(d.meno)}</b><small>${vekText(d.vek)} · ${hot ? 'dnes hotovo' : 'dnes ešte bez témy'}</small></span>${sip()}</span>
            <span class="rd-cisla"><span><b class="cis">${d.body || 0}</b><small>bodov spolu</small></span><span><b class="cis">${t}</b><small>${slovoTem(t)} tento týždeň</small></span>
              <span><b class="cis">${s} ${dni(s)}</b><small>po sebe</small></span><span><b class="cis">${ch}</b><small>${ch ? 'na zopakovanie' : 'bez chýb'}</small></span></span>
            <span class="rd-tyzd"><span>Týždeň</span>${tyzdenBodky(d)}</span></button>`;
        }).join('')}
        ${C.deti.length ? '' : '<p class="rd-p">Zatiaľ tu nie je žiadne dieťa. Pridajte ho v Nastaveniach.</p>'}
        <div class="rd-blok">
          <button class="rd-riadok" data-rp-nastavenia>${ikn('nastav')}<span class="rd-t"><b>Nastavenia</b><small>PIN, deti, vädnutie stromu, hlas</small></span>${sip()}</button>
          <button class="rd-riadok" data-rp-vyber>${ikn('priatelia')}<span class="rd-t"><b>Späť na výber dieťaťa</b><small>Panel sa pritom zamkne</small></span>${sip()}</button>
        </div></div></div>`;
    },
    rodicDieta() {
      if (brana()) return '';
      const C = cloud(), d = C.dieta(st.rodicDieta);
      if (!d) { setTimeout(() => Rodic.chod('rodic')); return ''; }
      if (C.rodicDietaOtvor) C.rodicDietaOtvor(d.id); // priatelia a správy tohto dieťaťa (idempotentné)
      const s = serieDni(d.dni || []);
      return `<div class="brana rd">${rodicHlava('data-rp-panel', 'Prehľad dieťaťa', true)}<div class="rd-telo">
        <div class="rd-dieta-h rd-vel">${avatar(d)}<span class="rd-t"><b>${esc(d.meno)}</b><small><span class="cis">${d.body || 0}</span> bodov · <span class="cis">${s}</span> ${dni(s)} po sebe · ${vekText(d.vek)}</small></span></div>
        ${prehladRodica(d)}</div></div>`;
    },
    rodicNastavenia() {
      if (brana()) return '';
      const C = cloud(), rp = stav();
      return `<div class="brana rd">${rodicHlava('data-rp-panel', 'Nastavenia', true)}<div class="rd-telo">
        <section class="rd-blok"><h2 class="rd-h">Bezpečnosť a účet</h2>
          <div class="rd-riadok">${ikn('kluc')}<span class="rd-t"><b>PIN rodiča</b><small>4 číslice, chráni tento panel</small></span><button class="rd-akc" data-rp-pin-otvor aria-expanded="${!!rp.pin}">${rp.pin ? 'Zavrieť' : 'Zmeniť'}</button></div>
          ${rp.pin ? `<div class="rd-form rd-vnutri">
            <div class="pole"><label class="vs-lbl" for="rp-pin-star">Terajší PIN</label><input id="rp-pin-star" class="input" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></div>
            <div class="pole"><label class="vs-lbl" for="rp-pin-nov">Nový PIN</label><input id="rp-pin-nov" class="input" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></div>
            <button class="btn" data-rp-zmen-pin>Zmeniť PIN</button></div>` : ''}
          <div class="rd-riadok">${ikn('obalka')}<span class="rd-t"><b>Účet</b><small>${esc(C.pouzivatel && C.pouzivatel.email || '')}</small></span><button class="rd-akc" data-rp-odhlas>Odhlásiť</button></div></section>
        <section class="rd-blok"><h2 class="rd-h">Deti · najviac 4</h2>
          ${C.deti.map(d => `<div class="rd-riadok">${avatar(d)}<span class="rd-t"><b>${esc(d.meno)}</b></span>
              ${rp.potvrd === d.id ? '' : `<button class="rd-akc" data-rp-uprav="${esc(d.id)}">Upraviť</button><button class="rd-akc cerv" data-rp-odstran="${esc(d.id)}">Odstrániť</button>`}</div>
            ${rp.potvrd === d.id ? `<div class="rd-potvrd"><p class="rd-p">Odstrániť profil ${esc(d.meno)}? Body a prebraté témy tohto dieťaťa sa stratia.</p>
              <div class="rd-ano"><button class="btn zle" data-rp-odstran-ano="${esc(d.id)}">Áno, odstrániť</button><button class="btn dve" data-rp-nie>Nie</button></div></div>` : ''}`).join('') || '<p class="rd-pozn">Zatiaľ žiadne dieťa.</p>'}
          ${C.deti.length < 4 ? `<button class="rd-riadok" data-rp-pridaj>${ikn('plus')}<span class="rd-t"><b>Pridať dieťa</b></span></button>` : ''}</section>
        <section class="rd-blok"><h2 class="rd-h">Vädnutie stromu</h2>
          ${C.deti.map(d => { const z = hnitieZapnute(d.id); return `<div class="rd-riadok">${avatar(d)}<span class="rd-t"><b>${esc(d.meno)}</b></span>${prep(z, `data-rp-hnitie="${esc(d.id)}"`, 'Vädnutie stromu: ' + esc(d.meno))}</div>`; }).join('')}
          <p class="rd-pozn">Ak dieťa dlho nehrá, jeho strom múdrosti pomaly vädne. Platí na všetkých zariadeniach.</p></section>
        <section class="rd-blok"><h2 class="rd-h">Priatelia</h2>
          ${C.deti.map(d => `<button class="rd-riadok" data-rp-dieta="${esc(d.id)}">${avatar(d)}<span class="rd-t"><b>${esc(d.meno)}</b><small>priatelia a správy</small></span><span class="rd-akc">Prehľad</span></button>`).join('')}
          <p class="rd-pozn">Priateľov každého dieťaťa zapnete alebo vypnete v jeho prehľade.</p></section>
        <section class="rd-blok"><h2 class="rd-h">Toto zariadenie</h2>
          <div class="rd-riadok rd-stlpec">${ikn('zvuk')}<span class="rd-t"><b>Hlas na čítanie</b><small>Ťuknite na hlas a vypočujte si ho</small></span></div>
          <div class="rd-hlasy" id="hlasy">${hlasyHtml()}</div>
          <div class="rd-riadok">${ikn('vibr')}<span class="rd-t"><b>Vibrácie</b><small>Na Androide, na iPhone nie</small></span>${prep(Haptika.zapnute(), 'data-vibracie', 'Vibrácie')}</div>
          ${Plocha.naPloche() ? '' : `<button class="rd-riadok" data-plocha>${ikn('domov')}<span class="rd-t"><b>Pridať appku na plochu</b></span>${sip()}</button>`}</section>
        <section class="rd-blok rd-nebez"><h2 class="rd-h">Zmazať profil rodiča</h2>
          <p class="rd-pozn">Panel a PIN zmiznú. Deti, ich pokrok a priatelia ostanú. Appka sa vráti do stavu bez účtu rodiča.</p>
          ${rp.potvrd === 'zmaz'
            ? '<div class="rd-ano rd-vnutri"><button class="btn zle" data-rp-zmaz-ano>Áno, zmazať</button><button class="btn dve" data-rp-nie>Nie</button></div>'
            : '<div class="rd-vnutri rd-vpravo"><button class="rd-akc cerv" data-rp-zmaz>Zmazať profil rodiča</button></div>'}</section>
        <p class="rd-verzia">Svetom ${VERZIA_NAZOV}</p></div></div>`;
    },
  };

  function klik(b, d) {
    const k = Object.keys(d).find(x => x.startsWith('rp'));
    if (!k) return false;
    const C = cloud();
    if (!C || !C.rodic.profil) { Rodic.chod('vyber'); return true; }
    if (!Rodic.jeOdomknute()) { if (C.rodicDietaZavri) C.rodicDietaZavri(); Rodic.chod('rodicPin'); return true; }
    const rp = stav(), zavri = () => { if (C.rodicDietaZavri) C.rodicDietaZavri(); };
    const chod = (f, id) => { Zvuk.play('whoosh'); rp.potvrd = null; Rodic.chod(f, id); };
    if (d.rpDieta) { Zvuk.play('pop'); rp.potvrd = null; if (C.rodicDietaOtvor) C.rodicDietaOtvor(d.rpDieta); Rodic.chod('rodicDieta', d.rpDieta); }
    else if (d.rpPanel !== undefined) { zavri(); chod('rodic'); }
    else if (d.rpNastavenia !== undefined) chod('rodicNastavenia');
    else if (d.rpZamknut !== undefined) { zavri(); Rodic.zamkni(); chod('rodicPin'); }
    else if (d.rpVyber !== undefined) { zavri(); Rodic.zamkni(); chod('vyber'); }
    else if (d.rpHnitie) {
      const id = d.rpHnitie, ted = hnitieZapnute(id);
      C.rodicUloz({ nastavenia: { hnitie: { [id]: !ted } } }).then(() => { S.set('hnitie-' + id, !ted); Zvuk.play('tap'); toast(ted ? 'Vädnutie stromu je vypnuté.' : 'Vädnutie stromu je zapnuté.'); if (st.faza.startsWith('rodic')) renderTicho(); }, e => { Zvuk.play('bad'); toast(chyba(e)); });
    }
    else if (d.rpSoczapni !== undefined) {
      if (C.soc) socAkcia(C.soc.zapni(), () => { Zvuk.play('ok'); toast('Priatelia sú zapnutí.'); renderTicho(); });
    }
    else if (d.rpSocvypni !== undefined) {
      if (C.soc && confirm('Vypnúť priateľov pre ' + (C.dieta(st.rodicDieta) || {}).meno + '? Kód prestane platiť a priatelia nebudú môcť posielať správy.')) socAkcia(C.soc.vypni(), () => { toast('Priatelia sú vypnutí.'); render(); });
    }
    else if (d.rpPinOtvor !== undefined) { Zvuk.play('tap'); rp.pin = !rp.pin; renderTicho(); }
    else if (d.rpZmenPin !== undefined) {
      const s = (document.getElementById('rp-pin-star') || {}).value || '', n = (document.getElementById('rp-pin-nov') || {}).value || '';
      if (!/^\d{4}$/.test(s) || !/^\d{4}$/.test(n)) { Zvuk.play('bad'); toast('PIN má mať 4 číslice.'); return true; }
      C.rodicZmenPin(s, n).then(() => { Zvuk.play('ok'); toast('PIN je zmenený.'); rp.pin = false; render(); }, e => { Zvuk.play('bad'); toast(chyba(e)); });
    }
    else if (d.rpOdhlas !== undefined) { Zvuk.play('whoosh'); zavri(); C.akcia('odhlas', '', ''); }
    else if (d.rpUprav) {
      const x = C.dieta(d.rpUprav); if (!x) return true;
      Zvuk.play('pop'); // vek, meno a postavičku mení len odomknutý rodič; po uložení alebo Späť sa panel zamkne
      Object.assign(st, { upravuje: { id: x.id, meno: x.meno, vek: x.vek, avatar: { ...AV_ZAKLAD, ...x.avatar }, body: x.body || 0, kat: 'vlasy', novy: false, potvrd: false }, faza: 'tvorba' }); render(); scrollTo(0, 0);
    }
    else if (d.rpPridaj !== undefined) { Zvuk.play('pop'); Object.assign(st, { upravuje: noveUpravovanie(false), faza: 'tvorba' }); render(); scrollTo(0, 0); }
    else if (d.rpOdstran) { Zvuk.play('tap'); rp.potvrd = d.rpOdstran; renderTicho(); }
    else if (d.rpOdstranAno) { rp.potvrd = null; Zvuk.play('bad'); C.zmazDieta(d.rpOdstranAno); Rodic.chod('rodicNastavenia'); }
    else if (d.rpNie !== undefined) { rp.potvrd = null; renderTicho(); }
    else if (d.rpZmaz !== undefined) { Zvuk.play('tap'); rp.potvrd = 'zmaz'; renderTicho(); }
    else if (d.rpZmazAno !== undefined) {
      rp.potvrd = null; zavri();
      C.rodicZmaz().then(() => { toast('Profil rodiča je zmazaný.'); Rodic.chod('vyber'); }, e => { Zvuk.play('bad'); toast(chyba(e)); });
    }
    else return false;
    return true;
  }

  return { views, klik };
})();
