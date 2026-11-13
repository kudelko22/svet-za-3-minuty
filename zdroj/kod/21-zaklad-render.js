// úvodná obrazovka: zmizne najskôr 1,1 s po otvorení, keď je appka pripravená (najneskôr po 3,5 s)
const Uvod = {
  skry() { const u = document.getElementById('uvod'); if (!u || !u.isConnected || u.classList.contains('pryc')) return; u.classList.add('pryc'); setTimeout(() => u.remove(), 600); },
  skontroluj() { if (this.bolo) return; const t = performance.now(); if (st.faza === 'nacitava' && t < 3500) return; this.bolo = true; setTimeout(() => this.skry(), Math.max(0, 1100 - t)); },
};
function dokonci(f) {
  if (f.precvic) { f.zisk = 0; Object.assign(f, Precvic.prazdne()); return; }
  const c = Object.values(f.odp).filter(o => o.ok).length, dnes = key(new Date()), bodyPred = st.body;
  const qn = f.kroky.filter(x => x.t === 'q').length;
  if (f.typ === 'tema') {
    const prvy = !st.done.includes(f.id), dnesUz = !prvy && st.kedy[f.id] === dnes;
    // zopakovaná téma: desatina bodov, za tú istú tému najviac raz za deň
    f.zisk = prvy ? c * 10 + 10 : dnesUz ? 0 : c + 1;
    f.ina = f.id !== temaDna().id;
    if (f.ina) f.zisk = Math.min(10, f.zisk); // najviac bodov je za tému dňa
    Object.assign(f, { opakovanie: !prvy, dnesUz });
    if (prvy) { st.done.push(f.id); S.set('done', st.done); }
    zapisPrebrate(f.id);
  } else {
    // body za kvíz len raz za deň (každý druh zvlášť), aby sa nedali zbierať opakovaním
    const kl = 'kviz-' + (st.dietaId || 'x') + '-' + (f.vyzva ? 'vyzva' : f.tazky ? 'tazky' : 'rychly');
    f.dnesUz = S.get(kl, '') === dnes;
    f.zisk = f.dnesUz ? 0 : c * (f.vyzva ? 20 : f.tazky ? 15 : 10);
    S.set(kl, dnes);
    kvizZamkni(druhKvizu(f));
  }
  pripisBody(f.zisk);
  // deň (a strom múdrosti) len s aspoň jednou správnou odpoveďou
  if (c && !st.dni.includes(dnes)) { hnPredDnes = hnStupen(); st.dni.push(dnes); S.set('dni', st.dni.slice(-400)); }
  f.noveOdznaky = noveOdznaky(qn && c === qn ? (f.typ === 'kviz' ? (f.vyzva ? 'vyzva' : f.tazky ? 'tazky' : 'blesk') : 'bezchyby') : '', { uci: true });
  f.noveOdmeny = noveOdmeny(bodyPred, st.body);
  f.noveHry = noveHry(bodyPred, st.body);
}

