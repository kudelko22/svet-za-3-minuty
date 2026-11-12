/* Pridať na plochu (verzia 2.4): kreslený návod pre iPhone, iPad, Mac aj Android; kde to prehliadač vie, rovno systémové okno inštalácie */
const PL_RUKA = SPR_RUKA.replace(/^<svg[^>]*>|<\/svg>$/g, '');
const plRuka = (x, y, s = .6) => `<g transform="translate(${x - 25 * s} ${y - 2 * s}) scale(${s})"><g class="pl-ruka">${PL_RUKA}</g></g>`;
const plText = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="Nunito, sans-serif" font-weight="${o.w || 800}" font-size="${o.s || 7.5}" fill="${o.c || INK}" stroke="none"${o.a ? ` text-anchor="${o.a}"` : ''}>${t}</text>`;
const plSvit = (x, y, w, h, r = 8) => `<rect class="pl-svit" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="#FFD23F" stroke-width="4"/>`;
const plSova = (x, y, w) => owl('hi').replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.1}" `);
const plObal = obsah => `<svg viewBox="0 0 220 260" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${obsah}</g></svg>`;
// telefón: obsah obrazovky je orezaný, ruka a svetlo (nad) môžu ísť aj cez okraj
const plTelefon = (obsah, nad = '', pozadie = '#E3F4FF') => plObal(`<clipPath id="pl-klip"><rect x="60" y="16" width="100" height="208" rx="14"/></clipPath>
  <rect x="52" y="6" width="116" height="228" rx="24" fill="#fff" stroke-width="4"/><rect x="60" y="16" width="100" height="208" rx="14" fill="${pozadie}"/>
  <g clip-path="url(#pl-klip)">${obsah}</g><rect x="96" y="20" width="28" height="7" rx="3.5" fill="${INK}" stroke="none"/>${nad}`);
const plAppka = (x, y, w) => `<rect x="${x + 8}" y="${y}" width="${w - 16}" height="30" rx="8" fill="#FFD23F"/><rect x="${x + 8}" y="${y + 36}" width="${(w - 22) / 2}" height="36" rx="8" fill="#FF9F1C"/>
  <rect x="${x + 14 + (w - 22) / 2}" y="${y + 36}" width="${(w - 22) / 2}" height="36" rx="8" fill="#4C7DFF"/><rect x="${x + 8}" y="${y + 78}" width="${w - 16}" height="24" rx="8" fill="#B6F0C8"/>`;
const plZdielaj = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#FFD23F"/><path d="M${x - 6} ${y - 1} v8 h12 v-8 M${x} ${y + 3} V${y - 9} M${x - 4} ${y - 5} l4 -4 4 4" fill="none" stroke-width="2.2"/>`;
const plRiadky = (x, y, w, riadky, zv, s = 7.5) => riadky.map((t, i) => { const yy = y + i * 21, on = i === zv;
  return `<rect x="${x}" y="${yy}" width="${w}" height="17" rx="6" fill="${on ? '#FFF3C4' : '#F4F1FA'}" stroke-width="${on ? 2.5 : 1.5}"/>${plText(x + 6, yy + 11.5, t, { s })}${on ? `<rect x="${x + w - 15}" y="${yy + 4}" width="9" height="9" rx="2" fill="none" stroke-width="1.8"/><path d="M${x + w - 10.5} ${yy + 6} v5 M${x + w - 13} ${yy + 8.5} h5" stroke-width="1.8"/>` : ''}`; }).join('');
const plSafari = () => `<rect x="66" y="168" width="88" height="13" rx="6.5" fill="#fff" stroke-width="2"/>${plText(110, 177, 'svet-za-3-minuty.web.app', { s: 5.4, a: 'middle', c: '#5F587A' })}
  <path d="M60 186 H160 V224 H60Z" fill="#F4F1FA"/><path d="M76 199 l-6 6 6 6" fill="none" stroke-width="2.2"/><path d="M88 199 l6 6 -6 6" fill="none" stroke-width="2.2" opacity=".35"/>
  ${plZdielaj(110, 205)}<path d="M124 199 q4 -2 7 0 q3 -2 7 0 v11 q-4 -2 -7 0 q-3 -2 -7 0z" fill="none" stroke-width="2"/><rect x="144" y="198" width="10" height="10" rx="2" fill="none" stroke-width="2"/><rect x="147" y="201" width="10" height="10" rx="2" fill="#F4F1FA" stroke-width="2"/>`;
