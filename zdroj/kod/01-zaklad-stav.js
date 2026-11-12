const VERZIA_APPKY = 66; const VERZIA_NAZOV = '4.8.2'; // číslo pre telefón a novinky; názov ukazuje profil // zvýšiť pri každom nahratí, aby bolo v profile vidno, či telefón má novú verziu
const DNI = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const DUHA = ['#FF5A5F', '#FF8A3D', '#2FBF71', '#4C7DFF', '#B36BFF', '#16BFAE', '#FF6FA8'];
const PASTEL = ['#FFE1E1', '#FFE7C7', '#FFF3B0', '#D9F8E6', '#D6E6FF', '#EBDDFF', '#FFD9EA'];
const EMBG = ['#FFF0B3', '#D6E6FF', '#FFD9EA'];
// emoji v odpovediach ako kreslené obrázky OpenMoji (e/<kód>.svg); bez signálu sa ukáže obyčajné emoji
const EMO_ODP = /(\p{RI}\p{RI}|[0-9#*]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}\uFE0F?|[\u{1F3FB}-\u{1F3FF}])*)/u;
const emoSubor = e => 'e/' + [...e].map(c => c.codePointAt(0).toString(16)).filter(x => x !== 'fe0f').join('-') + '.svg';
const emo = text => String(text).split(EMO_ODP).map((g, i) => i % 2 ? `<img class="emo" src="${emoSubor(g)}" alt="${g}" draggable="false" onerror="this.replaceWith(this.alt)">` : esc(g)).join('');
const TBG = ['#D6E6FF', '#D9F8E6', '#FFE3C7'];
const POCHVALA = ['Výborne!', 'Super!', 'Presne tak!', 'Paráda!', 'Si šikovný!', 'Bomba!'];
const tiche = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pokrok dieťaťa ukladá Cloud (modul Firebase dole) do jeho profilu; v telefóne ostávajú len nastavenia
const SYNC = ['meno', 'vek', 'body', 'done', 'fav', 'dni', 'odznaky', 'kedy', 'chyby', 'vybrate'];
/* Pozadie appky: výber v profile, pamätá sa zvlášť pre každé dieťa na tomto zariadení */
const POZADIA = [
  { id: 'nebo', n: 'Papier', fon: '#FFF6E3', b: ['rgb(255 106 77 / .2)', 'rgb(255 197 51 / .34)', 'rgb(20 184 166 / .2)', 'rgb(122 90 248 / .16)'] },
  { id: 'ruzova', n: 'Ružová', fon: '#FFE6F0', b: ['rgb(255 111 168 / .5)', 'rgb(255 180 120 / .5)', 'rgb(255 210 63 / .4)', 'rgb(190 120 255 / .4)'] },
  { id: 'luka', n: 'Lúka', fon: '#E4F8E8', b: ['rgb(47 191 113 / .45)', 'rgb(255 226 90 / .5)', 'rgb(90 200 230 / .4)', 'rgb(160 220 90 / .45)'] },
  { id: 'slnko', n: 'Slnko', fon: '#FFF4D6', b: ['rgb(255 190 60 / .55)', 'rgb(255 140 90 / .45)', 'rgb(255 111 168 / .35)', 'rgb(255 226 90 / .55)'] },
  { id: 'fialova', n: 'Fialová', fon: '#EEE8FF', b: ['rgb(124 108 255 / .5)', 'rgb(255 111 168 / .4)', 'rgb(90 160 255 / .4)', 'rgb(190 120 255 / .45)'] },
  { id: 'more', n: 'More', fon: '#DFF6F7', b: ['rgb(60 190 210 / .5)', 'rgb(90 140 255 / .4)', 'rgb(47 191 113 / .35)', 'rgb(120 220 240 / .5)'] },
];
const FARBY = [
  { id: 'mata', n: 'Mäta', c: '#DDF5EA' }, { id: 'obloha', n: 'Obloha', c: '#DCEEFF' },
  { id: 'broskyna', n: 'Broskyňa', c: '#FFE3D6' }, { id: 'citron', n: 'Citrón', c: '#FFF6C9' },
  { id: 'levandula', n: 'Levanduľa', c: '#E9E1FF' }, { id: 'ruzova', n: 'Ružová', c: '#FFE2EC' },
  { id: 'mrak', n: 'Mrak', c: '#E8EAF2' }, { id: 'vecer', n: 'Večer', c: '#DCD9F6' },
];
const STYLY = [
  { id: 'anim', n: 'Animované', svg: '<circle cx="14" cy="16" r="9" fill="#FF6FA8" opacity=".7"/><circle cx="30" cy="30" r="10" fill="#FFD23F" opacity=".8"/><path d="M8 40q6-6 12 0M30 8q4 4 8 0" fill="none" stroke="#2A2356" stroke-width="3" stroke-linecap="round"/>' },
  { id: 'farba', n: 'Jednofarebné', svg: '<rect x="8" y="8" width="28" height="28" rx="8" fill="#DCEEFF" stroke="#2A2356" stroke-width="3"/>' },
  { id: 'vzor', n: 'Jemný vzor', svg: '<path d="M9 14l4-4 4 4M30 10v8M26 14h8M12 32a3 3 0 106 0 3 3 0 10-6 0M28 34q4-6 8 0" fill="none" stroke="#2A2356" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' },
];
const Pozadie = {
  kluc: () => 'pozadie-' + (st.dietaId || ''),
  styl() { const s = S.get('pozadie-styl-' + (st.dietaId || ''), tiche ? 'vzor' : 'anim'); return STYLY.some(x => x.id === s) ? s : 'anim'; },
  farba() { const id = S.get('pozadie-farba-' + (st.dietaId || ''), 'obloha'); return FARBY.find(f => f.id === id) || FARBY[1]; },
  dnes() { const id = S.get(this.kluc(), 'nebo'); return POZADIA.find(p => p.id === id) || POZADIA[0]; },
  pouzi() {
    const p = this.dnes(), r = document.documentElement && document.documentElement.style;
    if (!r || !r.setProperty) return;
    const styl = this.styl(), noc = Rezim.tmavy();
    document.documentElement.dataset.fonStyl = noc && styl === 'farba' ? 'anim' : styl;
    if (noc) { ['--fon', '--b1', '--b2', '--b3', '--b4'].forEach(k => r.removeProperty(k)); return; } // v noci kreslí pozadie mesačný režim
    r.setProperty('--fon', styl === 'farba' ? this.farba().c : p.fon); p.b.forEach((c, i) => r.setProperty('--b' + (i + 1), c));
  },
  zvol(id) { if (!POZADIA.some(p => p.id === id)) return; S.set(this.kluc(), id); this.pouzi(); },
  zvolStyl(id) { if (!STYLY.some(x => x.id === id)) return; S.set('pozadie-styl-' + (st.dietaId || ''), id); this.pouzi(); },
  zvolFarbu(id) { if (!FARBY.some(f => f.id === id)) return; S.set('pozadie-farba-' + (st.dietaId || ''), id); this.pouzi(); },
  rad() {
    if (this.styl() === 'farba') { const a = this.farba().id; return FARBY.map(f => `<button class="poz-vol" data-pozfarba="${f.id}" aria-pressed="${f.id === a}" style="--p0:${f.c};--p1:transparent;--p2:transparent"><i></i>${f.n}</button>`).join(''); }
    const a = this.dnes().id;
    return POZADIA.map(p => `<button class="poz-vol" data-pozadie="${p.id}" aria-pressed="${p.id === a}" style="--p0:${p.fon};--p1:${p.b[0]};--p2:${p.b[1]}"><i></i>${p.n}</button>`).join('');
  },
  karta() {
    const s = this.styl();
    return `<section class="card poz-karta"><span class="lbl">Pozadie appky</span>
      <div class="poz-styly">${STYLY.map(x => `<button class="poz-vol poz-styl" data-pozstyl="${x.id}" aria-pressed="${x.id === s}"><i><svg viewBox="0 0 44 44" aria-hidden="true">${x.svg}</svg></i>${x.n}</button>`).join('')}</div>
      <div class="poz-rad">${this.rad()}</div></section>`;
  },
};
const S = {
  get(k, d) { try { const v = localStorage.getItem('svet3:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) {
    if (SYNC.includes(k)) { if (window.Cloud && !window.Cloud.ticho) window.Cloud.naplanuj(); return; }
    try { localStorage.setItem('svet3:' + k, JSON.stringify(v)); } catch (e) {}
  },
};
/* Mesačný režim: voľba je v zariadení (nie v profile dieťaťa); 'svetly' | 'mesacny' | 'auto' (podľa systému). Neplatná hodnota = svetlý. */
const Rezim = {
  MOZNE: ['svetly', 'mesacny', 'auto'],
  vyber() { const v = S.get('rezim', 'svetly'); return Rezim.MOZNE.includes(v) ? v : 'svetly'; },
  tmavy(v = Rezim.vyber()) { return v === 'mesacny' || (v === 'auto' && !!(typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches)); },
  pouzi() {
    const noc = Rezim.tmavy(), d = typeof document !== 'undefined' && document.documentElement;
    if (!d || !d.dataset) return noc;
    if (noc) d.dataset.rezim = 'mesacny'; else delete d.dataset.rezim;
    try {
      const m = document.querySelector('meta[name="theme-color"]'); if (m && m.setAttribute) m.setAttribute('content', noc ? '#18143F' : '#FFF6E3');
      const b = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]'); if (b && b.setAttribute) b.setAttribute('content', noc ? 'black-translucent' : 'default');
    } catch (e) {}
    return noc;
  },
  zvol(v) { if (!Rezim.MOZNE.includes(v)) v = 'svetly'; S.set('rezim', v); Rezim.pouzi(); Pozadie.pouzi(); return v; },
  ikona: v => v === 'mesacny'
    ? '<svg viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" fill="#1E1A4A"/><path d="M27 7C16 8 9 17 9 26c0 9 7 16 17 16 5 0 9-2 12-5-12 2-21-6-21-17 0-6 3-11 10-13z" fill="#FFE27A" stroke="#FFF3B0" stroke-width="2.5" stroke-linejoin="round"/><circle cx="34" cy="10" r="2" fill="#FFF3B0"/><circle cx="38" cy="22" r="1.5" fill="#BFE3FF"/></svg>'
    : v === 'auto'
      ? '<svg viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" fill="#E3F4FF"/><path d="M22 0h22v44H22z" fill="#1E1A4A"/><circle cx="12" cy="22" r="6" fill="#FFD23F" stroke="#2A2356" stroke-width="2.5"/><path d="M34 12c-5 1-8 5-8 10s3 9 8 10c-3-3-4-6-4-10s1-7 4-10z" fill="#FFE27A" stroke="#FFF3B0" stroke-width="1.5"/></svg>'
      : '<svg viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" fill="#E3F4FF"/><circle cx="22" cy="22" r="8" fill="#FFD23F" stroke="#2A2356" stroke-width="3"/><path d="M22 6v5M22 33v5M6 22h5M33 22h5M11 11l3.5 3.5M29.5 29.5L33 33M11 33l3.5-3.5M29.5 14.5L33 11" stroke="#2A2356" stroke-width="3" stroke-linecap="round"/></svg>',
  karta() {
    const a = Rezim.vyber(), n = { svetly: 'Svetlý', mesacny: 'Mesačný', auto: 'Podľa telefónu' };
    return `<section class="card rez-karta"><span class="lbl">Mesačný režim</span>
      <p class="muted">Tmavá obloha s mesiacom a hviezdičkami. Príjemná večer a v tme.</p>
      <div class="rez-vol">${Rezim.MOZNE.map(v => `<button class="poz-vol poz-styl" data-rezim="${v}" aria-pressed="${v === a}"><i>${Rezim.ikona(v)}</i>${n[v]}</button>`).join('')}</div></section>`;
  },
};
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (Rezim.vyber() === 'auto') { Rezim.pouzi(); Pozadie.pouzi(); } }); } catch (e) {}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

