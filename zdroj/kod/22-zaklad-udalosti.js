// Lietajúca sova: ťuknutie kdekoľvek na oblohu (aj medzerník na počítači)
document.addEventListener('pointerdown', e => { if (e.target && e.target.id === 'sova-cv' && st.hra && st.hra.id === 'sova') { e.preventDefault(); Hra.mav(); } });
document.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'ArrowUp') && st.hra && st.hra.id === 'sova' && st.hra.beh) { e.preventDefault(); Hra.mav(); } });
document.addEventListener('click', e => {
  const sova = e.target.closest('[data-sova]');
  if (sova) {
    Zvuk.play('hoot'); vibruj(30);
    const o = sova.querySelector('.owl'); if (o) { o.classList.remove('jump'); void o.getBoundingClientRect(); o.classList.add('jump'); }
    const [x, y] = stred(sova); FX.burst(x, y, 14, ['star', 'dot'], 6);
    return;
  }
  const msg = e.target.closest('[data-soc-msg]');
  if (msg && !e.target.closest('button')) {
    const id = msg.dataset.socMsg, t = Date.now();
    if (socTap.id === id && t - socTap.t < 400) {
      socTap = {}; const C = window.Cloud;
      if (C && C.soc) { const [x, y] = stred(msg); Zvuk.play('heart'); vibruj(20); FX.hearts(x, y); socAkcia(C.soc.reaguj(st.priatel, id)); socZmena(); }
    } else socTap = { id, t };
    return;
  }
  const strom = e.target.closest('[data-strom]');
  if (strom && !e.target.closest('button')) { Zvuk.play('pop'); Strom.ukaz(); return; }
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  const d = b.dataset, f = st.flow;
  if (b.id === 'snd') { Zvuk.toggle(); Hlas.stop(); paintHead(); return; }
  if (d.autoStart) { if (Hlas.hovori) Hlas.stop(); Auto.start(d.autoStart); return; }
  if (d.auto) { Auto.ovladaj(d.auto); return; }
  if (RodicBrana.klik(b, d) || RodicPanel.klik(b, d)) return;
  if (d.pripZavri !== undefined) { Pripomienka.zavri(b); return; }
  if (d.tyzStrom !== undefined) { TyzStrom.ukaz(b); return; }
  if (d.tyzPrehlad !== undefined) { Zvuk.play('tap'); TyzPrehlad.ukaz(); return; }
  if (d.okruhOtvor !== undefined) { Zvuk.play('tap'); Okruh.ukaz(); return; }
  if (d.tyzDen) { Zvuk.play('pop'); TY().otvor(d.tyzDen); return; }
  if (Misie.klik(b, d) || Ang.klik(b, d)) return;
  if (d.vyber) { vyberOdznak(d.vyber, b); return; }
  if (d.hra) { if (st.auto) Auto.stop(false); Hra.start(d.hra, b); return; }
  if (d.hraSpat !== undefined) { Hra.zrus(); Zvuk.play('whoosh'); st.view = 'hry'; render(); scrollTo(0, 0); return; }
  if (d.pex) { Hra.pex(+d.pex, b); return; }
  if (d.hv) { Hra.chyt(b); return; }
  if (d.krt !== undefined) { Hra.krt(+d.krt, b); return; }
  if (d.hvStart !== undefined) { if (st.hra && st.hra.id === 'sova') Hra.sovaStart(); else if (st.hra && st.hra.id === 'bubliny') Hra.bublinyStart(); else if (st.hra && st.hra.id === 'opakuj') Hra.simonStart(); else if (st.hra && st.hra.id === 'krtko') Hra.krtkoStart(); else Hra.hviezdyStart(); return; }
  if (d.hadaj) { Hra.hadaj(d.hadaj); return; }
  if (d.pocitaj) { Hra.pocitaj(d.pocitaj); return; }
  if (d.kv !== undefined) { Hra.kv(d.kv); return; }
  if (d.bub !== undefined) { Hra.bub(b); return; }
  if (d.pad !== undefined) { Hra.pad(+d.pad); return; }
  if (d.diel) { Hra.diel(+d.diel); return; }
  if (d.vibracie !== undefined) {
    S.set('vibracie', !Haptika.zapnute()); b.setAttribute('aria-pressed', Haptika.zapnute());
    const m = b.querySelector('small'); if (m) m.textContent = Haptika.zapnute() ? 'zapnuté' : 'vypnuté';
    Haptika.hraj('tuk'); return;
  }
  if (d.hlas !== undefined) {
    if (d.hlas === 'viktoria') S.set('hlas-telefon', false); else { S.set('hlas', d.hlas); S.set('hlas-telefon', true); }
    document.querySelectorAll('[data-hlas]').forEach(x => x.setAttribute('aria-pressed', x === b));
    const ukazka = () => Hlas.citaj(Nahravky.moze(['Ahoj!', 'Takto ti budem čítať témy o svete.']) ? ['Ahoj!', 'Takto ti budem čítať témy o svete.'] : `Ahoj${st.meno ? ', ' + st.meno : ''}! Takto ti budem čítať témy o svete.`);
    if (Hlas.hovori) { Hlas.stop(); setTimeout(ukazka, 150); } else ukazka();
    return;
  }
  if (d.reload !== undefined) { location.reload(); return; }
  if (d.deti !== undefined) {
    Hlas.stop(); Hra.zrus(); Zvuk.play('whoosh'); if (window.Cloud) window.Cloud.ulozHned();
    Object.assign(st, { flow: null, faza: 'vyber' }); render(); scrollTo(0, 0); return;
  }
  if (d.dieta) { Zvuk.play('start'); window.Cloud.vyber(d.dieta); return; }
  if (d.noveDieta !== undefined && maRodica() && !Rodic.jeOdomknute()) { Zvuk.play('whoosh'); toast('Nové dieťa pridáva rodič. Zadajte PIN.'); Rodic.chod('rodicPin'); return; }
  if (d.noveDieta !== undefined) { Zvuk.play('pop'); Object.assign(st, { upravuje: noveUpravovanie(false), faza: 'tvorba' }); render(); scrollTo(0, 0); return; }
  if (d.upravit !== undefined) {
    if (st.auto) Auto.stop(false);
    Zvuk.play('pop');
    st.upravuje = { id: st.dietaId, meno: st.meno, vek: st.vek, avatar: { ...AV_ZAKLAD, ...st.avatar }, body: st.body, kat: AV_KAT.some(([k]) => k === d.upravit) ? d.upravit : 'vlasy', novy: false, potvrd: false };
    st.flow = null;
    st.faza = 'tvorba'; render(); scrollTo(0, 0); return;
  }
  if (st.faza === 'tvorba' && tvorbaKlik(b, d)) return;
  if (d.testZvuk !== undefined) {
    Hlas.stop(); Zvuk.test(d.testZvuk || 'web'); paintHead();
    const [x, y] = stred(b); FX.burst(x, y, 20, ['star', 'dot'], 7);
    setTimeout(() => { const el = document.getElementById('diag'); if (el) el.textContent = Zvuk.diag(); }, 900);
    return;
  }
  if (d.sposob) {
    Zvuk.sposob = d.sposob; render(); Zvuk.play('pop');
    toast(d.sposob === 'subor' ? 'Zvuky pôjdu spôsobom z Testu 2.' : 'Zvuky pôjdu spôsobom z Testu 1.');
    return;
  }
  if (d.plocha !== undefined) { Plocha.navod(); return; }
  if (d.plochaNeskor !== undefined) { S.set('plocha-neskor', Date.now() + 14 * 864e5); Zvuk.play('pop'); render(); return; }
  if (d.uvod) {
    const em0 = document.getElementById('email'); if (em0) st.uvodEmail = em0.value; // e-mail ostane aj pri návrate na voľbu a prepnutí medzi cestami
    st.uvodKrok = d.uvod; if (window.Cloud) { window.Cloud.chyba = ''; window.Cloud.chyby = {}; }
    Zvuk.play('pop'); render(); scrollTo(0, 0);
    const em = document.getElementById('email'); if (em && st.uvodEmail) em.value = st.uvodEmail;
    return;
  }
  if (d.ucet) {
    if (!window.Cloud) { toast('Prihlásenie sa ešte načítava, skúste o chvíľu.'); return; }
    const email = (document.getElementById('email') || {}).value || '', heslo = (document.getElementById('heslo') || {}).value || '';
    window.Cloud.akcia(d.ucet, email.trim(), heslo);
    return;
  }
  if (d.start) startTema(d.start);
  else if (d.go) { Zvuk.play('whoosh'); go(d.go); }
  else if (d.sprievodca !== undefined) Sprievodca.start();
  else if (d.hnitiePrepni !== undefined) { S.set('hnitie-' + (st.dietaId || 'x'), !hnitieZapnute()); Zvuk.play('tap'); toast(hnitieZapnute() ? 'Vädnutie stromu je zapnuté.' : 'Vädnutie stromu je vypnuté.'); render(); }
  else if (d.socPisanie !== undefined) { const C = window.Cloud, zap = d.socPisanie === '1'; if (C && C.soc && (!zap || confirm('Zapnúť voľné písanie pre ' + st.meno + '? Dieťa bude môcť priateľom písať ľubovoľný text. Uvidia ho len priatelia, ktorým to rodič tiež zapol, a vy ho uvidíte v Posledných správach.'))) socAkcia(C.soc.pisanie(zap), () => { toast(zap ? 'Voľné písanie je zapnuté.' : 'Voľné písanie je vypnuté.'); render(); }); }
  else if (d.socZdielaj !== undefined) {
    const So = socC(), text = 'Pridaj si ma v appke Svetom (svet-za-3-minuty.web.app). Môj kód priateľa: ' + So.profil.kod;
    if (navigator.share) navigator.share({ text }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('Kód je skopírovaný.'), () => toast(So.profil.kod));
  }
  else if (d.socPridaj !== undefined) {
    const v = document.getElementById('soc-kod'), C = window.Cloud;
    if (v && C && C.soc) socAkcia(C.soc.ziadost(v.value), x => { Zvuk.play('ok'); toast(x === 'priatelia' ? 'Ste priatelia!' : 'Žiadosť je poslaná. Počkaj, kým ju prijme.'); v.value = ''; render(); main.classList.remove('anim'); });
  }
  else if (d.socPrijmi) { const C = window.Cloud; socAkcia(C.soc.prijmi(d.socPrijmi), () => { Zvuk.play('win'); FX.hearts(innerWidth / 2, innerHeight / 2); toast('Ste priatelia!'); }); }
  else if (d.socOdmietni) { const C = window.Cloud; socAkcia(C.soc.odmietni(d.socOdmietni), () => Zvuk.play('tap')); }
  else if (d.socOtvor) { document.querySelectorAll('.soc-ozn').forEach(x => x.remove()); Zvuk.play('whoosh'); st.priatel = d.socOtvor; oznacVidene(d.socOtvor); go('priatel'); }
  else if (d.socTab) { Zvuk.play('tap'); st.socTab = d.socTab; if (st.view !== 'priatelia') go('priatelia'); else { render(); main.classList.remove('anim'); } }
  else if (d.socTemy !== undefined) { Zvuk.play('tap'); st.socTemy = !st.socTemy; render(); main.classList.remove('anim'); }
  else if (d.socTema) {
    const C = window.Cloud; if (Date.now() - socPosledna < 350) return; socPosledna = Date.now();
    Zvuk.play('pop'); const [x, y] = stred(b); FX.burst(x, y, 12, ['star', 'dot'], 5); st.socTemy = false;
    socAkcia(C.soc.posli(st.priatel, { t: d.socTema, h: 3 }), null, () => socZmena()); render(); main.classList.remove('anim');
  }
  else if (d.socPochval) {
    const [tid, h] = d.socPochval.split(':'), C = window.Cloud, So = socC();
    S.set('soc-pochvala-' + So.pid + '-' + tid, true); b.disabled = true; b.innerHTML = ikn('check') + ' Poslané priateľom';
    Zvuk.play('win'); FX.ohnostroj(2);
    socAkcia(C.soc.pochval(tid, Math.max(0, Math.min(3, +h || 0))));
  }
  else if (d.socProfil) { Zvuk.play('whoosh'); st.priatel = d.socProfil; go('priatelProfil'); }
  else if (d.socNal || d.socVeta) {
    if (Date.now() - socPosledna < 350) return; // nie príliš rýchlo za sebou
    socPosledna = Date.now(); const C = window.Cloud, m = d.socNal ? { n: d.socNal } : { k: d.socVeta };
    // hneď ukázať a zahrať, cloud to dopošle v pozadí
    Zvuk.play(d.socNal ? 'pop' : 'tap'); vibruj(15); const [x, y] = stred(b); FX.burst(x, y, 10, ['star', 'dot'], 5);
    const ch = document.getElementById('chat');
    if (ch) { const pr = ch.querySelector('.dm-prazdny'); if (pr) pr.remove(); ch.insertAdjacentHTML('beforeend', `<div class="msg moja posl odosiela${m.n ? ' nalepka' : ''}">${spravaObsah(m)}</div>`); ch.scrollTop = ch.scrollHeight; }
    socAkcia(C.soc.posli(st.priatel, m), null, () => socZmena());
  }
  else if (d.socOdober) { const C = window.Cloud, p = socC().profily[d.socOdober]; if (confirm('Naozaj odstrániť ' + (p ? p.meno : 'priateľa') + ' z priateľov?')) socAkcia(C.soc.odober(d.socOdober), () => { toast('Odstránené z priateľov.'); go('priatelia'); }); }
  else if (d.kviz !== undefined) startKviz(d.kviz);
  else if (d.nahodna !== undefined) {
    const nove = TV().filter(t => !st.done.includes(t.id) && t.id !== (f && f.id));
    startTema(pick(nove.length ? nove : TV().filter(t => t.id !== (f && f.id))).id);
  } else if (d.skupina !== undefined) {
    Zvuk.play('boing');
    // druhé ťuknutie na vybranú oblasť ju zavrie
    st.skupina = st.view === 'temy' && st.skupina === d.skupina && !st.kat ? '' : d.skupina; st.kat = ''; st.q = '';
    const inp = document.getElementById('hladaj'); if (inp) inp.value = '';
    if (st.view === 'temy' && !f) fillTemy(); else go('temy');
  } else if (d.kat !== undefined) {
    Zvuk.play('boing');
    st.kat = d.kat; st.q = '';
    if (d.kat && d.kat !== 'fav') st.skupina = (skupinaKat(d.kat) || {}).id || ''; else if (d.kat === 'fav') st.skupina = '';
    if (st.view === 'temy' && !f) fillTemy(); else go('temy');
  } else if (d.rezim) {
    // bez prekreslenia obrazovky: prepne sa len atribút na koreni a karta s prepínačom
    Zvuk.play('pop'); Rezim.zvol(d.rezim);
    const k = document.querySelector('.rez-karta');
    if (k) { k.outerHTML = Rezim.karta(); const n = document.querySelector('.rez-sw'); if (n) n.focus(); }
  } else if (d.vek) {
    Zvuk.play('pop'); st.vek = d.vek; S.set('vek', d.vek); render(true);
  } else if (d.citaj !== undefined && f) {
    Zvuk.play('tap'); Hlas.citaj(textKroku(f), b);
  } else if (d.zavriet !== undefined) {
    Zvuk.play('whoosh');
    go(f && f.typ === 'tema' && f.kroky[f.i].t !== 'koniec' ? f.from : 'domov');
  } else if (d.fav !== undefined && f) {
    const pridat = !st.fav.includes(f.id);
    st.fav = pridat ? [...st.fav, f.id] : st.fav.filter(x => x !== f.id);
    S.set('fav', st.fav);
    if (pridat) { Zvuk.play('heart'); const [x, y] = stred(b); FX.hearts(x, y); toast('Uložené medzi obľúbené'); } else Zvuk.play('tap');
    oznamOdznaky(noveOdznaky());
    renderFlow(false);
  } else if (d.hlbka !== undefined && f) {
    Zvuk.play('tap'); f.hlbka = !f.hlbka; renderFlow(false); // odsek Do hĺbky: rozbaliť a zbaliť
  } else if (d.ans !== undefined && f) {
    if (f.odp[f.i]) return; // na otázku sa odpovedá raz
    const v = Number(d.ans);
    Hlas.stop();
    const ok = odpovedz(f, v);
    zapisChybu(f.kroky[f.i], ok);
    renderFlow(false); // zmení len odpovede, lištu a pridá reakciu (bez prekreslenia celej obrazovky)
    if (!ok && f.prehra) kvizZamkni(druhKvizu(f));
    reakciaOdpovede(f, ok, v);
  } else if (d.znova !== undefined && f) {
    // téma bez správnej odpovede: otázky (alebo celá téma) odznova, odpovede v inom poradí
    f.odp = {}; f.zle = false; f.kroky.forEach(k => { if (k.t === 'q') k.poradie = mix(k.q.a.length); });
    f.i = d.znova === 'tema' ? 0 : f.kroky.findIndex(k => k.t === 'q');
    Zvuk.play('start'); renderFlow(); window.scrollTo(0, 0);
  } else if (d.dalej !== undefined && f) {
    if (document.querySelector('.oslava')) return; // pod oslavou sa „Ďalej“ nesmie spustiť druhýkrát (Enter)
    Hlas.stop(); f.prave = false;
    if (f.prehra) { f.i = f.kroky.length - 1; Zvuk.play('whoosh'); renderFlow(); window.scrollTo(0, 0); return; }
    if (f.kroky[f.i + 1].t === 'koniec' && vsetkoZle(f)) { f.zle = true; f.i++; Zvuk.play('whoosh'); renderFlow(); window.scrollTo(0, 0); return; }
    if (f.kroky[f.i + 1].t === 'koniec') {
      const oslava = Oslava.treba(f); dokonci(f);
      // téma dňa: najprv veľká oslava, výsledok až po ťuknutí na Pokračovať
      if (oslava) { Oslava.ukaz(() => { f.i++; renderFlow(); window.scrollTo(0, 0); }); return; }
    } else Zvuk.play('whoosh');
    f.i++; renderFlow(); window.scrollTo(0, 0);
  } else {
    Zvuk.play('tap');
  }
});

document.getElementById('av').innerHTML = owl('hi');
document.getElementById('star-ico').innerHTML = ikn('hviezda');
render();
setTimeout(() => Uvod.skry(), 3600);
// keď sa Firebase do chvíle nenačíta (prvé spustenie bez internetu), povieme to
setTimeout(() => { if (!window.Cloud && st.faza === 'nacitava') { st.faza = 'bezNetu'; render(); } }, 9000);
