/* Zvuky 5.0: jeden nástroj (kalimba, drevené paličky, zvončeky) v jednej tónine (C dur, päťtónová stupnica)
   sa skladá priamo v prehliadači; štyri krátke nahrávky (lístok, strana, pečiatka, Múdra) sú v z/*.wav (skript zdroj/zvuky.js).
   Rozhranie: Zvuk.hraj('peciatka') alebo Zvuk.play('ok'); zoznam mien a kde znejú je v zvuky-50.md. */
const Zvuk = (() => {
  let ctx = null, out = null, on = S.get('zvuk', true);
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let sposob = S.get('zvuk-sposob', 'web'); // na iPhone: 'web' (Web Audio) alebo 'subor' (krátke súbory)
  const D = { chyba: '', slucka: 'nespustená', posledny: '' };

  // Reťaz: zvuk -> (dozvuk malej drevenej izby) -> jemný kompresor -> reproduktor
  function dozvukIR(c) {
    const len = Math.floor(c.sampleRate * 1.1), b = c.createBuffer(2, len, c.sampleRate);
    for (let k = 0; k < 2; k++) {
      const d = b.getChannelData(k); let p = 0;
      for (let i = 0; i < len; i++) { p = p * .55 + (Math.random() * 2 - 1) * .45; d[i] = p * Math.exp(-i / (c.sampleRate * .22)); }
    }
    return b;
  }
  function retaz(c) {
    const comp = c.createDynamicsCompressor(), vstup = c.createGain(), dry = c.createGain(), wet = c.createGain(), conv = c.createConvolver();
    comp.threshold.value = -8; comp.knee.value = 4; comp.ratio.value = 4; comp.attack.value = .004; comp.release.value = .2;
    vstup.gain.value = 1; dry.gain.value = .82; wet.gain.value = .2;
    conv.buffer = dozvukIR(c);
    vstup.connect(dry); dry.connect(comp); vstup.connect(conv); conv.connect(wet); wet.connect(comp); comp.connect(c.destination);
    return vstup;
  }
  let vstup = null;
  function ac() {
    if (!on) return null;
    try {
      if (!ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) { D.chyba = 'Web Audio v prehliadači chýba'; return null; }
        ctx = new C();
        vstup = retaz(ctx);
        // iPhone: prázdny zvuk v tom istom ťuknutí odomkne zvukový kontext
        const b = ctx.createBufferSource(); b.buffer = ctx.createBuffer(1, 1, 22050); b.connect(ctx.destination); b.start(0);
      }
      if (ctx.state !== 'running') {
        // prerušený zvuk skúsime prebudiť; keď sa to do chvíle nepodarí, pri ďalšom ťuknutí vytvoríme nový
        const c = ctx;
        try { const p = c.resume(); if (p) p.catch(e => { D.chyba = 'resume: ' + e.name; }); } catch (e) { D.chyba = 'resume: ' + e.name; }
        setTimeout(() => { if (c === ctx && c.state !== 'running') { try { c.close(); } catch (e) {} ctx = null; } }, 800);
      }
      return ctx;
    } catch (e) { D.chyba = 'Web Audio: ' + e.name; ctx = null; return null; }
  }

  // --- nástroje ---
  const N = { D4: 293.66, E4: 329.63, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98, A6: 1760, C7: 2093 };
  function osc(c, typ, f, t0, gain, dl, utlm = .004, f2) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = typ; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dl);
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + utlm); g.gain.exponentialRampToValueAtTime(.0001, t0 + dl);
    o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dl + .05);
  }
  // kalimba: základný tón s dlhým doznievaním, rýchlo zhasínajúce kovové alikvoty jazýčka a mäkký nábeh prsta
  function kal(c, f, t, v = .25, dl = 1.1, makka) {
    const t0 = c.currentTime + t;
    osc(c, 'sine', f, t0, v, dl);
    osc(c, 'sine', f * 2.01, t0, v * .07, dl * .35);
    if (!makka && f * 5.93 < 9000) osc(c, 'sine', f * 5.93, t0, v * .16, .09, .002);
    osc(c, 'triangle', f * 3, t0, v * .08, .025, .001);
  }
  // drevená palička: krátky tón s malým poklesom a drevené klepnutie
  function drevo(c, f, t, v = .14, dl = .07) {
    const t0 = c.currentTime + t;
    osc(c, 'sine', f, t0, v, dl, .002, f * .9);
    osc(c, 'sine', f * 3.95, t0, v * .22, dl * .35, .001);
    sum(c, t, .014, v * .5, 2600, 2200, 3);
  }
  // zvonček: neharmonické alikvoty ako kovová doštička
  function zvon(c, f, t, v = .1, dl = .8) {
    const t0 = c.currentTime + t;
    [[1, 1, 1], [2.76, .32, .45], [5.4, .12, .25], [8.93, .05, .12]].forEach(([k, a, d]) => { if (f * k < 10000) osc(c, 'sine', f * k, t0, v * a, dl * d, .002); });
  }
  function sum(c, t, d, v, f1, f2, q = 1.2) {
    // šum sa vyrobí raz pre každú dĺžku (mávnutie krídel v hre ho pri každom ťuknutí nevyrába znova)
    const pamat = c.sumy || (c.sumy = {});
    let buf = pamat[d];
    if (!buf) { const len = Math.max(1, Math.floor(c.sampleRate * d)), ch = (buf = pamat[d] = c.createBuffer(1, len, c.sampleRate)).getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t0 = c.currentTime + t;
    s.buffer = buf; fl.type = 'bandpass'; fl.Q.value = q;
    fl.frequency.setValueAtTime(f1, t0); fl.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + Math.min(.01, d * .3)); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    s.connect(fl); fl.connect(g); g.connect(out); s.start(t0); s.stop(t0 + d);
  }
  // nahrávky z/*.wav: načítajú sa až po štarte appky; kým nie sú, hrá podobný skladaný zvuk
  const nahr = {}, NAHRAVKY = ['listok', 'strana', 'peciatka', 'mudra'];
  function nahravka(c, m, t, v = .7, rychlost = 1) {
    if (!nahr[m]) return false;
    const s = c.createBufferSource(), g = c.createGain(), t0 = c.currentTime + t;
    s.buffer = nahr[m]; s.playbackRate.value = rychlost; g.gain.value = v;
    s.connect(g); g.connect(out); s.start(t0);
    return true;
  }
  let nacitane = null;
  function nacitajNahravky() {
    if (nacitane) return nacitane;
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC || !window.fetch) return (nacitane = Promise.resolve());
    const dek = new OC(1, 1, 44100);
    const dekoduj = ab => new Promise((res, rej) => { const p = dek.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
    return (nacitane = Promise.all(NAHRAVKY.map(m => fetch('z/' + m + '.wav').then(r => r.ok ? r.arrayBuffer() : Promise.reject(r.status)).then(dekoduj)
      .then(b => { nahr[m] = b; }, e => { D.chyba = 'nahrávka ' + m + ': ' + (e && e.name || e); }))));
  }

  // stúpajúce tóny: hviezdy a body idúce po sebe znejú stále o kúsok vyššie (po chvíli ticha sa začína odznova)
  let stup = 0, stupCas = 0;
  const dalsiStup = c => { const t = c.currentTime; stup = t - stupCas < 1.2 ? Math.min(stup + 1, 5) : 0; stupCas = t; return stup; };

  const hu = (c, t, v = .7) => nahravka(c, 'mudra', t, v) || [0, .38].forEach((x, i) => { osc(c, 'sine', i ? N.C5 : N.G4, c.currentTime + t + x, .28, .32, .04, i ? N.C5 * .97 : N.G4); sum(c, t + x, .3, .03, 900, 900, 1.5); });
  const zvuky = {
    // Ťuk: každé tlačidlo. Krátke tiché ťuknutie do dreva, výška sa nepatrne mení, aby neunavovalo.
    tap: c => drevo(c, 1180 * (.96 + Math.random() * .08), 0, .12, .06),
    // Plod: nový plod, nová správa, malé „áno“. Šťavnaté puk.
    pop: c => { const t0 = c.currentTime; osc(c, 'sine', 360, t0, .26, .09, .003, 980); kal(c, N.G5, .02, .06, .3, true); },
    // Odraz: skok, hopsanie v hrách
    boing: c => { const t0 = c.currentTime; osc(c, 'sine', 160, t0, .24, .28, .004, 420); kal(c, N.G4, .0, .1, .4, true); },
    // Strana: ďalší krok témy, prechod medzi obrazovkami
    whoosh: c => nahravka(c, 'strana', 0, .5) || sum(c, 0, .3, .12, 600, 2600, .8),
    // Lístok: „Poďme na to!“, začiatok témy, kvízu a hry. Odtrhnutie papiera a jeden tón nahor.
    start: c => { nahravka(c, 'listok', 0, .6) || sum(c, 0, .22, .14, 1800, 4200, 1); kal(c, N.C6, .2, .2, .9); },
    // Správne: dva tóny kalimby nahor (G a vyššie C, ako „to je ono“)
    ok: c => { kal(c, N.G5, 0, .24, .9); kal(c, N.C6, .1, .26, 1.1); zvon(c, N.C7, .12, .025, .5); },
    // Body: krátky tón, každý ďalší o stupeň vyššie
    coin: c => kal(c, [N.G5, N.A5, N.C6, N.D6, N.E6, N.G6][dalsiStup(c)], 0, .17, .6),
    // Skús znova: jeden mäkký nízky tón, bez kovu, žiadny bzučiak
    bad: c => { kal(c, N.D4, 0, .2, .55, true); osc(c, 'sine', N.D4 * 1.5, c.currentTime, .03, .25); },
    // Hviezda: letí do počítadla, každá o kúsok vyššie, so zvončekom
    star: c => { const f = [N.C6, N.D6, N.E6, N.G6, N.A6, N.C7][dalsiStup(c)]; kal(c, f, 0, .2, .8); zvon(c, f * 2, .03, .03, .4); },
    // Fanfára: koniec témy, výhra v hre. Štyri tóny kalimby a húknutie Múdrej, do 1,5 sekundy.
    win: c => {
      [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => kal(c, f, i * .11, .24, 1.1));
      kal(c, N.E5, .33, .1, 1); kal(c, N.G5, .33, .1, 1);
      [N.G6, N.C7].forEach((f, i) => zvon(c, f, .4 + i * .07, .04, .6));
      hu(c, .58, .55);
    },
    // Húknutie Múdrej: otvorenie appky, Múdra hovorí, ťuknutie na Múdru
    hoot: c => hu(c, 0),
    // Tikanie času v hrách: ledva počuteľné drievko
    tick: c => drevo(c, 1700 + Math.random() * 120, 0, .05, .035),
    // Srdiečko (priatelia): dva mäkké zvončeky
    heart: c => { zvon(c, N.E6, 0, .1, .7); zvon(c, N.G6, .1, .1, .8); },
    // Mäkký drevený úder: náraz v hre, koniec hry
    bum: c => { drevo(c, 150, 0, .28, .16); osc(c, 'sine', 90, c.currentTime, .2, .2, .003, 60); },
    // Tóny hier (Opakuj po mne, plody na strome): štyri tóny kalimby
    ton0: c => kal(c, N.C5, 0, .3, 1), ton1: c => kal(c, N.E5, 0, .3, 1), ton2: c => kal(c, N.G5, 0, .3, 1), ton3: c => kal(c, N.A5, 0, .3, 1),
    // Krídla sovy: mäkké mávnutie
    krid: c => sum(c, 0, .09, .09, 700, 1500, .9),
    // Odomknutie, prevzatá odmena: hracia skrinka, tri zvončeky nahor
    cink: c => [N.E6, N.G6, N.C7].forEach((f, i) => { zvon(c, f, i * .07, .1, .9); kal(c, f / 2, i * .07, .06, .5, true); }),
    // Strom rastie, séria: šuchot lístia a tri tóny nahor
    seria: c => {
      for (let k = 0; k < 7; k++) sum(c, k * .06, .07, .05 + k * .006, 2400 + Math.random() * 1600, 4200, 2);
      [N.C5, N.E5, N.G5].forEach((f, i) => kal(c, f, .12 + i * .13, .24, 1));
      kal(c, N.C6, .51, .22, 1.2); zvon(c, N.C7, .55, .05, .7);
    },
    // Pečiatka: nový odznak, pečiatka „Hotovo“
    dopad1: c => nahravka(c, 'peciatka', 0, .85) || drevo(c, 120, 0, .3, .15),
    dopad2: c => { nahravka(c, 'peciatka', 0, .9, .9) || drevo(c, 110, 0, .3, .16); kal(c, N.C5, .04, .12, .8, true); },
    // Zámok: ťuknutie na zamknutú vec, krátke kovové cvak-cvak
    zamok: c => { sum(c, 0, .012, .12, 4200, 3800, 3); osc(c, 'sine', 2400, c.currentTime, .05, .03, .001); sum(c, .05, .012, .09, 3000, 2800, 3); osc(c, 'sine', 1800, c.currentTime + .05, .04, .03, .001); },
    // Okno sa otvorí / zavrie, prepnutie karty: tiché, aby rámovali pohyb, nie rušili
    okno: c => { drevo(c, 880, 0, .06, .05); kal(c, N.C6, .03, .07, .4, true); },
    zavri: c => { drevo(c, 700, 0, .06, .05); kal(c, N.G5, .02, .06, .3, true); },
    karta: c => drevo(c, 1400, 0, .08, .045),
    // Iskra ohňostroja: tichý vysoký zvonček z tej istej stupnice
    iskra: c => zvon(c, [N.G6, N.A6, N.C7][Math.floor(Math.random() * 3)], 0, .035, .6),
    // Oslavy: malá (malý úspech), stredná (pečiatka a tri tóny), veľká (fanfára so zvončekmi)
    'oslava-mala': c => { [N.C6, N.E6, N.G6].forEach((f, i) => kal(c, f, i * .07, .16, .8)); zvon(c, N.C7, .2, .04, .6); },
    'oslava-stredna': c => { zvuky.dopad2(c); [N.E5, N.G5, N.C6].forEach((f, i) => kal(c, f, .2 + i * .1, .2, 1)); },
    'oslava-velka': c => { zvuky.win(c); [N.C7, N.G6, N.A6, N.C7].forEach((f, i) => zvon(c, f, .5 + i * .09, .03, .5)); },
    // samotné nahrávky
    listok: c => nahravka(c, 'listok', 0, .6) || sum(c, 0, .22, .14, 1800, 4200, 1),
    strana: c => zvuky.whoosh(c),
    peciatka: c => zvuky.dopad1(c),
    mudra: c => hu(c, 0),
  };
  // slovenské mená pre nové volania
  const MENA = { tuk: 'tap', plod: 'pop', odraz: 'boing', spravne: 'ok', skus: 'bad', body: 'coin', hviezda: 'star', fanfara: 'win', dokoncenie: 'win', hukanie: 'hoot', tik: 'tick', srdce: 'heart', uder: 'bum', kridla: 'krid', odomknutie: 'cink', strom: 'seria', zaciatok: 'start' };
  const meno = n => zvuky[n] ? n : MENA[n];
  // dĺžky (s doznievaním) pre súbory na iPhone a pre počítanie, koľko zvukov práve znie
  const DLZKA = { tap: .15, pop: .35, boing: .45, whoosh: .5, start: 1.15, ok: 1.25, coin: .65, bad: .6, star: .85, win: 1.45, hoot: .8, tick: .08, heart: .9, bum: .25, ton0: 1.05, ton1: 1.05, ton2: 1.05, ton3: 1.05, krid: .12, cink: 1.05, seria: 1.75, dopad1: .32, dopad2: .9, zamok: .1, okno: .45, zavri: .35, karta: .08, iskra: .55, 'oslava-mala': .85, 'oslava-stredna': 1.5, 'oslava-velka': 1.5, listok: .36, strana: .5, peciatka: .32, mudra: .8 };
  // zvuky, ktoré sa smú vynechať, keď ich znie naraz priveľa (ťuknutia, tikanie, body)
  const DROBNE = new Set(['tap', 'tick', 'coin', 'pop', 'krid', 'karta', 'okno', 'zavri', 'iskra', 'whoosh', 'star']);
  const OSLAVY = new Set(['win', 'seria', 'oslava-velka', 'oslava-stredna']);
  // vyrovnanie hlasitosti (drobné zvuky tichšie ako oslavy, ale počuteľné)
  const HL = { tap: 5, tick: 6, karta: 5, okno: 3, zavri: 3, coin: 3, star: 2.5, bad: 3, ton0: 2.5, ton1: 2.5, ton2: 2.5, ton3: 2.5, pop: 3, zamok: 6, boing: 3, bum: 3, heart: 2.5, cink: 1.6, krid: 6, iskra: 5, dopad1: 1.5, dopad2: 1.4, peciatka: 1.5, 'oslava-mala': 1.6, hoot: .8, mudra: .8, ok: 1.1 };
  let znie = [], naposledy = {};

  // --- iPhone ---
  function wav(d, sr) {
    const n = d.length, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) { const x = Math.max(-1, Math.min(1, d[i])); v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7FFF, true); }
    return b;
  }
  const dataUrl = ab => { const u = new Uint8Array(ab); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return 'data:audio/wav;base64,' + btoa(s); };

  // Tichá slučka v bežnom prehrávači prepne iPhone do režimu médií: Web Audio potom hrá
  // aj v tichom režime a telefón ho medzi zvukmi neuspí.
  let slucka = null;
  function zapniSlucku() {
    try {
      if (!slucka) {
        slucka = document.createElement('audio');
        slucka.setAttribute('x-webkit-airplay', 'deny');
        slucka.loop = true; slucka.preload = 'auto';
        slucka.src = dataUrl(wav(new Float32Array(22050), 22050));
      }
      if (slucka.paused) {
        const p = slucka.play();
        if (p) p.then(() => { D.slucka = 'hrá'; }, e => { D.slucka = 'zlyhala'; D.chyba = 'slučka: ' + e.name; });
      }
    } catch (e) { D.chyba = 'slučka: ' + e.name; }
  }

  // Zvuk vyrobený vopred ako súbor WAV (záloha na iPhone a ukážky na vypočutie)
  const urly = {}, banka = {};
  const vykresli = oc => new Promise((res, rej) => { oc.oncomplete = e => res(e.renderedBuffer); const p = oc.startRendering(); if (p && p.then) p.then(res, rej); });
  async function subor(n) {
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) throw new Error('OfflineAudioContext chýba');
    await nacitajNahravky();
    const oc = new OC(1, Math.ceil(44100 * (DLZKA[n] + .25)), 44100), g = oc.createGain();
    g.gain.value = .8 * (HL[n] || 1); g.connect(retaz(oc));
    const zivy = out; out = g;
    try { zvuky[n](oc); } finally { out = zivy; }
    const buf = await vykresli(oc);
    return wav(buf.getChannelData(0), buf.sampleRate);
  }
  async function priprav() {
    for (const n of Object.keys(DLZKA)) {
      try { urly[n] = dataUrl(await subor(n)); } catch (e) { D.chyba = 'súbor ' + n + ': ' + e.name; }
    }
  }
  function prehravace() {
    for (const n of Object.keys(urly)) if (!banka[n]) banka[n] = [0, 1].map(() => { const a = new Audio(); a.preload = 'auto'; a.src = urly[n]; a.load(); return a; });
  }
  function hrajSubor(n, v) {
    if (!banka[n]) return false;
    const zoz = banka[n], a = zoz.find(x => x.paused || x.ended) || zoz[0];
    try { a.currentTime = 0; a.volume = Math.min(1, v); } catch (e) {}
    const p = a.play(); if (p) p.catch(e => { D.chyba = 'súbor: ' + e.name; });
    return true;
  }

  // Pri každom ťuknutí zvuk zobudíme: iPhone ho po prerušení (zamknutie, iná appka, čítanie nahlas) uspí.
  function prebud() {
    if (!on) return;
    if (ios) { zapniSlucku(); prehravace(); }
    ac();
  }
  ['touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, prebud, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    try { if (slucka) slucka.pause(); } catch (e) {}
    D.slucka = 'pozastavená';
    if (ctx) { try { ctx.close(); } catch (e) {} ctx = null; }
  });
  // nahrávky (82 kB) sa načítajú až chvíľu po štarte, aby nezdržali otvorenie appky
  setTimeout(() => { nacitajNahravky().then(() => { if (ios) priprav(); }); }, 1500);

  // hlasitosť: v Mesačnom režime tichšie, počas hlasu témy ešte tichšie (hlas sa neprerušuje)
  function hlasitost() {
    let v = 1;
    try { if (typeof Rezim !== 'undefined' && Rezim.tmavy()) v *= .6; } catch (e) {}
    try { if (typeof Hlas !== 'undefined' && Hlas.hovori) v *= .4; } catch (e) {}
    return v;
  }
  function hrajWeb(n, v) {
    const c = ac();
    if (!c) return false;
    const g = c.createGain(); g.gain.value = .8 * v * (HL[n] || 1); g.connect(vstup);
    const zivy = out; out = g;
    try { zvuky[n](c); D.posledny = 'Web Audio (' + c.state + ')'; return true; } catch (e) { D.chyba = 'hranie: ' + e.name; return false; } finally { out = zivy; }
  }

  function hraj(m) {
    const n = meno(m);
    if (!on || !n || (typeof document !== 'undefined' && document.hidden)) return;
    const t = performance.now();
    // ten istý zvuk dvakrát v tej istej chvíli neznie (napr. ťuk a dvojklik)
    if (t - (naposledy[n] || -1e9) < (n === 'tap' || n === 'tick' ? 45 : 70)) return;
    znie = znie.filter(k => k.do > t);
    // naraz znejú najviac štyri zvuky; drobné sa radšej vynechajú
    if (znie.length >= 4 && DROBNE.has(n)) return;
    // dve veľké oslavy cez seba nie
    if (OSLAVY.has(n) && znie.some(k => OSLAVY.has(k.n) && k.do - t > 600)) return;
    naposledy[n] = t; znie.push({ n, do: t + DLZKA[n] * 1000 });
    const v = hlasitost();
    if (ios && sposob === 'subor' && hrajSubor(n, v)) { D.posledny = 'súbor'; return; }
    hrajWeb(n, v);
  }

  return {
    ios,
    get sposob() { return sposob; },
    set sposob(s) { sposob = s; S.set('zvuk-sposob', s); },
    hraj, play: hraj,
    mena: () => Object.keys(zvuky),
    subor,
    test(s) {
      if (!on) this.toggle();
      prebud();
      if (s === 'subor') { if (hrajSubor('ok', 1)) { D.posledny = 'súbor'; setTimeout(() => hrajSubor('coin', 1), 260); } else D.chyba = 'súbory ešte nie sú pripravené'; }
      else { hrajWeb('ok', 1); setTimeout(() => hrajWeb('coin', 1), 260); }
    },
    get on() { return on; },
    stav() { return ctx ? ctx.state : 'zatiaľ nespustený'; },
    diag() {
      return [
        'iPhone: ' + (ios ? 'áno' : 'nie'),
        'appka na ploche: ' + (navigator.standalone || matchMedia('(display-mode: standalone)').matches ? 'áno' : 'nie'),
        'Web Audio: ' + (ctx ? ctx.state : '–'),
        'nahrávky: ' + Object.keys(nahr).length + '/' + NAHRAVKY.length,
        ios ? 'tichá slučka: ' + D.slucka : '',
        ios ? 'súbory: ' + Object.keys(urly).length + '/' + Object.keys(DLZKA).length : '',
        'naposledy: ' + (D.posledny || '–'),
        'chyba: ' + (D.chyba || 'žiadna'),
      ].filter(Boolean).join(' · ');
    },
    toggle() {
      on = !on; S.set('zvuk', on);
      if (on) { prebud(); this.play('pop'); }
      else {
        Object.values(banka).flat().forEach(a => { try { a.pause(); } catch (e) {} });
        try { if (slucka) slucka.pause(); } catch (e) {}
        try { if (ctx) ctx.suspend(); } catch (e) {}
      }
      return on;
    },
  };
})();
/* Haptika: jemné vibrácie (Android; iPhone ich nepodporuje, vtedy sa nič nedeje). Vypína sa v profile (v zariadení) a pri „menej pohybu“. */
const Haptika = {
  vzory: { tuk: 12, spravne: [15, 40, 25], nespravne: 40, hotovo: [30, 50, 30, 50, 40], hviezdicka: [12, 30, 24] },
  zapnute: () => S.get('vibracie', true) !== false,
  mozno: () => { try { return !!navigator.vibrate && !matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } },
  hraj(p) { try { if (!Haptika.zapnute() || !Haptika.mozno()) return false; return navigator.vibrate(typeof p === 'string' ? Haptika.vzory[p] : p); } catch (e) { return false; } },
};
// staré volania s číslami ostávajú, ale každé bzučanie sa skráti na jemných najviac 60 ms
const vibruj = p => Haptika.hraj(Array.isArray(p) ? p.map((x, i) => i % 2 ? x : Math.min(x, 60)) : Math.min(p, 60));
const vibraciePrepinac = () => `<button class="hlas" data-vibracie aria-pressed="${Haptika.zapnute()}"><b>Vibrácie</b><small>${Haptika.zapnute() ? 'zapnuté' : 'vypnuté'}</small></button>`;

