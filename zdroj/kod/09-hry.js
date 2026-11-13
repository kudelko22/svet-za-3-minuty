/* Hry: odomykajú sa za body z tém (hraním sa body neminú). 5.0: ihrisko s dlaždicami, farby len cez premenné (52-hry.css). */
const HRY = [
  { id: 'pexeso', n: 'Pexeso', p: 'Nájdi dvojice rovnakých obrázkov.', cena: 150, c: 'var(--violet-l)' },
  { id: 'pocitaj', n: 'Koľko ich je?', p: 'Spočítaj obrázky a ťukni na správne číslo. Bez časovača.', cena: 200, c: 'var(--leaf-l)', len: 'mladsi' },
  { id: 'iny', n: 'Ktorý je iný?', p: 'Štyri obrázky, jeden je iný. Nájdi ho! Bez čítania, bez časovača.', cena: 180, c: 'var(--coral-l)', len: 'mladsi' },
  { id: 'hadaj', n: 'Hádaj tému', p: 'Podľa obrázka uhádni, o ktorej téme je.', cena: 250, c: 'var(--sky-l)' },
  { id: 'tien', n: 'Nájdi tieň', p: 'Ktorý tieň patrí k obrázku? Bez čítania, bez časovača.', cena: 350, c: 'var(--card)', len: 'mladsi' },
  { id: 'sova', n: 'Lietajúca sova', p: 'Ťukaj a sovička letí. Prelet pomedzi ceruzky a zbieraj hviezdy!', cena: 300, c: 'var(--sky-l)' },
  { id: 'hviezdy', n: 'Chytaj hviezdičky', p: 'Za 30 sekúnd chyť čo najviac hviezd. Pozor na búrku!', cena: 400, c: 'var(--teal-l)' },
  { id: 'poradie', n: 'Zoraď čísla', p: 'Ťukaj čísla v správnom poradí, od najmenšieho alebo od najväčšieho.', cena: 450, c: 'var(--sun-l)' },
  { id: 'krtko', n: 'Ťukaj krtkov', p: 'Krtkovia vykúkajú z dier. Ťukni na nich skôr, než sa schovajú! Zlatý krtko je za tri.', cena: 500, c: 'var(--leaf-l)' },
  { id: 'ine', n: 'Čo je iné?', p: 'Štyri obrázky: tri patria k sebe a jeden nie. Ťukni na ten, ktorý je iný!', cena: 600, c: 'var(--teal-l)' },
  { id: 'opakuj', n: 'Opakuj po mne', p: 'Zapamätaj si, ktoré farby zasvietili, a zopakuj ich.', cena: 550, c: 'var(--coral-l)' },
  { id: 'bubliny', n: 'Bubliny s počtami', p: 'Praskni bublinu so správnym výsledkom. Pozor, zlá bublina zoberie bod!', cena: 700, c: 'var(--sky-l)', len: 'starsi' },
  { id: 'slovo', n: 'Poskladaj slovo', p: 'Z písmen poskladaj slovo, ktoré patrí k obrázku.', cena: 650, c: 'var(--violet-l)', len: 'starsi' },
  { id: 'skladacka', n: 'Skladačka', p: 'Poprehadzovaný obrázok poskladaj späť.', cena: 900, c: 'var(--sun-l)' },
];
// hry podľa veku dieťaťa: ťažšie počtové hry nie sú pre malé deti, tie majú svoju ľahkú
const HRY_VID = () => HRY.filter(h => !h.len || h.len === (st.vek === 'starsi' ? 'starsi' : 'mladsi'));
const noveHry = (pred, po) => HRY_VID().filter(h => h.cena > pred && h.cena <= po);
const HVIEZDA = 'M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z';
/* Kresby hier (rám 120 × 80), rovnaká ruka ako ikony 5.0. Farby: paleta a premenné hier --h-* z 52-hry.css. */
const HI = 'stroke="var(--dk)" stroke-linejoin="round" stroke-linecap="round"';
const hS5 = (x, y, R, f, sw = 3) => { let d = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? R * .46 : R, a = -Math.PI / 2 + i * Math.PI / 5; d += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1); } return `<path d="${d}Z" fill="${f}" stroke-width="${sw}"/>`; };
const hS4 = (x, y, r, f = 'var(--h-biela)', e = 'stroke="none"') => `<path d="M${x} ${y - r}C${x} ${y - r * .3} ${x + r * .3} ${y} ${x + r} ${y}C${x + r * .3} ${y} ${x} ${y + r * .3} ${x} ${y + r}C${x} ${y + r * .3} ${x - r * .3} ${y} ${x - r} ${y}C${x - r * .3} ${y} ${x} ${y - r * .3} ${x} ${y - r}Z" fill="${f}" ${e}/>`;
const hTx = (x, y, s, t, e = 'fill="var(--dk)"') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="${s}" stroke="none" ${e}>${t}</text>`;
const KRESBY_HIER = {
  pexeso: () => `<g transform="rotate(-10 40 40)"><rect x="20" y="13" width="38" height="54" rx="8" fill="var(--violet)"/><path d="M30 26l18 28M48 26L30 54" stroke="var(--h-biela)" opacity=".55"/></g><g transform="rotate(8 82 40)"><rect x="63" y="12" width="38" height="54" rx="8" fill="var(--h-biela)"/>${hS5(82, 40, 13, 'var(--sun)', 3)}</g>`,
  iny: () => `<circle cx="38" cy="24" r="13" fill="var(--sun)"/><circle cx="76" cy="24" r="13" fill="var(--sun)"/><circle cx="38" cy="58" r="13" fill="var(--sun)"/><rect x="64" y="46" width="24" height="24" rx="5" fill="var(--coral)" transform="rotate(12 76 58)"/><circle cx="76" cy="58" r="21" fill="none" stroke="var(--h-biela)" stroke-dasharray=".1 8"/>`,
  pocitaj: () => `${[[26, 50], [50, 32], [56, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="var(--coral)"/><path d="M${x} ${y - 12}q1-6 8-7q0 6-8 7z" fill="var(--leaf)" stroke-width="2.2"/>`).join('')}<g transform="rotate(6 93 39)"><rect x="78" y="16" width="30" height="46" rx="9" fill="var(--h-biela)"/>${hTx(93, 51, 32, '3')}</g>`,
  hadaj: () => `<rect x="14" y="14" width="66" height="54" rx="9" fill="var(--h-nebo)"/><circle cx="62" cy="30" r="7" fill="var(--sun)" stroke-width="2.5"/><path d="M17 64l19-25 13 15 8-9 20 19z" fill="var(--leaf)"/><circle cx="93" cy="27" r="17" fill="var(--sun)"/>${hTx(93, 36, 24, '?')}`,
  sova: () => `<rect x="92" y="-6" width="15" height="30" fill="var(--sun)"/><path d="M92 24h15l-7.5 12z" fill="var(--h-drevo)"/><rect x="92" y="58" width="15" height="30" fill="var(--coral)"/><path d="M92 58h15l-7.5-12z" fill="var(--h-drevo)"/><g transform="translate(18 12) scale(.3)" stroke-width="9">${mudraCasti('radost').hlava}</g>${hS4(74, 20, 7, 'var(--sun)', 'stroke-width="2.5"')}<path d="M6 38h10M2 50h8" stroke="var(--h-biela)"/>`,
  tien: () => `${hS5(38, 40, 24, 'var(--sun)', 3)}<g transform="rotate(14 86 42)">${hS5(86, 42, 22, 'var(--dk)', 3)}</g>${hTx(86, 49, 20, '?', 'fill="var(--h-biela)"')}<path d="M56 24q8-10 18-6" fill="none" stroke-dasharray=".1 6"/>`,
  hviezdy: () => `<path d="M74 14a9 9 0 0 1 17-3a8 8 0 0 1 9 13H72a6.5 6.5 0 0 1 2-10z" fill="var(--h-biela)"/><path d="M88 24l-5 9h6l-4 9" fill="none" stroke="var(--sun-d)"/>${hS5(30, 18, 11, 'var(--sun)', 3)}${hS5(56, 36, 8, 'var(--sun)', 2.5)}<path d="M30 34v8M56 46v6" stroke-dasharray=".1 5" fill="none"/><path d="M20 50h44l-5 22H25z" fill="var(--coral)"/><path d="M23 58h38" stroke="var(--h-biela)" opacity=".6"/>`,
  poradie: () => `<rect x="12" y="38" width="28" height="30" rx="7" fill="var(--h-nebo)"/>${hTx(26, 60, 20, '1')}<rect x="46" y="26" width="28" height="30" rx="7" fill="var(--sun)"/>${hTx(60, 48, 20, '2')}<rect x="80" y="14" width="28" height="30" rx="7" fill="var(--coral)"/>${hTx(94, 36, 20, '3')}<path d="M22 28q22-22 50-18" fill="none" stroke-dasharray=".1 6"/>`,
  krtko: () => `<ellipse cx="60" cy="66" rx="36" ry="9" fill="var(--h-hlina)"/><path d="M41 66C39 2 81 2 79 66Z" fill="var(--h-krtko)"/><path d="M50 66C50 40 70 40 70 66Z" fill="var(--h-brusko)" stroke="none"/><ellipse cx="60" cy="34" rx="7.5" ry="5.5" fill="var(--h-ruz)" stroke-width="2.5"/><circle cx="50" cy="23" r="3.2" fill="var(--dk)" stroke="none"/><circle cx="70" cy="23" r="3.2" fill="var(--dk)" stroke="none"/><path d="M56 42h8v7h-8zM60 42v7" fill="var(--h-biela)" stroke-width="2.2"/><path d="M46 33l-12-3M46 37l-12 3M74 33l12-3M74 37l12 3" fill="none" stroke-width="2"/><path d="M30 62c0-8 12-8 12 0v5H30zM78 62c0-8 12-8 12 0v5H78z" fill="var(--h-brusko)" stroke-width="2.5"/><path d="M34 60v6M38 60v6M82 60v6M86 60v6" fill="none" stroke-width="1.8"/>${hS4(102, 16, 8, 'var(--sun)', 'stroke-width="2.5"')}`,
  opakuj: () => `<path d="M60 40V10A30 30 0 0 0 30 40Z" fill="var(--coral)"/><path d="M60 40h30A30 30 0 0 0 60 10Z" fill="var(--sun)"/><path d="M60 40v30A30 30 0 0 0 90 40Z" fill="var(--sky)"/><path d="M60 40H30A30 30 0 0 0 60 70Z" fill="var(--teal)"/><circle cx="60" cy="40" r="8" fill="var(--h-biela)"/><path d="M92 12l8-7M98 24h10M84 6l2-9" stroke="var(--sun-d)" fill="none"/>`,
  ine: () => `<rect x="12" y="10" width="44" height="28" rx="7" fill="var(--h-biela)"/><circle cx="34" cy="24" r="8" fill="var(--teal)" stroke-width="2.5"/><rect x="64" y="10" width="44" height="28" rx="7" fill="var(--h-biela)"/><circle cx="86" cy="24" r="8" fill="var(--teal)" stroke-width="2.5"/><rect x="12" y="44" width="44" height="28" rx="7" fill="var(--h-biela)"/><circle cx="34" cy="58" r="8" fill="var(--teal)" stroke-width="2.5"/><rect x="64" y="44" width="44" height="28" rx="7" fill="var(--sun)"/><path d="M86 49l8 15H78z" fill="var(--coral)" stroke-width="2.5"/>`,
  slovo: () => [['S', 13, -6, 'var(--h-nebo)'], ['O', 38, 4, 'var(--sun)'], ['V', 63, -4, 'var(--h-biela)'], ['A', 88, 6, 'var(--coral)']].map(([c, x, a, f]) => `<g transform="rotate(${a} ${x + 11} 40)"><rect x="${x}" y="26" width="22" height="28" rx="6" fill="${f}"/>${hTx(x + 11, 47, 19, c)}</g>`).join(''),
  bubliny: () => `<circle cx="34" cy="46" r="21" fill="var(--h-nebo)"/>${hTx(34, 54, 21, '7')}<path d="M21 40a14 14 0 0 1 8-9" fill="none" stroke="var(--h-biela)"/><circle cx="80" cy="30" r="17" fill="var(--h-biela)"/>${hTx(80, 37, 17, '12')}<circle cx="94" cy="62" r="11" fill="var(--sun)"/>${hTx(94, 67, 13, '5')}<circle cx="58" cy="14" r="5" fill="var(--h-biela)" stroke-width="2.5"/>`,
  skladacka: () => `<rect x="30" y="14" width="27" height="27" rx="4" fill="var(--sky)"/><rect x="30" y="41" width="27" height="27" rx="4" fill="var(--sun)"/><rect x="57" y="41" width="27" height="27" rx="4" fill="var(--teal)"/><g transform="rotate(14 80 22)"><rect x="66" y="6" width="27" height="27" rx="4" fill="var(--coral)"/><circle cx="66" cy="19.5" r="5" fill="var(--coral)"/></g><path d="M98 44q6 8 0 16" fill="none" stroke-dasharray=".1 6"/>`,
};
// OBR_HRY ostáva pod starým menom (používajú ho aj odmeny a novinky); každá kresba sa poskladá až pri prvom použití
const OBR_HRY = {};
for (const k of Object.keys(KRESBY_HIER)) Object.defineProperty(OBR_HRY, k, { enumerable: true, configurable: true, get() { const v = `<svg class="hra-kresba" viewBox="0 0 120 80" aria-hidden="true"><g ${HI} stroke-width="3">${KRESBY_HIER[k]()}</g></svg>`; Object.defineProperty(OBR_HRY, k, { value: v, enumerable: true }); return v; } });
const OBLAK = `<svg viewBox="0 0 48 42" aria-hidden="true"><g stroke="var(--dk)" stroke-width="2.5" stroke-linejoin="round"><path d="M12 28a8 8 0 0 1-1-15.9A11 11 0 0 1 32 9a8.5 8.5 0 0 1 5 16.3A6 6 0 0 1 35 28z" fill="var(--h-burka)"/><path d="M24 26l-5 8h5l-3 7 9-11h-5l3-4z" fill="var(--sun)"/><circle cx="18" cy="19" r="1.6" fill="var(--dk)"/><circle cx="27" cy="19" r="1.6" fill="var(--dk)"/><path d="M19.5 24q3-2.5 6 0" fill="none"/></g></svg>`;
const krtObr = zlaty => `<svg class="${zlaty ? 'krt-z' : 'krt-h'}" viewBox="0 0 60 64" aria-hidden="true"><g stroke="var(--dk)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M6 64 C4 36 16 10 30 10 C44 10 56 36 54 64Z" fill="${zlaty ? 'var(--sun)' : 'var(--h-krtko)'}"/><ellipse cx="30" cy="40" rx="15" ry="13" fill="${zlaty ? 'var(--h-zlato)' : 'var(--h-brusko)'}" stroke="none"/>${zlaty ? `<path d="${HVIEZDA}" fill="var(--coral)" transform="translate(20 -5) scale(.85)" stroke-width="2.6"/>` : ''}<circle cx="21" cy="31" r="3.6" fill="var(--dk)" stroke="none"/><circle cx="39" cy="31" r="3.6" fill="var(--dk)" stroke="none"/><circle cx="22" cy="29.8" r="1.2" fill="var(--h-biela)" stroke="none"/><circle cx="40" cy="29.8" r="1.2" fill="var(--h-biela)" stroke="none"/><ellipse cx="30" cy="39" rx="6.5" ry="4.6" fill="var(--h-ruz)"/><path d="M30 43.5 V47 M25 48 Q30 52 35 48" fill="none"/>${zlaty ? '' : '<path d="M13 38 L5 36 M13 43 L5 45 M47 38 L55 36 M47 43 L55 45" fill="none" stroke-width="2.2"/>'}</g></svg>`;
const KRT_OBR = krtObr(false), KRT_ZLATY = krtObr(true);
const rekordKluc = id => `hra-${id}-${st.dietaId || 'x'}`;
const slovoTahy = n => n === 1 ? 'ťah' : n >= 2 && n <= 4 ? 'ťahy' : 'ťahov';
const slovoHviezdy = n => n === 1 ? 'hviezda' : n >= 2 && n <= 4 ? 'hviezdy' : 'hviezd';
const slovoPriklady = n => n === 1 ? 'príklad' : n >= 2 && n <= 4 ? 'príklady' : 'príkladov';
const slovoTony = n => n === 1 ? 'farba' : n >= 2 && n <= 4 ? 'farby' : 'farieb';
const slovoKrtky = n => n === 1 ? 'krtko' : n >= 2 && n <= 4 ? 'krtky' : 'krtkov';
const slovoBody = n => n === 1 ? 'bod' : n >= 2 && n <= 4 ? 'body' : 'bodov';
const rekordText = (id, r) => id === 'sova' ? `${r} ${slovoBody(r)}` : id === 'opakuj' ? `${r} ${slovoTony(r)}` : id === 'hviezdy' ? `${r} ${slovoHviezdy(r)}` : id === 'krtko' ? `${r} ${slovoKrtky(r)}` : id === 'bubliny' ? `${r} ${slovoPriklady(r)}` : id === 'pocitaj' ? `${r} z 5 hneď správne` : KV_HRY[id] ? `${r} z ${KV_KOL} hneď správne` : id === 'hadaj' ? `${r} z 8 správne` : `${r} ${slovoTahy(r)}`;
// obrázky do hier: najprv z prebratých tém, tie dieťa pozná
const temyDoHry = n => { const v = TV(), d = mix(v.length).map(i => v[i]); return [...d.filter(t => st.done.includes(t.id)), ...d.filter(t => !st.done.includes(t.id))].slice(0, n); };
// stav hry v lište: ikona a číslo (Grandstander), pri časovaných hrách aj zostávajúci čas
const stavCas = h => h.zostava != null ? `<span class="hs-cas${h.beh && h.zostava <= 5 ? ' malo' : ''}">${h.zostava} s</span>` : '';
const stavHry = h => { const [ik, t] = h.id === 'sova' || h.id === 'krtko' ? ['hviezda', h.skore] : h.id === 'opakuj' ? ['hraj', h.seq.length] : h.id === 'hviezdy' ? ['hviezda', h.skore] : h.id === 'bubliny' ? ['check', h.skore] : h.id === 'pocitaj' ? ['check', h.spravne + ' z 5'] : h.kv || h.id === 'hadaj' ? ['check', h.spravne + ' z ' + h.kola.length] : ['znova', h.tahy + ' ' + slovoTahy(h.tahy)]; return `${ikn(ik)}<b>${t}</b>${stavCas(h)}`; };
const obnovStavHry = () => { const el = document.getElementById('hra-stav'); if (!el || !st.hra) return; const n = stavHry(st.hra); if (el.innerHTML === n) return; el.innerHTML = n; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
// Múdra v lište hry reaguje: radosť, povzbudenie, oslava; po chvíli sa vráti k zvedavému pohľadu
function mudraHra(v, ms = 1500) {
  const el = document.getElementById('hra-mud'); if (!el) return;
  clearTimeout(el._t); el.innerHTML = mudra(v); el.classList.remove('reaguje'); void el.offsetWidth; el.classList.add('reaguje');
  el._t = setTimeout(() => { if (el.isConnected !== false) { el.innerHTML = mudra('zvedava'); el.classList.remove('reaguje'); } }, ms);
}

// Lietajúca sova: svet hry (obloha, ceruzky, hviezdy) a jeden krok fyziky; kreslenie je v Hra.sovaKresli
const SOVA_IMG = (() => {
  const o = {}; if (typeof Image === 'undefined') return o;
  for (const [k, m] of [['hore', 'cheer'], ['dole', 'happy']]) { o[k] = new Image(); o[k].src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(owl(m).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')); }
  return o;
})();
// bitmapa nakreslená raz a potom už len kopírovaná do hry (kluc null = jednorazová, bez pamäte)
const sovaSprite = (() => {
  let pamat = {};
  const f = (kluc, w, v, dpr, kresli) => {
    const k = kluc && kluc + '@' + dpr;
    if (k && pamat[k]) return pamat[k];
    const cv = document.createElement('canvas'), g = cv.getContext && cv.getContext('2d');
    if (!g) return null;
    cv.width = Math.ceil(w * dpr); cv.height = Math.ceil(v * dpr); g.scale(dpr, dpr);
    if (kresli(g) === false) return null;
    if (k) pamat[k] = cv;
    return cv;
  };
  f.zabudni = () => { pamat = {}; };
  return f;
})();
// farby z palety (01-zaklad.css, v noci 29-…); plátno nepozná premenné CSS, preto sa prečítajú pri kreslení. Záloha pre test bez prehliadača.
const hFarba = (n, z = '#888') => { try { const v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || z; } catch (e) { return z; } };
const hNoc = () => { try { return document.documentElement.dataset.rezim === 'mesacny'; } catch (e) { return false; } };
const CERUZKY = ['--coral', '--sky', '--leaf', '--sun', '--violet', '--teal'];
const CERUZKY_Z = ['#FF6A4D', '#52B6FF', '#5BC56B', '#FFC533', '#7A5AF8', '#14B8A6'];
const SIRKA_CERUZKY = 56, HROT = 46, SOVA_R = 15;
function sovaSvet(W, H, mal) {
  return { W, H, x: Math.round(W * .28), y: H * .42, vy: 0, cas: 0, posun: 0, mava: 0, neznic: 0, prekazky: [], hviezdy: [], iskry: [], dalsia: W * .55,
    rychlost: mal ? 125 : 155, medzera: H * (mal ? .37 : .31), rozostup: mal ? 250 : 215, g: mal ? 1350 : 1650, skok: mal ? -430 : -480 };
}
function sovaKrok(h, dt) {
  const u = [], zem = h.H - 26, v = h.rychlost + Math.min(70, h.skore * 2);
  h.cas += dt; h.neznic = Math.max(0, h.neznic - dt); h.mava = Math.max(0, h.mava - dt); h.posun += v * dt;
  h.vy = Math.min(h.vy + h.g * dt, 720); h.y += h.vy * dt;
  if (h.y < SOVA_R + 4) { h.y = SOVA_R + 4; h.vy = Math.max(0, h.vy); }
  // nové ceruzky (a hviezda v medzere alebo medzi nimi)
  h.dalsia -= v * dt;
  if (h.dalsia <= 0) {
    h.dalsia += h.rozostup;
    const min = 40 + h.medzera / 2, max = zem - 30 - h.medzera / 2, stred = min + Math.random() * Math.max(0, max - min);
    h.prekazky.push({ x: h.W + 20, stred, f: Math.floor(Math.random() * CERUZKY.length), f2: Math.floor(Math.random() * CERUZKY.length), presla: false });
    if (Math.random() < .6) h.hviezdy.push({ x: h.W + 20 + SIRKA_CERUZKY / 2, y: stred + (Math.random() - .5) * h.medzera * .35 });
    else if (Math.random() < .6) h.hviezdy.push({ x: h.W + 20 + SIRKA_CERUZKY + (h.rozostup - SIRKA_CERUZKY) / 2, y: 60 + Math.random() * (zem - 120) });
  }
  for (const p of h.prekazky) { p.x -= v * dt; if (!p.presla && p.x + SIRKA_CERUZKY < h.x - SOVA_R) { p.presla = true; h.skore++; u.push('bod'); } }
  while (h.prekazky.length && h.prekazky[0].x <= -SIRKA_CERUZKY - 10) h.prekazky.shift();
  for (const z of h.hviezdy) {
    z.x -= v * dt;
    if (!z.vzata && Math.hypot(z.x - h.x, z.y - h.y) < SOVA_R + 15) {
      z.vzata = true; h.skore++; u.push('hviezda');
      for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; h.iskry.push({ x: z.x, y: z.y, vx: Math.cos(a) * 140, vy: Math.sin(a) * 140, ziv: .6, c: i % 2 ? 'sun' : 'biela' }); }
    }
  }
  if (h.hviezdy.some(z => z.vzata || z.x <= -30)) h.hviezdy = h.hviezdy.filter(z => !z.vzata && z.x > -30);
  if (h.iskry.length) { h.iskry.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; q.ziv -= dt; }); h.iskry = h.iskry.filter(q => q.ziv > 0); }
  // náraz: hrot ceruzky je užší, aby to bolo spravodlivé
  const naZemi = h.y + SOVA_R > zem;
  const vCeruzke = h.prekazky.some(p => {
    const hore = p.stred - h.medzera / 2, dole = p.stred + h.medzera / 2, sx = p.x + SIRKA_CERUZKY / 2;
    const telo = h.x + SOVA_R > p.x + 3 && h.x - SOVA_R < p.x + SIRKA_CERUZKY - 3, hrot = Math.abs(h.x - sx) < SOVA_R + 9;
    return (telo && (h.y - SOVA_R < hore - HROT * .55 || h.y + SOVA_R > dole + HROT * .55)) || (hrot && (h.y - SOVA_R < hore - 3 || h.y + SOVA_R > dole + 3));
  });
  if ((naZemi || vCeruzke) && !h.neznic && h.zivoty > 0) {
    h.zivoty--;
    if (h.zivoty > 0) { h.neznic = 1.6; h.vy = h.skok; u.push('naraz'); } else u.push('koniec');
  }
  if (naZemi) { h.y = zem - SOVA_R; if (h.zivoty > 0) h.vy = h.skok * .85; else h.vy = 0; }
  return u;
}
// jedna ceruzka: hrot na výške spicka, telo smerom ku kraj (smer -1 = horná ceruzka hrotom dole, 1 = dolná hrotom hore)
function sovaCeruzka(g, x, spicka, smer, kraj, f) {
  const w = SIRKA_CERUZKY, koniec = spicka + smer * HROT, y0 = Math.min(kraj, koniec), dl = Math.abs(koniec - kraj);
  g.strokeStyle = hFarba('--dk', INK); g.lineJoin = 'round'; g.lineWidth = 3;
  const fc = hFarba(CERUZKY[f], CERUZKY_Z[f]); g.fillStyle = fc; g.fillRect(x, y0, w, dl); g.strokeRect(x, y0, w, dl);
  g.fillStyle = 'rgb(255 255 255 / .35)'; g.fillRect(x + w * .2, y0, w * .16, dl);
  g.fillStyle = 'rgb(0 0 0 / .1)'; g.fillRect(x + w * .68, y0, w * .16, dl);
  g.fillStyle = hFarba('--h-drevo', '#FFE7C7'); g.beginPath(); g.moveTo(x, koniec); g.lineTo(x + w, koniec); g.lineTo(x + w / 2, spicka); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = fc; g.beginPath(); g.moveTo(x + w * .37, spicka + smer * HROT * .26); g.lineTo(x + w * .63, spicka + smer * HROT * .26); g.lineTo(x + w / 2, spicka); g.closePath(); g.fill(); g.stroke();
}
const Hra = {
  // b: ťuknutá dlaždica na ihrisku. Zamknutá sa zatrasie a zámok cinkne, odomknutá sa narovná, zväčší a až potom sa otvorí hra.
  start(id, b) {
    const info = HRY.find(x => x.id === id);
    if (!info) return;
    if (bodyHry() < info.cena) {
      toast(st.body >= info.cena ? `${info.n} si chvíľu oddychuje, kým strom vädne. Preber tému a hneď sa odomkne!` : `${info.n} sa odomkne pri ${info.cena} bodoch. Chýba ešte ${info.cena - st.body} bodov.`); Zvuk.play('boing');
      if (b && b.classList) { b.classList.remove('trasie'); void b.offsetWidth; b.classList.add('trasie'); }
      return;
    }
    if (b && b.classList && b.closest && b.closest(".ihrisko") && !tiche) {
      if (b.classList.contains('ide')) return;
      b.classList.add('ide'); Zvuk.play('tap'); setTimeout(() => { if (st.view === 'hry' && !st.hra) this.start(id); }, 230); return;
    }
    this.zrus(); Hlas.stop(); st.hraPosledna = id; // len v pamäti (nič sa neukladá): ihrisko ju ukáže hore
    const mal = st.vek !== 'starsi';
    st.flow = null;
    if (id === 'pexeso') {
      const t = temyDoHry(mal ? 6 : 8);
      st.hra = { id, karty: mix(t.length * 2).map(i => t[i % t.length].id), otocene: [], najdene: [], tahy: 0 };
    } else if (id === 'hviezdy') {
      st.hra = { id, skore: 0, zostava: 30, beh: false, mal };
    } else if (id === 'krtko') {
      st.hra = { id, skore: 0, zostava: 30, beh: false, mal, hore: {} };
    } else if (id === 'pocitaj') {
      st.hra = { id, kola: mix(5).map(i => i + 1), druh: mix(4), i: 0, spravne: 0, chyba: false, zle: [], odp: null };
      st.hra.moznosti = moznostiPocitaj(st.hra);
    } else if (KV_HRY[id]) {
      st.hra = { id, kv: true, mal, kola: KV_HRY[id](mal), i: 0, krok: 0, vzate: [], zle: [], chyba: false, spravne: 0, odp: false };
    } else if (id === 'hadaj') {
      st.hra = { id, kola: temyDoHry(8).map(t => t.id), i: 0, spravne: 0, n: mal ? 3 : 4, odp: null };
      st.hra.moznosti = moznostiHadaj(st.hra);
    } else if (id === 'opakuj') {
      st.hra = { id, seq: [], krok: 0, faza: 'start', beh: false, mal };
    } else if (id === 'bubliny') {
      st.hra = { id, skore: 0, zostava: 60, beh: false, mal };
    } else if (id === 'sova') {
      st.hra = { id, skore: 0, beh: false, mal, zivoty: mal ? 3 : 2 };
    } else {
      const [sl, ri] = mal ? [3, 3] : [4, 3];
      let p; do p = mix(sl * ri); while (p.every((x, i) => x === i));
      st.hra = { id, t: temyDoHry(1)[0].id, sl, ri, p, vyber: null, tahy: 0 };
    }
    Zvuk.play('start'); render(); scrollTo(0, 0);
  },
  zrus() { zrusVysledok(); const h = st.hra; if (h) { h.beh = false; clearInterval(h.casovac); if (h.id !== 'sova') clearTimeout(h.dalsia); if (h.hore) Object.values(h.hore).forEach(k => clearTimeout(k.to)); } st.hra = null; },
  koniec(menejJeLepsie, hodnota) {
    const h = st.hra; h.beh = false; const kl = rekordKluc(h.id), stary = S.get(kl, null);
    const lepsi = stary == null || (menejJeLepsie ? hodnota < stary : hodnota > stary);
    if (lepsi && hodnota > 0) S.set(kl, hodnota);
    S.set('hry-pocet-' + st.dietaId, S.get('hry-pocet-' + st.dietaId, 0) + 1);
    const odznaky = noveOdznaky('', { hra: h.id, hodnota, pary: h.karty ? h.karty.length / 2 : 0, dieliky: h.p ? h.p.length : 0 });
    h.hotovo = { hodnota, novy: lepsi && stary != null, prvy: stary == null && hodnota > 0, stary, odznaky };
    Zvuk.play('win'); FX.ohnostroj(3); vibruj([40, 60, 40]);
    if (h.id === 'skladacka') obnovSklad();
    if (!main.querySelector('.hra')) return;
    ukazVysledok(h);
    const v = document.querySelector('.vysl [data-hra]'); if (v && v.focus) setTimeout(() => { try { v.focus({ preventScroll: true }); } catch (e) { /* bez fokusu */ } }, 700);
  },
  // Lietajúca sova: ťuknutie = mávnutie krídlami
  sovaStart() {
    const h = st.hra;
    if (!h || h.id !== 'sova' || h.beh || h.hotovo || h.zivoty <= 0) return;
    const cv = document.getElementById('sova-cv'); if (!cv) return;
    const b = main.querySelector('.sova-hra .hv-start'); if (b) b.remove();
    Object.assign(h, sovaSvet(cv.clientWidth || 360, cv.clientHeight || 480, h.mal), { beh: true });
    Zvuk.play('start'); this.mav();
    let pred = performance.now();
    const krok = t => {
      if (st.hra !== h || !h.beh) return;
      const dt = Math.min(.05, Math.max(0, (t - pred) / 1000)); pred = t;
      const cw = cv.clientWidth, ch = cv.clientHeight;
      if (cw && ch && (Math.abs(cw - h.W) > 2 || Math.abs(ch - h.H) > 2)) { // otočený displej: prepočítať ihrisko
        const k = ch / h.H; h.y *= k; h.prekazky.forEach(p => { p.stred *= k; }); h.hviezdy.forEach(s => { s.y *= k; });
        h.W = cw; h.H = ch; h.x = Math.round(cw * .28); h.medzera = ch * (h.mal ? .37 : .31);
      }
      sovaKrok(h, dt).forEach(u => this.sovaUdalost(h, u));
      this.sovaKresli(h);
      if (h.beh) requestAnimationFrame(krok);
    };
    requestAnimationFrame(krok);
  },
  mav() {
    const h = st.hra;
    if (!h || h.id !== 'sova' || h.hotovo || h.zivoty <= 0) return;
    if (!h.beh) { this.sovaStart(); return; }
    h.vy = h.skok; h.mava = .2; Zvuk.play('krid');
  },
  sovaUdalost(h, u) {
    if (u === 'bod') { Zvuk.play(h.skore % 10 === 0 ? 'star' : 'pop'); obnovStavHry(); }
    else if (u === 'hviezda') { Zvuk.play('coin'); obnovStavHry(); }
    else if (u === 'naraz') { Zvuk.play('bad'); vibruj(80); mudraHra('povzbudenie'); }
    else if (u === 'koniec') {
      h.beh = false; Zvuk.play('bum'); vibruj([60, 40, 60]); this.sovaKresli(h);
      setTimeout(() => { if (st.hra === h && !h.hotovo) this.koniec(false, h.skore); }, 800);
    }
  },
  // obloha, oblak, hviezda, sovička a srdiečka sú predkreslené bitmapy (sovaSprite); kresliť SVG v každom snímku na telefóne sekalo
  sovaKresli(h) {
    const cv = document.getElementById('sova-cv');
    if (!cv || !cv.getContext || !h) return;
    const W = h.W || cv.clientWidth || 360, H = h.H || cv.clientHeight || 480, dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const g = cv.getContext('2d'), pos = h.posun || 0, zem = H - 26, cas = h.cas || 0;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = INK;
    if (h.rezimKresby !== hNoc()) { h.rezimKresby = hNoc(); sovaSprite.zabudni(); } // prepnutý Mesačný režim: bitmapy nakresliť nanovo
    const obloha = sovaSprite('obloha' + W + 'x' + H, W, H, dpr, c => {
      const noc = hNoc(); c.fillStyle = noc ? hFarba('--noc-bg', '#18143F') : hFarba('--h-nebo', '#D5EDFF'); c.fillRect(0, 0, W, H);
      c.fillStyle = noc ? 'rgb(255 255 255 / .1)' : 'rgb(255 255 255 / .45)';
      for (let y = 12, r = 0; y < H; y += 22, r++) for (let x = r % 2 ? 11 : 0; x < W; x += 22) { c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); }
      c.strokeStyle = INK; c.lineWidth = 3; c.fillStyle = hFarba('--sun', '#FFC533'); c.beginPath(); c.arc(W - 46, 48, 24, 0, 7); c.fill(); c.stroke();
      if (noc) { c.fillStyle = hFarba('--noc-bg', '#18143F'); c.beginPath(); c.arc(W - 36, 40, 21, 0, 7); c.fill(); }
      else { c.lineWidth = 3; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; c.beginPath(); c.moveTo(W - 46 + Math.cos(a) * 31, 48 + Math.sin(a) * 31); c.lineTo(W - 46 + Math.cos(a) * 38, 48 + Math.sin(a) * 38); c.stroke(); } }
    });
    if (obloha) g.drawImage(obloha, 0, 0, W, H);
    // oblaky (pomaly sa posúvajú)
    const oblak = sovaSprite('oblak', 84, 56, dpr, c => {
      const kruhy = [[21, 34, 18], [41, 26, 22], [63, 34, 17]];
      c.strokeStyle = INK; c.fillStyle = hNoc() ? hFarba('--noc-sand', '#352E7A') : hFarba('--h-biela', '#FFFDF8'); c.lineWidth = 6;
      kruhy.forEach(([a, b, rr]) => { c.beginPath(); c.arc(a, b, rr, 0, 7); c.stroke(); });
      kruhy.forEach(([a, b, rr]) => { c.beginPath(); c.arc(a, b, rr, 0, 7); c.fill(); });
    });
    for (let i = 0; i < 3 && oblak; i++) g.drawImage(oblak, ((i * 190 + 80 - pos * .2) % (W + 160) + W + 160) % (W + 160) - 80 - 21, 70 + i * 52 - 34, 84, 56);
    // kopce v diaľke: pás nakreslený raz a len posúvaný (vlna sa opakuje po 2π·64 bodoch)
    const P = Math.PI * 128, kh = zem - 58, ks = Math.ceil(W + P) + 2;
    const kopce = sovaSprite('kopce' + W + 'x' + H, ks, H - kh, dpr, c => {
      c.strokeStyle = INK; c.lineJoin = 'round'; c.fillStyle = hNoc() ? hFarba('--leaf-l', '#22525A') : hFarba('--h-kopec', '#A8E3A6'); c.lineWidth = 3; c.beginPath(); c.moveTo(0, H - kh);
      for (let x = 0; x <= ks + 8; x += 8) c.lineTo(x, zem - 34 - 20 * Math.sin(x / 64) - kh);
      c.lineTo(ks, H - kh); c.closePath(); c.fill(); c.stroke();
    });
    if (kopce) g.drawImage(kopce, -(pos * .35 % P), kh, ks, H - kh);
    // ceruzky: bitmapa pre každú farbu a smer, dlhšia ako ihrisko (čo prečnieva, sa neukáže)
    const L = H + 14, cs = SIRKA_CERUZKY + 6;
    const ceruzka = (f, smer) => sovaSprite('ceruzka' + f + (smer < 0 ? 'h' : 'd') + H, cs, L, dpr, c => sovaCeruzka(c, 3, smer < 0 ? L - 2 : 2, smer, smer < 0 ? -4 : L + 4, f));
    (h.prekazky || []).forEach(p => {
      const hore = ceruzka(p.f, -1), dole = ceruzka(p.f2, 1);
      if (hore) g.drawImage(hore, p.x - 3, p.stred - h.medzera / 2 - (L - 2), cs, L);
      if (dole) g.drawImage(dole, p.x - 3, p.stred + h.medzera / 2 - 2, cs, L);
    });
    // hviezdy
    const hv = sovaSprite('hviezda', 38, 38, dpr, c => {
      c.translate(19, 19); c.fillStyle = hNoc() ? 'rgb(255 212 92 / .22)' : 'rgb(255 255 255 / .6)'; c.beginPath(); c.arc(0, 0, 18, 0, 7); c.fill();
      c.strokeStyle = INK; c.lineJoin = 'round'; c.fillStyle = hFarba('--sun', '#FFC533'); c.lineWidth = 2.5; c.beginPath();
      for (let k = 0; k < 10; k++) { const rr = k % 2 ? 5.5 : 13, a = -Math.PI / 2 + k * Math.PI / 5; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      c.closePath(); c.fill(); c.stroke();
    });
    if (hv) (h.hviezdy || []).forEach(z => {
      g.save(); g.translate(z.x, z.y + Math.sin(cas * 4 + z.x / 40) * 3); g.rotate(Math.sin(cas * 3 + z.x) * .25); g.drawImage(hv, -19, -19, 38, 38); g.restore();
    });
    // iskry po chytenej hviezde
    const isk = { sun: hFarba('--sun', '#FFC533'), biela: hFarba('--h-biela', '#FFFDF8') };
    (h.iskry || []).forEach(q => { g.globalAlpha = Math.max(0, q.ziv / .6); g.fillStyle = isk[q.c] || q.c; g.beginPath(); g.arc(q.x, q.y, 4, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    // zem s trávou: pás o jeden trs širší, posúvaný (trsy sa opakujú po 30 bodoch)
    const zemObr = sovaSprite('zem' + W + 'x' + H, W + 30, H - zem + 2, dpr, c => {
      c.fillStyle = hFarba('--leaf', '#5BC56B'); c.fillRect(0, 2, W + 30, H - zem); c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 2); c.lineTo(W + 30, 2); c.stroke();
      c.fillStyle = hFarba('--leaf-d', '#2F9A49'); c.beginPath(); for (let x = 0; x < W + 30; x += 30) { c.moveTo(x, 10); c.lineTo(x + 6, 20); c.lineTo(x + 12, 10); } c.fill();
    });
    if (zemObr) g.drawImage(zemObr, -((pos % 30) + 30) % 30, zem - 2, W + 30, H - zem + 2);
    // sovička
    const y = h.y != null ? h.y : H * .42, x = h.x != null ? h.x : W * .28, uhol = Math.max(-.45, Math.min(.8, (h.vy || 0) / 700));
    g.save(); g.translate(x, y + (h.beh || h.hotovo || h.zivoty < (h.mal ? 3 : 2) ? 0 : Math.sin(performance.now() / 300) * 4)); g.rotate(uhol);
    if (h.neznic && Math.floor(cas * 10) % 2) g.globalAlpha = .35;
    const kk = h.mava > 0 || !h.beh ? 'hore' : 'dole';
    const sova = sovaSprite('sova-' + kk, 48, 53, dpr, c => { const img = SOVA_IMG[kk]; if (!img || !img.complete || !img.naturalWidth) return false; c.drawImage(img, 0, 0, 48, 53); });
    if (sova) g.drawImage(sova, -24, -27, 48, 53);
    else { g.fillStyle = hFarba('--violet', '#7A5AF8'); g.beginPath(); g.arc(0, 0, 18, 0, 7); g.fill(); g.stroke(); }
    g.restore(); g.globalAlpha = 1;
    // srdiečka a body
    for (let i = 0; i < (h.mal ? 3 : 2); i++) {
      const plne = i < h.zivoty, s = sovaSprite('srdce' + (plne ? 1 : 0), 27, 27, dpr, c => {
        c.scale(.55, .55); c.lineWidth = 5; c.strokeStyle = INK; c.lineJoin = 'round'; c.fillStyle = plne ? hFarba('--coral', '#FF6A4D') : hFarba('--h-biela', '#FFFDF8');
        c.beginPath(); c.moveTo(24, 42); c.bezierCurveTo(10, 33, 5, 25, 5, 17); c.bezierCurveTo(5, 11, 10, 7, 15, 7); c.bezierCurveTo(19, 7, 22, 9, 24, 13);
        c.bezierCurveTo(26, 9, 29, 7, 33, 7); c.bezierCurveTo(38, 7, 43, 11, 43, 17); c.bezierCurveTo(43, 25, 38, 33, 24, 42); c.closePath(); c.fill(); c.stroke();
      });
      if (s) g.drawImage(s, 14 + i * 30, 12, 27, 27);
    }
    if (h.beh || h.hotovo) {
      if (!h.skoreObr || h.skoreObr.n !== h.skore) {
        const n = String(h.skore);
        h.skoreObr = { n: h.skore, c: sovaSprite(null, 140, 64, dpr, c => {
          c.font = '800 40px Grandstander, "Baloo 2", Nunito, sans-serif'; c.textAlign = 'center'; c.lineWidth = 7; c.lineJoin = 'round'; c.strokeStyle = INK;
          c.strokeText(n, 70, 50); c.fillStyle = hFarba('--h-biela', '#FFFDF8'); c.fillText(n, 70, 50);
        }) };
      }
      if (h.skoreObr.c) g.drawImage(h.skoreObr.c, W / 2 - 70, 8, 140, 64);
    }
  },
  // Pexeso: dve otočené karty, rovnaké ostanú hore
  pex(i, b) {
    const h = st.hra;
    if (!h || h.hotovo || h.zamok || h.otocene.includes(i) || h.najdene.includes(h.karty[i])) return;
    h.otocene.push(i); b.classList.add('otocena'); Zvuk.play('tap');
    if (h.otocene.length < 2) return;
    h.tahy++; obnovStavHry();
    const [a, c] = h.otocene, karty = [...main.querySelectorAll('.pex')];
    if (h.karty[a] === h.karty[c]) {
      h.najdene.push(h.karty[a]); h.otocene = [];
      [a, c].forEach(j => karty[j] && karty[j].classList.add('najdena'));
      Zvuk.play('ok'); Haptika.hraj('spravne'); mudraHra('radost', 1100); const [x, y] = stred(b); FX.burst(x, y, 16, ['star', 'dot'], 6);
      if (h.najdene.length * 2 === h.karty.length) h.dalsia = setTimeout(() => { if (st.hra === h) this.koniec(true, h.tahy); }, 600);
    } else {
      h.zamok = true;
      h.dalsia = setTimeout(() => {
        if (st.hra !== h) return;
        [a, c].forEach(j => karty[j] && karty[j].classList.remove('otocena'));
        h.otocene = []; h.zamok = false;
      }, 1000);
    }
  },
  // Chytaj hviezdičky: 30 sekúnd, hviezdy +1, veľké +3, búrka −2
  hviezdyStart() {
    const h = st.hra;
    if (!h || h.id !== 'hviezdy' || h.beh || h.hotovo) return;
    h.beh = true; Zvuk.play('start');
    const nebo = document.getElementById('nebo'); if (nebo) nebo.innerHTML = '';
    h.casovac = setInterval(() => {
      if (st.hra !== h) { clearInterval(h.casovac); return; }
      if (document.hidden) return; // skrytá karta: čas stojí
      h.zostava--; obnovStavHry();
      if (h.zostava > 0 && h.zostava <= 3) Zvuk.play('tick');
      if (h.zostava <= 0) {
        clearInterval(h.casovac); clearTimeout(h.dalsia); h.beh = false;
        const n = document.getElementById('nebo'); if (n) n.querySelectorAll('.hv').forEach(x => x.remove());
        this.koniec(false, h.skore);
      }
    }, 1000);
    const dalsia = () => {
      if (st.hra !== h || !h.beh) return;
      this.pridajHviezdu(h);
      const uplynulo = 30 - h.zostava;
      h.dalsia = setTimeout(dalsia, Math.max(h.mal ? 480 : 340, (h.mal ? 800 : 650) - uplynulo * (h.mal ? 11 : 12)));
    };
    dalsia();
  },
  pridajHviezdu(h) {
    const nebo = document.getElementById('nebo'); if (!nebo) return;
    const r = Math.random(), typ = r < .13 ? 'velka' : r < (h.mal ? .27 : .33) ? 'burka' : 'hviezda';
    const el = document.createElement('button');
    el.className = 'hv ' + typ; el.dataset.hv = typ;
    el.setAttribute('aria-label', typ === 'burka' ? 'Búrka' : 'Hviezda');
    el.style.left = (2 + Math.random() * 74) + '%'; el.style.top = (2 + Math.random() * 74) + '%';
    el.innerHTML = typ === 'burka' ? OBLAK : STAR(typ === 'velka' ? 'var(--coral)' : 'var(--sun)');
    nebo.appendChild(el);
    const zivot = Math.max(900, (h.mal ? 2000 : 1500) - (30 - h.zostava) * 16);
    setTimeout(() => { el.classList.add('prec'); setTimeout(() => el.remove(), 260); }, zivot);
  },
  chyt(b) {
    const h = st.hra;
    if (!h || !h.beh || b.classList.contains('prec')) return;
    const typ = b.dataset.hv, body = typ === 'velka' ? 3 : typ === 'burka' ? -2 : 1;
    h.skore = Math.max(0, h.skore + body); obnovStavHry();
    const [x, y] = stred(b);
    if (body > 0) { Zvuk.play(body > 1 ? 'star' : 'coin'); FX.burst(x, y, body > 1 ? 18 : 8, ['star', 'dot'], 5); if (body > 1) mudraHra('oslava', 1200); }
    else { Zvuk.play('bad'); vibruj(80); mudraHra('povzbudenie', 1100); }
    const s = document.createElement('span');
    s.className = 'hv-plus' + (body < 0 ? ' minus' : ''); s.textContent = (body > 0 ? '+' : '−') + Math.abs(body);
    s.style.left = b.style.left; s.style.top = b.style.top;
    b.replaceWith(s); setTimeout(() => s.remove(), 700);
  },
  // Ťukaj krtkov: 30 sekúnd, krtko +1, zlatý +3, bez trestov (dá sa len minúť)
  krtkoStart() {
    const h = st.hra;
    if (!h || h.id !== 'krtko' || h.beh || h.hotovo) return;
    h.beh = true; h.hore = {}; Zvuk.play('start'); Haptika.hraj('tuk');
    const sb = main.querySelector('.luka .hv-start'); if (sb) sb.remove();
    h.casovac = setInterval(() => {
      if (st.hra !== h) { clearInterval(h.casovac); return; }
      if (document.hidden) return; // skrytá karta: čas stojí
      h.zostava--; obnovStavHry();
      if (h.zostava > 0 && h.zostava <= 3) Zvuk.play('tick');
      if (h.zostava <= 0) {
        clearInterval(h.casovac); clearTimeout(h.dalsia); h.beh = false;
        Object.values(h.hore).forEach(k => clearTimeout(k.to)); h.hore = {};
        main.querySelectorAll('.diera.hore').forEach(x => x.classList.remove('hore', 'zlaty'));
        this.koniec(false, h.skore);
      }
    }, 1000);
    const dalsia = () => {
      if (st.hra !== h || !h.beh) return;
      this.krtkoVysun(h);
      if (!h.mal) { if (Math.random() < .6) this.krtkoVysun(h); if (h.zostava < 20 && Math.random() < .5) this.krtkoVysun(h); } // starší: dvaja, neskôr aj traja naraz
      h.dalsia = setTimeout(dalsia, Math.max(h.mal ? 520 : 300, (h.mal ? 950 : 640) - (30 - h.zostava) * (h.mal ? 12 : 13)));
    };
    dalsia();
  },
  krtkoVysun(h) {
    const diery = [...main.querySelectorAll('.diera')], volne = diery.map((_, i) => i).filter(i => !h.hore[i]);
    if (!volne.length) return;
    const i = volne[nahodne(volne.length)], zlaty = Math.random() < (h.mal ? .12 : .08), el = diery[i], k = { zlaty };
    h.hore[i] = k; el.classList.toggle('zlaty', zlaty); el.classList.add('hore');
    k.to = setTimeout(() => { if (h.hore[i] === k) { delete h.hore[i]; el.classList.remove('hore', 'zlaty'); } }, Math.max(h.mal ? 850 : 520, (h.mal ? 1800 : 1000) - (30 - h.zostava) * (h.mal ? 14 : 16)));
  },
  krt(i, b) {
    const h = st.hra;
    if (!h || h.id !== 'krtko' || !h.beh) return;
    const k = h.hore[i];
    if (!k) { Zvuk.play('tap'); return; } // prázdna diera, nič sa nestane
    clearTimeout(k.to); delete h.hore[i];
    const body = k.zlaty ? 3 : 1; h.skore += body; obnovStavHry();
    b.classList.remove('hore', 'zlaty', 'buch'); void b.offsetWidth; b.classList.add('buch'); setTimeout(() => b.classList.remove('buch'), 450);
    Zvuk.play(k.zlaty ? 'star' : 'coin'); Haptika.hraj(k.zlaty ? 'hviezdicka' : 'tuk'); if (k.zlaty) mudraHra('oslava', 1200);
    const [x, y] = stred(b); FX.burst(x, y, k.zlaty ? 16 : 8, ['star', 'dot'], 5);
    const luka = b.parentElement;
    if (luka) {
      const sp = document.createElement('span');
      sp.className = 'hv-plus'; sp.textContent = '+' + body; sp.style.left = b.offsetLeft + 'px'; sp.style.top = b.offsetTop + 'px';
      luka.appendChild(sp); setTimeout(() => sp.remove(), 700);
    }
  },
  // Hádaj tému: obrázok a tri alebo štyri názvy tém
  // Koľko ich je?: malé deti, 1 až 5 obrázkov, bez časovača; zlé číslo sa dá skúsiť znova
  pocitaj(n) {
    const h = st.hra;
    if (!h || h.id !== 'pocitaj' || h.odp || h.hotovo) return;
    n = +n;
    if (n !== h.kola[h.i]) { h.chyba = true; h.zle.push(n); Zvuk.play('bad'); vibruj(60); mudraHra('povzbudenie'); obnovPocitaj(); return; }
    if (!h.chyba) h.spravne++;
    h.odp = n; Zvuk.play('ok'); mudraHra(h.chyba ? 'radost' : 'oslava', 1000); obnovStavHry(); obnovPocitaj();
    h.dalsia = setTimeout(() => {
      if (st.hra !== h) return;
      h.i++; h.odp = null; h.chyba = false; h.zle = [];
      if (h.i >= h.kola.length) { this.koniec(false, h.spravne); return; }
      h.moznosti = moznostiPocitaj(h); obnovPocitaj();
    }, 900);
  },
  hadaj(id) {
    const h = st.hra;
    if (!h || h.id !== 'hadaj' || h.odp || h.hotovo) return;
    const ok = id === h.kola[h.i];
    h.odp = id;
    if (ok) { h.spravne++; Zvuk.play('ok'); Haptika.hraj('spravne'); mudraHra('oslava', 1000); } else { Zvuk.play('bad'); vibruj(60); mudraHra('povzbudenie', 1800); }
    obnovStavHry(); obnovHadaj();
    h.dalsia = setTimeout(() => {
      if (st.hra !== h) return;
      h.i++; h.odp = null;
      if (h.i >= h.kola.length) { this.koniec(false, h.spravne); return; }
      h.moznosti = moznostiHadaj(h); obnovHadaj();
    }, ok ? 900 : 1800);
  },
  // Nové hry (4.1): jedno kolo = obrázok, možnosti a poradie správnych ťuknutí (aj jedno)
  kv(j) {
    const h = st.hra;
    if (!h || !h.kv || h.odp || h.hotovo) return;
    j = +j; const k = h.kola[h.i];
    if (!k.moz[j] || h.vzate.includes(j) || h.zle.includes(j)) return;
    if (k.moz[j].z !== k.sprav[h.krok]) {
      h.chyba = true; Zvuk.play('bad'); vibruj(60); mudraHra('povzbudenie');
      if (k.sloty) { const el = main.querySelector(`[data-kv="${j}"]`); if (el) { el.classList.add('zle'); setTimeout(() => el.classList.remove('zle'), 450); } }
      else { h.zle.push(j); obnovKv(); }
      return;
    }
    h.vzate.push(j); h.krok++;
    if (h.krok < k.sprav.length) { Zvuk.play('pop'); obnovKv(); return; }
    if (!h.chyba) h.spravne++;
    h.odp = true; Zvuk.play('ok'); mudraHra(h.chyba ? 'radost' : 'oslava', 1200); if (!h.chyba) Haptika.hraj('spravne'); obnovStavHry(); obnovKv();
    h.dalsia = setTimeout(() => {
      if (st.hra !== h) return;
      h.i++; h.odp = false; h.krok = 0; h.vzate = []; h.zle = []; h.chyba = false;
      if (h.i >= h.kola.length) { this.koniec(false, h.spravne); return; }
      obnovKv();
    }, k.x ? (h.id === 'ine' && !h.mal ? 3200 : 2400) : 900);
  },
  // Bubliny s počtami: minúta, praskni bublinu so správnym výsledkom
  bublinyStart() {
    const h = st.hra;
    if (!h || h.id !== 'bubliny' || h.beh || h.hotovo) return;
    h.beh = true; Zvuk.play('start'); this.novyPriklad(h);
    h.casovac = setInterval(() => {
      if (st.hra !== h) { clearInterval(h.casovac); return; }
      if (document.hidden) return; // skrytá karta: čas stojí
      h.zostava--; obnovStavHry();
      if (h.zostava > 0 && h.zostava <= 3) Zvuk.play('tick');
      if (h.zostava <= 0) {
        clearInterval(h.casovac); clearTimeout(h.dalsia); h.beh = false;
        const el = document.getElementById('bubliny'), p = document.getElementById('priklad');
        if (el) el.innerHTML = '';
        if (p) p.textContent = 'Čas vypršal!';
        this.koniec(false, h.skore);
      }
    }, 1000);
  },
  novyPriklad(h) {
    const [text, vysl] = priklad(h.mal), n = h.mal ? 3 : 4, moz = new Set([vysl]), posun = h.mal ? [1, 2, 3] : [1, 2, 3, 10];
    while (moz.size < n) { const x = vysl + (Math.random() < .5 ? -1 : 1) * posun[Math.floor(Math.random() * posun.length)]; if (x >= 0) moz.add(x); }
    h.vysl = vysl; h.priklad = text; h.moznosti = [...moz].sort(() => Math.random() - .5);
    const p = document.getElementById('priklad'), el = document.getElementById('bubliny');
    if (p) p.textContent = text + ' = ?';
    if (el) el.innerHTML = h.moznosti.map((x, i) => `<button class="bublina" data-bub="${x}" style="left:${(3 + i * 94 / n + Math.random() * Math.max(0, 94 / n - 25)).toFixed(1)}%;top:${(8 + Math.random() * 50).toFixed(1)}%;--d:${(-Math.random() * 2).toFixed(2)}s"><span>${x}</span></button>`).join('');
  },
  bub(b) {
    const h = st.hra;
    if (!h || !h.beh || b.classList.contains('praskla')) return;
    const [x, y] = stred(b);
    if (Number(b.dataset.bub) === h.vysl) {
      h.skore++; obnovStavHry(); b.classList.add('praskla');
      Zvuk.play('pop'); setTimeout(() => Zvuk.play('coin'), 120); FX.burst(x, y, 14, ['dot', 'star'], 6);
      clearTimeout(h.dalsia); h.dalsia = setTimeout(() => { if (st.hra === h && h.beh) this.novyPriklad(h); }, 380);
    } else {
      h.skore = Math.max(0, h.skore - 1); obnovStavHry(); Zvuk.play('bad'); vibruj(60); mudraHra('povzbudenie', 1000);
      b.classList.remove('zle'); void b.offsetWidth; b.classList.add('zle');
      const m = document.createElement('span'); m.className = 'hv-plus minus'; m.textContent = '−1';
      m.style.left = b.style.left; m.style.top = b.style.top; b.parentNode.appendChild(m); setTimeout(() => m.remove(), 700);
    }
  },
  // Opakuj po mne: farby zasvietia v poradí a dieťa ich zopakuje, každé kolo o jednu dlhšie
  simonStart() {
    const h = st.hra;
    if (!h || h.id !== 'opakuj' || h.beh || h.hotovo) return;
    h.beh = true; Zvuk.play('start');
    const s = document.querySelector('.simon .hv-start'); if (s) s.remove();
    h.seq = [Math.floor(Math.random() * 4)];
    h.dalsia = setTimeout(() => { if (st.hra === h) this.ukaz(h); }, 700);
  },
  ukaz(h) {
    h.faza = 'ukazuje'; h.krok = 0; obnovStavHry(); simonStav('Pozeraj a počúvaj…');
    const t = Math.max(h.mal ? 480 : 380, (h.mal ? 760 : 620) - h.seq.length * 15);
    let i = 0;
    clearInterval(h.casovac);
    h.casovac = setInterval(() => {
      if (st.hra !== h) { clearInterval(h.casovac); return; }
      if (i >= h.seq.length) { clearInterval(h.casovac); h.faza = 'hra'; simonStav('Teraz ty!'); return; }
      zasviet(h.seq[i++], t * .6);
    }, t);
  },
  pad(n) {
    const h = st.hra;
    if (!h || h.id !== 'opakuj' || h.faza !== 'hra') return;
    zasviet(n, 260);
    if (n !== h.seq[h.krok]) {
      h.faza = 'koniec'; Zvuk.play('bad'); vibruj(120); simonStav('Ups, to nebola tá farba.'); mudraHra('povzbudenie');
      h.dalsia = setTimeout(() => { if (st.hra === h) this.koniec(false, h.seq.length - 1); }, 800);
      return;
    }
    h.krok++;
    if (h.krok === h.seq.length) {
      h.faza = 'cakaj'; simonStav('Výborne!'); mudraHra('radost', 900);
      h.dalsia = setTimeout(() => { if (st.hra !== h) return; h.seq.push(Math.floor(Math.random() * 4)); this.ukaz(h); }, 850);
    }
  },
  // Skladačka: ťukni na dva dieliky a vymenia sa
  diel(poz) {
    const h = st.hra;
    if (!h || h.hotovo) return;
    if (h.vyber === null) { h.vyber = poz; Zvuk.play('tap'); }
    else if (h.vyber === poz) { h.vyber = null; Zvuk.play('pop'); }
    else {
      const a = h.vyber; h.vyber = null;
      [h.p[a], h.p[poz]] = [h.p[poz], h.p[a]]; h.tahy++; obnovStavHry();
      Zvuk.play(h.p[a] === a || h.p[poz] === poz ? 'ok' : 'whoosh'); if (h.p[a] === a || h.p[poz] === poz) mudraHra('radost', 900);
      if (h.p.every((x, i) => x === i)) { this.koniec(true, h.tahy); return; }
    }
    obnovSklad();
  },
};

// príklad na počítanie: menšie deti do 10, väčšie do 50 a malá násobilka
function priklad(mal) {
  const r = (od, po) => od + Math.floor(Math.random() * (po - od + 1)), druh = Math.random();
  if (mal) {
    if (druh < .6) { const a = r(1, 9), b = r(0, 10 - a); return [`${a} + ${b}`, a + b]; }
    const a = r(2, 10), b = r(0, a); return [`${a} − ${b}`, a - b];
  }
  if (druh < .35) { const a = r(6, 30), b = r(3, 20); return [`${a} + ${b}`, a + b]; }
  if (druh < .7) { const a = r(10, 40), b = r(2, Math.min(20, a)); return [`${a} − ${b}`, a - b]; }
  const a = r(2, 9), b = r(2, 10); return [`${a} × ${b}`, a * b];
}
const moznostiHadaj = h => { const sp = h.kola[h.i], v = TV(), ine = mix(v.length).map(i => v[i].id).filter(id => id !== sp).slice(0, h.n - 1); return [sp, ...ine].sort(() => Math.random() - .5); };
const POC_OBR = [() => STAR('var(--sun)'), () => IK.srdce, () => IK.ohen, () => IK.diamant];
function moznostiPocitaj(h) { const v = h.kola[h.i], inak = mix(5).map(i => i + 1).filter(x => x !== v).slice(0, 2); return mix(3).map(i => [v, ...inak][i]); }
function pocitajHtml(h) {
  const n = h.kola[h.i], obr = POC_OBR[h.druh[h.i % 4]];
  return `<div class="card poc-pole" aria-label="${n} obrázkov">${Array.from({ length: n }, (_, i) => `<span class="poc-obr" style="--d:${(i * .12).toFixed(2)}s">${obr()}</span>`).join('')}</div>
    <p class="hadaj-otazka">Koľko ich je?</p>
    <div class="poc-moz">${h.moznosti.map(m => `<button class="btn ghost poc-btn${h.odp ? (m === n ? ' ok' : '') : h.zle.includes(m) ? ' zle' : ''}" data-pocitaj="${m}"${h.zle.includes(m) ? ' disabled' : ''}>${m}</button>`).join('')}</div>`;
}
// obnova obsahu hry bez blikania: v tom istom kole sa zmení len to, čo sa líši (farba tlačidla); nové kolo sa vymení s jemným vyblednutím
function obnovKolo(el, h, html) {
  if (!el) return;
  const kolo = String(h.i);
  if (el.dataset.kolo === kolo && el.firstElementChild) { const t = document.createElement('div'); t.innerHTML = html; morph(el, t, true); return; }
  el.dataset.kolo = kolo; el.innerHTML = html;
  el.classList.remove('kolo-nove'); void el.offsetWidth; el.classList.add('kolo-nove');
}
const obnovPocitaj = () => { if (st.hra) obnovKolo(document.getElementById('pocitaj'), st.hra, pocitajHtml(st.hra)); };
function hadajHtml(h) {
  const t = byId(h.kola[h.i]);
  return `<div class="frame hadaj-obr">${svg(t)}</div>
    <p class="hadaj-otazka">O ktorej téme je tento obrázok?</p>
    <div class="hadaj-moz">${h.moznosti.map(id => `<button class="btn ghost hadaj-btn${h.odp ? (id === t.id ? ' ok' : id === h.odp ? ' zle' : '') : ''}" data-hadaj="${id}">${esc(byId(id).t)}</button>`).join('')}</div>`;
}
const obnovHadaj = () => { if (st.hra) obnovKolo(document.getElementById('hadaj'), st.hra, hadajHtml(st.hra)); };
/* Nové hry 4.1: Ktorý je iný?, Nájdi tieň, Zoraď čísla, Poskladaj slovo */
const KV_KOL = 6;
const KV_FARBY = ['var(--coral)', 'var(--sky)', 'var(--leaf)', 'var(--sun)', 'var(--violet)', 'var(--teal)'];
const nahodne = n => Math.floor(Math.random() * n);
const TVARY = [
  '<circle cx="24" cy="24" r="18"/>', '<rect x="7" y="7" width="34" height="34" rx="6"/>', '<path d="M24 6 L43 40 H5Z"/>',
  `<path d="${HVIEZDA}" transform="scale(2)"/>`, `<path d="${SRDCE_D}"/>`, '<path d="M24 4 L43 24 L24 44 L5 24Z"/>',
];
const tvar = (t, f) => `<span class="kv-it"><svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" fill="${f}">${TVARY[t]}</g></svg></span>`;
const KV_SIL = [() => STAR('var(--sun)'), () => IK.srdce, () => IK.ohen, () => IK.diamant, () => IK.blesk, () => IK.kocka, () => IK.pohar, () => IK.mozog];
const KV_SLOVA = { ruky: 'ruky', zuby: 'zuby', srdce: 'srdce', mesiac: 'mesiac', vcely: 'včely', duha: 'dúha', vtaky: 'vtáky', raketa: 'raketa', vlak: 'vlak', hory: 'hory', more: 'more',
  hviezdy: 'hviezdy', bicykel: 'bicykel', lietadlo: 'lietadlo', mozog: 'mozog', magnet: 'magnet', chlieb: 'chlieb', hudba: 'hudba', snih: 'sneh', farby: 'farby', mapa: 'mapa' };
const KV_HRY = {
  iny() {
    return Array.from({ length: KV_KOL }, (_, r) => {
      const a = r % 6, b = (a + 1 + nahodne(5)) % 6, ci = nahodne(6), c = KV_FARBY[ci], d = KV_FARBY[(ci + 1 + nahodne(5)) % 6];
      const inyIdx = nahodne(4);
      const moz = Array.from({ length: 4 }, (_, i) => ({ z: i, html: i === inyIdx ? (r % 2 === 0 ? tvar(b, c) : tvar(a, d)) : tvar(a, c) }));
      return { prompt: '', otazka: 'Ktorý je iný?', moz, sprav: [inyIdx], tr: 'skryty' };
    });
  },
  tien() {
    return Array.from({ length: KV_KOL }, () => {
      const idx = mix(KV_SIL.length).slice(0, 3);
      const moz = mix(3).map(i => ({ z: idx[i], html: `<span class="kv-it">${KV_SIL[idx[i]]()}</span>` }));
      return { prompt: `<span class="kv-it velky">${KV_SIL[idx[0]]()}</span>`, otazka: 'Ktorý tieň patrí k obrázku?', moz, sprav: [idx[0]], tm: 'tien' };
    });
  },
  ine(mal) {
    // sady podľa veku, bez opakovania: posledné použité sady si appka pamätá a vyberá z nových
    const kto = mal ? 'm' : 's', vsetky = INE_SADY.map((x, i) => i).filter(i => INE_SADY[i].v === kto);
    let bolo = S.get('ine-bolo-' + kto, []); if (!Array.isArray(bolo)) bolo = [];
    let nove = vsetky.filter(i => !bolo.includes(i)); if (nove.length < KV_KOL) { bolo = []; nove = vsetky; }
    const vyber = mix(nove.length).slice(0, KV_KOL).map(i => nove[i]);
    S.set('ine-bolo-' + kto, [...bolo, ...vyber].slice(-(vsetky.length - KV_KOL)));
    return vyber.map(i => {
      const x = INE_SADY[i], moz = mix(4).map(p => { const n = [...x.t, x.j][p]; return { z: n, nap: n, html: `<span class="kv-it">${ineSvg(INE_OBR[n]())}</span><small class="kv-nap">${esc(n)}</small>` }; });
      return { prompt: '', otazka: 'Ktorý je iný?', moz, sprav: [x.j], tr: 'skryty', tm: 'ine', x: x.x };
    });
  },
  poradie(mal) {
    return Array.from({ length: KV_KOL }, (_, r) => {
      const n = mal ? (r < 3 ? 3 : 4) : (r < 2 ? 5 : 6), max = mal ? 10 : 999, zostupne = r % 3 === 2;
      const cisla = []; while (cisla.length < n) { const x = 1 + nahodne(max); if (!cisla.includes(x)) cisla.push(x); }
      const sprav = [...cisla].sort((a, b) => zostupne ? b - a : a - b);
      const moz = mix(n).map(i => ({ z: cisla[i], html: String(cisla[i]), sl: String(cisla[i]) }));
      return { prompt: `<b class="kv-text">${zostupne ? 'Od najväčšieho po najmenšie' : 'Od najmenšieho po najväčšie'}</b>`, otazka: 'Ťukaj čísla v poradí', moz, sprav, sloty: true, tm: 'cisla', tr: 'text' };
    });
  },
  slovo() {
    const vsetky = Object.keys(KV_SLOVA).filter(id => TV().some(t => t.id === id)), dlhe = vsetky.filter(id => KV_SLOVA[id].length >= 6), ok = dlhe.length >= KV_KOL ? dlhe : vsetky; // starší dostanú dlhšie slová
    return mix(ok.length).slice(0, KV_KOL).map(i => {
      const id = ok[i], p = [...KV_SLOVA[id].toLocaleUpperCase('sk')];
      let ml; do ml = mix(p.length); while (ml.every((x, j) => x === j));
      return { prompt: `<div class="frame hadaj-obr">${svg(byId(id))}</div>`, otazka: 'Poskladaj slovo z písmen', moz: ml.map(j => ({ z: p[j], html: p[j], sl: p[j] })), sprav: p, sloty: true, tm: 'pismena', tr: 'obraz' };
    });
  },
};
function kvHtml(h) {
  const k = h.kola[h.i];
  return `<div class="card kv-prompt${k.tr ? ' ' + k.tr : ''}">${k.prompt}</div>
    <p class="hadaj-otazka">${k.otazka}</p>
    ${k.sloty ? `<div class="kv-sloty">${k.sprav.map((z, j) => `<span class="kv-slot${j < h.krok ? ' plny' : ''}">${j < h.krok ? esc(k.moz[h.vzate[j]].sl) : ''}</span>`).join('')}</div>` : ''}
    <div class="kv-moz kv-${k.moz.length}${k.tm ? ' ' + k.tm : ''}">${k.moz.map((m, j) => `<button class="btn ghost kv-btn${h.vzate.includes(j) ? (k.sloty ? ' vzata' : ' ok') : ''}${h.zle.includes(j) ? ' zle' : ''}" data-kv="${j}"${h.zle.includes(j) || (k.sloty && h.vzate.includes(j)) ? ' disabled' : ''} aria-label="${esc(m.nap || 'Možnosť ' + (j + 1))}">${m.html}</button>`).join('')}</div>${k.x ? `<p class="kv-vysv${h.odp ? ' vid' : ''}">${h.odp ? esc(k.x) : '&nbsp;'}</p>` : ''}`;
}
const obnovKv = () => { if (st.hra) obnovKolo(document.getElementById('kv'), st.hra, kvHtml(st.hra)); };
const simonStav = text => { const el = document.getElementById('simon-stav'); if (el) el.textContent = text; };
function zasviet(n, ms) {
  Zvuk.play('ton' + n);
  const el = document.querySelector(`[data-pad="${n}"]`);
  if (!el) return;
  el.classList.add('svieti'); setTimeout(() => el.classList.remove('svieti'), ms);
}
function skladHtml(h) {
  const obr = svg(byId(h.t));
  return h.p.map((kus, poz) => `<button class="diel${h.vyber === poz ? ' vybraty' : ''}${kus === poz ? ' sedi' : ''}" data-diel="${poz}" aria-label="Dielik ${poz + 1}"><span class="diel-obr" style="--x:${kus % h.sl};--y:${Math.floor(kus / h.sl)}">${obr}</span></button>`).join('');
}
function obnovSklad() {
  const h = st.hra, el = document.getElementById('sklad');
  if (!el || !h) return;
  el.innerHTML = skladHtml(h); el.classList.toggle('hotova', !!h.hotovo);
}
// výsledok hry: vyjde slnko, Múdra vyskočí, zospodu hárok s výsledkom a tlačidlami (ako pri kvíze)
const ikonaHry = id => ['pexeso', 'skladacka'].includes(id) ? 'znova' : id === 'opakuj' ? 'hraj' : ['sova', 'krtko', 'hviezdy'].includes(id) ? 'hviezda' : 'check';
function vysledokHry(h) {
  const v = h.hotovo, t = h.id === 'skladacka' ? byId(h.t) : null, dobre = v.hodnota > 0 || ['pexeso', 'skladacka'].includes(h.id);
  const nadpis = !dobre ? 'Skús to ešte raz!' : ['hviezdy', 'bubliny', 'opakuj', 'sova', 'pocitaj', 'iny', 'tien', 'poradie', 'krtko', 'slovo', 'ine'].includes(h.id) ? 'Super!' : 'Hotovo!';
  const rek = v.novy ? `<span class="pec vysl-pec">${ikn('pohar')}Nový rekord</span>` : v.prvy ? `<span class="pec vysl-pec">${ikn('pohar')}Prvý rekord</span>`
    : v.stary != null ? `<p class="vysl-rek">${ikn('pohar')}Rekord: <b>${rekordText(h.id, v.stary)}</b></p>` : '';
  return `<div class="vysl${dobre ? ' dobre' : ''}" role="dialog" aria-modal="true" aria-labelledby="vysl-n">
    <div class="vysl-scena" aria-hidden="true">${dobre ? `<div class="vysl-slnko">${slnkoKviz()}</div>` : ''}<div class="vysl-mud">${mudra(dobre ? 'oslava' : 'povzbudenie', { extra: dobre })}</div>
      <span class="vysl-cislo">${ikn(ikonaHry(h.id))}<b>${v.hodnota}</b></span></div>
    <div class="vysl-harok"><h2 class="n1" id="vysl-n">${nadpis}</h2><p class="vysl-co">${rekordText(h.id, v.hodnota)}</p>
      ${t ? `<p class="vysl-t">Na obrázku je téma „${esc(t.t)}“.</p>` : ''}${rek}
      ${odmenyHtml({ noveOdznaky: v.odznaky || [] })}
      <div class="vysl-tl"><button class="btn wide" data-hra="${h.id}">${ikn('znova')}Hrať znova</button><button class="btn dve wide" data-hra-spat>${ikn('hry')}Iná hra</button></div></div></div>`;
}
// výsledok ide priamo do body: v main by ho animácia obrazovky (transform) zviazala s hrou a nebol by cez celú obrazovku
const zrusVysledok = () => { try { document.querySelectorAll('.vysl').forEach(x => x.remove()); } catch (e) { /* test bez DOM */ } };
function ukazVysledok(h) { zrusVysledok(); try { document.body.insertAdjacentHTML('beforeend', vysledokHry(h)); } catch (e) { /* test bez DOM */ } }
const startTl = h => h.beh || h.hotovo ? '' : `<button class="hv-start" data-hv-start>${ikn('hraj')}<span>Štart</span></button>`;
const SIMON_FARBY = ['var(--coral)', 'var(--sky)', 'var(--leaf)', 'var(--sun)'];
function renderHra() {
  const h = st.hra, info = HRY.find(x => x.id === h.id);
  document.body.classList.remove('tinted');
  let telo;
  if (h.id === 'pexeso') {
    telo = `<div class="pexeso" style="--st:${h.karty.length > 12 ? 4 : 3}">${h.karty.map((tid, i) => `<button class="pex${h.najdene.includes(tid) ? ' otocena najdena' : h.otocene.includes(i) ? ' otocena' : ''}" data-pex="${i}" aria-label="Karta ${i + 1}" style="--i:${i}"><span class="pex-in"><span class="pex-rub">${STAR('var(--sun)')}</span><span class="pex-lic">${svg(byId(tid))}</span></span></button>`).join('')}</div>`;
  } else if (h.id === 'hviezdy') {
    telo = `<div class="nebo" id="nebo">${startTl(h)}</div>
      <p class="hra-pomoc"><span>${STAR('var(--sun)')}+1</span><span>${STAR('var(--coral)')}+3</span><span>${OBLAK}−2</span></p>`;
  } else if (h.id === 'sova') {
    telo = `<div class="sova-hra"><canvas id="sova-cv" class="sova-cv" aria-label="Obloha: ťukni a sovička mávne krídlami"></canvas>${startTl(h)}</div>
      <p class="hra-pomoc">Ťukaj na oblohu a sovička mávne krídlami. Prelet pomedzi ceruzky a zbieraj hviezdy. Máš ${h.mal ? 3 : 2} srdiečka.</p>`;
  } else if (h.id === 'krtko') {
    telo = `<div class="luka" id="luka">${Array.from({ length: 9 }, (_, i) => `<button class="diera" data-krt="${i}" aria-label="Diera ${i + 1}"><span class="diera-v"></span><span class="krt">${KRT_OBR}${KRT_ZLATY}</span><span class="diera-p"></span></button>`).join('')}${startTl(h)}</div>
      <p class="hra-pomoc">Ťukaj na krtkov, ktorí vykúkajú z dier. Zlatý krtko je za 3 body. Máš 30 sekúnd.</p>`;
  } else if (h.id === 'pocitaj') {
    telo = `<div id="pocitaj" class="pocitaj" data-kolo="${h.i}">${pocitajHtml(h)}</div>`;
  } else if (h.kv) {
    telo = `<div id="kv" class="kv" data-kolo="${h.i}">${kvHtml(h)}</div>`;
  } else if (h.id === 'hadaj') {
    telo = `<div id="hadaj" class="hadaj" data-kolo="${h.i}">${hadajHtml(h)}</div>`;
  } else if (h.id === 'bubliny') {
    telo = `<div class="card priklad" id="priklad">${h.beh ? h.priklad + ' = ?' : h.hotovo ? 'Čas vypršal!' : 'Koľko je…?'}</div>
      <div class="bub-pole${h.mal ? '' : ' styri'}" id="bubliny">${startTl(h)}</div>
      <p class="hra-pomoc">Praskni bublinu so správnym výsledkom. Zlá bublina zoberie bod. Máš na to minútu.</p>`;
  } else if (h.id === 'opakuj') {
    telo = `<p class="simon-stav" id="simon-stav">${h.beh ? '' : 'Ťukni na Štart'}</p>
      <div class="simon">${SIMON_FARBY.map((c, i) => `<button class="pad" data-pad="${i}" style="--c:${c}" aria-label="Farba ${i + 1}"><svg viewBox="-20 -20 40 40" aria-hidden="true"><g stroke="${INK}">${face(0, 0, 1.1)}</g></svg></button>`).join('')}
      ${startTl(h)}</div>
      <p class="hra-pomoc">Pozeraj, ktoré farby zasvietia, a potom ich ťukni v rovnakom poradí.</p>`;
  } else {
    telo = `<div class="sklad${h.hotovo ? ' hotova' : ''}" id="sklad" style="--sl:${h.sl};--ri:${h.ri}">${skladHtml(h)}</div>
      <p class="hra-pomoc">Ťukni na dva dieliky a vymenia sa. Zelený rámik znamená, že dielik je na správnom mieste.</p>`;
  }
  main.classList.add('anim');
  main.innerHTML = `<div class="hra hra-${h.id}">
    <div class="hra-top"><button class="btn kruh dve" data-hra-spat aria-label="Späť na hry">${ikn('zavriet')}</button><b class="hra-nazov">${info.n}</b><span class="hra-mud" id="hra-mud" aria-hidden="true">${mudra('zvedava')}</span><span class="st cis hra-stav" id="hra-stav" aria-live="polite">${stavHry(h)}</span></div>
    ${telo}</div>`;
  ocisluj();
  if (h.hotovo) ukazVysledok(h); else zrusVysledok();
  if (h.id === 'sova') requestAnimationFrame(() => Hra.sovaKresli(h));
}

/* Ihrisko (zoznam hier, 5.0 variant A): hraná naposledy hore, odomknuté dlaždice nakrivo, karta Ďalšia hra, zamknuté pieskové s cenou */
function hryZoznam() {
  const vid = HRY_VID(), mam = bodyHry(), ok = vid.filter(h => mam >= h.cena), zamk = vid.filter(h => mam < h.cena).sort((a, b) => a.cena - b.cena);
  const spi = h => st.body >= h.cena; // strom vädne: hra je zaplatená, len si oddychuje
  const rek = h => S.get(rekordKluc(h.id), null);
  const hore = ok.find(h => h.id === st.hraPosledna) || [...ok].sort((a, b) => b.cena - a.cena)[0];
  const dalsia = zamk.find(h => !spi(h)), ostatne = zamk.filter(h => h !== dalsia);
  let i = 0;
  const dlazdica = h => { const r = rek(h);
    return `<button class="dlazdica hra-karta" data-hra="${h.id}" style="--c:${h.c};--i:${i++}" aria-label="${esc(h.n)}${r != null ? ', rekord ' + esc(rekordText(h.id, r)) : ', nová hra'}">
      <span class="hr-obr">${OBR_HRY[h.id]}</span><b>${h.n}</b>
      <span class="pata">${r != null ? `<span class="st">${ikn('pohar')}${rekordText(h.id, r).replace(' hneď správne', '').replace(' správne', '')}</span>` : '<span class="pec" style="--pc:var(--link)">Nová</span>'}<span class="dl-hraj">${ikn('hraj')}</span></span></button>`; };
  const zamknuta = h => `<button class="dlazdica hra-karta zamknuta${spi(h) ? ' spi' : ''}" data-hra="${h.id}" style="--i:${i++}" aria-label="${esc(h.n)}, ${spi(h) ? 'spí, kým strom vädne' : `zamknutá, cena ${h.cena}, chýba ${h.cena - st.body}`}">
      <span class="zmk">${ikn(spi(h) ? 'mesiac' : 'zamok')}</span><span class="hr-obr">${OBR_HRY[h.id]}</span><b>${h.n}</b>
      <span class="pata">${spi(h) ? `<span class="pec" style="--pc:var(--link)">Spí</span><small>preber tému</small>` : `<span class="cena">${ikn('hviezda')}${h.cena}</span><small>chýba ${h.cena - st.body}</small>`}</span></button>`;
  const r0 = hore && rek(hore);
  return `<div class="ihrisko">
    <h1 class="hry-titul">Hry</h1>
    <p class="uvodka">Za body z tém sa odomykajú hry. Hraním sa body neminú.</p>
    ${hnStupen() ? `<p class="odkaz hn-info">${ikn('mesiac')}<span>${HN_TEXT[hnStupen()].n}. Kým nepreberieš tému, ${bodyUbudlo()} bodov spí. ${HN_TEXT[hnStupen()].p}</span></p>` : ''}
    ${hore ? `<button class="naposledy hra-karta" data-hra="${hore.id}" style="--c:${hore.c}" aria-label="Hrať ${esc(hore.n)}">
      <span class="zal" style="--c:var(--card)">${hore.id === st.hraPosledna ? 'Hrané naposledy' : r0 != null ? 'Tvoja hra' : 'Najnovšia hra'}</span>
      <span class="hr-obr">${OBR_HRY[hore.id]}</span>
      <span class="inf"><b>${hore.n}</b>${r0 != null ? `<span class="st">${ikn("pohar")}${rekordText(hore.id, r0).replace(" hneď správne", "").replace(" správne", "")}</span>` : '<span class="pec" style="--pc:var(--link)">Nová</span>'}</span>
      <span class="hraj-v">${ikn('hraj')}</span></button>` : ''}
    ${ok.length > 1 ? `<div class="dlazdice">${ok.filter(h => h !== hore).map(dlazdica).join('')}</div>` : ''}
    ${dalsia ? `<button class="karta dalsia-hra" data-hra="${dalsia.id}" aria-label="Ďalšia hra ${esc(dalsia.n)}, chýba ${dalsia.cena - st.body}"><span class="zal">Ďalšia hra</span>
      <span class="hr-obr">${OBR_HRY[dalsia.id]}</span>
      <span class="inf"><b>${dalsia.n}</b><span class="pruh"><i style="width:${Math.max(6, Math.min(100, Math.round(st.body / dalsia.cena * 100)))}%"></i></span><small>Chýba ${dalsia.cena - st.body} ${slovoBody(dalsia.cena - st.body)}</small></span>
      <span class="cena">${ikn('hviezda')}${dalsia.cena}</span></button>` : !zamk.length ? `<p class="odkaz vsetko">${ikn('koruna')}<span>Máš odomknuté všetky hry. Si majster ihriska!</span></p>` : ''}
    ${ostatne.length ? `<h2 class="n2 zamk-n">Ešte zamknuté</h2><div class="dlazdice zamk">${ostatne.map(zamknuta).join('')}</div>` : ''}
  </div>`;
}
