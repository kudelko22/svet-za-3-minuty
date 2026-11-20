/* 5.1: nové hry s úrovňami: Do košíkov, Kto sa skryl?, Slabikový vláčik (mladší), I alebo Y? (starší), Cestička, Koľko je hodín?
   Zapájajú sa do Hra (09-hry.js): Hra.start → Hra51.novy, renderHra → Hra51.html, koniec cez Hra.koniec (rekord, odznaky, hviezdy Dedinky).
   Každá hra má výber úrovne; ďalšia úroveň sa odomkne, keď dieťa zvládne aspoň 70 % kôl hneď (pamätá si to len tento prehliadač).
   Kresby dlaždíc sú v KRESBY_HIER, budovy v dedinke v dedinkaKresby (pridané nižšie). Štýly: 62-hry-51.css. */
HRY.push(
  { id: 'kosiky', n: 'Do košíkov', p: 'Roztrieď veci do správnych košíkov.', cena: 220, c: 'var(--leaf-l)' },
  { id: 'skryte', n: 'Kto sa skryl?', p: 'V dedinke sa schovali zvieratká a veci. Nájdi ich!', cena: 320, c: 'var(--sun-l)' },
  { id: 'slabiky', n: 'Slabikový vláčik', p: 'Poskladaj slovo zo slabík do vagónikov.', cena: 380, c: 'var(--coral-l)', len: 'mladsi' },
  { id: 'ypsilon', n: 'I alebo Y?', p: 'Doplň do slova i alebo y. Pomôžu vybrané slová.', cena: 380, c: 'var(--sky-l)', len: 'starsi' },
  { id: 'cesticka', n: 'Cestička', p: 'Doveď Múdru šípkami až k domčeku.', cena: 520, c: 'var(--teal-l)' },
  { id: 'hodiny', n: 'Koľko je hodín?', p: 'Pozri sa na ručičky a povedz, koľko je hodín.', cena: 760, c: 'var(--violet-l)' },
);

/* ---------- kresby dlaždíc (rám 120 × 80, ruka ako ostatné hry) ---------- */
Object.assign(KRESBY_HIER, {
  kosiky: () => `<path d="M14 46h40l-5 24H19z" fill="var(--h-drevo)"/><path d="M17 56h34M20 64h28" fill="none" stroke-width="2"/><circle cx="26" cy="40" r="9" fill="var(--coral)"/><circle cx="42" cy="41" r="8" fill="var(--sun)"/><path d="M26 31q2-5 6-5" fill="none" stroke-width="2.4"/>
    <path d="M66 46h40l-5 24H71z" fill="var(--h-drevo)"/><path d="M69 56h34M72 64h28" fill="none" stroke-width="2"/><path d="M78 44l8-20 6 20z" fill="var(--coral)"/><path d="M86 24l-3-7M86 24l4-6" fill="none" stroke="var(--leaf-d)" stroke-width="2.6"/><circle cx="96" cy="40" r="7" fill="var(--leaf)"/>
    <path d="M58 22q8-18 22-12" fill="none" stroke-dasharray=".1 6"/><circle cx="52" cy="22" r="8" fill="var(--violet)"/><path d="M52 14q1-4 4-5" fill="none" stroke-width="2.2"/>`,
  skryte: () => `<circle cx="34" cy="52" r="20" fill="var(--leaf)"/><circle cx="56" cy="44" r="18" fill="var(--leaf)"/><circle cx="20" cy="60" r="12" fill="var(--leaf)"/><path d="M8 72h66" stroke-width="3"/><circle cx="40" cy="46" r="5" fill="var(--h-biela)"/><circle cx="52" cy="46" r="5" fill="var(--h-biela)"/><circle cx="41" cy="47" r="2.4" fill="var(--dk)" stroke="none"/><circle cx="53" cy="47" r="2.4" fill="var(--dk)" stroke="none"/><path d="M43 36l-3-7 6 5M51 34l3-7 1 8" fill="var(--h-krtko)" stroke-width="2.4"/>
    <circle cx="88" cy="32" r="17" fill="var(--h-nebo)" stroke-width="4"/><path d="M80 26a10 10 0 0 1 8-6" fill="none" stroke="var(--h-biela)" stroke-width="3"/><path d="M100 44l12 13" stroke-width="7"/><path d="M100 44l12 13" stroke="var(--coral)" stroke-width="3"/>`,
  slabiky: () => `<path d="M4 70h112" stroke-width="3"/><path d="M8 62V38h22V26h8v12h4v24z" fill="var(--coral)"/><rect x="11" y="42" width="11" height="9" rx="2" fill="var(--h-nebo)" stroke-width="2.4"/><circle cx="34" cy="17" r="5" fill="var(--h-biela)" stroke-width="2.2"/><circle cx="42" cy="9" r="4" fill="var(--h-biela)" stroke-width="2.2"/>
    ${[[46, 'var(--sun)', 'MA'], [80, 'var(--teal)', 'MA']].map(([x, c, t]) => `<rect x="${x}" y="38" width="30" height="24" rx="4" fill="${c}"/>${hTx(x + 15, 56, 15, t)}<circle cx="${x + 8}" cy="66" r="5" fill="var(--dk)" stroke="none"/><circle cx="${x + 22}" cy="66" r="5" fill="var(--dk)" stroke="none"/>`).join('')}<circle cx="16" cy="66" r="5" fill="var(--dk)" stroke="none"/><circle cx="34" cy="66" r="5" fill="var(--dk)" stroke="none"/><path d="M42 54h4M76 54h4" stroke-width="3"/>`,
  ypsilon: () => `<g transform="rotate(-4 60 40)"><rect x="12" y="10" width="96" height="58" rx="6" fill="var(--h-drevo)"/><rect x="18" y="16" width="84" height="46" rx="3" fill="var(--leaf-d)"/>${hTx(42, 52, 36, 'i', 'fill="var(--h-biela)"')}${hTx(60, 48, 18, '/', 'fill="var(--h-biela)" opacity=".6"')}${hTx(80, 52, 36, 'y', 'fill="var(--sun)"')}<path d="M26 72h18" stroke-width="5"/><path d="M26 72h18" stroke="var(--h-biela)" stroke-width="2"/></g>`,
  cesticka: () => `<rect x="10" y="8" width="100" height="64" rx="9" fill="var(--h-kopec)"/><path d="M10 30h100M10 51h100M43 8v64M76 8v64" stroke-width="1.6" opacity=".35"/><path d="M27 61V41h33V20h32" fill="none" stroke="var(--h-biela)" stroke-width="6" stroke-dasharray="1 9"/>
    <circle cx="60" cy="61" r="8" fill="var(--leaf-d)"/><circle cx="27" cy="20" r="7" fill="var(--sky)"/><g transform="translate(13 49) scale(.15)" stroke-width="16">${mudraCasti('radost').hlava}</g><path d="M82 26l10-10 10 10v10H82z" fill="var(--coral)"/><path d="M80 27l12-12 12 12" fill="none"/><rect x="89" y="29" width="6" height="7" fill="var(--h-drevo)" stroke-width="2"/>`,
  hodiny: () => `<circle cx="56" cy="40" r="31" fill="var(--h-biela)"/><circle cx="56" cy="40" r="25" fill="none" stroke-width="2" stroke-dasharray=".1 13.1"/>${hTx(56, 22, 11, '12')}${hTx(78, 44, 11, '3')}${hTx(56, 66, 11, '6')}${hTx(34, 44, 11, '9')}<path d="M56 40l11-9" stroke="var(--coral)" stroke-width="5"/><path d="M56 40V17" stroke="var(--violet)" stroke-width="4"/><circle cx="56" cy="40" r="4" fill="var(--dk)"/><path d="M30 13l-6-6M82 13l6-6" stroke-width="4"/>${hS4(100, 20, 8, 'var(--sun)', 'stroke-width="2.5"')}${hS4(104, 56, 5, 'var(--sun)', 'stroke-width="2.2"')}`,
});
for (const k of ['kosiky', 'skryte', 'slabiky', 'ypsilon', 'cesticka', 'hodiny']) Object.defineProperty(OBR_HRY, k, { enumerable: true, configurable: true, get() { const v = `<svg class="hra-kresba" viewBox="0 0 120 80" aria-hidden="true"><g ${HI} stroke-width="3">${KRESBY_HIER[k]()}</g></svg>`; Object.defineProperty(OBR_HRY, k, { value: v, enumerable: true }); return v; } });

/* budovy týchto hier v dedinke sú v obrazky.js (dedinkaKresby, skupina hra) */

