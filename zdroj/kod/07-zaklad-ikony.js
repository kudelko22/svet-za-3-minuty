/* Kreslené ikony ovládania (emoji kreslí každý telefón inak a v aute sú nečitateľné) */
// (ikony sú tu, nie v obrazky.js: nová appka so starým obrazky.js z pamäte telefónu by inak spadla)
// Kreslené ikony namiesto emoji: emoji vyzerajú na každom telefóne inak, tieto všade rovnako
const IKS = v => `<svg class="ik" viewBox="0 0 48 48" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${v}</g></svg>`;
const LESK = d => `<path d="${d}" fill="none" stroke="#fff" stroke-width="2.6" opacity=".75"/>`;
const SRDCE_D = 'M24 42 C10 33 5 25 5 17 C5 11 10 7 15 7 C19 7 22 9 24 13 C26 9 29 7 33 7 C38 7 43 11 43 17 C43 25 38 33 24 42Z';
const ZIAROVKA = `<path d="M24 5 C15 5 9 12 9 20 C9 26 13 29 16 33 V36 H32 V33 C35 29 39 26 39 20 C39 12 33 5 24 5Z" fill="#FFE27A"/><rect x="16" y="36" width="16" height="7" rx="2.5" fill="#B8BCCB"/>
  <path d="M19 27 L21.5 22 L24 27 L26.5 22 L29 27" fill="none" stroke-width="2.2"/>${LESK('M14 19 C14 14 17 11 21 10')}`;
const MOZOG = `<path d="M24 9 C20 5 13 6 12 12 C7 13 4 18 7 22 C4 26 6 32 10 33 C11 38 16 41 20 38 C22 41 26 41 28 38 C32 41 37 38 38 33 C42 32 44 26 41 22 C44 18 41 13 36 12 C35 6 28 5 24 9Z" fill="#FF9EC7"/>
  <path d="M24 9 V38 M12 12 C15 14 16 17 15 20 M7 22 C10 23 13 23 15 25 M10 33 C12 30 15 29 18 30 M36 12 C33 14 32 17 33 20 M41 22 C38 23 35 23 33 25 M38 33 C36 30 33 29 30 30" fill="none" stroke-width="2.3"/>${LESK('M15 15 C16 13 18 12 20 12')}`;
