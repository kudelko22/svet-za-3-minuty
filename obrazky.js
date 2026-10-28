// Kreslené obrázky Svet za 3 minúty: všetko z jednoduchých tvarov s tmavým obrysom (rám 320 × 180).
// Pohyb robia triedy (blink, hop, drift, rain, …), štýly sú v hlavnej stránke.
const INK = '#2B2240', N = 'stroke="none"';
const TXT = 'font-family="&quot;Baloo 2&quot;, Nunito, sans-serif" font-weight="700" text-anchor="middle" stroke="none"';
const bg = c => `<rect width="320" height="180" fill="${c}" ${N}/>`;
const dot = (x, y, r = 2.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}" ${N}/>`;
const lica = (x, y, d) => `<circle cx="${x - d}" cy="${y}" r="3.5" fill="#FF8FB1" opacity=".8" ${N}/><circle cx="${x + d}" cy="${y}" r="3.5" fill="#FF8FB1" opacity=".8" ${N}/>`;
function face(x, y, s = 1, m = 'smile') {
  const usta = m === 'angry'
    ? '<path d="M-6 10 q6 -6 12 0" fill="none" stroke-width="2.5"/><path d="M-12 -9 l8 4 M12 -9 l-8 4" stroke-width="3"/>'
    : m === 'sleep' ? '<circle cx="0" cy="7" r="2.5" fill="none" stroke-width="2"/>'
    : '<path d="M-6 6 q6 6 12 0" fill="none" stroke-width="2.5"/>';
  const oci = m === 'sleep'
    ? '<path d="M-10 0 q3 3 6 0 M4 0 q3 3 6 0" fill="none" stroke-width="2.5"/>'
    : `<g class="blink">${dot(-7, 0, 2.6)}${dot(7, 0, 2.6)}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${oci}${usta}${lica(0, 6, 13)}</g>`;
}
const sun = (x, y, r = 18) => `<g transform="translate(${x} ${y})"><g class="spin">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 ${-r - 5} V${-r - 13}" stroke="#FFB300" stroke-width="5" transform="rotate(${a})"/>`).join('')}</g><circle r="${r}" fill="#FFD23F"/>${face(0, 0, r / 18)}</g>`;
function cloud(x, y, s = 1, d = 0) {
  const c = [[0, 8, 13], [16, -2, 17], [34, 6, 13]].map(([a, b, r]) => `<circle cx="${x + a * s}" cy="${y + b * s}" r="${r * s}"/>`).join('')
    + `<rect x="${x}" y="${y + 6 * s}" width="${34 * s}" height="${15 * s}" rx="${7 * s}"/>`;
  return `<g class="drift" style="animation-delay:${d}s"><g fill="#fff">${c}</g><g fill="#fff" ${N}>${c}</g></g>`;
}
const pine = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-2" width="6" height="10" fill="#9A6234"/><path d="M0 -40 L13 -20 H6 L17 -2 H-17 L-6 -20 H-13Z" fill="#2FB36A"/></g>`;
const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-14" width="8" height="16" fill="#9A6234"/><circle cx="0" cy="-28" r="17" fill="#4CD07D"/><circle cx="-6" cy="-33" r="5" fill="#9BEFB4" ${N}/></g>`;
const spool = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-24" width="20" height="5" rx="2" fill="#C98A4B"/><rect x="-7" y="-19" width="14" height="14" fill="${c}"/><rect x="-10" y="-5" width="20" height="5" rx="2" fill="#C98A4B"/></g>`;
function kid(x, y, c, o = {}) {
  const skin = o.skin || '#FFD2B0', hair = o.hair || '#6B4226', sx = (o.flip ? -1 : 1) * (o.s || 1), sy = o.s || 1;
  const ruka = o.arm === undefined ? '' : `<g transform="rotate(${o.arm} 10 -30)"><rect x="6" y="-58" width="9" height="30" rx="4.5" fill="${c}"/><circle cx="10.5" cy="-60" r="6" fill="${skin}"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><g class="hop" style="animation-delay:${o.d || 0}s">${ruka}
    <rect x="-15" y="-36" width="30" height="36" rx="13" fill="${c}"/><circle cx="0" cy="-49" r="14" fill="${skin}"/>
    <path d="M-14 -51 C-14 -67 14 -67 14 -51 C8 -57 -2 -58 -14 -51Z" fill="${hair}"/>
    <g class="blink">${dot(-5, -48, 2)}${dot(5, -48, 2)}</g><path d="M-4 -42 q4 4 8 0" fill="none" stroke-width="2"/>${o.extra || ''}</g></g>`;
}
const drop = (x, y, d) => `<g transform="translate(${x} ${y})"><g class="rain" style="animation-delay:${d}s"><path d="M0 -8 C5 0 6 4 0 8 C-6 4 -5 0 0 -8Z" fill="#3D8BFF"/></g></g>`;
const plus = (x, y, c, d = 0) => `<g transform="translate(${x} ${y})"><g class="twinkle" style="animation-delay:${d}s"><path d="M0 -7 V7 M-7 0 H7" stroke="${c}" stroke-width="4"/></g></g>`;
const hviezdicka = (x, y, s, c, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="twinkle" style="animation-delay:${d}s"><path d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${c}" stroke-width="2"/></g></g>`;
const srdiecko = (x, y, s, c, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="heartup" style="animation-delay:${d}s"><path d="M0 7 C-11 -1 -9 -10 -3.5 -10 C-1.5 -10 0 -8.5 0 -7 C0 -8.5 1.5 -10 3.5 -10 C9 -10 11 -1 0 7Z" fill="${c}" stroke-width="2"/></g></g>`;
const list = (x, y, c, d) => `<g transform="translate(${x} ${y})"><g class="leaf" style="animation-delay:${d}s"><path d="M0 -9 C7 -4 7 4 0 9 C-7 4 -7 -4 0 -9Z" fill="${c}" stroke-width="2"/><path d="M0 -7 V7" stroke-width="1.5"/></g></g>`;
const kos = (x, c) => `<g transform="translate(${x} 150)"><rect x="-26" y="-58" width="52" height="58" rx="6" fill="${c}"/><rect x="-30" y="-68" width="60" height="12" rx="5" fill="${c}"/><rect x="-9" y="-75" width="18" height="8" rx="3" fill="${c}"/>${face(0, -28, .9)}</g>`;
const padá = (x, y, d, tvar) => `<g transform="translate(${x} ${y})"><g class="fall2" style="animation-delay:${d}s">${tvar}</g></g>`;
function jezko(x, y) {
  let sp = '';
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (1.02 + i * .12), b = (r, u) => `${(Math.cos(u) * r).toFixed(1)} ${(Math.sin(u) * r).toFixed(1)}`;
    sp += `M${b(26, a - .12)} L${b(40, a)} L${b(26, a + .12)}Z`;
  }
  return `<g transform="translate(${x} ${y})"><g class="hop"><path d="${sp}" fill="#6B4226"/><path d="M-32 0 A32 30 0 0 1 32 0Z" fill="#8B5A2B"/><ellipse cx="30" cy="-6" rx="14" ry="10" fill="#F4C58C"/>${dot(44, -7, 3)}<g class="blink">${dot(31, -10, 2)}</g><circle cx="-6" cy="-24" r="6" fill="#FF5A5F"/></g></g>`;
}

// fáza Mesiaca: k > 0 rožok, k < 0 viac ako polovica, k = 0 polovica; smer 1 = svieti sprava
const faza = (x, y, r, k, smer) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#3A3F7A" stroke-width="2"/><path d="M0 ${-r} A${r} ${r} 0 0 ${smer} 0 ${r} A${Math.abs(k)} ${r} 0 0 ${k < 0 ? smer : 1 - smer} 0 ${-r}Z" fill="#FFF3B0" stroke-width="2"/></g>`;
const kvet = (x, h, c) => `<g transform="translate(${x} 150)"><path d="M0 0 V${-h}" stroke="${INK}" stroke-width="7"/><path d="M0 0 V${-h}" stroke="#2FB36A" stroke-width="3.5"/><g transform="translate(0 ${-h})"><g class="breathe">${[0, 72, 144, 216, 288].map(a => `<circle cx="0" cy="-9" r="7" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#FFD23F"/></g></g></g>`;
const vcela = (x, y, d) => `<g transform="translate(${x} ${y})"><g class="bzz" style="animation-delay:${d}s"><ellipse class="kridla" cx="-3" cy="-9" rx="5" ry="8" fill="#fff" opacity=".9" stroke-width="2"/><ellipse class="kridla" cx="5" cy="-9" rx="5" ry="8" fill="#fff" opacity=".9" stroke-width="2"/><ellipse rx="12" ry="9" fill="#FFD23F" stroke-width="2.5"/><path d="M-3 -8 V8 M4 -8 V8" stroke-width="3.5"/><g class="blink">${dot(9, -2, 1.6)}</g></g></g>`;
const bacil = (x, y, c, d) => `<g transform="translate(${x} ${y})"><g class="utek" style="animation-delay:${d}s">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 -12 V-19" transform="rotate(${a})" stroke-width="2.5"/>`).join('')}<circle r="13" fill="${c}"/>${face(0, -1, .6, 'angry')}</g></g>`;

const ART = {
  manufaktura: () => `${bg('#FFE3BD')}
    <path d="M0 34 H320 M0 68 H320 M0 102 H320 M40 0 V34 M120 0 V34 M200 0 V34 M280 0 V34 M80 34 V68 M160 34 V68 M240 34 V68 M40 68 V102 M120 68 V102 M200 68 V102 M280 68 V102" stroke="#F5C78F" stroke-width="2.5"/>
    <rect x="18" y="14" width="66" height="54" rx="8" fill="#BFE7FF"/>${cloud(28, 30, .6)}<path d="M51 14 V68 M18 41 H84"/>
    <rect x="222" y="46" width="86" height="8" rx="3" fill="#B5713C"/>${spool(240, 46, '#FF7EB6')}${spool(265, 46, '#4C7DFF')}${spool(290, 46, '#FFD23F')}
    <rect y="146" width="320" height="34" fill="#E8A86A" ${N}/><path d="M0 146 H320"/>
    <rect x="110" y="122" width="12" height="28" fill="#9A5B2C"/><rect x="272" y="122" width="12" height="28" fill="#9A5B2C"/>
    <rect x="96" y="108" width="202" height="14" rx="5" fill="#C27C45"/>
    <path d="M128 92 Q140 66 160 66" fill="none" stroke="#FF7EB6" stroke-width="2.5" stroke-dasharray="4 4" class="dash"/>
    ${spool(124, 108, '#FF7EB6', 1.3)}
    <g transform="translate(150 108)"><g class="bob"><path d="M0 0 V-46 q0 -6 6 -6 H30 q6 0 6 6 V-20 q32 2 40 14 V0 Z" fill="#E0623A"/><path d="M8 -42 h20 M8 -34 h20 M8 -26 h20" stroke-width="2.5"/><rect x="-3" y="-6" width="82" height="9" rx="4.5" fill="#6B3A22"/></g></g>
    <g transform="translate(262 100) rotate(-25)"><g class="snip"><path d="M-2 -2 L24 -14 M-2 -4 L24 6" stroke-width="4"/><circle cx="-8" cy="2" r="6" fill="#4C7DFF"/><circle cx="-8" cy="-10" r="6" fill="#4C7DFF"/></g></g>
    ${kid(50, 152, '#4C7DFF', { arm: -25 })}`,

  hrady: () => `${bg('#CDEBFF')}${sun(40, 36, 16)}${cloud(110, 16, .7)}${cloud(262, 30, .6, -2)}
    <path d="M30 180 Q110 96 200 106 Q270 112 320 150 V180Z" fill="#6FD68F"/>
    <path d="M120 180 Q150 150 186 122" fill="none" stroke="#E8C58C" stroke-width="10"/>
    <rect x="128" y="44" width="30" height="72" fill="#B3ACC8"/><path d="M123 46 L143 14 L163 46Z" fill="#FF5A5F"/>
    <rect x="232" y="50" width="30" height="66" fill="#B3ACC8"/><path d="M227 52 L247 22 L267 52Z" fill="#4C7DFF"/>
    <rect x="156" y="62" width="78" height="54" fill="#C9C3D9"/>
    <path d="M156 62 V52 H168 V62 H180 V52 H192 V62 H204 V52 H216 V62 H228 V52 H234 V62" fill="#C9C3D9"/>
    <path d="M182 116 V96 q13 -16 26 0 V116Z" fill="#6B4226"/><path d="M188 92 V116 M195 88 V116 M202 92 V116" stroke-width="2"/>
    <path d="M137 70 q6 -8 12 0 V82 H137Z M241 74 q6 -8 12 0 V86 H241Z" fill="#2B2240"/>
    <path d="M143 14 V2 M247 22 V10" /><g transform="translate(143 2)"><g class="flag"><path d="M0 0 L18 4 L0 9Z" fill="#FFD23F"/></g></g><g transform="translate(247 10)"><g class="flag" style="animation-delay:-.5s"><path d="M0 0 L18 4 L0 9Z" fill="#FF6FA8"/></g></g>
    ${kid(74, 168, '#8E9AAF', { arm: 25, hair: '#C9D1E3', d: -.4, extra: '<path d="M23 -57 L37 -98" stroke="#2B2240" stroke-width="9"/><path d="M23 -57 L37 -98" stroke="#E8EDF7" stroke-width="4"/><path d="M15 -66 L31 -60" stroke-width="4"/>' })}
    <g transform="translate(58 150)"><path d="M-13 -16 H13 V0 Q13 13 0 19 Q-13 13 -13 0Z" fill="#4C7DFF"/><path d="M0 -12 V14 M-8 -4 H8" stroke="#FFD23F" stroke-width="3"/></g>`,

  demokracia: () => `${bg('#CDEBFF')}${sun(286, 32, 15)}${cloud(140, 18, .9)}${cloud(30, 26, .7, -2)}
    <path d="M0 140 Q90 118 180 138 T320 132 V180 H0Z" fill="#6FD68F"/>
    <g transform="translate(16 62)"><path d="M0 28 L52 2 L104 28Z" fill="#fff"/><rect x="2" y="28" width="100" height="9" fill="#fff"/>
      <rect x="10" y="37" width="12" height="46" fill="#fff"/><rect x="34" y="37" width="12" height="46" fill="#fff"/><rect x="58" y="37" width="12" height="46" fill="#fff"/><rect x="82" y="37" width="12" height="46" fill="#fff"/>
      <rect x="0" y="83" width="104" height="9" fill="#fff"/><circle cx="52" cy="19" r="5" fill="#FFD23F"/></g>
    <g transform="translate(168 152)">
      <g class="ballot"><rect x="-11" y="-92" width="22" height="28" rx="2" fill="#fff"/><path d="M-5 -79 l4 4 l7 -9" fill="none" stroke="#1E9A57" stroke-width="3"/></g>
      <rect x="-34" y="-50" width="68" height="50" rx="6" fill="#4C7DFF"/><rect x="-38" y="-60" width="76" height="13" rx="5" fill="#2F62E0"/>
      <rect x="-17" y="-56" width="34" height="5" rx="2.5" fill="${INK}" ${N}/><circle cx="0" cy="-25" r="11" fill="#FFD23F"/><path d="M-5 -25 l4 4 l7 -8" fill="none" stroke-width="3"/></g>
    ${kid(234, 156, '#FF5A5F', { arm: 12 })}${kid(266, 158, '#B36BFF', { arm: -8, hair: '#F2B33D', d: -.5 })}${kid(296, 160, '#FF9F1C', { arm: 8, skin: '#C98B62', hair: INK, d: -1 })}`,

  prezident: () => `${bg('#D8E8FF')}${cloud(24, 16, .7)}${cloud(250, 12, .6, -3)}
    <path d="M0 150 Q160 138 320 150 V180 H0Z" fill="#6FD68F"/>
    <g transform="translate(108 70)"><rect x="-84" y="22" width="168" height="62" fill="#fff"/><rect x="-90" y="12" width="180" height="12" rx="3" fill="#B8C2D6"/>
      <path d="M-30 14 L0 -12 L30 14Z" fill="#fff"/>
      ${[-70, -50, 40, 60].map(x => `<rect x="${x}" y="34" width="12" height="16" rx="5" fill="#BFE7FF"/><rect x="${x}" y="58" width="12" height="16" rx="5" fill="#BFE7FF"/>`).join('')}
      <rect x="-22" y="26" width="7" height="58" fill="#E8EDF7"/><rect x="-6" y="26" width="7" height="58" fill="#E8EDF7"/><rect x="10" y="26" width="7" height="58" fill="#E8EDF7"/></g>
    <path d="M108 58 V8"/><g transform="translate(108 8)"><g class="flag"><rect x="0" y="0" width="42" height="8" fill="#fff"/><rect x="0" y="8" width="42" height="8" fill="#2F62E0"/><rect x="0" y="16" width="42" height="8" fill="#FF3B3B"/><path d="M8 3 h12 v9 q0 8 -6 10 q-6 -2 -6 -10z" fill="#FF3B3B" stroke-width="2"/><path d="M14 5 V19 M10.5 9 H17.5 M11.5 13 H16.5" stroke="#fff" stroke-width="1.8"/></g></g>
    ${tree(214, 150, .8)}
    <g transform="translate(266 110) rotate(6)"><rect x="-32" y="-42" width="64" height="82" rx="4" fill="#fff"/><path d="M-22 -28 H22 M-22 -18 H22 M-22 -8 H14" stroke-width="2.5"/>
      <path d="M-20 18 q6 -12 10 0 t10 0 t12 -6" fill="none" stroke="#2F62E0" stroke-width="3" pathLength="100" class="sign"/><circle cx="20" cy="30" r="7" fill="#FF5A5F"/>
      <g class="pen"><path d="M14 0 L34 -26 L40 -21 L20 5 L12 8Z" fill="#FFD23F"/></g></g>`,

  inflacia: () => `${bg('#D6F7E4')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${i * 40} -3 h40 v29 a20 11 0 0 1 -40 0Z" fill="${i % 2 ? '#fff' : '#FF5A5F'}"/>`).join('')}
    <rect y="142" width="320" height="38" fill="#C98A4B" ${N}/><path d="M0 142 H320"/>
    <g transform="translate(40 142)"><ellipse cx="0" cy="-7" rx="17" ry="6" fill="#FFD23F"/><ellipse cx="0" cy="-15" rx="17" ry="6" fill="#FFD23F"/><ellipse cx="0" cy="-23" rx="17" ry="6" fill="#FFE27A"/><text x="0" y="-19" ${TXT} fill="${INK}" font-size="9">€</text></g>
    <g transform="translate(112 140)"><g class="bob"><circle cx="-13" cy="-60" r="15" fill="#FFF3C4"/><circle cx="13" cy="-60" r="15" fill="#9C6B4E"/><circle cx="0" cy="-78" r="17" fill="#FF9EC7"/><circle cx="2" cy="-97" r="5" fill="#FF3B5C"/>
      <path d="M-20 -52 L0 -2 L20 -52Z" fill="#F4B860"/><path d="M-12 -44 L6 -20 M0 -52 L11 -38 M12 -44 L-6 -20 M0 -52 L-11 -38" stroke-width="2"/>${face(0, -79, .75)}</g></g>
    <g transform="translate(170 54) rotate(-8)"><path d="M0 0 H50 L62 15 L50 30 H0Z" fill="#fff"/><circle cx="50" cy="15" r="3" fill="${INK}" ${N}/><text x="24" y="21" ${TXT} fill="${INK}" font-size="16">1 €</text><path d="M2 26 L44 4" stroke="#FF5A5F" stroke-width="4"/></g>
    <g transform="translate(192 94) rotate(5)"><g class="pulse"><path d="M0 0 H64 L78 19 L64 38 H0Z" fill="#FFD23F"/><circle cx="64" cy="19" r="3.5" fill="${INK}" ${N}/><text x="31" y="27" ${TXT} fill="${INK}" font-size="21">2 €</text></g></g>
    <g class="grow"><path d="M290 132 V82 H278 L298 56 L318 82 H306 V132Z" fill="#2FBF71"/></g>`,

  peniaze: () => `${bg('#E0F7D8')}${plus(24, 24, '#86C232')}${plus(170, 20, '#FFC94A', .6)}
    <rect y="150" width="320" height="30" fill="#A8E6A0" ${N}/><path d="M0 150 H320"/>
    <g transform="translate(52 128)"><g class="hop"><path d="M-26 -6 q-12 -10 -6 -22 q6 8 10 10" fill="#fff"/><ellipse rx="26" ry="20" fill="#fff"/><path d="M-8 18 V26 M8 18 V26" stroke="#FFA62B" stroke-width="3"/>
      <circle cx="20" cy="-18" r="12" fill="#fff"/><path d="M14 -29 q3 -8 7 -1 q4 -8 7 2" fill="#FF5A5F"/><path d="M31 -18 l8 3 l-8 3z" fill="#FFA62B"/><g class="blink">${dot(22, -20, 2)}</g><path d="M-8 -2 q8 8 16 0" fill="none" stroke-width="2.5"/></g></g>
    <ellipse cx="96" cy="140" rx="8" ry="10" fill="#FFF8E0"/>
    <g class="swap"><path d="M110 98 H146 M138 90 L146 98 L138 106" fill="none" stroke-width="3.5"/><path d="M146 118 H110 M118 110 L110 118 L118 126" fill="none" stroke-width="3.5"/></g>
    <g transform="translate(182 112)"><path d="M-26 10 Q-28 -16 0 -18 Q28 -16 26 10Z" fill="#E8A86A"/><path d="M-12 -8 l6 10 M0 -10 l6 10 M12 -8 l6 10" stroke-width="2.5"/>${face(0, 2, .7)}</g>
    <g transform="translate(266 66) rotate(8)"><g class="bob"><rect x="-38" y="-20" width="76" height="40" rx="5" fill="#9BE3B4"/><circle r="12" fill="#fff"/><text y="5" ${TXT} fill="${INK}" font-size="14">€</text><rect x="-32" y="-14" width="11" height="11" rx="2" fill="#FFD23F"/><rect x="22" y="6" width="10" height="8" rx="2" fill="#C9A6FF"/></g></g>
    <g transform="translate(262 146)"><ellipse cx="0" cy="-6" rx="18" ry="6" fill="#FFD23F"/><ellipse cx="0" cy="-14" rx="18" ry="6" fill="#FFD23F"/><ellipse cx="0" cy="-22" rx="18" ry="6" fill="#FFE27A"/><g transform="translate(30 -10)"><g class="spinY"><circle r="10" fill="#FFD23F"/><text y="4" ${TXT} fill="${INK}" font-size="11">€</text></g></g></g>`,

  dane: () => `${bg('#CDEBFF')}${cloud(118, 16, .8)}${cloud(250, 22, .7, -2)}
    <path d="M0 132 Q100 112 200 130 T320 124 V180 H0Z" fill="#6FD68F"/>
    <g transform="translate(14 76)"><rect x="0" y="22" width="78" height="56" fill="#FFD9A0"/><path d="M-6 24 L39 -6 L84 24Z" fill="#FF5A5F"/><rect x="31" y="50" width="16" height="28" fill="#9A6234"/><rect x="8" y="34" width="16" height="14" fill="#BFE7FF"/><rect x="54" y="34" width="16" height="14" fill="#BFE7FF"/><g transform="translate(39 10)"><g class="ring"><circle r="6" fill="#FFD23F"/></g></g></g>
    <g transform="translate(228 70)"><rect x="0" y="10" width="80" height="74" fill="#fff"/><rect x="-4" y="2" width="88" height="12" rx="4" fill="#4C7DFF"/><g class="pulse"><path d="M34 24 h12 v10 h10 v12 h-10 v10 h-12 v-10 h-10 v-12 h10z" fill="#FF5A5F"/></g><rect x="10" y="64" width="16" height="20" fill="#BFE7FF"/><rect x="54" y="64" width="16" height="20" fill="#BFE7FF"/></g>
    <g transform="translate(162 140)">
      <g class="coin"><circle cx="1" cy="-62" r="11" fill="#FFD23F"/><text x="1" y="-57" ${TXT} fill="${INK}" font-size="13">€</text></g>
      <rect x="-28" y="18" width="12" height="16" rx="5" fill="#FF8FB8"/><rect x="16" y="18" width="12" height="16" rx="5" fill="#FF8FB8"/>
      <path d="M44 -4 q14 -4 8 -14 q-6 -6 -6 4" fill="none"/>
      <ellipse rx="48" ry="34" fill="#FF9EC7"/><path d="M-22 -28 L-12 -48 L-2 -31Z" fill="#FF8FB8"/>
      <ellipse cx="-48" cy="4" rx="10" ry="12" fill="#FF8FB8"/><ellipse cx="-51" cy="0" rx="2" ry="3" fill="${INK}" ${N}/><ellipse cx="-45" cy="8" rx="2" ry="3" fill="${INK}" ${N}/>
      <g class="blink">${dot(-26, -10, 3.5)}</g><circle cx="-28" cy="6" r="5" fill="#FF6FA8" opacity=".7" ${N}/><path d="M-16 6 q5 5 10 0" fill="none" stroke-width="2.5"/>
      <rect x="-12" y="-36" width="26" height="6" rx="3" fill="${INK}" ${N}/></g>`,

  odpad: () => `${bg('#DDF5E8')}${plus(22, 26, '#2FBF71')}${plus(296, 30, '#4C7DFF', .7)}
    <rect y="150" width="320" height="30" fill="#A8E6A0" ${N}/><path d="M0 150 H320"/>
    <text x="160" y="44" font-size="30" text-anchor="middle" stroke="none" class="spin">♻️</text>
    ${padá(52, 40, 0, '<rect x="-6" y="-14" width="12" height="24" rx="4" fill="#8FD3FF"/><rect x="-3.5" y="-20" width="7" height="6" fill="#2F62E0"/>')}
    ${padá(124, 40, .8, '<circle r="10" fill="#fff"/><path d="M-6 -2 l4 3 l3 -5 l4 4" fill="none" stroke-width="2"/>')}
    ${padá(196, 40, 1.6, '<path d="M-8 -12 h16 v4 q4 2 4 6 v14 q0 4 -4 4 h-16 q-4 0 -4 -4 v-14 q0 -4 4 -6z" fill="#A8F0C6"/>')}
    ${padá(268, 40, 2.4, '<path d="M-8 -12 h16 q-6 6 -2 12 q-4 6 2 12 h-16 q6 -6 2 -12 q4 -6 -2 -12z" fill="#FFF3C4"/><ellipse cx="0" cy="-13" rx="9" ry="3" fill="#FF5A5F"/><ellipse cx="0" cy="13" rx="9" ry="3" fill="#FF5A5F"/>')}
    ${kos(52, '#FFD23F')}${kos(124, '#4C7DFF')}${kos(196, '#2FBF71')}${kos(268, '#A0663A')}`,

  internet: () => `${bg('#E2E0FF')}${plus(30, 30, '#9B8CFF')}${plus(292, 24, '#9B8CFF', .5)}${plus(246, 158, '#FF9EC7', 1)}${plus(60, 156, '#FF9EC7', 1.4)}${plus(204, 18, '#FFC94A', .8)}
    <path d="M66 96 Q96 54 126 70" fill="none" stroke-dasharray="6 7" class="dash"/><path d="M194 70 Q226 54 250 92" fill="none" stroke-dasharray="6 7" class="dash"/>
    <g transform="translate(160 94)"><g class="bob"><circle r="54" fill="#4FC3F7"/>
      <path d="M-40 -24 q14 -14 30 -6 q10 8 -2 16 q-10 4 -6 14 q-12 6 -22 -6 q-8 -10 0 -18z" fill="#4CD07D"/>
      <path d="M10 -40 q20 -6 30 10 q6 14 -10 14 q-10 0 -12 10 q-14 2 -14 -10 q0 -16 6 -24z" fill="#4CD07D"/>
      <path d="M-14 30 q16 -6 26 4 q4 12 -10 14 q-14 0 -16 -18z" fill="#4CD07D"/>
      <ellipse rx="54" ry="18" fill="none" stroke-width="2" opacity=".3"/>${face(2, 10, 1.25)}</g></g>
    <g transform="translate(26 66)"><rect width="42" height="72" rx="9" fill="${INK}"/><rect x="5" y="9" width="32" height="50" rx="4" fill="#B36BFF" ${N}/><g class="pulse"><path d="M16 26 L28 34 L16 42Z" fill="#fff" ${N}/></g><circle cx="21" cy="65" r="3" fill="#fff" ${N}/></g>
    <g transform="translate(238 82)"><rect x="6" y="0" width="62" height="42" rx="5" fill="${INK}"/><rect x="11" y="5" width="52" height="32" rx="2" fill="#FFD23F" ${N}/>${face(37, 19, .8)}<path d="M0 42 H74 L68 52 H6Z" fill="#C9C3E8"/></g>
    <g transform="translate(66 96)"><g class="pk1"><rect x="-7" y="-7" width="14" height="14" rx="3" fill="#FF9F1C"/></g></g>
    <g transform="translate(194 70)"><g class="pk2"><rect x="-7" y="-7" width="14" height="14" rx="3" fill="#FF6FA8"/></g></g>`,

  lietadlo: () => `${bg('#BFE7FF')}${cloud(14, 112, .9)}${cloud(226, 132, .8, -2)}${cloud(250, 20, .6, -4)}
    <g class="speed"><path d="M14 70 h40 M4 84 h50 M18 98 h34" stroke="#fff" stroke-width="5"/></g>
    <g transform="translate(160 82)"><g class="fly">
      <path d="M-6 -14 L-22 -38 H-8 L18 -14Z" fill="#3B66D6"/>
      <path d="M-70 0 Q-70 -16 -50 -16 H50 Q80 -16 86 0 Q80 14 50 14 H-50 Q-70 14 -70 0Z" fill="#fff"/>
      <path d="M-62 -14 L-74 -42 H-56 L-40 -14Z" fill="#FF5A5F"/>
      <path d="M-64 5 H80" stroke="#FFD23F" stroke-width="4"/>
      ${[-36, -22, -8, 6, 20, 34].map(x => `<circle cx="${x}" cy="-4" r="4.5" fill="#8FD3FF" stroke-width="2"/>`).join('')}
      <path d="M62 -11 Q74 -11 80 -3 H62Z" fill="#8FD3FF" stroke-width="2"/>
      <path d="M-10 4 L-34 40 H-14 L22 4Z" fill="#4C7DFF"/>${lica(72, 4, 0)}</g></g>
    <g class="lift"><path d="M146 148 V128 M138 136 L146 126 L154 136" fill="none" stroke="#2FBF71" stroke-width="4"/><path d="M176 152 V132 M168 140 L176 130 L184 140" fill="none" stroke="#2FBF71" stroke-width="4"/></g>
    <path d="M270 70 q5 -5 10 0 q5 -5 10 0" fill="none" stroke-width="2.5"/>`,

  obloha: () => `${bg('#8FD3FF')}${cloud(150, 14, .6)}
    <path d="M0 180 V150 Q80 128 160 146 T320 140 V180Z" fill="#6FD68F"/>
    <g stroke-width="6" class="beam">${['#FF5A5F', '#FF9F1C', '#FFD23F', '#2FBF71', '#4C7DFF', '#9B6BFF'].map((c, i) => `<path d="M76 62 L204 ${44 + i * 11}" stroke="${c}"/>`).join('')}</g>
    ${[[214, 30], [244, 58], [226, 96], [270, 26], [292, 80], [196, 120], [258, 116]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g class="twinkle" style="animation-delay:${i * .25}s"><path d="M-8 0 l4 -4 l4 4 l4 -4 l4 4" fill="none" stroke="#2F62E0" stroke-width="3"/></g></g>`).join('')}
    ${sun(56, 54, 24)}
    ${kid(268, 160, '#FF6FA8', { arm: -30 })}<g transform="translate(296 90)"><g class="bob"><circle r="14" fill="#fff"/><text y="7" ${TXT} fill="${INK}" font-size="19">?</text></g></g>`,

  gravitacia: () => `${bg('#CDEBFF')}
    <g transform="translate(282 36)"><circle r="20" fill="#FFF3B0"/><circle cx="-8" cy="-8" r="4" fill="#F4DC7A" ${N}/><circle cx="9" cy="9" r="3" fill="#F4DC7A" ${N}/>${face(0, 2, .8)}</g>
    <path d="M0 150 Q160 132 320 150 V180 H0Z" fill="#6FD68F"/>
    <rect x="58" y="70" width="22" height="84" rx="6" fill="#9A6234"/>
    ${(() => { const c = [[40, 62, 34], [88, 54, 36], [66, 30, 30], [104, 84, 24], [30, 94, 24]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''); return `<g fill="#4CD07D">${c}</g><g fill="#4CD07D" ${N}>${c}</g>`; })()}
    ${[[48, 50], [94, 40], [80, 78], [30, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#FF5A5F"/>`).join('')}
    <g transform="translate(124 84)"><g class="fall"><circle r="8" fill="#FF5A5F"/><path d="M0 -8 q3 -6 8 -6" fill="none" stroke-width="2.5"/></g></g>
    ${kid(160, 158, '#FF9F1C', { arm: -15 })}
    <path d="M214 50 V122" fill="none" stroke-dasharray="6 6" class="dash"/><path d="M206 114 L214 126 L222 114" fill="none"/>
    <g transform="translate(266 142)"><g class="bounce"><circle r="12" fill="#FF6FA8"/><path d="M-12 0 q12 6 24 0" fill="none" stroke-width="2"/></g></g>`,

  dazd: () => `${bg('#BFE7FF')}${sun(50, 40, 20)}
    <path d="M0 136 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V180 H0Z" fill="#3D8BFF"/>
    <g class="waves"><path d="M16 158 q10 -6 20 0 M120 164 q10 -6 20 0 M200 156 q10 -6 20 0" fill="none" stroke="#BFE7FF" stroke-width="3"/></g>
    <path d="M232 142 Q270 102 314 142Z" fill="#6FD68F"/>${tree(274, 130, .8)}
    <g class="rise"><path d="M70 126 q-7 -8 0 -16 q7 -8 0 -16" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="3 6"/><path d="M100 122 q-7 -8 0 -16 q7 -8 0 -16" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="3 6"/></g>
    ${drop(160, 100, 0)}${drop(184, 104, .45)}${drop(208, 100, .9)}${drop(172, 98, 1.1)}${drop(198, 96, .25)}${drop(222, 102, .7)}
    ${cloud(130, 40, 2)}${face(164, 60, 1.3)}`,

  jesen: () => `${bg('#FFE7C7')}${sun(280, 34, 16)}${cloud(170, 18, .6)}
    <path d="M0 150 Q160 136 320 150 V180 H0Z" fill="#E0A96D"/>
    ${[[30, 160, '#FF5A5F'], [48, 164, '#FFD23F'], [64, 158, '#FF9F1C'], [150, 166, '#FF5A5F'], [168, 162, '#FFC233']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="${c}" stroke-width="2"/>`).join('')}
    <rect x="98" y="86" width="20" height="68" rx="5" fill="#9A6234"/>
    ${(() => { const c = [[80, 70, 26, '#FF9F1C'], [124, 60, 30, '#FF5A5F'], [144, 88, 22, '#FFD23F'], [98, 42, 22, '#FFC233'], [70, 96, 18, '#FF8A3D']]; return c.map(([x, y, r, f]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`).join('') + c.map(([x, y, r, f]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${N}/>`).join(''); })()}
    ${list(150, 66, '#FF5A5F', 0)}${list(178, 56, '#FFD23F', 1.3)}${list(60, 80, '#FF9F1C', 2.1)}${list(200, 72, '#FF8A3D', 2.9)}${list(120, 100, '#FFC233', .7)}
    ${jezko(236, 152)}`,

  srdce: () => `${bg('#FFE1E8')}${plus(36, 40, '#FF9EC7')}${plus(286, 36, '#FF9EC7', .6)}${plus(254, 64, '#FFC94A', 1.1)}
    <path d="M0 128 H70 l10 -26 l12 52 l10 -40 l8 14 H320" fill="none" stroke="#FF5A5F" stroke-width="4" pathLength="100" class="ecg"/>
    <g transform="translate(160 92)"><g class="beat"><path d="M0 52 C-58 16 -66 -22 -40 -38 C-20 -50 -4 -38 0 -24 C4 -38 20 -50 40 -38 C66 -22 58 16 0 52Z" fill="#FF4D6D"/>
      <ellipse cx="-34" cy="-22" rx="9" ry="5" fill="#fff" opacity=".65" ${N} transform="rotate(-35 -34 -22)"/>${face(0, -2, 1.5)}</g></g>
    <g class="speed"><path d="M238 116 h-16 M242 128 h-20 M238 140 h-14" stroke-width="3"/></g>
    ${kid(272, 164, '#4C7DFF', { arm: 40 })}${kid(48, 164, '#2FBF71', { arm: -20, hair: '#F2B33D', d: -.6 })}`,

  spanok: () => `${bg('#2E2A6B')}
    ${[[30, 30], [80, 18], [140, 40], [200, 22], [170, 70], [40, 80], [300, 100]].map(([x, y], i) => hviezdicka(x, y, .8, '#FFE27A', i * .3)).join('')}
    <g transform="translate(262 48)"><g class="bob"><circle r="26" fill="#FFE27A"/>${face(0, 0, 1, 'sleep')}<path d="M-20 -14 Q0 -46 28 -26 L18 -14 Q2 -26 -14 -10Z" fill="#4C7DFF"/><circle cx="30" cy="-28" r="6" fill="#fff"/></g></g>
    <rect y="150" width="320" height="30" fill="#5B4FA8" ${N}/><path d="M0 150 H320"/>
    <rect x="66" y="90" width="16" height="64" rx="6" fill="#FF8FB8"/><rect x="246" y="112" width="12" height="42" rx="5" fill="#FF8FB8"/>
    <rect x="78" y="118" width="172" height="26" rx="8" fill="#fff"/>
    <rect x="86" y="102" width="44" height="20" rx="10" fill="#fff"/>
    <g transform="translate(110 102)"><circle r="14" fill="#FFD2B0"/><path d="M-14 -2 C-14 -18 14 -18 14 -2 C8 -8 -2 -9 -14 -2Z" fill="#6B4226"/>${face(0, 2, .6, 'sleep')}</g>
    <path d="M120 116 H248 V142 H120 Q108 130 120 116Z" fill="#4C7DFF"/>
    ${[[150, 126], [178, 134], [206, 124], [232, 134]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#FFD23F" ${N}/>`).join('')}
    ${[0, 1, 2].map(i => `<g transform="translate(${136 + i * 16} ${84 - i * 12})"><g class="zzz" style="animation-delay:${i * .7}s"><text ${TXT} fill="#fff" font-size="${16 + i * 4}">Z</text></g></g>`).join('')}`,

  hranice: () => `${bg('#8FD3FF')}
    <g class="waves"><path d="M14 168 q6 -5 12 0 M284 168 q6 -5 12 0 M26 18 q6 -5 12 0" fill="none" stroke="#fff" stroke-width="2.5"/></g>
    <path d="M18 40 Q40 14 90 20 Q140 18 162 28 Q150 60 170 90 Q150 120 166 158 Q110 168 60 160 Q20 150 24 110 Q10 76 18 40Z" fill="#FFD23F"/>
    <path d="M162 28 Q210 16 254 26 Q290 34 290 80 Q300 130 262 158 Q220 168 166 158 Q150 120 170 90 Q150 60 162 28Z" fill="#FF9EC7"/>
    <path d="M162 28 Q150 60 170 90 Q150 120 166 158" fill="none" stroke="${INK}" stroke-width="11"/><path d="M162 28 Q150 60 170 90 Q150 120 166 158" fill="none" stroke="#3D8BFF" stroke-width="6" stroke-dasharray="10 6" class="dash"/>
    <g transform="translate(70 62)"><path d="M-26 16 L-8 -14 L10 16Z" fill="#8EA6C8"/><path d="M-14 -4 L-8 -14 L-2 -4 L-5 -1 L-8 -5 L-11 -1Z" fill="#fff"/><path d="M0 16 L16 -8 L32 16Z" fill="#8EA6C8"/></g>
    ${pine(232, 72, .6)}${pine(250, 80, .55)}${pine(216, 86, .5)}
    ${face(96, 118, 1.3)}${face(226, 120, 1.3)}
    <g transform="translate(190 140)"><rect x="-3" y="-30" width="7" height="34" fill="#fff"/><g transform="translate(0 -26)"><g class="gate"><rect x="0" y="-5" width="54" height="10" rx="5" fill="#fff"/><rect x="10" y="-4" width="9" height="8" fill="#FF5A5F" ${N}/><rect x="28" y="-4" width="9" height="8" fill="#FF5A5F" ${N}/></g></g></g>
    <g transform="translate(290 156)"><circle r="16" fill="#fff"/><g class="needle"><path d="M0 -12 L5 0 L0 12 L-5 0Z" fill="#FF5A5F"/></g><text x="0" y="-19" ${TXT} fill="${INK}" font-size="11">S</text></g>`,

  hory: () => `${bg('#C6E9FF')}${sun(278, 34, 16)}${cloud(24, 24, .8)}${cloud(196, 14, .6, -3)}
    <path d="M0 120 L40 76 L70 100 L104 62 L140 104 L170 84 L210 112 L250 70 L290 100 L320 82 V180 H0Z" fill="#A9BDDE"/>
    <path d="M96 71 L104 62 L112 72 L108 76 L104 72 L100 76Z" fill="#fff"/><path d="M242 79 L250 70 L258 80 L254 83 L250 79 L246 83Z" fill="#fff"/>
    <path d="M84 150 L158 38 L232 150Z" fill="#7189BD"/><path d="M139 66 L158 38 L177 66 L169 72 L161 64 L153 74 L147 68Z" fill="#fff"/>
    <path d="M158 38 V16"/><g transform="translate(158 16)"><g class="flag"><path d="M0 0 L24 5 L0 11Z" fill="#FF5A5F"/></g></g>
    ${face(158, 104, 1.1)}
    <g class="birds"><path d="M58 52 q6 -6 12 0 q6 -6 12 0" fill="none" stroke-width="2.5"/><path d="M214 48 q5 -5 10 0 q5 -5 10 0" fill="none" stroke-width="2.5"/></g>
    <path d="M0 150 Q60 124 130 146 Q200 128 250 144 Q290 132 320 140 V180 H0Z" fill="#4CD07D"/><path d="M0 168 Q80 154 160 168 T320 166 V180 H0Z" fill="#2FB36A"/>
    ${pine(34, 154, .9)}${pine(58, 160, .7)}${pine(272, 152, .85)}${pine(298, 158, .7)}${kid(214, 170, '#FF9F1C', { arm: 20, s: .75 })}`,

  obdobia: () => `${bg('#25307A')}
    ${[[24, 24], [70, 160], [300, 22], [290, 150], [120, 16], [210, 166]].map(([x, y], i) => hviezdicka(x, y, .7, '#FFE27A', i * .35)).join('')}
    <ellipse cx="160" cy="92" rx="118" ry="58" fill="none" stroke="#fff" stroke-dasharray="4 7" opacity=".6"/>
    ${sun(160, 92, 24)}
    <text x="160" y="28" font-size="22" text-anchor="middle" stroke="none">❄️</text><text x="160" y="172" font-size="22" text-anchor="middle" stroke="none">☀️</text>
    <text x="24" y="100" font-size="22" text-anchor="middle" stroke="none">🌸</text><text x="296" y="100" font-size="22" text-anchor="middle" stroke="none">🍂</text>
    <g><animateMotion dur="10s" repeatCount="indefinite" path="M278 92 A118 58 0 1 1 42 92 A118 58 0 1 1 278 92"/>
      <g transform="rotate(23)"><path d="M0 -24 V24" stroke="#fff" stroke-width="2.5"/><circle r="14" fill="#4FC3F7"/><path d="M-7 -8 q8 -5 11 3 q-6 5 -11 -3z M2 4 q8 -2 8 6 q-6 3 -8 -6z" fill="#4CD07D" stroke-width="2"/></g></g>`,

  hnev: () => `${bg('#EEDDFF')}${plus(160, 150, '#FF9EC7')}${plus(30, 30, '#B9A6FF', .5)}${plus(296, 152, '#B9A6FF', 1)}
    <g transform="translate(46 30)"><g class="steam">${cloud(0, 0, .55)}</g></g><g transform="translate(96 22)"><g class="steam" style="animation-delay:-1.1s">${cloud(0, 0, .45)}</g></g>
    <g transform="translate(82 102)"><g class="shakeX"><circle r="44" fill="#FF8A65"/>${face(0, 4, 1.6, 'angry')}</g></g>
    <path d="M140 96 Q162 72 186 96" fill="none" stroke-width="4"/><path d="M178 86 L187 98 L173 99" fill="none" stroke-width="4"/>
    <text x="162" y="66" ${TXT} fill="${INK}" font-size="16">1 · 2 · 3</text>
    <g transform="translate(240 102)"><g class="breathe"><circle r="44" fill="#7FE0A8"/><path d="M-20 -2 q7 -8 14 0 M6 -2 q7 -8 14 0" fill="none" stroke-width="3.5"/><path d="M-11 14 q11 11 22 0" fill="none" stroke-width="3.5"/>${lica(0, 10, 24)}</g></g>
    <path d="M288 66 q12 -4 10 -14 q-2 -8 -10 -4" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M296 82 q10 0 12 -8" fill="none" stroke="#fff" stroke-width="3.5"/>`,

  kamarat: () => `${bg('#FFE6F2')}
    ${['#FF5A5F', '#FF9F1C', '#FFD23F', '#2FBF71', '#4C7DFF', '#9B6BFF'].map((c, i) => `<path d="M${46 + i * 10} 150 A${114 - i * 10} ${104 - i * 10} 0 0 1 ${274 - i * 10} 150" fill="none" stroke="${c}" stroke-width="10" ${N}/>`).join('')}
    <path d="M41 150 A119 109 0 0 1 279 150 M101 150 A59 49 0 0 1 219 150" fill="none"/>
    ${cloud(14, 132, .9)}${cloud(244, 132, .9, -2)}
    <rect y="156" width="320" height="24" fill="#A8E6A0" ${N}/><path d="M0 156 H320"/>
    ${srdiecko(174, 96, 1.3, '#FF5A5F', 0)}${srdiecko(160, 100, .9, '#FF6FA8', 1)}${srdiecko(188, 104, 1, '#FF9EC7', 2)}
    ${kid(136, 160, '#4C7DFF', { arm: 70 })}${kid(212, 160, '#FF6FA8', { arm: 70, flip: true, hair: '#F2B33D', d: -.8 })}`,

  pismo: () => `${bg('#FFF0CF')}${plus(296, 24, '#FF9F1C')}${plus(24, 160, '#B36BFF', .7)}
    <g transform="translate(58 92) rotate(-6)"><rect x="-38" y="-48" width="76" height="94" rx="10" fill="#D9A06B"/>
      ${[-32, -16, 0, 16, 30].map(y => [-24, -8, 8, 22].map(x => `<path d="M${x} ${y} l9 3 l-9 3z" fill="${INK}" ${N}/>`).join('')).join('')}</g>
    <g transform="translate(160 96)"><rect x="-34" y="-50" width="68" height="100" fill="#FFF8E0"/><rect x="-40" y="-58" width="80" height="12" rx="6" fill="#E8B04A"/><rect x="-40" y="46" width="80" height="12" rx="6" fill="#E8B04A"/>
      <path d="M-20 -28 q10 -10 20 0 q-10 10 -20 0z" fill="#fff"/>${dot(-10, -28, 3)}
      <path d="M6 -32 q8 -4 12 2 l6 -2 l-4 6 q-4 6 -14 4z" fill="#4C7DFF"/>
      <circle cx="-12" cy="2" r="7" fill="#FFD23F"/><path d="M4 -2 l5 6 l5 -6 l5 6" fill="none" stroke="#2BA9EE" stroke-width="3"/>
      <path d="M-20 24 l5 -5 l5 5 l5 -5 l5 5 M6 18 h14 v14 h-14z" fill="none" stroke-width="2.5"/></g>
    <g transform="translate(262 108)"><path d="M-40 -34 Q-20 -42 0 -34 V36 Q-20 28 -40 36Z" fill="#fff"/><path d="M40 -34 Q20 -42 0 -34 V36 Q20 28 40 36Z" fill="#fff"/>
      <text x="-20" y="8" ${TXT} fill="#FF5A5F" font-size="24">A</text><text x="20" y="8" ${TXT} fill="#4C7DFF" font-size="24">B</text></g>
    ${[['C', 230, 40, '#2FBF71', 0], ['Á', 290, 56, '#B36BFF', .6], ['Ž', 212, 22, '#FF9F1C', 1.2]].map(([p, x, y, c, d]) => `<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${d}s"><text ${TXT} fill="${c}" font-size="20">${p}</text></g></g>`).join('')}
    <g transform="translate(150 164) rotate(-12)"><g class="write"><rect x="-40" y="-6" width="70" height="12" fill="#FFD23F"/><path d="M30 -6 L44 0 L30 6Z" fill="#F4C58C"/><rect x="-48" y="-6" width="10" height="12" rx="3" fill="#FF8FB8"/></g></g>`,

  olympiada: () => `${bg('#CDEBFF')}${cloud(262, 20, .7)}
    <g class="bob">${[[110, 34, '#2F7BF5'], [146, 34, INK], [182, 34, '#FF5A5F'], [128, 52, '#FFC233'], [164, 52, '#2FBF71']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${c}" stroke-width="6"/>`).join('')}</g>
    <rect y="150" width="320" height="30" fill="#6FD68F" ${N}/><path d="M0 150 H320"/>
    <rect x="100" y="112" width="40" height="40" fill="#C9D3E6"/><rect x="140" y="98" width="40" height="54" fill="#FFD23F"/><rect x="180" y="122" width="40" height="30" fill="#F4B27A"/>
    <text x="120" y="140" ${TXT} fill="${INK}" font-size="18">2</text><text x="160" y="132" ${TXT} fill="${INK}" font-size="20">1</text><text x="200" y="144" ${TXT} fill="${INK}" font-size="16">3</text>
    ${kid(120, 112, '#4C7DFF', { arm: -10, s: .72, d: -.3 })}${kid(160, 98, '#FF5A5F', { arm: 20, s: .8, hair: '#F2B33D', extra: '<circle cx="0" cy="-22" r="7" fill="#FFD23F"/>' })}${kid(200, 122, '#2FBF71', { arm: 10, s: .68, skin: '#C98B62', hair: INK, d: -.8 })}
    <g transform="translate(46 150)"><path d="M-8 -50 H8 L4 0 H-4Z" fill="#C9C3E8"/><g transform="translate(0 -52)"><g class="flame"><path d="M0 -30 C14 -14 12 0 0 0 C-12 0 -14 -14 0 -30Z" fill="#FF9F1C"/><path d="M0 -16 C6 -8 5 0 0 0 C-5 0 -6 -8 0 -16Z" fill="#FFD23F"/></g></g></g>
    <g transform="translate(272 150)"><g class="pulse"><path d="M-16 -50 H16 Q16 -24 0 -20 Q-16 -24 -16 -50Z" fill="#FFD23F"/><path d="M-16 -44 q-10 0 -10 8 q0 8 12 10 M16 -44 q10 0 10 8 q0 8 -12 10" fill="none"/><rect x="-4" y="-20" width="8" height="10" fill="#FFD23F"/><rect x="-12" y="-10" width="24" height="10" rx="2" fill="#9A6234"/></g></g>`,

  pravek: () => `${bg('#FFD9A8')}${sun(282, 42, 17)}${cloud(150, 14, .6)}
    <path d="M0 150 Q160 128 320 150 V180 H0Z" fill="#D9B27A"/>
    <path d="M-4 180 V64 Q16 26 70 30 Q122 28 138 82 L142 180Z" fill="#A3939F"/>
    <path d="M22 180 V112 Q28 78 62 78 Q98 80 106 114 V180Z" fill="#4A3D52"/>
    <path d="M74 56 q10 -10 22 0 v8 M78 58 v7 M92 60 v6 M74 56 q-6 3 -5 9 M96 56 l6 -4" fill="none" stroke="#D2452B" stroke-width="2.5"/>
    <g transform="translate(138 166)"><path d="M-18 6 L18 -2 M-18 -2 L18 6" stroke="${INK}" stroke-width="11"/><path d="M-18 6 L18 -2 M-18 -2 L18 6" stroke="#8B5A2B" stroke-width="6"/>
      <g transform="translate(0 -2)"><g class="flame"><path d="M0 -36 C17 -17 15 0 0 0 C-15 0 -17 -17 0 -36Z" fill="#FF7A1F"/><path d="M0 -19 C7 -9 6 0 0 0 C-6 0 -7 -9 0 -19Z" fill="#FFD23F"/></g></g></g>
    ${kid(186, 170, '#C98A4B', { arm: -35, hair: '#3A2A1A' })}
    <g transform="translate(266 128)"><g class="bob">
      <rect x="-30" y="16" width="14" height="28" rx="5" fill="#7A4B30"/><rect x="-4" y="18" width="14" height="26" rx="5" fill="#7A4B30"/><rect x="20" y="16" width="14" height="28" rx="5" fill="#7A4B30"/>
      <ellipse rx="40" ry="30" fill="#8B5A3C"/><path d="M-24 -20 q6 -10 12 -2 q6 -10 12 -2 q6 -10 12 -2" fill="none" stroke-width="2.5"/>
      <circle cx="-36" cy="-10" r="22" fill="#8B5A3C"/>
      <path d="M-54 0 q-8 18 2 30 q6 4 8 -2 q-8 -10 2 -24" fill="#8B5A3C"/>
      <path d="M-46 8 q-14 12 -2 22" fill="none" stroke="${INK}" stroke-width="9"/><path d="M-46 8 q-14 12 -2 22" fill="none" stroke="#FFF8E0" stroke-width="4.5"/>
      <ellipse cx="-24" cy="-8" rx="9" ry="13" fill="#7A4B30"/><g class="blink">${dot(-44, -16, 2.6)}</g></g></g>`,

  zakony: () => `${bg('#CDEBFF')}${cloud(110, 16, .7)}${cloud(230, 24, .6, -2)}
    <rect y="132" width="320" height="48" fill="#8E8AA0" ${N}/><path d="M0 132 H320 M0 178 H320"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${118 + i * 16}" y="137" width="10" height="38" fill="#fff" ${N}/>`).join('')}
    <rect x="44" y="70" width="8" height="64" fill="#6B6B7B"/><rect x="30" y="20" width="36" height="58" rx="8" fill="${INK}"/>
    ${[['#FF5A5F', 34, 0], ['#FFD23F', 49, -2], ['#2FBF71', 64, -4]].map(([c, y, d]) => `<circle cx="48" cy="${y}" r="7" fill="${c}" class="svetlo" style="animation-delay:${d}s" ${N}/>`).join('')}
    ${kid(166, 168, '#FF6FA8', { arm: 20 })}
    <g transform="translate(262 90)"><g class="bob"><path d="M-40 -30 Q-20 -38 0 -30 V36 Q-20 28 -40 36Z" fill="#fff"/><path d="M40 -30 Q20 -38 0 -30 V36 Q20 28 40 36Z" fill="#fff"/>
      <text x="-20" y="14" ${TXT} fill="#4C7DFF" font-size="34">§</text><path d="M8 -14 H32 M8 -4 H32 M8 6 H28 M8 16 H30" stroke-width="2.5"/></g></g>`,

  setrenie: () => `${bg('#E9E0FF')}${plus(26, 26, '#B36BFF')}${plus(298, 150, '#FF9EC7', .6)}
    <rect y="152" width="320" height="28" fill="#C9A6FF" ${N}/><path d="M0 152 H320"/>
    <g transform="translate(118 40)"><g class="coin"><circle r="11" fill="#FFD23F"/><text y="4" ${TXT} fill="${INK}" font-size="12">€</text></g></g>
    <g transform="translate(118 152)"><rect x="-40" y="-82" width="80" height="82" rx="16" fill="#D6F0FF"/>
      ${[[-20, -12], [0, -12], [20, -12], [-10, -25], [10, -25], [0, -38]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="#FFD23F" stroke-width="2"/>`).join('')}
      <path d="M-28 -70 q4 -6 10 -6" fill="none" stroke="#fff" stroke-width="4"/>
      <rect x="-34" y="-94" width="68" height="14" rx="5" fill="#FF8A3D"/><rect x="-12" y="-90" width="24" height="5" rx="2.5" fill="${INK}" ${N}/></g>
    ${kid(204, 170, '#2FBF71', { arm: -20 })}
    <circle cx="222" cy="100" r="4" fill="#fff"/><circle cx="232" cy="88" r="6" fill="#fff"/>
    <g transform="translate(270 54)"><g class="bob"><ellipse rx="44" ry="30" fill="#fff"/><circle cx="-16" cy="8" r="10" fill="none" stroke-width="2.5"/><circle cx="16" cy="8" r="10" fill="none" stroke-width="2.5"/><path d="M-16 8 L-4 -8 L16 8 M-4 -8 H10 L16 8 M-8 -12 h8" fill="none" stroke="#FF5A5F" stroke-width="3"/></g></g>`,

  ruky: () => `${bg('#D9F4FF')}
    <path d="M0 40 H320 M0 80 H320 M60 0 V130 M120 0 V130 M180 0 V130 M240 0 V130" stroke="#BCE6F7" stroke-width="2"/>
    <rect y="130" width="320" height="50" fill="#fff" ${N}/><path d="M0 130 H320"/>
    <path d="M30 130 Q30 166 90 166 Q150 166 150 130Z" fill="#E8F4FA"/>
    <path d="M86 130 V96 Q86 80 102 80 H120 V92 H104 Q100 92 100 98 V130Z" fill="#C9D1E3"/>
    <path d="M113 94 V128" stroke="#3D8BFF" stroke-width="5" stroke-dasharray="6 5" class="dash"/>
    ${[[170, 92, 9, 0], [206, 74, 12, .6], [232, 98, 7, 1.2], [150, 70, 6, 1.8], [128, 58, 10, .9]].map(([x, y, r, d]) => `<g transform="translate(${x} ${y})"><g class="rise" style="animation-delay:${d}s"><circle r="${r}" fill="#fff" opacity=".9" stroke-width="2"/><circle cx="${-r * .35}" cy="${-r * .35}" r="${r * .25}" fill="#BFE7FF" ${N}/></g></g>`).join('')}
    <g transform="translate(196 118)"><g class="bob"><rect x="-30" y="-18" width="60" height="34" rx="14" fill="#FF9EC7"/>${face(0, -2, .9)}</g></g>
    ${bacil(266, 58, '#8BD450', 0)}${bacil(296, 104, '#B36BFF', -.5)}${bacil(284, 154, '#FFB020', -1)}`,

  elektrina: () => `${bg('#CDEBFF')}
    <path d="M0 150 Q160 136 320 150 V180 H0Z" fill="#6FD68F"/>
    <g transform="translate(36 36)"><g class="steam">${cloud(0, 0, .8)}</g></g><g transform="translate(58 22)"><g class="steam" style="animation-delay:-1.1s">${cloud(0, 0, .6)}</g></g>
    <path d="M22 150 Q34 112 30 72 H86 Q82 112 94 150Z" fill="#E0E4EE"/><path d="M30 84 H86" stroke="#FF8A3D" stroke-width="5"/>
    <path d="M90 78 Q118 96 138 82 M182 82 Q214 100 238 96" fill="none" stroke-width="2.5"/>
    <g transform="translate(160 150)"><path d="M-16 0 L-4 -86 H4 L16 0 M-12 -30 H12 M-9 -54 H9 M-14 -12 L10 -40 M14 -12 L-10 -40" fill="none" stroke-width="3"/><path d="M-26 -68 H26 M-20 -80 H20" stroke-width="3.5"/></g>
    <g transform="translate(206 70)"><g class="twinkle"><path d="M0 -10 L-5 0 H2 L-3 10" fill="none" stroke="#FFB300" stroke-width="3"/></g></g>
    <g transform="translate(264 150)"><rect x="-30" y="-46" width="60" height="46" fill="#FFD9A0"/><path d="M-36 -44 L0 -72 L36 -44Z" fill="#4C7DFF"/><g class="pulse"><rect x="-20" y="-34" width="16" height="14" fill="#FFE27A"/></g><rect x="6" y="-28" width="14" height="28" fill="#9A6234"/></g>
    <g transform="translate(264 40)"><g class="spin">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 -24 V-32" stroke="#FFB300" stroke-width="4" transform="rotate(${a})"/>`).join('')}</g><g class="pulse"><rect x="-7" y="14" width="14" height="10" rx="2" fill="#B8C2D6"/><circle r="18" fill="#FFE27A"/>${face(0, -2, .8)}</g></g>`,

  mesiac: () => `${bg('#22285E')}
    ${[[110, 22], [150, 52], [290, 120], [24, 96], [250, 18], [130, 96]].map(([x, y], i) => hviezdicka(x, y, .7, '#FFE27A', i * .3)).join('')}
    ${sun(34, 38, 15)}<path d="M54 44 L156 64" stroke="#FFE27A" stroke-width="3" stroke-dasharray="6 6" class="dash"/>
    <g transform="translate(206 70)"><g class="bob"><circle r="44" fill="#FFF3B0"/><circle cx="-18" cy="-18" r="8" fill="#F4DC7A" stroke-width="2"/><circle cx="22" cy="18" r="6" fill="#F4DC7A" stroke-width="2"/><circle cx="24" cy="-20" r="4" fill="#F4DC7A" stroke-width="2"/>${face(0, 4, 1.3)}</g></g>
    <g transform="translate(52 146)"><circle r="20" fill="#4FC3F7"/><path d="M-12 -8 q8 -6 14 2 q-6 6 -14 -2z M2 6 q10 -2 10 8 q-8 4 -10 -8z" fill="#4CD07D" stroke-width="2"/></g>
    <g transform="translate(112 118) rotate(40)"><g class="fly"><path d="M0 -24 C10 -14 10 6 8 14 H-8 C-10 6 -10 -14 0 -24Z" fill="#fff"/><circle cy="-6" r="4" fill="#4FC3F7" stroke-width="2"/><path d="M-8 6 L-16 18 H-8Z M8 6 L16 18 H8Z" fill="#FF5A5F"/><g transform="translate(0 15)"><g class="flame"><path d="M-5 0 Q0 16 5 0Z" fill="#FF9F1C"/></g></g></g></g>
    ${faza(160, 162, 9, 5, 1)}${faza(192, 162, 9, 0, 1)}${faza(224, 162, 9, -5, 1)}<g transform="translate(256 162)"><circle r="9" fill="#FFF3B0" stroke-width="2"/></g>${faza(288, 162, 9, 0, 0)}`,

  vcely: () => `${bg('#DDF5D0')}${sun(284, 32, 15)}${cloud(150, 14, .6)}
    <path d="M0 150 Q160 138 320 150 V180 H0Z" fill="#6FD68F"/>
    <g transform="translate(66 150)"><path d="M-44 0 Q-46 -70 0 -76 Q46 -70 44 0Z" fill="#F4B860"/><path d="M-43 -18 H43 M-39 -36 H39 M-31 -54 H31" fill="none" stroke-width="2.5"/><path d="M-12 0 V-12 Q0 -22 12 -12 V0Z" fill="#6B4226"/></g>
    <g transform="translate(132 158)"><path d="M-16 0 Q-22 -20 -12 -28 H12 Q22 -20 16 0Z" fill="#FFB020"/><rect x="-14" y="-34" width="28" height="8" rx="3" fill="#C98A4B"/><text y="-9" ${TXT} fill="${INK}" font-size="9">MED</text></g>
    ${kvet(194, 46, '#FF6FA8')}${kvet(238, 62, '#B36BFF')}${kvet(282, 40, '#FF5A5F')}
    <path d="M100 112 Q150 50 200 62 T276 86" fill="none" stroke-dasharray="4 6" opacity=".45" stroke-width="2"/>
    ${vcela(112, 104, 0)}${vcela(158, 58, -1)}${vcela(214, 74, -2)}${vcela(262, 96, -.5)}`,

  zuby: () => `${bg('#D6F3FF')}${plus(30, 30, '#4FC3F7')}${plus(290, 40, '#FF9EC7', .5)}${hviezdicka(98, 40, .9, '#FFE27A', 0)}${hviezdicka(214, 26, .7, '#FFE27A', .6)}
    <rect y="160" width="320" height="20" fill="#BFE7FF" ${N}/><path d="M0 160 H320"/>
    <g transform="translate(150 96)"><g class="bob"><path d="M-40 -40 Q-40 -60 -18 -58 Q0 -54 0 -50 Q0 -54 18 -58 Q40 -60 40 -40 Q42 -10 30 20 Q26 46 16 48 Q8 48 6 30 Q4 18 0 18 Q-4 18 -6 30 Q-8 48 -16 48 Q-26 46 -30 20 Q-42 -10 -40 -40Z" fill="#fff"/>
      <path d="M-28 -40 q4 -10 14 -10" fill="none" stroke="#BFE7FF" stroke-width="4"/>${face(0, -14, 1.2)}</g></g>
    ${[[214, 70, 6, 0], [230, 54, 8, .7], [206, 46, 5, 1.3]].map(([x, y, r, d]) => `<g transform="translate(${x} ${y})"><g class="rise" style="animation-delay:${d}s"><circle r="${r}" fill="#fff" stroke-width="2"/></g></g>`).join('')}
    <g transform="translate(244 112) rotate(-30)"><g class="brush"><rect x="-10" y="-6" width="80" height="12" rx="6" fill="#4C7DFF"/><rect x="-34" y="-8" width="26" height="14" rx="4" fill="#fff"/>
      <path d="M-31 -8 V-18 M-25 -8 V-18 M-19 -8 V-18 M-13 -8 V-18" stroke="#4FC3F7" stroke-width="3"/><circle cx="-22" cy="-24" r="7" fill="#fff" stroke-width="2"/></g></g>
    <g transform="translate(56 150) rotate(-10)"><path d="M-30 -10 H22 L30 -4 V4 L22 10 H-30Z" fill="#fff"/><rect x="30" y="-6" width="10" height="12" fill="#FF5A5F"/><path d="M-26 -1 H14" stroke="#2FBF71" stroke-width="4"/></g>`,

  strach: () => `${bg('#3B2F6E')}
    <rect y="150" width="320" height="30" fill="#5B4FA8" ${N}/><path d="M0 150 H320"/>
    <rect x="20" y="20" width="56" height="50" rx="6" fill="#22285E"/><circle cx="48" cy="44" r="10" fill="#FFF3B0"/><path d="M48 20 V70 M20 45 H76"/>
    <g transform="translate(252 84)"><path d="M-48 66 Q-52 -8 -22 -38 Q-16 -58 -6 -42 Q0 -62 10 -42 Q22 -58 28 -38 Q56 -8 48 66Z" fill="#251C4A" ${N}/>
      <g class="blink"><circle cx="-34" cy="-18" r="5" fill="#FFE27A" ${N}/><circle cx="34" cy="-18" r="5" fill="#FFE27A" ${N}/></g></g>
    <polygon points="122,118 228,40 248,134" fill="#FFF3B0" opacity=".5" class="beam" ${N}/>
    <g transform="translate(252 48)"><path d="M0 0 q0 -8 6 -8 q6 0 6 6" fill="none" stroke-width="2.5"/><path d="M-26 16 L0 2 L26 16" fill="none"/><path d="M-22 16 H22 L28 92 H-28Z" fill="#FF8A3D"/><path d="M0 16 V92" stroke-width="2.5"/>${dot(-6, 40, 2.5)}${dot(-6, 58, 2.5)}${dot(-6, 76, 2.5)}</g>
    ${kid(80, 170, '#4C7DFF', { arm: 62, extra: '<rect x="30" y="-52" width="18" height="11" rx="3" fill="#FFD23F" transform="rotate(-28 37 -46)"/>' })}`,

  rozpravky: () => `${bg('#FFE6F2')}
    ${[[30, 30, '#FFD23F'], [292, 26, '#B36BFF'], [176, 20, '#FF6FA8'], [20, 110, '#4FC3F7'], [300, 112, '#2FBF71']].map(([x, y, c], i) => hviezdicka(x, y, .9, c, i * .35)).join('')}
    <g transform="translate(110 96)"><g class="bob"><rect x="-26" y="-20" width="52" height="40" fill="#FFB3D1"/><rect x="-38" y="-36" width="16" height="56" fill="#FF9EC7"/><rect x="22" y="-36" width="16" height="56" fill="#FF9EC7"/>
      <path d="M-41 -34 L-30 -56 L-19 -34Z M19 -34 L30 -56 L41 -34Z" fill="#B36BFF"/><path d="M-8 20 V6 q8 -10 16 0 V20Z" fill="#B36BFF"/><path d="M-30 -56 V-66"/><g transform="translate(-30 -66)"><g class="flag"><path d="M0 0 L14 3 L0 7Z" fill="#FFD23F"/></g></g></g></g>
    <g transform="translate(232 86)"><g class="fly">
      <path d="M24 4 Q48 8 54 -12" fill="none" stroke="${INK}" stroke-width="11"/><path d="M24 4 Q48 8 54 -12" fill="none" stroke="#4CD07D" stroke-width="6"/>
      <g class="krid2"><path d="M-4 -14 L12 -46 L26 -18Z" fill="#9BE3B4"/></g>
      <ellipse rx="30" ry="20" fill="#4CD07D"/><path d="M-10 -18 l5 -8 l5 8 M4 -19 l5 -8 l5 8" fill="#2FB36A"/>
      <rect x="-20" y="14" width="9" height="12" rx="4" fill="#4CD07D"/><rect x="8" y="14" width="9" height="12" rx="4" fill="#4CD07D"/>
      <circle cx="-30" cy="-14" r="16" fill="#4CD07D"/><path d="M-38 -28 l-2 -9 l7 5 M-26 -29 l2 -9 l4 8" fill="#FFD23F"/>
      <g class="blink">${dot(-34, -16, 2.6)}</g><path d="M-44 -6 q6 5 12 0" fill="none" stroke-width="2.5"/><circle cx="-24" cy="-8" r="3.5" fill="#FF8FB1" opacity=".8" ${N}/></g></g>
    <g transform="translate(160 162)"><path d="M-124 -30 Q-62 -44 0 -30 V14 Q-62 0 -124 14Z" fill="#fff"/><path d="M124 -30 Q62 -44 0 -30 V14 Q62 0 124 14Z" fill="#fff"/>
      <text x="-62" y="-6" ${TXT} fill="${INK}" font-size="14">Kde bolo,</text><text x="62" y="-6" ${TXT} fill="${INK}" font-size="14">tam bolo…</text></g>`,

  pyramidy: () => `${bg('#CDEBFF')}${sun(46, 36, 15)}${cloud(222, 18, .6, -1)}
    <rect y="128" width="320" height="52" fill="#F5CF7A" ${N}/><path d="M0 128 H320"/>
    <path d="M118 128 L188 38 L258 128Z" fill="#EDB54F"/><path d="M188 38 L220 128 H258Z" fill="#C98F2E"/>
    <path d="M139 101 H236 M156 79 H219 M172 59 H203" fill="none" stroke-width="2"/>
    <path d="M236 128 L270 88 L304 128Z" fill="#EDB54F"/><path d="M270 88 L285 128 H304Z" fill="#C98F2E"/>
    <g transform="translate(96 158)"><g class="utek"><rect x="-22" y="-24" width="42" height="24" rx="3" fill="#E2B86A"/><path d="M-22 -12 H20 M-1 -24 V-12" fill="none" stroke-width="2"/><path d="M-28 3 H24" stroke-width="5"/></g></g>
    ${kid(46, 166, '#FF6FA8', { arm: 70, hair: '#2B2240' })}`,

  eu: () => `${bg('#D8E8FF')}${cloud(24, 20, .7)}${cloud(262, 14, .55, -2)}
    <rect y="142" width="320" height="38" fill="#8EE08E" ${N}/><path d="M0 142 H320"/>
    <path d="M96 142 V22" stroke-width="5"/><circle cx="96" cy="20" r="5" fill="#FFD23F"/>
    <g transform="translate(98 26)"><g class="flag"><rect width="112" height="74" rx="4" fill="#2E5BD8"/>
    ${[...Array(12).keys()].map(i => `<path d="${HV5}" transform="translate(${(56 + Math.cos(i * Math.PI / 6) * 25).toFixed(1)} ${(37 + Math.sin(i * Math.PI / 6) * 25).toFixed(1)}) scale(.42)" fill="#FFD23F" ${N}/>`).join('')}</g></g>
    ${kid(236, 166, '#FF9F1C', { arm: -20 })}${kid(276, 166, '#B36BFF', { flip: true, hair: '#2B2240', d: .4, arm: -20 })}`,

  banka: () => `${bg('#E6F7EC')}${cloud(120, 12, .5, -1)}
    <rect y="148" width="320" height="32" fill="#BFE5CB" ${N}/><path d="M0 148 H320"/>
    <path d="M76 64 L170 24 L264 64Z" fill="#F3EFFF"/><text x="170" y="58" font-size="15" ${TXT} fill="${INK}">BANKA</text>
    <rect x="80" y="64" width="180" height="10" fill="#DCD3F5"/>
    ${[100, 140, 200, 240].map(x => `<rect x="${x - 8}" y="74" width="16" height="62" fill="#fff"/>`).join('')}
    <rect x="156" y="96" width="28" height="40" rx="4" fill="#9A6234"/><rect x="72" y="136" width="196" height="12" fill="#DCD3F5"/>
    ${[[284, 0], [302, .7], [290, 1.4]].map(([x, d]) => `<g transform="translate(${x} 56)"><g class="coin" style="animation-delay:${d}s"><circle r="10" fill="#FFD23F"/><text y="5" font-size="12" ${TXT} fill="${INK}">€</text></g></g>`).join('')}
    ${kid(36, 170, '#4C7DFF', { arm: -30 })}`,

  semafor: () => `${bg('#D9F4FF')}${cloud(110, 16, .6)}${cloud(230, 10, .5, -2)}
    <rect y="118" width="320" height="62" fill="#8A8FA8" ${N}/><path d="M0 118 H320"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${118 + i * 22}" y="126" width="13" height="48" fill="#fff" ${N}/>`).join('')}
    <path d="M60 118 V30" stroke-width="6"/><rect x="42" y="16" width="36" height="90" rx="10" fill="#3A3F5C"/>
    <circle cx="60" cy="34" r="10" fill="#FF5A5F" class="svetlo"/><circle cx="60" cy="61" r="10" fill="#FFB020" class="svetlo" style="animation-delay:-2s"/><circle cx="60" cy="88" r="10" fill="#2FBF71" class="svetlo" style="animation-delay:-4s"/>
    ${kid(262, 152, '#FF6FA8', { arm: 30 })}${kid(292, 152, '#FFD23F', { flip: true, s: .8, d: .3 })}`,

  mobil: () => `${bg('#E9E3FF')}${cloud(150, 14, .55)}
    <rect y="150" width="320" height="30" fill="#9BE3A8" ${N}/><path d="M0 150 H320"/>
    <path d="M250 150 L266 52 L282 150 M256 112 H276 M260 84 H272 M252 138 L278 98 M280 138 L254 98" fill="none" stroke-width="4"/>
    <rect x="258" y="38" width="16" height="14" rx="3" fill="#C9D1E3"/>
    ${[0, .5, 1].map((d, i) => `<path d="M${238 - i * 12} ${34 - i * 8} q-${8 + i * 5} 15 0 ${30 + i * 16}" fill="none" stroke="#7C6CFF" stroke-width="4" class="beam" style="animation-delay:${d}s"/>`).join('')}
    ${[0, .5, 1].map((d, i) => `<path d="M${148 + i * 12} ${76 - i * 8} q${8 + i * 5} 15 0 ${30 + i * 16}" fill="none" stroke="#7C6CFF" stroke-width="4" class="beam" style="animation-delay:${d}s"/>`).join('')}
    <g transform="translate(104 100)"><g class="bob"><rect x="-30" y="-52" width="60" height="104" rx="12" fill="${INK}"/><rect x="-24" y="-42" width="48" height="80" rx="6" fill="#8FD3FF" ${N}/>${face(0, -6, 1)}<circle cx="0" cy="45" r="4" fill="#fff" ${N}/></g></g>`,

  duha: () => `${bg('#D9F1FF')}${sun(272, 38, 15)}
    <rect y="146" width="320" height="34" fill="#8EE08E" ${N}/>
    ${['#FF5A5F', '#FF9F1C', '#FFD23F', '#4CD07D', '#3D8BFF', '#5B4BC4', '#B36BFF'].map((c, i) => `<path d="M${30 + i * 7} 146 A${130 - i * 7} ${116 - i * 7} 0 0 1 ${290 - i * 7} 146" fill="none" stroke="${c}" stroke-width="7.6"/>`).join('')}
    <path d="M26.2 146 A133.8 119.8 0 0 1 293.8 146 M75.8 146 A84.2 70.2 0 0 1 244.2 146" fill="none"/>
    <path d="M0 146 H320"/>${cloud(6, 30, .8)}${[14, 26, 38].map((x, i) => drop(x, 76, i * .45)).join('')}
    ${kid(160, 172, '#FF9F1C', { arm: -20 })}`,

  vtaky: () => `${bg('#FFE9C7')}${sun(262, 122, 22)}
    <rect y="142" width="320" height="38" fill="#E8C27A" ${N}/><path d="M0 142 H320"/>
    ${tree(40, 142, 1)}
    <path d="M122 142 V100" stroke-width="5"/><path d="M98 84 H176 L190 96 L176 108 H98Z" fill="#fff"/><text x="140" y="101" font-size="13" ${TXT} fill="${INK}">AFRIKA</text>
    ${[[160, 34, 0], [184, 48, .3], [136, 48, .5], [208, 62, .8], [112, 62, 1]].map(([x, y, d]) => `<g transform="translate(${x} ${y})"><g class="fly" style="animation-delay:${d}s"><path d="M-12 0 Q-6 -8 0 0 Q6 -8 12 0" fill="none" stroke-width="3.5"/></g></g>`).join('')}`,

  kosti: () => `${bg('#E3F4FF')}
    <rect x="20" y="20" width="124" height="140" rx="10" fill="#26305E"/>
    <g fill="#fff" stroke="none">
      <rect x="54" y="100" width="52" height="48" rx="12"/>
      ${[[56, 72, -14, 38], [69, 62, -4, 48], [83, 62, 4, 48], [96, 70, 14, 40]].map(([x, y, r, h]) => `<rect x="${x}" y="${y}" width="10" height="${h}" rx="5" transform="rotate(${r} ${x + 5} ${y + h})"/>`).join('')}
      <rect x="40" y="98" width="10" height="34" rx="5" transform="rotate(-40 45 132)"/>
      <rect x="64" y="144" width="10" height="16"/><rect x="86" y="144" width="10" height="16"/>
    </g>
    <g transform="translate(224 88)"><g class="bob"><rect x="-46" y="-12" width="92" height="24" rx="10" fill="#fff"/>${[[-46, -12], [-46, 12], [46, -12], [46, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#fff"/>`).join('')}<rect x="-46" y="-11" width="92" height="22" fill="#fff" ${N}/>${face(0, -2, .8)}</g></g>
    <g transform="translate(276 154)"><rect x="-18" y="-40" width="36" height="40" rx="4" fill="#fff"/><path d="M-18 -40 L-10 -54 H10 L18 -40Z" fill="#8FD3FF"/><text y="-15" font-size="9" ${TXT} fill="${INK}">MLIEKO</text></g>`,

  more: () => `${bg('#CDEBFF')}${sun(52, 40, 16)}${cloud(206, 16, .6, -1)}
    <rect y="98" width="320" height="82" fill="#3DA5FF" ${N}/><path d="M0 100 Q20 92 40 100 T80 100 T120 100 T160 100 T200 100 T240 100 T280 100 T320 100" fill="none"/>
    <path d="M0 148 Q44 138 88 150 L88 180 H0Z" fill="#F5CF7A"/>
    <g transform="translate(206 98)"><g class="bob"><path d="M-34 0 H34 L24 18 H-24Z" fill="#FF5A5F"/><path d="M0 0 V-52" stroke-width="3"/><path d="M3 -50 L30 -8 H3Z" fill="#fff"/></g></g>
    ${[[136, 142, 0, '#FFD23F'], [266, 152, .7, '#FF9F1C']].map(([x, y, d, c]) => `<g transform="translate(${x} ${y})"><g class="swap" style="animation-delay:${d}s"><path d="M-14 0 Q0 -12 14 0 Q0 12 -14 0Z M14 0 L24 -8 V8Z" fill="${c}"/>${dot(-7, -1, 1.8)}</g></g>`).join('')}
    <g transform="translate(40 148)"><rect x="-11" y="-28" width="22" height="28" rx="6" fill="#fff"/><path d="M-11 -25 Q0 -38 11 -25Z" fill="#C9D1E3"/><text y="-9" font-size="8" ${TXT} fill="${INK}">SOĽ</text></g>`,

  smutok: () => `${bg('#E6E9F5')}
    <rect y="146" width="320" height="34" fill="#A8D8B0" ${N}/><path d="M0 146 H320"/>
    ${cloud(72, 20, .9)}${[80, 96, 112].map((x, i) => drop(x, 62, i * .5)).join('')}
    <g transform="translate(96 116)"><circle r="28" fill="#8FD3FF"/>${dot(-9, -4, 2.6)}${dot(9, -4, 2.6)}<path d="M-8 13 q8 -7 16 0" fill="none" stroke-width="2.5"/><g class="rain" style="animation-delay:.3s"><path d="M-13 2 c3 4 3 6 0 8 c-3 -2 -3 -4 0 -8Z" fill="#3D8BFF" stroke-width="1.5"/></g></g>
    <g transform="translate(196 116)"><g class="bob"><path d="M-26 8 Q-50 10 -70 2" fill="none" stroke-width="5"/><circle r="28" fill="#FFD23F"/>${face(0, -2, .9)}</g></g>
    ${srdiecko(150, 64, 1.4, '#FF5A5F', 0)}${sun(284, 34, 14)}`,

  hudba: () => `${bg('#FFF0D9')}
    <rect y="150" width="320" height="30" fill="#F2C48D" ${N}/><path d="M0 150 H320"/>
    <g transform="translate(234 150)"><path d="M-40 -48 V-6 Q0 8 40 -6 V-48" fill="#FF5A5F"/><ellipse cx="0" cy="-48" rx="40" ry="11" fill="#FFF6E6"/><path d="M-40 -34 L-20 -10 L0 -34 L20 -10 L40 -34" fill="none" stroke="#FFD23F" stroke-width="3"/>
      <g class="lift"><path d="M-32 -86 L-8 -54" stroke-width="5"/><circle cx="-34" cy="-89" r="5" fill="#fff"/></g><g class="lift" style="animation-delay:.6s"><path d="M32 -86 L8 -54" stroke-width="5"/><circle cx="34" cy="-89" r="5" fill="#fff"/></g></g>
    ${kid(84, 170, '#7C6CFF', { arm: -10 })}
    ${[[122, 74, 0, '#FF6FA8'], [150, 50, .8, '#3D8BFF'], [176, 80, 1.6, '#2FBF71']].map(([x, y, d, c]) => `<g transform="translate(${x} ${y})"><g class="rise" style="animation-delay:${d}s"><path d="M1.5 -1 V-24 L15.5 -28 V-5" fill="none" stroke-width="3.5"/><ellipse cx="-4" cy="0" rx="6" ry="4.5" fill="${c}"/><ellipse cx="10" cy="-4" rx="6" ry="4.5" fill="${c}"/></g></g>`).join('')}`,
  pozdravy: () => `${bg('#E3F4FF')}${cloud(140, 12, .55)}
    <rect y="150" width="320" height="30" fill="#9BE3A8" ${N}/><path d="M0 150 H320"/>
    ${kid(96, 170, '#4C7DFF', { arm: -30 })}${kid(224, 170, '#FF6FA8', { flip: true, arm: -30, hair: '#E0623A', d: .4 })}
    <path d="M30 32 H122 Q130 32 130 40 V64 Q130 72 122 72 H94 L86 84 L82 72 H30 Q22 72 22 64 V40 Q22 32 30 32Z" fill="#fff"/><text x="76" y="60" font-size="20" ${TXT} fill="${INK}">Hello!</text>
    <path d="M198 32 H290 Q298 32 298 40 V64 Q298 72 290 72 H242 L238 84 L230 72 H198 Q190 72 190 64 V40 Q190 32 198 32Z" fill="#fff"/><text x="244" y="60" font-size="20" ${TXT} fill="${INK}">Ahoj!</text>`,

  farby: () => `${bg('#FFF6E6')}
    ${[['#FF5A5F', 'red'], ['#3D8BFF', 'blue'], ['#FFD23F', 'yellow'], ['#2FBF71', 'green'], ['#B36BFF', 'purple'], ['#FF9F1C', 'orange']].map(([c, w], i) => `<g transform="translate(${30 + i * 52} 84)"><g class="bob" style="animation-delay:${i * .2}s"><path d="M0 -26 C16 -26 22 -14 20 -2 C18 12 6 18 0 18 C-8 18 -20 12 -20 -2 C-22 -16 -14 -26 0 -26Z" fill="${c}"/><circle cx="-7" cy="-10" r="4" fill="#fff" opacity=".6" ${N}/></g><text y="46" font-size="14" ${TXT} fill="${INK}">${w}</text></g>`).join('')}`,

  zvierata: () => `${bg('#E6F7EC')}${sun(284, 28, 13)}
    <rect y="134" width="320" height="46" fill="#9BE3A8" ${N}/><path d="M0 134 H320"/>
    <g transform="translate(66 92)"><g class="bob"><ellipse cx="-24" cy="-4" rx="10" ry="20" fill="#8B5A3C" transform="rotate(20 -24 -4)"/><ellipse cx="24" cy="-4" rx="10" ry="20" fill="#8B5A3C" transform="rotate(-20 24 -4)"/><circle r="28" fill="#D9A06B"/>${face(0, -2, 1.2)}</g><text y="68" font-size="18" ${TXT} fill="${INK}">dog</text></g>
    <g transform="translate(166 92)"><g class="bob" style="animation-delay:.5s"><path d="M-26 -8 L-24 -40 L-6 -24Z M26 -8 L24 -40 L6 -24Z" fill="#FF9F1C"/><circle r="28" fill="#FF9F1C"/>${face(0, -2, 1.2)}<path d="M-16 8 H-36 M-16 12 L-34 18 M16 8 H36 M16 12 L34 18" fill="none" stroke-width="2"/></g><text y="68" font-size="18" ${TXT} fill="${INK}">cat</text></g>
    <g transform="translate(260 90)"><g class="fly"><path d="M-14 -2 Q-4 -26 8 -6Z" fill="#3D8BFF"/><circle r="16" fill="#8FD3FF"/>${dot(5, -4, 2.4)}<path d="M14 0 L25 3 L14 7Z" fill="#FFB020"/></g><text y="70" font-size="18" ${TXT} fill="${INK}">bird</text></g>`,

  cisla: () => `${bg('#EBDDFF')}
    ${[['1', 'one', '#FF5A5F'], ['2', 'two', '#FFB020'], ['3', 'three', '#2FBF71'], ['4', 'four', '#3D8BFF']].map(([n, w, c], i) => `<g transform="translate(${46 + i * 76} 80)"><g class="bob" style="animation-delay:${i * .3}s"><circle r="30" fill="${c}"/><text y="14" font-size="40" ${TXT} fill="#fff">${n}</text></g><text y="62" font-size="18" ${TXT} fill="${INK}">${w}</text></g>`).join('')}
    ${[60, 140, 220, 290].map((x, i) => hviezdicka(x, 160, .7, '#FFD23F', i * .4)).join('')}`,
};
// päťcípa hviezda pre obrázky (vlajka EÚ)
const HV5 = 'M0 -10 L2.9 -4 9.5 -3.1 4.7 1.5 5.9 8.1 0 5 -5.9 8.1 -4.7 1.5 -9.5 -3.1 -2.9 -4Z';

const svg = t => `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Obrázok: ${t.t}"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${ART[t.id]()}</g></svg>`;
const scene = (t, cls = '') => `<div class="scene ${cls}">${svg(t)}</div>`;

/* Maskot: sovička Múdra (hi = máva, happy = teší sa, cheer = oslavuje, oops = ľutuje) */
function owl(m = 'hi') {
  const W = '#7650E6';
  const L = { dole: `<path d="M16 72 C4 86 8 104 24 110 C26 94 24 80 16 72Z" fill="${W}"/>`, hore: `<path d="M22 76 C4 68 0 44 8 32 C18 46 28 58 26 76Z" fill="${W}"/>` };
  const P = { dole: `<path d="M104 72 C116 86 112 104 96 110 C94 94 96 80 104 72Z" fill="${W}"/>`, hore: `<path d="M98 76 C116 68 120 44 112 32 C102 46 92 58 94 76Z" fill="${W}"/>` };
  const lave = m === 'cheer' ? L.hore : L.dole, prave = m === 'cheer' || m === 'hi' ? P.hore : P.dole;
  const oci = m === 'cheer' || m === 'happy'
    ? '<path d="M36 56 q8 -10 16 0 M68 56 q8 -10 16 0" fill="none" stroke-width="4"/>'
    : m === 'oops'
      ? `${dot(44, 55, 6)}${dot(76, 55, 6)}<circle cx="46" cy="53" r="2" fill="#fff" ${N}/><circle cx="78" cy="53" r="2" fill="#fff" ${N}/><path d="M33 40 l12 -6 M87 40 l-12 -6" stroke-width="4"/>`
      : `<g class="ow-blink">${dot(47, 54, 7.5)}${dot(79, 54, 7.5)}<circle cx="50" cy="51" r="2.6" fill="#fff" ${N}/><circle cx="82" cy="51" r="2.6" fill="#fff" ${N}/></g>`;
  return `<svg class="owl" data-m="${m}" viewBox="0 0 120 132" aria-hidden="true"><g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="46" cy="123" rx="10" ry="5" fill="#FFA62B"/><ellipse cx="74" cy="123" rx="10" ry="5" fill="#FFA62B"/>
    <path d="M30 36 L22 8 L52 26Z" fill="${W}"/><path d="M90 36 L98 8 L68 26Z" fill="${W}"/>
    <path d="M60 18 C94 18 106 46 106 78 C106 106 88 122 60 122 C32 122 14 106 14 78 C14 46 26 18 60 18Z" fill="#9B6BFF"/>
    <path d="M60 66 C80 66 90 84 90 98 C90 112 78 118 60 118 C42 118 30 112 30 98 C30 84 40 66 60 66Z" fill="#EDE5FF"/>
    <path d="M47 92 q4 5 8 0 q4 5 8 0 q4 5 8 0 M51 104 q4 5 8 0 q4 5 8 0" fill="none" stroke-width="3"/>
    <g class="ow-wl">${lave}</g><g class="ow-wr">${prave}</g>
    <circle cx="44" cy="52" r="16" fill="#fff"/><circle cx="76" cy="52" r="16" fill="#fff"/>${oci}
    <path d="M53 66 H67 L60 77Z" fill="#FFA62B"/><circle cx="27" cy="72" r="5" fill="#FF8FB1" ${N}/><circle cx="93" cy="72" r="5" fill="#FF8FB1" ${N}/></g></svg>`;
}
const STAR = (f = '#FFD23F') => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="${f}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></svg>`;

/* Postavička dieťaťa: skladá sa z dielov, ktoré si dieťa vyberie (rám 120 × 130) */
const AV = {
  vlasy: ['kratke', 'jezko', 'kucery', 'mikado', 'dlhe', 'copiky', 'chvost', 'ziadne', 'irokez', 'drdol', 'ofina', 'dvadrdoly', 'vlny', 'afro'],
  farbaVlasov: ['#2B2240', '#6B4226', '#B5713C', '#F2C14E', '#E0623A', '#FF6FA8', '#4C7DFF', '#B36BFF', '#2FBF71', '#C9CCD8', '#16BFAE'],
  koza: ['#FFE0C7', '#F6C9A0', '#E0A87A', '#B97A50', '#8A5634'],
  oci: ['bodky', 'velke', 'vesele', 'mrk'],
  usta: ['usmev', 'smiech', 'jazyk'],
  okuliare: ['ziadne', 'okruhle', 'hranate', 'srdiecka', 'slnecne', 'hviezdy', 'potapac', 'kocicie', 'monokel', 'lyziarske', 'robot'],
  tricko: ['#FF5A5F', '#FF9F1C', '#FFD23F', '#2FBF71', '#16BFAE', '#4C7DFF', '#7C6CFF', '#FF6FA8', '#FFFFFF', '#2B2240', '#8FD3FF', '#C9A0FF'],
  vzor: ['ziadny', 'pruhy', 'hviezda', 'srdce', 'blesk', 'duha', 'motylik', 'jahoda', 'kravata', 'futbal', 'sal', 'nahrdelnik', 'medaila', 'raketa'],
  doplnok: ['ziadny', 'siltovka', 'ciapka', 'masla', 'kvietok', 'sluchadla', 'pirat', 'korunka', 'cylinder', 'carodej', 'zajacie', 'macacie', 'kovboj', 'veniec', 'tiara', 'viking', 'svatozar', 'cisarska'],
  zvieratko: ['ziadne', 'macka', 'psik', 'sovicka', 'dino', 'jednorozec', 'zajko', 'tucniak', 'liska', 'drak', 'fenix'],
  kuzlo: ['ziadne', 'iskry', 'motyl', 'aura', 'anjel', 'drakie', 'duha'],
  pozadie: ['#D6E6FF', '#FFE1E8', '#D9F8E6', '#FFF0B3', '#EBDDFF', '#FFE3C7', '#C8F1F6'],
};
const AV_KAT = [['vlasy', '💇 Účes'], ['farbaVlasov', '🎨 Farba vlasov'], ['koza', '🙂 Pleť'], ['oci', '👀 Oči'], ['usta', '😄 Úsmev'],
  ['okuliare', '👓 Okuliare'], ['tricko', '👕 Tričko'], ['vzor', '⭐ Na tričko'], ['doplnok', '👑 Doplnok'], ['zvieratko', '🐾 Zvieratko'], ['kuzlo', '✨ Kúzlo'], ['pozadie', '🌈 Pozadie']];
const AV_FARBY = ['farbaVlasov', 'koza', 'tricko', 'pozadie'];
const AV_ZAKLAD = { zvieratko: 'ziadne', kuzlo: 'ziadne' }; // diely, ktoré staršie postavičky ešte nemali

// Odmeny: koľko bodov treba, aby sa diel odomkol (ostatné sú zadarmo)
const ODOMKNI = {
  'zvieratko:macka': 60, 'farbaVlasov:#FF6FA8': 90, 'farbaVlasov:#4C7DFF': 90, 'okuliare:srdiecka': 120, 'zvieratko:psik': 150,
  'vzor:blesk': 180, 'doplnok:sluchadla': 230, 'farbaVlasov:#B36BFF': 270, 'farbaVlasov:#2FBF71': 270, 'okuliare:slnecne': 300,
  'zvieratko:sovicka': 360, 'vzor:duha': 420, 'doplnok:pirat': 480, 'okuliare:hviezdy': 540, 'doplnok:korunka': 630,
  'zvieratko:dino': 750, 'okuliare:potapac': 840, 'doplnok:cylinder': 960, 'doplnok:carodej': 1140, 'zvieratko:jednorozec': 1350,
  'farbaVlasov:#C9CCD8': 680, 'farbaVlasov:#16BFAE': 720, 'tricko:#2B2240': 110, 'tricko:#8FD3FF': 140, 'tricko:#C9A0FF': 170,
  'vlasy:irokez': 200, 'vlasy:drdol': 240, 'vlasy:ofina': 320, 'vlasy:dvadrdoly': 380, 'vlasy:vlny': 460, 'vlasy:afro': 580,
  'vzor:motylik': 130, 'vzor:jahoda': 200, 'vzor:kravata': 250, 'vzor:futbal': 290, 'vzor:sal': 340, 'vzor:nahrdelnik': 440, 'vzor:medaila': 520, 'vzor:raketa': 600,
  'okuliare:kocicie': 260, 'okuliare:monokel': 400, 'okuliare:lyziarske': 650, 'okuliare:robot': 900,
  'doplnok:zajacie': 160, 'doplnok:macacie': 210, 'doplnok:kovboj': 350, 'doplnok:veniec': 410, 'doplnok:tiara': 700, 'doplnok:viking': 800,
  'zvieratko:zajko': 310, 'zvieratko:tucniak': 490, 'zvieratko:liska': 870,
  // mýtické veci
  'kuzlo:iskry': 1600, 'kuzlo:motyl': 2000, 'doplnok:svatozar': 2400, 'zvieratko:drak': 2800, 'kuzlo:aura': 3200,
  'kuzlo:anjel': 3600, 'zvieratko:fenix': 4000, 'kuzlo:drakie': 4500, 'doplnok:cisarska': 5000, 'kuzlo:duha': 5000,
};
// názvy odmien vo vete „Odomkneš …“
const NAZVY_ODMIEN = {
  'zvieratko:macka': 'mačičku', 'farbaVlasov:#FF6FA8': 'ružové vlasy', 'farbaVlasov:#4C7DFF': 'modré vlasy', 'okuliare:srdiecka': 'srdiečkové okuliare',
  'zvieratko:psik': 'psíka', 'vzor:blesk': 'blesk na tričko', 'doplnok:sluchadla': 'slúchadlá', 'farbaVlasov:#B36BFF': 'fialové vlasy',
  'farbaVlasov:#2FBF71': 'zelené vlasy', 'okuliare:slnecne': 'slnečné okuliare', 'zvieratko:sovicka': 'sovičku', 'vzor:duha': 'dúhu na tričko',
  'doplnok:pirat': 'pirátsku šatku', 'okuliare:hviezdy': 'hviezdne okuliare', 'doplnok:korunka': 'korunku', 'zvieratko:dino': 'dinosauríka',
  'okuliare:potapac': 'potápačské okuliare', 'doplnok:cylinder': 'cylinder', 'doplnok:carodej': 'čarodejnícky klobúk', 'zvieratko:jednorozec': 'jednorožca',
  'farbaVlasov:#C9CCD8': 'strieborné vlasy', 'farbaVlasov:#16BFAE': 'tyrkysové vlasy', 'tricko:#2B2240': 'čierne tričko', 'tricko:#8FD3FF': 'blankytné tričko',
  'tricko:#C9A0FF': 'levanduľové tričko', 'vlasy:irokez': 'číro', 'vlasy:drdol': 'drdol', 'vlasy:ofina': 'účes s ofinou', 'vlasy:dvadrdoly': 'dva drdoly',
  'vlasy:vlny': 'vlnité vlasy', 'vlasy:afro': 'afro účes', 'vzor:motylik': 'motýlik', 'vzor:jahoda': 'jahodu na tričko', 'vzor:kravata': 'kravatu',
  'vzor:futbal': 'loptu na tričko', 'vzor:sal': 'šál', 'vzor:nahrdelnik': 'náhrdelník', 'vzor:medaila': 'medailu', 'vzor:raketa': 'raketu na tričko',
  'okuliare:kocicie': 'mačacie okuliare', 'okuliare:monokel': 'monokel', 'okuliare:lyziarske': 'lyžiarske okuliare', 'okuliare:robot': 'robotí priezor',
  'doplnok:zajacie': 'zajačie uši', 'doplnok:macacie': 'mačacie uši', 'doplnok:kovboj': 'kovbojský klobúk', 'doplnok:veniec': 'kvetinový veniec',
  'doplnok:tiara': 'tiaru', 'doplnok:viking': 'vikingskú prilbu', 'zvieratko:zajko': 'zajka', 'zvieratko:tucniak': 'tučniaka', 'zvieratko:liska': 'líšku',
  'kuzlo:iskry': 'čarovné iskry', 'kuzlo:motyl': 'motýlie krídla', 'doplnok:svatozar': 'svätožiaru', 'zvieratko:drak': 'dráčika', 'kuzlo:aura': 'zlatú žiaru',
  'kuzlo:anjel': 'anjelské krídla', 'zvieratko:fenix': 'fénixa', 'kuzlo:drakie': 'dračie krídla', 'doplnok:cisarska': 'cisársku korunu', 'kuzlo:duha': 'dúhovú žiaru',
};
const cenaDielu = (k, v) => ODOMKNI[k + ':' + v] || 0;
const odomknute = (k, v, body) => cenaDielu(k, v) <= (body || 0);
const ODMENY = Object.entries(ODOMKNI).sort((a, b) => a[1] - b[1]).map(([kluc, cena]) => { const [k, v] = kluc.split(':'); return { kluc, k, v, cena }; });

// náhodná postavička: len z odomknutých dielov; okuliare, doplnok a zvieratko len niekedy
const nahodnyAvatar = (body = 0) => Object.fromEntries(Object.entries(AV).map(([k, v]) => {
  const moze = v.filter(x => odomknute(k, x, body));
  if (['okuliare', 'doplnok', 'zvieratko', 'kuzlo'].includes(k) && Math.random() < .55) return [k, v[0]];
  return [k, moze[Math.floor(Math.random() * moze.length)]];
}));

function postavicka(a, kruh = false) {
  const fv = a.farbaVlasov, k = a.koza, tr = a.tricko;
  const kucery = (() => { const c = [0, 1, 2, 3, 4, 5, 6].map(i => { const u = Math.PI * (1.08 + i * .14); return `<circle cx="${(60 + Math.cos(u) * 30).toFixed(1)}" cy="${(58 + Math.sin(u) * 30).toFixed(1)}" r="12"/>`; }).join(''); return `<g fill="${fv}">${c}</g><g fill="${fv}" stroke="none">${c}</g>`; })();
  const vzadu = {
    dlhe: `<path d="M27 66 Q22 26 60 25 Q98 26 93 66 L96 110 Q85 106 84 94 L83 70 L37 70 L36 94 Q35 106 24 110Z" fill="${fv}"/>`,
    mikado: `<path d="M27 70 Q22 26 60 25 Q98 26 93 70 Q94 86 85 88 L35 88 Q26 86 27 70Z" fill="${fv}"/>`,
    copiky: `<ellipse cx="23" cy="72" rx="11" ry="15" fill="${fv}"/><ellipse cx="97" cy="72" rx="11" ry="15" fill="${fv}"/><rect x="27" y="62" width="7" height="9" rx="3" fill="#FF6FA8"/><rect x="86" y="62" width="7" height="9" rx="3" fill="#FF6FA8"/>`,
    chvost: `<path d="M84 40 Q114 40 108 90 Q103 72 88 62Z" fill="${fv}"/><circle cx="88" cy="42" r="5" fill="#FF6FA8"/>`,
    kucery: `<g>${kucery}</g>`,
    drdol: `<circle cx="60" cy="24" r="13" fill="${fv}"/>`,
    dvadrdoly: `<circle cx="33" cy="34" r="12" fill="${fv}"/><circle cx="87" cy="34" r="12" fill="${fv}"/>`,
    vlny: `<path d="M27 66 Q22 26 60 25 Q98 26 93 66 Q100 76 94 86 Q100 96 92 108 Q84 100 84 90 L83 70 L37 70 L36 90 Q36 100 28 108 Q20 96 26 86 Q20 76 27 66Z" fill="${fv}"/>`,
    afro: `<circle cx="60" cy="54" r="42" fill="${fv}"/>`,
    ofina: `<path d="M27 70 Q22 26 60 25 Q98 26 93 70 L94 90 Q86 92 84 86 L36 86 Q34 92 26 90Z" fill="${fv}"/>`,
  }[a.vlasy] || '';
  const vpredu = {
    kratke: `<path d="M30 62 Q26 29 60 29 Q94 29 90 62 Q86 46 72 44 Q60 50 48 44 Q34 46 30 62Z" fill="${fv}"/>`,
    jezko: `<path d="M30 60 L29 41 L40 46 L41 29 L52 39 L60 24 L68 39 L79 29 L80 46 L91 41 L90 60 Q84 46 60 46 Q36 46 30 60Z" fill="${fv}"/>`,
    kucery: `<path d="M31 58 Q34 40 60 38 Q86 40 89 58 Q78 48 60 50 Q42 48 31 58Z" fill="${fv}"/>`,
    mikado: `<path d="M29 60 Q28 28 60 28 Q92 28 91 60 Q76 50 60 52 Q44 50 29 60Z" fill="${fv}"/>`,
    dlhe: `<path d="M30 62 Q29 29 60 29 Q91 29 90 62 Q82 42 64 41 Q56 54 30 62Z" fill="${fv}"/>`,
    copiky: `<path d="M30 60 Q27 29 60 29 Q93 29 90 60 Q76 48 60 50 Q44 48 30 60Z" fill="${fv}"/><path d="M60 30 V44" stroke-width="2.5"/>`,
    chvost: `<path d="M30 62 Q27 29 60 29 Q93 29 90 58 Q72 50 56 42 Q48 54 30 62Z" fill="${fv}"/>`,
    ziadne: `<path d="M57 34 q3 -9 10 -4" fill="none" stroke-width="3"/>`,
    irokez: `<path d="M50 41 L51 20 L57 30 L60 11 L63 30 L69 20 L70 41 Q60 36 50 41Z" fill="${fv}"/>`,
    drdol: `<path d="M30 60 Q27 29 60 29 Q93 29 90 60 Q78 44 60 44 Q42 44 30 60Z" fill="${fv}"/><rect x="52" y="32" width="16" height="6" rx="3" fill="#FF6FA8"/>`,
    dvadrdoly: `<path d="M30 60 Q27 29 60 29 Q93 29 90 60 Q78 44 60 44 Q42 44 30 60Z" fill="${fv}"/><path d="M60 30 V44" stroke-width="2.5"/>`,
    vlny: `<path d="M30 62 Q29 29 60 29 Q91 29 90 62 Q82 42 64 41 Q56 54 30 62Z" fill="${fv}"/>`,
    afro: `<path d="M31 56 Q34 38 60 36 Q86 38 89 56 Q76 46 60 48 Q44 46 31 56Z" fill="${fv}"/>`,
    ofina: `<path d="M29 62 Q27 28 60 28 Q93 28 91 62 L89 50 Q60 55 31 50Z" fill="${fv}"/>`,
  }[a.vlasy] || '';
  const oci = {
    bodky: `<g class="blink"><circle cx="49" cy="64" r="3.4" fill="${INK}" stroke="none"/><circle cx="71" cy="64" r="3.4" fill="${INK}" stroke="none"/></g>`,
    velke: `<circle cx="49" cy="63" r="7" fill="#fff" stroke-width="2.5"/><circle cx="71" cy="63" r="7" fill="#fff" stroke-width="2.5"/><g class="blink"><circle cx="50" cy="64" r="4" fill="${INK}" stroke="none"/><circle cx="72" cy="64" r="4" fill="${INK}" stroke="none"/></g><circle cx="51.5" cy="62" r="1.5" fill="#fff" stroke="none"/><circle cx="73.5" cy="62" r="1.5" fill="#fff" stroke="none"/>`,
    vesele: `<path d="M44 66 q5 -7 10 0 M66 66 q5 -7 10 0" fill="none" stroke-width="3"/>`,
    mrk: `<g class="blink"><circle cx="49" cy="64" r="3.4" fill="${INK}" stroke="none"/></g><path d="M66 65 q5 -5 10 0" fill="none" stroke-width="3"/>`,
  }[a.oci] || '';
  const usta = {
    usmev: `<path d="M52 77 q8 8 16 0" fill="none" stroke-width="3"/>`,
    smiech: `<path d="M50 75 H70 Q69 88 60 88 Q51 88 50 75Z" fill="#C2453A" stroke-width="2.5"/><path d="M54 84 q6 -5 12 0 q-6 4 -12 0Z" fill="#FF8FB1" stroke="none"/>`,
    jazyk: `<path d="M52 76 q8 8 16 0" fill="none" stroke-width="3"/><path d="M60 80 q1 7 6 6 q3 -2 1 -8" fill="#FF8FB1" stroke-width="2"/>`,
  }[a.usta] || '';
  const sklo = 'rgb(255 255 255 / .35)';
  const okuliare = {
    okruhle: `<circle cx="49" cy="64" r="9" fill="${sklo}"/><circle cx="71" cy="64" r="9" fill="${sklo}"/><path d="M58 64 H62 M40 62 L32 60 M80 62 L88 60" fill="none"/>`,
    hranate: `<rect x="39" y="56" width="19" height="15" rx="4" fill="${sklo}"/><rect x="62" y="56" width="19" height="15" rx="4" fill="${sklo}"/><path d="M58 63 H62 M39 61 L32 59 M81 61 L88 59" fill="none"/>`,
    slnecne: `<path d="M38 57 H58 Q58 72 48 72 Q38 72 38 57Z M62 57 H82 Q82 72 72 72 Q62 72 62 57Z" fill="${INK}"/><path d="M42 61 l5 -2 M66 61 l5 -2" stroke="#fff" stroke-width="2"/><path d="M58 59 H62 M38 58 L32 57 M82 58 L88 57" fill="none"/>`,
    srdiecka: `<path d="M49 73 C38 66 38 56 44 56 C47 56 49 58 49 60 C49 58 51 56 54 56 C60 56 60 66 49 73Z M71 73 C60 66 60 56 66 56 C69 56 71 58 71 60 C71 58 73 56 76 56 C82 56 82 66 71 73Z" fill="#FF6FA8"/><path d="M57 62 H63 M40 60 L32 59 M80 60 L88 59" fill="none"/>`,
    hviezdy: `<path d="M49 54 L52 61 L59 62 L54 67 L55 74 L49 70 L43 74 L44 67 L39 62 L46 61Z M71 54 L74 61 L81 62 L76 67 L77 74 L71 70 L65 74 L66 67 L61 62 L68 61Z" fill="#FFD23F"/><path d="M59 63 H61 M39 62 L32 60 M81 62 L88 60" fill="none"/>`,
    potapac: `<path d="M88 54 V30 q0 -7 7 -7" fill="none" stroke-width="8"/><path d="M88 54 V30 q0 -7 7 -7" fill="none" stroke="#FF9F1C" stroke-width="4"/><path d="M30 63 H90" stroke-width="5"/><rect x="36" y="53" width="48" height="21" rx="10" fill="rgb(143 211 255 / .6)"/><path d="M60 53 V74" stroke-width="2.5"/><path d="M41 58 l6 -2" stroke="#fff" stroke-width="2"/>`,
    kocicie: `<path d="M38 58 Q48 54 58 58 Q57 71 48 71 Q39 71 38 58Z M62 58 Q72 54 82 58 Q81 71 72 71 Q63 71 62 58Z" fill="${sklo}"/><path d="M38 58 L33 52 M82 58 L87 52" stroke="#FF6FA8" stroke-width="4"/><path d="M58 61 H62 M38 60 L32 59 M82 60 L88 59" fill="none"/>`,
    monokel: `<circle cx="71" cy="64" r="9" fill="${sklo}" stroke="#FFC233" stroke-width="3"/><path d="M79 70 Q88 84 82 100" fill="none" stroke="#FFC233" stroke-width="2"/>`,
    lyziarske: `<path d="M28 63 H92" stroke-width="7"/><path d="M28 63 H92" stroke="#FF5A5F" stroke-width="3"/><rect x="36" y="54" width="48" height="20" rx="10" fill="#FFB020"/><path d="M42 60 l9 -2.5" stroke="#fff" stroke-width="2.5"/>`,
    robot: `<rect x="31" y="55" width="58" height="17" rx="8" fill="${INK}"/><rect x="37" y="60" width="46" height="6" rx="3" fill="#FF5A5F" stroke="none" class="beam"/>`,
  }[a.okuliare] || '';
  const vzor = {
    pruhy: `<path d="M20 112 H100 M17 122 H103" stroke="rgb(255 255 255 / .75)" stroke-width="5"/>`,
    hviezda: `<path d="M60 104 L63.5 111 L71 112 L65.5 117 L67 125 L60 121 L53 125 L54.5 117 L49 112 L56.5 111Z" fill="#FFD23F" stroke-width="2.5"/>`,
    srdce: `<path d="M60 126 C47 118 48 106 55 106 C58 106 60 109 60 111 C60 109 62 106 65 106 C72 106 73 118 60 126Z" fill="#FF5A5F" stroke-width="2.5"/>`,
    blesk: `<path d="M63 103 L52 117 H60 L56 128 L69 112 H61Z" fill="#FFD23F" stroke-width="2.5"/>`,
    duha: ['#FF5A5F', '#FFD23F', '#2FBF71', '#4C7DFF'].map((c, i) => `<path d="M${42 + i * 4} 128 A${18 - i * 4} ${18 - i * 4} 0 0 1 ${78 - i * 4} 128" fill="none" stroke="${c}" stroke-width="4"/>`).join(''),
    motylik: `<path d="M60 102 L48 95 V109Z M60 102 L72 95 V109Z" fill="#FF5A5F" stroke-width="2.5"/><circle cx="60" cy="102" r="3.5" fill="#FF5A5F" stroke-width="2.5"/>`,
    jahoda: `<path d="M60 127 Q49 119 51 110 Q60 106 69 110 Q71 119 60 127Z" fill="#FF5A5F" stroke-width="2.5"/><path d="M54 109 l6 -5 6 5 -6 2z" fill="#2FBF71" stroke-width="2"/><path d="M56 115 h.1 M64 115 h.1 M60 120 h.1" stroke="#FFF3B0" stroke-width="2.5"/>`,
    kravata: `<path d="M56 99 H64 L62 105 L66 123 L60 130 L54 123 L58 105Z" fill="#4C7DFF" stroke-width="2.5"/>`,
    futbal: `<circle cx="60" cy="116" r="9" fill="#fff" stroke-width="2.5"/><path d="M60 111.5 l4 3 -1.5 4.5 h-5 l-1.5 -4.5Z" fill="${INK}" stroke="none"/>`,
    sal: `<path d="M43 94 Q60 106 77 94 L81 102 Q60 116 39 102Z" fill="#FF9F1C" stroke-width="2.5"/><path d="M68 105 L71 126 L80 124 L77 103Z" fill="#FF9F1C" stroke-width="2.5"/><path d="M46 99 l4 5 M55 102 l2 5 M65 102 l-2 5" stroke="#fff" stroke-width="2"/>`,
    nahrdelnik: [...Array(9).keys()].map(i => { const u = Math.PI * (.12 + i * .095); return `<circle cx="${(60 + Math.cos(u) * 17).toFixed(1)}" cy="${(97 + Math.sin(u) * 11).toFixed(1)}" r="2.8" fill="#fff" stroke-width="1.5"/>`; }).join(''),
    medaila: `<path d="M53 96 L58 110 M67 96 L62 110" stroke="#4C7DFF" stroke-width="4"/><circle cx="60" cy="116" r="7.5" fill="#FFD23F" stroke-width="2.5"/><path d="M60 112 l1.2 2.6 2.8.3 -2.1 1.9.6 2.8 -2.5 -1.4 -2.5 1.4.6 -2.8 -2.1 -1.9 2.8 -.3z" fill="#FF9F1C" stroke="none"/>`,
    raketa: `<path d="M60 104 Q67 110 66 122 H54 Q53 110 60 104Z" fill="#fff" stroke-width="2.5"/><circle cx="60" cy="113" r="2.5" fill="#8FD3FF" stroke-width="1.5"/><path d="M54 117 l-4 6 h5 M66 117 l4 6 h-5" fill="#FF5A5F" stroke-width="2"/><path d="M57 123 L60 129 L63 123" fill="#FFB020" stroke-width="2"/>`,
  }[a.vzor] || '';
  const doplnok = {
    siltovka: `<path d="M29 54 Q29 25 60 25 Q91 25 91 54Z" fill="${tr === '#FFFFFF' ? '#4C7DFF' : tr}"/><path d="M60 52 H101 Q104 58 95 59 H60Z" fill="${tr === '#FFFFFF' ? '#4C7DFF' : tr}"/><circle cx="60" cy="27" r="3" fill="#fff"/>`,
    ciapka: `<path d="M28 56 Q27 21 60 21 Q93 21 92 56Z" fill="#FF6FA8"/><rect x="25" y="49" width="70" height="11" rx="5.5" fill="#fff"/><circle cx="60" cy="18" r="8" fill="#fff"/>`,
    korunka: `<path d="M38 38 L41 15 L51 27 L60 11 L69 27 L79 15 L82 38Z" fill="#FFD23F"/><circle cx="60" cy="29" r="3.5" fill="#FF5A5F" stroke-width="2"/><circle cx="47" cy="32" r="2.5" fill="#4C7DFF" stroke-width="2"/><circle cx="73" cy="32" r="2.5" fill="#2FBF71" stroke-width="2"/>`,
    masla: `<path d="M74 30 L62 20 L62 40Z M74 30 L86 20 L86 40Z" fill="#FF5A5F"/><circle cx="74" cy="30" r="4.5" fill="#FF8FB1"/>`,
    sluchadla: `<path d="M27 64 Q25 22 60 22 Q95 22 93 64" fill="none" stroke-width="6"/><path d="M27 64 Q25 22 60 22 Q95 22 93 64" fill="none" stroke="#4C7DFF" stroke-width="2.5"/><rect x="20" y="56" width="13" height="20" rx="6" fill="#4C7DFF"/><rect x="87" y="56" width="13" height="20" rx="6" fill="#4C7DFF"/>`,
    kvietok: `<g transform="translate(36 38)">${[0, 72, 144, 216, 288].map(u => `<circle cx="0" cy="-7" r="5.5" fill="#FF9EC7" transform="rotate(${u})"/>`).join('')}<circle r="4.5" fill="#FFD23F"/></g>`,
    pirat: `<path d="M89 46 L106 38 L102 52Z M89 50 L104 60 L94 62Z" fill="#FF5A5F"/><path d="M29 56 Q29 26 60 26 Q91 26 91 56 Q60 44 29 56Z" fill="#FF5A5F"/>${[[44, 40], [58, 34], [72, 38], [52, 46], [78, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" stroke="none"/>`).join('')}`,
    cylinder: `<rect x="40" y="6" width="40" height="32" rx="3" fill="${INK}"/><rect x="40" y="26" width="40" height="7" fill="#FF5A5F" stroke="none"/><rect x="28" y="34" width="64" height="9" rx="4.5" fill="${INK}"/>`,
    carodej: `<path d="M33 40 Q50 30 60 1 Q70 30 87 40Z" fill="#7C6CFF"/><ellipse cx="60" cy="40" rx="33" ry="7" fill="#7C6CFF"/><path d="M60 14 l2 4 l4 .5 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -.5z" fill="#FFD23F" stroke-width="1.5"/><circle cx="68" cy="30" r="2.5" fill="#FFD23F" stroke="none"/><circle cx="51" cy="27" r="2" fill="#FFD23F" stroke="none"/>`,
    zajacie: `<path d="M46 36 Q38 4 48 4 Q56 6 53 34Z M74 36 Q82 4 72 4 Q64 6 67 34Z" fill="#fff"/><path d="M47.5 30 Q43 11 48 10 Q51 13 50.5 30Z M72.5 30 Q77 11 72 10 Q69 13 69.5 30Z" fill="#FF9EC7" stroke="none"/>`,
    macacie: `<path d="M35 46 L37 17 L55 34Z M85 46 L83 17 L65 34Z" fill="${fv}"/><path d="M40 38 L41 25 L49 33Z M80 38 L79 25 L71 33Z" fill="#FF9EC7" stroke="none"/>`,
    kovboj: `<path d="M36 48 Q33 21 48 21 Q55 25 60 21 Q65 25 72 21 Q87 21 84 48 Q60 54 36 48Z" fill="#C98A4B"/><path d="M37 42 Q60 48 83 42" stroke="#FF5A5F" stroke-width="4" fill="none"/><path d="M16 45 Q60 60 104 45 Q102 54 60 58 Q18 54 16 45Z" fill="#B5713C"/>`,
    veniec: [[36, 44, '#FF9EC7'], [46, 35, '#FFD23F'], [60, 31, '#8FD3FF'], [74, 35, '#FF9EC7'], [84, 44, '#FFD23F']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(u => `<circle cx="0" cy="-4.5" r="3.6" fill="${c}" stroke-width="1.8" transform="rotate(${u})"/>`).join('')}<circle r="2.8" fill="#FF9F1C" stroke-width="1.5"/></g>`).join(''),
    tiara: `<path d="M38 41 Q60 31 82 41 L79 31 L71 36 L66 22 L60 33 L54 22 L49 36 L41 31Z" fill="#E6E9F5"/><circle cx="60" cy="27" r="3.4" fill="#8FD3FF" stroke-width="2"/><circle cx="49" cy="33" r="2" fill="#FF9EC7" stroke-width="1.5"/><circle cx="71" cy="33" r="2" fill="#FF9EC7" stroke-width="1.5"/>`,
    viking: `<path d="M32 40 Q14 36 16 12 Q24 28 37 30Z M88 40 Q106 36 104 12 Q96 28 83 30Z" fill="#FFF3D6"/><path d="M30 52 Q30 24 60 24 Q90 24 90 52Z" fill="#B8BCCB"/><path d="M30 50 H90" stroke-width="7"/><path d="M30 50 H90" stroke="#C98A4B" stroke-width="3"/><path d="M60 25 V48" stroke-width="2.5"/>`,
    svatozar: `<g class="bob"><ellipse cx="60" cy="17" rx="25" ry="7" fill="none" stroke-width="9"/><ellipse cx="60" cy="17" rx="25" ry="7" fill="none" stroke="#FFD23F" stroke-width="5"/><ellipse cx="60" cy="17" rx="25" ry="7" fill="none" stroke="#FFF3B0" stroke-width="1.5"/></g>`,
    cisarska: `<path d="M31 43 L28 11 L43 26 L51 5 L60 21 L69 5 L77 26 L92 11 L89 43Z" fill="#FFC233"/><rect x="31" y="36" width="58" height="10" rx="3" fill="#FF5A5F"/><circle cx="60" cy="30" r="4" fill="#4C7DFF" stroke-width="2"/><circle cx="44" cy="33" r="3" fill="#2FBF71" stroke-width="2"/><circle cx="76" cy="33" r="3" fill="#B36BFF" stroke-width="2"/>${[[28, 9], [51, 3], [69, 3], [92, 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke-width="2"/>`).join('')}<g transform="translate(101 22)"><g class="twinkle"><path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2Z" fill="#FFD23F" stroke-width="1.5"/></g></g>`,
  }[a.doplnok] || '';
  const oko = (x, y) => `<circle cx="${x}" cy="${y}" r="2" fill="${INK}" stroke="none"/>`;
  const zvieratko = {
    macka: `<path d="M-12 -4 L-11 -19 L-2 -11Z M12 -4 L11 -19 L2 -11Z" fill="#FF9F1C" stroke-width="2.5"/><circle r="12" fill="#FF9F1C" stroke-width="2.5"/>${oko(-4.5, -2)}${oko(4.5, -2)}<path d="M-1.5 2 h3 l-1.5 2Z" fill="#FF6FA8" stroke="none"/><path d="M-4 6 q4 3 8 0 M-14 2 h-6 M14 2 h6 M-14 5 l-5 2 M14 5 l5 2" fill="none" stroke-width="1.5"/>`,
    psik: `<ellipse cx="-11" cy="-2" rx="5" ry="10" fill="#8B5A3C" stroke-width="2.5" transform="rotate(20 -11 -2)"/><ellipse cx="11" cy="-2" rx="5" ry="10" fill="#8B5A3C" stroke-width="2.5" transform="rotate(-20 11 -2)"/><circle r="12" fill="#D9A06B" stroke-width="2.5"/><ellipse cx="0" cy="5" rx="6" ry="4.5" fill="#F4D3A8" stroke-width="2"/>${oko(-4.5, -3)}${oko(4.5, -3)}<circle cx="0" cy="3" r="2.2" fill="${INK}" stroke="none"/>`,
    sovicka: `<path d="M-9 -9 L-11 -18 L-3 -12Z M9 -9 L11 -18 L3 -12Z" fill="#7650E6" stroke-width="2"/><circle r="12" fill="#9B6BFF" stroke-width="2.5"/><circle cx="-4.5" cy="-2" r="4.5" fill="#fff" stroke-width="2"/><circle cx="4.5" cy="-2" r="4.5" fill="#fff" stroke-width="2"/>${oko(-4, -2)}${oko(5, -2)}<path d="M-2 3 H2 L0 6Z" fill="#FFA62B" stroke-width="1.5"/>`,
    dino: `<path d="M-8 -11 l3 -7 l3 6 l3 -7 l3 6 l3 -6 l2 8" fill="#16BFAE" stroke-width="2"/><ellipse rx="14" ry="11" fill="#2FBF71" stroke-width="2.5"/>${oko(-5, -3)}${oko(5, -3)}<path d="M-6 4 q6 5 12 0" fill="none" stroke-width="2"/><circle cx="-2" cy="1" r="1" fill="${INK}" stroke="none"/><circle cx="2" cy="1" r="1" fill="${INK}" stroke="none"/>`,
    jednorozec: `<circle cx="-11" cy="-6" r="5" fill="#FF9EC7" stroke-width="2"/><circle cx="-12" cy="2" r="5" fill="#B36BFF" stroke-width="2"/><circle cx="-10" cy="9" r="4.5" fill="#8FD3FF" stroke-width="2"/><path d="M-2 -10 L2 -26 L6 -10Z" fill="#FFD23F" stroke-width="2"/><circle r="12" fill="#fff" stroke-width="2.5"/><path d="M-6 -1 q3 3 6 0 M3 -1 q3 3 6 0" fill="none" stroke-width="2"/><circle cx="7" cy="5" r="2.5" fill="#FF8FB1" stroke="none"/>`,
    zajko: `<path d="M-6 -8 Q-11 -27 -4 -27 Q0 -25 -1 -9Z M6 -8 Q11 -27 4 -27 Q0 -25 1 -9Z" fill="#fff" stroke-width="2"/><circle r="12" fill="#fff" stroke-width="2.5"/>${oko(-4.5, -2)}${oko(4.5, -2)}<path d="M-1.5 2 h3 l-1.5 2Z" fill="#FF6FA8" stroke="none"/><circle cx="-7" cy="4" r="2.2" fill="#FF9EC7" stroke="none"/><circle cx="7" cy="4" r="2.2" fill="#FF9EC7" stroke="none"/>`,
    tucniak: `<ellipse rx="12" ry="13" fill="${INK}" stroke-width="2.5"/><ellipse cy="3" rx="8" ry="9" fill="#fff" stroke="none"/><circle cx="-4" cy="-4" r="3" fill="#fff" stroke="none"/><circle cx="4" cy="-4" r="3" fill="#fff" stroke="none"/>${oko(-4, -4)}${oko(4, -4)}<path d="M-3 0 h6 l-3 4Z" fill="#FF9F1C" stroke-width="1.5"/>`,
    liska: `<path d="M-12 -2 L-11 -19 L-3 -11Z M12 -2 L11 -19 L3 -11Z" fill="#FF7A1A" stroke-width="2.5"/><path d="M-13 -4 Q-13 -13 0 -13 Q13 -13 13 -4 Q10 8 0 12 Q-10 8 -13 -4Z" fill="#FF7A1A" stroke-width="2.5"/><path d="M-9 2 Q-4 4 0 11 Q4 4 9 2 Q5 9 0 11.5 Q-5 9 -9 2Z" fill="#fff" stroke="none"/>${oko(-4.5, -3)}${oko(4.5, -3)}<circle cy="9" r="1.8" fill="${INK}" stroke="none"/>`,
    drak: `<path d="M-10 -4 L-23 -17 L-19 -3 L-25 -5 L-14 4Z M10 -4 L23 -17 L19 -3 L25 -5 L14 4Z" fill="#7C6CFF" stroke-width="2"/><ellipse rx="13" ry="11" fill="#B36BFF" stroke-width="2.5"/><path d="M-7 -10 l2 -6 2 5 M3 -10 l2 -6 2 5" fill="#FFD23F" stroke-width="1.5"/>${oko(-5, -3)}${oko(5, -3)}<path d="M-4 4 q4 3 8 0" fill="none" stroke-width="2"/><path d="M13 2 q9 -4 12 2 q-5 0 -3 5 q-5 -3 -9 -3Z" fill="#FF9F1C" stroke-width="1.5"/>`,
    fenix: `<path d="M-8 5 Q-21 16 -27 7 Q-19 8 -16 1Z M8 5 Q21 16 27 7 Q19 8 16 1Z" fill="#FF9F1C" stroke-width="2"/><path d="M-6 -10 Q-9 -23 0 -27 Q-2 -19 2 -15 Q4 -23 11 -23 Q6 -17 6 -10Z" fill="#FFD23F" stroke-width="2"/><circle r="12" fill="#FF5A5F" stroke-width="2.5"/>${oko(-4.5, -2)}${oko(4.5, -2)}<path d="M-2 2 h4 l-2 4Z" fill="#FFD23F" stroke-width="1.5"/>`,
  }[a.zvieratko];
  const krid = p => `<path d="${p}"/><path d="${p}" transform="matrix(-1 0 0 1 120 0)"/>`;
  const kuzloZ = {
    motyl: `<g fill="#FF9EC7">${krid('M44 100 Q8 66 5 94 Q3 116 40 110Z')}</g><g fill="#B36BFF">${krid('M42 106 Q16 98 14 112 Q22 124 43 112Z')}</g><g fill="#fff" stroke="none">${krid('M20 86 a5 5 0 1 0 .1 0Z')}</g>`,
    aura: `<circle cx="60" cy="64" r="58" fill="#FFE27A" opacity=".6" stroke="none"/><circle cx="60" cy="64" r="47" fill="#FFF3B0" opacity=".7" stroke="none"/>${[...Array(12).keys()].map(i => `<path d="M${(60 + Math.cos(i * Math.PI / 6) * 44).toFixed(1)} ${(64 + Math.sin(i * Math.PI / 6) * 44).toFixed(1)} L${(60 + Math.cos(i * Math.PI / 6) * 58).toFixed(1)} ${(64 + Math.sin(i * Math.PI / 6) * 58).toFixed(1)}" stroke="#FFC233" stroke-width="4" opacity=".7"/>`).join('')}`,
    anjel: `<g fill="#fff">${krid('M44 104 Q10 98 3 64 Q15 74 21 72 Q11 62 13 49 Q25 65 33 63 Q29 55 33 45 Q41 70 52 92Z')}</g>`,
    drakie: `<g fill="#7C6CFF">${krid('M45 100 L7 50 L17 69 L3 71 L19 83 L7 92 L41 107Z')}</g><g fill="none" stroke-width="2">${krid('M41 102 L17 69 M39 104 L19 83')}</g>`,
    duha: ['#FF5A5F', '#FF9F1C', '#FFD23F', '#2FBF71', '#4C7DFF', '#B36BFF'].map((c, i) => `<path d="M${4 + i * 5} 76 A${56 - i * 5} ${56 - i * 5} 0 0 1 ${116 - i * 5} 76" fill="none" stroke="${c}" stroke-width="5.5"/>`).join(''),
  }[a.kuzlo] || '';
  const iskra = (x, y, d, c = '#FFD23F') => `<g transform="translate(${x} ${y})"><g class="twinkle" style="animation-delay:${d}s"><path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2Z" fill="${c}" stroke-width="1.5"/></g></g>`;
  const kuzloP = {
    iskry: [[16, 30, 0], [104, 24, .6], [12, 90, 1.2], [106, 78, .3], [60, 8, .9, '#FF9EC7']].map(p => iskra(...p)).join(''),
    duha: iskra(14, 40, 0) + iskra(106, 40, .7, '#FF9EC7'),
    aura: iskra(20, 26, .2) + iskra(100, 26, .9),
  }[a.kuzlo] || '';
  return `<svg class="postavicka" viewBox="0 0 120 130" aria-hidden="true"><g stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
    ${kruh ? `<circle cx="60" cy="64" r="58" fill="${a.pozadie}" stroke="none"/>` : ''}
    ${kuzloZ}${vzadu}
    <path d="M14 131 Q16 100 42 96 L78 96 Q104 100 106 131Z" fill="${tr}"/>${vzor}
    <path d="M50 86 V100 Q60 106 70 100 V86Z" fill="${k}"/><path d="M47 97 Q60 108 73 97" fill="none" stroke-width="3"/>
    <circle cx="31" cy="66" r="7" fill="${k}"/><circle cx="89" cy="66" r="7" fill="${k}"/>
    <circle cx="60" cy="62" r="30" fill="${k}"/>
    <circle cx="42" cy="74" r="4.5" fill="#FF8FB1" opacity=".75" stroke="none"/><circle cx="78" cy="74" r="4.5" fill="#FF8FB1" opacity=".75" stroke="none"/>
    ${oci}${usta}${vpredu}${okuliare}${doplnok}
    ${zvieratko ? `<g transform="translate(97 106) scale(1.3)"><g class="bob">${zvieratko}</g></g>` : ''}${kuzloP}</g></svg>`;
}
