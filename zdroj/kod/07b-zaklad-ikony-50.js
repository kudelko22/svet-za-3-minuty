/* Rodina ikon 5.0: mriežka 24, obrys 2, okrúhle spoje, najviac dve farby z palety (berú sa z premenných, v noci sa menia samy).
   Použitie: ikn('hviezda') vráti <svg class="ikn">. Obrys je --iko (v Mesačnom režime svetlý), šípky a krížik berú farbu textu.
   Staré ikony IK, IKO a IK_KAT (07-zaklad-ikony.js) ostávajú, kým ich obrazovky neprejdú na túto rodinu. */
const IKN = {
  domov: '<path d="M5.5 11v8a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-8z" fill="var(--sun)"/><path d="M10 20.5V16a2 2 0 0 1 4 0v4.500z" fill="var(--violet)"/><path d="M2.8 11.8 12 3.800l9.2 8z" fill="var(--coral)"/>',
  temy: '<path d="M12 6.800C10 5.3 7 4.8 3.5 5.300v13c3.5-.5 6.5 0 8.5 1.500z" fill="var(--sky)"/><path d="M12 6.800c2-1.5 5-2 8.5-1.500v13c-3.5-.5-6.5 0-8.5 1.500z" fill="var(--sky-l)"/><path d="M14.8 10.200c1.2-.4 2.3-.6 3.4-.6M14.8 13.400c1.2-.4 2.3-.6 3.4-.6"/>',
  hry: '<path d="M7 8h10a5 5 0 0 1 4.8 6.300l-1 3.800a2.6 2.6 0 0 1-4.4 1.100L14 17h-4l-2.4 2.200a2.6 2.6 0 0 1-4.4-1.100l-1-3.800A5 5 0 0 1 7 8z" fill="var(--teal)"/><path d="M7.5 11v3.600M5.7 12.800h3.6"/><circle cx="15.4" cy="11.7" r="1.1" fill="var(--sun)"/><circle cx="17.8" cy="13.9" r="1.1" fill="var(--sun)"/>',
  priatelia: '<circle cx="16.2" cy="9" r="2.8" fill="var(--sky)"/><path d="M13.5 19.500c.3-3.2 1.5-5.2 3.8-5.2 2.3 0 3.8 1.8 4.2 5.200z" fill="var(--sky)"/><circle cx="8.5" cy="8.3" r="3.3" fill="var(--coral)"/><path d="M2.5 19.500c.5-3.8 2.8-6 6-6s5.5 2.2 6 6z" fill="var(--coral)"/>',
  ja: '<path d="M4.5 20.500c.8-4.3 3.7-6.5 7.5-6.500s6.7 2.2 7.5 6.500z" fill="var(--violet)"/><circle cx="12" cy="8.3" r="4.2" fill="var(--sun)"/>',
  hviezda: '<path d="M12 2.800l2.8 5.9 6.4.8-4.7 4.4 1.2 6.400L12 17.200l-5.7 3.1 1.2-6.400L2.8 9.500l6.4-.8z" fill="var(--sun)"/>',
  plamen: '<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-2.8 1.8-4.6 3-6.5.4 1.3 1 2 1.9 2.500C10 7.5 11.3 4.8 13.8 3c-.2 2.5 1 4 2.5 5.8 1.3 1.6 2.2 3.3 2.2 5.7 0 3.8-2.5 6.5-6.5 6.500z" fill="var(--coral)"/><path d="M12 20c-1.7 0-2.8-1.2-2.8-2.8 0-1.6 1.2-2.5 2.8-4.2 1.6 1.7 2.8 2.6 2.8 4.2 0 1.6-1.1 2.8-2.8 2.800z" fill="var(--sun)" stroke="none"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.3" fill="var(--sky-l)"/><path d="M15.2 15.200l5.3 5.3" stroke-width="3.2"/><path d="M7.6 9.800c.3-1.3 1.2-2.1 2.4-2.4" stroke="#fff" stroke-width="1.8"/>',
  zvuk: '<path d="M4 9.500h3l4.5-4v13l-4.5-4H4z" fill="var(--sun)"/><path d="M15 9c1 .8 1.5 1.8 1.5 3s-.5 2.2-1.5 3M17.5 6.500c1.7 1.4 2.5 3.3 2.5 5.500s-.8 4.1-2.5 5.5"/>',
  zamok: '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="var(--sun)"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.5"/><circle cx="12" cy="15.5" r="1.4" fill="var(--ink)" stroke="none"/>',
  auto: '<path d="M3 16v-3.200c0-.8.5-1.5 1.3-1.700l2-.6 1.6-3.300A2 2 0 0 1 9.7 6h4.900a2 2 0 0 1 1.7.9l2.2 3.6 1.3.4c.8.3 1.2 1 1.2 1.800V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="var(--coral)"/><path d="M9 10.300l1-2.300h4.300l1.4 2.300z" fill="var(--sky-l)"/><circle cx="7.5" cy="17" r="2.1" fill="#fff"/><circle cx="16.5" cy="17" r="2.1" fill="#fff"/>',
  odznak: '<path d="M7.5 3h3.500l2 5.500H9.500zM16.5 3H13l-2 5.500h3.500z" fill="var(--violet)"/><circle cx="12" cy="14.5" r="6" fill="var(--sun)"/><path d="M12 11.600l.9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2.1-.3z" fill="#fff" stroke-width="1.3"/>',
  srdce: '<path d="M12 20.500C7 17 3.5 13.8 3.5 9.800A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 8.5 1.800c0 4-3.5 7.2-8.5 10.700z" fill="var(--coral)"/><path d="M6.3 9.600c.1-1.2.8-2 1.8-2.3" stroke="#fff" stroke-width="1.7"/>',
  darcek: '<rect x="4.5" y="10.5" width="15" height="10" rx="1.5" fill="var(--teal)"/><rect x="3" y="7" width="18" height="4" rx="1.3" fill="var(--teal)"/><path d="M12 7v13.5"/><path d="M12 7c-1.5-3.7-5.2-3.7-5.2-1.600C6.8 7 9.5 7 12 7zM12 7c1.5-3.7 5.2-3.7 5.2-1.600C17.2 7 14.5 7 12 7z" fill="var(--sun)"/>',
  blesk: '<path d="M13.5 2.5 5 13.500h5.500l-1 8L18.5 10H13z" fill="var(--sun)"/>',
  bublina: '<path d="M4 4.500h16a1.5 1.5 0 0 1 1.5 1.500v9a1.5 1.5 0 0 1-1.5 1.500h-7l-4.5 3.800v-3.800H4A1.5 1.5 0 0 1 2.5 15V6A1.5 1.5 0 0 1 4 4.500z" fill="var(--sky)"/><path d="M7 9h10M7 12.300h6" stroke="#fff"/>',
  kompas: '<circle cx="12" cy="12" r="8.8" fill="var(--sky-l)"/><path d="M15.8 8.200l-2.2 5.4-5.4 2.2 2.2-5.400z" fill="var(--coral)"/>',
  strom: '<path d="M12 21v-7" stroke-width="2.8"/><path d="M12 3.500c3.5 0 6 2.5 6 5.5 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3 2.5-5.5 6-5.500z" fill="var(--leaf)"/><path d="M9 8.500c.4-1.2 1.2-2 2.4-2.3" stroke="#fff" stroke-width="1.7"/>',
  zalozka: '<path d="M6.5 3.500h11v17L12 16.500l-5.5 4z" fill="var(--coral)"/>',
  hraj: '<path d="M8 5l11 7-11 7z" fill="var(--sun)"/>',
  check: '<path d="M5 12.500l4.5 4.500L19 7.5" stroke-width="3.2"/>',
  sipka: '<path d="M5 12h14M13 6l6 6-6 6" stroke-width="2.8"/>',
  spat: '<path d="M19 12H5M11 6l-6 6 6 6" stroke-width="2.8"/>',
  zavriet: '<path d="M6 6l12 12M18 6 6 18" stroke-width="2.8"/>',
  dole: '<path d="M6 9l6 6 6-6" stroke-width="2.8"/>',

  ceruzka: '<path d="M4 20l1-4.500L16 4.500a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.5 19z" fill="var(--sun)"/><path d="M14 6.500l3.5 3.5"/>',
  kocka: '<rect x="4" y="4" width="16" height="16" rx="3.8" fill="#fff"/><circle cx="8.7" cy="8.7" r="1.3" fill="var(--ink)" stroke="none"/><circle cx="15.3" cy="15.3" r="1.3" fill="var(--ink)" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="var(--ink)" stroke="none"/><circle cx="15.3" cy="8.7" r="1.3" fill="var(--ink)" stroke="none"/><circle cx="8.7" cy="15.3" r="1.3" fill="var(--ink)" stroke="none"/>',
  pohar: '<path d="M7.5 5.500H4.300c0 3 1.2 4.6 3.5 4.900M16.5 5.500h3.200c0 3-1.2 4.6-3.5 4.9"/><path d="M7.5 4h9v5.500a4.5 4.5 0 0 1-9 0z" fill="var(--sun)"/><path d="M12 14v3"/><path d="M8.5 20.500h7l-1-3.500h-5z" fill="var(--coral)"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke-width="2.8"/>',
  mesiac: '<path d="M19.8 14.300A8 8 0 0 1 9.7 4.200a8 8 0 1 0 10.1 10.100z" fill="var(--sun)"/>',
  slnko: '<circle cx="12" cy="12" r="4.6" fill="var(--sun)"/><path d="M12 2.800v2.200M12 19v2.200M2.8 12H5M19 12h2.200M5.5 5.500l1.5 1.500M17 17l1.5 1.500M5.5 18.5 7 17M17 7l1.5-1.5"/>',
  kos: '<path d="M8 10c0-3.6 1.6-5.6 4-5.600s4 2 4 5.6"/><path d="M4 10h16l-1.8 9a1.5 1.5 0 0 1-1.5 1.200H7.300A1.5 1.5 0 0 1 5.8 19z" fill="var(--sun)"/><path d="M9.5 13.500V17M14.5 13.500V17"/>',
  kvapka: '<path d="M12 3.500c3 3.8 5.5 6.8 5.5 10a5.5 5.5 0 0 1-11 0c0-3.2 2.5-6.2 5.5-10z" fill="var(--sky)"/><path d="M9.3 13.800c.2 1.4 1 2.3 2.2 2.6" stroke="#fff" stroke-width="1.7"/>',
  nastav: '<path d="M4 7h7M17 7h3M4 12h2M11 12h9M4 17h9M19 17h1"/><circle cx="14" cy="7" r="2.3" fill="var(--sun)"/><circle cx="8.5" cy="12" r="2.3" fill="var(--teal)"/><circle cx="16" cy="17" r="2.3" fill="var(--coral)"/>',
  kluc: '<circle cx="8" cy="12" r="4.3" fill="var(--sun)"/><path d="M12.3 12H21M17.5 12v3.300M20.5 12v2.3"/>',
  obalka: '<rect x="3" y="6" width="18" height="13" rx="2" fill="var(--sky-l)"/><path d="M3.5 7.500l8.5 6 8.5-6"/>',
  oko: '<path d="M2.5 12c2.5-4.3 5.7-6.5 9.5-6.500s7 2.2 9.5 6.500c-2.5 4.3-5.7 6.5-9.5 6.500S5 16.3 2.5 12z" fill="#fff"/><circle cx="12" cy="12" r="3" fill="var(--sky)"/>',
  pauza: '<rect x="5.5" y="4.5" width="5" height="15" rx="1.8" fill="var(--sun)"/><rect x="13.5" y="4.5" width="5" height="15" rx="1.8" fill="var(--sun)"/>',
  znova: '<path d="M5.2 13a7 7 0 1 0 1.9-6.1" stroke-width="2.6"/><path d="M4.5 3.800v4.700h4.7" stroke-width="2.6"/>',
  preskoc: '<path d="M5 5.500l9.5 6.500L5 18.500z" fill="var(--sun)"/><path d="M18.5 5.500v13" stroke-width="2.8"/>',
  raketa: '<path d="M7.5 12.500l-3 3.500v2.800l3-1.300M16.5 12.500l3 3.500v2.800l-3-1.3" fill="var(--coral)"/><path d="M12 2.800c3.2 2.5 4.5 6 4.5 9.200v4h-9v-4c0-3.2 1.3-6.7 4.5-9.200z" fill="#fff"/><circle cx="12" cy="9.5" r="1.9" fill="var(--sky)"/><path d="M10 16v2.300c.6 1.3 1.3 2.1 2 2.9.7-.8 1.4-1.6 2-2.900V16z" fill="var(--sun)"/>',
  mapa: '<path d="M3.5 6.500l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z" fill="var(--sun-l)"/><path d="M9 4.500v13M15 6.500v13"/><path d="M11 9.500l2 2M13 9.500l-2 2" stroke="var(--coral-d)"/>',
  terc: '<circle cx="12" cy="12" r="8.8" fill="#fff"/><circle cx="12" cy="12" r="5.3" fill="var(--coral)"/><circle cx="12" cy="12" r="1.8" fill="#fff"/>',
  klicok: '<path d="M12 21v-9.5"/><path d="M12 11.500c0-3.6-2.6-5.6-6.7-5.6 0 3.6 2.6 5.6 6.7 5.600z" fill="var(--leaf)"/><path d="M12 14.500c0-3 2.2-4.8 5.8-4.8 0 3-2.2 4.8-5.8 4.800z" fill="var(--leaf)"/>',
  ciapka: '<path d="M6.5 12v4c1.5 1.5 3.3 2.2 5.5 2.200s4-.7 5.5-2.200v-4" fill="var(--violet)"/><path d="M2.5 9.5 12 5l9.5 4.500L12 14z" fill="var(--violet)"/><path d="M21.5 9.500v5"/>',
  koruna: '<path d="M4 18.500l-1-10 5 4 4-7 4 7 5-4-1 10z" fill="var(--sun)"/><path d="M4.3 21h15.4"/>',
  karty: '<rect x="4" y="6" width="9" height="13" rx="1.8" fill="var(--sky)" transform="rotate(-10 8.5 12.5)"/><rect x="11" y="5" width="9" height="13" rx="1.8" fill="#fff" transform="rotate(8 15.5 11.5)"/>',
  odhlas: '<path d="M10 4.500H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.500h4M14.5 8l4 4-4 4M18.5 12H9.5"/>',
  kalendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5" fill="#fff"/><path d="M4 10V8a2.5 2.5 0 0 1 2.5-2.500h11A2.5 2.5 0 0 1 20 8v2z" fill="var(--coral)"/><path d="M8 3.500v4M16 3.500v4"/>',
  vibr: '<rect x="8" y="4" width="8" height="16" rx="2" fill="var(--sky-l)"/><path d="M4.5 9v6M19.5 9v6"/>',
  stit: '<path d="M12 3l7.5 2.500v6c0 4.5-3 7.7-7.5 9.5-4.5-1.8-7.5-5-7.5-9.500v-6z" fill="var(--teal)"/><path d="M8.8 12l2.3 2.3 4.2-4.3" stroke="#fff" stroke-width="2.2"/>',
};
const IKN_GLYF = new Set(['check', 'sipka', 'spat', 'zavriet', 'dole', 'plus', 'znova']);
const ikn = (n, trieda = '') => `<svg class="ikn${trieda ? ' ' + trieda : ''}" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="${IKN_GLYF.has(n) ? 'currentColor' : 'var(--iko, var(--ink))'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IKN[n] || ''}</g></svg>`;
/* Logo Svetom: písmeno o je zemeguľa, od nej vedie bodkovaná cesta k hviezde. logo() vráti <span class="logo">, veľkosť cez --ls. */
function logoGlobus() {
  const id = 'gl' + (++mudraUid);
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><clipPath id="${id}"><circle cx="24" cy="24" r="19"/></clipPath><g stroke="var(--lo, #2A2356)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"><circle cx="24" cy="24" r="19" fill="#52B6FF"/><g clip-path="url(#${id})" stroke="none" fill="#5BC56B"><path d="M4 16c5-6 13-6 17-2 3 3 0 7-4 9-4 2-5 7-10 6-4-1-5-8-3-13z"/><path d="M27 27c4-3 11-3 15 1 2 4 1 12-3 15-5 3-11 0-13-5-1-4-2-8 1-11z"/><path d="M30 6c4 0 8 2 10 5-3 2-7 1-9-1-1-1-2-3-1-4z"/></g><circle cx="24" cy="24" r="19" fill="none"/><path d="M10.5 19c1-4.5 4-7.5 8-8.8" fill="none" stroke="#fff" stroke-width="3" opacity=".85"/><path d="M39 6C45 -13 63 -21 81 -15" fill="none" stroke-width="4" stroke-dasharray=".1 8.5"/></g>${mStar5(91, -12, 9, '#FFC533', 0).replace('stroke-width="0"', 'stroke="var(--lo, #2A2356)" stroke-width="3.5" stroke-linejoin="round"')}</svg>`;
}
const logo = (trieda = '') => `<span class="logo${trieda ? ' ' + trieda : ''}" role="img" aria-label="Svetom">Svet<span class="o">${logoGlobus()}</span>m</span>`;
const PODTITUL = 'Každý deň objav niečo nové.';
