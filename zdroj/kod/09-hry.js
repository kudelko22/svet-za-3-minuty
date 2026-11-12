/* Hry: odomykajú sa za body z tém (hraním sa body neminú) */
const HRY = [
  { id: 'pexeso', n: 'Pexeso', p: 'Nájdi dvojice rovnakých obrázkov.', cena: 150, c: '#FFB3D1' },
  { id: 'pocitaj', n: 'Koľko ich je?', p: 'Spočítaj obrázky a ťukni na správne číslo. Bez časovača.', cena: 200, c: '#FFE27A', len: 'mladsi' },
  { id: 'iny', n: 'Ktorý je iný?', p: 'Štyri obrázky, jeden je iný. Nájdi ho! Bez čítania, bez časovača.', cena: 180, c: '#FFC9DE', len: 'mladsi' },
  { id: 'hadaj', n: 'Hádaj tému', p: 'Podľa obrázka uhádni, o ktorej téme je.', cena: 250, c: '#CDEBFF' },
  { id: 'tien', n: 'Nájdi tieň', p: 'Ktorý tieň patrí k obrázku? Bez čítania, bez časovača.', cena: 350, c: '#D9D2FF', len: 'mladsi' },
  { id: 'sova', n: 'Lietajúca sova', p: 'Ťukaj a sovička letí. Prelet pomedzi ceruzky a zbieraj hviezdy!', cena: 300, c: '#BFE7FF' },
  { id: 'hviezdy', n: 'Chytaj hviezdičky', p: 'Za 30 sekúnd chyť čo najviac hviezd. Pozor na búrku!', cena: 400, c: '#FFE27A' },
  { id: 'poradie', n: 'Zoraď čísla', p: 'Ťukaj čísla v správnom poradí, od najmenšieho alebo od najväčšieho.', cena: 450, c: '#C9F0D0' },
  { id: 'krtko', n: 'Ťukaj krtkov', p: 'Krtkovia vykúkajú z dier. Ťukni na nich skôr, než sa schovajú! Zlatý krtko je za tri.', cena: 500, c: '#FFD9B0' },
  { id: 'ine', n: 'Čo je iné?', p: 'Štyri obrázky: tri patria k sebe a jeden nie. Ťukni na ten, ktorý je iný!', cena: 600, c: '#FFD9A8' },
  { id: 'opakuj', n: 'Opakuj po mne', p: 'Zapamätaj si, ktoré farby zasvietili, a zopakuj ich.', cena: 550, c: '#FFD6A5' },
  { id: 'bubliny', n: 'Bubliny s počtami', p: 'Praskni bublinu so správnym výsledkom. Pozor, zlá bublina zoberie bod!', cena: 700, c: '#BDE9FF', len: 'starsi' },
  { id: 'slovo', n: 'Poskladaj slovo', p: 'Z písmen poskladaj slovo, ktoré patrí k obrázku.', cena: 650, c: '#BDE9FF', len: 'starsi' },
  { id: 'skladacka', n: 'Skladačka', p: 'Poprehadzovaný obrázok poskladaj späť.', cena: 900, c: '#9FE8DF' },
];
// hry podľa veku dieťaťa: ťažšie počtové hry nie sú pre malé deti, tie majú svoju ľahkú
const HRY_VID = () => HRY.filter(h => !h.len || h.len === (st.vek === 'starsi' ? 'starsi' : 'mladsi'));
const noveHry = (pred, po) => HRY_VID().filter(h => h.cena > pred && h.cena <= po);
const HVIEZDA = 'M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z';
const OBLAK = `<svg viewBox="0 0 48 42" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M12 28a8 8 0 0 1-1-15.9A11 11 0 0 1 32 9a8.5 8.5 0 0 1 5 16.3A6 6 0 0 1 35 28z" fill="#8C8FA8"/><path d="M24 26l-5 8h5l-3 7 9-11h-5l3-4z" fill="#FFD23F"/><circle cx="18" cy="19" r="1.6" fill="${INK}"/><circle cx="27" cy="19" r="1.6" fill="${INK}"/><path d="M19.5 24q3-2.5 6 0" fill="none"/></g></svg>`;
const OBR_HRY = {
  sova: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><rect x="3" y="3" width="74" height="58" rx="12" fill="#BFE7FF"/>
    <path d="M51 4 V16 H63 V4Z" fill="#4C7DFF"/><path d="M51 16 L57 26 L63 16Z" fill="#FFE3BD"/><path d="M51 60 V48 H63 V60Z" fill="#FF5A5F"/><path d="M51 48 L57 38 L63 48Z" fill="#FFE3BD"/>
    <path d="${HVIEZDA}" fill="#FFD23F" transform="translate(50.5 25.5) scale(.55)" stroke-width="3.5"/></g>${owl('cheer').replace('<svg ', '<svg x="9" y="14" width="32" height="35" ')}</svg>`,
  pocitaj: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#FFF3B0"/><path d="${HVIEZDA}" fill="#FFD23F" transform="translate(8 8) scale(1.3)" stroke-width="2.5"/><path d="${HVIEZDA}" fill="#FF9F1C" transform="translate(40 10) scale(1.3)" stroke-width="2.5"/><path d="${HVIEZDA}" fill="#FF6FA8" transform="translate(24 32) scale(1.3)" stroke-width="2.5"/></g></svg>`,
  pexeso: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="8" y="10" width="30" height="42" rx="7" fill="#B36BFF" transform="rotate(-10 23 31)"/><path d="M18 26a5 5 0 1 1 7 4.6c-1.4.7-2 1.6-2 3.4" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" transform="rotate(-10 23 31)"/><circle cx="24" cy="40" r="2" fill="#fff" stroke="none" transform="rotate(-10 23 31)"/><rect x="42" y="12" width="30" height="42" rx="7" fill="#fff" transform="rotate(8 57 33)"/><path d="${HVIEZDA}" fill="#FFD23F" transform="translate(44 18) scale(1.1) rotate(8 12 12)"/></g></svg>`,
  hviezdy: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#2E3A87"/><path d="${HVIEZDA}" fill="#FFD23F" transform="translate(10 10) scale(1.3)"/><path d="${HVIEZDA}" fill="#FF9F1C" transform="translate(44 28) scale(1.1)"/><path d="${HVIEZDA}" fill="#FFD23F" transform="translate(50 6) scale(.8)"/><circle cx="16" cy="48" r="2" fill="#fff" stroke="none"/><circle cx="36" cy="16" r="1.5" fill="#fff" stroke="none"/></g></svg>`,
  hadaj: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="6" y="8" width="52" height="40" rx="6" fill="#fff"/><path d="M8 44 L22 30 L34 40 L42 34 L56 44Z" fill="#4CD07D"/><circle cx="44" cy="20" r="5" fill="#FFD23F"/><circle cx="55" cy="42" r="12" fill="#fff" fill-opacity=".55"/><path d="M64 51l9 9" stroke-width="6" stroke-linecap="round"/></g></svg>`,
  bubliny: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3"><circle cx="24" cy="38" r="16" fill="#9FE8FF"/><circle cx="52" cy="24" r="18" fill="#C8F1FF"/><circle cx="64" cy="52" r="8" fill="#9FE8FF"/></g><text x="24" y="45" font-size="19" ${TXT} fill="${INK}">7</text><text x="52" y="31" font-size="20" ${TXT} fill="${INK}">5</text></svg>`,
  opakuj: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="14" y="6" width="24" height="24" rx="7" fill="#FF5A5F"/><rect x="42" y="6" width="24" height="24" rx="7" fill="#4C7DFF" opacity=".55"/><rect x="14" y="34" width="24" height="24" rx="7" fill="#2FBF71" opacity=".55"/><rect x="42" y="34" width="24" height="24" rx="7" fill="#FFD23F"/></g><path d="M8 4l4 4M72 4l-4 4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></svg>`,
  ine: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#FFE9C7"/><g transform="translate(8 8) scale(.52)" stroke-width="5">${INE_OBR['pes']()}</g><g transform="translate(40 8) scale(.52)" stroke-width="5">${INE_OBR['mačka']()}</g><g transform="translate(8 34) scale(.52)" stroke-width="5">${INE_OBR['kôň']()}</g><g transform="translate(40 34) scale(.52)" stroke-width="5">${INE_OBR['jablko']()}</g></g></svg>`,
  iny: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#FFE0EC"/><circle cx="22" cy="21" r="10" fill="#4C7DFF"/><circle cx="58" cy="21" r="10" fill="#4C7DFF"/><circle cx="22" cy="46" r="10" fill="#4C7DFF"/><rect x="48" y="36" width="20" height="20" rx="4" fill="#FF5A5F"/></g></svg>`,
  tien: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#E7E2FF"/><path d="${HVIEZDA}" fill="#FFD23F" transform="translate(8 8) scale(1.7)"/><path d="${HVIEZDA}" fill="#2E2A4A" transform="translate(40 30) scale(1.5)"/></g></svg>`,
  poradie: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#DDF7E1"/><circle cx="19" cy="38" r="11" fill="#FFD23F"/><circle cx="40" cy="30" r="11" fill="#FF9F1C"/><circle cx="61" cy="22" r="11" fill="#FF5A5F"/></g><text x="19" y="44" font-size="15" ${TXT} fill="${INK}">1</text><text x="40" y="36" font-size="15" ${TXT} fill="${INK}">2</text><text x="61" y="28" font-size="15" ${TXT} fill="${INK}">3</text></svg>`,
  krtko: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#BFEFA8"/><ellipse cx="40" cy="50" rx="24" ry="8" fill="#6B4423"/><path d="M22 50 C20 30 28 16 40 16 C52 16 60 30 58 50Z" fill="#9A6B43"/><ellipse cx="40" cy="38" rx="10" ry="8" fill="#C99A6B" stroke="none"/><circle cx="33" cy="30" r="2.6" fill="${INK}" stroke="none"/><circle cx="47" cy="30" r="2.6" fill="${INK}" stroke="none"/><ellipse cx="40" cy="36" rx="4.6" ry="3.4" fill="#FF8FB1"/><path d="M12 52 Q40 66 68 52 L68 58 Q40 64 12 58Z" fill="#8B5A2B"/></g></svg>`,
  slovo: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="4" y="4" width="72" height="56" rx="12" fill="#D7F1FF"/><rect x="9" y="19" width="19" height="26" rx="5" fill="#fff"/><rect x="30" y="19" width="19" height="26" rx="5" fill="#fff"/><rect x="51" y="19" width="19" height="26" rx="5" fill="#fff"/></g><text x="18.5" y="40" font-size="19" ${TXT} fill="${INK}">M</text><text x="39.5" y="40" font-size="19" ${TXT} fill="${INK}">A</text><text x="60.5" y="40" font-size="19" ${TXT} fill="${INK}">P</text></svg>`,
  skladacka: `<svg viewBox="0 0 80 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round"><rect x="10" y="8" width="26" height="22" rx="5" fill="#4C7DFF"/><rect x="40" y="8" width="26" height="22" rx="5" fill="#2FBF71"/><rect x="10" y="34" width="26" height="22" rx="5" fill="#FF9F1C"/><rect x="46" y="38" width="26" height="22" rx="5" fill="#FF5A5F" transform="rotate(14 59 49)"/><path d="M58 31l3 6" stroke-dasharray="2 3"/></g></svg>`,
};
const KRT_OBR = `<svg class="krt-h" viewBox="0 0 60 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M6 64 C4 36 16 10 30 10 C44 10 56 36 54 64Z" fill="#9A6B43"/><ellipse cx="30" cy="40" rx="15" ry="13" fill="#C99A6B" stroke="none"/><circle cx="21" cy="31" r="3.6" fill="${INK}" stroke="none"/><circle cx="39" cy="31" r="3.6" fill="${INK}" stroke="none"/><circle cx="22" cy="29.8" r="1.2" fill="#fff" stroke="none"/><circle cx="40" cy="29.8" r="1.2" fill="#fff" stroke="none"/><ellipse cx="30" cy="39" rx="6.5" ry="4.6" fill="#FF8FB1"/><path d="M30 43.5 V47 M25 48 Q30 52 35 48" fill="none"/><path d="M13 38 L5 36 M13 43 L5 45 M47 38 L55 36 M47 43 L55 45" fill="none" stroke-width="2.2"/></g></svg>`;
const KRT_ZLATY = `<svg class="krt-z" viewBox="0 0 60 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M6 64 C4 36 16 10 30 10 C44 10 56 36 54 64Z" fill="#FFD23F"/><ellipse cx="30" cy="40" rx="15" ry="13" fill="#FFF0A8" stroke="none"/><path d="${HVIEZDA}" fill="#FF9F1C" transform="translate(20 -5) scale(.85)" stroke-width="2.6"/><circle cx="21" cy="31" r="3.6" fill="${INK}" stroke="none"/><circle cx="39" cy="31" r="3.6" fill="${INK}" stroke="none"/><circle cx="22" cy="29.8" r="1.2" fill="#fff" stroke="none"/><circle cx="40" cy="29.8" r="1.2" fill="#fff" stroke="none"/><ellipse cx="30" cy="39" rx="6.5" ry="4.6" fill="#FF8FB1"/><path d="M30 43.5 V47 M25 48 Q30 52 35 48" fill="none"/></g></svg>`;
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
const stavHry = h => h.id === 'sova' ? `Body: ${h.skore}` : h.id === 'opakuj' ? `Farieb: ${h.seq.length}` : h.id === 'hviezdy' ? `Hviezdy: ${h.skore} · ${h.zostava} s` : h.id === 'krtko' ? `Body: ${h.skore} · ${h.zostava} s` : h.id === 'bubliny' ? `✓ ${h.skore} · ${h.zostava} s` : h.id === 'pocitaj' ? `✓ ${h.spravne} z 5` : h.kv ? `✓ ${h.spravne} z ${h.kola.length}` : h.id === 'hadaj' ? `✓ ${h.spravne} z ${h.kola.length}` : `${h.tahy} ${slovoTahy(h.tahy)}`;
const obnovStavHry = () => { const el = document.getElementById('hra-stav'); if (el && st.hra) el.textContent = stavHry(st.hra); };

// Lietajúca sova: svet hry (obloha, ceruzky, hviezdy) a jeden krok fyziky; kreslenie je v Hra.sovaKresli
const SOVA_IMG = (() => {
  const o = {}; if (typeof Image === 'undefined') return o;
  for (const [k, m] of [['hore', 'cheer'], ['dole', 'happy']]) { o[k] = new Image(); o[k].src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(owl(m).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')); }
  return o;
})();
// bitmapa nakreslená raz a potom už len kopírovaná do hry (kluc null = jednorazová, bez pamäte)
const sovaSprite = (() => {
  const pamat = {};
  return (kluc, w, v, dpr, kresli) => {
    const k = kluc && kluc + '@' + dpr;
    if (k && pamat[k]) return pamat[k];
    const cv = document.createElement('canvas'), g = cv.getContext && cv.getContext('2d');
    if (!g) return null;
    cv.width = Math.ceil(w * dpr); cv.height = Math.ceil(v * dpr); g.scale(dpr, dpr);
    if (kresli(g) === false) return null;
    if (k) pamat[k] = cv;
    return cv;
  };
})();
const CERUZKY = ['#FF5A5F', '#4C7DFF', '#2FBF71', '#FFD23F', '#B36BFF', '#FF9F1C'];
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
      for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; h.iskry.push({ x: z.x, y: z.y, vx: Math.cos(a) * 140, vy: Math.sin(a) * 140, ziv: .6, c: i % 2 ? '#FFD23F' : '#fff' }); }
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
  g.strokeStyle = INK; g.lineJoin = 'round'; g.lineWidth = 3;
  g.fillStyle = CERUZKY[f]; g.fillRect(x, y0, w, dl); g.strokeRect(x, y0, w, dl);
  g.fillStyle = 'rgb(255 255 255 / .35)'; g.fillRect(x + w * .2, y0, w * .16, dl);
  g.fillStyle = 'rgb(0 0 0 / .1)'; g.fillRect(x + w * .68, y0, w * .16, dl);
  g.fillStyle = '#FFE3BD'; g.beginPath(); g.moveTo(x, koniec); g.lineTo(x + w, koniec); g.lineTo(x + w / 2, spicka); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = CERUZKY[f]; g.beginPath(); g.moveTo(x + w * .37, spicka + smer * HROT * .26); g.lineTo(x + w * .63, spicka + smer * HROT * .26); g.lineTo(x + w / 2, spicka); g.closePath(); g.fill(); g.stroke();
}
const Hra = {
  start(id) {
    const info = HRY.find(x => x.id === id);
    if (!info) return;
    if (bodyHry() < info.cena) { toast(st.body >= info.cena ? `${info.n} si chvíľu oddychuje, kým strom vädne. Preber tému a hneď sa odomkne!` : `${info.n} sa odomkne pri ${info.cena} bodoch. Chýba ešte ${info.cena - st.body} bodov.`); Zvuk.play('boing'); return; }
    this.zrus(); Hlas.stop();
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
  zrus() { const h = st.hra; if (h) { h.beh = false; clearInterval(h.casovac); if (h.id !== 'sova') clearTimeout(h.dalsia); if (h.hore) Object.values(h.hore).forEach(k => clearTimeout(k.to)); } st.hra = null; },
  koniec(menejJeLepsie, hodnota) {
    const h = st.hra; h.beh = false; const kl = rekordKluc(h.id), stary = S.get(kl, null);
    const lepsi = stary == null || (menejJeLepsie ? hodnota < stary : hodnota > stary);
    if (lepsi && hodnota > 0) S.set(kl, hodnota);
    S.set('hry-pocet-' + st.dietaId, S.get('hry-pocet-' + st.dietaId, 0) + 1);
    const odznaky = noveOdznaky('', { hra: h.id, hodnota, pary: h.karty ? h.karty.length / 2 : 0, dieliky: h.p ? h.p.length : 0 });
    h.hotovo = { hodnota, novy: lepsi && stary != null, prvy: stary == null && hodnota > 0, stary, odznaky };
    Zvuk.play('win'); FX.ohnostroj(3); vibruj([40, 60, 40]);
    if (h.id === 'skladacka') obnovSklad();
    const el = main.querySelector('.hra');
    if (!el) return;
    el.insertAdjacentHTML('beforeend', vysledokHry(h));
    const v = el.lastElementChild; if (v) setTimeout(() => v.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 400);
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
    else if (u === 'naraz') { Zvuk.play('bad'); vibruj(80); }
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
    const obloha = sovaSprite('obloha' + W + 'x' + H, W, H, dpr, c => {
      const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#8FD3FF'); gr.addColorStop(1, '#E8F7FF');
      c.fillStyle = gr; c.fillRect(0, 0, W, H);
      c.strokeStyle = INK; c.lineWidth = 3; c.fillStyle = '#FFD23F'; c.beginPath(); c.arc(W - 46, 48, 24, 0, 7); c.fill(); c.stroke();
    });
    if (obloha) g.drawImage(obloha, 0, 0, W, H);
    // oblaky (pomaly sa posúvajú)
    const oblak = sovaSprite('oblak', 84, 56, dpr, c => {
      const kruhy = [[21, 34, 18], [41, 26, 22], [63, 34, 17]];
      c.strokeStyle = INK; c.fillStyle = '#fff'; c.lineWidth = 6;
      kruhy.forEach(([a, b, rr]) => { c.beginPath(); c.arc(a, b, rr, 0, 7); c.stroke(); });
      kruhy.forEach(([a, b, rr]) => { c.beginPath(); c.arc(a, b, rr, 0, 7); c.fill(); });
    });
    for (let i = 0; i < 3 && oblak; i++) g.drawImage(oblak, ((i * 190 + 80 - pos * .2) % (W + 160) + W + 160) % (W + 160) - 80 - 21, 70 + i * 52 - 34, 84, 56);
    // kopce v diaľke: pás nakreslený raz a len posúvaný (vlna sa opakuje po 2π·64 bodoch)
    const P = Math.PI * 128, kh = zem - 58, ks = Math.ceil(W + P) + 2;
    const kopce = sovaSprite('kopce' + W + 'x' + H, ks, H - kh, dpr, c => {
      c.strokeStyle = INK; c.lineJoin = 'round'; c.fillStyle = '#B9EBC0'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, H - kh);
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
      c.translate(19, 19); c.fillStyle = 'rgb(255 255 255 / .55)'; c.beginPath(); c.arc(0, 0, 18, 0, 7); c.fill();
      c.strokeStyle = INK; c.lineJoin = 'round'; c.fillStyle = '#FFD23F'; c.lineWidth = 2.5; c.beginPath();
      for (let k = 0; k < 10; k++) { const rr = k % 2 ? 5.5 : 13, a = -Math.PI / 2 + k * Math.PI / 5; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      c.closePath(); c.fill(); c.stroke();
    });
    if (hv) (h.hviezdy || []).forEach(z => {
      g.save(); g.translate(z.x, z.y + Math.sin(cas * 4 + z.x / 40) * 3); g.rotate(Math.sin(cas * 3 + z.x) * .25); g.drawImage(hv, -19, -19, 38, 38); g.restore();
    });
    // iskry po chytenej hviezde
    (h.iskry || []).forEach(q => { g.globalAlpha = Math.max(0, q.ziv / .6); g.fillStyle = q.c; g.beginPath(); g.arc(q.x, q.y, 4, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    // zem s trávou: pás o jeden trs širší, posúvaný (trsy sa opakujú po 30 bodoch)
    const zemObr = sovaSprite('zem' + W + 'x' + H, W + 30, H - zem + 2, dpr, c => {
      c.fillStyle = '#7ED957'; c.fillRect(0, 2, W + 30, H - zem); c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 2); c.lineTo(W + 30, 2); c.stroke();
      c.fillStyle = '#5BB85B'; c.beginPath(); for (let x = 0; x < W + 30; x += 30) { c.moveTo(x, 10); c.lineTo(x + 6, 20); c.lineTo(x + 12, 10); } c.fill();
    });
    if (zemObr) g.drawImage(zemObr, -((pos % 30) + 30) % 30, zem - 2, W + 30, H - zem + 2);
    // sovička
    const y = h.y != null ? h.y : H * .42, x = h.x != null ? h.x : W * .28, uhol = Math.max(-.45, Math.min(.8, (h.vy || 0) / 700));
    g.save(); g.translate(x, y + (h.beh || h.hotovo || h.zivoty < (h.mal ? 3 : 2) ? 0 : Math.sin(performance.now() / 300) * 4)); g.rotate(uhol);
    if (h.neznic && Math.floor(cas * 10) % 2) g.globalAlpha = .35;
    const kk = h.mava > 0 || !h.beh ? 'hore' : 'dole';
    const sova = sovaSprite('sova-' + kk, 48, 53, dpr, c => { const img = SOVA_IMG[kk]; if (!img || !img.complete || !img.naturalWidth) return false; c.drawImage(img, 0, 0, 48, 53); });
    if (sova) g.drawImage(sova, -24, -27, 48, 53);
    else { g.fillStyle = '#9B6BFF'; g.beginPath(); g.arc(0, 0, 18, 0, 7); g.fill(); g.stroke(); }
    g.restore(); g.globalAlpha = 1;
    // srdiečka a body
    for (let i = 0; i < (h.mal ? 3 : 2); i++) {
      const plne = i < h.zivoty, s = sovaSprite('srdce' + (plne ? 1 : 0), 27, 27, dpr, c => {
        c.scale(.55, .55); c.lineWidth = 5; c.strokeStyle = INK; c.lineJoin = 'round'; c.fillStyle = plne ? '#FF5A5F' : '#fff';
        c.beginPath(); c.moveTo(24, 42); c.bezierCurveTo(10, 33, 5, 25, 5, 17); c.bezierCurveTo(5, 11, 10, 7, 15, 7); c.bezierCurveTo(19, 7, 22, 9, 24, 13);
        c.bezierCurveTo(26, 9, 29, 7, 33, 7); c.bezierCurveTo(38, 7, 43, 11, 43, 17); c.bezierCurveTo(43, 25, 38, 33, 24, 42); c.closePath(); c.fill(); c.stroke();
      });
      if (s) g.drawImage(s, 14 + i * 30, 12, 27, 27);
    }
    if (h.beh || h.hotovo) {
      if (!h.skoreObr || h.skoreObr.n !== h.skore) {
        const n = String(h.skore);
        h.skoreObr = { n: h.skore, c: sovaSprite(null, 140, 64, dpr, c => {
          c.font = '700 40px "Baloo 2", Nunito, sans-serif'; c.textAlign = 'center'; c.lineWidth = 7; c.lineJoin = 'round'; c.strokeStyle = INK;
          c.strokeText(n, 70, 50); c.fillStyle = '#fff'; c.fillText(n, 70, 50);
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
      Zvuk.play('ok'); Haptika.hraj('spravne'); const [x, y] = stred(b); FX.burst(x, y, 16, ['star', 'dot'], 6);
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
    el.innerHTML = typ === 'burka' ? OBLAK : STAR(typ === 'velka' ? '#FF9F1C' : '#FFD23F');
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
    if (body > 0) { Zvuk.play(body > 1 ? 'star' : 'coin'); FX.burst(x, y, body > 1 ? 18 : 8, ['star', 'dot'], 5); }
    else { Zvuk.play('bad'); vibruj(80); }
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
    Zvuk.play(k.zlaty ? 'star' : 'coin'); Haptika.hraj(k.zlaty ? 'hviezdicka' : 'tuk');
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
    if (n !== h.kola[h.i]) { h.chyba = true; h.zle.push(n); Zvuk.play('bad'); vibruj(60); obnovPocitaj(); return; }
    if (!h.chyba) h.spravne++;
    h.odp = n; Zvuk.play('ok'); obnovStavHry(); obnovPocitaj();
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
    if (ok) { h.spravne++; Zvuk.play('ok'); Haptika.hraj('spravne'); } else { Zvuk.play('bad'); vibruj(60); }
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
      h.chyba = true; Zvuk.play('bad'); vibruj(60);
      if (k.sloty) { const el = main.querySelector(`[data-kv="${j}"]`); if (el) { el.classList.add('zle'); setTimeout(() => el.classList.remove('zle'), 450); } }
      else { h.zle.push(j); obnovKv(); }
      return;
    }
    h.vzate.push(j); h.krok++;
    if (h.krok < k.sprav.length) { Zvuk.play('pop'); obnovKv(); return; }
    if (!h.chyba) h.spravne++;
    h.odp = true; Zvuk.play('ok'); if (!h.chyba) Haptika.hraj('spravne'); obnovStavHry(); obnovKv();
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
      h.skore = Math.max(0, h.skore - 1); obnovStavHry(); Zvuk.play('bad'); vibruj(60);
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
      h.faza = 'koniec'; Zvuk.play('bad'); vibruj(120); simonStav('Ups, to nebola tá farba.');
      h.dalsia = setTimeout(() => { if (st.hra === h) this.koniec(false, h.seq.length - 1); }, 800);
      return;
    }
    h.krok++;
    if (h.krok === h.seq.length) {
      h.faza = 'cakaj'; simonStav('Výborne!');
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
      Zvuk.play(h.p[a] === a || h.p[poz] === poz ? 'ok' : 'whoosh');
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
const POC_OBR = [() => STAR('#FFD23F'), () => IK.srdce, () => IK.ohen, () => IK.diamant];
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
const KV_FARBY = ['#FF5A5F', '#4C7DFF', '#2FBF71', '#FFD23F', '#B36BFF', '#FF9F1C'];
const nahodne = n => Math.floor(Math.random() * n);
const TVARY = [
  '<circle cx="24" cy="24" r="18"/>', '<rect x="7" y="7" width="34" height="34" rx="6"/>', '<path d="M24 6 L43 40 H5Z"/>',
  `<path d="${HVIEZDA}" transform="scale(2)"/>`, `<path d="${SRDCE_D}"/>`, '<path d="M24 4 L43 24 L24 44 L5 24Z"/>',
];
const tvar = (t, f) => `<span class="kv-it"><svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" fill="${f}">${TVARY[t]}</g></svg></span>`;
const KV_SIL = [() => STAR('#FFD23F'), () => IK.srdce, () => IK.ohen, () => IK.diamant, () => IK.blesk, () => IK.kocka, () => IK.pohar, () => IK.mozog];
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
function vysledokHry(h) {
  const v = h.hotovo, t = h.id === 'skladacka' ? byId(h.t) : null;
  const nadpis = `${['hviezdy', 'bubliny', 'opakuj', 'sova', 'pocitaj', 'iny', 'tien', 'poradie', 'krtko', 'slovo', 'ine'].includes(h.id) ? 'Super!' : 'Hotovo!'} ${rekordText(h.id, v.hodnota)}`;
  return `<div class="card hra-vysledok"><div class="win-owl">${owl('cheer')}</div>
    <h2 class="h2" style="--hc:#FFC233">${nadpis}</h2>
    ${t ? `<p class="muted">Na obrázku je téma „${esc(t.t)}“.</p>` : ''}
    ${odmenyHtml({ noveOdznaky: v.odznaky || [] })}
    ${v.novy ? `<span class="chip tmavy" style="--c:#FFD23F">${ii(IK.pohar)} Nový rekord!</span>` : v.prvy ? `<span class="chip tmavy" style="--c:#FFD23F">${ii(IK.pohar)} Prvý rekord</span>` : v.stary != null ? `<p class="muted">Rekord: ${rekordText(h.id, v.stary)}</p>` : ''}
    <div class="tests"><button class="btn blue" data-hra="${h.id}">Hrať znova</button><button class="btn ghost" data-hra-spat>Iná hra</button></div></div>`;
}
function renderHra() {
  const h = st.hra, info = HRY.find(x => x.id === h.id);
  document.body.classList.remove('tinted');
  let telo;
  if (h.id === 'pexeso') {
    telo = `<div class="pexeso" style="--st:${h.karty.length > 12 ? 4 : 3}">${h.karty.map((tid, i) => `<button class="pex${h.najdene.includes(tid) ? ' otocena najdena' : h.otocene.includes(i) ? ' otocena' : ''}" data-pex="${i}" aria-label="Karta ${i + 1}"><span class="pex-in"><span class="pex-rub">${STAR('#fff')}</span><span class="pex-lic">${svg(byId(tid))}</span></span></button>`).join('')}</div>`;
  } else if (h.id === 'hviezdy') {
    telo = `<div class="nebo" id="nebo">${h.beh || h.hotovo ? '' : `<button class="hv-start" data-hv-start>${IKO.play}<span>Štart</span></button>`}</div>
      <p class="muted hra-pomoc">${STAR()} +1 &nbsp; ${STAR('#FF9F1C')} +3 &nbsp; búrka −2</p>`;
  } else if (h.id === 'sova') {
    telo = `<div class="sova-hra"><canvas id="sova-cv" class="sova-cv" aria-label="Obloha: ťukni a sovička mávne krídlami"></canvas>${h.beh || h.hotovo ? '' : `<button class="hv-start" data-hv-start>${IKO.play}<span>Štart</span></button>`}</div>
      <p class="muted hra-pomoc">Ťukaj na oblohu a sovička mávne krídlami. Prelet pomedzi ceruzky a zbieraj hviezdy. Máš ${h.mal ? 3 : 2} srdiečka.</p>`;
  } else if (h.id === 'krtko') {
    telo = `<div class="luka" id="luka">${Array.from({ length: 9 }, (_, i) => `<button class="diera" data-krt="${i}" aria-label="Diera ${i + 1}"><span class="diera-v"></span><span class="krt">${KRT_OBR}${KRT_ZLATY}</span><span class="diera-p"></span></button>`).join('')}${h.beh || h.hotovo ? '' : `<button class="hv-start" data-hv-start>${IKO.play}<span>Štart</span></button>`}</div>
      <p class="muted hra-pomoc">Ťukaj na krtkov, ktorí vykúkajú z dier. Zlatý krtko je za 3 body. Máš 30 sekúnd.</p>`;
  } else if (h.id === 'pocitaj') {
    telo = `<div id="pocitaj" class="pocitaj" data-kolo="${h.i}">${pocitajHtml(h)}</div>`;
  } else if (h.kv) {
    telo = `<div id="kv" class="kv" data-kolo="${h.i}">${kvHtml(h)}</div>`;
  } else if (h.id === 'hadaj') {
    telo = `<div id="hadaj" class="hadaj" data-kolo="${h.i}">${hadajHtml(h)}</div>`;
  } else if (h.id === 'bubliny') {
    telo = `<div class="card priklad" id="priklad">${h.beh ? h.priklad + ' = ?' : h.hotovo ? 'Čas vypršal!' : 'Koľko je…?'}</div>
      <div class="bub-pole${h.mal ? '' : ' styri'}" id="bubliny">${h.beh || h.hotovo ? '' : `<button class="hv-start" data-hv-start>${IKO.play}<span>Štart</span></button>`}</div>
      <p class="muted hra-pomoc">Praskni bublinu so správnym výsledkom. Zlá bublina zoberie bod. Máš na to minútu.</p>`;
  } else if (h.id === 'opakuj') {
    telo = `<p class="simon-stav" id="simon-stav">${h.beh ? '' : 'Ťukni na Štart'}</p>
      <div class="simon">${['#FF5A5F', '#4C7DFF', '#2FBF71', '#FFD23F'].map((c, i) => `<button class="pad" data-pad="${i}" style="--c:${c}" aria-label="Farba ${i + 1}"><svg viewBox="-20 -20 40 40" aria-hidden="true"><g stroke="${INK}">${face(0, 0, 1.1)}</g></svg></button>`).join('')}
      ${h.beh || h.hotovo ? '' : `<button class="hv-start" data-hv-start>${IKO.play}<span>Štart</span></button>`}</div>
      <p class="muted hra-pomoc">Pozeraj, ktoré farby zasvietia, a potom ich ťukni v rovnakom poradí.</p>`;
  } else {
    telo = `<div class="sklad${h.hotovo ? ' hotova' : ''}" id="sklad" style="--sl:${h.sl};--ri:${h.ri}">${skladHtml(h)}</div>
      <p class="muted hra-pomoc">Ťukni na dva dieliky a vymenia sa. Zelený rámik = dielik je na správnom mieste.</p>`;
  }
  main.classList.add('anim');
  main.innerHTML = `<div class="hra">
    <div class="hra-top"><button class="ib" data-hra-spat aria-label="Späť na hry">${IKO.zavriet}</button><b class="hra-nazov">${info.n}</b><span class="chip" id="hra-stav" style="--c:${info.c}">${stavHry(h)}</span></div>
    ${telo}${h.hotovo ? vysledokHry(h) : ''}</div>`;
  ocisluj();
  if (h.id === 'sova') requestAnimationFrame(() => Hra.sovaKresli(h));
}