/* ---------- spoločný rámec hier 5.1 ---------- */
const H51_DOBRE = .7; // podiel kôl hneď správne, ktorý odomkne ďalšiu úroveň
const h51Kluc = id => `hra51-ur-${id}-${st.dietaId || 'x'}`;
const Hra51 = {
  urovne(id, mal) { const u = HRY51[id].urovne; return Array.isArray(u) ? u : u[mal ? 'm' : 's']; },
  odomknute(id, mal) { return Math.max(1, Math.min(this.urovne(id, mal).length, +S.get(h51Kluc(id), 1) || 1)); },
  novy(id, mal) { const h = { id, n51: true, mal, faza: 'vyber', i: -1, kola: [], spravne: 0, chyba: false, odp: false, krok: 0, vzate: [], zle: [] }; h.uroven = this.odomknute(id, mal); return h; },
  zacni(u) {
    const h = st.hra; if (!h || !h.n51 || h.faza !== 'vyber' || u > this.odomknute(h.id, h.mal)) return;
    Object.assign(h, { uroven: u, faza: 'hra', i: 0, spravne: 0, chyba: false, odp: false, krok: 0, vzate: [], zle: [] });
    h.kola = HRY51[h.id].kola(u, h.mal); if (HRY51[h.id].nove) HRY51[h.id].nove(h);
    Zvuk.play('start'); obnovStavHry(); this.obnov();
  },
  klik(b, d) {
    const h = st.hra; if (!h || !h.n51 || h.hotovo) return;
    if (d.h51 === 'ur') { this.zacni(+d.u); return; }
    if (h.faza === 'hra' && !h.odp) HRY51[h.id].klik(h, d, b);
  },
  // kolo hotové: ak bez chyby, ráta sa „hneď správne“; o chvíľu ďalšie kolo alebo koniec
  dobre(h, ms = 900) {
    if (!h.chyba) h.spravne++;
    h.odp = true; Zvuk.play('ok'); mudraHra(h.chyba ? 'radost' : 'oslava', 1200); if (!h.chyba) Haptika.hraj('spravne');
    obnovStavHry(); this.obnov();
    clearTimeout(h.dalsia);
    h.dalsia = setTimeout(() => this.dalej(h), ms);
  },
  dalej(h) {
    if (st.hra !== h || !h.odp) return;
    Object.assign(h, { i: h.i + 1, odp: false, chyba: false, krok: 0, vzate: [], zle: [] });
    if (h.i >= h.kola.length) { this.koniec(h); return; }
    if (HRY51[h.id].nove) HRY51[h.id].nove(h);
    this.obnov();
  },
  zle(h, el) {
    h.chyba = true; Zvuk.play('bad'); vibruj(60); mudraHra('povzbudenie');
    if (el && el.classList) { el.classList.remove('h51-tras'); void el.offsetWidth; el.classList.add('h51-tras'); }
  },
  koniec(h) {
    const mam = this.odomknute(h.id, h.mal), vs = this.urovne(h.id, h.mal);
    h.noveUr = null;
    if (h.spravne >= Math.ceil(h.kola.length * H51_DOBRE) && h.uroven === mam && mam < vs.length) { S.set(h51Kluc(h.id), mam + 1); h.noveUr = mam + 1; }
    Hra.koniec(false, h.spravne);
  },
  telo(h) { return h.faza === 'vyber' ? this.vyberHtml(h) : HRY51[h.id].html(h); },
  html(h) { return `<div id="h51" class="h51 h51-${h.id}" data-kolo="${h.i}">${this.telo(h)}</div>`; },
  obnov() { const h = st.hra; if (h && h.n51) obnovKolo(document.getElementById('h51'), h, this.telo(h)); },
  stav(h) { return h.faza === 'vyber' ? ['hviezda', 'Úrovne'] : ['check', h.spravne + ' z ' + h.kola.length]; },
  vyberHtml(h) {
    const info = HRY.find(x => x.id === h.id), vs = this.urovne(h.id, h.mal), mam = this.odomknute(h.id, h.mal);
    return `<div class="card h51-uvod"><span class="hr-obr">${OBR_HRY[h.id]}</span><p>${esc(info.p)}</p></div>
      <p class="hadaj-otazka">Vyber si úroveň</p>
      <div class="h51-urovne">${vs.map((u, i) => { const n = i + 1, zam = n > mam;
        return `<button class="h51-ur${zam ? ' zamk' : ''}${n === mam ? ' teraz' : ''}" data-h51="ur" data-u="${n}"${zam ? ' disabled' : ''} style="--i:${i}" aria-label="Úroveň ${n}: ${esc(u.n)}${zam ? ', zamknutá' : ''}">
          <b class="h51-c">${zam ? ikn('zamok') : n}</b><span class="h51-t"><b>${esc(u.n)}</b><small>${zam ? `Odomkne sa po úrovni ${n - 1}` : esc(u.p)}</small></span>${n < mam ? `<span class="h51-ok">${ikn('check')}</span>` : n === mam ? `<span class="h51-hraj">${ikn('hraj')}</span>` : ''}</button>`; }).join('')}</div>`;
  },
  vysl(h) {
    const vs = this.urovne(h.id, h.mal);
    if (h.noveUr) return `<p class="vysl-t h51-nova">${ikn('kluc')}Odomkla sa úroveň ${h.noveUr}: ${esc(vs[h.noveUr - 1].n)}</p>`;
    const u = vs[h.uroven - 1]; return u ? `<p class="vysl-t">Úroveň ${h.uroven}: ${esc(u.n)}</p>` : '';
  },
};
// 5.1: let veci k cieľu (kópia nad stránkou), pri chybe len kúsok k cieľu a späť; bez pohybu pri prefers-reduced-motion
const h51Pohyb = () => !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
function h51Let(z, ciel, o = {}) {
  if (!z || !ciel || !z.animate || !h51Pohyb()) return;
  const a = z.getBoundingClientRect(), c = ciel.getBoundingClientRect();
  const dx = c.left + c.width / 2 - (a.left + a.width / 2), dy = c.top + c.height * (o.vyska || .5) - (a.top + a.height / 2);
  if (o.spat) { z.animate([{ translate: '0 0' }, { translate: `${(dx * .35).toFixed(1)}px ${(dy * .35).toFixed(1)}px`, offset: .4 }, { translate: '0 0' }], { duration: 460, easing: 'ease-in-out' }); return; }
  const k = z.cloneNode(true);
  Object.assign(k.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', margin: '0', zIndex: '60', pointerEvents: 'none', animation: 'none' });
  k.setAttribute('aria-hidden', 'true'); document.body.appendChild(k);
  const m = o.mierka || .45;
  k.animate([{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${(dx * .5).toFixed(1)}px, ${(dy * .5 - (o.obluk ?? 56)).toFixed(1)}px) scale(${((1 + m) / 2).toFixed(2)}) rotate(-8deg)`, offset: .5 },
    { transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${m})` }], { duration: o.ms || 520, easing: 'cubic-bezier(.45, 0, .55, 1)', fill: 'forwards' }).onfinish = () => k.remove();
}
// obrázok z kresieb hry „Čo je iné?“ (obrazky.js)
const h51Obr = k => `<span class="kv-it">${ineSvg(INE_OBR[k]())}</span>`;
const h51Velke = s => s.toLocaleUpperCase('sk');

