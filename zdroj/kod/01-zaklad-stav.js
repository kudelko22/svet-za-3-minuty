const VERZIA_APPKY = 67; const VERZIA_NAZOV = '5.0'; // číslo pre telefón a novinky; názov ukazuje profil // zvýšiť pri každom nahratí, aby bolo v profile vidno, či telefón má novú verziu
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
/* 5.0: pozadie appky je vždy papier atlasu (bez výberu a bez pohybu). Staré uložené voľby (pozadie-*, pozadie-styl-*, pozadie-farba-*)
   sa ticho ignorujú, kľúče ostávajú nedotknuté. */
const Pozadie = {
  pouzi() {
    const d = typeof document !== 'undefined' && document.documentElement;
    if (!d || !d.style || !d.style.removeProperty) return;
    d.dataset.fonStyl = 'papier'; ['--fon', '--b1', '--b2', '--b3', '--b4'].forEach(k => d.style.removeProperty(k));
  },
  karta: () => '',
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
  // 5.0: v nastaveniach je len prepínač zapnúť a vypnúť; stará voľba 'auto' ďalej funguje, kým ju niekto neprepne
  karta() {
    const on = Rezim.tmavy();
    return `<section class="card rez-karta"><span class="rez-ik ikb" style="--c:var(--violet-l)">${ikn(on ? 'mesiac' : 'slnko')}</span>
      <div class="rez-t"><h2 class="n2">Mesačný režim</h2><p class="tx rez-p">Nočná obloha s mesiacom. Príjemná večer a v tme.</p></div>
      <button class="rez-sw" role="switch" aria-checked="${on}" aria-label="Mesačný režim" data-rezim="${on ? 'svetly' : 'mesacny'}"><i></i></button></section>`;
  },
};
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (Rezim.vyber() === 'auto') { Rezim.pouzi(); Pozadie.pouzi(); } }); } catch (e) {}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