const DOMCEK = (strecha, vnutro) => `<rect x="31" y="8" width="6" height="11" fill="#C9CED8"/><path d="M4 25 L24 7 L44 25Z" fill="${strecha}"/><rect x="10" y="23" width="28" height="20" fill="#FFF4E0"/>${vnutro}`;
const IK = {
  ohen: IKS(`<path d="M24 3 C31 11 41 17 41 30 C41 39 33 45 24 45 C15 45 7 39 7 30 C7 22 12 16 16 11 C17 16 19 19 22 20 C21 14 21 8 24 3Z" fill="#FF6A2B"/>
    <path d="M24 21 C28 26 34 29 34 35 C34 40 29.5 43 24 43 C18.5 43 14 40 14 35 C14 31 18 28 20 24 C21 27 22 28 23 28 C23 26 23 23 24 21Z" fill="#FFD23F"/>
    ${dot(20.5, 34.5, 1.9)}${dot(27.5, 34.5, 1.9)}<path d="M21.5 38 Q24 40.5 26.5 38" fill="none" stroke-width="2"/>
    <circle cx="17.5" cy="38" r="1.8" fill="#FF8FB1" stroke="none"/><circle cx="30.5" cy="38" r="1.8" fill="#FF8FB1" stroke="none"/>${LESK('M12 29 C12 25 14 21 17 18')}`),
  blesk: IKS(`<path d="M28 3 L10 27 H22 L18 45 L38 19 H26 L31 3Z" fill="#FFD23F"/>${LESK('M25 9 L16 22')}`),
  kocka: IKS(`<path d="M24 5 L41 14 L24 23 L7 14Z" fill="#fff"/><path d="M7 14 L24 23 V43 L7 34Z" fill="#ECE7F7"/><path d="M41 14 L24 23 V43 L41 34Z" fill="#D9D1F0"/>
    <ellipse cx="24" cy="14" rx="3.4" ry="2" fill="#FF5A5F" stroke="none"/>${dot(11.5, 22, 2.2)}${dot(19.5, 35, 2.2)}${dot(28.5, 35, 2.2)}${dot(32.5, 28.5, 2.2)}${dot(36.5, 22, 2.2)}`),
  mozog: IKS(MOZOG),
  pohar: IKS(`<path d="M14 11 H8 C7 19 11 23 16 23 M34 11 H40 C41 19 37 23 32 23" fill="none"/><path d="M13 6 H35 V17 C35 25 30 29 24 29 C18 29 13 25 13 17Z" fill="#FFD23F"/>
    <rect x="20" y="29" width="8" height="6" fill="#F0A800"/><rect x="13" y="35" width="22" height="8" rx="2.5" fill="#B36BFF"/>
    <path d="${HV5}" transform="translate(24 17) scale(.55)" fill="#fff" stroke-width="3.5"/>${LESK('M17 10 V17')}`),
  iskra: IKS(`<path d="M20 5 C21 15 24 18 33 19 C24 20 21 23 20 33 C19 23 16 20 7 19 C16 18 19 15 20 5Z" fill="#FFD23F"/>
    <path d="M35 26 C35.6 31 37 32.4 42 33 C37 33.6 35.6 35 35 40 C34.4 35 33 33.6 28 33 C33 32.4 34.4 31 35 26Z" fill="#FF9EC7" stroke-width="2.5"/>
    <path d="M37 4 C37.4 7 38 7.6 41 8 C38 8.4 37.4 9 37 12 C36.6 9 36 8.4 33 8 C36 7.6 36.6 7 37 4Z" fill="#8FD3FF" stroke-width="2"/>`),
  zamok: IKS(`<path d="M15 22 V15 A9 9 0 0 1 33 15 V22" fill="none" stroke-width="9"/><path d="M15 22 V15 A9 9 0 0 1 33 15 V22" fill="none" stroke="#C9CED8" stroke-width="3.5"/>
    <rect x="9" y="20" width="30" height="23" rx="6" fill="#FFC233"/>${dot(24, 29, 3.2)}<path d="M24 31 V36"/>${LESK('M13 26 V35')}`),
  srdce: IKS(`<path d="${SRDCE_D}" fill="#FF5A5F"/>${LESK('M11 16 C11 13 13 11 16 11')}`),
  srdcePrazdne: IKS(`<path d="${SRDCE_D}" fill="#fff"/>`),
  ciapka: IKS(`<path d="M13 22 V32 C13 37 35 37 35 32 V22" fill="#2E3A87"/><path d="M3 18 L24 9 L45 18 L24 27Z" fill="#4C5BD6"/>
    <path d="M24 18 L38 22.5 V31" fill="none" stroke-width="2.4"/><rect x="35.5" y="30" width="5" height="7" rx="1.5" fill="#FFD23F" stroke-width="2.2"/><circle cx="24" cy="18" r="2.4" fill="#FFD23F" stroke-width="2"/>`),
  repro: IKS(`<path d="M6 18 H14 L25 9 V39 L14 30 H6Z" fill="#FFD23F"/><path d="M31 18 C34 21 34 27 31 30 M36 13 C42 19 42 29 36 35" fill="none"/>`),
  reproVyp: IKS(`<path d="M6 18 H14 L25 9 V39 L14 30 H6Z" fill="#C9CED8"/><path d="M32 19 L41 28 M41 19 L32 28" fill="none" stroke="#FF5A5F" stroke-width="3.5"/>`),
  lupa: IKS(`<path d="M30 30 L41 41" stroke-width="7"/><circle cx="21" cy="21" r="12" fill="#CFEFFF"/>${LESK('M14 19 A7 7 0 0 1 19 14')}`),
  medaila: IKS(`<path d="M13 3 H21 L28 19 L21 22Z" fill="#4C7DFF"/><path d="M35 3 H27 L20 19 L27 22Z" fill="#FF5A5F"/>
    <circle cx="24" cy="31" r="12" fill="#FFD23F"/><path d="${HV5}" transform="translate(24 31.5) scale(.6)" fill="#F0A800" stroke-width="3"/>`),
  ziarovka: IKS(ZIAROVKA),
  bublina: IKS(`<path d="M8 7 H40 A4 4 0 0 1 44 11 V30 A4 4 0 0 1 40 34 H22 L12 42 V34 H8 A4 4 0 0 1 4 30 V11 A4 4 0 0 1 8 7Z" fill="#8FD3FF"/>${dot(15, 20.5, 2.6)}${dot(24, 20.5, 2.6)}${dot(33, 20.5, 2.6)}`),
  otaznik: IKS(`<circle cx="24" cy="24" r="19" fill="#B36BFF"/><path d="M18 18 C18 13 21 11 24.5 11 C28.5 11 31 13.5 31 17 C31 21 26 22 25 26 V28" fill="none" stroke="#fff" stroke-width="4.5"/><circle cx="25" cy="35" r="2.8" fill="#fff" stroke="none"/>`),
  vlajka: IKS(`<path d="M11 7 C19 3 25 11 39 6 V26 C25 31 19 23 11 27Z" fill="#2FBF71"/><path d="${HV5}" transform="translate(25 17) scale(.5)" fill="#FFD23F" stroke-width="3"/><path d="M11 44 V5" stroke-width="3.5"/>`),
  kniha: IKS(`<path d="M3 13 V42 C11 40 18 40 24 44 C30 40 37 40 45 42 V13" fill="#4C7DFF"/><path d="M24 12 C18 8 11 8 5 10 V38 C11 36 18 36 24 40Z" fill="#fff"/><path d="M24 12 C30 8 37 8 43 10 V38 C37 36 30 36 24 40Z" fill="#fff"/>
    <path d="M9 17 C13 16 16 16 20 17 M9 23 C13 22 16 22 20 23 M9 29 C13 28 16 28 20 29 M28 17 C32 16 35 16 39 17 M28 23 C32 22 35 22 39 23" fill="none" stroke="#A7A1C2" stroke-width="2"/>`),
  ceruzka: IKS(`<g transform="rotate(40 24 24)"><path d="M18 34 L24 46 L30 34Z" fill="#FFE3BD"/><path d="M22.2 42.3 L24 46 L25.8 42.3Z" fill="${INK}" stroke-width="1.5"/>
    <rect x="18" y="9" width="12" height="25" fill="#FFD23F"/><path d="M24 13 V34" stroke-width="1.6"/><rect x="18" y="2" width="12" height="8" rx="3" fill="#FF9EC7"/><rect x="18" y="8.5" width="12" height="4" fill="#C9CED8"/></g>`),
  rodina: IKS(`<path d="M5 38 C5 28 9 24 15 24 C21 24 24 28 24 38Z" fill="#4C7DFF"/><circle cx="15" cy="15" r="6.5" fill="#FFD9B8"/>
    <path d="M24 38 C24 28 27 24 33 24 C39 24 43 28 43 38Z" fill="#FF6FA8"/><circle cx="33" cy="15" r="6.5" fill="#FFD9B8"/>
    <path d="M15 45 C15 38 18.5 34 24 34 C29.5 34 33 38 33 45Z" fill="#FFD23F"/><circle cx="24" cy="27" r="5.5" fill="#FFD9B8"/>`),
  konfety: IKS(`<path d="M6 43 L14 21 L28 35Z" fill="#FF9F1C"/><path d="M10 32 L18 37 M12 26 L23 34" fill="none" stroke-width="2.2"/>
    <path d="M21 21 C23 15 19 12 23 7" fill="none" stroke="#B36BFF" stroke-width="3.2"/><circle cx="31" cy="11" r="2.8" fill="#FF5A5F" stroke-width="2"/>
    <rect x="35" y="19" width="6" height="4" rx="1" transform="rotate(30 38 21)" fill="#4C7DFF" stroke-width="2"/><circle cx="40" cy="33" r="2.8" fill="#2FBF71" stroke-width="2"/>
    <path d="M28 27 C33 25 35 28 40 25" fill="none" stroke="#FF6FA8" stroke-width="3.2"/><path d="${HV5}" transform="translate(39 8) scale(.42)" fill="#FFD23F" stroke-width="3.5"/>`),
  koruna: IKS(`<path d="M6 16 L14 25 L24 10 L34 25 L42 16 L38 39 H10Z" fill="#FFD23F"/><rect x="9" y="34" width="30" height="7" rx="2.5" fill="#F0A800"/>
    <circle cx="24" cy="27" r="3" fill="#FF5A5F" stroke-width="2"/><circle cx="15.5" cy="30" r="2.3" fill="#4C7DFF" stroke-width="2"/><circle cx="32.5" cy="30" r="2.3" fill="#2FBF71" stroke-width="2"/>
    <circle cx="6" cy="15" r="2.6" fill="#FFD23F" stroke-width="2"/><circle cx="24" cy="9" r="2.6" fill="#FFD23F" stroke-width="2"/><circle cx="42" cy="15" r="2.6" fill="#FFD23F" stroke-width="2"/>`),
  terc: IKS(`<circle cx="22" cy="26" r="18" fill="#FF5A5F"/><circle cx="22" cy="26" r="12" fill="#fff"/><circle cx="22" cy="26" r="6" fill="#FF5A5F"/>
    <path d="M22 26 L40 8" stroke-width="3.2"/><path d="M36 6 L40 8 L42 12 M40 8 L45 5" fill="none" stroke-width="2.6"/>`),
  diamant: IKS(`<path d="M9 18 L16 8 H32 L39 18 L24 42Z" fill="#8FD3FF"/><path d="M9 18 H39 M16 8 L20 18 L24 42 M32 8 L28 18 L24 42" fill="none" stroke-width="2.2"/>${LESK('M15 15 L18 11')}`),
  duha: IKS(`<path d="M3 38 A21 21 0 0 1 45 38 H38 A14 14 0 0 0 10 38Z" fill="#FF5A5F"/><path d="M10 38 A14 14 0 0 1 38 38 H32 A8 8 0 0 0 16 38Z" fill="#FFD23F"/>
    <path d="M16 38 A8 8 0 0 1 32 38 H27 A3 3 0 0 0 21 38Z" fill="#4C7DFF"/><path d="M2 42 C2 37 9 36 10 39 C13 38 15 41 13 43 H3Z M46 42 C46 37 39 36 38 39 C35 38 33 41 35 43 H45Z" fill="#fff"/>`),
  mesiac: IKS(`<path d="M30 5 A19 19 0 1 0 43 33 A15 15 0 1 1 30 5Z" fill="#FFE27A"/><path d="M18 27 Q20.5 29.5 23 27" fill="none" stroke-width="2.2"/>
    <circle cx="16" cy="32" r="2" fill="#FF8FB1" stroke="none"/><path d="${HV5}" transform="translate(38 12) scale(.45)" fill="#fff" stroke-width="3.5"/>`),
  klicok: IKS(`<path d="M24 38 V22"/><path d="M24 25 C16 25 10 19 10 12 C18 12 24 17 24 25Z" fill="#4CD07D"/><path d="M24 21 C25 13 31 8 39 8 C39 16 33 21 24 21Z" fill="#2FBF71"/>
    <path d="M7 44 C9 36 39 36 41 44Z" fill="#B5651D"/>`),
  sova: IKS(`<path d="M11 17 L12 5 L20 12Z M37 17 L36 5 L28 12Z" fill="#7650E6"/><ellipse cx="24" cy="27" rx="16" ry="17" fill="#9B6BFF"/><ellipse cx="24" cy="36" rx="9" ry="7.5" fill="#EDE5FF"/>
    <circle cx="18" cy="22" r="6.5" fill="#fff"/><circle cx="30" cy="22" r="6.5" fill="#fff"/>${dot(18.5, 22.5, 3)}${dot(30.5, 22.5, 3)}<path d="M21.5 28 H26.5 L24 32Z" fill="#FFA62B" stroke-width="2.2"/>`),
  gamepad: IKS(`<path d="M12 14 H36 C42 14 46 22 46 30 C46 36 42 38 38 36 L33 31 H15 L10 36 C6 38 2 36 2 30 C2 22 6 14 12 14Z" fill="#7C6CFF"/>
    <path d="M13 19 V29 M8 24 H18" stroke="#fff" stroke-width="3.5"/><circle cx="33" cy="21" r="2.8" fill="#FFD23F" stroke-width="2"/><circle cx="38.5" cy="26.5" r="2.8" fill="#FF5A5F" stroke-width="2"/>`),
  nota: IKS(`<path d="M18 35 V11 L38 6 V30" fill="none" stroke-width="3.5"/><path d="M18 11 L38 6 V12 L18 17Z" fill="${INK}"/>
    <ellipse cx="13" cy="36" rx="6.5" ry="5" transform="rotate(-20 13 36)" fill="#B36BFF"/><ellipse cx="33" cy="31" rx="6.5" ry="5" transform="rotate(-20 33 31)" fill="#B36BFF"/>`),
  kalendar: IKS(`<rect x="6" y="9" width="36" height="34" rx="5" fill="#fff"/><path d="M6 14 A5 5 0 0 1 11 9 H37 A5 5 0 0 1 42 14 V19 H6Z" fill="#FF5A5F"/>
    <path d="M15 5 V13 M33 5 V13" stroke-width="3.5"/><path d="M15 30 L21.5 36 L33 24" fill="none" stroke="#2FBF71" stroke-width="4.5"/>`),
  balon: IKS(`<path d="M24 37 C20 41 28 43 24 47" fill="none" stroke-width="2"/><ellipse cx="24" cy="19" rx="13" ry="15" fill="#FF5A5F"/><path d="M21.5 34 H26.5 L24 38Z" fill="#FF5A5F" stroke-width="2"/>${LESK('M16 14 C17 10 19 8 22 7')}`),
  stopky: IKS(`<rect x="19" y="3" width="10" height="6" rx="2" fill="#FF5A5F"/><path d="M24 9 V11 M37 13 L40 10"/><circle cx="24" cy="27" r="17" fill="#fff"/>
    <path d="M24 27 L31 18" stroke-width="3.2"/>${dot(24, 27, 2.6)}<path d="M24 13 V15 M38 27 H36 M24 41 V39 M10 27 H12" stroke-width="2.4"/>`),
  oko: IKS(`<ellipse cx="15" cy="24" rx="10" ry="12" fill="#fff"/><ellipse cx="33" cy="24" rx="10" ry="12" fill="#fff"/>${dot(17, 26, 5)}${dot(35, 26, 5)}
    <circle cx="18.5" cy="24" r="1.8" fill="#fff" stroke="none"/><circle cx="36.5" cy="24" r="1.8" fill="#fff" stroke="none"/>`),
  kometa: IKS(`<path d="M3 45 C13 35 19 27 25 19 L33 26 C25 32 16 38 3 45Z" fill="#FF9F1C"/><path d="M10 40 C16 34 20 30 24 25" fill="none" stroke="#FFE27A" stroke-width="2.6"/>
    <path d="${HV5}" transform="translate(32 16) scale(1.15)" fill="#FFD23F" stroke-width="2.6"/>`),
  drak: IKS(`<path d="M17 14 L13 3 L24 11Z M31 13 L36 3 L27 10Z" fill="#FFE27A"/><path d="M6 30 C6 18 15 11 26 11 C37 11 43 18 43 27 C43 35 37 41 27 41 H15 C9 41 6 36 6 30Z" fill="#4CD07D"/>
    <circle cx="31" cy="22" r="5" fill="#fff"/>${dot(32, 23, 2.4)}${dot(11, 30, 1.6)}${dot(15.5, 30, 1.6)}<path d="M12 36 C19 38 28 37 33 33" fill="none" stroke-width="2.4"/>
    <path d="M41 30 L47 28 L43 35Z" fill="#FF9F1C" stroke-width="2"/>`),
  jednorozec: IKS(`<path d="M20 15 L24 1 L28 15Z" fill="#FFD23F"/><path d="M22 10 L26 8 M21 13 L27 11" fill="none" stroke-width="1.8"/>
    <circle cx="12" cy="18" r="6" fill="#FF9EC7"/><circle cx="10" cy="28" r="6" fill="#B36BFF"/><circle cx="13" cy="37" r="5" fill="#8FD3FF"/>
    <path d="M15 14 L17 6 L21 13Z M33 14 L31 6 L27 13Z" fill="#fff"/><ellipse cx="24" cy="28" rx="13" ry="14" fill="#fff"/><ellipse cx="24" cy="36" rx="8.5" ry="5.5" fill="#FFE0EC"/>
    <path d="M16.5 26 Q19 28.5 21.5 26 M26.5 26 Q29 28.5 31.5 26" fill="none" stroke-width="2.2"/>${dot(21, 36, 1.4)}${dot(27, 36, 1.4)}`),
  hviezda: IKS(`<path d="${HV5}" transform="translate(24 25.5) scale(2)" fill="#FFD23F" stroke-width="1.5"/>${LESK('M17 20 L21 16')}`),
  obalka: IKS(`<rect x="5" y="11" width="38" height="27" rx="4" fill="#fff"/><path d="M5 14 L24 28 L43 14" fill="none"/>
    <path d="M24 37 C18.5 33.5 16.5 30.5 16.5 28 C16.5 25.5 18.5 24 20.5 24 C22 24 23.2 25 24 26.5 C24.8 25 26 24 27.5 24 C29.5 24 31.5 25.5 31.5 28 C31.5 30.5 29.5 33.5 24 37Z" fill="#FF5A5F" stroke-width="2.4"/>`),
  saty: IKS(`<path d="M19 4 L20 13 M29 4 L28 13" fill="none"/><path d="M19 13 H29 L31 19 L40 43 H8 L17 19Z" fill="#FF6FA8"/><rect x="16.5" y="17" width="15" height="5" rx="1.5" fill="#FFD23F" stroke-width="2.4"/>
    <path d="M15 34 L18 38 L21 34 L24 38 L27 34 L30 38 L33 34" fill="none" stroke="#fff" stroke-width="2.2"/>`),
  labka: IKS(`<path d="M24 25 C30 25 37 31 37 37 C37 43 31 43 24 41 C17 43 11 43 11 37 C11 31 18 25 24 25Z" fill="#C98A4B"/>
    <ellipse cx="9.5" cy="21" rx="4.3" ry="5.6" fill="#C98A4B"/><ellipse cx="18" cy="12.5" rx="4.6" ry="6" fill="#C98A4B"/><ellipse cx="30" cy="12.5" rx="4.6" ry="6" fill="#C98A4B"/><ellipse cx="38.5" cy="21" rx="4.3" ry="5.6" fill="#C98A4B"/>`),
  vtacik: IKS(`<path d="M9 28 L2 23 L4 33Z" fill="#2BA9EE"/><path d="M34 21 L44 24.5 L34 28Z" fill="#FF9F1C"/><circle cx="22" cy="26" r="14" fill="#4FC3F7"/>
    <path d="M13 28 C17 35 26 35 29 28Z" fill="#2BA9EE"/>${dot(27, 21, 2.5)}<path d="M19 12 C18 8 22 6 24 9" fill="none" stroke-width="2.4"/>`),
  planeta: IKS(`<ellipse cx="24" cy="24" rx="21" ry="7" transform="rotate(-20 24 24)" fill="none" stroke-width="7"/><ellipse cx="24" cy="24" rx="21" ry="7" transform="rotate(-20 24 24)" fill="none" stroke="#B36BFF" stroke-width="3"/>
    <circle cx="24" cy="24" r="12" fill="#FFB86B"/><path d="M14 20 C20 22 28 22 34 19" fill="none" stroke="#FF8A3D" stroke-width="2.4"/>
    <path d="M3 24 A21 7 0 0 0 45 24" transform="rotate(-20 24 24)" fill="none" stroke-width="7"/><path d="M3 24 A21 7 0 0 0 45 24" transform="rotate(-20 24 24)" fill="none" stroke="#B36BFF" stroke-width="3"/>`),
  plus: IKS(`<circle cx="24" cy="24" r="19" fill="#2FBF71"/><path d="M24 15 V33 M15 24 H33" stroke="#fff" stroke-width="5"/>`),
  fajka: IKS(`<circle cx="24" cy="24" r="19" fill="#2FBF71"/><path d="M15 24.5 L21.5 31 L33 18" fill="none" stroke="#fff" stroke-width="5"/>`),
};
// ikony kategórií (rovnaké poradie ako KAT v temy.js)
const IK_KAT = {
  historia: IKS(`<path d="M4 18 L24 6 L44 18Z" fill="#FF8A3D"/><rect x="7" y="18" width="34" height="5" fill="#FFE3BD"/>
    <path d="M11 23 V37 M19.5 23 V37 M28.5 23 V37 M37 23 V37" stroke-width="5"/><path d="M11 23 V37 M19.5 23 V37 M28.5 23 V37 M37 23 V37" stroke="#fff" stroke-width="1.5"/><rect x="4" y="37" width="40" height="6" rx="1.5" fill="#FFE3BD"/>`),
  politika: IKS(`<path d="M17 21 V5 H31 V21" fill="#fff"/><path d="M20.5 12.5 L23.5 15.5 L28.5 9.5" fill="none" stroke="#2FBF71" stroke-width="2.6"/>
    <rect x="6" y="19" width="36" height="24" rx="3.5" fill="#4C7DFF"/><rect x="14" y="17.5" width="20" height="4" rx="2" fill="${INK}"/><rect x="15" y="28" width="18" height="8" rx="2" fill="#fff" stroke-width="2.4"/>`),
  ekonomika: IKS(`<rect x="4" y="37" width="20" height="6" rx="3" fill="#F0A800"/><rect x="6" y="31" width="20" height="6" rx="3" fill="#FFD23F"/><rect x="4" y="25" width="20" height="6" rx="3" fill="#F0A800"/>
    <circle cx="31" cy="27" r="13" fill="#FFD23F"/><circle cx="31" cy="27" r="9" fill="none" stroke-width="2"/>
    <path d="M35 22.5 C33.5 20 28 20 27.5 25 V29 C28 34 33.5 34 35 31.5 M25 25.5 H31 M25 28.5 H30.5" fill="none" stroke-width="2.4"/>`),
  zivot: IKS(DOMCEK('#FF6FA8', `<rect x="20" y="31" width="8" height="12" rx="2" fill="#B5651D"/><rect x="30" y="27" width="6" height="6" fill="#8FD3FF" stroke-width="2.4"/><rect x="12" y="27" width="6" height="6" fill="#8FD3FF" stroke-width="2.4"/>`)),
  technika: IKS(`<rect x="8" y="8" width="32" height="23" rx="3" fill="#3D4FB8"/><rect x="11.5" y="11.5" width="25" height="16" rx="1.5" fill="#8FD3FF" stroke-width="2"/>
    <path d="M18 16 L14.5 19.5 L18 23 M30 16 L33.5 19.5 L30 23 M26 15 L22 24" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M3 34 H45 L42 41 H6Z" fill="#C9CED8"/>`),
  veda: IKS(`<path d="M20 7 V18 L8 38 C6 42 8 44 12 44 H36 C40 44 42 42 40 38 L28 18 V7Z" fill="#fff"/><path d="M13.5 30 H34.5 L40 38 C42 42 40 44 36 44 H12 C8 44 6 42 8 38Z" fill="#F0A800"/>
    <rect x="17" y="3" width="14" height="5" rx="2" fill="#fff"/><circle cx="20" cy="37" r="2.5" fill="#fff" stroke-width="2"/><circle cx="27" cy="34" r="1.8" fill="#fff" stroke-width="1.8"/><circle cx="26" cy="23" r="2" fill="#fff" stroke-width="2"/>`),
  priroda: IKS(`<g><path d="M17 2 V6 M17 28 V32 M2 17 H6 M28 17 H32 M6.5 6.5 L9.3 9.3 M24.7 24.7 L27.5 27.5 M27.5 6.5 L24.7 9.3 M9.3 24.7 L6.5 27.5" stroke="#F0A800" stroke-width="3"/></g>
    <circle cx="17" cy="17" r="8.5" fill="#FFD23F"/><path d="M14 41 C8 41 6 34 11 32 C11 26 18 23 22 27 C24 21 34 21 35 28 C41 28 43 35 39 38 C39 41 36 41 34 41Z" fill="#fff"/>`),
  telo: IKS(`<path d="${SRDCE_D}" fill="#FF5A5F"/><path d="M8 24 H16 L19.5 17 L25 31 L28.5 24 H40" fill="none" stroke="#fff" stroke-width="3"/>`),
  geografia: IKS(`<path d="M4 12 L16 8 L32 12 L44 8 V36 L32 40 L16 36 L4 40Z" fill="#CFEFFF"/><path d="M7 17 C11 14 15 17 14 22 C13 27 8 27 7 23Z M20 25 C24 22 29 25 27 31 C24 34 19 31 20 25Z" fill="#4CD07D" stroke-width="2"/>
    <path d="M16 8 V36 M32 12 V40" fill="none" stroke-width="2"/><path d="M33 22 C33 16 41 16 41 22 C41 26 37 30 37 30 C37 30 33 26 33 22Z" fill="#FF5A5F" stroke-width="2.4"/><circle cx="37" cy="22" r="1.7" fill="#fff" stroke="none"/>`),
  psychologia: IKS(MOZOG),
  kultura: IKS(`<g transform="translate(14 12) rotate(12 12 12)"><path d="M0 4 C8 0 18 0 24 4 C24 16 20 24 12 24 C4 24 0 16 0 4Z" fill="#8FD3FF"/>
    <path d="M5 10 Q7 8 9 10 M15 10 Q17 8 19 10 M7.5 19 Q12 14.5 16.5 19" fill="none" stroke-width="2.2"/></g>
    <g transform="translate(3 6) rotate(-10 12 12)"><path d="M0 4 C8 0 18 0 24 4 C24 16 20 24 12 24 C4 24 0 16 0 4Z" fill="#FFD23F"/>
    <path d="M5 9.5 Q7 7.5 9 9.5 M15 9.5 Q17 7.5 19 9.5 M6.5 15 Q12 21 17.5 15" fill="none" stroke-width="2.2"/></g>`),
  anglictina: IKS(`<path d="M8 7 H40 A4 4 0 0 1 44 11 V30 A4 4 0 0 1 40 34 H22 L12 42 V34 H8 A4 4 0 0 1 4 30 V11 A4 4 0 0 1 8 7Z" fill="#FFE0EC"/>
    <path d="M10 28 L15.5 13 L21 28 M12.2 23 H18.8 M26 13 V28 H31.5 C35.5 28 35.5 20.5 31.5 20.5 H26 M26 13 H30.5 C34 13 34 20.5 30.5 20.5" fill="none" stroke="#D6336C" stroke-width="3"/>`),
  zvieratka: IK.labka,
  tvary: IKS(`<path d="M10 22 L18 6 L26 22Z" fill="#FFD23F"/><circle cx="34" cy="15" r="8" fill="#4C7DFF"/><rect x="8" y="27" width="15" height="15" rx="2.5" fill="#FF5A5F"/>
    <rect x="28" y="29" width="11" height="11" rx="2" transform="rotate(45 33.5 34.5)" fill="#2FBF71"/>`),
  domacnost: IKS(DOMCEK('#5BB85B', `<path d="M24 39 C18.5 35.5 16.5 32.5 16.5 30 C16.5 27.5 18.5 26 20.5 26 C22 26 23.2 27 24 28.5 C24.8 27 26 26 27.5 26 C29.5 26 31.5 27.5 31.5 30 C31.5 32.5 29.5 35.5 24 39Z" fill="#FF5A5F" stroke-width="2.4"/>`)),
  cas: IKS(`<circle cx="11" cy="10" r="5.5" fill="#FF5A5F"/><circle cx="37" cy="10" r="5.5" fill="#FF5A5F"/><path d="M15 39 L10 45 M33 39 L38 45"/>
    <circle cx="24" cy="26" r="16" fill="#4AA3DF"/><circle cx="24" cy="26" r="11.5" fill="#fff"/><path d="M24 26 V18.5 M24 26 L29.5 29" stroke-width="2.8"/>${dot(24, 26, 2)}`),
  bezpecne: IKS(`<path d="M24 4 L40 10 V22 C40 33 33 40 24 44 C15 40 8 33 8 22 V10Z" fill="#E0533F"/><path d="M24 14 V33 M14.5 23.5 H33.5" stroke="#fff" stroke-width="6"/>${LESK('M13 14 V20')}`),
  vesmir: IKS(`<path d="M19 33 L24 46 L29 33Z" fill="#FFD23F"/><path d="M16 25 L7 37 L16 35Z M32 25 L41 37 L32 35Z" fill="#FF5A5F"/>
    <path d="M24 3 C32 9 35 20 32 34 H16 C13 20 16 9 24 3Z" fill="#fff"/><path d="M24 3 C27 5 29 8 30.5 11.5 H17.5 C19 8 21 5 24 3Z" fill="#FF5A5F"/><circle cx="24" cy="20" r="4.6" fill="#8FD3FF"/>`),
  vynalezy: IKS(ZIAROVKA),
  planeta: IKS(`<circle cx="24" cy="24" r="19" fill="#4FC3F7"/><path d="M12 13 C17 10 22 14 20 19 C18 23 22 26 19 30 C15 31 10 26 9 21 C8 17 9 15 12 13Z M28 8 C33 8 38 12 39 17 C35 19 31 17 28 20 C26 16 25 11 28 8Z M30 27 C34 26 40 27 39 31 C37 36 33 39 30 37 C29 34 28 30 30 27Z" fill="#4CD07D" stroke-width="2.2"/>${LESK('M10 30 C12 34 15 37 19 39')}`),
  dejiny: IKS(`<path d="M18 14 C12 12 9 18 13 23 M30 14 C36 12 39 18 35 23" fill="none"/><path d="M18 5 H30 V12 C38 16 40 24 36 32 C34 37 30 40 30 43 H18 C18 40 14 37 12 32 C8 24 10 16 18 12Z" fill="#D9823B"/>
    <path d="M12.5 24 H35.5 M13.5 30 H34.5" fill="none" stroke-width="2.2"/><path d="M14 27 L17 24.5 L20 27 L23 24.5 L26 27 L29 24.5 L32 27 L34 25" fill="none" stroke="#FFE3BD" stroke-width="2"/>`),
  biologia: IKS(`<path d="M17 8 H31 M17 20 H31 M17 28 H31 M17 40 H31" stroke-width="2.4"/>
    <path d="M14 4 C14 14 34 14 34 24 C34 34 14 34 14 44" fill="none" stroke-width="7.5"/><path d="M14 4 C14 14 34 14 34 24 C34 34 14 34 14 44" fill="none" stroke="#9B4DCA" stroke-width="3.5"/>
    <path d="M34 4 C34 14 14 14 14 24 C14 34 34 34 34 44" fill="none" stroke-width="7.5"/><path d="M34 4 C34 14 14 14 14 24 C14 34 34 34 34 44" fill="none" stroke="#FF6FA8" stroke-width="3.5"/>`),
  doprava: IKS(`<rect x="9" y="9" width="6" height="10" fill="${INK}"/><rect x="20" y="6" width="23" height="5" rx="2" fill="${INK}"/><rect x="22" y="10" width="19" height="23" rx="2" fill="#2E9BD6"/>
    <rect x="5" y="18" width="19" height="15" rx="3" fill="#FF5A5F"/><rect x="27" y="14" width="9" height="8" rx="1.5" fill="#fff" stroke-width="2.4"/>
    <path d="M5 30 L2 38 H9" fill="#FFD23F" stroke-width="2.4"/><circle cx="12" cy="37" r="5" fill="${INK}"/><circle cx="24" cy="37" r="5" fill="${INK}"/><circle cx="35" cy="37" r="5" fill="${INK}"/>
    <circle cx="12" cy="37" r="1.8" fill="#fff" stroke="none"/><circle cx="24" cy="37" r="1.8" fill="#fff" stroke="none"/><circle cx="35" cy="37" r="1.8" fill="#fff" stroke="none"/>`),
  digital: IKS(`<path d="M24 5 V10"/><circle cx="24" cy="4.5" r="2.6" fill="#FF5A5F" stroke-width="2"/><rect x="4.5" y="18" width="5" height="9" rx="2" fill="#B8BCCB" stroke-width="2.4"/><rect x="38.5" y="18" width="5" height="9" rx="2" fill="#B8BCCB" stroke-width="2.4"/>
    <path d="M10 47 C10 41 15 38 24 38 C33 38 38 41 38 47" fill="#4B5BD6"/><rect x="9" y="10" width="30" height="25" rx="7" fill="#C9CED8"/><rect x="13" y="15" width="22" height="14" rx="4" fill="#3D4FB8" stroke-width="2.4"/>
    <circle cx="19" cy="22" r="2.6" fill="#8FD3FF" stroke="none"/><circle cx="29" cy="22" r="2.6" fill="#8FD3FF" stroke="none"/><path d="M21 26 Q24 28 27 26" fill="none" stroke="#8FD3FF" stroke-width="2"/>`),
};
const ik = n => IK[n] || IK.iskra;
const ikKat = k => IK_KAT[k] || IK.kniha;
// malá kreslená ikona v riadku textu (namiesto emoji)
const ii = svg => `<span class="ii">${svg}</span>`;
const IKO = {
  play: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 10.5v27a2.2 2.2 0 0 0 3.3 1.9l21-13.5a2.2 2.2 0 0 0 0-3.8l-21-13.5A2.2 2.2 0 0 0 17 10.5z"/></svg>',
  pauza: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="9" width="10" height="30" rx="3.5"/><rect x="27" y="9" width="10" height="30" rx="3.5"/></svg>',
  dalej: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 11.5v25a2.2 2.2 0 0 0 3.4 1.8l18-12.5a2.2 2.2 0 0 0 0-3.6l-18-12.5A2.2 2.2 0 0 0 8 11.5z"/><rect x="33" y="9" width="8" height="30" rx="3"/></svg>',
  znova: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="9" width="8" height="30" rx="3"/><path d="M40 11.5v25a2.2 2.2 0 0 1-3.4 1.8l-18-12.5a2.2 2.2 0 0 1 0-3.6l18-12.5a2.2 2.2 0 0 1 3.4 1.8z"/></svg>',
  zavriet: '<svg viewBox="0 0 48 48" aria-hidden="true" class="iko-x"><path d="M14 14l20 20M34 14 14 34"/></svg>',
  auto: `<svg viewBox="0 0 64 44" aria-hidden="true" class="iko-auto"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M5 30v-6.5a4 4 0 0 1 3-3.9l8-2 7-8.4A5 5 0 0 1 26.8 7.5H40a5 5 0 0 1 4 2l6.3 8.2 6 1.7a4 4 0 0 1 2.9 3.9V30a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="#FF5A5F"/>
    <path d="M22 17.5l5.6-6.5H34v6.5z" fill="#BFE6FF"/><path d="M38.5 11H40l5 6.5h-6.5z" fill="#BFE6FF"/><path d="M9 24h4" stroke="#FFD23F"/>
    <circle cx="18" cy="33" r="6.5" fill="${INK}"/><circle cx="47" cy="33" r="6.5" fill="${INK}"/>
    <circle cx="18" cy="33" r="2.2" fill="#fff" stroke="none"/><circle cx="47" cy="33" r="2.2" fill="#fff" stroke="none"/></g></svg>`,
};

IK.auto = IKO.auto;
// zámok a lupa ako obrázky do CSS (štítok zamknutej odmeny, pole hľadania)
const cssObr = svg => `url("data:image/svg+xml,${encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))}")`;
try { document.documentElement.style.setProperty('--ik-zamok', cssObr(IK.zamok)); document.documentElement.style.setProperty('--ik-lupa', cssObr(IK.lupa)); } catch (e) {}