// 5.1: lokomotíva Slabikového vláčika (pozerá doprava, za ňou vagóny so spriahadlami, všetko na koľajniciach)
const SLAB_LOKO = `<svg class="vl-loko" viewBox="0 0 92 66" aria-hidden="true"><g stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
  <g class="vl-dym" stroke="none" fill="#fff"><circle cx="62" cy="9" r="5"/><circle cx="54" cy="5" r="3.6"/><circle cx="47" cy="3" r="2.6"/></g>
  <path d="M59 28 v-10 h-3 v-5 h13 v5 h-3 v10" fill="#4A4566"/>
  <path d="M28 27 h46 q9 0 9 9 v15 H28z" fill="var(--sky)"/><path d="M31 31 h40" stroke="#fff" stroke-width="2.4" opacity=".5"/><path d="M44 27 v24 M70 27 v24" stroke-width="2"/>
  <path d="M47 27 q0 -6 5 -6 q5 0 5 6" fill="var(--sun)"/><circle cx="84" cy="35" r="3.2" fill="var(--sun)"/>
  <path d="M3 51 V15 h28 v36z" fill="var(--coral)"/><path d="M0 14 h34" stroke-width="4.4"/><rect x="8" y="20" width="17" height="13" rx="2.4" fill="var(--h-nebo)" stroke-width="2.2"/>
  <rect x="1" y="49" width="84" height="5" rx="2" fill="#4A4566"/><path d="M84 47 l7 10 h-9z" fill="#4A4566"/>
  <g class="kol"><circle cx="16" cy="56" r="8.5" fill="#6E6890"/><path d="M16 48 v16 M8 56 h16" stroke-width="1.8"/><circle cx="16" cy="56" r="2.2" fill="var(--sun)" stroke-width="1.4"/></g>
  <g class="kol"><circle cx="48" cy="58" r="6.5" fill="#6E6890"/><path d="M48 52 v12 M42 58 h12" stroke-width="1.8"/></g>
  <g class="kol"><circle cx="68" cy="58" r="6.5" fill="#6E6890"/><path d="M68 52 v12 M62 58 h12" stroke-width="1.8"/></g>
  <path class="vl-ojnica" d="M16 59 H68" stroke="var(--sun)" stroke-width="2.4"/><path d="M-4 52 h6" stroke-width="3"/>
</g></svg>`;
/* ---------- Do košíkov: triedenie do 2 až 4 košíkov ---------- */
const KOS_SK = {
  zvierata: ['Zvieratá', ['pes', 'kôň', 'mačka', 'krava', 'prasa', 'ovca', 'zajac', 'slon', 'lev', 'žirafa']],
  ovocie: ['Ovocie', ['jablko', 'hruška', 'banán', 'pomaranč', 'jahoda', 'hrozno', 'slivka']],
  zelenina: ['Zelenina', ['mrkva', 'paprika', 'uhorka']],
  oblecenie: ['Oblečenie', ['ponožka', 'čiapka', 'tričko', 'čižma', 'topánka', 'sandál']],
  hracky: ['Hračky', ['lopta', 'medvedík', 'kocky']],
  zem: ['Jazdí po zemi', ['auto', 'autobus', 'bicykel', 'vlak', 'električka']],
  vzduch: ['Lieta', ['lietadlo', 'vrtuľník', 'raketa']],
  voda: ['Pláva po vode', ['loď', 'ponorka', 'čln']],
  lieta: ['Lieta', ['orol', 'sova', 'vrabec', 'holub', 'včela', 'motýľ', 'mucha']],
  plava: ['Pláva', ['kapor', 'pstruh', 'žralok', 'ryba', 'delfín', 'tuleň']],
  chodi: ['Chodí', ['pes', 'kôň', 'mačka', 'krava', 'slon', 'lev', 'tiger', 'žirafa', 'ťava']],
  naradie: ['Náradie', ['kladivo', 'píla', 'skrutkovač']],
  nastroje: ['Hudobné nástroje', ['husle', 'gitara', 'klavír', 'flauta', 'trúbka']],
  pisanie: ['Píše a kreslí', ['pero', 'ceruzka', 'fixka']],
  cicavce: ['Cicavce', ['pes', 'kôň', 'krava', 'slon', 'tiger', 'vlk', 'netopier', 'delfín', 'tuleň', 'ťava']],
  vtaky: ['Vtáky', ['orol', 'sova', 'vrabec', 'holub', 'tučniak']],
  ryby: ['Ryby', ['kapor', 'pstruh', 'žralok', 'ryba']],
  plazy: ['Plazy', ['jašterica', 'had', 'korytnačka']],
  hmyz: ['Hmyz', ['včela', 'motýľ', 'mucha']],
};
// zradné veci: pri nich Múdra po správnej odpovedi vysvetlí prečo
const KOS_PRECO = { netopier: 'Netopier lieta, ale je to cicavec. Kojí mláďatá.', delfín: 'Delfín žije v mori, ale je to cicavec. Dýcha vzduch.', tuleň: 'Tuleň pláva, ale je to cicavec.',
  tučniak: 'Tučniak nelieta, ale je to vták. Má perie a zobák.', žralok: 'Žralok je ryba. Dýcha žiabrami.', korytnačka: 'Korytnačka je plaz, hoci má pancier.', had: 'Had je plaz. Nemá nohy, ale má šupiny.' };
const KOS_URO = {
  m: [{ n: 'Zviera alebo ovocie', p: 'Dva košíky', k: ['zvierata', 'ovocie'] }, { n: 'Do kuchyne a do skrine', p: 'Tri košíky', k: ['ovocie', 'zelenina', 'oblecenie'] },
    { n: 'Čím cestujeme', p: 'Po zemi, vzduchom, po vode', k: ['zem', 'vzduch', 'voda'] }, { n: 'Kto lieta a kto pláva', p: 'Zvieratá v troch košíkoch', k: ['lieta', 'plava', 'chodi'] }],
  s: [{ n: 'Čím cestujeme', p: 'Po zemi, vzduchom, po vode', k: ['zem', 'vzduch', 'voda'] }, { n: 'Dielňa a hudba', p: 'Náradie, nástroje, písanie', k: ['naradie', 'nastroje', 'pisanie'] },
    { n: 'Cicavec, vták, ryba', p: 'Pozor na zradné zvieratá', k: ['cicavce', 'vtaky', 'ryby'] }, { n: 'Malí a studenokrvní', p: 'Hmyz, plazy, vtáky, ryby', k: ['hmyz', 'plazy', 'vtaky', 'ryby'] },
    { n: 'Majster prírodovedy', p: 'Štyri košíky, samé zradné', k: ['cicavce', 'vtaky', 'ryby', 'plazy'], zrada: true }],
};
const KOS_FARBY = ['var(--coral)', 'var(--sky)', 'var(--sun)', 'var(--violet)'];
function kosKola(u, mal) {
  const U = KOS_URO[mal ? 'm' : 's'][u - 1], n = 8, out = [], bolo = new Set();
  const pool = U.k.map(k => mix(KOS_SK[k][1].length).map(i => KOS_SK[k][1][i]).filter(x => !U.k.some(j => j !== k && KOS_SK[j][1].includes(x)) && !(mal && x === KOS_SK[k][1][0]))); // prvá vec je v košíku ako vzor
  if (U.zrada) pool.forEach(p => p.sort((a, b) => (KOS_PRECO[b] ? 1 : 0) - (KOS_PRECO[a] ? 1 : 0)));
  for (let i = 0; out.length < n && i < 40; i++) { const kk = i < U.k.length * 2 ? i % U.k.length : nahodne(U.k.length), v = pool[kk].find(x => !bolo.has(x)); if (v) { bolo.add(v); out.push({ v, k: kk }); } }
  return mix(out.length).map(i => ({ ...out[i], kosy: U.k }));
}
const kosKos = (k, i, plny, ciel, vzor) => `<button class="kos${ciel ? ' ciel' : ''}" data-h51="kos" data-k="${i}" style="--kc:${KOS_FARBY[i]}" aria-label="Košík ${esc(KOS_SK[k][0])}">
  <span class="kos-n">${esc(KOS_SK[k][0])}</span><span class="kos-vnutri">${plny.slice(-3).map(v => `<span class="kos-mini">${ineSvg(INE_OBR[v]())}</span>`).join('') || (vzor ? `<span class="kos-mini prazdny">${ineSvg(INE_OBR[KOS_SK[k][1][0]]())}</span>` : '')}</span>
  <svg class="kos-obr" viewBox="0 0 100 46" aria-hidden="true"><g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"><path d="M4 6h92l-8 36H12z" fill="var(--h-drevo)"/><path d="M8 18h84M10 30h80" fill="none" stroke-width="2"/><path d="M30 6l-4 36M50 6v36M70 6l4 36" fill="none" stroke-width="1.6" opacity=".5"/><path d="M2 4h96v8H2z" fill="var(--kc)"/></g></svg></button>`;