function fitPozdrav() {
  try {
    const el = document.getElementById('pozdrav'), gut = el && el.closest('.gut'); if (!gut || !gut.clientWidth) return;
    const hi = el.closest('.hi'), tr = gut.querySelector('.top-r'), av = hi.querySelector('.av');
    el.style.fontSize = ''; el.classList.remove('pz-zalom', 'pz-lom');
    let fs = parseFloat(getComputedStyle(el).fontSize);
    const siroke = () => el.scrollWidth > el.clientWidth + 1; // obsah, ktorý sa nezmestil, vytŕča za stĺpec
    while (siroke() && fs > 16) { fs -= 1; el.style.fontSize = fs + 'px'; }
    if (siroke()) { // dlhé meno: zalomí sa medzi slovami a ešte sa trochu zmenší
      el.classList.add('pz-zalom');
      while (siroke() && fs > 12) { fs -= 1; el.style.fontSize = fs + 'px'; }
      if (siroke()) el.classList.add('pz-lom'); // až celkom nakoniec sa slovo smie zlomiť
    }
  } catch (e) { /* písmo sa nezmení */ }
}
addEventListener('resize', () => { fitPozdrav(); vyskaHlavicky(); });
try { document.fonts && document.fonts.ready.then(() => { fitPozdrav(); vyskaHlavicky(); }); } catch (e) { /* bez písiem */ }
function paintHead() {
  const el = document.getElementById('pozdrav');
  // 4.4: pozdrav má dva riadky: „Ahoj,“ a pod ním meno. Slovo sa nikdy nelámé, dlhé meno sa zmenší, aby sa zmestilo.
  const sk = st.meno ? `${st.meno}!` : '', gk = st.meno ? 'Ahoj,' : 'Ahoj!', kl = gk + '|' + sk;
  if (el.dataset.kl !== kl) {
    el.dataset.kl = kl; el.textContent = ''; el.style.fontSize = '';
    let i = 0;
    [[gk, false], [sk, true]].forEach(([w, meno]) => {
      if (!w) return;
      const g = document.createElement('span'); g.className = 'pz-w' + (meno ? ' pz-meno' : st.meno ? ' pz-ahoj' : '');
      // písmená sú inline-block, preto každé slovo je v nedeliteľnej skupine (.pz-s): zalomiť sa dá len medzi slovami
      let j = 0;
      w.split(' ').forEach((slovo, n) => {
        if (n) g.appendChild(document.createTextNode(' '));
        const sk2 = document.createElement('span'); sk2.className = 'pz-s';
        [...slovo].forEach(ch => {
          const s = document.createElement('span'); s.textContent = ch; s.style.setProperty('--k', i++);
          if (meno && ch === '!') s.className = 'pz-vykr'; // 5.0: na Domove je v hlavičke len meno (pozdrav hovorí Múdra), výkričník sa skryje
          j++; sk2.appendChild(s);
        });
        g.appendChild(sk2); j++;
      });
      el.appendChild(g);
    });
  }
  const b = document.getElementById('body');
  if (b.textContent !== String(st.body)) { b.textContent = st.body; const s = document.getElementById('stars'); s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
  document.body.classList.toggle('domov-v', st.view === 'domov' && st.faza === 'appka' && !st.flow && !st.hra && !st.auto); // 5.0: hlavička nad krajinou Domova
  const z = document.getElementById('snd'), zk = Zvuk.on ? 'on' : 'off';
  if (z.dataset.k !== zk) { z.dataset.k = zk; z.innerHTML = Zvuk.on ? ikn('zvuk') : ikn('zvuk').replace('</g>', '<path d="M3.5 4.5l17 15" stroke-width="2.6"/></g>'); } z.setAttribute('aria-pressed', Zvuk.on); z.hidden = st.view === 'domov' && st.faza === 'appka'; // na Domove tlačidlo zvuku nezavadzia
  const av = document.getElementById('av'), k = JSON.stringify(st.avatar);
  if (av.dataset.k !== k) {
    av.dataset.k = k; av.innerHTML = st.avatar ? postavicka(st.avatar) : owl('hi');
    av.classList.toggle('kruh-av', !!st.avatar); av.style.setProperty('--bg', st.avatar ? st.avatar.pozadie : 'transparent');
  }
  document.getElementById('nav-ja').classList.toggle('novinka', nevybrate() > 0);
  TyzStrom.maluj();
  fitPozdrav(); // až po stromčeku a tlačidle zvuku: ich šírka (ukázanie, skrytie) rozhoduje, koľko miesta ostane menu
  vyskaHlavicky();
}
// 5.0: kde končí hlavička (--top-v); krajina Domova siaha od vrchu stránky pod hlavičku až k lístku témy dňa
function vyskaHlavicky() {
  try { const t = document.getElementById('top'); if (t && !t.hidden && t.offsetHeight) document.documentElement.style.setProperty('--top-v', Math.round(t.getBoundingClientRect().bottom + scrollY) + 'px'); } catch (e) { /* ostane predvolená výška */ }
}
// koniec rozbehnutej hry, auta, angličtiny či misie predošlého dieťaťa (zmena dieťaťa, odhlásenie, zmena účtu)
function zrusAktivity() { try { Hlas.stop(); Hra.zrus(); Auto.zrus(); } catch (e) { /* nič sa nezastaví */ } st.auto = st.ang = st.misia = null; st.flow = null; }
function ocisluj() {
  [...main.children].forEach((el, i) => el.style.setProperty('--i', i));
  main.querySelectorAll('.step').forEach(s => [...s.children].forEach((el, j) => el.style.setProperty('--j', j)));
}

/* Tiché prekreslenie: porovná nový obsah s tým, čo je na obrazovke, a zmení len to, čo sa líši.
   Nezmenené prvky ostanú, takže sa nič nevymení, neprehrajú sa animácie a nič nebliká. */
function morph(a, b, koren) {
  if (!koren && (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName)) return false;
  if (a.nodeType !== 1) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return true; }
  if (!koren) [...a.attributes].forEach(t => { if (!b.hasAttribute(t.name)) a.removeAttribute(t.name); });
  if (!koren) [...b.attributes].forEach(t => { if (a.getAttribute(t.name) !== t.value) a.setAttribute(t.name, t.value); });
  const x = [...a.childNodes], y = [...b.childNodes];
  y.forEach((n, i) => {
    if (!x[i]) a.appendChild(n.cloneNode(true));
    else if (!morph(x[i], n)) a.replaceChild(n.cloneNode(true), x[i]);
  });
  x.slice(y.length).forEach(n => n.remove());
  return true;
}
// štítky so svetlou farbou kategórie dostanú tmavý text (kontrast)
function chipKontrast(root = document) {
  root.querySelectorAll('.chip[style*="--c"]:not(.tmavy)').forEach(el => {
    const h = (el.style.getPropertyValue('--c') || '').trim(), m = /^#([0-9a-f]{6})$/i.exec(h); if (!m) return;
    const c = [0, 2, 4].map(i => { const v = parseInt(m[1].substr(i, 2), 16) / 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    if (1.05 / (.2126 * c[0] + .7152 * c[1] + .0722 * c[2] + .05) < 3.6) el.classList.add('tmavy');
  });
}
try { if (typeof MutationObserver === 'function' && document.body && document.body.nodeType) { let pl = 0; new MutationObserver(() => { if (pl) return; pl = requestAnimationFrame(() => { pl = 0; chipKontrast(); }); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] }); } } catch (e) { /* bez kontrastu štítkov */ }
const Render = { nova: false, pocet: 0 }; // pocet: počítadlo prekreslení (na meranie v konzole)
function render(tichy) {
  Uvod.skontroluj();
  Rezim.pouzi(); Pozadie.pouzi();
  const brana = st.faza !== 'appka', auto = !brana && !!st.auto, hra = !brana && !auto && !!st.hra, flow = !brana && !auto && !hra && !!st.flow;
  const dm = !brana && !auto && !hra && !flow && st.view === 'priatel'; // rozhovor na celú obrazovku
  const ang = !brana && !auto && !hra && !flow && st.view === 'anglictina' && !!st.ang; // kvíz z angličtiny: bez hornej lišty a navigácie
  document.getElementById('top').hidden = brana || auto || hra || flow || dm || ang;
  document.getElementById('nav').hidden = brana || auto || hra || flow || dm || ang;
  document.body.classList.toggle('ang-rezim', ang);
  document.body.classList.toggle('auto-rezim', auto);
  document.body.classList.toggle('dm-rezim', dm);
  document.body.classList.toggle('hra-rezim', hra);
  if (brana || auto || hra || flow) document.body.classList.remove('domov-v'); // 5.0: trieda Domova nesmie ostať v téme, kvíze, hre a aute
  if (brana) { renderBrana(); return; }
  if (auto) { renderAuto(); return; }
  if (hra) { renderHra(); return; }
  if (flow) { renderFlow(); return; }
  document.body.classList.remove('tinted');
  const html = views[st.view]();
  // Tá istá obrazovka (rovnaký pohľad, nič iné ju medzitým neprepísalo) sa prekreslí potichu: ostane scroll, fokus,
  // rozpísaný text a neprehrajú sa vstupné animácie. Nová obrazovka (alebo go()) sa vykreslí celá s animáciou.
  const kluc = st.view + '|' + (st.view === 'priatel' || st.view === 'priatelProfil' ? st.priatel : ''), prvy = main.firstElementChild;
  const ticho = !!prvy && typeof document.createElement === 'function' && (tichy === true || (prvy._rk === kluc && !Render.nova));
  const chat = st.view === 'priatel' && document.getElementById('chat'), chatDole = !chat || !ticho || chat.scrollHeight - chat.scrollTop - chat.clientHeight < 80;
  Render.nova = false; Render.pocet++;
  main.classList.remove('flow-dalej');
  if (ticho) {
    main.classList.remove('anim'); // bez 'anim', aby vymenené prvky neprehrali vstupnú animáciu
    const t = document.createElement('div'); t.innerHTML = html;
    ['filtre', 'zoznam'].forEach(id => { const a = document.getElementById(id), b = t.querySelector('#' + id); if (a && b && a._h) b.innerHTML = a.innerHTML; }); // zoznam tém dopĺňa fillTemy, morph ho nemá vyprázdniť
    morph(main, t, true);
  }
  else { main.classList.add('anim'); main.innerHTML = html; }
  if (main.firstElementChild) main.firstElementChild._rk = kluc;
  ocisluj();
  const navEl = document.getElementById('nav'); if (navEl && navEl.offsetHeight) document.documentElement.style.setProperty('--nav-v', navEl.offsetHeight + 'px');
  if (st.view === 'domov' && !document.querySelector('.oslava')) Novinky.skontroluj();
  if (st.view === 'domov' && !document.querySelector('.oslava')) RodicVyzva.skontroluj();
  if (st.view === 'priatel') { const ch = document.getElementById('chat'); if (ch && chatDole) ch.scrollTop = ch.scrollHeight; const So = socC(); if (So && So.precitaj) So.precitaj(st.priatel); }
  if (st.view === 'temy') {
    const inp = document.getElementById('hladaj');
    if (!inp._hl) { inp._hl = true; inp.addEventListener('input', () => { st.q = inp.value; fillTemy(); }); }
    if (document.activeElement !== inp) inp.value = st.q;
    fillTemy();
  }
  ['domov', 'temy', 'hry', 'priatelia', 'ja'].forEach(v => {
    const b = document.getElementById('nav-' + v);
    if (v === st.view || (v === 'ja' && st.view === 'odznaky') || (v === 'domov' && (st.view === 'misia' || st.view === 'anglictina' || st.view === 'objavuj')) || (v === 'priatelia' && (st.view === 'priatel' || st.view === 'priatelProfil'))) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  socZnacka();
  paintHead();
}

Object.assign(views, RodicPanel.views); // pohľady panela rodiča (vykresľujú sa cez brany, fázy rodic*)
function go(v) { Render.nova = true; main.classList.remove('ang-mizne'); Hlas.stop(); Hra.zrus(); st.flow = null; st.misia = null; st.ang = null; st.view = v; render(); window.scrollTo(0, 0); }

