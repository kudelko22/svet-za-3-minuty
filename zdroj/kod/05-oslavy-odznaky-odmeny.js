/* Odznaky za úspechy: väčšinu vidno z pokroku, „Bez chyby“ a „Blesk“ sa zapíšu po kvíze */
const bezSpojovnika = s => s.replace(/­/g, '');
const ODZNAKY = [
  { g: 'Témy', id: 'prva', e: '🌱', n: 'Prvý krok', p: 'Preber prvú tému', ok: x => x.temy >= 1 },
  { g: 'Témy', id: 'temy3', e: '📗', n: 'Zvedavec', p: 'Preber 3 témy', ok: x => x.temy >= 3 },
  { g: 'Témy', id: 'temy5', e: '🚀', n: 'Objaviteľ', p: 'Preber 5 tém', ok: x => x.temy >= 5 },
  { g: 'Témy', id: 'temy10', e: '🧭', n: 'Cestovateľ', p: 'Preber 10 tém', ok: x => x.temy >= 10 },
  { g: 'Témy', id: 'temy15', e: '🗺️', n: 'Prieskumník', p: 'Preber 15 tém', ok: x => x.temy >= 15 },
  { g: 'Témy', id: 'temy20', e: '🎓', n: 'Múdra hlava', p: 'Preber 20 tém', ok: x => x.temy >= 20 },
  { g: 'Témy', id: 'temy30', e: '🏆', n: 'Učenec', p: 'Preber 30 tém', ok: x => x.temy >= 30 },
  { g: 'Témy', id: 'temy40', e: '🦉', n: 'Múdra sova', p: 'Preber 40 tém', ok: x => x.temy >= 40 },
  { g: 'Témy', id: 'vsetky', e: '👑', n: 'Kráľ vedomostí', p: 'Preber všetky témy', ok: x => x.temy >= TV().length },
  { g: 'Témy', id: 'kat3', e: '🎨', n: 'Všestranný', p: 'Preber témy z 3 rôznych kategórií', ok: x => x.kat >= 3 },
  { g: 'Témy', id: 'katvsetky', e: '🌍', n: 'Svetobežník', p: 'Preber tému z každej kategórie', ok: x => x.kat >= kats().length },
  { g: 'Témy', id: 'bezchyby', e: '🎯', n: 'Bez chyby', p: 'Odpovedz v téme všetko správne', ok: x => x.udalost === 'bezchyby' },
  { g: 'Témy', id: 'blesk', e: '⚡', n: 'Blesk', p: 'Rýchly kvíz 5 z 5', ok: x => x.udalost === 'blesk' },
  { g: 'Témy', id: 'tazky', e: '💎', n: 'Diamantová hlava', p: 'Ťažký kvíz 8 z 8', ok: x => x.udalost === 'tazky' },
  { g: 'Témy', id: 'vyzva', e: '🥇', n: 'Šampión výzvy', p: 'Výzva 10 z 10', ok: x => x.udalost === 'vyzva' },
  { g: 'Témy', id: 'auto', e: '🚗', n: 'Prvá jazda', p: 'Prejdi tému v režime do auta', ok: x => x.udalost === 'auto' },
  { g: 'Dni a séria', id: 'seria2', e: '✨', n: 'Znova tu', p: 'Uč sa 2 dni po sebe', ok: x => x.seria >= 2 },
  { g: 'Dni a séria', id: 'seria3', e: '🔥', n: 'Tri dni', p: 'Uč sa 3 dni po sebe', ok: x => x.seria >= 3 },
  { g: 'Dni a séria', id: 'seria5', e: '🌈', n: 'Päť dní', p: 'Uč sa 5 dní po sebe', ok: x => x.seria >= 5 },
  { g: 'Dni a séria', id: 'seria7', e: '☄️', n: 'Celý týždeň', p: 'Uč sa 7 dní po sebe', ok: x => x.seria >= 7 },
  { g: 'Dni a séria', id: 'seria14', e: '🚂', n: 'Dva týždne', p: 'Uč sa 14 dní po sebe', ok: x => x.seria >= 14 },
  { g: 'Dni a séria', id: 'seria30', e: '🌋', n: 'Celý mesiac', p: 'Uč sa 30 dní po sebe', ok: x => x.seria >= 30 },
  { g: 'Dni a séria', id: 'dni10', e: '📅', n: 'Desať dní', p: 'Uč sa spolu 10 dní', ok: x => x.dni >= 10 },
  { g: 'Dni a séria', id: 'dni30', e: '🗓️', n: 'Verný kamarát', p: 'Uč sa spolu 30 dní', ok: x => x.dni >= 30 },
  { g: 'Dni a séria', id: 'rano', e: '🐦', n: 'Ranné vtáča', p: 'Preber tému pred ôsmou ráno', ok: x => x.uci && x.hodina < 8 },
  { g: 'Dni a séria', id: 'vecer', e: '🌙', n: 'Nočná sova', p: 'Preber tému po ôsmej večer', ok: x => x.uci && x.hodina >= 20 },
  { g: 'Dni a séria', id: 'vikend', e: '🎈', n: 'Víkendový objaviteľ', p: 'Preber tému cez víkend', ok: x => x.uci && x.vikend },
  { g: 'Body', id: 'body50', e: '🔸', n: 'Prvé body', p: 'Získaj 50 bodov', ok: x => x.body >= 50 },
  { g: 'Body', id: 'body100', e: '⭐', n: 'Hviezdička', p: 'Získaj 100 bodov', ok: x => x.body >= 100 },
  { g: 'Body', id: 'body250', e: '🍀', n: 'Štvorlístok', p: 'Získaj 250 bodov', ok: x => x.body >= 250 },
  { g: 'Body', id: 'body500', e: '🌟', n: 'Superhviezda', p: 'Získaj 500 bodov', ok: x => x.body >= 500 },
  { g: 'Body', id: 'body1000', e: '💫', n: 'Galaxia', p: 'Získaj 1000 bodov', ok: x => x.body >= 1000 },
  { g: 'Body', id: 'body1500', e: '🪐', n: 'Planéta', p: 'Získaj 1500 bodov', ok: x => x.body >= 1500 },
  { g: 'Body', id: 'body2000', e: '🌌', n: 'Vesmír', p: 'Získaj 2000 bodov', ok: x => x.body >= 2000 },
  { g: 'Hry', id: 'hra1', e: '🎮', n: 'Hráč', p: 'Dohraj prvú hru', ok: x => x.hier >= 1 },
  { g: 'Hry', id: 'hry10', e: '🎲', n: 'Hravý', p: 'Dohraj 10 hier', ok: x => x.hier >= 10 },
  { g: 'Hry', id: 'hry50', e: '🕹️', n: 'Herný maratón', p: 'Dohraj 50 hier', ok: x => x.hier >= 50 },
  { g: 'Hry', id: 'hryvsetky', e: '🎪', n: 'Majster hier', p: 'Zahraj si všetky hry', ok: x => x.hrane >= HRY_VID().length },
  { g: 'Hry', id: 'pexeso', e: '🃏', n: 'Pexesár', p: 'Nájdi v pexese všetky dvojice', ok: x => x.hra === 'pexeso' },
  { g: 'Hry', id: 'pexeso-genius', e: '🧠', n: 'Pamäťový génius', p: 'Pexeso len s pár chybami', ok: x => x.hra === 'pexeso' && x.hodnota <= x.pary + 4 },
  { g: 'Hry', id: 'hadaj6', e: '👀', n: 'Bystré oko', p: 'Hádaj tému aspoň 6 z 8', ok: x => x.hra === 'hadaj' && x.hodnota >= 6 },
  { g: 'Hry', id: 'hadaj8', e: '🔍', n: 'Detektív', p: 'Hádaj tému 8 z 8', ok: x => x.hra === 'hadaj' && x.hodnota >= 8 },
  { g: 'Hry', id: 'hviezdy20', e: '🌠', n: 'Lovec hviezd', p: 'Chyť 20 hviezd', ok: x => x.hra === 'hviezdy' && x.hodnota >= 20 },
  { g: 'Hry', id: 'hviezdy35', e: '🏅', n: 'Hviezdny šampión', p: 'Chyť 35 hviezd', ok: x => x.hra === 'hviezdy' && x.hodnota >= 35 },
  { g: 'Hry', id: 'bubliny10', e: '🔢', n: 'Počtár', p: 'Vypočítaj 10 príkladov v bublinách', ok: x => x.hra === 'bubliny' && x.hodnota >= 10 },
  { g: 'Hry', id: 'bubliny20', e: '🧮', n: 'Matematik', p: 'Vypočítaj 20 príkladov v bublinách', ok: x => x.hra === 'bubliny' && x.hodnota >= 20 },
  { g: 'Hry', id: 'skladacka', e: '🧩', n: 'Skladačkár', p: 'Poskladaj obrázok', ok: x => x.hra === 'skladacka' },
  { g: 'Hry', id: 'skladacka-rychlo', e: '⏱️', n: 'Rýchle prsty', p: 'Poskladaj obrázok bez zbytočných ťahov', ok: x => x.hra === 'skladacka' && x.hodnota <= x.dieliky },
  { g: 'Hry', id: 'opakuj5', e: '🎵', n: 'Dobrá pamäť', p: 'Zopakuj 5 farieb po sebe', ok: x => x.hra === 'opakuj' && x.hodnota >= 5 },
  { g: 'Hry', id: 'sova10', e: '🦉', n: 'Malý letec', p: 'Získaj 10 bodov v hre Lietajúca sova', ok: x => x.hra === 'sova' && x.hodnota >= 10 },
  { g: 'Hry', id: 'sova30', e: '🦅', n: 'Pilot oblohy', p: 'Získaj 30 bodov v hre Lietajúca sova', ok: x => x.hra === 'sova' && x.hodnota >= 30 },
  { g: 'Hry', id: 'opakuj10', e: '🐘', n: 'Pamäť ako slon', p: 'Zopakuj 10 farieb po sebe', ok: x => x.hra === 'opakuj' && x.hodnota >= 10 },
  { g: 'Rôzne', id: 'fav1', e: '💌', n: 'Prvé srdiečko', p: 'Ulož si obľúbenú tému', ok: x => x.fav >= 1 },
  { g: 'Rôzne', id: 'zberatel', e: '💖', n: 'Zberateľ', p: 'Ulož si 3 obľúbené témy', ok: x => x.fav >= 3 },
  { g: 'Rôzne', id: 'fav10', e: '💝', n: 'Zbierka sŕdc', p: 'Ulož si 10 obľúbených tém', ok: x => x.fav >= 10 },
  { g: 'Rôzne', id: 'stylista', e: '👗', n: 'Módny návrhár', p: 'Obleč postavičke odomknutú vec', ok: x => Object.entries(x.avatar).some(([k, v]) => cenaDielu(k, v) > 0) },
  { g: 'Rôzne', id: 'zvieratko', e: '🐾', n: 'Najlepší kamarát', p: 'Daj postavičke zvieratko', ok: x => !!x.avatar.zvieratko && x.avatar.zvieratko !== 'ziadne' },
  { g: 'Body', id: 'body5000', e: '🐲', n: 'Legenda', p: 'Získaj 5000 bodov', ok: x => x.body >= 5000 },
  { g: 'Misie', id: 'misia1', n: 'Prvá misia', p: 'Splň prvú misiu v téme dňa', ok: x => x.mis.n >= 1 },
  { g: 'Misie', id: 'misia5', n: 'Pátrač', p: 'Splň 5 misií', ok: x => x.mis.n >= 5 },
  { g: 'Misie', id: 'misia15', n: 'Majster misií', p: 'Splň 15 misií', ok: x => x.mis.n >= 15 },
  { g: 'Misie', id: 'misia30', n: 'Legenda misií', p: 'Splň 30 misií', ok: x => x.mis.n >= 30 },
  { g: 'Misie', id: 'misiaTypy', n: 'Všestranný mysliteľ', p: 'Splň misiu z každého z 5 typov', ok: x => x.mis.typy >= 5 },
  { g: 'Misie', id: 'vyzva1', n: 'Objaviteľ sveta', p: 'Splň výzvu skutočného sveta', ok: x => x.mis.vyzvy >= 1 },
  { g: 'Angličtina', id: 'ang1', e: '🔤', n: 'Prvý kvízik', p: 'Dokonči denný kvízik z angličtiny', ok: x => x.ang.n >= 1 },
  { g: 'Angličtina', id: 'ang7', e: '🇬🇧', n: 'Angličtinár', p: 'Dokonči 7 kvízikov z angličtiny', ok: x => x.ang.n >= 7 },
  { g: 'Angličtina', id: 'ang20', e: '🎓', n: 'Slovná zásoba', p: 'Dokonči 20 kvízikov z angličtiny', ok: x => x.ang.n >= 20 },
  { g: 'Angličtina', id: 'ang50', e: '🗣️', n: 'Hovorím po anglicky', p: 'Dokonči 50 kvízikov z angličtiny', ok: x => x.ang.n >= 50 },
  { g: 'Angličtina', id: 'angBezChyby', e: '🎯', n: 'Bez chyby po anglicky', p: 'Dokonči kvízik z angličtiny bez chyby', ok: x => x.ang.bezChyby >= 1 },
  { g: 'Rôzne', id: 'myticke', e: '🦄', n: 'Mýtický hrdina', p: 'Obleč postavičke mýtickú vec', ok: x => Object.entries(x.avatar).some(([k, v]) => cenaDielu(k, v) >= 1600) },
  ...Object.entries(KAT).map(([k, c]) => ({
    g: 'Majster kategórie', id: 'kat-' + k, vek: c.vek, e: c.e, n: 'Majster: ' + bezSpojovnika(c.nazov),
    p: 'Preber všetky témy: ' + bezSpojovnika(c.nazov).toLowerCase(), ok: x => T.filter(t => t.k === k && preVek(t)).every(t => x.done.includes(t.id)),
  })),
];
// kreslená ikona odznaku; odznak za kategóriu má ikonu kategórie, odznaky za hry obrázok hry
const IK_ODZNAKU = { prva: 'klicok', temy3: 'kniha', temy5: 'kat:vesmir', temy10: 'lupa', temy15: 'kat:geografia', temy20: 'ciapka', temy30: 'pohar', temy40: 'sova', vsetky: 'koruna',
  kat3: 'kat:tvary', katvsetky: 'kat:planeta', bezchyby: 'terc', blesk: 'blesk', tazky: 'diamant', vyzva: 'medaila', auto: 'auto',
  seria2: 'iskra', seria3: 'ohen', seria5: 'duha', seria7: 'kometa', seria14: 'kat:doprava', seria30: 'ohen', dni10: 'kalendar', dni30: 'kalendar', rano: 'vtacik', vecer: 'mesiac', vikend: 'balon',
  body50: 'hviezda', body100: 'hviezda', body250: 'iskra', body500: 'hviezda', body1000: 'kometa', body1500: 'planeta', body2000: 'planeta', body5000: 'drak',
  hra1: 'gamepad', hry10: 'kocka', hry50: 'gamepad', hryvsetky: 'konfety', pexeso: 'hra:pexeso', 'pexeso-genius': 'mozog', hadaj6: 'oko', hadaj8: 'hra:hadaj',
  hviezdy20: 'hra:hviezdy', hviezdy35: 'kometa', bubliny10: 'hra:bubliny', bubliny20: 'pohar', skladacka: 'hra:skladacka', 'skladacka-rychlo': 'stopky', opakuj5: 'nota', opakuj10: 'hra:opakuj',
  sova10: 'hra:sova', sova30: 'sova', fav1: 'obalka', zberatel: 'srdce', fav10: 'srdce', stylista: 'saty', zvieratko: 'labka', myticke: 'jednorozec', misia1: 'lupa', ang1: 'kat:anglictina', ang7: 'kat:anglictina', ang20: 'ciapka', ang50: 'koruna', angBezChyby: 'terc', misia5: 'oko', misia15: 'ziarovka', misia30: 'koruna', misiaTypy: 'mozog', vyzva1: 'vlajka' };