const HRY51 = {
  kosiky: {
    urovne: { m: KOS_URO.m, s: KOS_URO.s },
    kola: kosKola,
    html(h) {
      const k = h.kola[h.i], plne = k.kosy.map((_, i) => h.kola.slice(0, h.i + (h.odp ? 1 : 0)).filter(x => x.k === i).map(x => x.v));
      return `<div class="card kos-vec${h.odp ? ' vlozena' : ''}" style="--kc:${KOS_FARBY[k.k]}">${h51Obr(k.v)}<small class="kv-nap">${esc(k.v)}</small></div>
        <p class="hadaj-otazka">${h.odp && KOS_PRECO[k.v] ? esc(KOS_PRECO[k.v]) : 'Do ktorého košíka to patrí?'}</p>
        <div class="kosy kosy-${k.kosy.length}">${k.kosy.map((kk, i) => kosKos(kk, i, plne[i], h.odp && i === k.k, h.mal)).join('')}</div>`;
    },
    klik(h, d, b) {
      if (d.h51 !== 'kos') return;
      const k = h.kola[h.i];
      const vec = document.querySelector('.kos-vec .kv-it');
      if (+d.k !== k.k) { h51Let(vec, b, { spat: true, vyska: .7 }); Hra51.zle(h, b); return; }
      h51Let(vec, b, { vyska: .62 });
      Hra51.dobre(h, KOS_PRECO[k.v] && h.uroven > 2 ? 2200 : 950);
      if (b && b.getBoundingClientRect) { const [x, y] = stred(b); FX.burst(x, y, 10, ['star', 'dot'], 5); }
    },
  },

  /* ---------- Kto sa skryl?: hľadanie zvieratiek a vecí v dedinke ---------- */
  skryte: {
    urovne: { m: [{ n: 'Kde je?', p: 'Päť vecí, nájdi jednu' }, { n: 'Viac vecí', p: 'Osem vecí, nájdi jednu' }, { n: 'Nájdi všetky', p: 'Dve alebo tri rovnaké' }, { n: 'Skryté za kríkmi', p: 'Niektoré vykúkajú spoza kríkov' }],
      s: [{ n: 'Viac vecí', p: 'Osem vecí, nájdi jednu' }, { n: 'Nájdi všetky', p: 'Dve alebo tri rovnaké' }, { n: 'Skryté za kríkmi', p: 'Niektoré vykúkajú spoza kríkov' }, { n: 'Plná dedinka', p: 'Štrnásť vecí, nájdi všetky' }, { n: 'Orlie oko', p: 'Malé a ďaleko, aj štyri naraz' }] },
    kola(u, mal) {
      const L = mal ? [[5, 1, 0], [8, 1, 0], [9, 2, 0], [11, 3, 1]][u - 1] : [[8, 1, 0], [10, 3, 0], [12, 3, 1], [14, 3, 1], [16, 4, 2]][u - 1];
      const ciele = mix(SKR_CIELE.length).map(i => SKR_CIELE[i]).slice(0, 6);
      return ciele.map(c => skrScena(c, L[0], L[1] === 1 ? 1 : Math.max(2, L[1] - nahodne(2)), L[2]));
    },
    html(h) {
      const k = h.kola[h.i], n = k.ciele.length, nasiel = h.vzate.length;
      return `<div class="card skr-ulohe"><span class="skr-ciel">${dedinkaKresby.svg(k.c, {})}</span><b>${n > 1 ? `Nájdi všetky: ${esc(SKR_MENA[k.c][1])}` : `Nájdi ${esc(SKR_MENA[k.c][0])}`}</b>
        <span class="skr-body">${Array.from({ length: n }, (_, i) => `<i class="${i < nasiel ? 'ok' : ''}"></i>`).join('')}</span></div>
        <div class="frame skr-pole"><svg class="skr-svg" viewBox="0 0 360 290" role="group" aria-label="Dedinka, v ktorej sa niečo skrylo">${skrPozadie()}<g class="skr-pady">${k.veci.map(skrPad).join('')}</g><g stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${k.veci.map((v, i) => skrVec(v, i)).join('')}</g><g class="skr-kruhy">${k.veci.filter(v => h.vzate.includes(v.i)).map(skrKruh).join('')}</g>${h.zle.map(z => `<g class="skr-x" transform="translate(${z[0]} ${z[1]})"><path d="M-7 -7l14 14M7 -7l-14 14" stroke="var(--coral)" stroke-width="4" stroke-linecap="round"/></g>`).join('')}</svg></div>`;
    },
    klik(h, d) {
      if (d.h51 !== 'sk') return;
      const k = h.kola[h.i], i = +d.i;
      if (h.vzate.includes(i)) return;
      if (k.ciele.includes(i)) {
        h.vzate.push(i);
        if (h.vzate.length < k.ciele.length) { Zvuk.play('pop'); mudraHra('radost', 700); Hra51.obnov(); return; }
        Hra51.dobre(h, 1000); return;
      }
      const v = k.veci.find(x => x.i === i); h.zle = [[v.x, v.y - 12 * v.s]]; Hra51.zle(h); Hra51.obnov();
      setTimeout(() => { if (st.hra === h) { h.zle = []; Hra51.obnov(); } }, 700);
    },
  },

  /* ---------- Slabikový vláčik: slovo zo slabík (mladší) ---------- */
  slabiky: {
    urovne: [{ n: 'Dve ľahké slabiky', p: 'RY-BA, SO-VA' }, { n: 'Dve slabiky', p: 'MAČ-KA, LOP-TA' }, { n: 'Tri slabiky', p: 'JA-HO-DA' }, { n: 'Dlhé slová', p: 'Štyri slabiky a navyše vagóniky' }],
    kola(u) {
      const zoz = SLAB_SL[u - 1], vyber = mix(zoz.length).slice(0, 6).map(i => zoz[i]), navyse = [1, 2, 2, 3][u - 1];
      const vsetky = SLAB_SL.flat().flatMap(([s]) => s.split('-'));
      return vyber.map(([s, o]) => {
        const sl = s.split('-').map(h51Velke), ine = mix(vsetky.length).map(i => h51Velke(vsetky[i])).filter((x, i, a) => !sl.includes(x) && a.indexOf(x) === i).slice(0, navyse);
        return { o, sl, moz: mix(sl.length + ine.length).map(i => [...sl, ...ine][i]) };
      });
    },
    html(h) {
      const k = h.kola[h.i];
      return `<div class="card kv-prompt obraz slab-obr">${h51Obr(k.o)}</div>
        <div class="trat${h.odp ? ' ide' : !h.krok ? ' pride' : ''}" aria-label="Vláčik so slovom"><div class="vlacik">${k.sl.map((s, j) => `<span class="vagon${j < h.krok ? ' plny' : ''}" style="--vc:${KV_FARBY[(j + 3) % 6]}"><b>${j < h.krok ? esc(s) : ''}</b><i class="vg-k"></i><i class="vg-k"></i></span>`).join('')}${SLAB_LOKO}</div></div>
        <div class="kv-moz pismena slab-moz">${k.moz.map((m, j) => `<button class="btn dve kv-btn${h.vzate.includes(j) ? ' vzata' : ''}" data-h51="sl" data-j="${j}"${h.vzate.includes(j) ? ' disabled' : ''}>${esc(m)}</button>`).join('')}</div>`;
    },
    klik(h, d, b) {
      if (d.h51 !== 'sl') return;
      const k = h.kola[h.i], j = +d.j;
      if (h.vzate.includes(j)) return;
      if (k.moz[j] !== k.sl[h.krok]) { Hra51.zle(h, b); return; }
      h.vzate.push(j); h.krok++;
      if (h.krok < k.sl.length) { Zvuk.play('pop'); Hra51.obnov(); return; }
      Hra51.dobre(h, 1400); Zvuk.play('whoosh');
    },
  },

  /* ---------- I alebo Y? (starší): tvrdé a mäkké spoluhlásky, vybrané slová ---------- */
  ypsilon: {
    urovne: [{ n: 'Tvrdé a mäkké', p: 'DY, TY, ČI, ŽI…' }, { n: 'Vybrané slová po B', p: 'byť, býk, bicykel' }, { n: 'Po M a P', p: 'myš, pýcha, pivo' }, { n: 'Po R a S', p: 'ryba, syr, sila' }, { n: 'Po V, Z a L', p: 'vysoký, jazyk, lyže' }],
    kola(u) {
      const z = YPS_SL[u - 1], y = mix(z.y.length).slice(0, 4).map(i => z.y[i]), i = mix(z.i.length).slice(0, 4).map(j => z.i[j]);
      return mix(8).map(j => [...y, ...i][j]).map(w => { const m = /\{(.)\}/.exec(w), p = m[1], dlhe = 'íý'.includes(p);
        return { w, p, moz: dlhe ? ['í', 'ý'] : ['i', 'y'], cele: w.replace(/[{}]/g, ''), x: u === 1 ? ('yý'.includes(p) ? 'Po tvrdej spoluhláske píšeme y.' : 'Po mäkkej spoluhláske píšeme i.') : 'yý'.includes(p) ? 'Píše sa y: vybrané alebo príbuzné slovo.' : 'Píše sa i: nie je to vybrané slovo.' }; });
    },
    html(h) {
      const k = h.kola[h.i], [a, b] = k.w.split(/\{.\}/);
      return `<div class="tabula"><span class="tab-slovo">${esc(a)}<span class="tab-medz${h.odp ? ' plna' : ''}">${h.odp ? esc(k.p) : ''}</span>${esc(b)}</span><span class="krieda"></span></div>
        <p class="hadaj-otazka">${h.odp ? esc(k.x) : 'Ktoré písmeno chýba?'}</p>
        <div class="kv-moz kv-2 yps-moz">${k.moz.map(m => `<button class="btn dve kv-btn${h.odp && m === k.p ? ' ok' : ''}${h.zle.includes(m) ? ' zle' : ''}" data-h51="yp" data-p="${m}"${h.zle.includes(m) ? ' disabled' : ''}>${m}</button>`).join('')}</div>`;
    },
    klik(h, d, b) {
      if (d.h51 !== 'yp') return;
      const k = h.kola[h.i];
      const medz = document.querySelector('.tab-medz');
      if (d.p !== k.p) { h51Let(b, medz, { spat: true }); h.zle.push(d.p); Hra51.zle(h, b); Hra51.obnov(); return; }
      h51Let(b, medz, { mierka: .7, obluk: 30, ms: 460 });
      Hra51.dobre(h, 1900);
    },
  },

  /* ---------- Cestička: Múdra ide šípkami k domčeku ---------- */
  cesticka: {
    urovne: { m: [{ n: 'Krok po kroku', p: 'Ťukaj šípky, Múdra ide hneď' }, { n: 'S hviezdičkou', p: 'Najprv hviezdička, potom domček' }, { n: 'Naplánuj cestu', p: 'Najprv celý plán, potom Choď' }, { n: 'Plán s hviezdičkou', p: 'Plán cez hviezdičku k domčeku' }],
      s: [{ n: 'S hviezdičkou', p: 'Najprv hviezdička, potom domček' }, { n: 'Naplánuj cestu', p: 'Najprv celý plán, potom Choď' }, { n: 'Plán s hviezdičkou', p: 'Plán cez hviezdičku k domčeku' }, { n: 'Veľká mapa', p: 'Šesť na šesť, viac prekážok' }, { n: 'Majster ciest', p: 'Najkratší plán, ani krok navyše' }] },
    kola(u, mal) {
      // [veľkosť, prekážky, hviezda, plán, len najkratší]
      const L = mal ? [[4, 3, 0, 0, 0], [5, 6, 1, 0, 0], [4, 4, 0, 1, 0], [5, 6, 1, 1, 0]][u - 1] : [[5, 6, 1, 0, 0], [5, 6, 0, 1, 0], [5, 7, 1, 1, 0], [6, 11, 1, 1, 0], [6, 12, 1, 1, 1]][u - 1];
      return Array.from({ length: 5 }, () => cesMapa(...L));
    },
    nove(h) { const k = h.kola[h.i]; Object.assign(h, { poz: k.s.slice(), hv: !k.hv, plan: [], kroky: 0, ide: false }); },
    html(h) {
      const k = h.kola[h.i], N = k.n, T = 44, W = N * T;
      const pol = (x, y) => `translate(${x * T + T / 2} ${y * T + T / 2})`;
      const bunky = k.m.map((r, y) => r.map((c, x) => `<rect x="${x * T + 1.5}" y="${y * T + 1.5}" width="${T - 3}" height="${T - 3}" rx="8" fill="${(x + y) % 2 ? 'var(--ces-a)' : 'var(--ces-b)'}" stroke="none"/>` +
        (c === 1 ? `<g transform="${pol(x, y)}">${CES_PREK[(x * 3 + y * 5) % CES_PREK.length]}</g>` : '')).join('')).join('');
      const cil = `<g transform="${pol(k.g[0], k.g[1])}"><path d="M-14 14V-2L0 -14 14 -2v16z" fill="var(--coral)"/><path d="M-17 0L0 -16 17 0" fill="none" stroke-width="3"/><rect x="-5" y="3" width="10" height="11" rx="2" fill="var(--h-drevo)" stroke-width="2"/></g>`;
      const hviezda = k.hv && !h.hv ? `<g transform="${pol(k.hv[0], k.hv[1])}" class="ces-hv">${hS5(0, 0, 13, 'var(--sun)', 2.6)}</g>` : '';
      const sova = `<g class="ces-sova" style="transform:translate(${h.poz[0] * T + T / 2}px,${h.poz[1] * T + T / 2}px)"><g transform="translate(-19 -18) scale(.19)" stroke-width="12">${mudraCasti(h.odp ? 'oslava' : 'radost').hlava}</g></g>`;
      const sip = (s, a) => `<button class="btn dve ces-sip" data-h51="sip" data-s="${s}" aria-label="${a}"${h.ide || h.odp ? ' disabled' : ''}>${ikn('sipka')}</button>`;
      return `<p class="hadaj-otazka">${h.odp ? 'Si doma!' : k.hv && !h.hv ? 'Vezmi hviezdičku a choď domov' : 'Doveď Múdru k domčeku'}${k.min ? ` <small class="ces-min">plán najviac ${k.opt} krokov</small>` : ''}</p>
        <div class="frame ces-pole${h.odp ? ' doma' : ''}"><svg viewBox="0 0 ${W} ${W}" class="ces-svg" aria-label="Mapa ${N} na ${N}"><g stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${bunky}${cil}${hviezda}${sova}</g></svg></div>
        ${k.plan ? `<div class="ces-plan" aria-label="Plán cesty">${h.plan.length ? h.plan.map((s, i) => `<span class="ces-krok${h.ide && i === h.ideI ? ' teraz' : ''}" style="--r:${CES_UHOL[s]}deg">${ikn('sipka')}</span>`).join('') : '<small>Ťukaj šípky a poskladaj plán cesty</small>'}</div>` : ''}
        <div class="ces-ovl"><div class="ces-kriz">${sip('h', 'Hore')}${sip('l', 'Vľavo')}${sip('p', 'Vpravo')}${sip('d', 'Dole')}</div>
          ${k.plan ? `<div class="ces-akcie"><button class="btn dve ces-zmaz" data-h51="zmaz"${!h.plan.length || h.ide || h.odp ? ' disabled' : ''} aria-label="Zmazať posledný krok">${ikn('spat')}</button><button class="btn ces-chod" data-h51="chod"${!h.plan.length || h.ide || h.odp ? ' disabled' : ''}>${ikn('hraj')}Choď</button></div>` : `<small class="ces-kroky">${h.kroky} ${slovoTahy(h.kroky).replace('ťah', 'krok')}</small>`}</div>`;
    },
    klik(h, d, b) {
      const k = h.kola[h.i];
      if (h.ide) return;
      if (d.h51 === 'sip') {
        if (k.plan) { if (h.plan.length < 14) { h.plan.push(d.s); Zvuk.play('tap'); Hra51.obnov(); } return; }
        const n = cesKrok(k, h.poz, d.s); h.kroky++;
        if (!n) { Hra51.zle(h, b); Hra51.obnov(); return; }
        h.poz = n; Zvuk.play('pop'); cesVezmi(h, k);
        if (cesDoma(h, k)) { if (h.kroky > k.opt) h.chyba = true; Hra51.dobre(h, 1100); return; }
        Hra51.obnov(); return;
      }
      if (d.h51 === 'zmaz' && k.plan) { h.plan.pop(); Zvuk.play('whoosh'); Hra51.obnov(); return; }
      if (d.h51 === 'chod' && k.plan && h.plan.length) cesChod(h, k);
    },
  },

  /* ---------- Koľko je hodín?: ručičkové hodiny ---------- */
  hodiny: {
    urovne: { m: [{ n: 'Celé hodiny', p: '3:00, 7:00' }, { n: 'Pol hodiny', p: '3:30' }, { n: 'Štvrťhodiny', p: '3:15, 3:45' }, { n: 'Po piatich minútach', p: '3:05, 3:20' }],
      s: [{ n: 'Pol hodiny', p: '3:30' }, { n: 'Štvrťhodiny', p: '3:15, 3:45' }, { n: 'Po piatich minútach', p: '3:05, 3:20' }, { n: 'Slovami', p: 'pol štvrtej, štvrť na päť' }, { n: 'Zradné slová', p: 'pol štvrtej alebo pol tretej?' }] },
    kola(u, mal) {
      const typ = mal ? u : u + 1, n = mal ? 3 : 4, out = [], bolo = new Set();
      while (out.length < 6) {
        const hod = 1 + nahodne(12), min = typ === 1 ? 0 : typ === 2 ? [0, 30][nahodne(2)] : typ === 3 || typ >= 5 ? [0, 15, 30, 45][nahodne(4)] : 5 * nahodne(12);
        const c = hod + ':' + min; if (bolo.has(c) || (typ >= 3 && out.length < 4 && min === 0)) continue; bolo.add(c);
        const slovom = typ >= 5, moz = hodMoznosti(hod, min, n, typ);
        out.push({ hod, min, slovom, sprav: hodText(hod, min, slovom), moz: moz.map(([a, b]) => hodText(a, b, slovom)) });
      }
      return out;
    },
    html(h) {
      const k = h.kola[h.i];
      return `<div class="card hod-karta">${hodinySvg(k.hod, k.min)}</div>
        <p class="hadaj-otazka">${h.odp ? esc(k.slovom ? `Na hodinách je ${hodText(k.hod, k.min)}.` : k.min % 15 ? `Správne: ${k.sprav}` : `Hovoríme: ${hodText(k.hod, k.min, true)}.`) : 'Koľko je hodín?'}</p>
        <div class="kv-moz kv-${k.moz.length === 4 ? 4 : 3} hod-moz${k.slovom ? ' slovom' : ''}">${k.moz.map(m => `<button class="btn dve kv-btn${h.odp && m === k.sprav ? ' ok' : ''}${h.zle.includes(m) ? ' zle' : ''}" data-h51="hod" data-t="${esc(m)}"${h.zle.includes(m) ? ' disabled' : ''}>${esc(m)}</button>`).join('')}</div>`;
    },
    klik(h, d, b) {
      if (d.h51 !== 'hod') return;
      const k = h.kola[h.i];
      if (d.t !== k.sprav) { h.zle.push(d.t); Hra51.zle(h, b); Hra51.obnov(); return; }
      Hra51.dobre(h, 1500);
    },
  },
};

