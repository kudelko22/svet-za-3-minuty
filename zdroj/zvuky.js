// Štyri krátke „nahrávky“ (5.0): lístok, strana, pečiatka a húknutie Múdrej.
// Nie sú nahraté mikrofónom, skladá ich tento skript (fyzikálne napodobnenie papiera, gumy a okaríny).
// Vlastné dielo appky, bez cudzích zdrojov. Spustenie: node zdroj/zvuky.js  -> z/*.wav (22 050 Hz, 16 bitov, mono)
const fs = require('fs'), path = require('path');
const SR = 22050;
let seed = 12345; // pevné náhodné čísla: rovnaký výsledok pri každom spustení
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const nahodny = () => rnd() * 2 - 1;

function buf(s) { return new Float32Array(Math.ceil(SR * s)); }
// jednoduché filtre (biquad podľa RBJ)
function biquad(typ, f, q) {
  const w = 2 * Math.PI * f / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  let b0, b1, b2, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  if (typ === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (typ === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = a; b1 = 0; b2 = -a; } // pásmový
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x => { const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}
// filter s meniacou sa frekvenciou (prepočíta sa každých 32 vzoriek)
function sweep(d, typ, fx, q) {
  let f = null;
  for (let i = 0; i < d.length; i++) { if (i % 32 === 0) f = biquad(typ, fx(i / SR), q); d[i] = f(d[i]); }
}
const normal = (d, v) => { let m = 0; for (const x of d) m = Math.max(m, Math.abs(x)); for (let i = 0; i < d.length; i++) d[i] = d[i] / (m || 1) * v; };
const dozvuk = (d, ms = 8) => { const n = Math.floor(SR * ms / 1000); for (let i = d.length - 1; i >= d.length - n && i >= 0; i--) d[i] *= (d.length - 1 - i) / n; };

// Odtrhnutie lístka: zrnká trhaného papiera, ktoré sa zrýchľujú, a na konci krátke „rup“
function listok() {
  const d = buf(.34), n = d.length;
  const hp = biquad('hp', 900, .7), bp = biquad('bp', 3200, .9);
  let t = 0;
  while (t < .27) {
    const hust = .006 - .0045 * (t / .27); // zrnká sú stále hustejšie
    t += hust * (.4 + rnd() * 1.2);
    const i0 = Math.floor(t * SR), dl = Math.floor(SR * (.0015 + rnd() * .004)), a = .3 + rnd() * .7 * (t / .27 + .3);
    for (let k = 0; k < dl && i0 + k < n; k++) d[i0 + k] += nahodny() * a * Math.exp(-k / (dl * .35));
  }
  // šuchot pod tým
  for (let i = 0; i < n; i++) { const tt = i / SR; d[i] += nahodny() * .18 * Math.min(1, tt / .03) * Math.max(0, 1 - tt / .32); }
  for (let i = 0; i < n; i++) d[i] = hp(d[i]) * .7 + bp(d[i]) * .6;
  normal(d, .8); dozvuk(d); return d;
}

// Otočenie strany: oblúk šumu, ktorý sa zdvihne a klesne, chvenie listu a mäkké plesknutie na konci
function strana() {
  const d = buf(.48), n = d.length;
  for (let i = 0; i < n; i++) {
    const t = i / SR, obal = Math.sin(Math.PI * Math.min(1, t / .36)) ** 1.6 * (t < .36 ? 1 : 0);
    const chvenie = 1 + .45 * Math.sin(2 * Math.PI * (18 + 14 * t) * t) * Math.exp(-t * 4);
    d[i] = nahodny() * obal * chvenie;
  }
  sweep(d, 'bp', t => 700 + 2600 * Math.sin(Math.PI * Math.min(1, t / .38)), .8);
  // plesknutie listu o list
  const lp = biquad('lp', 1400, .7);
  for (let i = Math.floor(.33 * SR); i < n; i++) { const t = i / SR - .33; d[i] += lp(nahodny()) * 1.6 * Math.exp(-t / .018) + Math.sin(2 * Math.PI * 140 * t) * .25 * Math.exp(-t / .03); }
  normal(d, .7); dozvuk(d, 15); return d;
}

// Pečiatka: tlmený úder gumy do papiera na drevenom stole
function peciatka() {
  const d = buf(.3), n = d.length;
  const lp = biquad('lp', 700, .8), bp = biquad('bp', 1700, 1.2);
  let faza = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, f = 55 + 70 * Math.exp(-t / .025); faza += 2 * Math.PI * f / SR;
    const telo = Math.sin(faza) * Math.exp(-t / .07);                      // dunivý úder
    const drevo = Math.sin(2 * Math.PI * 233 * t) * .35 * Math.exp(-t / .045) + Math.sin(2 * Math.PI * 611 * t) * .12 * Math.exp(-t / .02);
    const sum = nahodny();
    const papier = bp(sum) * Math.exp(-t / .012) * 1.3;                   // plesk papiera
    const guma = lp(sum) * Math.exp(-t / .03) * .9;                        // mäkká guma
    d[i] = Math.min(1, t / .0015) * (telo + drevo + papier + guma);
  }
  normal(d, .9); dozvuk(d, 20); return d;
}

// Húknutie Múdrej: dva mäkké tóny okaríny, dole a hore („hú-hú“), s dychom a jemným vibrátom
function mudra() {
  const d = buf(.78), n = d.length;
  const tony = [{ z: .02, k: .33, f: 392, od: 360 }, { z: .4, k: .74, f: 523.25, od: 494 }];
  const dych = biquad('bp', 900, 1.5);
  for (const tn of tony) {
    let faza = 0;
    for (let i = Math.floor(tn.z * SR); i < Math.floor(tn.k * SR) && i < n; i++) {
      const t = i / SR - tn.z, dl = tn.k - tn.z;
      const f = tn.f + (tn.od - tn.f) * Math.exp(-t / .03) + (t > .05 ? tn.f * .006 * Math.sin(2 * Math.PI * 5.2 * t) : 0) - (t > dl - .07 ? tn.f * .03 * (t - dl + .07) / .07 : 0);
      faza += 2 * Math.PI * f / SR;
      const obal = Math.min(1, t / .045) ** 1.5 * Math.min(1, (dl - t) / .1);
      const ton = Math.sin(faza) + .12 * Math.sin(2 * faza) + .05 * Math.sin(3 * faza);
      d[i] += obal * (ton * .9 + dych(nahodny()) * .5 * (.6 + .4 * Math.exp(-t / .05)));
    }
  }
  normal(d, .8); dozvuk(d, 20); return d;
}

function wav(d) {
  const b = Buffer.alloc(44 + d.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + d.length * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(d.length * 2, 40);
  d.forEach((x, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, x)) * 32767), 44 + i * 2));
  return b;
}

const ciel = path.join(__dirname, '..', 'z');
fs.mkdirSync(ciel, { recursive: true });
let spolu = 0;
for (const [m, fn] of Object.entries({ listok, strana, peciatka, mudra })) {
  const b = wav(fn()); fs.writeFileSync(path.join(ciel, m + '.wav'), b); spolu += b.length;
  console.log(m + '.wav', (b.length / 1024).toFixed(1) + ' kB');
}
console.log('spolu', (spolu / 1024).toFixed(1) + ' kB');