const ikOdznaku = o => { const v = o.id.startsWith('kat-') ? 'kat:' + o.id.slice(4) : IK_ODZNAKU[o.id] || 'medaila';
  return v.startsWith('kat:') ? ikKat(v.slice(4)) : v.startsWith('hra:') ? OBR_HRY[v.slice(4)] : ik(v); };
function najdlhsiaSeria(dniList) {
  const d = [...new Set(dniList)].sort();
  let naj = 0, teraz = 0, pred = null;
  for (const k of d) {
    const t = new Date(k + 'T12:00:00');
    teraz = pred && Math.round((t - pred) / 864e5) === 1 ? teraz + 1 : 1;
    naj = Math.max(naj, teraz); pred = t;
  }
  return naj;
}
// odznaky, ktoré dieťa práve získalo; hneď sa mu zapíšu (a cez Cloud uložia)
function noveOdznaky(udalost = '', navyse = {}) {
  if (!st.dietaId) return [];
  const teraz = new Date(), prebrate = st.done.filter(id => { const t = byId(id); return t && t.k !== 'anglictina' && preVek(t); });
  const x = { temy: prebrate.length, seria: najdlhsiaSeria(st.dni), dni: st.dni.length, body: st.body, fav: st.fav.length, done: st.done, udalost,
    kat: new Set(prebrate.map(id => byId(id).k)).size, hodina: teraz.getHours(), vikend: [0, 6].includes(teraz.getDay()), avatar: st.avatar || {},
    hier: S.get('hry-pocet-' + st.dietaId, 0), mis: Misie.sucet(), ang: Ang.sucet(), hrane: HRY_VID().filter(h => S.get(rekordKluc(h.id), null) != null).length, ...navyse };
  const nove = ODZNAKY.filter(o => !st.odznaky.includes(o.id) && o.ok(x));
  if (nove.length) { st.odznaky = [...st.odznaky, ...nove.map(o => o.id)]; S.set('odznaky', st.odznaky); }
  return nove;
}
function oznamOdznaky(nove) { oslavaOdznaku(nove); }
/* Odmeny za body: diely postavičky */
const noveOdmeny = (pred, po) => ODMENY.filter(o => o.cena > pred && o.cena <= po);
const dalsiaOdmena = () => ODMENY.find(o => o.cena > st.body);
function kartaDalsiaOdmena() {
  const o = dalsiaOdmena();
  if (!o) return `<section class="card dalsia"><span class="kruh-av mini-av" style="--bg:${st.avatar.pozadie}">${postavicka(st.avatar)}</span>
      <div><b>Všetko odomknuté! ${ii(IK.konfety)}</b><small>Máš všetky odmeny pre postavičku.</small></div></section>`;
  const pred = ODMENY.filter(x => x.cena <= st.body).pop(), od = pred ? pred.cena : 0;
  const pct = Math.max(4, Math.round((st.body - od) / (o.cena - od) * 100));
  return `<section class="card dalsia"><span class="kruh-av mini-av" style="--bg:${st.avatar.pozadie}">${postavicka({ ...st.avatar, [o.k]: o.v })}</span>
      <div><small class="lbl-mala">Ďalšia odmena</small><b>Ešte ${o.cena - st.body} ${ikn('hviezda')} a máš ${NAZVY_ODMIEN[o.kluc]}!</b>
      <div class="bar" style="--c:var(--sun)"><i style="width:${pct}%"></i></div></div></section>`;
}
function odmenyHtml(f) {
  const o = f.noveOdznaky || [], r = f.noveOdmeny || [], h = f.noveHry || [];
  if (!o.length && !r.length && !h.length) return '';
  return `<div class="nove-odmeny">
      ${o.map((x, i) => `<div class="odmena-karta" style="--d:${1.9 + i * .25}s"><span class="odm-pec">${peciatka(x, 'ma')}</span><div><b>Nový odznak!</b><span>${esc(x.n)}</span></div></div>`).join('')}
      ${r.map((x, i) => `<div class="odmena-karta" style="--d:${1.9 + (o.length + i) * .25}s"><span class="kruh-av mini-av" style="--bg:${st.avatar.pozadie}">${postavicka({ ...st.avatar, [x.k]: x.v })}</span><div><b>Odomknuté!</b><span>Máš ${NAZVY_ODMIEN[x.kluc]} pre postavičku</span></div></div>`).join('')}
      ${h.map((x, i) => `<div class="odmena-karta" style="--d:${1.9 + (o.length + r.length + i) * .25}s"><span class="hra-mini" style="--c:${x.c}">${OBR_HRY[x.id]}</span><div><b>Nová hra!</b><span>${esc(x.n)}</span></div></div>`).join('')}
      ${r.length ? `<button class="btn wide" data-upravit="${r[0].k}">${ikn('hviezda')} Obliecť postavičku</button>` : ''}
      ${h.length ? `<button class="btn wide mud" data-hra="${h[0].id}">Hrať: ${esc(h[0].n)}</button>` : ''}</div>`;
}
// za každý získaný odznak si dieťa ťuknutím vyzdvihne 2 hviezdičky (body); dve hviezdy priletia do hlavičky
function vyberOdznak(id, el) {
  if (!st.odznaky.includes(id) || st.vybrate.includes(id)) return;
  st.vybrate = [...st.vybrate, id]; S.set('vybrate', st.vybrate);
  st.body += 2; S.set('body', st.body);
  el.classList.remove('na-vyber', 'cerstva'); el.classList.add('ma'); el.removeAttribute('data-vyber');
  const p = el.querySelector('.plus2'); if (p) p.remove();
  const zost = odznakyVek().filter(o => st.odznaky.includes(o.id) && !st.vybrate.includes(o.id)).length, tip = document.querySelector('.vyber-tip');
  document.getElementById('nav-ja').classList.toggle('novinka', zost > 0);
  if (tip) { if (zost) tip.innerHTML = `${ikn('hviezda')}<span>Ťukni na čerstvú pečiatku a vyzdvihni si ${zost * 2} ${zost * 2 < 5 ? 'hviezdičky' : 'hviezdičiek'}.</span>`; else tip.remove(); }
  const [x, y] = stred(el), ciel = document.getElementById('star-ico'), [cx, cy] = ciel ? stred(ciel) : [innerWidth - 40, 30];
  el.classList.add('prevzaty'); Zvuk.play('cink'); vibruj([20, 40, 20]);
  malaOslava(x, y, 2, i => {
    if (i) { const nove = noveOdznaky(); oznamOdznaky(nove); if (nove.length && st.view === 'odznaky') setTimeout(render, 1500); }
  });
}
/* Malá oslava: hviezdičky priletia po bodkovanej dráhe do počítadla v hlavičke a číslo sa pretočí. Trvá do sekundy a nič nezakryje.
   Volať po pripočítaní: malaOslava(x, y, n, hotovo) (x, y = odkiaľ letia; n = koľko pribudlo; hotovo(i) po každej hviezdičke). */