/* Kto sa skryl?: ciele (kresby Dedinky) a ich mená (koho hľadáme / všetky) */
const SKR_MENA = { sliepka: ['sliepku', 'sliepky'], kacka: ['kačku', 'kačky'], zajac: ['zajaca', 'zajace'], jez: ['ježka', 'ježkov'], macka: ['mačku', 'mačky'], ovca: ['ovečku', 'ovečky'], pes: ['psíka', 'psíkov'],
  studna: ['studňu', 'studne'], strasiak: ['strašiaka', 'strašiakov'], sud: ['sud', 'sudy'], hojdacka: ['hojdačku', 'hojdačky'], slnecnica: ['slnečnicu', 'slnečnice'], huby: ['hríby', 'hríby'] };
const SKR_CIELE = Object.keys(SKR_MENA).filter(k => k !== 'huby');
const SKR_INE = ['sliepka', 'kacka', 'zajac', 'jez', 'macka', 'ovca', 'pes', 'studna', 'strasiak', 'sud', 'hojdacka', 'slnecnica', 'kvety', 'kamene', 'seno', 'lavicka', 'tulipany', 'huby', 'schranka'];
const SKR_STROMY = ['gulaty', 'smrek', 'breza', 'jablon', 'ceresna'];
const SKR_FARBY = { macka: ['sun-d', 'drevo-d', 'kamen', 'biela', 'coral'], pes: ['drevo', 'drevo-d', 'sun-d', 'kamen', 'biela'], sliepka: ['biela', 'drevo', 'sun-d', 'coral'], kacka: ['sun', 'biela', 'drevo', 'sky'] };
// jedna scéna: ciele + iné veci + stromy vzadu, rozhodené po mriežke s posunom; pri „skrytých“ stojí pred cieľom krík
function skrScena(c, n, kolko, skryt) {
  const miesta = [];
  for (let r = 0; r < 4; r++) for (let s = 0; s < 6; s++) miesta.push([32 + s * 64 + (r % 2 ? 30 : 0) + nahodne(14) - 7, 136 + r * 44 + nahodne(8)]);
  const por = mix(miesta.length).map(i => miesta[i]).filter(([x]) => x > 22 && x < 338), veci = [], ciele = [];
  const vec = (k, [x, y], ciel) => { const v = { k, x, y, s: (.95 + (y - 136) / 140 * .5) * (n > 13 ? .8 : 1), zrk: Math.random() < .5, f: SKR_FARBY[k] ? SKR_FARBY[k][nahodne(SKR_FARBY[k].length)] : null }; if (ciel) ciele.push(veci.length); veci.push(v); return v; };
  for (let i = 0; i < kolko; i++) { const v = vec(c, por.shift(), true); if (skryt && i < skryt + (n > 13 ? 1 : 0)) veci.push({ k: 'ker', x: v.x + (nahodne(2) ? 12 : -12) * v.s, y: v.y + 4, s: v.s * 1.05, krik: true }); }
  const ine = mix(SKR_INE.length).map(i => SKR_INE[i]).filter(k => k !== c);
  for (let i = 0; veci.filter(v => !v.krik).length < n && por.length; i++) vec(ine[i % ine.length], por.shift(), false);
  // stromy vzadu (nedajú sa ťuknúť, len krajina)
  const stromy = [0, 1, 2, 3].map(i => ({ k: SKR_STROMY[(i + nahodne(5)) % 5], x: 25 + i * 100 + nahodne(40), y: 120 + nahodne(8), s: .9, strom: true }));
  return { c, ciele: ciele.map(x => x + stromy.length), veci: [...stromy, ...veci].map((v, i) => ({ ...v, i })).sort((a, b) => a.y - b.y || (a.krik ? 1 : -1)) };
}
// pozadie: nebo, mraky, vzdialený kopec a zelená lúka; päty stromov (y 120 a viac) stoja vždy v zelenej, nad líniou trávy (y 90 až 106)
const SKR_KVET = [[22, 160, 'coral'], [70, 150, 'sun'], [96, 262, 'violet'], [150, 150, 'coral'], [196, 244, 'sun'], [244, 156, 'violet'], [300, 166, 'coral'], [338, 252, 'sun'], [48, 282, 'sun'], [316, 280, 'violet']];
const skrPozadie = () => `<rect width="360" height="290" fill="var(--dv-nebo)"/><circle cx="318" cy="34" r="17" fill="var(--sun)" stroke="var(--ink)" stroke-width="2.5" class="skr-slnko"/><g stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round" pointer-events="none">${dedinkaVec('oblak1', { x: 66, y: 44, s: .62 })}${dedinkaVec('oblak2', { x: 196, y: 30, s: .5 })}</g><path d="M0 84Q60 50 130 76T260 64T360 74V290H0z" fill="var(--dv-kopec2)" stroke="var(--ink)" stroke-width="2.5"/><path d="M0 106Q90 90 180 100T360 94V290H0z" fill="var(--dv-zem)" stroke="var(--ink)" stroke-width="2.5"/><g pointer-events="none" stroke="var(--ink)" stroke-width="1.2">${SKR_KVET.map(([x, y, c]) => '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="var(--' + c + ')"/>').join('')}</g>`;
// vec v scéne: viditeľná kresba sama chytí ťuknutie (bez neviditeľných plôch navrchu); stromy a kríky ťuknutie prepúšťajú, aby sa dalo ťuknúť na vykúkajúcu vec za krížkom
function skrVec(v, poz) {
  const html = dedinkaVec(v.k, { x: v.x, y: v.y, s: v.s, zrkadlo: v.zrk, ...(v.f ? { farba: v.f } : {}) });
  if (v.strom || v.krik) return `<g pointer-events="none">${html}</g>`;
  return `<g class="skr-vec" data-h51="sk" data-i="${v.i}" role="button" tabindex="0" aria-label="Vec ${poz + 1}">${html}</g>`;
}
// rámček veci v súradniciach scény (pri zrkadlení sa preklopí)
function skrRamec(v) {
  const r = dedinkaKresby.RAMCEK[v.k] || [-20, -40, 40, 40], x0 = v.zrk ? -(r[0] + r[2]) : r[0];
  return [v.x + x0 * v.s, v.y + r[1] * v.s, r[2] * v.s, r[3] * v.s];
}
// neviditeľná plocha okolo veci, pod všetkými kresbami: chytí len ťuknutie mimo viditeľných vecí a najbližšia (nižšia) vec vyhrá
function skrPad(v) {
  if (v.strom || v.krik) return '';
  const [x, y, w, h] = skrRamec(v), p = 6;
  return `<rect data-h51="sk" data-i="${v.i}" x="${(x - p).toFixed(1)}" y="${(y - p).toFixed(1)}" width="${(w + 2 * p).toFixed(1)}" height="${(h + 2 * p).toFixed(1)}" rx="8" fill="transparent" stroke="none"/>`;
}
// zelený kruh okolo nájdenej veci, vždy navrchu a bez ťukania
function skrKruh(v) {
  const [x, y, w, h] = skrRamec(v);
  return `<ellipse class="skr-kruh" cx="${(x + w / 2).toFixed(1)}" cy="${(y + h / 2).toFixed(1)}" rx="${(w / 2 + 7).toFixed(1)}" ry="${(h / 2 + 6).toFixed(1)}" fill="none" stroke="var(--teal)" stroke-width="4" pointer-events="none"/>`;
}

