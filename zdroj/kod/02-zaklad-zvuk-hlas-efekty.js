/* Zvuky: všetky sa skladajú priamo v prehliadači, nič sa nesťahuje */
const Zvuk = (() => {
  let ctx = null, out = null, on = S.get('zvuk', true);
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let sposob = S.get('zvuk-sposob', 'web'); // na iPhone: 'web' (Web Audio) alebo 'subor' (krátke súbory)
  const D = { chyba: '', slucka: 'nespustená', posledny: '' };

  function ac() {
    if (!on) return null;
    try {
      if (!ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) { D.chyba = 'Web Audio v prehliadači chýba'; return null; }
        ctx = new C();
        const comp = ctx.createDynamicsCompressor();
        out = ctx.createGain(); out.gain.value = .75;
        out.connect(comp); comp.connect(ctx.destination);
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
  function tone(c, f, t, d, type = 'sine', v = .2, f2) {
    const o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + t;
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .012); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + d + .03);
  }
  function sum(c, t, d, v, f1, f2) {
    // šum sa vyrobí raz pre každú dĺžku (mávnutie krídel v hre ho pri každom ťuknutí nevyrába znova)
    const pamat = c.sumy || (c.sumy = {});
    let buf = pamat[d];
    if (!buf) { const len = Math.floor(c.sampleRate * d), ch = (buf = pamat[d] = c.createBuffer(1, len, c.sampleRate)).getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t0 = c.currentTime + t;
    s.buffer = buf; fl.type = 'bandpass'; fl.Q.value = 1.4;
    fl.frequency.setValueAtTime(f1, t0); fl.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + d * .3); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    s.connect(fl); fl.connect(g); g.connect(out); s.start(t0); s.stop(t0 + d);
  }
  const zvuky = {
    tap: c => tone(c, 520, 0, .07, 'triangle', .16, 900),
    pop: c => tone(c, 300, 0, .1, 'sine', .3, 1200),
    boing: c => { tone(c, 130, 0, .38, 'sine', .32, 560); tone(c, 260, 0, .25, 'triangle', .07, 1000); },
    whoosh: c => sum(c, 0, .32, .28, 300, 3500),
    start: c => { sum(c, 0, .25, .18, 400, 2500); [523, 659, 784, 1047, 1319].forEach((f, i) => tone(c, f, .05 + i * .055, .16, 'square', .06)); },
    ok: c => { [659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(c, f, i * .07, .24, 'triangle', .22)); tone(c, 2093, .3, .4, 'sine', .08); },
    coin: c => { tone(c, 988, 0, .08, 'square', .07); tone(c, 1319, .07, .34, 'square', .07); },
    bad: c => { tone(c, 311, 0, .18, 'sawtooth', .1, 233); tone(c, 233, .17, .36, 'sawtooth', .1, 110); },
    star: c => { tone(c, 880, 0, .2, 'triangle', .22, 1760); tone(c, 1760, .08, .3, 'sine', .1, 2637); },
    win: c => {
      [392, 523.25, 659.25, 783.99, 659.25, 783.99].forEach((f, i) => tone(c, f, i * .11, .15, 'square', .08));
      [1046.5, 1318.5, 1568].forEach(f => tone(c, f, .68, .9, 'triangle', .13));
      for (let i = 0; i < 10; i++) tone(c, 1800 + Math.random() * 2200, .75 + i * .07, .1, 'sine', .06);
    },
    hoot: c => [0, .34].forEach(t => { tone(c, 440, t, .26, 'sine', .32, 350); tone(c, 880, t, .22, 'sine', .05, 700); }),
    tick: c => tone(c, 1300 + Math.random() * 400, 0, .04, 'square', .035),
    heart: c => { tone(c, 660, 0, .1, 'sine', .22, 990); tone(c, 990, .09, .2, 'sine', .2, 1480); },
    bum: c => { tone(c, 160, 0, .3, 'sine', .35, 50); sum(c, 0, .35, .25, 2500, 400); },
    ton0: c => tone(c, 330, 0, .42, 'triangle', .34), ton1: c => tone(c, 392, 0, .42, 'triangle', .34),
    ton2: c => tone(c, 494, 0, .42, 'triangle', .34), ton3: c => tone(c, 587, 0, .42, 'triangle', .34),
    krid: c => { sum(c, 0, .1, .16, 500, 1500); tone(c, 420, 0, .08, 'sine', .08, 640); },
    cink: c => { [1047, 1319, 1568, 2093].forEach((f, i) => { tone(c, f, i * .07, .32, 'sine', .22); tone(c, f * 2, i * .07, .18, 'triangle', .05); }); tone(c, 2637, .3, .45, 'sine', .1, 3136); },
    // 4.6: zvuk predĺženia série: nábeh, úder, stúpajúca fanfára a trblietky
    seria: c => {
      // nábeh: stúpajúci šum a hučanie, bubnový úder, trúbková fanfára (G dur) a zvončeková trblietka
      sum(c, 0, .5, .22, 300, 4200); tone(c, 150, 0, .5, 'sawtooth', .07, 620);
      [0, .1, .2, .3, .4].forEach(x => tone(c, 90, x, .08, 'sine', .22 + x * .2, 70));
      tone(c, 120, .5, .45, 'sine', .6, 38); sum(c, .5, .3, .35, 3800, 300);
      [[587, .52, .13], [784, .66, .13], [988, .8, .13]].forEach(([f, s, d]) => { tone(c, f, s, d + .1, 'sawtooth', .13); tone(c, f * 2, s, d, 'square', .035); });
      [392, 494, 587, 784, 988].forEach(f => { tone(c, f, .96, 1.1, 'sawtooth', .1); tone(c, f * 2, .96, .9, 'triangle', .06); });
      [1568, 1976, 2349, 2637, 3136, 3951].forEach((f, k) => { tone(c, f, 1.0 + k * .07, .5, 'sine', .11); tone(c, f * 2.01, 1.0 + k * .07, .25, 'sine', .03); });
      for (let k = 0; k < 8; k++) tone(c, 3000 + Math.random() * 3000, 1.2 + k * .08, .12, 'sine', .04);
    },
    dopad1: c => { tone(c, 1319, 0, .3, 'triangle', .26); tone(c, 2637, 0, .2, 'sine', .08); },
    dopad2: c => { tone(c, 1760, 0, .4, 'triangle', .28); tone(c, 3520, .02, .28, 'sine', .08); tone(c, 880, 0, .35, 'sine', .14); },
  };

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

  // Záloha: zvuky vopred vyrobené ako krátke súbory a prehrávané ako bežné audio
  const DLZKA = { tap: .15, pop: .2, boing: .45, whoosh: .4, start: .55, ok: .8, coin: .5, bad: .65, star: .45, win: 1.9, hoot: .7, tick: .07, heart: .35, bum: .55, ton0: .5, ton1: .5, ton2: .5, ton3: .5, cink: .8, seria: 2.6, dopad1: .35, dopad2: .45, krid: .15 };
  const urly = {}, banka = {};
  const nahraj = oc => new Promise((res, rej) => { oc.oncomplete = e => res(e.renderedBuffer); const p = oc.startRendering(); if (p && p.then) p.then(res, rej); });
  async function priprav() {
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) { D.chyba = 'nedajú sa vyrobiť súbory'; return; }
    for (const [n, d] of Object.entries(DLZKA)) {
      try {
        const oc = new OC(1, Math.ceil(44100 * d), 44100), comp = oc.createDynamicsCompressor(), g = oc.createGain();
        g.gain.value = .75; g.connect(comp); comp.connect(oc.destination);
        const zivy = out; out = g;
        try { zvuky[n](oc); } finally { out = zivy; }
        const buf = await nahraj(oc);
        urly[n] = dataUrl(wav(buf.getChannelData(0), buf.sampleRate));
      } catch (e) { D.chyba = 'súbor ' + n + ': ' + e.name; }
    }
  }
  function prehravace() {
    for (const n of Object.keys(urly)) if (!banka[n]) banka[n] = [0, 1].map(() => { const a = new Audio(); a.preload = 'auto'; a.src = urly[n]; a.load(); return a; });
  }
  function hrajSubor(n) {
    if (!banka[n]) return false;
    const zoz = banka[n], a = zoz.find(x => x.paused || x.ended) || zoz[0];
    try { a.currentTime = 0; } catch (e) {}
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
  if (ios) priprav();

  function hrajWeb(n) {
    const c = ac();
    if (!c) return false;
    try { zvuky[n](c); D.posledny = 'Web Audio (' + c.state + ')'; return true; } catch (e) { D.chyba = 'hranie: ' + e.name; return false; }
  }

  return {
    ios,
    get sposob() { return sposob; },
    set sposob(s) { sposob = s; S.set('zvuk-sposob', s); },
    play(n) {
      if (!on || !zvuky[n]) return;
      if (ios && sposob === 'subor' && hrajSubor(n)) { D.posledny = 'súbor'; return; }
      hrajWeb(n);
    },
    test(s) {
      if (!on) this.toggle();
      prebud();
      if (s === 'subor') { if (hrajSubor('ok')) { D.posledny = 'súbor'; setTimeout(() => hrajSubor('coin'), 260); } else D.chyba = 'súbory ešte nie sú pripravené'; }
      else { hrajWeb('ok'); setTimeout(() => hrajWeb('coin'), 260); }
    },
    get on() { return on; },
    stav() { return ctx ? ctx.state : 'zatiaľ nespustený'; },
    diag() {
      return [
        'iPhone: ' + (ios ? 'áno' : 'nie'),
        'appka na ploche: ' + (navigator.standalone || matchMedia('(display-mode: standalone)').matches ? 'áno' : 'nie'),
        'Web Audio: ' + (ctx ? ctx.state : '–'),
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
      g.fillStyle = p.c; g.strokeStyle = '#2B2240'; g.lineWidth = 2;
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
    ohnostroj(n = 5) { for (let i = 0; i < n; i++) setTimeout(() => { this.burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.12 + Math.random() * .35), 34, ['star', 'dot', 'rect'], 8); Zvuk.play('bum'); }, i * 420); },
  };
})();
const stred = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function letiText(x, y, text) { if (tiche) return; const s = document.createElement('span'); s.className = 'float-pts'; s.textContent = text; s.style.left = x + 'px'; s.style.top = y + 'px'; document.body.appendChild(s); setTimeout(() => s.remove(), 1200); }
function zablesk(farba) { if (tiche) return; const d = document.createElement('div'); d.className = 'flash'; d.style.background = farba; document.body.appendChild(d); setTimeout(() => d.remove(), 600); }
let toastT;
function toast(text) { const t = document.getElementById('toast'); t.textContent = text; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2800); }