function malaOslava(x, y, n = 2, hotovo = () => {}) {
  const ciel = document.getElementById('star-ico'), [cx, cy] = ciel ? stred(ciel) : [innerWidth - 40, 30], k = Math.min(n, 3);
  const t = document.createElement('span'); t.className = 'cena mala-plus'; t.innerHTML = `${ikn('hviezda')}+${n}`;
  t.style.left = x + 'px'; t.style.top = y + 'px'; document.body.appendChild(t); setTimeout(() => t.remove(), 1100);
  for (let i = 0; i < k; i++) setTimeout(() => letHviezdu(x, y, cx, cy, i, () => {
    Zvuk.play(i ? 'dopad2' : 'dopad1');
    const b = document.getElementById('body'), s = document.getElementById('stars');
    if (b) { b.textContent = st.body - (k - 1 - i) * Math.floor(n / k); b.classList.remove('roll'); void b.offsetWidth; b.classList.add('roll'); }
    if (s) { s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
    hotovo(i);
  }), 150 + i * 200);
}
// hviezdička letí po oblúku do hlavičky a nechá za sebou bodkovanú stopu
function letHviezdu(x, y, cx, cy, i, hotovo) {
  const h = document.createElement('span'); h.className = 'leti'; h.innerHTML = ikn('hviezda');
  h.style.left = x + 'px'; h.style.top = y + 'px'; document.body.appendChild(h);
  if (!h.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { h.remove(); hotovo(); return; }
  const dx = cx - x, dy = cy - y, bok = i ? -50 : 50;
  const a = h.animate([
    { transform: 'translate(0, 0) scale(.4)', opacity: 0 },
    { transform: `translate(${bok}px, -60px) scale(1.4) rotate(90deg)`, opacity: 1, offset: .3 },
    { transform: `translate(${dx}px, ${dy}px) scale(.6) rotate(240deg)`, opacity: 1 },
  ], { duration: 750, easing: 'cubic-bezier(.45, 0, .55, 1)' });
  const stopa = setInterval(() => { const q = h.getBoundingClientRect(), d = document.createElement('i'); d.className = 'stopa'; d.style.left = q.left + q.width / 2 + 'px'; d.style.top = q.top + q.height / 2 + 'px'; document.body.appendChild(d); setTimeout(() => d.remove(), 600); }, 70);
  a.onfinish = () => { clearInterval(stopa); h.remove(); hotovo(); };
}
// odznaky pre vek dieťaťa (Majster kategórie len pre jeho kategórie)
const odznakyVek = () => ODZNAKY.filter(o => !o.vek || o.vek === st.vek);
// odznaky v profile len ako jedna karta; celá zbierka sa otvorí ťuknutím
const nevybrate = () => st.dietaId ? odznakyVek().filter(o => st.odznaky.includes(o.id) && !st.vybrate.includes(o.id)).length : 0;
/* ===== 5.0: odznaky ako pečiatky do Pasu objaviteľa =====
   Každá skupina má vlastný tvar a farbu atramentu (témy okrúhle a osemhranné, séria štít, hry šesťuholník, body ozubené koliesko).
   Pečiatka je jednofarebná a mierne nakrivo, text ide po obvode. Nezískaná je sivá prerušovaná so zámkom, čerstvá má žltý krúžok a „+2“. */
const PEC_SKUP = {
  'Témy': { tv: ['kruh', 'osem'], f: ['leaf', 'sky', 'coral', 'violet'], ik: 'temy' },
  'Dni a séria': { tv: ['stit'], f: ['coral'], ik: 'kalendar' },
  'Body': { tv: ['zubky'], f: ['sun'], ik: 'hviezda' },
  'Hry': { tv: ['sest'], f: ['teal'], ik: 'hry' },
  'Misie': { tv: ['osem'], f: ['sky'], ik: 'lupa' },
  'Angličtina': { tv: ['kruh'], f: ['violet'], ik: 'bublina' },
  'Rôzne': { tv: ['kruh'], f: ['coral'], ik: 'srdce' },
  'Majster kategórie': { tv: ['zubky'], f: ['leaf'], ik: 'koruna' },
};
const PEC_IK = { prva: 'klicok', temy3: 'lupa', temy5: 'raketa', temy10: 'kompas', temy15: 'mapa', temy20: 'ciapka', temy30: 'pohar', temy40: 'hviezda', vsetky: 'koruna',
  kat3: 'karty', katvsetky: 'mapa', bezchyby: 'terc', blesk: 'blesk', tazky: 'stit', vyzva: 'pohar', auto: 'auto', rano: 'slnko', vecer: 'mesiac', vikend: 'darcek',
  hra1: 'hry', hry10: 'kocka', hry50: 'hry', hryvsetky: 'pohar', pexeso: 'karty', 'pexeso-genius': 'ciapka', hadaj6: 'oko', hadaj8: 'lupa', skladacka: 'karty', 'skladacka-rychlo': 'blesk',
  opakuj5: 'zvuk', opakuj10: 'zvuk', sova10: 'raketa', sova30: 'raketa', fav1: 'obalka', zberatel: 'srdce', fav10: 'srdce', stylista: 'ceruzka', zvieratko: 'srdce', myticke: 'koruna',
  misia1: 'lupa', misia5: 'oko', misia15: 'terc', misia30: 'koruna', misiaTypy: 'karty', vyzva1: 'mapa', ang1: 'bublina', ang7: 'bublina', ang20: 'ciapka', ang50: 'koruna', angBezChyby: 'terc' };
const pecHash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);
const pecVelke = s => s.toLocaleUpperCase('sk');
// tvar, farba, ikona alebo číslo v strede, texty po obvode
function pecInfo(o) {
  const sk = PEC_SKUP[o.g] || PEC_SKUP['Rôzne'], zoz = ODZNAKY.filter(x => x.g === o.g), i = Math.max(0, zoz.indexOf(o));
  const cislo = (o.p.match(/\d+/) || [])[0], seria = /^seria\d/.test(o.id), spolu = /^dni\d/.test(o.id), body = o.g === 'Body';
  const dole = seria ? 'SÉRIA' : spolu ? 'SPOLU' : cislo ? pecVelke(o.p.slice(o.p.indexOf(cislo)).split(' ').slice(0, 2).join(' ')) : pecVelke(o.g === 'Majster kategórie' ? 'majster' : o.g);
  return { tv: sk.tv[i % sk.tv.length], f: sk.f[i % sk.f.length], ik: o.id.startsWith('kat-') ? 'koruna' : PEC_IK[o.id] || sk.ik,
    cislo: seria || spolu || body ? cislo : '', hore: pecVelke(seria ? 'dni po sebe' : spolu ? 'dni učenia' : o.n.replace(/^Majster: /, '')), dole, rot: pecHash(o.id) % 13 - 6 };
}
// jednofarebná ikona: plochy dostanú len jemný nádych atramentu
const ikPec = n => (IKN[n] || IKN.hviezda).replace(/fill="([^"]*)"/g, (m, v) => v === 'none' ? m : 'fill="currentColor" fill-opacity=".2"').replace(/stroke="#fff"/g, 'stroke="currentColor"');
let pecUid = 0;
// stav: 'nie' (nezískaná), 'ma' (získaná), 'cerstva' (získaná, 2 hviezdičky čakajú na vyzdvihnutie)
function peciatka(o, stav = 'ma') {
  const x = pecInfo(o), nie = stav === 'nie', id = 'pc' + (++pecUid), tv = x.tv;
  const zub = n => { let p = ''; for (let i = 0; i < n * 2; i++) { const r = i % 2 ? 49 : 54, a = i * Math.PI / n; p += (i ? 'L' : 'M') + (60 + r * Math.cos(a)).toFixed(1) + ' ' + (60 + r * Math.sin(a)).toFixed(1); } return p + 'Z'; };
  const roh = (n, r = 54) => { let p = ''; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n - Math.PI / 2 + Math.PI / n; p += (i ? 'L' : 'M') + (60 + r * Math.cos(a)).toFixed(1) + ' ' + (60 + r * Math.sin(a)).toFixed(1); } return p + 'Z'; };
  const cr = nie ? 'stroke-dasharray="5 7"' : '';
  const OBR = {
    kruh: `<circle cx="60" cy="60" r="52" stroke-width="5" stroke-dasharray="${nie ? '5 7' : '96 3 60 2 120 4'}"/><circle cx="60" cy="60" r="43.5" stroke-width="2" stroke-dasharray=".1 5.5"/>`,
    zubky: `<path d="${zub(18)}" stroke-width="4" ${cr}/><circle cx="60" cy="60" r="43" stroke-width="2"/>`,
    osem: `<path d="${roh(8)}" stroke-width="5" stroke-dasharray="${nie ? '5 7' : '110 3 70 2'}"/><circle cx="60" cy="60" r="43" stroke-width="2" stroke-dasharray=".1 5.5"/>`,
    sest: `<path d="${roh(6)}" stroke-width="5" stroke-dasharray="${nie ? '5 7' : '130 3 90 2'}"/><path d="${roh(6, 43)}" stroke-width="2"/>`,
    stit: `<path d="M60 6L106 20V60C106 88 86 106 60 115C34 106 14 88 14 60V20Z" stroke-width="5" stroke-dasharray="${nie ? '5 7' : '140 3 80 2'}"/><path d="M60 16L97 27V60C97 82 81 97 60 105C39 97 23 82 23 60V27Z" stroke-width="2" stroke-dasharray=".1 5.5"/>`,
  };
  const oblu = tv !== 'stit' && tv !== 'sest', T = 'font-family="Grandstander, sans-serif" font-weight="800" fill="currentColor" stroke="none"';
  const fs = (s, max, dl) => Math.min(max, +(dl / (s.length * .72 + .5)).toFixed(1));
  let txt = '';
  if (!nie) {
    txt = oblu ? `<path id="${id}a" d="M27 60a33 33 0 0 1 66 0" fill="none" stroke="none"/><text ${T} font-size="${fs(x.hore, 10.5, 98)}" letter-spacing="1.2"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${esc(x.hore)}</textPath></text>
        <path id="${id}b" d="M20 60a40 40 0 0 0 80 0" fill="none" stroke="none"/><text ${T} font-size="${fs(x.dole, 9.5, 110)}" letter-spacing="1.4"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${esc(x.dole)}</textPath></text>`
      : `<text x="60" y="${tv === 'stit' ? 38 : 36}" text-anchor="middle" ${T} font-size="${fs(x.hore, 9.5, 66)}" letter-spacing=".8">${esc(x.hore)}</text><text x="60" y="${tv === 'stit' ? 93 : 94}" text-anchor="middle" ${T} font-size="${fs(x.dole, 9, 60)}" letter-spacing=".8">${esc(x.dole)}</text>`;
  }
  const stred = !nie && x.cislo ? `<text x="60" y="${oblu ? 72 : 73}" text-anchor="middle" ${T} font-weight="900" font-size="${x.cislo.length > 3 ? 21 : x.cislo.length > 2 ? 26 : 32}">${x.cislo}</text>`
    : `<g transform="translate(39 ${oblu ? 39 : 40}) scale(1.75)" stroke-width="2.1">${nie ? IKN.zamok.replace(/fill="[^"]*"/g, 'fill="none"') : ikPec(x.ik)}</g>`;
  return `<svg class="pec-svg pi-${nie ? 'nie' : x.f}" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round" transform="rotate(${nie ? 0 : x.rot} 60 60)">${OBR[tv]}${txt}${stred}</g></svg>`;
}
const pasStav = o => !st.odznaky.includes(o.id) ? 'nie' : st.vybrate.includes(o.id) ? 'ma' : 'cerstva';
// jedna pečiatka v pase (čerstvá je tlačidlo: ťuknutím sa vyzdvihnú 2 hviezdičky)
function pasPolozka(o) {
  const s = pasStav(o), v = s === 'cerstva', tag = v ? 'button' : 'div';
  return `<${tag} class="odznak pas-pol ${s}${v ? ' na-vyber' : ''}"${v ? ` data-vyber="${o.id}" aria-label="Vyzdvihnúť 2 hviezdičky za pečiatku ${esc(o.n)}"` : ''}>
    <span class="pas-pec">${peciatka(o, s)}${v ? `<span class="cena plus2">${ikn('hviezda')}+2</span>` : ''}</span><b>${esc(o.n)}</b><small>${esc(o.p)}</small></${tag}>`;
}
// stránka Pas objaviteľa (pohľad 'odznaky'): každá skupina je jedna strana pasu, najprv získané, ostatné sa rozbalia
function zbierkaOdznakov() {
  const vsetky = odznakyVek(), ma = vsetky.filter(o => st.odznaky.includes(o.id)).length, k = nevybrate();
  const poradie = { cerstva: 0, ma: 1, nie: 2 };
  return `<div class="hra-top pas-top"><button class="btn kruh dve" data-go="ja" aria-label="Späť">${ikn('spat')}</button><h1 class="n0 hra-nazov">Pas objaviteľa</h1><span class="st cis">${ikn('odznak')}${ma} z ${vsetky.length}</span></div>
    ${k ? `<p class="vyber-tip pas-tip">${ikn('hviezda')}<span>Ťukni na čerstvú pečiatku a vyzdvihni si ${k * 2} ${k * 2 < 5 ? 'hviezdičky' : 'hviezdičiek'}.</span></p>` : ''}
    ${[...new Set(vsetky.map(o => o.g))].map(g => {
      const zoz = vsetky.filter(o => o.g === g).map((o, i) => [o, i]).sort((a, b) => poradie[pasStav(a[0])] - poradie[pasStav(b[0])] || a[1] - b[1]).map(x => x[0]);
      const n = Math.max(6, Math.ceil(zoz.filter(o => pasStav(o) !== 'nie').length / 3) * 3 + 3), hore = zoz.slice(0, n), viac = zoz.slice(n);
      return `<section class="pas-str"><div class="pas-nh"><h2 class="n1">${esc(g)}</h2><span class="dop cis">${zoz.filter(o => st.odznaky.includes(o.id)).length} z ${zoz.length}</span></div>
        <div class="odznaky pas-grid">${hore.map(pasPolozka).join('')}</div>
        ${viac.length ? `<details class="pas-viac"><summary>Ďalších ${viac.length}${ikn('dole')}</summary><div class="odznaky pas-grid">${viac.map(pasPolozka).join('')}</div></details>` : ''}</section>`;
    }).join('')}`;
}
// blok Pasu pre kartu Ja: obal pasu, počet a posledné pečiatky; otvorí celý Pas
function pasKarta() {
  const k = nevybrate(), vsetky = odznakyVek(), ma = vsetky.filter(o => st.odznaky.includes(o.id)).length;
  const posledne = st.odznaky.map(id => vsetky.find(o => o.id === id)).filter(Boolean).slice(-4).reverse();
  return `<button class="karta odznaky-karta pas-karta${k ? ' novinka' : ''}" data-go="odznaky"><span class="zal">Pas objaviteľa</span>
    <span class="pas-obal" aria-hidden="true"><svg viewBox="0 0 64 80"><g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><rect x="6" y="4" width="52" height="72" rx="7" fill="var(--violet)"/><path d="M14 4v72" stroke="var(--violet-d)" stroke-width="2"/><circle cx="34" cy="34" r="13" fill="none" stroke="var(--sun)" stroke-width="2.6"/><path d="M21 34h26M34 21c-6 8-6 18 0 26M34 21c6 8 6 18 0 26" fill="none" stroke="var(--sun)" stroke-width="2"/><path d="M24 58h20" stroke="var(--sun)" stroke-width="2.6"/></g></svg></span>
    <span class="ok-info"><b class="n1">${ma} z ${vsetky.length} pečiatok</b>
      <span class="posledne pas-posl">${posledne.map(o => peciatka(o, 'ma')).join('') || '<small>Prvú pečiatku dostaneš za prvú tému.</small>'}</span>
      ${k ? `<span class="cena">${ikn('hviezda')}+${k * 2} na vyzdvihnutie</span>` : ''}</span>${ikn('sipka', 'pas-sip')}</button>`;
}
// v profile: Pas objaviteľa a odmeny pre postavičku (Ja môže volať aj samotné pasKarta())
function kartaOdznakov() {
  return `${pasKarta()}<section class="sec"><h2 class="h2">Odmeny pre postavičku <span class="pocet">${ODMENY.filter(x => x.cena <= st.body).length} z ${ODMENY.length}</span></h2>${kartaDalsiaOdmena()}</section>`;
}
/* Stredná oslava: nová pečiatka dopadne na list pasu, žlté lúče, jedno tlačidlo. Ak príde naraz viac odznakov, ukáže sa prvý a ostatné jedným riadkom. */
function oslavaOdznaku(nove) {
  if (!nove.length) return;
  Oslavy.pridaj(() => {
    const o = nove[0], ini = nove.slice(1), mozno = !st.flow && !st.hra && !st.auto, el = document.createElement('div');
    el.className = 'os-stredna'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Nový odznak: ' + o.n);
    el.innerHTML = `<svg class="osr-luce" viewBox="0 0 360 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>${Array.from({ length: 14 }, (_, i) => { const a = i * 360 / 14 * Math.PI / 180, b = (i * 360 / 14 + 12) * Math.PI / 180; return `<path d="M180 190L${(180 + 600 * Math.cos(a)).toFixed(0)} ${(190 + 600 * Math.sin(a)).toFixed(0)}L${(180 + 600 * Math.cos(b)).toFixed(0)} ${(190 + 600 * Math.sin(b)).toFixed(0)}Z"/>`; }).join('')}</g></svg>
      <div class="osr-obsah">
        <div class="osr-list"><span class="pec osr-stitok">Nový odznak</span><span class="osr-pec">${peciatka(o, 'ma')}</span></div>
        <span class="osr-mud">${mudra('oslava')}</span>
        <section class="karta osr-karta"><h2 class="n0">${esc(o.n)}!</h2><p class="tx">${esc(o.p)}: hotovo. Pečiatka je v tvojom pase.</p>
          ${ini.length ? `<p class="osr-ini">A ešte ${ini.length === 1 ? 'jedna nová pečiatka' : ini.length + (ini.length < 5 ? ' nové pečiatky' : ' nových pečiatok')}: ${ini.map(x => esc(x.n)).join(', ')}.</p>` : ''}
          <span class="cena osr-cena">${ikn('hviezda')}+${nove.length * 2} čaká v pase</span>
          ${mozno ? `<button class="btn wide" data-osr="pas">Do pasu${ikn('sipka', 'za')}</button><button class="btn wide dve" data-osr="zavri">Neskôr</button>` : '<button class="btn wide" data-osr="zavri">Super!</button>'}</section></div>`;
    document.body.appendChild(el);
    Zvuk.play('whoosh'); setTimeout(() => { Zvuk.play('dopad1'); vibruj(30); el.classList.add('dopadla'); }, 520); setTimeout(() => Zvuk.play('star'), 760);
    const kl = e => { if (e.key === 'Escape') zavri(); };
    const zavri = () => { document.removeEventListener('keydown', kl); el.classList.add('pryc'); setTimeout(() => { el.remove(); Oslavy.dalsia(); }, 300); };
    document.addEventListener('keydown', kl);
    el.addEventListener('click', e => {
      e.stopPropagation();
      const b = e.target.closest('[data-osr]'); if (!b) return;
      Zvuk.play('tap'); zavri();
      if (b.dataset.osr === 'pas') go('odznaky');
    });
    const b = el.querySelector('[data-osr]'); if (b && b.focus) b.focus({ preventScroll: true });
  });
}