/* Slabikový vláčik: slová podľa úrovne [slabiky, obrázok] */
const SLAB_SL = [
  [['ry-ba', 'ryba'], ['ru-ža', 'ruža'], ['ža-ba', 'žaba'], ['so-va', 'sova'], ['pe-ro', 'pero'], ['pí-la', 'píla'], ['ško-la', 'škola'], ['mu-cha', 'mucha'], ['ťa-va', 'ťava'], ['au-to', 'auto'], ['kra-va', 'krava'], ['pra-sa', 'prasa'], ['vče-la', 'včela']],
  [['mač-ka', 'mačka'], ['lop-ta', 'lopta'], ['ov-ca', 'ovca'], ['za-jac', 'zajac'], ['ti-ger', 'tiger'], ['o-rol', 'orol'], ['ka-por', 'kapor'], ['ba-nán', 'banán'], ['hruš-ka', 'hruška'], ['sliv-ka', 'slivka'], ['čiap-ka', 'čiapka'], ['čiž-ma', 'čižma'],
    ['koc-ky', 'kocky'], ['hus-le', 'husle'], ['kak-tus', 'kaktus'], ['kos-tol', 'kostol'], ['flau-ta', 'flauta'], ['trúb-ka', 'trúbka'], ['me-siac', 'mesiac'], ['hviez-da', 'hviezda'], ['del-fín', 'delfín'], ['pa-vúk', 'pavúk'], ['mo-týľ', 'motýľ']],
  [['ja-ho-da', 'jahoda'], ['ra-ke-ta', 'raketa'], ['gi-ta-ra', 'gitara'], ['kla-di-vo', 'kladivo'], ['ly-ži-ca', 'lyžica'], ['ce-ruz-ka', 'ceruzka'], ['po-nor-ka', 'ponorka'], ['med-ve-dík', 'medvedík'], ['to-pán-ka', 'topánka'],
    ['ži-ra-fa', 'žirafa'], ['lie-ta-dlo', 'lietadlo'], ['pa-pri-ka', 'paprika'], ['u-hor-ka', 'uhorka'], ['tu-li-pán', 'tulipán'], ['po-ma-ranč', 'pomaranč'], ['au-to-bus', 'autobus'], ['bi-cy-kel', 'bicykel'], ['nož-ni-ce', 'nožnice'], ['sto-lič-ka', 'stolička'], ['ne-to-pier', 'netopier']],
  [['ja-šte-ri-ca', 'jašterica'], ['ko-ryt-nač-ka', 'korytnačka'], ['sl-neč-ni-ca', 'slnečnica'], ['mar-ga-ré-ta', 'margaréta'], ['bo-ro-vi-ca', 'borovica'], ['vi-dlič-ka', 'vidlička'], ['po-nož-ka', 'ponožka'], ['ži-ra-fa', 'žirafa'], ['lie-ta-dlo', 'lietadlo'], ['bi-cy-kel', 'bicykel']],
];

