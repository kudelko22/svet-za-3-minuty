/* 5.1 Moja dedinka: scéna (obloha, kopce, rady miest, strom múdrosti na námestí, hlavný dom, miesta hier), presuny s obláčikmi
   a izba v hlavnom dome. Kresby vecí: obrazky.js (dedinkaVec), dáta: 25-dedinka-data.js (Dedinka), štýly: 61-dedinka-scena.css.
   Súradnice scény: šírka DS_W, výška DS_H, stred DS_X. Každá vec stojí pätou na (x, y) a má mierku s (vzadu menšia). */
const DS_W = 1400, DS_H = 640, DS_X = 700, DS_Y0 = 100; // DS_Y0: horný kúsok oblohy sa neukazuje
// 5.1 (20. 11.): scéna je širšia, aby budovy mali vzduch; DS_ROZ = rozostup do strán, dsSx prepočíta pôvodné x (scéna 1100) na nové
const DS_ROZ = 1.27, dsSx = x => DS_X + (x - 550) * DS_ROZ;
// rady miest (1 vzadu, 5 vpredu): päta y, mierka, polovica stredného pásu (cesta, námestie, hry), krok medzi stĺpcami
const DS_RADY = { 1: [262, .6, 165, 56], 2: [330, .72, 190, 58], 3: [410, .85, 260, 71], 4: [492, .97, 295, 79], 5: [585, 1.1, 320, 86] };
// miesto r{rad}c{stĺpec}: stĺpce 1–4 vľavo od stredu (1 najďalej), 5–8 vpravo; široká vec (sirka 2) stojí medzi svojím a ďalším stĺpcom
// 5.1: doplnkové miesta r{rad}d{n} (n od 1 zľava): medzi radmi, pri jazierku vľavo vzadu a v predných rohoch; len úzke veci; mimo hier, domu, stromu, cesty a smerovníka
// rad: [päta, mierka, x…] alebo viac skupín za sebou; počty musia sedieť s DED_DOPLNKY (25-dedinka-data.js)
const DS_DOPLNKY = {
  2: [[296, .66, [42, 210, 270, 330, 390, 706, 766, 826, 886, 946, 1006]]],
  3: [[370, .78, [42, 106, 170, 234, 850, 914, 978, 1042]]],
  4: [[451, .91, [42, 118, 194, 270, 838, 914, 990]]],
  5: [[539, 1.04, [42, 126, 210, 812, 874, 958, 1042]], [625, 1.14, [42, 114, 186, 826, 898, 970, 1042]]],
};
function dedMiesto(kl, sirka = 1) {
  const m = /^r([1-5])(?:c([1-8])|d(\d{1,2}))$/.exec(kl); if (!m) return null;
  if (m[3]) { // doplnkové miesto: pevný bod, jemne rozhádzaný v y, aby nestáli ako pod pravítkom
    let n = +m[3]; for (const [y, s, xs] of DS_DOPLNKY[m[1]] || []) { if (n <= xs.length) return { x: Math.round(dsSx(xs[n - 1])), y: y + ((n * 7) % 3 - 1) * 4, s, rad: +m[1] }; n -= xs.length; }
    return null;
  }
  const [y, s, g, k] = DS_RADY[m[1]], x = c => { const l = c <= 4, i = l ? 4 - c : c - 5; return DS_X + (l ? -1 : 1) * (g + (i + .5) * k); };
  const c = +m[2]; return { x: sirka === 2 && c < 8 ? (x(c) + x(c + 1)) / 2 : x(c), y, s, rad: +m[1] };
}
// cesta: jedna súvislá krivka od popredia cez námestie až za kopec; stred x a šírka podľa y (perspektíva)
const dsCx = y => DS_X + 26 * (y - 200) / 460 * Math.sin((660 - y) / 70);
const dsCw = y => 8 + 64 * Math.pow(Math.max(0, (y - 205) / 455), 1.1);
const dsMier = y => Math.max(.4, .6 + (y - 262) * .00155); // mierka krajiny v danej hĺbke
// mäkký tieň a kúsok trávy pod vecou (svetlo zľava zhora ako slnko, tieň trochu doprava); w = polovica šírky pri mierke 1
function dsZem(x, y, s, w) {
  const rx = w * s, t = (a, z) => `<path transform="translate(${(x + a * rx).toFixed(1)} ${(y + 1).toFixed(1)}) scale(${(s * z).toFixed(2)})" d="M-4 0q-1-5-4-7M0 0q0-6 1-10M4 0q1-4 4-6" fill="none" stroke="var(--dv-lis-d)" stroke-width="2"/>`;
  return `<g class="ds-pod"><ellipse cx="${(x + rx * .12).toFixed(1)}" cy="${(y + 1.5).toFixed(1)}" rx="${(rx * 1.08).toFixed(1)}" ry="${(rx * .2 + 2).toFixed(1)}" fill="var(--ds-tien)" opacity=".2" stroke="none"/>
    <ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(rx * .8).toFixed(1)}" ry="${(rx * .13 + 1.5).toFixed(1)}" fill="var(--dv-lis-d)" opacity=".18" stroke="none"/>${t(-.95, 1)}${t(.9, .8)}${w > 34 ? t(-.4, .7) : ''}</g>`;
}
const DS_ZEM_SK = { domcek: 38, strom: 26, kvety: 20, plot: 26, zviera: 22, ozdoba: 24 };
// pevné miesta hier (posun od stredu, päta, mierka); hra dostane miesto podľa poradia ceny vo svojom vekovom zozname
const DS_HRY_MIESTA = [[-152, 410, .84], [152, 410, .84], [-116, 330, .72], [116, 330, .72], [-140, 502, .92], [176, 502, .95],
  [-80, 268, .6], [84, 268, .6], [196, 600, 1.02], [-62, 230, .5], [62, 230, .5], [0, 212, .46],
  [-200, 455, .88], [214, 455, .88], [-240, 376, .78], [232, 378, .78], [-118, 566, 1]]; // 5.1: miesta pre nové hry (09b-hry-51.js)