const plHviezdy = poz => poz.map(([x, y], i) => `<path class="pl-hv" style="--k:${i}" d="M${x} ${y - 6} l1.8 4.2 4.2 1.8 -4.2 1.8 -1.8 4.2 -1.8 -4.2 -4.2 -1.8 4.2 -1.8z" fill="#FFD23F" stroke-width="1.5"/>`).join('');
// plocha telefónu: medzi ikonkami vyskočí naša so Sovičkou
const plPlocha = () => plTelefon(`${[0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<rect x="${70 + c * 30}" y="${34 + r * 34}" width="22" height="22" rx="6" fill="${['#FFD23F', '#4C7DFF', '#2FBF71', '#FF6FA8', '#FF9F1C', '#8FD3FF', '#B6F0C8', '#FFB3D1', '#7C6CFF'][r * 3 + c]}" stroke-width="2"/>`)).join('')}
  <rect x="66" y="198" width="88" height="20" rx="9" fill="#fff" opacity=".55" stroke="none"/>${[0, 1, 2].map(c => `<rect x="${76 + c * 26}" y="201" width="16" height="14" rx="4" fill="${['#2FBF71', '#4C7DFF', '#FF9F1C'][c]}" stroke-width="1.8"/>`).join('')}
  <g class="pl-pop"><rect x="93" y="134" width="34" height="34" rx="9" fill="#E3F4FF" stroke-width="2.5"/>${plSova(97.5, 136, 25)}</g>
  <rect x="80" y="173" width="60" height="12" rx="6" fill="#fff" stroke="none" opacity=".8"/>${plText(110, 182, 'Svet za 3 min', { s: 7, w: 900, a: 'middle' })}
  ${plHviezdy([[84, 136], [138, 134], [86, 166], [136, 164]])}`, '', '#C9B8FF');
const plTablet = (obsah, nad = '') => plObal(`<rect x="10" y="40" width="200" height="150" rx="16" fill="#fff" stroke-width="4"/><rect x="18" y="48" width="184" height="134" rx="8" fill="#E3F4FF"/>
  <path d="M18 56 Q18 48 26 48 H194 Q202 48 202 56 V68 H18Z" fill="#F4F1FA"/><rect x="62" y="52" width="96" height="12" rx="6" fill="#fff" stroke-width="1.8"/>${plText(110, 60.5, 'svet-za-3-minuty.web.app', { s: 5.4, a: 'middle', c: '#5F587A' })}
  ${plZdielaj(186, 58)}<g transform="translate(28 74) scale(.9)">${plAppka(0, 0, 112)}</g>${obsah}${nad}`);
const plMonitor = (lista, obsah, nad = '') => plObal(`<path d="M98 172 L92 196 H128 L122 172Z" fill="#D9D4E8"/><rect x="76" y="196" width="68" height="7" rx="3.5" fill="#D9D4E8"/>
  <rect x="8" y="30" width="204" height="142" rx="10" fill="#fff" stroke-width="4"/><rect x="16" y="38" width="188" height="126" rx="3" fill="#E3F4FF"/>
  <rect x="40" y="60" width="140" height="92" rx="6" fill="#fff" stroke-width="2"/>${[0, 1, 2].map(i => `<circle cx="${47 + i * 7}" cy="66" r="2.2" fill="${['#FF5A5F', '#FFD23F', '#2FBF71'][i]}" stroke-width="1"/>`).join('')}
  <rect x="48" y="74" width="124" height="20" rx="5" fill="#FFD23F" stroke-width="2"/><rect x="48" y="99" width="59" height="24" rx="5" fill="#FF9F1C" stroke-width="2"/><rect x="113" y="99" width="59" height="24" rx="5" fill="#4C7DFF" stroke-width="2"/><rect x="48" y="128" width="124" height="16" rx="5" fill="#B6F0C8" stroke-width="2"/>
  ${lista}${obsah}${nad}`);
const plMacLista = (zv = false) => `<rect x="16" y="38" width="188" height="12" fill="#F4F1FA" stroke-width="1.8"/>${zv ? '<rect x="56" y="39.5" width="26" height="9" rx="4" fill="#FFD23F" stroke="none"/>' : ''}
  ${plText(24, 47, 'Safari', { s: 6.5, w: 900 })}${plText(60, 47, 'Súbor', { s: 6.5 })}${plText(88, 47, 'Upraviť', { s: 6.5 })}${plText(118, 47, 'Zobraziť', { s: 6.5 })}`;
const plAndroid = () => `<path d="M60 30 H160 V48 H60Z" fill="#F4F1FA"/><rect x="66" y="33" width="72" height="11" rx="5.5" fill="#fff" stroke-width="1.8"/>${plText(102, 41, 'svet-za-3-minuty.web.app', { s: 4.6, a: 'middle', c: '#5F587A' })}
  ${[0, 1, 2].map(i => `<circle cx="150" cy="${34.5 + i * 4}" r="1.4" fill="${INK}" stroke="none"/>`).join('')}`;
const PL_IPHONE = [
  { obr: () => plTelefon(`${plAppka(60, 34, 100)}${plSafari()}`, `${plSvit(98, 193, 24, 24, 12)}${plRuka(110, 208)}`),
    n: 'Ťuknite na Zdieľať', p: 'Je to štvorček so šípkou hore, dole pod adresou. Ak ho nevidíte, ťuknite najprv na ⋯ vpravo dole.' },
  { obr: () => plTelefon(`${plAppka(60, 34, 100)}<rect x="60" y="16" width="100" height="208" fill="${INK}" opacity=".35" stroke="none"/>
      <g class="pl-hore"><path d="M60 108 Q60 96 72 96 H148 Q160 96 160 108 V224 H60Z" fill="#fff"/><rect x="100" y="100" width="20" height="4" rx="2" fill="#D9D4E8" stroke="none"/>
      ${['#4C7DFF', '#2FBF71', '#FF9F1C', '#FF6FA8'].map((c, i) => `<circle cx="${77 + i * 22}" cy="117" r="7" fill="${c}" stroke-width="2"/>`).join('')}
      ${plRiadky(66, 132, 88, ['Kopírovať', 'Pridať na plochu', 'Pridať záložku', 'Tlačiť'], 1)}</g>`, `${plSvit(64, 151, 92, 21, 8)}${plRuka(136, 164)}`),
    n: 'Vyberte „Pridať na plochu“', p: 'Je v zozname, ktorý sa vysunul. Ak ho nevidíte, potiahnite zoznam prstom nahor.' },
  { obr: () => plTelefon(`<rect x="60" y="16" width="100" height="208" fill="#F4F1FA" stroke="none"/>
      ${plText(66, 42, 'Zrušiť', { s: 7, c: '#4C7DFF' })}${plText(108, 42, 'Na plochu', { s: 6.5, a: 'middle' })}<rect x="133" y="33" width="24" height="13" rx="6" fill="#FFD23F" stroke-width="2"/>${plText(145, 42.5, 'Pridať', { s: 6.8, w: 900, a: 'middle' })}
      <rect x="66" y="54" width="88" height="44" rx="10" fill="#fff"/><rect x="72" y="60" width="32" height="32" rx="8" fill="#E3F4FF" stroke-width="2"/>${plSova(76, 62, 24)}
      ${plText(110, 74, 'Svet za 3 min', { s: 7 })}${plText(110, 86, 'web.app', { s: 6, c: '#8A84A3' })}
      <rect x="66" y="106" width="88" height="22" rx="8" fill="#fff"/>${plText(71, 120, 'Otvoriť ako web. appku', { s: 5.6 })}
      <rect x="136" y="111" width="16" height="11" rx="5.5" fill="#2FBF71" stroke-width="1.8"/><circle cx="146.5" cy="116.5" r="3.6" fill="#fff" stroke-width="1.5"/>`, `${plSvit(130, 30, 30, 19, 9)}${plRuka(146, 44)}`),
    n: 'Ťuknite na „Pridať“', p: 'Je vpravo hore. Ak vidíte prepínač „Otvoriť ako webovú aplikáciu“, nechajte ho zapnutý.' },
  { obr: plPlocha, hotovo: true,
    n: 'Hotovo!', p: 'Na ploche je ikonka so Sovičkou. Odteraz otvárajte appku cez ňu. Ak bude chcieť prihlásenie, prihláste sa rovnako ako tu, pokrok ostane.' },
];
const PLOCHA = {
  iphone: PL_IPHONE,
  ipad: [
    { obr: () => plTablet('', `${plSvit(174, 46, 24, 24, 12)}${plRuka(186, 61)}`), n: 'Ťuknite na Zdieľať', p: 'Je to štvorček so šípkou hore, vpravo vedľa adresy.' },
    { obr: () => plTablet(`<g class="pl-dole"><path d="M114 76 H178 l7 -7 7 7 H198 Q203 76 203 81 V172 Q203 177 198 177 H119 Q114 177 114 172Z" fill="#fff"/>${plRiadky(120, 84, 76, ['Kopírovať', 'Pridať na plochu', 'Pridať záložku', 'Tlačiť'], 1)}</g>`, `${plSvit(118, 103, 80, 21, 8)}${plRuka(178, 116)}`),
      n: 'Vyberte „Pridať na plochu“', p: 'Ak ho nevidíte, potiahnite zoznam prstom nahor.' },
    PL_IPHONE[2], PL_IPHONE[3],
  ],
  mac: [
    { obr: () => plMonitor(plMacLista(true), '', `${plSvit(54, 37, 30, 13, 6)}${plRuka(69, 49)}`), n: 'Otvorte ponuku Súbor', p: 'Je úplne hore na obrazovke, keď máte otvorené Safari.' },
    { obr: () => plMonitor(plMacLista(true), `<g class="pl-dole"><rect x="56" y="50" width="88" height="92" rx="5" fill="#fff" stroke-width="2"/>${plRiadky(60, 55, 80, ['Nové okno', 'Nová karta', 'Pridať do Docku…', 'Zavrieť okno'], 2, 6.8)}</g>`, `${plSvit(58, 95, 84, 21, 8)}${plRuka(122, 108)}`),
      n: 'Vyberte „Pridať do Docku“', p: 'Potom ťuknite na Pridať. Funguje to na macOS Sonoma (14) a novšom.' },
    { obr: () => plMonitor(plMacLista(), `<rect x="44" y="144" width="132" height="18" rx="7" fill="#fff" opacity=".9" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${50 + i * 16}" y="147" width="12" height="12" rx="3" fill="${['#4C7DFF', '#2FBF71', '#FF9F1C', '#FF6FA8', '#7C6CFF', '#FFD23F'][i]}" stroke-width="1.5"/>`).join('')}
        <g class="pl-pop"><rect x="148" y="141" width="22" height="22" rx="6" fill="#E3F4FF" stroke-width="2"/>${plSova(151, 142.5, 16)}</g>
        <rect x="128" y="125" width="62" height="12" rx="6" fill="#fff" stroke-width="1.5"/>${plText(159, 133.5, 'Svet za 3 min', { s: 6.5, w: 900, a: 'middle' })}${plHviezdy([[142, 146], [176, 144]])}`),
      hotovo: true, n: 'Hotovo!', p: 'Appka je v Docku dole a otvára sa vo vlastnom okne. Ak bude chcieť prihlásenie, prihláste sa rovnako ako tu.' },
  ],
  android: [
    { obr: () => plTelefon(`${plAppka(60, 56, 100)}${plAndroid()}`, `${plSvit(143, 31, 14, 16, 6)}${plRuka(150, 44)}`), n: 'Ťuknite na ⋮ vpravo hore', p: 'Sú to tri bodky nad sebou v Chrome, vedľa adresy.' },
    { obr: () => plTelefon(`${plAppka(60, 56, 100)}${plAndroid()}<g class="pl-dole"><rect x="86" y="44" width="72" height="92" rx="6" fill="#fff" stroke-width="2"/>${plRiadky(90, 49, 64, ['Nová karta', 'História', 'Inštalovať aplikáciu', 'Nastavenia'], 2, 5.6)}</g>`, `${plSvit(88, 89, 68, 21, 8)}${plRuka(140, 102)}`),
      n: 'Vyberte „Inštalovať aplikáciu“', p: 'Niekde sa volá „Pridať na plochu“. Potom to potvrďte.' },
    { obr: plPlocha, hotovo: true, n: 'Hotovo!', p: 'Na ploche je ikonka so Sovičkou. Odteraz otvárajte appku cez ňu.' },
  ],
  vnutri: [
    { obr: () => plTelefon(`${plAppka(60, 56, 100)}<path d="M60 30 H160 V48 H60Z" fill="#F4F1FA"/><path d="M67 35 l7 7 M74 35 l-7 7" stroke-width="2"/>${[0, 1, 2].map(i => `<circle cx="${143 + i * 5}" cy="39" r="1.5" fill="${INK}" stroke="none"/>`).join('')}
        <g class="pl-dole"><rect x="80" y="46" width="76" height="72" rx="6" fill="#fff" stroke-width="2"/>${plRiadky(84, 51, 68, ['Otvoriť v Safari', 'Kopírovať odkaz', 'Zdieľať'], 0, 6.4)}</g>`, `${plSvit(82, 49, 72, 21, 8)}${plRuka(136, 62)}`),
      kopiruj: true, n: 'Otvorte appku v Safari', p: 'Teraz je otvorená vnútri inej appky (napríklad Messenger). Ťuknite na ⋯ hore a vyberte „Otvoriť v Safari“, alebo skopírujte adresu a vložte ju do Safari.' },
    ...PL_IPHONE,
  ],
  pocitac: [
    { obr: () => plMonitor(`<rect x="16" y="38" width="188" height="14" fill="#F4F1FA" stroke-width="1.8"/><rect x="40" y="41" width="126" height="9" rx="4.5" fill="#fff" stroke-width="1.5"/>${plText(103, 47.8, 'svet-za-3-minuty.web.app', { s: 5.4, a: 'middle', c: '#5F587A' })}
        <rect x="175" y="40" width="14" height="11" rx="3" fill="#FFD23F" stroke="none"/><rect x="177.5" y="41.5" width="9" height="7" rx="1.5" fill="none" stroke-width="1.5"/><path d="M182 42.5 v3.5 M180.3 44.5 l1.7 1.7 1.7 -1.7" stroke-width="1.3"/>`, '', `${plSvit(172, 37, 20, 17, 6)}${plRuka(182, 51)}`),
      n: 'Ťuknite na ikonku inštalácie', p: 'V Chrome alebo Edge je vpravo v riadku s adresou. Ak ju nevidíte, otvorte ponuku ⋮ a vyberte „Inštalovať“. Appka sa potom otvára vo vlastnom okne.' },
  ],
};
const PLOCHA_NAZOV = { iphone: 'iPhone', ipad: 'iPad', mac: 'Mac', android: 'Android', vnutri: 'iPhone', pocitac: 'počítač' };
const Plocha = {
  udalost: null, // beforeinstallprompt: Android a Chrome na počítači vedia appku nainštalovať samy
  naPloche: () => !!(navigator.standalone || matchMedia('(display-mode: standalone)').matches),
  zariadenie() {
    const ua = navigator.userAgent || '', ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (/iPhone|iPod/.test(ua) || ipad) return /FBAN|FBAV|Instagram|Messenger|GSA\/|Line\//.test(ua) ? 'vnutri' : ipad ? 'ipad' : 'iphone';
    if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome|Chromium|Edg|Firefox|OPR/.test(ua)) return 'mac';
    return /Android/.test(ua) ? 'android' : 'pocitac';
  },
  priamo() { const z = this.zariadenie(); return !!this.udalost && (z === 'android' || z === 'pocitac'); },
  karta() {
    const z = this.zariadenie();
    if (this.naPloche() || S.get('plocha-neskor', 0) > Date.now() || (z === 'pocitac' && !this.udalost)) return '';
    return `<div class="plocha-karta"><span class="plocha-obr">${plPlocha()}</span><div class="plocha-t"><b>Pridajte si appku na plochu</b>
      <small>Bude sa otvárať ako naozajstná aplikácia: s ikonkou a cez celú obrazovku.</small>
      <div class="plocha-tl"><button class="btn blue" data-plocha>${this.priamo() ? 'Pridať' : 'Ukázať ako'}</button><button class="btn ghost" data-plocha-neskor>Neskôr</button></div></div></div>`;
  },
  // na iPhone má appka na ploche vlastné prihlásenie, preto radíme pridať ju ešte pred prihlásením
  tip() {
    return this.naPloche() || !['iphone', 'ipad', 'vnutri'].includes(this.zariadenie()) ? ''
      : `<button type="button" class="plocha-tip" data-plocha>${ii(IK.iskra)}<span><b>Tip:</b> najprv si appku pridajte na plochu, potom sa prihlásite len raz. <u>Ukázať ako</u></span></button>`;
  },
  navod(z = this.zariadenie()) {
    if (this.priamo() && (z === 'android' || z === 'pocitac')) {
      const u = this.udalost; this.udalost = null; u.prompt();
      Promise.resolve(u.userChoice).then(v => { if (v && v.outcome === 'accepted') { Zvuk.play('win'); FX.rain(70); } render(); });
      return;
    }
    const kroky = PLOCHA[z] || PLOCHA.pocitac, el = document.createElement('div');
    let i = 0;
    el.className = 'novinky plocha-okno'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Pridať appku na plochu');
    el.innerHTML = `<div class="nov-karta pl-karta"><div class="pl-hlava"><div><small>Návod pre ${PLOCHA_NAZOV[z] || 'počítač'}</small><b>Pridať na plochu</b></div>
      <button class="ib" data-pl="zavri" aria-label="Zavrieť">${IKO.zavriet}</button></div><div class="pl-telo"></div></div>`;
    const kresli = () => {
      const k = kroky[i], posl = i === kroky.length - 1;
      el.querySelector('.pl-telo').innerHTML = `<div class="pl-obr">${k.obr()}</div>
        <div class="pl-krok"><span class="pl-cislo">${k.hotovo ? ii(STAR()) : i + 1}</span><div><b>${k.n}</b><small>${k.p}</small></div></div>
        ${k.kopiruj ? '<button class="btn blue wide" data-pl="kopiruj">Skopírovať adresu appky</button>' : ''}
        <div class="pl-spodok"><div class="pl-bodky">${kroky.length > 1 ? kroky.map((_, j) => `<i${j === i ? ' class="on"' : ''}></i>`).join('') : ''}</div>
          ${i ? '<button class="btn ghost" data-pl="spat" aria-label="Späť">←</button>' : ''}<button class="btn cta" data-pl="${posl ? 'hotovo' : 'dalej'}">${posl ? 'Hotovo' : 'Ďalej →'}</button></div>`;
      if (k.hotovo) setTimeout(() => { if (el.isConnected) { Zvuk.play('win'); const o = el.querySelector('.pl-obr'); if (o) { const [x, y] = stred(o); FX.burst(x, y, 26, ['star', 'dot']); } } }, 450);
    };
    el.addEventListener('click', e => {
      e.stopPropagation();
      const b = e.target.closest('[data-pl]'); if (!b) return;
      const a = b.dataset.pl;
      if (a === 'dalej' || a === 'spat') { i += a === 'dalej' ? 1 : -1; Zvuk.play(a === 'dalej' ? 'pop' : 'tap'); kresli(); return; }
      if (a === 'kopiruj') {
        const adresa = 'https://svet-za-3-minuty.web.app/', ok = () => toast('Adresa je skopírovaná. Otvorte Safari a vložte ju hore do riadka.');
        if (navigator.clipboard) navigator.clipboard.writeText(adresa).then(ok, () => toast('Adresa appky: ' + adresa)); else toast('Adresa appky: ' + adresa);
        return;
      }
      Zvuk.play('tap'); el.classList.add('pryc'); setTimeout(() => el.remove(), 300);
    });
    document.body.appendChild(el); kresli(); Zvuk.play('cink');
  },
};
addEventListener('beforeinstallprompt', e => { e.preventDefault(); Plocha.udalost = e; if (st.faza === 'appka' && st.view === 'domov' && !st.flow && !st.hra && !st.auto) render(); });
addEventListener('appinstalled', () => { Plocha.udalost = null; toast('Appka je pridaná. Nájdete ju medzi aplikáciami.'); });