/* I alebo Y?: {písmeno} je medzera; y a i podľa úrovne */
const YPS_SL = [
  { y: ['d{y}m', 't{y}č', 'k{y}tica', 'ch{y}ba', 'ch{y}tať', 'd{y}ňa', 't{ý}ždeň', 'k{y}slý', 'd{ý}chať'], i: ['ž{i}rafa', 'š{i}ška', 'č{i}apka', 'c{i}tron', 'č{í}slo', 'š{i}kovný', 'c{i}bula', 'ž{i}ak', 'š{í}p', 'č{i}stý', 'c{í}tiť'] },
  { y: ['b{y}ť', 'b{y}t', 'ob{y}vateľ', 'b{y}dlisko', 'nab{y}tok', 'dob{y}tok', 'kob{y}la', 'b{ý}k', 'b{y}strý', 'b{y}lina', 'príb{y}tok'], i: ['b{i}cykel', 'b{i}č', 'b{i}ť', 'b{i}tka', 'b{i}ely', 'ob{i}lie', 'b{i}zón'] },
  { y: ['m{y}', 'm{y}š', 'm{y}dlo', 'm{y}slieť', 'hm{y}z', 'm{ý}liť sa', 'm{y}kať', 'm{ý}to', 'p{y}cha', 'p{y}sk', 'p{ý}tať sa', 'kop{y}to', 'slep{ý}š', 'p{y}tliak'], i: ['m{i}lý', 'm{i}nca', 'm{i}sa', 'm{i}núta', 'p{i}vo', 'p{í}smeno', 'p{í}la', 'p{i}ť', 'p{i}škóta'] },
  { y: ['r{y}ba', 'r{ý}chly', 'r{y}ža', 'r{y}ť', 'kr{y}ť', 'hr{ý}zť', 'r{y}s', 'r{y}tier', 's{y}n', 's{y}r', 's{ý}ty', 's{y}pať', 's{ý}korka', 's{y}čať'], i: ['r{í}bezle', 'r{i}ad', 'kr{i}eda', 'kr{í}dlo', 's{i}la', 's{i}lný', 's{i}to', 's{i}vý', 's{i}rota'] },
  { y: ['v{y}', 'v{y}soký', 'v{ý}let', 'v{ý}r', 'zv{y}k', 'v{y}ť', 'jaz{y}k', 'naz{ý}vať', 'l{y}že', 'l{y}žica', 'ml{y}n', 'pl{y}tký', 'bl{ý}skať', 'l{ý}tko', 'l{y}sý', 'pl{y}n'], i: ['v{i}dlička', 'v{i}dieť', 'z{i}ma', 'l{i}st', 'l{í}ška', 'l{i}pa', 'v{i}nič', 'z{i}nok'] },
];

