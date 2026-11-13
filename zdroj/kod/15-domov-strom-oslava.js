/* Veľká oslava pri prvej téme alebo kvíze dňa (séria sa predĺži): vyrastie strom múdrosti, za každý deň série pribudne plod a priletí sovička */
const slovoPlody = n => n === 1 ? 'plod' : n >= 2 && n <= 4 ? 'plody' : 'plodov';
/* Strom múdrosti (verzia 2.8): rastie s dňami učenia v 6 stupňoch, plody na ňom sú dni série */
const STROM_STUPNE = [
  { od: 0, n: 'Semienko', m: 1, plody: 0 },
  { od: 1, n: 'Stromček', m: .66, plody: 3 },
  { od: 3, n: 'Mladý strom', m: .82, plody: 6 },
  { od: 7, n: 'Veľký strom', m: 1, plody: 12 },
  { od: 14, n: 'Kvitnúci strom', m: 1.04, plody: 14, kvety: true },
  { od: 30, n: 'Zlatý strom múdrosti', m: 1.08, plody: 16, kvety: true, zlaty: true },
];
const stromStupen = (pocet = st.dni.length) => STROM_STUPNE.reduce((a, x, i) => pocet >= x.od ? i : a, 0);
/* Vädnutie stromu (jemné): prvý vynechaný deň sa nič nedeje; po dvoch vynechaných dňoch strom pomaly vädne, hviezdičky na odomykanie hier ubúdajú
   (najviac o 40 %) a najdrahšie hry sa dočasne zamknú. Nič sa nestráca natrvalo: po prvej téme sa všetko hneď vráti. Rodič to môže vypnúť. */
// ak je profil rodiča, prepínač je v cloude (platí na všetkých zariadeniach); kým tam nie je, berie sa lokálny
const hnitieZapnute = (id = st.dietaId) => {
  const p = window.Cloud && window.Cloud.rodic && window.Cloud.rodic.profil, h = p && p.nastavenia && p.nastavenia.hnitie;
  if (h && id in h) return h[id] !== false;
  return S.get('hnitie-' + (id || 'x'), true) !== false;
};
const dniOdPoslednej = () => { if (!st.dni.length) return 0; const [y, m, d] = [...st.dni].sort().pop().split('-').map(Number), n = new Date(); return Math.max(0, Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(y, m - 1, d)) / 864e5)); };
const hnitieDni = () => hnitieZapnute() ? Math.max(0, dniOdPoslednej() - 2) : 0;
const hnStupen = () => { const n = hnitieDni(); return n >= 6 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0; };
const bodyUbudlo = () => { const n = hnitieDni(); return n ? Math.min(Math.floor(st.body * .4), n * Math.max(3, Math.ceil(st.body * .02))) : 0; };
const bodyHry = () => st.body - bodyUbudlo();
let hnPredDnes = 0; // v akom stave strom bol tesne pred dnešnou prvou témou (pre oslavu „Strom ožil“)
const HN_TEXT = [null,
  { n: 'Strom je trochu smädný', p: 'Listy žltnú. Preber tému a strom sa hneď zazelená!' },
  { n: 'Strom vädne', p: 'Pár hviezdičiek sa uspalo a najdrahšie hry spia. Jedna téma ich zobudí.' },
  { n: 'Strom je hnedý a unavený', p: 'Nič sa nestratilo! Jedna téma a strom ožije, hviezdičky sa vrátia a hry sa odomknú.' }];
const KORUNA = [[160, 112, 50, '#4CD07D'], [112, 128, 34, '#3DBB6A'], [208, 126, 36, '#3DBB6A'], [130, 84, 34, '#5FDB8A'], [190, 82, 34, '#5FDB8A'], [160, 62, 30, '#6BE39A']];
const KORUNA_VIAC = [[98, 106, 28, '#3DBB6A'], [222, 104, 28, '#3DBB6A'], [160, 36, 24, '#7BE8A6']];
const PLODY = [[150, 92], [186, 104], [124, 118], [168, 128], [204, 130], [140, 68], [194, 74], [112, 96], [158, 106], [218, 104], [132, 142], [182, 148], [100, 112], [222, 116], [160, 42], [146, 144]];
const KVETY = [[132, 64], [184, 58], [108, 120], [214, 118], [160, 86], [198, 136], [122, 146], [160, 30], [94, 98], [228, 96]];
const plod = (i, hn = 0) => `<circle r="10" fill="${hn >= 2 ? ['#8B5A2B', '#7A5530', '#6E4A28'][i % 3] : ['#FF5A5F', '#FFD23F', '#FF9F1C', '#FF6FA8', '#B36BFF'][i % 5]}" stroke-width="3"/><path d="M0 -10 C1 -14 4 -16 7 -16 C6 -12 3 -10 0 -10Z" fill="#2FBF71" stroke-width="2"/><path d="M-5.5 -2 A6 6 0 0 1 -2 -6" fill="none" stroke="#fff" stroke-width="2.4"/>`;
/* 5.0: nová kresba stromu. Koruna je jedna silueta s obrysom a tromi tónmi vnútri, na kmeni Múdrina koralová šatka (od Mladého stromu),
   od Veľkého stromu dutina. Plody v troch farbách palety, košík s visačkou „+N“. Vädnutie mení tóny koruny a pridáva opadané listy.
   Súradnice: stred kmeňa x 120, zem y 228. Triedy os-* nesú pohyb (rast, nafúknutie koruny zdola nahor, plody, kývanie). */
