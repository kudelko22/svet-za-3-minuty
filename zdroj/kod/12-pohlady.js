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
      <section class="sec"><h2 class="h2">Oblasti tém</h2>
        <div class="skupiny rad">${(kk => SKUPINY.map((g, i) => skupinaKarta(g, kk, i)).join(''))(kats())}</div>
      </section>
      ${dalsie.length ? `<section class="sec"><h2 class="h2">Objavujte ďalej</h2>
        <div class="carousel">${dalsie.map(x => `<button class="cc" data-start="${x.id}" style="--c:${KAT[x.k].c}">${scene(x)}<b>${x.t}</b></button>`).join('')}</div></section>` : ''}`;
  },
  temy() {
    return `<h1 class="n0">Témy</h1>
      <input id="hladaj" class="search" type="search" placeholder="Hľadať, napríklad srdce" aria-label="Hľadať tému">
      <div class="chips" id="filtre"></div>
      <div id="zoznam" class="list"></div>`;
  },
  hry: () => hryZoznam(), // 5.0: ihrisko, kreslí 09-hry.js
  odznaky: () => zbierkaOdznakov(),
  misia: () => Misie.render(),
  anglictina: () => Ang.render(),
  // 5.0 Ja: preukaz objaviteľa s fotkou postavičky, kruh prebratých tém, zbierka (kartaOdznakov robí sekcia odznakov), nastavenia vzhľadu,
  // sprievodca, kategórie, uložené témy a rodina
  ja() {
    const vsetky = TV().length, h = TV().filter(t => st.done.includes(t.id)).length, s = seria(), obvod = 263.9;
    const f = st.fav.map(byId).filter(Boolean), C = window.Cloud, k = kats().sort((a, b) => b.hotovo / b.n - a.hotovo / a.n);
    const katRiadok = x => `<div class="ja-kat-r" style="--pc:${x.c}"><span>${x.nazov}</span><b class="cis">${x.hotovo}/${x.n}</b><div class="pruh"><i style="width:${Math.round(x.hotovo / x.n * 100)}%"></i></div></div>`;
    return `<section class="ja-preukaz prof-top"><div class="ja-preukaz-hl"><span>Preukaz objaviteľa</span>${logo()}</div>
        <button class="ja-foto kruh-av" data-upravit aria-label="Upraviť postavičku" style="--bg:${st.avatar.pozadie}">${postavicka(st.avatar)}</button>
        <div class="ja-udaje"><h1 class="n0">${esc(st.meno)}</h1><span class="st">${vekText(st.vek)}</span>
          <span class="ja-rad"><span class="st cis">${ikn('hviezda')}${st.body}</span><span class="st cis">${ikn('plamen')}${s} ${dni(s)}</span></span></div>
        <button class="btn dve maly wide ja-uprav" data-upravit>${ikn('ceruzka')}Upraviť postavičku, meno a vek</button></section>
      <section class="ja-kruh">
        <div class="ja-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="var(--card)" stroke="var(--ink)" stroke-width="3"/><circle cx="50" cy="50" r="42" fill="none" stroke="var(--sand)" stroke-width="9"/><circle cx="50" cy="50" r="42" fill="none" stroke="var(--leaf)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(h / vsetky * obvod).toFixed(1)} ${obvod}" transform="rotate(-90 50 50)"/></svg><b class="cis">${h}</b></div>
        <div><h2 class="n2">Prebraté témy</h2><p class="tx">${h === vsetky ? 'Všetky! Si skvelý.' : `${h} z ${vsetky}. Každá téma pridá body a kúsok kruhu.`}</p></div>
      </section>
      ${kartaOdznakov()}
      <div class="ja-vzhlad">${Rezim.karta()}${Pozadie.karta()}</div>
      <button class="ja-spr spr-karta" data-sprievodca><span class="ja-spr-sova">${mudra('ahoj', { tien: false })}</span><span class="odkaz"><b>Sprievodca appkou</b>Znova ti ukážem, čo kde je.</span><span class="btn kruh mud" aria-hidden="true">${ikn('hraj')}</span></button>
      ${maRodica() ? '' : prehladRodica()}
      <section class="karta ja-kat"><span class="zal" style="--c:var(--sky-l)">Podľa kategórií</span>
        ${k.slice(0, 4).map(katRiadok).join('')}
        ${k.length > 4 ? `<details class="ja-viac"><summary>Všetkých ${k.length} kategórií${ikn('dole')}</summary>${k.slice(4).map(katRiadok).join('')}</details>` : ''}
      </section>
      <section class="sec"><div class="ja-nh"><h2 class="n1">Uložené témy</h2><small class="cis">${f.length || ''}</small></div>
        ${f.length ? `<div class="list">${f.map(row).join('')}</div>` : `<div class="empty">${owl('hi')}<span>Zatiaľ nič. V téme ťukni na ${ii(IK.srdcePrazdne)} a nájdeš ju tu.</span></div>`}
      </section>
      ${Zvuk.ios ? `<section class="card prof">
        <span class="lbl">Zvuky</span>
        <div class="tests"><button class="btn mud" data-test-zvuk="web">${ikn('zvuk')}Test 1</button><button class="btn" data-test-zvuk="subor">${ikn('zvuk')}Test 2</button></div>
        <p class="muted">Ťuknite na oba testy a vyberte ten, ktorý počujete:</p>
        <div class="seg2"><button data-sposob="web" aria-pressed="${Zvuk.sposob === 'web'}">Počujem Test 1</button><button data-sposob="subor" aria-pressed="${Zvuk.sposob === 'subor'}">Počujem Test 2</button></div>
        <p class="diag" id="diag">${esc(Zvuk.diag())}</p>
      </section>` : ''}
      <section class="ja-rodina"><span class="dop">Rodina</span>
        ${maRodica() ? `<div class="ja-rad"><button class="btn dve maly" data-deti>${ikn('priatelia')}Zmeniť dieťa</button></div>` : `<p class="tx">Účet rodiča: ${esc(C && C.pouzivatel ? C.pouzivatel.email || '' : '')}<br><span id="cloud-stav">${esc(C ? C.stavUlozenia : '')}</span></p>
        <div class="ja-rad"><button class="btn dve maly" data-deti>${ikn('priatelia')}Zmeniť dieťa</button><button class="btn dve maly" data-ucet="odhlas">${ikn('odhlas')}Odhlásiť sa</button></div>
        <button class="btn dve maly wide" data-rodic-novy>${ikn('kluc')}Vytvoriť účet rodiča</button>
        ${Plocha.naPloche() ? '' : `<button class="btn dve maly wide" data-plocha>${ikn('domov')}Pridať appku na plochu</button>`}`}
      </section>
      <p class="ja-pata">${maRodica() ? '' : `Verzia appky ${VERZIA_NAZOV} · ${vsetky} tém. Pokrok každého dieťaťa sa ukladá do cloudu k účtu rodiča.<br>`}Obrázky emoji: <a href="https://openmoji.org" target="_blank" rel="noopener">OpenMoji</a> (licencia CC BY-SA 4.0).</p>`;
  },
};

