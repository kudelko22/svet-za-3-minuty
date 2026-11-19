/* Hudba v dedinke 5.1: krátka vlastná pesnička „Dedinka“ (C dur, 24 taktov, ľahké 4/4, 72 úderov za minútu).
   Klavír sa syntetizuje vo Web Audio (harmonické, rýchly nábeh, pomalé doznievanie, mierny dozvuk), žiadne nahrávky.
   Hrá ticho len v dedinke a izbe (telo má triedu ded-v); stíši sa pri odchode, hre, téme, hlase a vypnutom zvuku (Zvuk.on).
   Kontext sa vytvorí až pri prvom ťuknutí (pravidlá prehliadačov, iPhone). Napojenie: render() volá DedHudba.obnov(). */
var DedHudba = (() => {
  const BPM = 72, OSMINA = 60 / BPM / 2, HLASITOST = .12, DOZNENIE = 1.6, PAUZA = 2.5;
  const MIDI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const nota = s => { const m = /^([A-G])(\d)$/.exec(s); return m ? (Number(m[2]) + 1) * 12 + MIDI[m[1]] : null; };
  // akordy: [základ, kvinta, tercia hore] (midi čísla)
  const AK = { C: [48, 55, 64], F: [41, 48, 57], Am: [45, 52, 60], G: [43, 50, 59] };
  // 24 taktov: akord a melódia (tón, dĺžka v osminách; '-' je pauza); každý takt má 8 osmín
  const TAKTY = [
    ['C', 'E5 2 G5 2 E5 1 D5 1 C5 2'], ['C', 'D5 2 E5 2 G5 4'], ['F', 'C5 2 A4 2 C5 2 F5 2'], ['C', 'E5 6 - 2'],
    ['Am', 'E5 2 C5 2 E5 2 A4 2'], ['F', 'A4 2 C5 2 F5 2 E5 2'], ['G', 'D5 3 B4 1 D5 2 G4 2'], ['C', 'C5 6 - 2'],
    ['F', 'F5 2 A5 2 G5 2 F5 2'], ['C', 'E5 2 G5 2 E5 2 C5 2'], ['G', 'D5 2 G5 2 B4 2 D5 2'], ['Am', 'E5 4 C5 2 A4 2'],
    ['F', 'F5 2 E5 2 D5 2 C5 2'], ['C', 'E5 2 G5 2 C6 4'], ['G', 'G5 4 F5 2 D5 2'], ['C', 'C5 6 - 2'],
    ['C', 'G5 2 E5 2 G5 2 A5 2'], ['C', 'G5 4 E5 4'], ['F', 'A5 2 G5 2 F5 2 E5 2'], ['C', 'D5 2 E5 2 C5 4'],
    ['Am', 'E5 2 A5 2 G5 2 E5 2'], ['F', 'F5 2 A5 2 C6 4'], ['G', 'B5 2 G5 2 D5 2 B4 2'], ['C', 'C5 8'],
  ];
  const TAKT = TAKTY.length, DLZKA = TAKT * 8 * OSMINA + PAUZA;
  // rozpis taktu na tóny: { t: čas od začiatku taktu, f: hz, d: dĺžka, v: sila }
  function tony(i) {
    const [ak, mel] = TAKTY[i], o = [], a = AK[ak], z = mel.split(' ');
    let t = 0;
    for (let k = 0; k < z.length; k += 2) {
      const d = Number(z[k + 1]), m = nota(z[k]);
      if (m != null) o.push({ t: t * OSMINA, f: hz(m), d: d * OSMINA + .9, v: .5 });
      t += d;
    }
    // ľavá ruka: základ, kvinta, tercia hore, kvinta (každé 2 osminy), jemne
    [[0, 0, .3], [2, 1, .2], [4, 2, .17], [6, 1, .2]].forEach(([e, j, v]) => o.push({ t: e * OSMINA, f: hz(a[j]), d: 1.6, v }));
    return o;
  }
  // jeden klavírny tón: harmonické s rôznym doznievaním, rýchly nábeh, tlmený filter
  function klavir(c, ciel, t0, f, v) {
    const g = c.createGain(), filt = c.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = Math.min(6000, f * 7); filt.Q.value = .3;
    const dz = Math.min(3.2, DOZNENIE + 2.4 * (220 / Math.max(f, 110)));
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .006);
    g.gain.exponentialRampToValueAtTime(v * .35, t0 + .25); g.gain.exponentialRampToValueAtTime(.0001, t0 + dz);
    g.connect(filt); filt.connect(ciel);
    [[1, 1], [2, .42], [3, .22], [4, .1], [5, .05]].forEach(([n, s], k) => {
      const o = c.createOscillator(), h = c.createGain();
      o.type = 'sine'; o.frequency.value = f * n * (k ? 1.0008 : 1);
      h.gain.setValueAtTime(s, t0); if (k) h.gain.exponentialRampToValueAtTime(s * .05, t0 + dz / (1 + k * .5)); // vyššie harmonické doznejú rýchlejšie
      o.connect(h); h.connect(g); o.start(t0); o.stop(t0 + dz + .1);
    });
  }
  function takt(c, ciel, i, t0) { for (const n of tony(i % TAKT)) klavir(c, ciel, t0 + n.t, n.f, n.v); }
  function dozvuk(c) {
    const len = Math.floor(c.sampleRate * 1.8), b = c.createBuffer(2, len, c.sampleRate);
    for (let k = 0; k < 2; k++) { const d = b.getChannelData(k); let p = 0; for (let i = 0; i < len; i++) { p = p * .6 + (Math.random() * 2 - 1) * .4; d[i] = p * Math.exp(-i / (c.sampleRate * .45)); } }
    const cv = c.createConvolver(); cv.buffer = b; return cv;
  }
  // reťaz: vstup -> (suchý + mierny dozvuk) -> výstup
  function retaz(c, ciel) {
    const vstup = c.createGain(), dry = c.createGain(), wet = c.createGain(), cv = dozvuk(c);
    dry.gain.value = .8; wet.gain.value = .35;
    vstup.connect(dry); dry.connect(ciel); vstup.connect(cv); cv.connect(wet); wet.connect(ciel);
    return vstup;
  }
  // celá pesnička naraz (na ukážku do súboru cez OfflineAudioContext)
  function nacvic(c, ciel, t0 = 0) { const v = retaz(c, ciel); for (let i = 0; i < TAKT; i++) takt(c, v, i, t0 + i * 8 * OSMINA); return DLZKA; }

  // --- živé hranie v appke ---
  let ctx = null, master = null, vstup = null, dalsi = 0, takty = 0, casovac = 0, ticho = 0, odomknute = false, tlmi = true;
  const ide = () => {
    try {
      return !!document.body.classList.contains('ded-v') && typeof Zvuk !== 'undefined' && Zvuk.on !== false && !document.hidden &&
        !(typeof Hlas !== 'undefined' && Hlas.hovori);
    } catch (e) { return false; }
  };
  function vytvor() {
    if (ctx) return ctx;
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    try {
      ctx = new C(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      vstup = retaz(ctx, master); dalsi = ctx.currentTime + .3; takty = 0;
    } catch (e) { ctx = null; }
    return ctx;
  }
  function tik() {
    if (!ctx) return;
    const chce = ide(), t = ctx.currentTime;
    master.gain.setTargetAtTime(chce ? HLASITOST : 0, t, chce ? .5 : .35);
    if (chce) {
      ticho = 0; tlmi = false;
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      if (ctx.state !== 'running') return;
      if (dalsi < t) dalsi = t + .1;
      while (dalsi < t + 2.5) { // plánuje dopredu po taktoch, na konci kola dá pauzu
        takt(ctx, vstup, takty % TAKT, dalsi); dalsi += 8 * OSMINA; takty++;
        if (takty % TAKT === 0) dalsi += PAUZA;
      }
    } else if (!tlmi && ++ticho >= 8) { // po doznení ticha kontext šetrí batériu
      tlmi = true; try { ctx.suspend(); } catch (e) {}
    }
  }
  // prvé ťuknutie odomkne zvuk (iPhone: kontext sa musí vytvoriť v ťuknutí)
  function odomkni() {
    if (odomknute) return; odomknute = true;
    try { vytvor(); if (ctx && ctx.state === 'suspended') ctx.resume(); } catch (e) {}
    if (ctx && !casovac) casovac = setInterval(tik, 300);
    tik();
  }
  try { if (typeof document !== 'undefined' && document.addEventListener) ['touchend', 'pointerdown', 'click', 'keydown'].forEach(t => document.addEventListener(t, odomkni, { capture: true, passive: true })); } catch (e) {}
  return { obnov() { if (odomknute) tik(); }, nacvic, DLZKA, TAKT, TAKTY, ide, stav: () => (ctx ? ctx.state : 'nespustená') };
})();