const DS_DOM = [-230, 606, .98]; // hlavný dom vpredu vľavo od cesty, blízko stromu (na telefóne sú pri prvom pohľade oba)
const DS_STROM = [0, 404, .64]; // strom múdrosti na námestí v strede (mierka kresby stromSvg)
// voľby položenej veci: reťazec, znak i = i-tá voľba z DEDINKA_VOLBY[kľúč] (poradie kľúčov), '0' = základ, '1' = prvá hodnota, '2' = druhá…
function dedVolby(kluc, r) {
  const o = {}, V = (typeof DEDINKA_VOLBY !== 'undefined' && DEDINKA_VOLBY[kluc]) || {};
  Object.keys(V).forEach((dim, i) => {
    const n = parseInt((r || '')[i] || '0', 36), v = n > 0 ? V[dim][n - 1] : undefined; if (v === undefined) return;
    const [a, b] = dim.split('.'); if (b) (o[a] = o[a] || {})[b] = v; else o[a] = v;
  });
  return o;
}
// kľúč kresby veci z katalógu (nábytková lampa má v kresbách iný kľúč; zámoček je v kresbách, hoci katalóg kresbu ešte nemá)
const dedKresba = id => { const v = typeof DED_VEC !== 'undefined' && DED_VEC[id]; if (!v) return null; if (id === 'lampa_izba') return 'nab.lampa'; const k = v.kresba ? v.kresba[1] : id; return dedinkaKresby.RAMCEK[k] ? k : null; };

