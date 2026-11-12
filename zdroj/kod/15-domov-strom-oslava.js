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
const HN_FARBY = [null, ['#B8D84A', '#A9CC3C', '#C5DE55', '#B1D145'], ['#CDA93C', '#C0922F', '#D3B24C', '#B98B2D'], ['#8E7C48', '#7F6A3D', '#978752', '#76643A']];
const KORUNA = [[160, 112, 50, '#4CD07D'], [112, 128, 34, '#3DBB6A'], [208, 126, 36, '#3DBB6A'], [130, 84, 34, '#5FDB8A'], [190, 82, 34, '#5FDB8A'], [160, 62, 30, '#6BE39A']];
const KORUNA_VIAC = [[98, 106, 28, '#3DBB6A'], [222, 104, 28, '#3DBB6A'], [160, 36, 24, '#7BE8A6']];
const PLODY = [[150, 92], [186, 104], [124, 118], [168, 128], [204, 130], [140, 68], [194, 74], [112, 96], [158, 106], [218, 104], [132, 142], [182, 148], [100, 112], [222, 116], [160, 42], [146, 144]];
const KVETY = [[132, 64], [184, 58], [108, 120], [214, 118], [160, 86], [198, 136], [122, 146], [160, 30], [94, 98], [228, 96]];
const plod = (i, hn = 0) => `<circle r="10" fill="${hn >= 2 ? ['#8B5A2B', '#7A5530', '#6E4A28'][i % 3] : ['#FF5A5F', '#FFD23F', '#FF9F1C', '#FF6FA8', '#B36BFF'][i % 5]}" stroke-width="3"/><path d="M0 -10 C1 -14 4 -16 7 -16 C6 -12 3 -10 0 -10Z" fill="#2FBF71" stroke-width="2"/><path d="M-5.5 -2 A6 6 0 0 1 -2 -6" fill="none" stroke="#fff" stroke-width="2.4"/>`;
const stromIskra = (x, y, d) => `<g transform="translate(${x} ${y})"><g class="os-iskra" style="--d:${d}s"><path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="#FFE27A" stroke-width="1.5"/></g></g>`;
// o: stupen, plody (na strome), kos (plody navyše v košíku), novy (index nového plodu, 'kos', alebo -1), z (veľkosť pred vyrastením), sova, t (časy animácií)
function stromSvg(o) {
  const hn = o.hn || 0, S0 = STROM_STUPNE[o.stupen], t = { kmen: .25, koruna: .6, krok: .08, plody: 1.2, novy: 2, sova: 2.4, rast: 3, ...(o.t || {}) };
  const koruna = o.stupen === 1 ? [0, 3, 4].map(i => KORUNA[i]) : o.stupen >= 3 ? [...KORUNA, ...KORUNA_VIAC] : KORUNA;
  const farba = (c, i) => hn ? HN_FARBY[hn][i % 4] : S0.zlaty ? ['#C6E86B', '#A8DB55', '#D8F07E', '#B9E35F'][i % 4] : c;
  // sovička sedí na vrchu koruny (pri semienku vedľa klíčka)
  const vrch = Math.min(...koruna.map(([, y, r]) => y - r)), m = S0.m, sovaX = o.stupen ? 148 : 192, sovaY = o.stupen ? 232 - (232 - vrch) * m - 60 : 166;
  const d = x => ` style="--d:${x.toFixed(2)}s"`, kEnd = t.koruna + koruna.length * t.krok;
  const strom = o.stupen === 0
    ? `<path d="M134 232 Q160 214 186 232Z" fill="#B5651D"/><g class="os-klicok"><path d="M160 226 V200" fill="none" stroke-width="4"/>
       <path d="M160 210 C150 200 140 202 137 191 C150 188 158 197 160 207Z" fill="#5FDB8A"/><path d="M160 205 C170 195 181 197 185 186 C172 183 162 192 160 202Z" fill="#4CD07D"/></g>`
    : `<g class="os-kmen"${d(t.kmen)}><path d="M148 232 C150 198 146 178 132 160 L146 154 C154 166 158 176 160 186 C164 172 172 162 186 154 L194 162 C178 174 172 194 174 232Z" fill="#B5651D"/>
         <path d="M156 222 q4 -8 0 -16 M166 214 q-3 -6 1 -12" fill="none" stroke-width="2.5" opacity=".5"/></g>
       <g class="os-koruna">
         ${koruna.map(([x, y, r], i) => `<circle class="os-k"${d(t.koruna + i * t.krok)} cx="${x}" cy="${y}" r="${r + 4}" fill="${INK}" stroke="none"/>`).join('')}
         ${koruna.map(([x, y, r, c], i) => `<circle class="os-k"${d(t.koruna + i * t.krok)} cx="${x}" cy="${y}" r="${r}" fill="${farba(c, i)}" stroke="none"/>`).join('')}
         ${koruna.map(([x, y, r], i) => `<path class="os-k"${d(t.koruna + i * t.krok)} d="M${x - r * .55} ${y - r * .25} a${r * .6} ${r * .6} 0 0 1 ${r * .5} ${-r * .45}" fill="none" stroke="#fff" stroke-width="3.5" opacity=".45"/>`).join('')}
         ${S0.kvety && !hn ? KVETY.map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="os-kvet"${d(kEnd + i * .06)}>${[0, 72, 144, 216, 288].map(u => `<circle cy="-4.5" r="3.6" fill="${S0.zlaty ? '#FFF3B0' : '#FFB3D1'}" stroke-width="1.6" transform="rotate(${u})"/>`).join('')}<circle r="2.6" fill="${S0.zlaty ? '#FF9F1C' : '#FFD23F'}" stroke-width="1.4"/></g></g>`).join('') : ''}
         ${PLODY.slice(0, o.plody).map(([x, y], i) => i === o.novy
           ? `<g transform="translate(${x} ${y})"><circle class="os-kruh"${d(t.novy)} r="10" fill="none" stroke="#FFD23F" stroke-width="5"/><g class="os-novy"${d(t.novy)}><g class="os-hoj"${d(t.novy + 1)}>${plod(i, hn)}</g></g></g>`
           : `<g transform="translate(${x} ${y})"><g class="os-plod"${d(t.plody + i * .07)}><g class="os-hoj"${d(t.plody + i * .07 + .6)}>${plod(i, hn)}</g></g></g>`).join('')}
         ${hn >= 2 ? koruna.slice(0, hn === 2 ? 3 : 6).map(([x, y, r], i) => `<circle cx="${(x + r * (i % 2 ? .35 : -.3)).toFixed(1)}" cy="${(y + r * .25).toFixed(1)}" r="${(r * .2).toFixed(1)}" fill="#5E4A22" stroke="none" opacity=".7"/>`).join('') : ''}
       </g>`;
  return `<svg class="os-strom${hn ? ' hn' + hn : ''}" viewBox="0 -40 320 290" aria-hidden="true"><g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    ${S0.zlaty && !hn ? `<circle class="os-ziara" cx="160" cy="${232 - (232 - 100) * m}" r="${150 * m}" fill="#FFE27A" stroke="none"/>` : ''}
    <path class="os-zem" d="M-200 250 V230 C40 202 280 202 520 230 V250Z" fill="#7ED957"/>
    ${o.stupen >= 2 && hn < 2 ? [[70, 226, '#FF9EC7'], [96, 234, '#FFD23F'], [236, 232, '#fff'], [262, 224, '#B36BFF']].map(([x, y, c], i) => `<g transform="translate(${x} ${y})"><g class="os-kvet"${d(t.kmen + .3 + i * .1)}>${[0, 72, 144, 216, 288].map(u => `<circle cy="-3.6" r="3" fill="${c}" stroke-width="1.5" transform="rotate(${u})"/>`).join('')}<circle r="2.2" fill="#FFD23F" stroke-width="1.2"/></g></g>`).join('') : ''}
    <g transform="translate(160 232) scale(${m}) translate(-160 -232)"><g class="os-rast${o.z ? ' vyrast' : ''}"${o.z ? ` style="--z:${o.z.toFixed(3)};--d:${t.rast}s"` : ''}>${strom}</g></g>
    ${S0.zlaty && !hn ? [[72, 70, .2], [250, 60, .9], [52, 150, 1.4], [270, 150, .5], [160, -20, 1.1]].map(p => stromIskra(...p)).join('') : ''}
    ${hn ? [[96, 238, -20], [122, 245, 15], [150, 249, -8], [196, 243, 25], [222, 238, -15], [246, 246, 10], [70, 244, 30]].slice(0, hn * 2 + 1).map(([x, y, a], i) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="3.8" transform="rotate(${a} ${x} ${y})" fill="${HN_FARBY[hn][i % 4]}" stroke-width="2.5"/>`).join('') : ''}
    ${hn >= 3 ? [[118, 236, 1], [204, 238, .8]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-3 0 V-8 H3 V0Z" fill="#F4E9D2" stroke-width="2.5"/><path d="M-10 -8 A10 8 0 0 1 10 -8Z" fill="#E4524F" stroke-width="2.5"/><circle cx="-4" cy="-12" r="1.8" fill="#fff" stroke="none"/><circle cx="3" cy="-14" r="1.6" fill="#fff" stroke="none"/></g>`).join('') : ''}
    ${o.kos ? `<g transform="translate(250 212)"><g class="os-kos${o.novy === 'kos' ? ' novy' : ''}"${d(o.novy === 'kos' ? t.novy : t.plody)}><path d="M-14 -4 Q0 -26 14 -4" fill="none" stroke-width="3.5"/>
      ${[[-8, -6, 0], [0, -9, 1], [8, -6, 2]].map(([x, y, i]) => `<g transform="translate(${x} ${y}) scale(.7)">${plod(i)}</g>`).join('')}<path d="M-20 -4 H20 L15 16 H-15Z" fill="#C98A4B"/><path d="M-17 4 H17 M-15 10 H15" fill="none" stroke-width="2" opacity=".5"/>
      <text y="12" text-anchor="middle" font-size="13" font-weight="900" fill="#fff" stroke="${INK}" stroke-width="3" paint-order="stroke" font-family="Baloo 2, sans-serif">+${o.kos}</text></g></g>` : ''}
    ${o.sova ? `<g class="os-sova"${d(t.sova)}>${owl(hn >= 2 ? 'oops' : 'cheer').replace('<svg ', `<svg x="${sovaX}" y="${sovaY.toFixed(1)}" width="64" height="70" `)}</g>` : ''}</g></svg>`;
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
const stromStavHtml = (pocet, i) => {
  const S0 = STROM_STUPNE[i], dalsi = STROM_STUPNE[i + 1];
  return `<div class="os-stupen"><b>${S0.n}</b><small>Stupeň ${i + 1} zo ${STROM_STUPNE.length} · ${pocet} ${dni(pocet)} učenia</small>
    ${dalsi ? `<span class="bar" style="--c:#2FBF71"><i style="width:${Math.max(6, Math.round((pocet - S0.od) / (dalsi.od - S0.od) * 100))}%"></i></span><small>Ešte ${dalsi.od - pocet} ${dni(dalsi.od - pocet)} učenia a vyrastie z neho ${dalsi.n.toLowerCase()}.</small>`
      : '<small>Najvyšší stupeň! Strom je celý zlatý.</small>'}</div>`;
};
const tyzdenStromu = dnes => {
  const pon = new Date(); pon.setDate(pon.getDate() - (pon.getDay() + 6) % 7);
  return DNI.map((d, i) => { const x = new Date(pon); x.setDate(pon.getDate() + i); const k = key(x); return { d, dnes: k === dnes, h: st.dni.includes(k), c: PASTEL[i] }; });
};
/* 4.6: plán čísla série v oslave: od (čo je vidno na začiatku), do (uložená hodnota), pokojne (séria po prerušení začína znova od 1: bez počítania a ohňostroja) */
const planSerie = (s, pocetDni) => {
  const pokojne = s <= 1 && pocetDni > 1;
  return { od: pokojne ? s : Math.max(0, s - 1), do: s, pokojne, zmena: !pokojne };
};
const Oslava = {
  kluc: () => 'oslava-' + (st.dietaId || 'x'),
  // 4.4: len záver dnešnej témy dňa (nie iná téma, kvíz, hra ani precvičovanie), raz za deň, pred misiou
  treba: f => !!f && !f.precvic && f.typ === 'tema' && !!f.id && f.id === temaDna().id && Object.values(f.odp || {}).some(o => o.ok) && S.get(Oslava.kluc(), '') !== key(new Date()),
  // volá sa po dokonci(): dnešný deň je už zapísaný
  ukaz(dalej) {
    const dnes = key(new Date()); S.set(this.kluc(), dnes);
    const s = Math.max(1, seria()), pocet = Math.max(1, st.dni.length), i = stromStupen(pocet), iPred = stromStupen(pocet - 1), S0 = STROM_STUPNE[i];
    const naStrome = Math.min(s, S0.plody), kos = Math.max(0, s - S0.plody), novy = kos ? 'kos' : naStrome - 1, vyrastol = i > iPred, casy = [];
    const ozil = hnPredDnes; hnPredDnes = 0;
    const plan = planSerie(s, pocet), rast = plan.zmena && !tiche, W = ozil && !tiche ? 2.6 : 0; // 4.6: W = ako dlho je strom vyschnutý, kým ho ožije vietor
    const pocetK = i === 1 ? 3 : i >= 3 ? 9 : 6, tPlody = .6 + pocetK * .08 + (S0.kvety ? .5 : .1), tNovy = tPlody + Math.max(0, naStrome - 1) * .07 + .35;
    const tRast = tNovy + 1.1, tSova = (vyrastol ? tRast + .9 : tNovy + 1) , tHviezda = tSova + .5, tTlacidlo = tHviezda + .5;
    const el = document.createElement('div');
    el.className = 'oslava' + (W ? ' ozil' : ''); el.style.setProperty('--w', W + 's'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', vyrastol ? 'Strom múdrosti vyrástol' : 'Séria rastie');
    const nadpis = ozil ? 'Strom ožil!' : vyrastol ? 'Strom vyrástol!' : s === 1 ? 'Skvelý začiatok!' : 'Séria rastie!';
    el.innerHTML = `<div class="os-lucy"></div><div class="os-listy">${stromListy(9, i)}</div><div class="os-obsah">
      ${W ? `<div class="os-dvojstrom">${stromSvg({ stupen: i, plody: Math.min(naStrome, 4), kos: 0, novy: -1, hn: ozil, sova: true, t: { kmen: .1, koruna: .2, krok: .03, plody: .5, sova: .8 } }).replace('class="os-strom', 'class="vyschnuty os-strom')}</div>` : stromSvg({ stupen: i, plody: naStrome, kos, novy, z: vyrastol ? STROM_STUPNE[iPred].m / S0.m : 0, sova: true, t: { plody: tPlody, novy: tNovy, sova: tSova, rast: tRast } })}
      <h2 class="os-nadpis">${[...nadpis].map((ch, k) => `<span style="--k:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</h2>
      ${vyrastol ? `<div class="os-novy-stupen" style="--d:${(tRast + .3 + W).toFixed(2)}s">${ii(STAR())} Teraz je to: <b>${S0.n}</b></div>` : ''}
      <div class="os-seria${rast ? ' hrdina' : ''}"><span class="os-ohen">${IK.ohen}</span>${rast ? `<b id="os-cislo" class="os-roll"><span class="stara">${plan.od}</span><span class="nova">${plan.do}</span></b>` : `<b id="os-cislo">${plan.do}</b>`}<span>${s === 1 ? 'Prvý deň série!' : dni(s) + ' po sebe'}</span></div>
      <p class="os-dni">${plan.pokojne ? 'Nevadí, začíname odznova. Dnes si urobil prvý krok.' : `Učíš sa už <b id="os-dni">${rast ? pocet - 1 : pocet}</b> ${dni(pocet)}`}</p>
      <p class="os-veta">${ozil ? 'Strom je zasa zelený, hviezdičky sú späť a hry sú odomknuté. Vitaj späť! ' : ''}${s === 1 ? 'Na strome múdrosti vyrástol prvý plod.' : `Strom múdrosti má už ${s} ${slovoPlody(s)}.`} Príď zajtra a pribudne ďalší!</p>
      <div class="os-tyzden">${tyzdenStromu(dnes).map(x => `<div class="os-den${x.h ? ' h' : ''}${x.dnes ? ' dnes' : ''}" style="--c:${x.c}"><i>${x.dnes ? `<span class="os-padne" style="--d:${tHviezda + W}s">${STAR()}</span>` : x.h ? STAR() : ''}</i>${x.d}</div>`).join('')}</div>
      <button class="btn wide cta os-dalej" style="--d:${tTlacidlo + W}s" data-oslava-dalej>Pokračovať →</button></div>`;
    document.body.appendChild(el);
    const o = (t, fn) => casy.push(setTimeout(fn, (t + W) * 1000));
    if (W) {
      const dv = el.querySelector('.os-dvojstrom'), suchy = dv.querySelector('.vyschnuty'), pre = fn => casy.push(setTimeout(fn, 0)), at = (s, fn) => casy.push(setTimeout(fn, s * 1000));
      const farby = ['#5FDB8A', '#4CD07D', '#9BE564', '#FFB347'];
      at(.5, () => { Zvuk.play('whoosh'); suchy.classList.add('fuka'); Haptika.hraj('tuk');
        dv.insertAdjacentHTML('beforeend', [0, 1, 2].map(n => `<i class="vs" style="top:${30 + n * 22}%;--d:${n * .22}s"></i>`).join('') + Array.from({ length: 24 }, (_, n) => `<i class="vl" style="--a:${Math.round(n * 15 + Math.random() * 20)}deg;--r:${Math.round(110 + Math.random() * 90)}px;--d:${(Math.random() * .6).toFixed(2)}s;--c:${farby[n % 4]}"><b></b></i>`).join('')); });
      at(.9, () => Zvuk.play('whoosh'));
      at(1.4, () => Zvuk.play('whoosh'));
      at(W - .15, () => {
        suchy.classList.add('ustup'); dv.querySelectorAll('.vl, .vs').forEach(x => x.remove());
        dv.insertAdjacentHTML('beforeend', stromSvg({ stupen: i, plody: naStrome, kos, novy, z: vyrastol ? STROM_STUPNE[iPred].m / S0.m : 0, sova: true, t: { plody: tPlody, novy: tNovy, sova: tSova, rast: tRast } }));
        setTimeout(() => suchy.remove(), 800);
        Zvuk.play('cink'); Haptika.hraj('hotovo');
        const [x, y] = stred(dv); FX.burst(x, y - 20, 36, ['star', 'dot'], 8);
      });
    }
    Zvuk.play('whoosh');
    o(.3, () => Zvuk.play('start'));
    for (let k = 0; k < pocetK; k += 2) o(.6 + k * .08, () => Zvuk.play('pop'));
    for (let k = 0; k < Math.min(naStrome - 1, 8); k++) o(tPlody + k * .07, () => Zvuk.play('ton' + (k % 4)));
    o(tNovy, () => Zvuk.play('whoosh'));
    o(tNovy + .75, () => {
      Zvuk.play('dopad1'); setTimeout(() => Zvuk.play('cink'), 120); vibruj(30);
      const p = el.querySelector('.os-novy, .os-kos.novy'); if (p) { const [x, y] = stred(p); FX.burst(x, y, 26, ['star', 'dot'], 7); }
    });
    if (vyrastol && !plan.pokojne) o(tRast, () => { Zvuk.play('win'); vibruj([40, 30, 40]); FX.ohnostroj(3); });
    if (!plan.pokojne) o(tSova + .45, () => Zvuk.play('hoot'));
    if (rast) o(tHviezda, () => Zvuk.play('seria'));
    if (rast) o(tHviezda + .35, () => {
      Haptika.hraj('hotovo');
      const c = el.querySelector('#os-cislo'), r = el.querySelector('.os-seria'), d = el.querySelector('#os-dni');
      if (c) { c.classList.add('roll'); const [x, y] = stred(c); FX.burst(x, y, 34, ['star', 'dot', 'rect'], 9); setTimeout(() => FX.burst(x, y, 22, ['star', 'dot'], 12), 250); }
      const bl = document.createElement('div'); bl.className = 'os-blesk'; el.appendChild(bl); setTimeout(() => bl.remove(), 1000);
      const ob = el.querySelector('.os-obsah'); if (ob) { ob.classList.add('tras'); setTimeout(() => ob.classList.remove('tras'), 600); }
      if (r) r.classList.add('zap');
      if (d) { d.textContent = pocet; d.classList.add('bump'); }
      const sv = el.querySelector('.os-strom'); if (sv) sv.classList.add('zari');
      const sova = el.querySelector('.os-sova'); if (sova) sova.classList.add('skace');
    });
    if (!plan.pokojne) o(tHviezda + .6, () => { if (!rast) Zvuk.play('win'); FX.ohnostroj(vyrastol ? 2 : 3); });
    el.addEventListener('click', e => { if (tukniNaStrom(el, e)) e.stopPropagation(); });
    const b = el.querySelector('[data-oslava-dalej]');
    if (b) b.addEventListener('click', e => {
      e.stopPropagation(); casy.forEach(clearTimeout); Zvuk.play('tap');
      el.classList.add('pryc'); setTimeout(() => el.remove(), 320); dalej();
    });
  },
};
// okno po ťuknutí na kartu Tento týždeň: v akom stave je strom, koľko plodov a čo chýba do ďalšieho stupňa
const Strom = {
  ukaz() {
    if (document.querySelector('.oslava')) return;
    // 4.4: okná týždňa (pás, Prehľad týždňa, okruh) sa pri otvorení stromu zavrú, aby sa neprekrývali
    document.querySelectorAll('.okruh-okno').forEach(o => { o.classList.add('pryc'); setTimeout(() => o.remove(), 250); });
    const dnes = key(new Date()), pocet = st.dni.length, i = stromStupen(pocet), S0 = STROM_STUPNE[i], s = seria(), hotovo = st.dni.includes(dnes);
    const naStrome = Math.min(s, S0.plody), kos = Math.max(0, s - S0.plody), hn = hnStupen();
    const veta = hn ? HN_TEXT[hn].n + '. ' + HN_TEXT[hn].p : !s ? 'Zatiaľ bez plodov. Preber tému dňa a vyrastie prvý!'
      : `Na strome ${naStrome === 1 ? 'visí' : 'visia'} ${s} ${slovoPlody(s)}, jeden za každý deň série. ${hotovo ? 'Dnes už plod pribudol, príď zajtra!' : 'Dnes ešte plod chýba. Preber tému dňa a pribudne ďalší!'}`;
    const el = document.createElement('div');
    el.className = 'oslava strom-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Strom múdrosti');
    el.innerHTML = `<div class="os-lucy"></div><div class="os-listy">${stromListy(7, i)}</div><div class="os-obsah">
      <button class="ib os-x" data-strom-zavri aria-label="Zavrieť">${IKO.zavriet}</button>
      ${stromSvg({ stupen: i, plody: naStrome, kos, novy: -1, hn, sova: true, t: { kmen: .1, koruna: .25, krok: .05, plody: .7, sova: 1.1 } })}
      <h2 class="os-nadpis">${[...'Strom múdrosti'].map((ch, k) => `<span style="--k:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</h2>
      ${stromStavHtml(pocet, i)}
      <div class="os-seria"><span class="os-ohen">${IK.ohen}</span><b>${s}</b><span>${s ? dni(s) + ' po sebe' : 'Séria začne dnes'}</span></div>
      <p class="os-veta">${veta}</p>
      <div class="os-tyzden">${tyzdenStromu(dnes).map(x => `<div class="os-den${x.h ? ' h' : ''}${x.dnes ? ' dnes' : ''}" style="--c:${x.c}"><i>${x.h ? STAR() : ''}</i>${x.d}</div>`).join('')}</div>
      <small class="os-tip">Ťukni na strom a zatrasie sa. Ťukni na sovičku a zahúka.</small>
      ${hotovo ? '' : `<button class="btn wide cta" data-strom-tema>Poďme na tému dňa →</button>`}
      <button class="btn wide ghost" data-strom-zavri>Zavrieť</button></div>`;
    document.body.appendChild(el);
    Zvuk.play('whoosh'); setTimeout(() => Zvuk.play('pop'), 300);
    const zavri = () => { el.classList.add('pryc'); setTimeout(() => el.remove(), 320); };
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.closest('[data-strom-zavri]')) { Zvuk.play('tap'); zavri(); return; }
      if (e.target.closest('[data-strom-tema]')) { zavri(); startTema(temaDna().id); return; }
      tukniNaStrom(el, e);
    });
  },
};
const MINI_STROM = `<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M17 36 V24 H23 V36Z" fill="#B5651D"/><circle cx="20" cy="17" r="13" fill="#4CD07D"/><circle cx="15" cy="15" r="3" fill="#FF5A5F" stroke-width="1.8"/><circle cx="25" cy="19" r="3" fill="#FFD23F" stroke-width="1.8"/></g></svg>`;