/* Cestička: mapa n × n, 0 tráva, 1 prekážka; BFS overí, že sa dá prejsť, a spočíta najkratšiu cestu */
const CES_SMER = { h: [0, -1], d: [0, 1], l: [-1, 0], p: [1, 0] }, CES_UHOL = { h: -90, d: 90, l: 180, p: 0 };
const CES_PREK = [
  '<path d="M-2 14v-10h4v10z" fill="var(--dv-drevo-d)"/><circle cy="-4" r="13" fill="var(--leaf-d)"/><path d="M-7 -9a8 8 0 0 1 6-5" fill="none" stroke="var(--dv-biela)" stroke-width="2" opacity=".7"/>',
  '<path d="M-15 12c-2-10 6-18 15-18s17 8 15 18z" fill="var(--dv-kamen)"/><path d="M-6 -1q4-4 9-3" fill="none" stroke-width="2"/>',
  '<ellipse rx="17" ry="12" fill="var(--sky)"/><path d="M-9 -2q4-3 8 0t8 0" fill="none" stroke="var(--dv-biela)" stroke-width="2"/>',
  '<path d="M-14 14L0 -14 14 14z" fill="var(--leaf-d)"/><path d="M-10 4L0 -16 10 4z" fill="var(--leaf)"/>',
];
function cesBfs(m, a, b) {
  const n = m.length, q = [[a[0], a[1], 0]], vid = new Set([a.join()]);
  while (q.length) { const [x, y, d] = q.shift(); if (x === b[0] && y === b[1]) return d;
    for (const [dx, dy] of Object.values(CES_SMER)) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (nx < 0 || ny < 0 || nx >= n || ny >= n || m[ny][nx] || vid.has(k)) continue; vid.add(k); q.push([nx, ny, d + 1]); } }
  return -1;
}
// najkratšia cesta ako šípky (pre test a pre nápovedu)
function cesCesta(m, a, b) {
  const n = m.length, q = [[a[0], a[1], []]], vid = new Set([a.join()]);
  while (q.length) { const [x, y, p] = q.shift(); if (x === b[0] && y === b[1]) return p;
    for (const [s, [dx, dy]] of Object.entries(CES_SMER)) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (nx < 0 || ny < 0 || nx >= n || ny >= n || m[ny][nx] || vid.has(k)) continue; vid.add(k); q.push([nx, ny, [...p, s]]); } }
  return null;
}
function cesMapa(n, prek, shv, plan, min) {
  for (let pokus = 0; pokus < 300; pokus++) {
    const m = Array.from({ length: n }, () => Array(n).fill(0)), bunky = mix(n * n).map(i => [i % n, Math.floor(i / n)]);
    const s = [0, nahodne(n)], g = [n - 1, nahodne(n)]; if (nahodne(2)) { s.reverse(); g.reverse(); }
    const volne = bunky.filter(([x, y]) => !(x === s[0] && y === s[1]) && !(x === g[0] && y === g[1]));
    volne.slice(0, prek).forEach(([x, y]) => { m[y][x] = 1; });
    const hv = shv ? volne.slice(prek).find(([x, y]) => Math.abs(x - s[0]) + Math.abs(y - s[1]) > 1 && Math.abs(x - g[0]) + Math.abs(y - g[1]) > 1) : null;
    if (shv && !hv) continue;
    const a = cesBfs(m, s, hv || g), b = hv ? cesBfs(m, hv, g) : 0;
    if (a < 0 || b < 0) continue;
    const opt = a + b; if (opt < n + (shv ? 1 : -1) || opt > (plan ? 11 : 14)) continue;
    return { n, m, s, g, hv, plan: !!plan, min: !!min, opt };
  }
  return { n, m: Array.from({ length: n }, () => Array(n).fill(0)), s: [0, 0], g: [n - 1, n - 1], hv: null, plan: !!plan, min: false, opt: 2 * n - 2 };
}
const cesKrok = (k, [x, y], s) => { const [dx, dy] = CES_SMER[s], nx = x + dx, ny = y + dy; return nx < 0 || ny < 0 || nx >= k.n || ny >= k.n || k.m[ny][nx] ? null : [nx, ny]; };
const cesVezmi = (h, k) => { if (k.hv && !h.hv && h.poz[0] === k.hv[0] && h.poz[1] === k.hv[1]) { h.hv = true; Zvuk.play('coin'); } };
const cesDoma = (h, k) => h.hv && h.poz[0] === k.g[0] && h.poz[1] === k.g[1];
// plán: Múdra prejde kroky jeden po druhom; pri náraze alebo mimo domčeka sa vráti na štart a plán ostane na opravu
function cesChod(h, k) {
  h.ide = true; h.ideI = 0; h.poz = k.s.slice(); h.hv = !k.hv; Zvuk.play('start'); Hra51.obnov();
  const krok = () => {
    if (st.hra !== h) return;
    if (h.ideI >= h.plan.length) {
      h.ide = false;
      if (cesDoma(h, k) && (!k.min || h.plan.length <= k.opt)) { Hra51.dobre(h, 1100); return; }
      Hra51.zle(h); toast(cesDoma(h, k) ? `Domček je, ale dá sa to kratšie: ${k.opt} ${slovoTahy(k.opt).replace('ťah', 'krok')}.` : k.hv && !h.hv && cesDoma({ hv: true, poz: h.poz }, k) ? 'Zabudla si na hviezdičku!' : 'Múdra nie je pri domčeku. Skús plán opraviť.');
      h.dalsia = setTimeout(() => { if (st.hra === h) { h.poz = k.s.slice(); h.hv = !k.hv; Hra51.obnov(); } }, 700); Hra51.obnov(); return;
    }
    const n = cesKrok(k, h.poz, h.plan[h.ideI]);
    if (!n) { h.ide = false; Hra51.zle(h); toast('Bum! Tam sa nedá ísť.'); h.dalsia = setTimeout(() => { if (st.hra === h) { h.poz = k.s.slice(); h.hv = !k.hv; Hra51.obnov(); } }, 700); Hra51.obnov(); return; }
    h.poz = n; cesVezmi(h, k); Zvuk.play('pop'); h.ideI++; Hra51.obnov();
    h.dalsia = setTimeout(krok, 380);
  };
  h.cesKrok = krok; h.dalsia = setTimeout(krok, 300);
}

/* Koľko je hodín?: text času (číslami alebo slovami) a podobné nesprávne možnosti */
const HOD_NOM = ['', 'jedna hodina', 'dve hodiny', 'tri hodiny', 'štyri hodiny', 'päť hodín', 'šesť hodín', 'sedem hodín', 'osem hodín', 'deväť hodín', 'desať hodín', 'jedenásť hodín', 'dvanásť hodín'];
const HOD_AKU = ['', 'jednu', 'dve', 'tri', 'štyri', 'päť', 'šesť', 'sedem', 'osem', 'deväť', 'desať', 'jedenásť', 'dvanásť'];
const HOD_GEN = ['', 'jednej', 'druhej', 'tretej', 'štvrtej', 'piatej', 'šiestej', 'siedmej', 'ôsmej', 'deviatej', 'desiatej', 'jedenástej', 'dvanástej'];
const hodDalsia = h => h % 12 + 1;
function hodText(h, m, slovom) {
  if (!slovom || m % 15) return `${h}:${String(m).padStart(2, '0')}`;
  return m === 0 ? HOD_NOM[h] : m === 15 ? `štvrť na ${HOD_AKU[hodDalsia(h)]}` : m === 30 ? `pol ${HOD_GEN[hodDalsia(h)]}` : `trištvrte na ${HOD_AKU[hodDalsia(h)]}`;
}
function hodMoznosti(h, m, n, typ) {
  const p = (a, b) => [((a - 1 + 12) % 12) + 1, ((b % 60) + 60) % 60], c = [];
  if (typ === 1) c.push(p(h + 1, 0), p(h - 1, 0), p(m / 5 || 12, 0), p(h + 6, 0), p(h + 2, 0));
  else c.push(p(h + 1, m), p(h - 1, m), p(h, m + 30), p(h, (m + 15) % 60), p(h, (m + 45) % 60), p(h + 1, (m + 30) % 60), p(m / 5 || 12, h * 5 % 60), p(h, (m + 5 * (1 + nahodne(3))) % 60));
  const ok = [h + ':' + m], out = [[h, m]];
  for (const x of c) { if (out.length >= n) break; if (typ !== 4 && x[1] % (typ === 1 ? 60 : typ === 2 ? 30 : 15)) continue; const k = x.join(':'); if (ok.includes(k)) continue; ok.push(k); out.push(x); }
  while (out.length < n) { const x = p(1 + nahodne(12), typ === 1 ? 0 : 15 * nahodne(4)); if (!ok.includes(x.join(':'))) { ok.push(x.join(':')); out.push(x); } }
  return mix(out.length).map(i => out[i]);
}
function hodinySvg(h, m) {
  const ah = ((h % 12) + m / 60) * 30, am = m * 6;
  const cisla = Array.from({ length: 12 }, (_, i) => { const n = i + 1, a = n * Math.PI / 6; return `<text x="${(Math.sin(a) * 68).toFixed(1)}" y="${(-Math.cos(a) * 68 + 7).toFixed(1)}" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="800" font-size="${n % 3 ? 17 : 21}" fill="var(--ink)" stroke="none">${n}</text>`; }).join('');
  const ciarky = Array.from({ length: 60 }, (_, i) => { const a = i * Math.PI / 30, r1 = i % 5 ? 84 : 81; return `<path d="M${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}L${(Math.sin(a) * 88).toFixed(1)} ${(-Math.cos(a) * 88).toFixed(1)}" stroke-width="${i % 5 ? 1.4 : 3}"/>`; }).join('');
  return `<svg class="hod-svg" viewBox="-104 -104 208 208" role="img" aria-label="Hodiny"><g stroke="var(--ink)" stroke-linecap="round" stroke-linejoin="round"><circle r="98" fill="var(--violet)" stroke-width="3.5"/><circle r="92" fill="var(--card)" stroke-width="3"/>${ciarky}${cisla}
    <g class="hod-hod" transform="rotate(${ah})"><path d="M-6 8L-5 -40 0 -50 5 -40 6 8z" fill="var(--coral)" stroke-width="3"/></g><g class="hod-min" transform="rotate(${am})"><path d="M-4 10L-3.5 -70 0 -80 3.5 -70 4 10z" fill="var(--violet-d)" stroke-width="3"/></g><circle r="8" fill="var(--sun)" stroke-width="3"/></g></svg>`;
}
// Kto sa skryl?: veci v scéne sú SVG skupiny, nie tlačidlá, preto vlastný poslucháč (aj Enter a medzerník)
document.addEventListener('click', e => { const g = e.target.closest && e.target.closest('g[data-h51],rect[data-h51]'); if (g) Hra51.klik(g, g.dataset); });
document.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const g = e.target.closest && e.target.closest('g[data-h51]'); if (g) { e.preventDefault(); Hra51.klik(g, g.dataset); } });