const DedScena = {
  x: null, // posun scény do strán (ostane pri návrate z hry)
  navrat: null, // {id, zisk}: z ktorej hry sa dieťa vrátilo (hviezdy sa ukážu pri mieste hry)
  hry() { return [...HRY_VID()].sort((a, b) => a.cena - b.cena); },
  // hry v dedinke: odomknuté (aj spiace pri vädnúcom strome) a najbližšia zamknutá ako stavenisko; ostatné ešte nie sú postavené
  miestaHier() {
    const vs = this.hry(), mam = bodyHry(); let dalsia = false;
    return vs.map((h, i) => {
      const [dx, y, s] = DS_HRY_MIESTA[i] || DS_HRY_MIESTA[DS_HRY_MIESTA.length - 1], ok = mam >= h.cena, spi = !ok && st.body >= h.cena;
      if (!ok && !spi) { if (dalsia) return null; dalsia = true; }
      return { h, x: DS_X + dx * DS_ROZ, y, s, stav: ok ? 'ok' : spi ? 'spi' : 'stavba' };
    }).filter(Boolean);
  },
  stromInfo() {
    const pocet = st.dni.length, i = stromStupen(pocet), s = seria(), S0 = STROM_STUPNE[i], hn = hnStupen(), naStrome = Math.min(s, S0.plody), kos = Math.max(0, s - S0.plody);
    return { i, hn, naStrome, kos, popis: `Strom múdrosti: ${S0.n.toLowerCase()}${hn ? ', ' + HN_TEXT[hn].n.toLowerCase() : ''}. Otvoriť` };
  },
  // jedna vec scény: obal na ťuknutie (bez transform atribútu, aby sa dal jemne zväčšiť) okolo kresby
  tuk(ded, popis, telo, tr = '') { return `<g class="ds-tuk${tr}" data-ded="${ded}" role="button" tabindex="0" aria-label="${esc(popis)}">${telo}</g>`; },
  cenovka(x, y, cena) {
    return `<g class="ds-cena" transform="translate(${x} ${y})"><path d="M-1.5 0v-14" stroke-width="2.2"/><rect x="-24" y="-31" width="48" height="19" rx="6" fill="var(--dv-drevo)" stroke-width="2.2"/>
      <path d="M-14 -27.5l1.4 2.9 3.2.4-2.4 2.2.6 3.1-2.8-1.6-2.8 1.6.6-3.1-2.4-2.2 3.2-.4z" fill="var(--sun)" stroke-width="1.2"/>
      <text x="7" y="-17" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="12" fill="var(--dv-biela)" stroke="none">${cena}</text></g>`;
  },
  // chodníčky: [d, šírka]. Od dverí hlavného domu, hier a domčekov dieťaťa oblúkom k hlavnej ceste; kamienky (Ploty a cesty) sa spoja so susednými kamienkami
  // a s cestou, osamotené dostanú krátky zaoblený kúsok chodníka pod sebou. Kreslí ich krajina() pod všetky veci.
  chodniky() {
    const out = [], f1 = v => v.toFixed(1), DX = (typeof dedinkaKresby !== 'undefined' && dedinkaKresby.DVERE_X) || {};
    // blízko cesty: oblúkom až do cesty; ďalej od nej: krátky vyšliapaný chodníček bez obrysu (tretí údaj 1), ktorý sa zúži a stratí v tráve
    const kCeste = (x, y, s, plny) => { const yt = Math.min(DS_H + 10, y + 12 * s), cx = dsCx(yt), w = 8 * s + 3, z = Math.sign(cx - x) || 1;
      if (plny || Math.abs(cx - x) < 210 * s) { out.push([`M${f1(x)} ${f1(y - 1)}Q${f1(x)} ${f1(yt)} ${f1(x + (cx - x) * .5)} ${f1(yt)}T${f1(cx)} ${f1(yt)}`, w]); return; }
      const x1 = x + z * 16 * s, y1 = y + 13 * s, x2 = x + z * 44 * s, y2 = y + 17 * s;
      out.push([`M${f1(x)} ${f1(y - 1)}Q${f1(x)} ${f1(y1)} ${f1(x1)} ${f1(y1)}`, w, 1], [`M${f1(x1)} ${f1(y1)}Q${f1((x1 + x2) / 2)} ${f1(y1 + 2 * s)} ${f1(x2)} ${f1(y2)}`, w * .62, 1]); };
    { const [dx, y, s] = DS_DOM; kCeste(DS_X + dx + (DX.domov || 0) * s, y, s, true); } // hlavný dom vždy až k ceste
    this.miestaHier().forEach(m => { if (m.stav !== 'stavba' && m.h.id in DX) kCeste(m.x + DX[m.h.id] * m.s, m.y, m.s); });
    const d = typeof Dedinka !== 'undefined' ? Dedinka.ziskaj() : null, rady = typeof Dedinka !== 'undefined' ? Dedinka.rady() : 2, kamene = [];
    Object.entries((d && d.miesta) || {}).forEach(([kl, [typ, zrk]]) => {
      const vec = DED_VEC[typ], m = vec && dedMiesto(kl, vec.sirka); if (!m || m.rad > rady) return;
      if (vec.sk === 'domcek' && typ in DX) kCeste(m.x + DX[typ] * m.s * (zrk ? -1 : 1), m.y, m.s);
      if (typ === 'kamen_cesta') kamene.push(m);
    });
    // kamienky spojí strom najkratších spojení (bez trojuholníkov); skupina blízko cesty sa napojí na cestu z najbližšieho kamienka
    const dl = (a, b) => Math.hypot(b.x - a.x, (b.y - a.y) * 1.6), hr = [], sk = kamene.map((_, i) => i), koren = i => sk[i] === i ? i : (sk[i] = koren(sk[i]));
    kamene.forEach((a, i) => kamene.forEach((b, j) => { if (j > i && dl(a, b) < 150 * Math.max(a.s, b.s)) hr.push([dl(a, b), i, j]); }));
    hr.sort((p, q) => p[0] - q[0]).forEach(([, i, j]) => { if (koren(i) === koren(j)) return; sk[koren(i)] = koren(j); const a = kamene[i], b = kamene[j];
      a.sp = b.sp = 1; out.push([`M${f1(a.x)} ${f1(a.y - 3 * a.s)}Q${f1((a.x + b.x) / 2)} ${f1(Math.max(a.y, b.y) - 2)} ${f1(b.x)} ${f1(b.y - 3 * b.s)}`, 11 * (a.s + b.s) / 2 + 2]); });
    const skupiny = {}; kamene.forEach((a, i) => { const k = koren(i), r = Math.abs(a.x - dsCx(a.y)) / a.s; if (!skupiny[k] || r < skupiny[k].r) skupiny[k] = { a, r }; });
    Object.values(skupiny).forEach(({ a, r }) => { const w = 11 * a.s + 2, cx = dsCx(a.y);
      if (r < 190) out.push([`M${f1(a.x)} ${f1(a.y - 3 * a.s)}Q${f1((a.x + cx) / 2)} ${f1(a.y + 4 * a.s)} ${f1(cx)} ${f1(a.y)}`, w]);
      else if (!a.sp) out.push([`M${f1(a.x - 30 * a.s)} ${f1(a.y - 2 * a.s)}Q${f1(a.x)} ${f1(a.y + 2 * a.s)} ${f1(a.x + 32 * a.s)} ${f1(a.y - 3 * a.s)}`, w]); });
    kamene.forEach(a => { if (!a.sp && !Object.values(skupiny).some(g => g.a === a)) out.push([`M${f1(a.x - 30 * a.s)} ${f1(a.y - 2 * a.s)}Q${f1(a.x)} ${f1(a.y + 2 * a.s)} ${f1(a.x + 32 * a.s)} ${f1(a.y - 3 * a.s)}`, 11 * a.s + 2]); });
    return out;
  },
  krajina(chodniky = []) {
    const W = DS_W, H = DS_H, X = DS_X, f1 = v => v.toFixed(1);
    let seme = 7; const rnd = () => (seme = (seme * 9301 + 49297) % 233280) / 233280; // pevná „náhoda“: krajina je vždy rovnaká
    // kopec: mäkké nepravidelné vlny (pevné „náhodné“ výšky podľa fz), každý rad iný; vráti obrys
    const kopecD = (y, amp, fz) => {
      const n = 7, kr = W / (n - 1); let d = `M-30 ${y}`, px = -30, py = y;
      for (let i = 0; i <= n; i++) {
        const x = i * kr + ((i * 37 + fz * 13) % 41) - 20, h = y - amp * (.3 + (((Math.sin(i * 12.9 + fz * 7.3) * 43758.5) % 1) + 1) % 1 * .7), c = (px + x) / 2;
        d += ` C${c.toFixed(0)} ${py.toFixed(0)} ${c.toFixed(0)} ${h.toFixed(0)} ${x.toFixed(0)} ${h.toFixed(0)}`; px = x; py = h;
      }
      return d + ` V${H + 10} H-30Z`;
    };
    // vrstva kopca: jemný tieň nad hrebeňom (kopec vzadu je pri ňom tmavší), plocha, svetlý lem pod hrebeňom
    const kopec = (y, amp, f, fz, obrys = '') => { const d = kopecD(y, amp, fz);
      return `<path d="${d}" transform="translate(0 -6)" fill="var(--ds-tien)" opacity=".08"/><path d="${d}" fill="${f}"${obrys}/><path d="${d}" transform="translate(0 6)" fill="none" stroke="var(--dv-lis-l)" stroke-width="3" opacity=".3"/>`; };
    const hv = [[90, 60], [210, 74], [330, 92], [470, 66], [610, 86], [740, 60], [900, 74], [1020, 68], [160, 130], [960, 128], [400, 120], [520, 82], [575, 140], [660, 116], [440, 170], [800, 150], [360, 156]].map(([x, y], i) => `<circle class="ds-hv" cx="${dsSx(x).toFixed(0)}" cy="${y}" r="${i % 3 ? 1.6 : 2.3}" fill="var(--dv-svetlo)" style="--d:${(i % 5) * 1.3}s"/>`).join('');
    // ďaleké hory (bez obrysu, splývajú s oblohou) so snehom na vrcholoch
    const hory = [[-30, 206], [70, 160], [150, 186], [250, 140], [350, 182], [430, 164], [520, 190], [640, 150], [740, 184], [830, 158], [930, 188], [1020, 146], [1130, 196]];
    hory.forEach(h => { h[0] = Math.round(dsSx(h[0])); });
    let hd = `M${hory[0][0]} ${hory[0][1]}`; for (let i = 1; i < hory.length; i++) { const [x, y] = hory[i], [x0, y0] = hory[i - 1]; hd += ` Q${(x0 + x) / 2} ${Math.min(y0, y) - 6} ${x} ${y}`; }
    const sneh = hory.filter(([, y]) => y < 170).map(([x, y]) => `<path d="M${x - 14} ${y + 12}q7-10 14-13q7 3 14 13q-4-3-7 1q-4-4-7 0q-4-4-7 0q-3-4-7-1z" fill="var(--dv-sneh)" opacity=".75"/>`).join('');
    // les na obzore: rad malých korún za druhým kopcom a pár stromov z kresieb
    const koruny = Array.from({ length: 66 }, (_, i) => { const x = i * 21.5 + (i * 17) % 11, y = 238 + (i * 13) % 9, r = 11 + (i * 7) % 7;
      return Math.abs(x - X) < 22 ? '' : i % 3 ? `<circle cx="${x}" cy="${y - r}" r="${r}" fill="var(--ds-les)" stroke="var(--ds-les-d)" stroke-width="1.6"/>` : `<path d="M${x} ${y - r * 2.6}l${r * .9} ${r * 2.2}h${-r * 1.8}z" fill="var(--ds-les)" stroke="var(--ds-les-d)" stroke-width="1.6"/>`; }).join('');
    const les = [[70, 214, .42, 'smrek'], [104, 220, .36, 'smrek'], [300, 206, .34, 'gulaty'], [790, 208, .36, 'gulaty'], [990, 212, .42, 'smrek'], [1030, 218, .34, 'smrek'], [640, 200, .3, 'breza']]
      .map(([x, y, s, k]) => dedinkaVec(k, { x: dsSx(x), y, s })).join('');
    // cesta: jeden súvislý pás od spodku cez námestie (strom stojí na nej) až za kopec; okraje, vyšliapaný stred, kamienky po krajoch
    const ys = []; for (let y = 222; y <= H + 30; y += 6) ys.push(y);
    const okraj = (z, k) => ys.map(y => `${f1(dsCx(y) + z * dsCw(y) * k)} ${y}`);
    const pas = k => `M${okraj(-1, k).join('L')}L${okraj(1, k).reverse().join('L')}Z`;
    const ciara = (z, k) => `M${okraj(z, k).join('L')}`;
    const kam = []; for (let y = 236; y < H + 10; y += 15 + rnd() * 16) { const s = dsMier(y), z = kam.length % 2 ? 1 : -1, x = dsCx(y) + z * (dsCw(y) * .5 + 3 * s);
      kam.push(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(4.5 * s + rnd() * 2 * s)}" ry="${f1(2.8 * s)}" fill="var(--dv-kamen)" stroke="var(--ink)" stroke-width="${f1(1.4 + s * .4)}"/>`); }
    const vnut = []; for (let y = 300; y < H; y += 34 + rnd() * 30) { const s = dsMier(y); vnut.push(`<ellipse cx="${f1(dsCx(y) + (rnd() - .5) * dsCw(y) * .6)}" cy="${f1(y)}" rx="${f1(2.6 * s)}" ry="${f1(1.6 * s)}" fill="var(--ds-cesta-d)" stroke="none"/>`); }
    // chodníčky (od dverí, medzi kamienkami): najprv ich obrys, potom hlavná cesta, potom ich výplň cez okraj cesty, takže sa napoja bez švu a bez tvrdého konca
    const chObrys = chodniky.filter(c => !c[2]).map(([d, w]) => `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="${f1(w + 4.6)}"/>`).join('');
    const chVypln = chodniky.map(([d, w, mak]) => `<path d="${d}" fill="none" stroke="var(--dv-cesta)" stroke-width="${f1(w)}"${mak ? ' opacity=".8"' : ''}/><path d="${d}" fill="none" stroke="var(--ds-cesta-l)" stroke-width="${f1(w * .3)}" opacity=".55"/>`).join('');
    const cesta = `${chObrys}<path d="${pas(.5)}" fill="var(--dv-cesta)" stroke="var(--ink)" stroke-width="2.6"/>${chVypln}
      <path d="${ciara(-1, .4)}" fill="none" stroke="var(--ds-cesta-d)" stroke-width="2.2" opacity=".55"/><path d="${ciara(1, .4)}" fill="none" stroke="var(--ds-cesta-d)" stroke-width="2.2" opacity=".55"/>
      <path d="${pas(.16)}" fill="var(--ds-cesta-l)" opacity=".6"/>${vnut.join('')}${kam.join('')}`;
    // jazierko vľavo vzadu: breh, voda s odleskom, lekná, trstina a kamene
    const jx = Math.round(dsSx(140)), jy = 318;
    const jazero = `<g class="ds-jazero"><ellipse cx="${jx + 4}" cy="${jy + 3}" rx="80" ry="25" fill="var(--dv-lis-d)" opacity=".45"/>
      <ellipse cx="${jx}" cy="${jy}" rx="70" ry="19" fill="var(--ds-voda)" stroke="var(--ink)" stroke-width="2.4"/><ellipse cx="${jx - 6}" cy="${jy - 4}" rx="52" ry="10" fill="var(--ds-voda-l)"/>
      <path d="M${jx - 40} ${jy - 3}q12-4 24 0M${jx + 14} ${jy + 6}q9-3 18 0" fill="none" stroke="#fff" stroke-width="2.2" opacity=".7"/>
      <ellipse class="dv-noc" cx="${jx + 22}" cy="${jy - 2}" rx="12" ry="3" fill="var(--sun-l)" opacity=".55"/>
      <g fill="var(--leaf)" stroke="var(--ink)" stroke-width="1.6"><path d="M${jx + 30} ${jy + 4}a9 3.4 0 1 0 1-.1l-6 .6z"/><path d="M${jx - 22} ${jy + 8}a7 2.8 0 1 0 1-.1l-5 .5z"/></g><circle cx="${jx + 31}" cy="${jy + 2}" r="2.4" fill="var(--dv-ruzova)" stroke="var(--ink)" stroke-width="1.2"/>
      <g stroke="var(--ink)" stroke-width="1.8">${[[-66, 2, 26], [-60, 6, 32], [-54, 4, 22], [62, 3, 24], [68, -2, 30]].map(([dx, dy, h]) => `<path d="M${jx + dx} ${jy + dy}q${dx < 0 ? -2 : 2} ${-h / 2} 0 ${-h}" fill="none" stroke="var(--dv-lis-d)" stroke-width="2.2"/><rect x="${jx + dx - 2.4}" y="${jy + dy - h - 2}" width="4.8" height="10" rx="2.4" fill="var(--dv-drevo-d)"/>`).join('')}</g>
      <g fill="var(--dv-kamen)" stroke="var(--ink)" stroke-width="1.8"><ellipse cx="${jx - 30}" cy="${jy + 19}" rx="8" ry="4.5"/><ellipse cx="${jx - 18}" cy="${jy + 21}" rx="5" ry="3"/><ellipse cx="${jx + 44}" cy="${jy + 15}" rx="7" ry="4"/></g></g>`;
    // plot na kopci vpravo vzadu
    let pp = '', r1 = [], r2 = [];
    for (let x = 1110; x <= DS_W + 10; x += 24) { const y = 236 + (x - 1110) * .04 + Math.sin(x / 40) * 2;
      pp += `<path d="M${x - 2.2} ${f1(y)}v-17l2.2-3 2.2 3v17z" fill="var(--dv-drevo)"/>`; r1.push(`${x} ${f1(y - 13)}`); r2.push(`${x} ${f1(y - 6)}`); }
    const latka = r => `<path d="M${r.join('L')}" fill="none" stroke-width="5.4"/><path d="M${r.join('L')}" fill="none" stroke="var(--dv-drevo)" stroke-width="2.6"/>`;
    const plot = `<g class="ds-plot" stroke="var(--ink)" stroke-width="1.6">${latka(r1)}${latka(r2)}${pp}</g>`;
    // textúra lúky: svetlé a tmavé škvrny, trsy trávy, drobné kvietky, kamienky (nie na ceste, jazierku a námestí)
    const volne = (x, y, m = 10) => Math.abs(x - dsCx(y)) > dsCw(y) / 2 + m && ((x - jx) / 86) ** 2 + ((y - jy) / 30) ** 2 > 1 && ((x - X) / 96) ** 2 + ((y - DS_STROM[1]) / 28) ** 2 > 1;
    let tex = '';
    for (let i = 0; i < 18; i++) { const y = 250 + rnd() * 390, x = rnd() * W, s = dsMier(y); tex += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1((30 + rnd() * 50) * s)}" ry="${f1((5 + rnd() * 5) * s)}" fill="var(${i % 3 ? '--dv-lis-l' : '--dv-lis-d'})" opacity="${i % 3 ? .16 : .1}"/>`; }
    for (let i = 0; i < 130; i++) { const y = 236 + rnd() * 410, x = rnd() * W, s = dsMier(y); if (!volne(x, y)) continue;
      tex += `<path transform="translate(${f1(x)} ${f1(y)}) scale(${(s * (.7 + rnd() * .5)).toFixed(2)})" d="M-5 0q-1-6-4-9M0 0q0-8 1-12M5 0q1-6 5-8" fill="none" stroke="var(--dv-lis-d)" stroke-width="2.2"/>`; }
    const FK = ['#fff', 'var(--dv-ruzova)', 'var(--sun)', 'var(--coral-l, #FF9E8A)'];
    for (let i = 0; i < 46; i++) { const y = 250 + rnd() * 390, x = rnd() * W, s = dsMier(y); if (!volne(x, y, 14)) continue;
      tex += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s.toFixed(2)})"><path d="M0 0v-7" fill="none" stroke="var(--dv-lis-d)" stroke-width="1.6"/><circle cy="-8" r="3.4" fill="${FK[i % 4]}" stroke="var(--ink)" stroke-width="1.3"/><circle cy="-8" r="1.2" fill="var(--sun)" stroke="none"/></g>`; }
    for (let i = 0; i < 16; i++) { const y = 260 + rnd() * 380, x = rnd() * W, s = dsMier(y); if (!volne(x, y, 16)) continue;
      tex += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s.toFixed(2)})" stroke="var(--ink)" stroke-width="1.6"><ellipse cx="0" cy="-2.5" rx="7" ry="4.2" fill="var(--dv-kamen)"/><path d="M-4 -4q2-2 5-2" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>${i % 2 ? '<ellipse cx="8" cy="-1" rx="3.6" ry="2.4" fill="var(--dv-kamen)"/>' : ''}</g>`; }
    // lúka pri ceste: pár kvetov a krík (nie sú dieťaťa, len krajina)
    const luka = [[485, 470, .55, 'kvety'], [626, 532, .6, 'tulipany'], [672, 574, .7, 'ker'], [430, 560, .55, 'kvety']].map(([x0, y, s, k]) => { const x = dsSx(x0); return dsZem(x, y, s, 18) + dedinkaVec(k, { x, y, s }); }).join('');
    return `<defs><linearGradient id="ds-obzor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--dv-oblak)" stop-opacity="0"/><stop offset="1" stop-color="var(--dv-oblak)" stop-opacity=".55"/></linearGradient></defs>
      <rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="var(--dv-nebo)"/><rect x="-10" y="110" width="${W + 20}" height="120" fill="url(#ds-obzor)"/>
      <g class="dv-den"><circle cx="${X + 165}" cy="112" r="28" fill="var(--sun)" stroke="var(--ink)" stroke-width="2.5"/><circle cx="${X + 165}" cy="112" r="41" fill="none" stroke="var(--sun)" stroke-width="5" stroke-dasharray=".1 12.5" stroke-linecap="round" opacity=".8"/></g>
      <g class="dv-noc"><path d="M${X + 176} 88a26 26 0 1 0 14 44a21 21 0 0 1-14-44z" fill="var(--sun-l)" stroke="var(--ink)" stroke-width="2.5"/>${hv}</g>
      <path d="${hd} V240 H-30Z" fill="var(--ds-hora)"/>${sneh}
      <g class="ds-mrak" style="--t:46s">${dedinkaVec('oblak1', { x: dsSx(210), y: 116, s: .7 })}</g><g class="ds-mrak ds-mrak2" style="--t:58s">${dedinkaVec('oblak3', { x: dsSx(760), y: 70, s: .62 })}</g><g class="ds-mrak" style="--t:64s">${dedinkaVec('oblak2', { x: dsSx(980), y: 150, s: .45 })}</g>
      ${kopec(214, 34, 'var(--dv-kopec1)', 3)}
      ${koruny}<g stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${les}</g>
      ${kopec(262, 30, 'var(--dv-kopec2)', 7)}${plot}
      ${kopec(338, 24, 'var(--dv-kopec3)', 11, ' stroke="var(--dv-lis-d)" stroke-width="2.2" stroke-opacity=".55"')}
      ${kopec(458, 20, 'var(--dv-kopec4)', 5, ' stroke="var(--dv-lis-d)" stroke-width="2.4" stroke-opacity=".7"')}
      ${kopec(552, 16, 'var(--dv-zem)', 2, ' stroke="var(--ink)" stroke-width="2.4"')}
      <g class="ds-tex" stroke-linecap="round">${tex}</g>${jazero}
      <g class="ds-cesta" stroke-linejoin="round" stroke-linecap="round">${cesta}</g>
      <g stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${luka}</g>`;
  },
  // námestie: kamenný kruh s trávnikom, strom múdrosti z údajov stromu, dve lampy po stranách
  namestie() {
    const [dx, y, k] = DS_STROM, x = DS_X + dx, t = this.stromInfo();
    const strom = stromSvg({ stupen: t.i, plody: t.naStrome, kos: t.kos, novy: -1, hn: t.hn, zem: false })
      .replace('<svg class="os-strom', `<svg x="${(x - 112 * k).toFixed(1)}" y="${(y + 2 - 254 * k).toFixed(1)}" width="${(224 * k).toFixed(1)}" height="${(268 * k).toFixed(1)}" class="os-strom`);
    // dlažba: kamene po obvode kruhu (predné väčšie), mäkký tieň pod námestím
    const dl = Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2, cx = x + Math.cos(a) * 74, cy = y + Math.sin(a) * 17.5, p = Math.sin(a) > 0 ? 1 : .7;
      return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(7 * p).toFixed(1)}" ry="${(3.2 * p).toFixed(1)}" fill="var(--ds-kamen-l)" stroke="var(--ink)" stroke-width="1.3" stroke-opacity=".55"/>`; }).join('');
    const kruh = `<ellipse cx="${x + 6}" cy="${y + 5}" rx="90" ry="24" fill="var(--ds-tien)" opacity=".14" stroke="none"/><ellipse cx="${x}" cy="${y}" rx="82" ry="21" fill="var(--dv-kamen)" stroke="var(--ink)" stroke-width="2.4"/>${dl}<ellipse cx="${x}" cy="${y - 2}" rx="66" ry="14" fill="var(--dv-lis)" stroke="var(--ink)" stroke-width="2"/>
      <path d="M${x - 52} ${y + 2}q4-5 9-6M${x + 38} ${y - 7}q5-3 10-2" stroke="var(--dv-lis-l)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x + 10}" cy="${y - 1}" rx="34" ry="7" fill="var(--ink)" opacity=".14"/>`;
    return `<g class="ds-namestie">${kruh}${this.tuk('strom', t.popis, `<g class="ds-strom${t.hn ? ' schne' : ''}" data-strom>${strom}</g>`)}</g>`;
  },
  // všetky veci zoradené zozadu dopredu (päta vyššie = ďalej), aby sa prekrývali ako v krajine
  veci() {
    const d = typeof Dedinka !== 'undefined' ? Dedinka.ziskaj() : null, rady = typeof Dedinka !== 'undefined' ? Dedinka.rady() : 2, v = [];
    // položené veci dieťaťa (z dát Dedinky, s farbami a zrkadlom)
    Object.entries((d && d.miesta) || {}).forEach(([kl, [typ, zrk, volby]]) => {
      const vec = DED_VEC[typ], kres = dedKresba(typ), m = vec && kres && dedMiesto(kl, vec.sirka);
      if (!m || m.rad > rady) return;
      v.push({ y: m.y, html: dsZem(m.x, m.y, m.s, (DS_ZEM_SK[vec.sk] || 24) * (vec.sirka === 2 ? 1.35 : 1)) + DedStav.obal(kl, dedinkaVec(kres, { x: m.x, y: m.y, s: m.s, zrkadlo: !!zrk, ...dedVolby(kres, volby) }), m, typ, !!zrk) }); // 27-dedinka-stavanie.js: pri stavaní sa dá ťuknúť
    });
    v.push(...DedStav.miesta()); // pri stavaní krúžky voľných miest a zamknutý rad
    // zamknutá zem: prvý zamknutý rad má po stranách tabuľku so stromčekom (zem pribudne, keď strom vyrastie)
    if (rady < 5 && !DedStav.zap) { const r = rady + 1, [y, s, g] = DS_RADY[r];
      [-1, 1].forEach(z => v.push({ y, html: this.tuk('zem', 'Ďalšia zem: pribudne, keď strom múdrosti vyrastie', this.tabulka(DS_X + z * (g + 2.1 * DS_RADY[r][3]), y, s), ' ds-zem') })); }
    // hlavný dom
    { const [dx, y, s] = DS_DOM; v.push({ y, html: dsZem(DS_X + dx, y, s, 76) + this.tuk('dom', 'Môj domček. Vojsť dnu', dedinkaVec('domov', { x: DS_X + dx, y, s }), ' ds-dom') }); }
    // lampy pri námestí
    [-1, 1].forEach(z => v.push({ y: 420, html: dsZem(DS_X + z * 100, 418, .58, 14) + dedinkaVec('lampa', { x: DS_X + z * 100, y: 418, s: .58, zrkadlo: z > 0 }) }));
    // miesta hier
    this.miestaHier().forEach(m => {
      const r = S.get(rekordKluc(m.h.id), null);
      const popis = m.stav === 'stavba' ? `${m.h.n}: stavia sa, odomkne sa pri ${m.h.cena} hviezdach` : m.stav === 'spi' ? `${m.h.n} spí, kým strom vädne` : `${m.h.n}${r != null ? ', rekord ' + rekordText(m.h.id, r) : ''}. Hrať`;
      const telo = m.stav === 'stavba' ? dedinkaVec('lesenie', { x: m.x, y: m.y, s: m.s }) + this.cenovka(m.x + 30 * m.s, m.y + 2, m.h.cena) : dedinkaVec(m.h.id, { x: m.x, y: m.y, s: m.s });
      v.push({ y: m.y, html: dsZem(m.x, m.y, m.s, 58) + this.tuk('hra:' + m.h.id, popis, telo, ' ds-hra ds-' + m.stav) });
    });
    if (typeof DedCesta !== 'undefined') DedCesta.scena().forEach(x => v.push(x)); // smerovník Cesta mesiaca a čakajúca truhlička (27-dedinka-cesta.js)
    v.push({ y: DS_STROM[1], html: this.namestie() });
    return v.sort((a, b) => a.y - b.y).map(x => x.html).join('');
  },
  tabulka(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(2.2 / s).toFixed(2)}"><ellipse cx="4" cy="1" rx="20" ry="4" fill="var(--ink)" opacity=".14" stroke="none"/><path d="M-2 0v-30h4v30z" fill="var(--dv-drevo-d)"/>
      <rect x="-22" y="-52" width="44" height="26" rx="6" fill="var(--dv-drevo)"/><path d="M0 -31v-9M0 -38c-5 0-7-3-7-7 4 0 7 2 7 7zM0 -40c4 0 7-2 7-6-4 0-7 2-7 6z" fill="var(--leaf)"/>
      <path d="M-17 -31h34" stroke-dasharray="1 4" opacity=".5"/></g>`;
  },
  html() {
    return `<section class="ds${DedStav.zap ? ' dst-zap' : ''}" aria-label="Moja dedinka">
      <div class="ds-scena" id="ds-scena"><svg class="ds-svg" viewBox="0 ${DS_Y0} ${DS_W} ${DS_H - DS_Y0}" preserveAspectRatio="xMidYMax slice" role="group" aria-label="Dedinka"><g stroke-linejoin="round" stroke-linecap="round">
        ${this.krajina(this.chodniky())}<g stroke="var(--ink)" stroke-width="2.2">${this.veci()}</g></g></svg></div>
      ${DedStav.zap ? DedStav.hore('Stavanie') + DedStav.suflik() : `<div class="ds-hore"><h1 class="ds-n">Moja dedinka</h1><button class="btn maly dve ds-vsetky" data-go="hry">${ikn('hry')}Všetky hry</button></div>${DedStav.tlacidlo()}${DedCesta.vstup()}`}
    </section>`;
  },
  // po vykreslení: výška scény podľa obrazovky, posun do strán (na strom alebo späť na miesto), hviezdy po hre
  rozmer() {
    const sc = document.getElementById('ds-scena'); if (!sc || !sc.getBoundingClientRect) return null;
    const svg = sc.querySelector('svg'), nav = document.getElementById('nav'), top = sc.getBoundingClientRect().top, suf = document.getElementById('dst-suflik');
    // pri stavaní (27-dedinka-stavanie.js) končí scéna nad šuflíkom; pod ňou pokračuje zem (výplň zdola)
    const dole = suf ? suf.getBoundingClientRect().top + 18 : nav && !nav.hidden && nav.getBoundingClientRect().top > top + 200 ? nav.getBoundingClientRect().top : innerHeight, h = Math.max(300, Math.round(dole - top) + 2);
    const pod = suf ? Math.max(0, Math.round(innerHeight - dole)) : 0;
    // mierka: podľa výšky, najviac 0,95 (na telefóne vidieť viac dedinky, hore pokračuje obloha); široký displej vyplní šírku. Izba má vlastný rozmer 800 × 480.
    const izba = st.view === 'izba', W = izba ? 800 : DS_W, vh = izba ? 480 : DS_H - DS_Y0, sx = sc.scrollLeft, sw = sc.scrollWidth;
    let k = Math.min(h / vh, sc.clientWidth < 600 ? sc.clientWidth / 372 : .95); // telefón: na šírku sa zmestí hlavný dom aj strom, vyšší telefón = menej prázdnej oblohy if (k * W < sc.clientWidth) k = sc.clientWidth / W; if (izba && suf) k = Math.min(h / vh, sc.clientWidth / 560); // pri zariaďovaní izby skoro celá izba naraz (miesta sú v strede)
    sc.style.height = (h + pod) + 'px'; sc.style.paddingBottom = pod + 'px'; svg.style.width = Math.round(k * W) + 'px'; svg.style.height = Math.min(h, Math.round(k * vh)) + 'px';
    if (sw && sc.scrollWidth !== sw) sc.scrollLeft = sx * sc.scrollWidth / sw; // pri zmene veľkosti ostane ten istý kus dedinky
    return sc;
  },
  po() {
    DedStav.po();
    try {
      const sc = this.rozmer(); if (!sc) return;
      requestAnimationFrame(() => this.rozmer()); setTimeout(() => this.rozmer(), 400); // lišta dole sa ešte môže usádzať
      const n = this.navrat; this.navrat = null;
      const el = n && sc.querySelector(`[data-ded="hra:${n.id}"]`);
      if (el && el.getBoundingClientRect) { const r = el.getBoundingClientRect(), s = sc.getBoundingClientRect(); sc.scrollLeft += r.left + r.width / 2 - s.left - sc.clientWidth / 2; }
      else sc.scrollLeft = st.view === 'izba' ? (sc.scrollWidth - sc.clientWidth) / 2 : this.x != null ? this.x : (sc.scrollWidth - sc.clientWidth) / 2 - sc.scrollWidth * 110 / DS_W; // prvý pohľad: hlavný dom a strom
      if (!sc._ds) { sc._ds = 1; sc.addEventListener('scroll', () => { if (st.view === 'dedinka') this.x = sc.scrollLeft; }, { passive: true }); }
      if (el && n.zisk > 0) setTimeout(() => this.zisk(el, n.zisk), tiche ? 50 : 700);
    } catch (e) { /* test bez prehliadača */ }
  },
  // hviezdy za hru: jemne vyjdú nad miestom hry a zmiznú (žiadne okno)
  zisk(el, n) {
    const sc = document.getElementById('ds-scena'); if (!sc || !el.isConnected) return;
    const r = el.getBoundingClientRect(), s = sc.getBoundingClientRect(), z = document.createElement('div');
    z.className = 'ds-zisk cis'; z.setAttribute('role', 'status'); z.innerHTML = `+${n}${ikn('hviezda')}`;
    z.style.left = (r.left - s.left + sc.scrollLeft + r.width / 2) + 'px'; z.style.top = (r.top - s.top + Math.max(10, r.height * .25)) + 'px';
    sc.appendChild(z); Zvuk.play('coin'); setTimeout(() => z.remove(), 2600);
  },
  hraj(id, el) {
    const h = HRY.find(x => x.id === id); if (!h) return;
    if (bodyHry() < h.cena) { Hra.start(id); this.tras(el); return; } // Hra.start povie, koľko chýba (alebo že hra spí)
    Zvuk.play('whoosh'); Prechod.spusti(h.n, () => Hra.start(id));
  },
  zHry() {
    const h = st.hra; this.navrat = h ? { id: h.id, zisk: h.hotovo && h.hotovo.zisk || 0 } : null;
    Zvuk.play('whoosh'); Prechod.spusti('Moja dedinka', () => { Hra.zrus(); Render.nova = true; render(); });
  },
  tras(el) { if (el && el.classList) { el.classList.remove('trasie'); void el.getBoundingClientRect(); el.classList.add('trasie'); } },
  klik(el) {
    if (DedStav.klik(el)) return; // stavanie (27-dedinka-stavanie.js)
    const d = el.dataset.ded;
    if (typeof DedCesta !== 'undefined' && DedCesta.klik(d)) return;
    if (d === 'strom') { Zvuk.play('pop'); Strom.ukaz(); return; }
    if (d === 'dom') { Zvuk.play('whoosh'); Prechod.spusti('Môj domček', () => { st.view = 'izba'; Render.nova = true; render(); scrollTo(0, 0); }); return; }
    if (d === 'zem') { Zvuk.play('tap'); this.tras(el); toast('Keď strom múdrosti vyrastie, dedinka dostane ďalší kus zeme.'); return; }
    if (d.startsWith('hra:')) this.hraj(d.slice(4), el);
  },
};

/* Drevený smerovník Moja dedinka v krajine Domova (časť obrázka, ťuk otvorí dedinku) */
Domov.smerovnik = () => `<button class="dom-smer" data-go="dedinka" aria-label="Moja dedinka"><svg viewBox="0 0 120 70" aria-hidden="true"><g stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
  <ellipse cx="36" cy="68" rx="16" ry="3" fill="var(--ink)" opacity=".18" stroke="none"/><path d="M26 68V30h7v38z" fill="var(--dv-drevo-d)"/>
  <path d="M4 10h96l14 13-14 13H4a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="var(--dv-drevo)"/><path d="M8 15h88" stroke="var(--dv-biela)" stroke-width="2" opacity=".45"/>
  <text x="52" y="28.5" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="14.5" fill="var(--dv-biela)" stroke="none">Moja dedinka</text>
  <path d="M23 68l-2-6M28 68v-7M37 68l3-6" stroke="var(--dv-lis-d)" stroke-width="2"/></g></svg></button>`;

/* Izba v hlavnom dome: zatiaľ prázdna (nábytok príde so stavaním). Okno do dedinky ukazuje deň aj noc. */
const DedIzba = {
  html() {
    const okno = `<g transform="translate(300 70)"><rect x="0" y="0" width="200" height="140" rx="14" fill="var(--dv-nebo)" stroke-width="3"/>
      <circle class="dv-den" cx="150" cy="44" r="16" fill="var(--sun)"/><path class="dv-noc" d="M156 28a16 16 0 1 0 8 28a13 13 0 0 1-8-28z" fill="var(--sun-l)"/>
      <path d="M0 100Q50 80 100 98T200 92V126a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14z" fill="var(--dv-kopec3)"/>
      ${dedinkaVec('gulaty', { x: 52, y: 112, s: .5 })}${dedinkaVec('chalupka', { x: 132, y: 116, s: .4 })}
      <path d="M100 0v140M0 70h200" stroke-width="5" stroke="var(--dv-drevo)"/><rect x="0" y="0" width="200" height="140" rx="14" fill="none" stroke-width="3"/>
      <rect x="-14" y="138" width="228" height="14" rx="5" fill="var(--dv-drevo)"/></g>`;
    const parkety = Array.from({ length: 9 }, (_, i) => `<path d="M${i * 100 - 30} 330L${i * 120 - 160} 480" stroke-width="1.6" opacity=".35"/>`).join('');
    return `<section class="ds ds-izba${DedStav.zap ? ' dst-zap' : ''}" aria-label="Môj domček">
      <div class="ds-scena" id="ds-scena"><svg class="ds-svg" viewBox="0 0 800 480" preserveAspectRatio="xMidYMax slice" role="group" aria-label="Izba s oknom do dedinky"><g stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
        <rect x="-10" y="-10" width="820" height="350" fill="var(--sun-l)"/><path d="M-10 40h820" stroke-width="2" opacity=".3"/>
        ${Array.from({ length: 16 }, (_, i) => `<circle cx="${i * 56 + 20}" cy="${i % 2 ? 150 : 250}" r="3" fill="var(--coral-l)" stroke="none"/>`).join('')}
        <path d="M-10 330H810V490H-10Z" fill="var(--dv-drevo)"/>${parkety}<path d="M-10 330H810" stroke-width="3"/>
        <rect x="-10" y="318" width="820" height="14" fill="var(--card)"/>
        ${okno}
        <g transform="translate(640 330)"><path d="M-40 0V-170a40 40 0 0 1 80 0V0z" fill="var(--violet-d)"/><path d="M-30 -10V-164a30 30 0 0 1 60 0V-10z" fill="var(--violet)" opacity=".5"/><circle cx="24" cy="-80" r="4" fill="var(--sun)"/></g>
        ${DedStav.izbaVeci()}
      </g></svg></div>
      ${DedStav.zap ? DedStav.hore('Môj domček') + DedStav.suflik() : `<div class="ds-hore"><button class="btn kruh dve" data-izba-spat aria-label="Späť do dedinky">${ikn('zavriet')}</button><h1 class="ds-n">Môj domček</h1></div>
      ${Object.keys((Dedinka.ziskaj() || {}).izba || {}).length ? '' : '<p class="ds-izba-tx">Izba je zatiaľ prázdna. Ťukni na Stavať a postav si posteľ, poličku aj akvárium.</p>'}${DedStav.tlacidlo()}`}
    </section>`;
  },
};

/* Presun s obláčikmi: obláčiky sa zľava a sprava zatiahnu, pod nimi sa vymení obrazovka a roztiahnu sa. Hýbu sa len transform a opacity.
   Pri obmedzení pohybu len rýchle prelínanie. */
const Prechod = {
  bezi: false,
  el() {
    const ob = (k, x, y, w, d) => `<i class="ob" style="--x:${x}%;--y:${y}%;--w:${w}vmax;--d:${d}s">${dedinkaKresby.svg(k, { popis: '' })}</i>`;
    const e = document.createElement('div'); e.className = 'ob-prechod'; e.setAttribute('aria-hidden', 'true');
    e.innerHTML = `<div class="ob-zavoj"></div>
      <div class="ob-str ob-l">${ob('oblak2', 18, 2, 46, 0)}${ob('oblak1', 40, 24, 54, .04)}${ob('oblak2', 8, 46, 50, .02)}${ob('oblak1', 36, 70, 56, .06)}${ob('oblak3', 14, 92, 44, .03)}</div>
      <div class="ob-str ob-p">${ob('oblak1', 62, 10, 52, .03)}${ob('oblak2', 82, 32, 48, 0)}${ob('oblak1', 60, 56, 56, .05)}${ob('oblak2', 84, 78, 46, .02)}${ob('oblak3', 64, 98, 42, .06)}</div>
      <b class="ob-n"></b>`;
    return e;
  },
  spusti(nazov, akcia) {
    if (this.bezi) return; this.bezi = true;
    let e; try { e = this.el(); e.querySelector('.ob-n').textContent = nazov || ''; if (tiche) e.classList.add('tiche'); document.body.appendChild(e); }
    catch (x) { this.bezi = false; akcia(); return; } // test bez prehliadača
    const [tz, tr] = tiche ? [160, 200] : [620, 700];
    requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add('zatiahni')));
    setTimeout(() => {
      try { akcia(); } finally {
        setTimeout(() => { e.classList.add('roztiahni'); e.classList.remove('zatiahni'); setTimeout(() => { e.remove(); this.bezi = false; }, tr); }, tiche ? 260 : 560); // názov ostane chvíľu na očiach
      }
    }, tz);
  },
};

document.addEventListener('click', e => {
  const t = e.target && e.target.closest && e.target.closest('[data-ded], [data-izba-spat]'); if (!t || Prechod.bezi) return;
  if (t.hasAttribute('data-izba-spat')) { Zvuk.play('whoosh'); Prechod.spusti('Moja dedinka', () => { st.view = 'dedinka'; Render.nova = true; render(); }); return; }
  e.stopImmediatePropagation(); DedScena.klik(t);
}, true);
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('[data-ded]')) { e.preventDefault(); e.stopImmediatePropagation(); DedScena.klik(e.target); } }, true);
try { window.addEventListener('resize', () => { if (st.view === 'dedinka' || st.view === 'izba') DedScena.rozmer(); }); } catch (e) { /* test bez prehliadača */ }