/* Čítanie nahlas (hlas telefónu) */
/* Krásny hlas: vety nahraté vopred hlasom Microsoft Viktória (a/<kľúč>.mp3, zoznam a/zoznam.json, skript zdroj/hlas.js).
   Čo nahraté nie je (napríklad meno dieťaťa) alebo keď nie je signál, prečíta hlas telefónu. */
const normVeta = t => String(t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const klucVety = t => { let h = 0x811c9dc5; for (const c of normVeta(t)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
// vety a kúsky viet spojené pre hlas telefónu (možnosti v kvíze dostanú čiarky a otáznik)
const spojVety = c => c.map((x, i) => i < c.length - 1 ? (/[.!?:,…]$/.test(x) || x === 'alebo' || c[i + 1] === 'alebo' ? x : x + ',') : (/[.!?…]$/.test(x) ? x : x + (c.includes('alebo') ? '?' : '.'))).join(' ');
const moznostiNahlas = m => m.flatMap((o, i) => i === m.length - 1 && i > 0 ? ['alebo', o] : [o]);
const Nahravky = {
  zoznam: null, el: null, gen: 0, hra: false,
  nacitaj() {
    try {
      fetch('a/zoznam.json').then(x => x.ok ? x.json() : null).then(z => {
        if (!Array.isArray(z)) return;
        this.zoznam = new Set(z);
        const el = document.getElementById('hlasy'); if (el) el.innerHTML = hlasyHtml();
      }).catch(() => {});
    } catch (e) {}
  },
  zapnute: () => !S.get('hlas-telefon', false),
  moze(casti) { return this.zapnute() && !!this.zoznam && casti.length > 0 && casti.every(c => this.zoznam.has(klucVety(c))); },
  hraj(casti, hotovo, chyba) {
    const a = this.el || (this.el = new Audio()), g = ++this.gen;
    let i = 0;
    const zle = () => { if (g !== this.gen) return; this.gen++; this.hra = false; chyba(); };
    const dalsi = () => {
      if (g !== this.gen) return;
      if (i >= casti.length) { this.hra = false; hotovo(); return; }
      a.src = 'a/' + klucVety(casti[i++]) + '.mp3';
      const p = a.play(); if (p && p.catch) p.catch(zle);
    };
    a.onended = () => { if (g === this.gen) setTimeout(dalsi, 150); };
    a.onerror = zle;
    this.hra = true; dalsi();
  },
  stop() { const hral = this.hra; this.gen++; this.hra = false; if (this.el) { try { this.el.pause(); } catch (e) {} } return hral; },
};
Nahravky.nacitaj();
const Hlas = {
  hovori: false,
  citaj(text, btn) {
    if (this.hovori) { this.stop(); return; }
    const casti = (Array.isArray(text) ? text : vetyZ(normVeta(text))).filter(Boolean);
    if (Nahravky.moze(casti)) {
      this.hovori = true; if (btn) btn.classList.add('on');
      Nahravky.hraj(casti, () => this.hotovo(), () => { this.hovori = false; this.telefonom(spojVety(casti), btn); });
      return;
    }
    this.telefonom(spojVety(casti), btn);
  },
  telefonom(text, btn) {
    try {
      const s = window.speechSynthesis;
      if (!s) { toast('Tento telefón nevie čítať nahlas.'); return; }
      const u = new SpeechSynthesisUtterance(text), v = hlasSk();
      u.lang = 'sk-SK'; u.rate = .95; if (v) u.voice = v;
      if (!v && s.getVoices().length) toast('Slovenský hlas v telefóne chýba, číta sa iným hlasom.');
      u.onend = u.onerror = () => this.hotovo();
      this.hovori = true; if (btn) btn.classList.add('on');
      // Safari na iPhone niekedy nič neprečíta, keď sa cancel() zavolá tesne pred speak()
      if (s.speaking || s.pending) s.cancel();
      s.speak(u);
    } catch (e) { toast('Čítanie nahlas sa nepodarilo spustiť.'); }
  },
  hotovo() { this.hovori = false; document.querySelectorAll('.read.on').forEach(b => b.classList.remove('on')); },
  stop() { Nahravky.stop(); try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} this.hotovo(); },
};

/* Efekty: konfety, hviezdičky, srdiečka a ohňostroj na plátne cez celú obrazovku */
const FX = (() => {
  const cv = document.getElementById('fx'), g = cv.getContext('2d');
  const COL = ['#FFD23F', '#2FBF71', '#4C7DFF', '#FF9F1C', '#FF6FA8', '#B36BFF', '#16BFAE', '#FF5A5F'];
  let P = [], beh = false, dpr = 1;
  function size() { dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
  size(); addEventListener('resize', size);
  function hviezda(r) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); }
  function srdce(r) { g.beginPath(); g.moveTo(0, r * .9); g.bezierCurveTo(-r * 1.4, -r * .1, -r * .7, -r * 1.2, 0, -r * .45); g.bezierCurveTo(r * .7, -r * 1.2, r * 1.4, -r * .1, 0, r * .9); g.closePath(); }
  function tick() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, innerWidth, innerHeight);
    P = P.filter(p => p.t < p.life);
    for (const p of P) {
      p.t++; p.vy += p.g; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      g.save(); g.globalAlpha = Math.min(1, (p.life - p.t) / 20); g.translate(p.x, p.y); g.rotate(p.rot);
      g.fillStyle = p.c; g.strokeStyle = '#2A2356'; g.lineWidth = 2;
      if (p.k === 'star') { hviezda(p.s); g.fill(); g.stroke(); }
      else if (p.k === 'heart') { srdce(p.s); g.fill(); g.stroke(); }
      else if (p.k === 'dot') { g.beginPath(); g.arc(0, 0, p.s * .55, 0, 7); g.fill(); g.stroke(); }
      else { g.scale(1, Math.cos(p.t * .25 + p.ph)); g.fillRect(-p.s * .5, -p.s * .7, p.s, p.s * 1.4); g.strokeRect(-p.s * .5, -p.s * .7, p.s, p.s * 1.4); }
      g.restore();
    }
    if (P.length) requestAnimationFrame(tick); else { beh = false; g.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function add(p) {
    if (tiche || P.length > 400) return;
    P.push(Object.assign({ t: 0, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, ph: Math.random() * 6, g: .25, life: 70 + Math.random() * 40, c: COL[Math.floor(Math.random() * COL.length)], s: 7 + Math.random() * 6, k: 'rect' }, p));
    if (!beh) { beh = true; requestAnimationFrame(tick); }
  }
  return {
    burst(x, y, n = 28, kinds = ['star', 'rect', 'dot'], sila = 9) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = sila * (.4 + Math.random() * .8); add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, k: kinds[i % kinds.length] }); } },
    rain(n = 120) { for (let i = 0; i < n; i++) add({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .7, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, g: .05, life: 220 + Math.random() * 80 }); },
    hearts(x, y) { for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 4 + Math.random() * 5; add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, k: 'heart', c: i % 2 ? '#FF5A5F' : '#FF6FA8', g: .12, s: 8 + Math.random() * 5 }); } },
    ohnostroj(n = 5) { for (let i = 0; i < n; i++) setTimeout(() => { this.burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.12 + Math.random() * .35), 34, ['star', 'dot', 'rect'], 8); Zvuk.play('iskra'); }, i * 420); },
  };
})();
const stred = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function letiText(x, y, text) { if (tiche) return; const s = document.createElement('span'); s.className = 'float-pts'; s.textContent = text; s.style.left = x + 'px'; s.style.top = y + 'px'; document.body.appendChild(s); setTimeout(() => s.remove(), 1200); }
function zablesk(farba) { if (tiche) return; const d = document.createElement('div'); d.className = 'flash'; d.style.background = farba; document.body.appendChild(d); setTimeout(() => d.remove(), 600); }
let toastT;
function toast(text) { const t = document.getElementById('toast'); t.textContent = text; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2800); }

