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
  const hlava = (nadpis, spat) => `<div class="rp-hlava">
      <button class="ib rp-spat" data-rp-${spat} aria-label="Späť">‹</button><h1 class="h1">${nadpis}</h1></div>`;
  const avatar = d => `<span class="kruh-av" style="--bg:${d.avatar.pozadie}">${postavicka(d.avatar)}</span>`;
  const zamykaci = () => `<div class="rp-spodok"><button class="btn blue" data-rp-zamknut>Zamknúť</button><button class="btn ghost" data-rp-vyber>Späť na výber</button></div>`;

  const views = {
    rodic() {
      if (brana()) return '';
      const C = cloud(), p = C.rodic.profil;
      if (!prevzate) { prevzate = true; Rodic.prevezmiLokalne().catch(() => {}); }
      stav().potvrd = null;
      return `<div class="brana rp"><h1 class="h1">${esc(p.meno || 'Rodič')}</h1><p class="muted">Tu vidíte, ako sa darí vašim deťom.</p>
        <div class="deti">${C.deti.map(d => {
          const t = tyzdenTem(d), s = serieDni(d.dni || []), ch = (d.chyby || []).length;
          return `<button class="dieta" data-rp-dieta="${esc(d.id)}">${avatar(d)}<b>${esc(d.meno)}</b>
            <small>${ii(STAR())} ${d.body || 0} bodov</small>
            <small>${t} ${slovoTem(t)} tento týždeň</small>
            <small>${ii(IK.ohen)} ${s} ${dni(s)} po sebe</small>
            <small>${ch ? ch + ' na zopakovanie' : 'bez chýb'}</small></button>`;
        }).join('')}</div>
        ${C.deti.length ? '' : '<p class="muted">Zatiaľ tu nie je žiadne dieťa. Pridajte ho v Nastaveniach.</p>'}
        <button class="btn wide" data-rp-nastavenia>Nastavenia</button>
        ${zamykaci()}</div>`;
    },
    rodicDieta() {
      if (brana()) return '';
      const C = cloud(), d = C.dieta(st.rodicDieta);
      if (!d) { setTimeout(() => Rodic.chod('rodic')); return ''; }
      if (C.rodicDietaOtvor) C.rodicDietaOtvor(d.id); // priatelia a správy tohto dieťaťa (idempotentné)
      const s = serieDni(d.dni || []);
      return `<div class="brana rp">${hlava(esc(d.meno), 'panel')}
        <div class="rp-dieta">${avatar(d)}<div><b>${ii(STAR())} ${d.body || 0} bodov</b><br><small>${ii(IK.ohen)} ${s} ${dni(s)} po sebe · ${vekText(d.vek)}</small></div></div>
        ${prehladRodica(d)}
        ${zamykaci()}</div>`;
    },
    rodicNastavenia() {
      if (brana()) return '';
      const C = cloud(), p = C.rodic.profil, rp = stav();
      return `<div class="brana rp">${hlava('Nastavenia', 'panel')}
        <section class="card prof"><span class="lbl">PIN rodiča</span>
          <p class="muted">PIN má 4 číslice a chráni tento panel.</p>
          <input id="rp-pin-star" class="input" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="Terajší PIN">
          <input id="rp-pin-nov" class="input" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="Nový PIN">
          <button class="btn blue" data-rp-zmen-pin>Zmeniť PIN</button></section>
        <section class="card prof"><span class="lbl">${ii(IK.rodina)} Účet</span>
          <p class="muted">E-mail účtu: <b>${esc(C.pouzivatel && C.pouzivatel.email || '')}</b></p>
          <button class="btn ghost" data-rp-odhlas>Odhlásiť sa</button></section>
        <section class="card prof"><span class="lbl">Deti</span>
          ${C.deti.map(d => `<div class="rp-riadok">${avatar(d)}<b>${esc(d.meno)}</b><button class="btn ghost" data-rp-uprav="${esc(d.id)}">Upraviť</button>
              ${rp.potvrd === d.id
                ? `<span class="rp-ano"><button class="btn red" data-rp-odstran-ano="${esc(d.id)}">Áno, odstrániť</button><button class="btn ghost" data-rp-nie>Nie</button></span>`
                : `<button class="btn ghost" data-rp-odstran="${esc(d.id)}">Odstrániť</button>`}</div>
            ${rp.potvrd === d.id ? '<p class="muted">Body a prebraté témy tohto dieťaťa sa stratia.</p>' : ''}`).join('') || '<p class="muted">Zatiaľ žiadne dieťa.</p>'}
          ${C.deti.length < 4 ? '<button class="btn" data-rp-pridaj>Pridať dieťa</button>' : '<p class="muted">Najviac 4 deti.</p>'}</section>
        <section class="card prof"><span class="lbl">Vädnutie stromu</span>
          <p class="muted">Ak dieťa dlho nehrá, jeho strom múdrosti pomaly vädne. Platí na všetkých zariadeniach.</p>
          ${C.deti.map(d => { const z = hnitieZapnute(d.id); return `<div class="rp-riadok">${avatar(d)}<b>${esc(d.meno)}</b><button class="btn ${z ? 'blue' : 'ghost'}" data-rp-hnitie="${esc(d.id)}" aria-pressed="${z}">${z ? 'Zapnuté' : 'Vypnuté'}</button></div>`; }).join('')}</section>
        <section class="card prof"><span class="lbl">Priatelia</span>
          <p class="muted">Priateľov a správy každého dieťaťa vidíte v jeho prehľade. Tam ich môžete aj zapnúť alebo vypnúť.</p>
          ${C.deti.map(d => `<div class="rp-riadok">${avatar(d)}<b>${esc(d.meno)}</b><button class="btn ghost" data-rp-dieta="${esc(d.id)}">Prehľad</button></div>`).join('')}</section>
        <section class="card prof"><span class="lbl">${ii(IK.bublina)} Hlas na čítanie</span><div id="hlasy">${hlasyHtml()}</div></section>
        ${Plocha.naPloche() ? '' : '<button class="btn wide" data-plocha>Pridať appku na plochu</button>'}
        <section class="card prof potvrd"><span class="lbl">Zmazať profil rodiča</span>
          <p class="muted">Panel a PIN zmiznú. Deti, ich pokrok a priatelia ostanú. Appka sa vráti do stavu bez účtu rodiča.</p>
          ${rp.potvrd === 'zmaz'
            ? '<div class="tests"><button class="btn red" data-rp-zmaz-ano>Áno, zmazať</button><button class="btn ghost" data-rp-nie>Nie</button></div>'
            : '<button class="btn ghost" data-rp-zmaz>Zmazať profil rodiča</button>'}</section>
        <p class="muted" style="font-size:.85rem">Verzia appky ${VERZIA_NAZOV}</p>
        ${zamykaci()}</div>`;
    },
  };

  const css = document.createElement('style');
  css.textContent = `.rp-hlava{display:flex;align-items:center;gap:10px;width:100%}.rp-hlava .h1{margin:0;flex:1;text-align:left}
.rp-spat{font-size:1.8rem;line-height:1}.rp-spodok{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px}
.rp-dieta{display:flex;align-items:center;gap:14px;width:100%}.rp-dieta .kruh-av{width:72px;aspect-ratio:1;flex:none}
.rp-riadok{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.rp-riadok .kruh-av{width:44px;aspect-ratio:1;flex:none}.rp-riadok b{flex:1;min-width:80px}
.rp-ano{display:flex;gap:8px;flex-wrap:wrap}.rp .prehlad{text-align:left}.rp .sec{width:100%}.rp .card{width:100%;text-align:left}`;
  if (document.head) document.head.appendChild(css);

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
    else if (d.rpZmenPin !== undefined) {
      const s = (document.getElementById('rp-pin-star') || {}).value || '', n = (document.getElementById('rp-pin-nov') || {}).value || '';
      if (!/^\d{4}$/.test(s) || !/^\d{4}$/.test(n)) { Zvuk.play('bad'); toast('PIN má mať 4 číslice.'); return true; }
      C.rodicZmenPin(s, n).then(() => { Zvuk.play('ok'); toast('PIN je zmenený.'); render(); }, e => { Zvuk.play('bad'); toast(chyba(e)); });
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
