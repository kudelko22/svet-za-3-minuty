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
function oznamOdznaky(nove) {
  nove.forEach((o, i) => setTimeout(() => {
    toast(`Nový odznak: ${o.n}`); Zvuk.play('star'); FX.burst(innerWidth / 2, innerHeight / 3, 26, ['star', 'dot']);
  }, i * 1300));
}
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
      <div><small class="lbl-mala">Ďalšia odmena</small><b>Ešte ${o.cena - st.body} ${ii(STAR())} a máš ${NAZVY_ODMIEN[o.kluc]}!</b>
      <div class="bar" style="--c:#FFC233"><i style="width:${pct}%"></i></div></div></section>`;
}
function odmenyHtml(f) {
  const o = f.noveOdznaky || [], r = f.noveOdmeny || [], h = f.noveHry || [];
  if (!o.length && !r.length && !h.length) return '';
  return `<div class="nove-odmeny">
      ${o.map((x, i) => `<div class="odmena-karta" style="--d:${1.9 + i * .25}s"><span class="medaila">${ikOdznaku(x)}</span><div><b>Nový odznak!</b><span>${esc(x.n)}</span></div></div>`).join('')}
      ${r.map((x, i) => `<div class="odmena-karta" style="--d:${1.9 + (o.length + i) * .25}s"><span class="kruh-av mini-av" style="--bg:${st.avatar.pozadie}">${postavicka({ ...st.avatar, [x.k]: x.v })}</span><div><b>Odomknuté!</b><span>Máš ${NAZVY_ODMIEN[x.kluc]} pre postavičku</span></div></div>`).join('')}
      ${h.map((x, i) => `<div class="odmena-karta" style="--d:${1.9 + (o.length + r.length + i) * .25}s"><span class="hra-mini" style="--c:${x.c}">${OBR_HRY[x.id]}</span><div><b>Nová hra!</b><span>${esc(x.n)}</span></div></div>`).join('')}
      ${r.length ? `<button class="btn wide" data-upravit="${r[0].k}">${ii(IK.iskra)} Obliecť postavičku</button>` : ''}
      ${h.length ? `<button class="btn wide blue" data-hra="${h[0].id}">Hrať: ${esc(h[0].n)}</button>` : ''}</div>`;
}
// za každý získaný odznak si dieťa ťuknutím vyzdvihne 2 hviezdičky (body); dve hviezdy priletia do hlavičky
function vyberOdznak(id, el) {
  if (!st.odznaky.includes(id) || st.vybrate.includes(id)) return;
  st.vybrate = [...st.vybrate, id]; S.set('vybrate', st.vybrate);
  st.body += 2; S.set('body', st.body);
  el.classList.remove('na-vyber'); el.removeAttribute('data-vyber');
  const p = el.querySelector('.plus2'); if (p) p.remove();
  const zost = odznakyVek().filter(o => st.odznaky.includes(o.id) && !st.vybrate.includes(o.id)).length, tip = document.querySelector('.vyber-tip');
  document.getElementById('nav-ja').classList.toggle('novinka', zost > 0);
  if (tip) { if (zost) tip.innerHTML = `${ii(IK.iskra)} Ťukni na žiariace odznaky a vyzdvihni si ${zost * 2} ${ii(STAR())}`; else tip.remove(); }
  const [x, y] = stred(el), ciel = document.getElementById('star-ico'), [cx, cy] = ciel ? stred(ciel) : [innerWidth - 40, 30];
  el.classList.add('prevzaty'); Zvuk.play('cink'); vibruj([20, 40, 20]);
  for (const [trieda, text, dlzka] of [['vlna', '', 800], ['plus-velke', '+2', 1200]]) {
    const e = document.createElement('span'); e.className = trieda; e.textContent = text;
    e.style.left = x + 'px'; e.style.top = y + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), dlzka);
  }
  FX.burst(x, y, 24, ['star', 'dot'], 8);
  [0, 1].forEach(i => setTimeout(() => letHviezdu(x, y, cx, cy, i, () => {
    Zvuk.play(i ? 'dopad2' : 'dopad1'); FX.burst(cx, cy, 10, ['star', 'dot'], 4);
    const b = document.getElementById('body'), s = document.getElementById('stars');
    if (b) b.textContent = st.body - 1 + i;
    if (s) { s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
    if (i) { const nove = noveOdznaky(); oznamOdznaky(nove); if (nove.length && st.view === 'odznaky') setTimeout(render, 1500); }
  }), 250 + i * 260));
}
// hviezdička letí z odznaku do hlavičky po oblúku, točí sa a nechá za sebou iskry
function letHviezdu(x, y, cx, cy, i, hotovo) {
  const h = document.createElement('span'); h.className = 'leti'; h.innerHTML = STAR();
  h.style.left = x + 'px'; h.style.top = y + 'px'; document.body.appendChild(h);
  if (!h.animate) { h.remove(); hotovo(); return; }
  const dx = cx - x, dy = cy - y, bok = i ? -70 : 70;
  const a = h.animate([
    { transform: 'translate(0, 0) scale(.3) rotate(0deg)', opacity: 0 },
    { transform: `translate(${bok}px, -80px) scale(1.7) rotate(160deg)`, opacity: 1, offset: .3 },
    { transform: `translate(${dx * .55 + bok * .6}px, ${dy * .55 - 60}px) scale(1.2) rotate(300deg)`, offset: .65 },
    { transform: `translate(${dx}px, ${dy}px) scale(.55) rotate(420deg)`, opacity: 1 },
  ], { duration: 950, easing: 'cubic-bezier(.45, 0, .55, 1)' });
  const stopa = setInterval(() => { const q = h.getBoundingClientRect(); FX.burst(q.left + q.width / 2, q.top + q.height / 2, 2, ['star', 'dot'], 1.5); }, 60);
  a.onfinish = () => { clearInterval(stopa); h.remove(); hotovo(); };
}
// odznaky pre vek dieťaťa (Majster kategórie len pre jeho kategórie)
const odznakyVek = () => ODZNAKY.filter(o => !o.vek || o.vek === st.vek);
// odznaky v profile len ako jedna karta; celá zbierka sa otvorí ťuknutím
const nevybrate = () => st.dietaId ? odznakyVek().filter(o => st.odznaky.includes(o.id) && !st.vybrate.includes(o.id)).length : 0;
function kartaOdznakov() {
  const k = nevybrate();
  const posledne = st.odznaky.slice(-5).reverse().map(id => odznakyVek().find(o => o.id === id)).filter(Boolean);
  return `<button class="card odznaky-karta${k ? ' novinka' : ''}" data-go="odznaky">${k ? '<span class="nov-stitok">Novinka!</span>' : ''}<span class="medaila velka">${IK.medaila}</span>
      <span class="ok-info"><b>Moje odznaky</b><small>${odznakyVek().filter(o => st.odznaky.includes(o.id)).length} z ${odznakyVek().length} · ťukni a pozri všetky</small>${(k => k ? `<span class="chip tmavy" style="--c:#FFD23F">+${k * 2} ${ii(STAR())} na vyzdvihnutie</span>` : '')(odznakyVek().filter(o => st.odznaky.includes(o.id) && !st.vybrate.includes(o.id)).length)}
      <span class="posledne">${posledne.map(o => `<span class="medaila mala">${ikOdznaku(o)}</span>`).join('') || '<small>Prvý odznak dostaneš za prvú tému.</small>'}</span></span><span class="sipka">›</span></button>
    <section class="sec"><h2 class="h2" style="--hc:#16BFAE">Odmeny pre postavičku <span class="pocet">${ODMENY.filter(x => x.cena <= st.body).length} z ${ODMENY.length}</span></h2>${kartaDalsiaOdmena()}</section>`;
}
function zbierkaOdznakov() {
  const ma = id => st.odznaky.includes(id);
  return `<div class="hra-top"><button class="ib" data-go="ja" aria-label="Späť">${IKO.zavriet}</button><h1 class="h1 hra-nazov">Odznaky</h1><span class="chip" style="--c:#FFC233">${odznakyVek().filter(o => ma(o.id)).length} z ${odznakyVek().length}</span></div>
    ${(k => k ? `<p class="vyber-tip">${ii(IK.iskra)} Ťukni na žiariace odznaky a vyzdvihni si ${k * 2} ${ii(STAR())}</p>` : '')(odznakyVek().filter(o => ma(o.id) && !st.vybrate.includes(o.id)).length)}
    ${[...new Set(odznakyVek().map(o => o.g))].map(g => { const zoz = odznakyVek().filter(o => o.g === g); return `<section class="sec"><h2 class="h2" style="--hc:#FFC233">${g} <span class="pocet">${zoz.filter(o => ma(o.id)).length} z ${zoz.length}</span></h2>
      <div class="odznaky">${zoz.map(o => { const m = ma(o.id), v = m && !st.vybrate.includes(o.id), tag = v ? 'button' : 'div';
        return `<${tag} class="odznak${m ? ' ma' : ''}${v ? ' na-vyber' : ''}"${v ? ` data-vyber="${o.id}" aria-label="Vyzdvihnúť 2 hviezdičky za odznak ${esc(o.n)}"` : ''}><span class="medaila">${m ? ikOdznaku(o) : IK.zamok}</span><b>${esc(o.n)}</b><small>${esc(o.p)}</small>${v ? `<span class="plus2">+2 ${STAR()}</span>` : ''}</${tag}>`; }).join('')}</div></section>`; }).join('')}`;
}