const ST_TON = { z: ['#8BDD90', 'var(--leaf)', 'var(--leaf-d)'], 1: ['#D9E480', '#B9D154', '#96B03C'], 2: ['#EDCE76', '#D8AE48', '#B4892B'], 3: ['#BFAD82', '#A38F62', '#83714B'], zl: ['#FFE48C', 'var(--sun)', 'var(--sun-d)'] };
const ST_KOR = {
  1: [[101, 158, 15, 2], [141, 156, 16, 1], [120, 138, 25, 0]],
  2: [[88, 133, 25, 2], [152, 131, 26, 2], [120, 110, 38, 1], [121, 82, 25, 0]],
  3: [[72, 121, 31, 2], [168, 119, 32, 2], [120, 99, 48, 1], [90, 71, 31, 1], [150, 69, 31, 0], [120, 47, 27, 0]],
};
const ST_PLD = {
  1: [[120, 136], [101, 158], [141, 156]],
  2: [[120, 114], [92, 133], [149, 129], [121, 80], [102, 98], [140, 96]],
  3: [[120, 108], [90, 126], [151, 124], [100, 78], [142, 74], [68, 110], [171, 106], [120, 50], [128, 134], [84, 96], [158, 94], [106, 132], [58, 130], [182, 128], [137, 52], [103, 52]],
};
const ST_KVT = [[62, 60], [178, 56], [42, 124], [200, 122], [120, 20], [96, 40], [146, 38], [22, 104], [218, 102]];
const ST_VELK = [1, .96, .93, 1, 1.05, 1.1];
const ST_VYSKA = [.3, .52, .7, .9, .95, 1]; // ako vysoko strom siaha (na plynulé vyrastenie z predošlého stupňa)
const stHviezda = (x, y, r, f) => `<path d="M${x} ${y - r}C${x} ${y - r * .3} ${x + r * .3} ${y} ${x + r} ${y}C${x + r * .3} ${y} ${x} ${y + r * .3} ${x} ${y + r}C${x} ${y + r * .3} ${x - r * .3} ${y} ${x - r} ${y}C${x - r * .3} ${y} ${x} ${y - r * .3} ${x} ${y - r}Z" fill="${f}" stroke-width="2.5"/>`;
// o: stupen, plody, kos, novy (index plodu, 'kos' alebo -1), z (veľkosť pred vyrastením), hn (vädnutie 0–3), sova, zem ('kopec' | 'tien' | false), t (časy)
function stromSvg(o) {
  const st0 = o.stupen, hn = o.hn || 0, zl = st0 === 5 && !hn, T = hn ? ST_TON[hn] : zl ? ST_TON.zl : ST_TON.z, m = ST_VELK[st0];
  const t = { kmen: .25, koruna: .6, krok: .08, plody: 1.2, novy: 2, sova: 2.4, rast: 3, ...(o.t || {}) }, d = x => ` style="--d:${x.toFixed(2)}s"`;
  const zem = o.zem === undefined ? 'kopec' : o.zem;
  let s = '';
  if (st0 === 0) {
    s = `<circle cx="120" cy="150" r="34" fill="none" stroke="var(--leaf-d)" stroke-width="3" stroke-dasharray=".1 9" opacity=".55"/>
      <path d="M84 229C90 210 150 210 156 229Z" fill="#A66A3F"/><path d="M100 222h8M129 220h10M114 225h6" fill="none" stroke="#7E4A2A" stroke-width="2.5"/>
      <g class="os-klicok"><path d="M120 214V190" fill="none" stroke-width="8"/><path d="M120 214V190" fill="none" stroke="var(--leaf-d)" stroke-width="3"/>
      <path d="M120 191c-1-8-7-12-15-11c1 8 7 12 15 11z" fill="var(--leaf)" stroke-width="2.5"/><path d="M120 189c0-7 5-11 12-10c0 7-5 11-12 10z" fill="#8BDD90" stroke-width="2.5"/></g>`;
  } else {
    let k = '';
    if (st0 === 1) k = `<path d="M120 226C117 206 123 186 120 158" fill="none" stroke-width="11"/><path d="M120 226C117 206 123 186 120 158" fill="none" stroke="#A66A3F" stroke-width="5.5"/>`;
    else if (st0 === 2) k = `<path d="M105 228C113 216 114 190 113 138H127C126 190 127 216 135 228C128 225 112 225 105 228Z" fill="#A66A3F"/><path d="M123 150c0 40 1 62 8 74" fill="none" stroke="#7E4A2A" stroke-width="3" opacity=".7"/>`;
    else k = `<path d="M92 229C105 218 108 196 106 140H134C132 196 135 218 148 229C138 224 130 224 120 228C110 224 102 224 92 229Z" fill="#A66A3F"/>
      <path d="M127 146c0 44 1 62 12 78c-7-2-11-2-16 0z" fill="#8A5530" stroke="none"/><path d="M110 168q3 7 0 15M131 200q-2 6 1 11" fill="none" stroke="#7E4A2A" stroke-width="2.5"/>
      <ellipse cx="119" cy="190" rx="8" ry="10.5" fill="#4E2C1C" stroke-width="2.5"/><path d="M114 186q5-6 10 0" fill="none" stroke="#7E4A2A" stroke-width="2"/>`;
    if (st0 >= 2) { const w = st0 === 2 ? 9 : 16, y = st0 === 2 ? 176 : 162; k += `<g fill="var(--coral)" stroke-width="2.5"><path d="M${120 + w - 4} ${y + 9}l9 15l-10-4zM${120 + w - 8} ${y + 10}l-2 16l-7-9z"/><path d="M${120 - w} ${y}C${120 - w / 2} ${y + 5} ${120 + w / 2} ${y + 5} ${120 + w} ${y}L${120 + w + 1} ${y + 9}C${120 + w / 2} ${y + 14} ${120 - w / 2} ${y + 14} ${120 - w - 1} ${y + 9}Z"/><circle cx="${120 + w - 5}" cy="${y + 9}" r="4.5"/></g>`; }
    // koruna: obláčiky sa nafúknu zdola nahor; najprv obrys celej siluety, potom plochy v troch tónoch, odlesky a jemné tiene
    const kruhy = (st0 >= 3 ? [...(st0 === 5 ? [[45, 108, 19, 2], [195, 106, 19, 2]] : []), ...ST_KOR[3], ...(st0 === 5 ? [[120, 24, 17, 0]] : [])] : ST_KOR[st0])
      .slice().sort((a, b) => b[1] - a[1]), dk = i => d(t.koruna + i * t.krok);
    let kr = kruhy.map(([x, y, r], i) => `<circle class="os-k"${dk(i)} cx="${x}" cy="${y}" r="${r}" fill="${T[1]}" stroke-width="6"/>`).join('');
    kr += kruhy.map(([x, y, r, c], i) => `<circle class="os-k"${dk(i)} cx="${x}" cy="${y}" r="${r}" fill="${T[c]}" stroke="none"/>`).join('');
    kr += kruhy.map(([x, y, r, c], i) => c < 2 ? `<path class="os-k"${dk(i)} d="M${(x - r * .62).toFixed(1)} ${(y - r * .16).toFixed(1)}q${(r * .1).toFixed(1)} ${(-r * .42).toFixed(1)} ${(r * .48).toFixed(1)} ${(-r * .56).toFixed(1)}" fill="none" stroke="#fff" stroke-width="3.2" opacity=".6"/>` : '').join('');
    kr += kruhy.map(([x, y, r], i) => r > 20 ? `<path class="os-k"${dk(i)} d="M${(x + r * .02).toFixed(1)} ${(y + r * .52).toFixed(1)}q${(r * .3).toFixed(1)} ${(r * .1).toFixed(1)} ${(r * .46).toFixed(1)} ${(-r * .22).toFixed(1)}" fill="none" stroke-width="2.4" opacity=".42"/>` : '').join('');
    const kEnd = t.koruna + kruhy.length * t.krok, kv = st0 === 4 ? 7 : st0 === 5 ? 4 : 0;
    if (kv && hn < 2) kr += ST_KVT.slice(0, kv).map(([x, y], i) => { let p = ''; for (let a = 0; a < 5; a++) { const u = a * 1.2566 - 1.57; p += `<circle cx="${(4.6 * Math.cos(u)).toFixed(1)}" cy="${(4.6 * Math.sin(u)).toFixed(1)}" r="3.6"/>`; }
      return `<g transform="translate(${x} ${y})"><g class="os-kvet"${d(kEnd + i * .06)} fill="${zl ? '#fff' : '#FFD9E0'}" stroke-width="1.8">${p}<circle r="2.8" fill="${zl ? 'var(--coral)' : 'var(--sun)'}"/></g></g>`; }).join('');
    const FC = zl ? ['var(--coral)', 'var(--violet)', 'var(--teal)'] : hn >= 2 ? ['#B4892B', '#A38F62', '#C29A57'] : ['var(--coral)', 'var(--sun)', 'var(--violet)'];
    const jeden = (i, f = FC[i % 3]) => `<circle r="8.5" fill="${f}" stroke-width="2.5"/><path d="M0 -8.5q1-5 6.5-5.5q0 5-6.5 5.5z" fill="${hn >= 2 ? '#96B03C' : 'var(--leaf-d)'}" stroke-width="2"/><path d="M-4.6 -1.2a5 5 0 0 1 3.2-3.5" fill="none" stroke="#fff" stroke-width="2"/>`;
    kr += ST_PLD[Math.min(st0, 3)].slice(0, o.plody || 0).map(([x, y], i) => i === o.novy
      ? `<g transform="translate(${x} ${y})"><circle class="os-kruh"${d(t.novy)} r="11" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray=".1 7"/><g class="os-novy"${d(t.novy)}><g class="os-hoj"${d(t.novy + 1)}>${jeden(i)}</g></g></g>`
      : `<g transform="translate(${x} ${y})"><g class="os-plod"${d(t.plody + i * .07)}><g class="os-hoj"${d(t.plody + i * .07 + .6)}>${jeden(i)}</g></g></g>`).join('');
    if (zl) kr += [[34, 60, 9, '#fff', .2], [206, 54, 7, '#fff', .9], [176, 22, 6, '#FFE48C', 1.4], [58, 28, 5, '#FFE48C', .5]].map(([x, y, r, f, z]) => `<g transform="translate(${x} ${y})"><g class="os-iskra" style="--d:${z}s">${stHviezda(0, 0, r, f)}</g></g>`).join('');
    s = `<g class="os-kmen"${d(t.kmen)}>${k}</g><g class="os-koruna">${kr}</g>`;
  }
  let v = '';
  if (zem === 'kopec') v += `<path class="os-zem" d="M14 226C50 206 190 206 226 226C190 240 50 240 14 226Z" fill="${hn >= 2 ? '#BFD08A' : 'var(--sc-front, #5BC56B)'}" stroke-width="3"/>`;
  else if (zem === 'tien') v += `<ellipse cx="120" cy="229" rx="${st0 ? 46 : 34}" ry="6" fill="#2A2356" opacity=".16" stroke="none"/>`;
  v += `<g transform="translate(120 228) scale(${m}) translate(-120 -228)"><g class="os-rast${o.z ? ' vyrast' : ''}"${o.z ? ` style="--z:${o.z.toFixed(3)};--d:${t.rast}s"` : ''}>${s}</g></g>`;
  if (hn) v += [[46, 220, 20], [196, 224, -30], [70, 229, 60], [178, 230, -10], [34, 226, -50], [206, 218, 40]].slice(0, hn * 2).map(([x, y, a]) => `<path d="M0 0q6-8 15-2q-6 9-15 2z" transform="translate(${x} ${y}) rotate(${a})" fill="${T[1]}" stroke-width="2"/>`).join('');
  if (o.kos) { const FK = ['var(--coral)', 'var(--sun)', 'var(--violet)'];
    v += `<g transform="translate(196 214)"><g class="os-kos${o.novy === 'kos' ? ' novy' : ''}"${d(o.novy === 'kos' ? t.novy : t.plody)}><path d="M-12 -7C-12 -27 12 -27 12 -7" fill="none" stroke-width="3"/>${[[-7, -9, 0], [7, -9, 1], [0, -16, 2]].slice(0, Math.min(3, o.kos)).map(([x, y, i]) => `<circle cx="${x}" cy="${y}" r="7" fill="${FK[i]}" stroke-width="2.5"/>`).join('')}<path d="M-18 -7H18L13 13H-13Z" fill="#E2A93C" stroke-width="3"/><path d="M-15 0H15M-14 6H14" fill="none" stroke="#B07A1C" stroke-width="2.2"/><g transform="translate(24 -22) rotate(8)"><rect x="-15" y="-10" width="30" height="19" rx="7" fill="#fff" stroke-width="2.5"/><text x="0" y="4.5" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="12.5" fill="#2A2356" stroke="none">+${o.kos}</text></g></g></g>`; }
  if (o.sova) v += `<g class="os-sova"${d(t.sova)}>${mudra(hn >= 2 ? 'povzbudenie' : o.sovaVyraz || 'radost').replace('<svg ', '<svg x="-46" y="150" width="74" height="88" ')}</g>`;
  return `<svg class="os-strom${hn ? ' hn' + hn : ''}" viewBox="${o.sova ? '-48 -26 286 268' : '8 -26 224 268'}" aria-hidden="true"><g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${v}</g></svg>`;
}
// padajúce listy (pri kvitnúcom strome lupene, pri zlatom zlaté)
const stromListy = (n, stupen, jednorazove) => Array.from({ length: n }, (_, i) => `<i class="os-list${jednorazove ? ' raz' : ''}" style="--x:${Math.round(Math.random() * 92 + 2)}%;--t:${(6 + Math.random() * 5).toFixed(1)}s;--d:${(jednorazove ? Math.random() * .3 : Math.random() * 7).toFixed(1)}s;--c:${(STROM_STUPNE[stupen].zlaty ? ['#FFD23F', '#FFE27A'] : STROM_STUPNE[stupen].kvety ? ['#FFB3D1', '#FF9EC7', '#5FDB8A'] : ['#5FDB8A', '#4CD07D', '#FFB347'])[i % 3]}"></i>`).join('');
// ťuknutie na strom: zatrasie sa a spadne pár listov; na sovu: zahúka
function tukniNaStrom(el, e) {
  const sv = e.target.closest('.os-strom'); if (!sv) return false;
  if (e.target.closest('.os-sova')) { Zvuk.play('hoot'); vibruj(20); return true; }
  const k = sv.querySelector('.os-koruna, .os-klicok');
  if (k) { k.classList.remove('tras'); void k.getBoundingClientRect(); k.classList.add('tras'); }
  Zvuk.play('krid'); vibruj(15);
  const box = el.querySelector('.os-listy');
  if (box) { box.insertAdjacentHTML('beforeend', stromListy(4, stromStupen(), true)); setTimeout(() => box.querySelectorAll('.raz').forEach(x => x.remove()), 4000); }
  return true;
}
/* 5.0: scéna stromu (obloha, kopce, cestička, strom, Múdra) pre okno stromu aj veľkú oslavu; pri vädnutí zbledne obloha a slnko zakryje oblak */
const stromScena = (strom, o = {}) => `<div class="so-scena${o.hn ? ' hn' : ''}${o.luce ? ' luce' : ''}">
  <svg class="so-pozadie" viewBox="0 0 360 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <rect width="360" height="300" fill="var(--so-sky)"/>
    ${o.luce ? `<g class="so-luce">${Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180, b = (i * 30 + 14) * Math.PI / 180; return `<path d="M180 190L${(180 + 520 * Math.cos(a)).toFixed(0)} ${(190 + 520 * Math.sin(a)).toFixed(0)}L${(180 + 520 * Math.cos(b)).toFixed(0)} ${(190 + 520 * Math.sin(b)).toFixed(0)}Z"/>`; }).join('')}</g>` : ''}
    <circle cx="312" cy="64" r="21" fill="var(--sc-sun)"/><circle class="len-noc" cx="302" cy="57" r="18" fill="var(--so-sky)"/>${o.hn ? '' : '<circle class="len-den" cx="312" cy="64" r="32" fill="none" stroke="var(--sc-sun)" stroke-width="5" stroke-dasharray=".1 12" stroke-linecap="round"/>'}
    <g fill="var(--sc-cloud)">${o.hn ? '<ellipse cx="312" cy="78" rx="36" ry="12"/><circle cx="298" cy="68" r="14"/><circle cx="320" cy="62" r="18"/>' : ''}<ellipse cx="44" cy="120" rx="24" ry="9"/><circle cx="38" cy="113" r="11"/><circle cx="54" cy="110" r="13"/></g>
    <path d="M0 214C50 188 110 192 160 206C210 188 300 186 360 202V300H0Z" fill="var(--so-far)"/>
    <path d="M0 240C70 214 150 222 210 236C270 248 320 230 360 224V300H0Z" fill="var(--so-mid)"/>
    <path d="M-10 304C30 272 110 282 150 262" fill="none" stroke="var(--sc-path)" stroke-width="20" stroke-linecap="round"/>
    <path d="M-10 304C30 272 110 282 150 262" fill="none" stroke="var(--sc-pathdot)" stroke-width="3.5" stroke-dasharray=".1 9" stroke-linecap="round"/>
    <path d="M-6 282C60 244 300 242 366 278V306H-6Z" fill="var(--so-front)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30 284q3-9 6 0M306 272q3-9 6 0M322 276q3-8 6 0M250 262q3-8 6 0" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
  ${o.bublina ? `<p class="odkaz so-bub">${o.bublina}</p>` : ''}
  <div class="so-strom">${strom}</div>
</div>`;
// šesť stupňov na jednej bodkovanej čiare: prejdené s fajkou, terajší so stromčekom, budúce prerušovaným krúžkom
const stromCesta = i => `<ol class="so-cesta" aria-label="Stupne stromu">${STROM_STUPNE.map((x, k) => `<li class="${k < i ? 'hot' : k === i ? 'tu' : ''}"><i>${k < i ? ikn('check') : k === i ? ikn('strom') : ''}</i><span class="cis">${x.od}</span></li>`).join('')}</ol>`;
// týždeň v okne stromu a v oslave (rovnaké krúžky ako na Domove)
const tyzdenStromu = (dnes, padne) => {
  const pon = new Date(); pon.setDate(pon.getDate() - (pon.getDay() + 6) % 7);
  return `<div class="dom-dni so-dni">${DNI.map((d, i) => { const x = new Date(pon); x.setDate(pon.getDate() + i); const k = key(x), je = k === dnes, h = st.dni.includes(k), bud = k > dnes;
    const tr = je && padne != null ? 'tu' : h ? 'hot' : je ? 'tu' : bud ? 'bud' : 'zme';
    return `<span class="dom-den ${tr}${je ? ' dnes' : ''}"><i>${je && padne != null ? `<span class="os-padne" style="--d:${padne}s">${ikn('hviezda')}</span>` : h ? ikn('check') : je ? ikn('hviezda') : ''}</i>${je ? 'Dnes' : d}</span>`; }).join('')}</div>`;
};
const spiaceHry = () => typeof HRY_VID === 'function' ? HRY_VID().filter(h => bodyHry() < h.cena && st.body >= h.cena).length : 0;
const nadpisPismena = t => [...t].map((ch, k) => `<span style="--k:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
/* 4.6: plán čísla série v oslave: od (čo je vidno na začiatku), do (uložená hodnota), pokojne (séria po prerušení začína znova od 1: bez počítania a ohňostroja) */
const planSerie = (s, pocetDni) => {
  const pokojne = s <= 1 && pocetDni > 1;
  return { od: pokojne ? s : Math.max(0, s - 1), do: s, pokojne, zmena: !pokojne };
};
/* Oslavy sa neskladajú na seba: stredná oslava (pečiatka) počká, kým sa zavrie veľká oslava alebo okno stromu */
const Oslavy = {
  rad: [], cak: 0,
  obsadene: () => !!document.querySelector('.oslava, .os-stredna'),
  pridaj(fn) { this.rad.push(fn); this.dalsia(); },
  dalsia() {
    if (!this.rad.length) return;
    if (this.obsadene()) { if (!this.cak) this.cak = setInterval(() => { if (!this.obsadene()) { clearInterval(this.cak); this.cak = 0; this.dalsia(); } }, 600); return; }
    this.rad.shift()();
  },
};
const Oslava = {
  kluc: () => 'oslava-' + (st.dietaId || 'x'),
  // 4.4: len záver dnešnej témy dňa (nie iná téma, kvíz, hra ani precvičovanie), raz za deň, pred misiou
  treba: f => !!f && !f.precvic && f.typ === 'tema' && !!f.id && f.id === temaDna().id && Object.values(f.odp || {}).some(o => o.ok) && S.get(Oslava.kluc(), '') !== key(new Date()),
  // volá sa po dokonci(): dnešný deň je už zapísaný. Veľká oslava: celá obrazovka v krajine stromu (séria, téma dňa, rast stromu, ožitie)
  ukaz(dalej) {
    const dnes = key(new Date()); S.set(this.kluc(), dnes);
    const s = Math.max(1, seria()), pocet = Math.max(1, st.dni.length), i = stromStupen(pocet), iPred = stromStupen(pocet - 1), S0 = STROM_STUPNE[i];
    const naStrome = Math.min(s, S0.plody), kos = Math.max(0, s - S0.plody), novy = kos ? 'kos' : naStrome - 1, vyrastol = i > iPred, casy = [];
    const ozil = hnPredDnes; hnPredDnes = 0;
    const plan = planSerie(s, pocet), rast = plan.zmena && !tiche, W = ozil && !tiche ? 2.6 : 0; // 4.6: W = ako dlho je strom vyschnutý, kým ho ožije vietor
    const pocetK = i === 1 ? 3 : i >= 3 ? 9 : 6, tPlody = .6 + pocetK * .08 + (S0.kvety ? .5 : .1), tNovy = tPlody + Math.max(0, naStrome - 1) * .07 + .35;
    const tRast = tNovy + 1.1, tSova = (vyrastol ? tRast + .9 : tNovy + 1), tHviezda = tSova + .5, tTlacidlo = tHviezda + .5;
    const zPred = vyrastol ? ST_VYSKA[iPred] / ST_VYSKA[i] : 0, cerstvy = { stupen: i, plody: naStrome, kos, novy, z: zPred, sova: true, sovaVyraz: 'oslava', zem: false, t: { plody: tPlody, novy: tNovy, sova: tSova, rast: tRast } };
    const odz = (st.flow && st.flow.noveOdznaky) || [];
    const el = document.createElement('div');
    el.className = 'oslava os-velka' + (W ? ' ozil' : ''); el.style.setProperty('--w', W + 's'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', vyrastol ? 'Strom múdrosti vyrástol' : 'Séria rastie');
    const nadpis = ozil ? 'Strom ožil!' : vyrastol ? 'Strom vyrástol!' : s === 1 ? 'Skvelý začiatok!' : 'Séria rastie!';
    const strom = W ? `<div class="os-dvojstrom">${stromSvg({ stupen: i, plody: Math.min(naStrome, 4), kos: 0, novy: -1, hn: ozil, sova: true, zem: false, t: { kmen: .1, koruna: .2, krok: .03, plody: .5, sova: .8 } }).replace('class="os-strom', 'class="vyschnuty os-strom')}</div>` : stromSvg(cerstvy);
    el.innerHTML = `<div class="os-listy">${stromListy(9, i)}</div><div class="os-obsah">
      ${stromScena(strom, { luce: true })}
      <section class="karta so-karta"><span class="zal">Stupeň ${i + 1} zo ${STROM_STUPNE.length}</span>
        <h2 class="os-nadpis">${nadpisPismena(nadpis)}</h2>
        <p class="os-veta">${ozil ? 'Strom je zasa zelený, hviezdičky sú späť a hry sú odomknuté. Vitaj späť! ' : ''}${vyrastol ? `Zo stromu je teraz <b>${S0.n.toLowerCase()}</b>. Unesie už ${S0.plody} ${slovoPlody(S0.plody)}.` : s === 1 ? 'Na strome múdrosti vyrástol prvý plod.' : `Strom múdrosti má už ${s} ${slovoPlody(s)}.`} Príď zajtra a pribudne ďalší!</p>
        ${vyrastol ? `<div class="os-pred-po" style="--d:${(tRast + .3 + W).toFixed(2)}s"><span>${stromSvg({ stupen: iPred, plody: Math.min(s - 1, STROM_STUPNE[iPred].plody), zem: 'tien' })}</span>${ikn('sipka')}<span>${stromSvg({ stupen: i, plody: naStrome, zem: 'tien' })}</span></div>` : ''}
        <div class="os-seria${rast ? ' hrdina' : ''}"><span class="os-ohen">${ikn('plamen')}</span>${rast ? `<b id="os-cislo" class="os-roll"><span class="stara">${plan.od}</span><span class="nova">${plan.do}</span></b>` : `<b id="os-cislo">${plan.do}</b>`}<span>${s === 1 ? 'Prvý deň série!' : dni(s) + ' po sebe'}</span></div>
        <p class="os-dni">${plan.pokojne ? 'Nevadí, začíname odznova. Dnes si urobil prvý krok.' : `Učíš sa už <b id="os-dni">${rast ? pocet - 1 : pocet}</b> ${dni(pocet)}`}</p>
        ${tyzdenStromu(dnes, tHviezda + W)}
        ${odz.length ? `<p class="os-odznak">${peciatka(odz[0], 'ma')}<span>${odz.length === 1 ? 'Nový odznak' : 'Nové odznaky'}: <b>${odz.map(o => esc(o.n)).join(', ')}</b>. Pečiatka je v tvojom pase.</span></p>` : ''}
      </section>
      <button class="btn wide os-dalej" style="--d:${tTlacidlo + W}s" data-oslava-dalej>Pokračovať${ikn('sipka', 'za')}</button></div>`;
    document.body.appendChild(el);
    const o = (t, fn) => casy.push(setTimeout(fn, (t + W) * 1000));
    if (W) {
      const dv = el.querySelector('.os-dvojstrom'), suchy = dv.querySelector('.vyschnuty'), at = (s, fn) => casy.push(setTimeout(fn, s * 1000));
      const farby = ['#8BDD90', '#62CB72', '#B9D154', '#FFB347'];
      at(.5, () => { Zvuk.play('whoosh'); suchy.classList.add('fuka'); Haptika.hraj('tuk');
        dv.insertAdjacentHTML('beforeend', [0, 1, 2].map(n => `<i class="vs" style="top:${30 + n * 22}%;--d:${n * .22}s"></i>`).join('') + Array.from({ length: 16 }, (_, n) => `<i class="vl" style="--a:${Math.round(n * 22 + Math.random() * 20)}deg;--r:${Math.round(100 + Math.random() * 80)}px;--d:${(Math.random() * .6).toFixed(2)}s;--c:${farby[n % 4]}"><b></b></i>`).join('')); });
      at(.9, () => Zvuk.play('whoosh'));
      at(1.4, () => Zvuk.play('whoosh'));
      at(W - .15, () => {
        suchy.classList.add('ustup'); dv.querySelectorAll('.vl, .vs').forEach(x => x.remove());
        dv.insertAdjacentHTML('beforeend', stromSvg(cerstvy));
        setTimeout(() => suchy.remove(), 800);
        Zvuk.play('cink'); Haptika.hraj('hotovo');
        const [x, y] = stred(dv); FX.burst(x, y - 20, 24, ['star', 'dot'], 8);
      });
    }
    Zvuk.play('whoosh');
    o(.3, () => Zvuk.play('start'));
    for (let k = 0; k < pocetK; k += 2) o(.6 + k * .08, () => Zvuk.play('pop'));
    for (let k = 0; k < Math.min(naStrome - 1, 8); k++) o(tPlody + k * .07, () => Zvuk.play('ton' + (k % 4)));
    o(tNovy, () => Zvuk.play('whoosh'));
    o(tNovy + .75, () => {
      Zvuk.play('dopad1'); setTimeout(() => Zvuk.play('cink'), 120); vibruj(30);
      const p = el.querySelector('.os-novy, .os-kos.novy'); if (p) { const [x, y] = stred(p); FX.burst(x, y, 18, ['star', 'dot'], 7); }
    });
    if (vyrastol && !plan.pokojne) o(tRast, () => { Zvuk.play('win'); vibruj([40, 30, 40]); FX.ohnostroj(2); });
    if (!plan.pokojne) o(tSova + .45, () => Zvuk.play('hoot'));
    if (rast) o(tHviezda, () => Zvuk.play('seria'));
    if (rast) o(tHviezda + .35, () => {
      Haptika.hraj('hotovo');
      const c = el.querySelector('#os-cislo'), r = el.querySelector('.os-seria'), d = el.querySelector('#os-dni');
      if (c) { c.classList.add('roll'); const [x, y] = stred(c); FX.burst(x, y, 24, ['star', 'dot', 'rect'], 9); }
      const ob = el.querySelector('.so-karta'); if (ob) { ob.classList.add('tras'); setTimeout(() => ob.classList.remove('tras'), 600); }
      if (r) r.classList.add('zap');
      if (d) { d.textContent = pocet; d.classList.add('bump'); }
      const sv = el.querySelector('.so-strom .os-strom:not(.vyschnuty)'); if (sv) sv.classList.add('zari');
      const sova = el.querySelector('.so-strom .os-sova'); if (sova) sova.classList.add('skace');
    });
    if (!plan.pokojne) o(tHviezda + .6, () => { if (!rast) Zvuk.play('win'); FX.ohnostroj(vyrastol ? 1 : 2); });
    el.addEventListener('click', e => { if (tukniNaStrom(el, e)) e.stopPropagation(); });
    const b = el.querySelector('[data-oslava-dalej]');
    if (b) b.addEventListener('click', e => {
      e.stopPropagation(); casy.forEach(clearTimeout); Zvuk.play('tap');
      el.classList.add('pryc'); setTimeout(() => el.remove(), 320); dalej();
    });
  },
};
// okno stromu (z Domova: strom v krajine, tlačidlo Strom múdrosti): stupeň, plody, čo chýba, týždeň s okruhom
const Strom = {
  ukaz() {
    if (document.querySelector('.oslava, .os-stredna')) return;
    // 4.4: okná týždňa (pás, Prehľad týždňa, okruh) sa pri otvorení stromu zavrú, aby sa neprekrývali
    document.querySelectorAll('.okruh-okno').forEach(o => { o.classList.add('pryc'); setTimeout(() => o.remove(), 250); });
    const dnes = key(new Date()), pocet = st.dni.length, i = stromStupen(pocet), S0 = STROM_STUPNE[i], dalsi = STROM_STUPNE[i + 1], s = seria(), hotovo = st.dni.includes(dnes);
    const naStrome = Math.min(s, S0.plody), kos = Math.max(0, s - S0.plody), hn = hnStupen();
    const bublina = hn ? (hn >= 2 ? 'Nič sa nestratilo. Stačí jedna téma!' : 'Strom je smädný. Jedna téma ho napojí!') : !pocet ? 'Tu raz vyrastie strom. Preber tému dňa a zasadíme ho!'
      : hotovo ? 'Dnes plod pribudol. Príď zajtra a vyrastie ďalší!' : 'Dnes ešte plod chýba. Preber tému dňa a pribudne ďalší!';
    const Ty = TY(), vyb = Ty.okruhy().find(o => o.id === Ty.vybrany()), u = bodyUbudlo(), sh = spiaceHry();
    const seriaSt = `<span class="st" style="--c:var(--coral-l)">${ikn('plamen')}${s ? `${s} ${dni(s)} po sebe` : 'Séria začne dnes'}</span>`;
    const karta = hn
      ? `<h2 class="n0">${HN_TEXT[hn].n}</h2>${seriaSt}<p class="tx">${HN_TEXT[hn].p}</p>
        <div class="so-chips"><span class="st cis">${ikn('hviezda')}${st.body}</span>${u ? `<span class="st" style="--c:var(--violet-l)">${ikn('mesiac')}${u} ${u === 1 ? 'hviezdička spí' : u <= 4 ? 'hviezdičky spia' : 'hviezdičiek spí'}</span>` : ''}${sh ? `<span class="st">${ikn('zamok')}${sh} ${sh === 1 ? 'hra spí' : sh <= 4 ? 'hry spia' : 'hier spí'}</span>` : ''}</div>`
      : `<h2 class="n0">${S0.n}</h2>${seriaSt}
        <p class="so-mal">${pocet} ${dni(pocet)} učenia · ${naStrome ? `na strome ${naStrome === 1 ? 'visí' : 'visia'} ${naStrome} ${slovoPlody(naStrome)}` : 'zatiaľ bez plodov'}${kos ? ` · v košíku ${kos}` : ''}</p>
        ${stromCesta(i)}
        <p class="tx">${dalsi ? `Ešte <b>${dalsi.od - pocet} ${dni(dalsi.od - pocet)} učenia</b> a vyrastie z neho ${dalsi.n.toLowerCase()}.` : 'Najvyšší stupeň! Strom je celý zlatý.'}</p>`;
    const el = document.createElement('div');
    el.className = 'oslava strom-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Strom múdrosti');
    el.innerHTML = `<div class="os-listy">${hn ? '' : stromListy(5, i)}</div><div class="os-obsah">
      <div class="so-hlava"><h1 class="n1">Strom múdrosti</h1><button class="btn kruh dve" data-strom-zavri aria-label="Zavrieť">${ikn('zavriet')}</button></div>
      ${stromScena(stromSvg({ stupen: i, plody: naStrome, kos, novy: -1, hn, sova: true, zem: false, t: { kmen: .1, koruna: .2, krok: .05, plody: .6, sova: .9 } }), { hn, bublina })}
      <section class="karta so-karta"><span class="zal">Stupeň ${i + 1} zo ${STROM_STUPNE.length}</span>${karta}</section>
      <div class="so-tyz"><h3 class="n2">Tento týždeň</h3><button class="btn maly dve" data-so-okruh>${okruhIk(vyb) ? `<span class="okruh-tl-ik">${okruhIk(vyb)}</span>` : ikn('kompas')}Okruh: ${vyb ? esc(vyb.nazov) : 'Zmiešaný'}</button></div>
      ${tyzdenStromu(dnes)}
      ${hotovo ? '' : `<button class="btn wide" data-strom-tema>Poďme na tému dňa${ikn('sipka', 'za')}</button>`}
      <p class="dop so-tip">${hn ? 'Rodič môže vädnutie vypnúť vo svojom paneli.' : 'Ťukni na strom a zatrasie sa. Ťukni na Múdru a zahúka.'}</p></div>`;
    document.body.appendChild(el);
    Zvuk.play('whoosh'); setTimeout(() => Zvuk.play('pop'), 300);
    const kl = e => { if (e.key === 'Escape') zavri(); };
    const zavri = () => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => el.remove(), 320); };
    document.addEventListener('keydown', kl);
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.closest('[data-strom-zavri]')) { Zvuk.play('tap'); zavri(); return; }
      if (e.target.closest('[data-strom-tema]')) { zavri(); startTema(temaDna().id); return; }
      if (e.target.closest('[data-so-okruh]')) { Zvuk.play('tap'); zavri(); setTimeout(() => Okruh.ukaz(), 200); return; }
      tukniNaStrom(el, e);
    });
    const x = el.querySelector('[data-strom-zavri]'); if (x && x.focus) x.focus({ preventScroll: true });
  },
};
// strom v krajine Domova (variant B): stojí na kopci vpravo od cesty; ťuknutím sa otvorí okno stromu
const StromKrajina = {
  html() {
    if (!st.dietaId) return '';
    const pocet = st.dni.length, i = stromStupen(pocet), s = seria(), S0 = STROM_STUPNE[i], hn = hnStupen(), naStrome = Math.min(s, S0.plody), kos = Math.max(0, s - S0.plody);
    const popis = `Strom múdrosti: ${S0.n.toLowerCase()}${hn ? ', ' + HN_TEXT[hn].n.toLowerCase() : ''}, ${naStrome} ${slovoPlody(naStrome)}. Otvoriť`;
    return `<span class="kr-strom st${i}${hn ? ' schne' : ''}" data-strom role="button" tabindex="0" aria-label="${popis}">${stromSvg({ stupen: i, plody: naStrome, kos, novy: -1, hn, zem: 'tien' })}</span>`;
  },
};
const MINI_STROM = `<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 36 V24 H23 V36Z" fill="#B5651D"/><circle cx="20" cy="17" r="13" fill="#4CD07D"/><circle cx="15" cy="15" r="3" fill="#FF5A5F" stroke-width="1.8"/><circle cx="25" cy="19" r="3" fill="#FFD23F" stroke-width="1.8"/></g></svg>`;
