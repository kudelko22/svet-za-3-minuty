const views = {
  domov() {
    // 5.0: krajina s cestou k cieľu dnešnej témy, Múdra s odkazom, téma dňa ako lístok na výpravu (pomocník Domov je v 11-domov-tyzden.js)
    const t = tD(), k = KAT[t.k], dnes = key(new Date()), hot = st.kedy[t.id] === dnes;
    const datum = new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' });
    return `${Domov.krajina(t, hot)}
      <section class="dom-start" aria-label="Dnes">
        <div class="dom-hore"><p class="odkaz dom-rec">${Domov.odkaz(t, hot)}</p>
          <button class="dom-mud" data-sova aria-label="Sovička Múdra">${mudra(Domov.vyraz(hot))}</button>${StromKrajina.html()}</div>
        <article class="listok dom-listok hero${hot ? ' hotovy' : ''}">
          <div class="dl-hore">
            <div class="dl-rad"><span class="pec">Téma dňa</span><span class="dop">${datum}</span></div>
            <div class="dl-obr">${scene(t, 'sm')}${hot ? '<span class="pec dl-hotovo">Splnené</span>' : ''}</div>
            <span class="st dl-kat" style="--k:${k.c}"><span class="dl-kik">${ikKat(t.k)}</span>${k.nazov}</span>
            <h2 class="n1">${t.t}</h2>
            <p class="tx dl-tx">${teaser(t)}</p>
          </div>
          <div class="perf"></div>
          <div class="dl-dole">
            <button class="btn wide${hot ? ' dve' : ''}" data-start="${t.id}">${hot ? ikn('znova') + 'Zopakovať tému' : 'Poďme na to!' + ikn('sipka', 'za')}</button>
            ${kartaMisie(hot, t)}
          </div>
        </article>
      </section>
      ${location.hostname.endsWith('github.io') ? `
      <a class="presun" href="https://svet-za-3-minuty.web.app/">Appka má novú adresu: <b>svet-za-3-minuty.web.app</b>. Ťuknite sem a pridajte si ju na plochu.</a>` : ''}
      ${Pripomienka.html()}
      ${Domov.tyzden()}
      <div class="dom-nal">${Ang.karta()}<button class="nalepka objavuj-karta" data-go="objavuj" style="--c:var(--sun-l)"><span class="ikb">${ikn('lupa')}</span><b>Objavuj</b><small>Kvízy, iná téma a všetky oblasti</small></button></div>
      ${Domov.odmena()}
      ${Plocha.karta()}
      <div class="dom-mini">
        <button class="btn maly dve auto-mala" data-auto-start="${t.id}">${ikn('auto')}Režim do auta</button>
        <button class="btn maly dve" data-go="odznaky">${ikn('odznak')}Odznaky</button>
      </div>`;
  },
  objavuj() {
    const t = tD(), v = TV(), dalsie = [...Array(v.length).keys()].map(i => v[(denCislo() + 1 + i) % v.length]).filter(x => x !== t && !st.done.includes(x.id)).slice(0, 6);
    return `<div class="hra-top"><button class="ib" data-go="domov" aria-label="Späť domov">${IKO.zavriet}</button><h1 class="h1 hra-nazov">Objavuj</h1></div>
      <div class="acts kompakt">
        <button class="act${kvizMinuty('rychly') ? ' cas' : ''}" style="--c:#FF9F1C" data-kviz><span class="act-e">${IK.blesk}</span><b>Rýchly kvíz</b><small>${kvizPopis('rychly', '5 otázok a 2 životy, body raz za deň')}</small></button>
        <button class="act" style="--c:#4C7DFF" data-nahodna><span class="act-e" style="--j:2">${IK.kocka}</span><b>Iná téma</b><small>Nechajte sa prekvapiť, najviac 10 bodov</small></button>
        ${st.vek === 'starsi' ? `<button class="act${kvizMinuty('tazky') ? ' cas' : ''}" style="--c:#7C6CFF" data-kviz="tazky"><span class="act-e">${IK.mozog}</span><b>Ťažký kvíz</b><small>${kvizPopis('tazky', '8 ťažkých otázok a 3 životy, 15 bodov za každú, body raz za deň')}</small></button>
        <button class="act${kvizMinuty('vyzva') ? ' cas' : ''}" style="--c:#E0533F" data-kviz="vyzva"><span class="act-e">${IK.pohar}</span><b>Výzva</b><small>${kvizPopis('vyzva', '10 extra ťažkých otázok a 3 životy, 20 bodov za každú, body raz za deň')}</small></button>` : ''}
      </div>
      <section class="sec"><h2 class="h2" style="--hc:#2FBF71">Oblasti tém</h2>
        <div class="skupiny rad">${(kk => SKUPINY.map((g, i) => skupinaKarta(g, kk, i)).join(''))(kats())}</div>
      </section>
      ${dalsie.length ? `<section class="sec"><h2 class="h2" style="--hc:#4C7DFF">Objavujte ďalej</h2>
        <div class="carousel">${dalsie.map(x => `<button class="cc" data-start="${x.id}" style="--c:${KAT[x.k].c}">${scene(x)}<b>${x.t}</b></button>`).join('')}</div></section>` : ''}`;
  },
  temy() {
    return `<h1 class="h1">Témy</h1>
      <input id="hladaj" class="search" type="search" placeholder="Hľadať, napríklad srdce" aria-label="Hľadať tému">
      <div class="chips" id="filtre"></div>
      <div id="zoznam" class="list"></div>`;
  },
  hry: () => hryZoznam(), // 5.0: ihrisko, kreslí 09-hry.js
  odznaky: () => zbierkaOdznakov(),
  misia: () => Misie.render(),
  anglictina: () => Ang.render(),
  ja() {
    const vsetky = TV().length, h = TV().filter(t => st.done.includes(t.id)).length, s = seria(), obvod = 326.7;
    const f = st.fav.map(byId).filter(Boolean), C = window.Cloud;
    return `<div class="prof-top"><button class="av-ja kruh-av" data-upravit aria-label="Upraviť postavičku" style="--bg:${st.avatar.pozadie}">${postavicka(st.avatar)}</button>
        <div class="prof-meno"><h1 class="h1">${esc(st.meno)}</h1><span class="chip" style="--c:#4C7DFF">${vekText(st.vek)}</span></div></div>
      <button class="btn wide" data-upravit>${ii(IK.ceruzka)} Upraviť postavičku, meno a vek</button>
      <section class="stats">
        <div class="card ringc">
          <div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--text)" stroke-width="18"/><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--soft)" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--grass)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(h / vsetky * obvod).toFixed(1)} ${obvod}"/></svg><b>${h}/${vsetky}</b></div>
          <div><b class="lbl" style="font-size:1.3rem">Prebraté témy</b><br><small>${h === vsetky ? 'Všetky! Si skvelý.' : 'Každá téma pridá body a kúsok kruhu.'}</small></div>
        </div>
        <div class="card mini" style="--c:#FFF0B3"><b>${ii(STAR())} ${st.body}</b><small>bodov</small></div>
        <div class="card mini" style="--c:#FFE3C7"><b>${ii(IK.ohen)} ${s}</b><small>${dni(s)} po sebe</small></div>
      </section>
      ${kartaOdznakov()}
      ${Rezim.karta()}
      ${Pozadie.karta()}
      <button class="card spr-karta" data-sprievodca>${owl('hi')}<span><b>Sprievodca appkou</b><small>Sovička ti znova ukáže, čo kde je.</small></span><span class="auto-play">${IKO.play}</span></button>
      ${maRodica() ? '' : prehladRodica()}
      <section class="sec"><h2 class="h2" style="--hc:#B36BFF">Podľa kategórií</h2>
        <div class="card prog">${kats().map(k => `<div class="prog-r" style="--c:${k.c}"><span class="ico">${ikKat(k.id)}</span><span>${k.nazov}</span><b>${k.hotovo}/${k.n}</b><div class="bar"><i style="width:${Math.round(k.hotovo / k.n * 100)}%"></i></div></div>`).join('')}</div>
      </section>
      <section class="sec"><h2 class="h2" style="--hc:#FF5A5F">Uložené témy</h2>
        ${f.length ? `<div class="list">${f.map(row).join('')}</div>` : `<div class="empty">${owl('hi')}<span>Zatiaľ nič. V téme ťukni na ${ii(IK.srdcePrazdne)} a nájdeš ju tu.</span></div>`}
      </section>
      ${Zvuk.ios ? `<section class="card prof">
        <span class="lbl">Zvuky</span>
        <div class="tests"><button class="btn blue" data-test-zvuk="web">${ii(IK.repro)} Test 1</button><button class="btn" data-test-zvuk="subor">${ii(IK.repro)} Test 2</button></div>
        <p class="muted">Ťuknite na oba testy a vyberte ten, ktorý počujete:</p>
        <div class="seg2"><button data-sposob="web" aria-pressed="${Zvuk.sposob === 'web'}">Počujem Test 1</button><button data-sposob="subor" aria-pressed="${Zvuk.sposob === 'subor'}">Počujem Test 2</button></div>
        <p class="diag" id="diag">${esc(Zvuk.diag())}</p>
      </section>` : ''}
      <section class="card prof"><span class="lbl">${ii(IK.rodina)} Rodina</span>
        ${maRodica() ? `<div class="tests"><button class="btn blue" data-deti>Zmeniť dieťa</button></div>` : `<p class="muted">Účet: <b>${esc(C && C.pouzivatel ? C.pouzivatel.email || '' : '')}</b><br><span id="cloud-stav">${esc(C ? C.stavUlozenia : '')}</span></p>
        <div class="tests"><button class="btn blue" data-deti>Zmeniť dieťa</button><button class="btn ghost" data-ucet="odhlas">Odhlásiť sa</button></div>
        <button class="btn wide" data-rodic-novy>Vytvoriť účet rodiča</button>
        ${Plocha.naPloche() ? '' : '<button class="btn wide" data-plocha>Pridať appku na plochu</button>'}`}
      </section>
      <p class="muted" style="font-size:.85rem">${maRodica() ? '' : `Verzia appky ${VERZIA_NAZOV} · ${vsetky} tém. Pokrok každého dieťaťa sa ukladá do cloudu k účtu rodiča.<br>`}Obrázky emoji: <a href="https://openmoji.org" target="_blank" rel="noopener">OpenMoji</a> (licencia CC BY-SA 4.0).</p>`;
  },
};

